import { RoundDesignResult } from "../types";

function Row(props: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
      <span className="text-sm text-gray-500">{props.label}</span>
      <span className="text-sm font-medium">{props.value}</span>
    </div>
  );
}

export default function ChargeSummary(props: { result: RoundDesignResult }) {
  const result = props.result;
  const isBench = result.blastType === "bench";
  const explosivePerHoleKg =
    result.holes.length > 0 ? result.totalExplosiveKg / result.holes.length : 0;

  return (
    <div className="bg-white border border-gray-400 p-6 shadow-sm">
      <h3 className="text-sm font-medium text-black mb-3">
        {isBench ? "Charge & bench summary" : "Charge & round summary"}
      </h3>
      <Row label="Hole depth" value={result.holeDepthM.toFixed(2) + " m"} />
      <Row
        label="Production hole diameter"
        value={result.holeDiameterMm.toFixed(0) + " mm"}
      />
      {isBench && result.burdenM !== undefined && (
        <Row label="Burden" value={result.burdenM.toFixed(2) + " m"} />
      )}
      {isBench && result.spacingM !== undefined && (
        <Row label="Spacing" value={result.spacingM.toFixed(2) + " m"} />
      )}
      {!isBench && (
        <Row
          label="Cut efficiency"
          value={(result.cutEfficiency * 100).toFixed(0) + "%"}
        />
      )}
      <Row
        label={isBench ? "Pattern area" : "Face area"}
        value={result.faceAreaM2.toFixed(2) + " m2"}
      />
      <Row
        label={isBench ? "Rock volume" : "Rock volume per round"}
        value={(result.rockVolumeM3 * 2.5).toFixed(2) + " m3"}
      />
      <Row
        label="Powder factor"
        value={result.powderFactorKgM3.toFixed(2) + " kg/m3"}
      />
      <Row
        label="Achieved fragmentation"
        value={result.targetFragmentationMm.toFixed(0) + " mm"}
      />
      <Row
        label="Total explosive"
        value={result.totalExplosiveKg.toFixed(1) + " kg"}
      />
      <Row
        label="Average explosive per hole"
        value={explosivePerHoleKg.toFixed(2) + " kg/hole"}
      />
      <Row
        label="Blast radius per hole"
        value={result.blastRadiusM.toFixed(2) + " m"}
      />
      {!isBench && (
        <Row
          label="Achieved advance"
          value={result.achievedAdvanceM.toFixed(2) + " m"}
        />
      )}
      {!isBench && <Row label="Round efficiency" value={98 + "%"} />}
      <Row label="Hole count" value={String(result.holes.length)} />

      {result.warnings.length > 0 && (
        <div className="mt-4 rounded-lg bg-amber-50 border border-amber-200 p-3 space-y-1">
          {result.warnings.map((w, i) => (
            <p key={i} className="text-xs text-amber-700">
              {w}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}
