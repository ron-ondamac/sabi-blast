import { pool } from '../pool';

export async function getAllRockTypes() {
  const result = await pool.query('SELECT * FROM rock_types ORDER BY name');
  return result.rows;
}

export async function getRockTypeById(id: number) {
  const result = await pool.query('SELECT * FROM rock_types WHERE id = $1', [id]);
  return result.rows[0];
}
