import { RoundInput } from "./types";

export interface SafetyMeasures {
  minimumSafeDistanceM: number;
  benchHeightM: number;
  maxChargePerDelayKg: number;
  stemmingLengthM: number;
  stemmingQualityLevel: string;
  throwDirection: string;
  blastSignsRequired: string[];
  personnelEvacuationDistanceM: number;
  warningDurationMin: number;
  preBlastPrecautions: string[];
  postBlastProcedures: string[];
  secondaryBlastingSafety: string[];
  explosiveStorageRequirements: string[];
  rockAndGeologyConsiderations: string[];
  backupBlastSafetyFeatures: string[];
}

export function calculateSafetyMeasures(
  input: RoundInput,
  totalExplosiveKg: number,
  holes: any[],
  explosiveVodMs?: number,
): SafetyMeasures {
  const holeDepthM = input.advanceRequiredM * 2.0;
  const minimumSafeDistanceM =
    20 +
    (input.availableExplosives[0]?.density || 1) *
      (input.availableExplosives[0]?.relativeWeightStrength || 100);
  const rockFactor = Math.max(0.7, 1.0 - (input.rockType.ucsMpa / 1000) * 0.3);
  const depthFactor = 1 + holeDepthM / 20;
  const minSafeDist = Math.round(
    (20 + (1 * 100) / 5) * rockFactor * depthFactor,
  );

  const baseHeight = holeDepthM * 2.0;
  const sizeFactor = Math.min(1.2, input.widthM / 4);
  const hardnessFactor = Math.max(0.9, input.rockType.ucsMpa / 100);
  const benchHeight = Math.max(
    1.5,
    Math.min(
      5.0,
      Math.round(baseHeight * sizeFactor * hardnessFactor * 10) / 10,
    ),
  );

  const maxChargePerDelay =
    Math.round((totalExplosiveKg / holes.length) * 100) / 100;
  const stemmingLength = 0.5 + ((holes[0]?.diameterMm || 50) / 1000) * 3;
  const stemmingQuality =
    stemmingLength >= 1.0 && stemmingLength <= 1.5
      ? "Good"
      : stemmingLength < 1.0
        ? "Fair"
        : stemmingLength > 1.5
          ? "Very Good"
          : "Poor";
  const throwDirection =
    input.openingType === "tunnel"
      ? "Forward - Towards open face"
      : input.openingType === "stope"
        ? "Upward - Rock falls into stope"
        : "Radial - Outward towards shaft wall";
  const selectedThrowDirection =
    input.blastType === "bench"
      ? "Forward - Towards the free face"
      : throwDirection;
  const signs = [
    "Blast Area Closed",
    "Stop Work Order",
    "Explosives Handling Permit Required",
  ];
  const personnelDist = Math.round(minSafeDist + 50);
  const warningDuration = 15;

  return {
    minimumSafeDistanceM: minSafeDist,
    benchHeightM: benchHeight,
    maxChargePerDelayKg: maxChargePerDelay,
    stemmingLengthM: stemmingLength,
    stemmingQualityLevel: stemmingQuality,
    throwDirection: selectedThrowDirection,
    blastSignsRequired: signs,
    personnelEvacuationDistanceM: personnelDist,
    warningDurationMin: warningDuration,
    preBlastPrecautions: [
      "All personnel must clear blast area",
      "Confirm blast area is secured",
      "Verify detonators are connected",
    ],
    postBlastProcedures: [
      "Wait full warning period",
      "Inspect blast area for misfires",
      "Clear debris before entry",
    ],
    secondaryBlastingSafety: [
      "Use non-electric initiation",
      "Ensure stemming is complete",
      "Verify personnel clear before detonation",
    ],
    explosiveStorageRequirements: [
      "Store in approved magazine",
      "Maintain 30m separation",
      "Keep away from heat sources",
    ],
    rockAndGeologyConsiderations: [
      "Rock UCS: " + input.rockType.ucsMpa + " MPa",
      "Rock type: " + input.rockType.name,
    ],
    backupBlastSafetyFeatures: [
      "Maintain fire watch",
      "Have secondary initiation system",
      "Ensure emergency access",
    ],
  };
}
