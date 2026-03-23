import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { sql } from '../../../lib/db';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { targetUrl, alias } = body;

    if (!targetUrl || typeof targetUrl !== 'string') {
      return NextResponse.json({ error: 'targetUrl is required' }, { status: 400 });
    }

    if (alias) {
      if (typeof alias !== 'string' || alias.length > 50) {
        return NextResponse.json({ error: 'Alias must be a string up to 50 characters' }, { status: 400 });
      }
      if (!/^[A-Za-z0-9\-_]+$/.test(alias)) {
        return NextResponse.json({ error: 'Alias can only contain letters, numbers, hyphens, and underscores' }, { status: 400 });
      }
    }

    // Generate or use alias
    const finalAlias = alias ? alias.trim() : crypto.randomBytes(3).toString('hex');

    // Check if alias already exists
    const existing = await sql`SELECT 1 FROM urls WHERE alias = ${finalAlias}`;
    if (existing.length > 0) {
      return NextResponse.json({ error: 'Alias already in use' }, { status: 409 });
    }

    // Insert into DB
    await sql`
      INSERT INTO urls (alias, target_url)
      VALUES (${finalAlias}, ${targetUrl})
    `;

    // Construct the short url dynamically
    const urlPattern = new URL(req.url);
    const shortUrl = `${urlPattern.protocol}//${urlPattern.host}/${finalAlias}`;

    return NextResponse.json({ shortUrl, alias: finalAlias, targetUrl }, { status: 201 });
  } catch (error) {
    console.error('Error in /api/shorten:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
