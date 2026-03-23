import { NextResponse } from 'next/server';
import { sql } from '../../lib/db';

// Await the params to be compliant with Next.js 15+ breaking changes
export async function GET(
  req: Request,
  { params }: { params: Promise<{ alias: string }> }
) {
  try {
    const resolvedParams = await params;
    const { alias } = resolvedParams;

    const result = await sql`
      SELECT target_url FROM urls WHERE alias = ${alias} LIMIT 1
    `;

    if (result.length > 0 && result[0].target_url) {
      return NextResponse.redirect(result[0].target_url, 302);
    }

    // If no match or malformed, return to root
    return NextResponse.redirect(new URL('/', req.url));
  } catch (error) {
    console.error('Error redirecting alias:', error);
    return NextResponse.redirect(new URL('/', req.url));
  }
}
