import { BlastType, ExplosiveType, RockType } from './types';

export const CUT_EFFICIENCY = 0.92; // 0.90-0.95 typical for a good burn/wedge cut

/** hole_depth = advance_required / cut_efficiency */
export function calcHoleDepth(advanceRequiredM: number, cutEfficiency: number = CUT_EFFICIENCY) {
  return advanceRequiredM / cutEfficiency;
}

export function calcAchievedAdvance(holeDepthM: number, cutEfficiency: number = CUT_EFFICIENCY) {
  return holeDepthM * cutEfficiency;
}

/** Standard production-hole diameters for underground and surface bench blasts. */
export function calcHoleDiameterMm(blastType: BlastType) {
  return blastType === 'bench' ? 150 : 38;
}

/**
 * Simplified breakage-radius estimate: scales with hole diameter and
 * explosive energy (density x RWS), inversely with rock strength
 * (UCS). Educational approximation, not a certified formula.
 */
export function calcBlastRadiusM(diameterMm: number, explosive: ExplosiveType, rock: RockType) {
  const rws = explosive.relativeWeightStrength || 100;
  const energyFactor = (explosive.density * rws) / 100;
  const strengthFactor = Math.max(rock.ucsMpa, 10) / 100;
  const radius = 0.012 * diameterMm * Math.sqrt(energyFactor / strengthFactor);
  return Math.round(radius * 100) / 100;
}
