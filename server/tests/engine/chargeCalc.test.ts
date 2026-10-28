import { describe, expect, it } from 'vitest';
import { calcFaceAreaM2, calcPowderFactor, calcRockVolumeM3, calcTotalExplosiveKg } from '../../src/engine/chargeCalc';

describe('chargeCalc', () => {
  it('computes rectangular face area for a tunnel', () => {
    expect(calcFaceAreaM2('tunnel', 4, 4)).toBe(16);
  });

  it('computes circular face area for a shaft', () => {
    const area = calcFaceAreaM2('shaft', 4, 4);
    expect(area).toBeCloseTo(Math.PI * 4, 2);
  });

  it('increases powder factor with harder rock and finer fragmentation', () => {
    const hard = calcPowderFactor({ name: 'Granite', specificGravity: 2.7, ucsMpa: 150 } as any, 32);
    const soft = calcPowderFactor({ name: 'Sandstone', specificGravity: 2.3, ucsMpa: 60 } as any, 100);
    expect(hard).toBeGreaterThan(soft);
  });

  it('computes total explosive from powder factor and volume', () => {
    const volume = calcRockVolumeM3(16, 1.5);
    expect(calcTotalExplosiveKg(0.5, volume)).toBeCloseTo(12, 1);
  });
});
