import { Request, Response } from 'express';
import { pool } from '../db/pool';
import { designRound } from '../engine';
import { roundInputSchema } from '../validation/schemas';
import { mapExplosiveType, mapRockType } from './referenceController';

export async function designRoundHandler(req: Request, res: Response) {
  const parsed = roundInputSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: 'Invalid input', details: parsed.error.flatten() });
  }

  const input = parsed.data;

  const rockResult = await pool.query('SELECT * FROM rock_types WHERE id = $1', [input.rockTypeId]);
  if (rockResult.rows.length === 0) {
    return res.status(404).json({ error: 'Rock type not found' });
  }
  const rockType = mapRockType(rockResult.rows[0]);

  const explosivesResult = await pool.query('SELECT * FROM explosive_types');
  const availableExplosives = explosivesResult.rows.map(mapExplosiveType);

  try {
    const result = designRound({
      blastType: input.blastType,
      openingType: input.openingType,
      widthM: input.widthM,
      heightOrDiameterM: input.heightOrDiameterM,
      advanceRequiredM: input.advanceRequiredM,
      desiredFragmentationMm: input.desiredFragmentationMm,
      environment: input.environment,
      rockType: rockType,
      availableExplosives: availableExplosives,
      burdenM: input.burdenM,
      spacingM: input.spacingM
    });

    res.json(result);
  } catch (err: any) {
    res.status(422).json({ error: err.message });
  }
}
