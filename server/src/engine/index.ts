import { RoundDesignResult, RoundInput } from './types';
import { selectExplosive } from './explosiveSelector';
import { calcFaceAreaM2, calcPowderFactor, calcRockVolumeM3, calcTotalExplosiveKg } from './chargeCalc';
import { CUT_EFFICIENCY, calcAchievedAdvance, calcBlastRadiusM, calcHoleDepth, calcHoleDiameterMm } from './holeGeometry';
import { generateBenchPattern, generateDrillPattern } from './drillPattern';
import { calculateSafetyMeasures } from './safetyMeasures';

export function designRound(input: RoundInput): RoundDesignResult {
  const warnings: string[] = [];
  const explosiveRecommendation = selectExplosive(input.environment, input.rockType, input.availableExplosives);
  const explosive = explosiveRecommendation.explosive;

  const isBench = input.blastType === 'bench';
  const holeDepthM = isBench ? input.advanceRequiredM : calcHoleDepth(input.advanceRequiredM, CUT_EFFICIENCY);
  const achievedAdvanceM = isBench ? holeDepthM : calcAchievedAdvance(holeDepthM, CUT_EFFICIENCY);
  const advanceEfficiencyPct = Math.round((achievedAdvanceM / input.advanceRequiredM) * 10000) / 100;

  const diameterMm = calcHoleDiameterMm(input.blastType);
  const faceAreaM2 = calcFaceAreaM2(input.openingType, input.widthM, input.heightOrDiameterM);
  const rockVolumeM3 = calcRockVolumeM3(faceAreaM2, input.advanceRequiredM);
  const powderFactorKgM3 = calcPowderFactor(input.rockType, input.desiredFragmentationMm);
  const totalExplosiveKg = calcTotalExplosiveKg(powderFactorKgM3, rockVolumeM3);

  const holes = isBench ? generateBenchPattern({
    widthM: input.widthM,
    lengthM: input.heightOrDiameterM,
    holeDepthM: holeDepthM,
    diameterMm: diameterMm,
    totalExplosiveKg: totalExplosiveKg,
    burdenM: input.burdenM!,
    spacingM: input.spacingM!
  }) : generateDrillPattern({
    openingType: input.openingType,
    widthM: input.widthM,
    heightOrDiameterM: input.heightOrDiameterM,
    holeDepthM: holeDepthM,
    diameterMm: diameterMm,
    totalExplosiveKg: totalExplosiveKg,
    explosive: explosive
  });

  const blastRadiusM = calcBlastRadiusM(diameterMm, explosive, input.rockType);
  const safetyMeasures = calculateSafetyMeasures(input, totalExplosiveKg, holes, explosive.vodMs);

  if (diameterMm / 1000 > input.widthM * 0.15) {
    warnings.push('Hole diameter is large relative to opening width -- verify drilling equipment can achieve the required pattern spacing.');
  }
  const maxAdvance = input.openingType === 'tunnel' ? 2.0 : 1.3;
  if (isBench === false && input.advanceRequiredM > maxAdvance) {
    warnings.push('Requested advance of ' + input.advanceRequiredM + ' m exceeds the typical max for ' + input.openingType + ' (' + maxAdvance + ' m) -- consider splitting into multiple rounds.');
  }
  if (isBench === false && advanceEfficiencyPct < 85) {
    warnings.push('Round efficiency is below 85% -- cut geometry may be too conservative; consider a burn cut with a larger relief hole.');
  }

  return {
    blastType: input.blastType,
    openingType: input.openingType,
    explosiveRecommendation: explosiveRecommendation,
    holeDepthM: holeDepthM,
    holeDiameterMm: diameterMm,
    cutEfficiency: CUT_EFFICIENCY,
    faceAreaM2: faceAreaM2,
    rockVolumeM3: rockVolumeM3,
    powderFactorKgM3: powderFactorKgM3,
    targetFragmentationMm: input.desiredFragmentationMm,
    totalExplosiveKg: totalExplosiveKg,
    holes: holes,
    blastRadiusM: blastRadiusM,
    achievedAdvanceM: achievedAdvanceM,
    advanceEfficiencyPct: advanceEfficiencyPct,
    warnings: warnings,
    burdenM: input.burdenM,
    spacingM: input.spacingM,
    safetyMeasures: safetyMeasures
  };
}

export * from './types';
export { estimateMeanFragmentSizeM, fragmentationLabel } from './fragmentation';
