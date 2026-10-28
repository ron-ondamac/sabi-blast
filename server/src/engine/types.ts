export interface RockType {
  id?: number;
  name: string;
  specificGravity: number;
  ucsMpa: number;
  notes?: string;
  source?: string;
  isGeneric?: boolean;
}

export interface ExplosiveType {
  id?: number;
  name: string;
  density: number;
  waterResistant: boolean;
  vodMs?: number;
  defaultCartridgeDiameterMm?: number;
  relativeWeightStrength?: number;
  source?: string;
  isGeneric?: boolean;
}

export type OpeningType = 'tunnel' | 'stope' | 'shaft';
export type BlastType = 'underground' | 'bench';
export type Environment = 'wet' | 'dry';
export type HoleRole = 'cut' | 'reliever' | 'lifter' | 'perimeter' | 'bench';

export interface RoundInput {
  blastType: BlastType;
  openingType: OpeningType;
  widthM: number;
  heightOrDiameterM: number;
  advanceRequiredM: number;
  desiredFragmentationMm: number;
  environment: Environment;
  rockType: RockType;
  availableExplosives: ExplosiveType[];
  burdenM?: number;
  spacingM?: number;
}

export interface DrillHole {
  role: HoleRole;
  x: number;
  y: number;
  angleDeg: number;
  depthM: number;
  diameterMm: number;
  chargeKg: number;
}

export interface RoundDesignResult {
  blastType: BlastType;
  openingType: OpeningType;
  explosiveRecommendation: {
    explosive: ExplosiveType;
    reasons: string[];
    excluded: { explosive: ExplosiveType; reason: string }[];
  };
  holeDepthM: number;
  holeDiameterMm: number;
  cutEfficiency: number;
  faceAreaM2: number;
  rockVolumeM3: number;
  powderFactorKgM3: number;
  targetFragmentationMm: number;
  totalExplosiveKg: number;
  holes: DrillHole[];
  blastRadiusM: number;
  achievedAdvanceM: number;
  advanceEfficiencyPct: number;
  warnings: string[];
  burdenM?: number;
  spacingM?: number;
  safetyMeasures?: any;
}
