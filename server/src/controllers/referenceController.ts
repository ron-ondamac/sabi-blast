import { Request, Response } from 'express';
import { pool } from '../db/pool';

export async function listRockTypes(req: Request, res: Response) {
  const result = await pool.query('SELECT * FROM rock_types ORDER BY name');
  res.json(result.rows.map(mapRockType));
}

export async function listExplosiveTypes(req: Request, res: Response) {
  const result = await pool.query('SELECT * FROM explosive_types ORDER BY name');
  res.json(result.rows.map(mapExplosiveType));
}

export function mapRockType(row: any) {
  return {
    id: row.id,
    name: row.name,
    specificGravity: Number(row.specific_gravity),
    ucsMpa: Number(row.ucs_mpa),
    notes: row.notes,
    source: row.source,
    isGeneric: row.is_generic
  };
}

export function mapExplosiveType(row: any) {
  return {
    id: row.id,
    name: row.name,
    density: Number(row.density),
    waterResistant: row.water_resistant,
    vodMs: row.vod_m_s ? Number(row.vod_m_s) : undefined,
    defaultCartridgeDiameterMm: row.default_cartridge_diameter_mm ? Number(row.default_cartridge_diameter_mm) : undefined,
    relativeWeightStrength: row.relative_weight_strength ? Number(row.relative_weight_strength) : undefined,
    source: row.source,
    isGeneric: row.is_generic
  };
}
