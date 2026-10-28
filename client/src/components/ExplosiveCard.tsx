import { RoundDesignResult } from "../types";

export default function ExplosiveCard(props: { result: RoundDesignResult }) {
  const rec = props.result.explosiveRecommendation;
  return (
    <div className="bg-white border border-gray-400 p-6 shadow-sm">
      <h3 className="text-sm font-medium text-gray-500 mb-1">
        Recommended explosive
      </h3>
      <p className="text-xl font-semibold mb-3">{rec.explosive.name}</p>
      <ul className="space-y-1 mb-4">
        {rec.reasons.map((reason, i) => (
          <li key={i} className="text-sm text-gray-600">
            {"\u2022 " + reason}
          </li>
        ))}
      </ul>
      {rec.excluded.length > 0 && (
        <div className="border-t border-gray-100 pt-3"></div>
      )}
    </div>
  );
}
