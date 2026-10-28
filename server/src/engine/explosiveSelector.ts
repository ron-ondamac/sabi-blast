import { Environment, ExplosiveType, RockType } from './types';

export interface ExplosiveRecommendation {
  explosive: ExplosiveType;
  reasons: string[];
  excluded: { explosive: ExplosiveType; reason: string }[];
}

/**
 * Rule-based explosive selection.
 * Rule 1: wet holes exclude non-water-resistant products (e.g. ANFO).
 * Rule 2: among remaining candidates, hard rock (UCS >= 100 MPa)
 *         prefers the highest relative weight strength (RWS) product.
 * Rule 3: softer rock prefers the lowest-cost / lowest-RWS product,
 *         since it is cheaper and sufficient.
 */
export function selectExplosive(environment: Environment, rock: RockType, candidates: ExplosiveType[]): ExplosiveRecommendation {
  const excluded: { explosive: ExplosiveType; reason: string }[] = [];
  let pool = candidates;

  if (environment === 'wet') {
    const wetPool = pool.filter((e) => e.waterResistant);
    pool.filter((e) => !e.waterResistant).forEach((e) => {
      excluded.push({ explosive: e, reason: e.name + ' excluded -- not water-resistant and holes are wet' });
    });
    pool = wetPool;
  }

  if (pool.length === 0) {
    throw new Error('No suitable explosive found for the given conditions.');
  }

  const hardRock = rock.ucsMpa >= 100;
  const reasons: string[] = [];
  let chosen: ExplosiveType;

  if (hardRock) {
    chosen = [...pool].sort((a, b) => (b.relativeWeightStrength || 100) - (a.relativeWeightStrength || 100))[0];
    reasons.push('Rock UCS is ' + rock.ucsMpa + ' MPa (>=100 MPa is considered hard) -- selected the highest relative weight strength (RWS) product available.');
  } else {
    chosen = [...pool].sort((a, b) => (a.relativeWeightStrength || 100) - (b.relativeWeightStrength || 100))[0];
    reasons.push('Rock UCS is ' + rock.ucsMpa + ' MPa (moderate/soft) -- a lower-cost, lower-RWS product is sufficient.');
  }

  reasons.push('Environment: ' + environment + (environment === 'wet' ? ' -- restricted to water-resistant products.' : ' -- all generic products eligible.'));

  pool.filter((e) => e.name !== chosen.name).forEach((e) => {
    if (!excluded.find((x) => x.explosive.name === e.name)) {
      excluded.push({ explosive: e, reason: e.name + ' is viable but not selected -- ' + chosen.name + ' better matches the rock strength profile.' });
    }
  });

  return { explosive: chosen, reasons: reasons, excluded: excluded };
}
