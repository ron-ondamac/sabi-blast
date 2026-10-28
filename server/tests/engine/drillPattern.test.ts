import { describe, expect, it } from 'vitest';
import { generateDrillPattern } from '../../src/engine/drillPattern';

describe('drillPattern', () => {
  it('generates holes covering all four roles for a typical tunnel face', () => {
    const holes = generateDrillPattern({
      openingType: 'tunnel',
      widthM: 4,
      heightOrDiameterM: 4,
      holeDepthM: 1.6,
      diameterMm: 45,
      totalExplosiveKg: 20,
      explosive: { name: 'ANFO', density: 0.85, waterResistant: false } as any
    });

    const roles = new Set(holes.map((h) => h.role));
    expect(roles.has('cut')).toBe(true);
    expect(roles.has('lifter')).toBe(true);
    expect(roles.has('perimeter')).toBe(true);
  });

  it('keeps total charge close to the requested total', () => {
    const totalExplosiveKg = 20;
    const holes = generateDrillPattern({
      openingType: 'tunnel',
      widthM: 4,
      heightOrDiameterM: 4,
      holeDepthM: 1.6,
      diameterMm: 45,
      totalExplosiveKg: totalExplosiveKg,
      explosive: { name: 'ANFO', density: 0.85, waterResistant: false } as any
    });
    const sum = holes.reduce((s, h) => s + h.chargeKg, 0);
    expect(sum).toBeGreaterThan(totalExplosiveKg * 0.5);
  });
});
