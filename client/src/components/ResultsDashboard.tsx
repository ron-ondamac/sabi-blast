import { RoundDesignResult } from "../types";
import ChargeSummary from "./ChargeSummary";
import ExplosiveCard from "./ExplosiveCard";
import PatternCanvas from "./PatternCanvas";
import SafetyMeasuresCard from "./SafetyMeasuresCard";

interface Props {
  result: RoundDesignResult;
  widthM: number;
  heightOrDiameterM: number;
}

export default function ResultsDashboard(props: Props) {
  return (
    <div className="space-y-6">
      <ExplosiveCard result={props.result} />
      <ChargeSummary result={props.result} />
      <SafetyMeasuresCard result={props.result} />
      <PatternCanvas
        result={props.result}
        widthM={props.widthM}
        heightOrDiameterM={props.heightOrDiameterM}
      />
    </div>
  );
}
