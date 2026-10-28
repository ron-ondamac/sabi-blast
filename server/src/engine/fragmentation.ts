import { RockType } from './types';

/**
 * Simplified Kuz-Ram-style mean fragment size estimate, used for the
 * fragmentation estimate output and available for an optional
 * open-bench mode. Educational approximation only.
 */
export function estimateMeanFragmentSizeM(powderFactorKgM3: number, rock: RockType, rws: number = 100) {
  const rockFactor = (0.06 * rock.ucsMpa) / 10 + 6;
  const specificCharge = 1 / powderFactorKgM3;
  const x50 = (rockFactor * Math.pow(specificCharge, 0.8) * Math.pow(115 / rws, 19 / 30)) / 100;
  return Math.round(x50 * 1000) / 1000;
}

export function fragmentationLabel(x50M: number) {
  return Math.round(x50M * 1000) + ' mm';
}
