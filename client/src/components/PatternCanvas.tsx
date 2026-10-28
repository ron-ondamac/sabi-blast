import { useEffect, useRef } from 'react';
import { DrillHole, OpeningType, RoundDesignResult } from '../types';

const ROLE_COLORS: Record<string, string> = {
  cut: '#dc2626',
  reliever: '#2563eb',
  lifter: '#16a34a',
  perimeter: '#7c3aed',
  bench: '#ea580c'
};

const ROLE_LABELS: Record<string, string> = {
  cut: 'Cut holes',
  reliever: 'Stoping holes',
  lifter: 'Lifter holes',
  perimeter: 'Roof / wall holes',
  bench: 'Bench holes'
};

interface Props {
  result: RoundDesignResult;
  widthM: number;
  heightOrDiameterM: number;
}

interface Point {
  x: number;
  y: number;
}

function tunnelRoofY(x: number, widthM: number, heightM: number) {
  const springY = heightM * 0.55;
  const radiusX = widthM / 2;
  const radiusY = heightM - springY;
  const normalizedX = (x - widthM / 2) / radiusX;
  return springY + radiusY * Math.sqrt(Math.max(0, 1 - normalizedX * normalizedX));
}

function tunnelPerimeterPoint(t: number, widthM: number, heightM: number): Point {
  const springY = heightM * 0.55;
  const radiusX = widthM / 2;
  const radiusY = heightM - springY;
  const archLength = Math.PI * Math.sqrt((radiusX * radiusX + radiusY * radiusY) / 2);
  const totalLength = springY * 2 + archLength;
  const distance = t * totalLength;

  if (distance <= springY) return { x: 0, y: distance };
  if (distance <= springY + archLength) {
    const progress = (distance - springY) / archLength;
    const angle = Math.PI * (1 - progress);
    return {
      x: widthM / 2 + radiusX * Math.cos(angle),
      y: springY + radiusY * Math.sin(angle)
    };
  }

  return { x: widthM, y: springY - (distance - springY - archLength) };
}

function drawOpeningOutline(
  ctx: CanvasRenderingContext2D,
  openingType: OpeningType,
  isBench: boolean,
  left: number,
  bottom: number,
  widthPx: number,
  heightPx: number
) {
  ctx.beginPath();
  if (isBench || openingType === 'stope') {
    ctx.rect(left, bottom - heightPx, widthPx, heightPx);
  } else if (openingType === 'shaft') {
    ctx.ellipse(left + widthPx / 2, bottom - heightPx / 2, widthPx / 2, heightPx / 2, 0, 0, Math.PI * 2);
  } else {
    const springY = bottom - heightPx * 0.55;
    ctx.moveTo(left, bottom);
    ctx.lineTo(left, springY);
    ctx.ellipse(
      left + widthPx / 2,
      springY,
      widthPx / 2,
      heightPx * 0.45,
      0,
      Math.PI,
      Math.PI * 2
    );
    ctx.lineTo(left + widthPx, bottom);
    ctx.closePath();
  }
  ctx.fillStyle = '#f8fafc';
  ctx.fill();
  ctx.strokeStyle = '#475569';
  ctx.lineWidth = 2;
  ctx.stroke();
}

export default function PatternCanvas(props: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isBench = props.result.blastType === 'bench';
  const openingType = props.result.openingType || 'tunnel';

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const padding = 42;
    const scaleX = (canvas.width - padding * 2) / props.widthM;
    const scaleY = (canvas.height - padding * 2) / props.heightOrDiameterM;
    const scale = Math.min(scaleX, scaleY);
    const widthPx = props.widthM * scale;
    const heightPx = props.heightOrDiameterM * scale;
    const left = (canvas.width - widthPx) / 2;
    const bottom = (canvas.height + heightPx) / 2;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawOpeningOutline(ctx, openingType, isBench, left, bottom, widthPx, heightPx);

    const perimeterHoles = props.result.holes.filter((hole) => hole.role === 'perimeter');
    let perimeterIndex = 0;

    const displayHoles = props.result.holes.map((hole: DrillHole) => {
      let point = { x: hole.x, y: hole.y };

      if (!isBench && openingType === 'tunnel' && hole.role === 'perimeter') {
        const denominator = Math.max(1, perimeterHoles.length - 1);
        point = tunnelPerimeterPoint(perimeterIndex / denominator, props.widthM, props.heightOrDiameterM);
        perimeterIndex += 1;
      } else if (!isBench && openingType === 'tunnel' && hole.role === 'reliever') {
        const roofY = tunnelRoofY(hole.x, props.widthM, props.heightOrDiameterM);
        point = { x: hole.x, y: Math.min(hole.y, roofY - 0.12) };
      }

      return {
        hole,
        x: left + point.x * scale,
        y: bottom - point.y * scale
      };
    });

    const cutHoles = displayHoles.filter(({ hole }) => hole.role === 'cut');
    if (cutHoles.length > 0 && !isBench) {
      const boxPadding = 14;
      const xs = cutHoles.map((item) => item.x);
      const ys = cutHoles.map((item) => item.y);
      const minX = Math.min(...xs) - boxPadding;
      const maxX = Math.max(...xs) + boxPadding;
      const minY = Math.min(...ys) - boxPadding;
      const maxY = Math.max(...ys) + boxPadding;
      ctx.save();
      ctx.setLineDash([8, 6]);
      ctx.strokeStyle = '#64748b';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(minX, minY, maxX - minX, maxY - minY);
      ctx.restore();
    }

    displayHoles.forEach(({ hole, x, y }) => {
      const color = ROLE_COLORS[hole.role] || '#6b7280';
      const isUncharged = hole.chargeKg === 0;
      const radius = isUncharged ? 6 : 4.5;

      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fillStyle = isUncharged ? '#ffffff' : color;
      ctx.fill();
      ctx.strokeStyle = color;
      ctx.lineWidth = isUncharged ? 2.5 : 1;
      ctx.stroke();

      if (hole.angleDeg && hole.angleDeg !== 0) {
        const rad = (hole.angleDeg * Math.PI) / 180;
        const len = 11;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + Math.sin(rad) * len, y - Math.cos(rad) * len);
        ctx.strokeStyle = color;
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }
    });

    ctx.fillStyle = '#64748b';
    ctx.font = '12px sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText(`${props.result.holeDiameterMm} mm production holes`, canvas.width - 12, 20);
  }, [props.result, props.widthM, props.heightOrDiameterM, isBench, openingType]);

  const title = isBench
    ? 'Bench drilling pattern (plan view)'
    : `${openingType.charAt(0).toUpperCase() + openingType.slice(1)} drilling pattern (face view)`;

  return (
    <div className="bg-white border border-gray-400 p-6 shadow-sm">
      <h3 className="text-sm font-medium text-gray-500 mb-3">{title}</h3>
      <canvas ref={canvasRef} width={560} height={420} className="w-full rounded-lg bg-gray-50" />
      <div className="flex gap-4 mt-3 flex-wrap">
        {Object.entries(ROLE_COLORS)
          .filter(([role]) => (isBench ? role === 'bench' : role !== 'bench'))
          .map(([role, color]) => (
            <div key={role} className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ backgroundColor: color }} />
              <span className="text-xs text-gray-500">{ROLE_LABELS[role]}</span>
            </div>
          ))}
        {!isBench && props.result.holes.some((hole) => hole.chargeKg === 0) && (
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full inline-block bg-white border-2 border-blue-600" />
            <span className="text-xs text-gray-500">Uncharged relief hole</span>
          </div>
        )}
      </div>
    </div>
  );
}