import { DrillHole, ExplosiveType, HoleRole, OpeningType } from './types';

interface PatternParams {
  openingType: OpeningType;
  widthM: number;
  heightOrDiameterM: number;
  holeDepthM: number;
  diameterMm: number;
  totalExplosiveKg: number;
  explosive: ExplosiveType;
}

const ROLE_WEIGHT: Record<HoleRole, number> = { cut: 1.4, reliever: 1.0, lifter: 1.2, perimeter: 0.6, bench: 1.0 };

interface BenchPatternParams {
  widthM: number;
  lengthM: number;
  holeDepthM: number;
  diameterMm: number;
  totalExplosiveKg: number;
  burdenM: number;
  spacingM: number;
}

/** Generate a regular bench pattern in plan view. */
export function generateBenchPattern(params: BenchPatternParams): DrillHole[] {
  const columns = Math.max(1, Math.floor(params.widthM / params.spacingM));
  const rows = Math.max(1, Math.floor(params.lengthM / params.burdenM));
  const usedWidth = (columns - 1) * params.spacingM;
  const usedLength = (rows - 1) * params.burdenM;
  const startX = (params.widthM - usedWidth) / 2;
  const startY = (params.lengthM - usedLength) / 2;
  const holes: DrillHole[] = [];

  for (let row = 0; row < rows; row++) {
    for (let column = 0; column < columns; column++) {
      holes.push({
        role: 'bench',
        x: startX + column * params.spacingM,
        y: startY + row * params.burdenM,
        angleDeg: 0,
        depthM: params.holeDepthM,
        diameterMm: params.diameterMm,
        chargeKg: 0
      });
    }
  }

  distributeCharge(holes, params.totalExplosiveKg);
  return holes;
}

/**
 * Burden/spacing rule of thumb: burden (m) ~= 0.012 x diameter (mm).
 * Perimeter (contour) holes use tighter spacing (x0.8) for wall
 * control ("smooth wall" blasting). Small headings use a wedge (V)
 * cut; larger ones use a burn cut with an uncharged large-diameter
 * relief hole.
 */
export function generateDrillPattern(params: PatternParams): DrillHole[] {
  const widthM = params.widthM;
  const heightOrDiameterM = params.heightOrDiameterM;
  const holeDepthM = params.holeDepthM;
  const diameterMm = params.diameterMm;
  const totalExplosiveKg = params.totalExplosiveKg;

  const burden = Math.max(0.012 * diameterMm, 0.3);
  const spacing = burden * 1.2;
  const perimeterSpacing = spacing * 0.8;

  const holes: DrillHole[] = [];
  const isSmall = widthM * heightOrDiameterM < 12;

  const cx = widthM / 2;
  const cy = heightOrDiameterM / 2;

  if (isSmall) {
    const offsets = [
      [-0.4, -0.3],
      [0.4, -0.3],
      [-0.4, 0.3],
      [0.4, 0.3]
    ];
    offsets.forEach((offset, i) => {
      holes.push({
        role: 'cut',
        x: cx + offset[0],
        y: cy + offset[1],
        angleDeg: i % 2 === 0 ? 70 : -70,
        depthM: holeDepthM,
        diameterMm: diameterMm,
        chargeKg: 0
      });
    });
  } else {
    holes.push({ role: 'cut', x: cx, y: cy, angleDeg: 0, depthM: holeDepthM, diameterMm: diameterMm, chargeKg: 0 });
    const ring = [
      [-0.35, 0],
      [0.35, 0],
      [0, -0.35],
      [0, 0.35]
    ];
    ring.forEach((offset) => {
      holes.push({ role: 'cut', x: cx + offset[0], y: cy + offset[1], angleDeg: 0, depthM: holeDepthM, diameterMm: diameterMm, chargeKg: 0 });
    });
  }

  const lifterCount = Math.max(3, Math.round(widthM / spacing) + 1);
  for (let i = 0; i < lifterCount; i++) {
    const x = (widthM / (lifterCount - 1 || 1)) * i;
    holes.push({ role: 'lifter', x: x, y: heightOrDiameterM * 0.02, angleDeg: 5, depthM: holeDepthM, diameterMm: diameterMm, chargeKg: 0 });
  }

  const perimeter = 2 * (widthM + heightOrDiameterM);
  const perimeterCount = Math.max(6, Math.round(perimeter / perimeterSpacing));
  for (let i = 0; i < perimeterCount; i++) {
    const t = i / perimeterCount;
    const point = pointOnRectPerimeter(t, widthM, heightOrDiameterM);
    if (point.y < heightOrDiameterM * 0.05) continue;
    holes.push({ role: 'perimeter', x: point.x, y: point.y, angleDeg: 3, depthM: holeDepthM, diameterMm: diameterMm, chargeKg: 0 });
  }

  const cols = Math.max(2, Math.floor(widthM / spacing));
  const rows = Math.max(2, Math.floor(heightOrDiameterM / spacing));
  for (let r = 1; r < rows; r++) {
    for (let c = 1; c < cols; c++) {
      const x = (widthM / cols) * c;
      const y = (heightOrDiameterM / rows) * r;
      const nearCut = Math.hypot(x - cx, y - cy) < burden * 1.5;
      const nearEdge = x < spacing || x > widthM - spacing || y < spacing || y > heightOrDiameterM - spacing;
      if (!nearCut && !nearEdge) {
        holes.push({ role: 'reliever', x: x, y: y, angleDeg: 0, depthM: holeDepthM, diameterMm: diameterMm, chargeKg: 0 });
      }
    }
  }

  distributeCharge(holes, totalExplosiveKg, isSmall ? undefined : holes[0]);

  return holes;
}

function pointOnRectPerimeter(t: number, w: number, h: number) {
  const perimeter = 2 * (w + h);
  let d = t * perimeter;
  if (d <= w) return { x: d, y: 0 };
  d -= w;
  if (d <= h) return { x: w, y: d };
  d -= h;
  if (d <= w) return { x: w - d, y: h };
  d -= w;
  return { x: 0, y: h - d };
}

function distributeCharge(holes: DrillHole[], totalKg: number, unchargedReliefHole?: DrillHole) {
  const totalWeight = holes.reduce(
    (sum, h) => sum + (h === unchargedReliefHole ? 0 : ROLE_WEIGHT[h.role]),
    0
  );
  const unit = totalWeight > 0 ? totalKg / totalWeight : 0;
  holes.forEach((h) => {
    h.chargeKg = h === unchargedReliefHole ? 0 : Math.round(unit * ROLE_WEIGHT[h.role] * 100) / 100;
  });
}
