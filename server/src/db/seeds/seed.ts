import fs from 'fs';
import path from 'path';
import { pool } from '../pool';

async function seed() {
  const dir = __dirname;
  const files = fs.readdirSync(dir).filter((f) => f.endsWith('.sql')).sort();
  for (const f of files) {
    const sql = fs.readFileSync(path.join(dir, f), 'utf-8');
    console.log('Seeding ' + f + '...');
    await pool.query(sql);
  }
  console.log('Seed complete.');
  await pool.end();
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
