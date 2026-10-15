const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

const connectionString =
  process.env.DATABASE_URL ||
  'postgresql://postgres.kzptmbqkaufmizcrkcvg:ySHlGHPyNSxUBj04@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres';

async function runMigration() {
  console.log('Connecting to Supabase PostgreSQL pooler...');
  const client = new Client({
    connectionString,
    ssl: { rejectUnauthorized: false },
  });

  try {
    await client.connect();
    console.log('✓ Connected successfully to Supabase PostgreSQL!');

    const schemaPath = path.join(__dirname, '..', 'supabase', 'schema.sql');
    const sql = fs.readFileSync(schemaPath, 'utf8');

    console.log('Applying schema migrations from', schemaPath, '...');
    await client.query(sql);

    console.log('✓ Migration executed successfully!');
    
    // Verify tables
    const res = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name;
    `);
    console.log('Tables created in public schema:', res.rows.map(r => r.table_name));

    // Verify vehicles count
    const vehCount = await client.query('SELECT count(*) FROM vehicles;');
    console.log('Total vehicles seeded:', vehCount.rows[0].count);

    // Verify trips count
    const tripCount = await client.query('SELECT count(*) FROM trips;');
    console.log('Total trips seeded:', tripCount.rows[0].count);

  } catch (err) {
    console.error('Migration error:', err);
  } finally {
    await client.end();
  }
}

runMigration();
