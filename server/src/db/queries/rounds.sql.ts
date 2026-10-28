import { pool } from '../pool';

export async function insertRound(round: any) {
  const result = await pool.query(
    'INSERT INTO rounds (opening_type, width_m, height_or_diameter_m, advance_required_m, desired_fragmentation, environment, rock_type_id, recommended_explosive_id, total_explosive_kg, achieved_advance_m) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *',
    [
      round.openingType,
      round.widthM,
      round.heightOrDiameterM,
      round.advanceRequiredM,
      round.desiredFragmentationMm,
      round.environment,
      round.rockTypeId,
      round.recommendedExplosiveId,
      round.totalExplosiveKg,
      round.achievedAdvanceM
    ]
  );
  return result.rows[0];
}

export async function insertRoundHoles(roundId: number, holes: any[]) {
  for (const h of holes) {
    await pool.query(
      'INSERT INTO round_holes (round_id, role, position_x, position_y, angle_deg, depth_m, diameter_mm, charge_kg) VALUES ($1,$2,$3,$4,$5,$6,$7,$8)',
      [roundId, h.role, h.x, h.y, h.angleDeg, h.depthM, h.diameterMm, h.chargeKg]
    );
  }
}

export async function listRounds() {
  const result = await pool.query('SELECT * FROM rounds ORDER BY created_at DESC');
  return result.rows;
}
