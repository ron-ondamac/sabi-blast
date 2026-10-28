import { pool } from '../pool';

export async function getAllExplosiveTypes() {
  const result = await pool.query('SELECT * FROM explosive_types ORDER BY name');
  return result.rows;
}

export async function getExplosiveTypeById(id: number) {
  const result = await pool.query('SELECT * FROM explosive_types WHERE id = $1', [id]);
  return result.rows[0];
}
