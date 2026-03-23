import { neon } from '@neondatabase/serverless';

const sql = neon("postgresql://neondb_owner:npg_fgD7vhzxuKB8@ep-broad-glitter-amv23cal-pooler.c-5.us-east-1.aws.neon.tech/neondb?sslmode=require");

async function main() {
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS urls (
        id SERIAL PRIMARY KEY,
        alias VARCHAR(50) UNIQUE NOT NULL,
        target_url TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;
    console.log('Successfully ensured urls table exists.');
  } catch (error) {
    console.error('Error creating table:', error);
  }
}

main();
