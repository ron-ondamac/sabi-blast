import { OpeningType, RockType } from './types';

/** Cross-sectional face area, m2. Shaft treated as circular; tunnel/stope as rectangular. */
export function calcFaceAreaM2(openingType: OpeningType, widthM: number, heightOrDiameterM: number) {
  if (openingType === 'shaft') {
    const r = heightOrDiameterM / 2;
    return Math.PI * r * r;
  }
  return widthM * heightOrDiameterM;
}

/**
 * Powder factor (kg explosive / m3 rock), simplified educational
 * model: base 0.3 kg/m3 + UCS contribution. A smaller requested
 * fragment size increases the powder factor; a larger size reduces it.
 */
export function calcPowderFactor(rock: RockType, targetFragmentationMm: number) {
  const fragmentationAdjustment = Math.max(-0.15, Math.min(0.15, (34 - targetFragmentationMm) * 0.025));
  const base = 0.3 + (rock.ucsMpa / 100) * 0.4 + fragmentationAdjustment;
  return Math.max(0.2, Math.round(base * 100) / 100);
}

export function calcRockVolumeM3(faceAreaM2: number, advanceRequiredM: number) {
  return faceAreaM2 * advanceRequiredM;
}

export function calcTotalExplosiveKg(powderFactorKgM3: number, rockVolumeM3: number) {
  return Math.round(powderFactorKgM3 * rockVolumeM3 * 100) / 100;
}
