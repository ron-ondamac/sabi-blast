import { useState } from "react";
import { RoundDesignResult } from "../types";

interface SafetyMeasuresCardProps {
  result: RoundDesignResult;
}

export default function SafetyMeasuresCard({
  result,
}: SafetyMeasuresCardProps) {
  const safetyMeasures = result.safetyMeasures;
  const [activeTab, setActiveTab] = useState<string>("overview");

  if (!safetyMeasures) {
    return (
      <div className="text-sm text-gray-400">No safety measures available</div>
    );
  }

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "preblast", label: "Pre-Blast" },
    { id: "postblast", label: "Post-Blast" },
    { id: "storage", label: "Storage" },
    { id: "geology", label: "Geology" },
    { id: "backup", label: "Backup Safety" },
  ];

  const getDisplayValue = (key: string, value: any, unit: string): string => {
    if (Array.isArray(value)) {
      return value.length > 0 ? value.join(" - ") : "None";
    }
    if (typeof value === "number") {
      return `${value.toFixed(2)}${unit ? ` ${unit}` : ""}`;
    }
    return value?.toString() || "N/A";
  };

  const overviewItems = [
    { label: "Minimum Safe Distance", key: "minimumSafeDistanceM", unit: "m" },
    { label: "Stemming Length", key: "stemmingLengthM", unit: "m" },
    { label: "Stemming Quality", key: "stemmingQualityLevel", unit: "" },
    { label: "Throw Direction", key: "throwDirection", unit: "" },
    { label: "Warning Duration", key: "warningDurationMin", unit: "min" },
  ];

  return (
    <div className="bg-white border border-gray-400 overflow-hidden">
      <div className="border-b border-gray-200 px-6 py-4 bg-gray-50">
        <h3 className="text-base font-medium text-gray-800">
          Safety Measures & Precautions
        </h3>
        <p className="text-xs text-gray-500 mt-1">
          Essential safety guidelines for blast round design
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="flex border-b border-gray-200 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors
              ${
                activeTab === tab.id
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-600 hover:text-gray-800"
              }
            `}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="p-6">
        {activeTab === "overview" && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {overviewItems.map((item) => {
                const rawValue = (safetyMeasures as any)[item.key];
                return (
                  <div
                    key={item.label}
                    className="bg-gray-50 rounded-lg p-4 border border-gray-200"
                  >
                    <div className="text-xs text-gray-500 mb-1">
                      {item.label}
                    </div>
                    <div className="text-lg font-semibold text-gray-800">
                      {getDisplayValue(item.key, rawValue, item.unit)}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Safety Warnings */}
            {result.warnings && result.warnings.length > 0 && (
              <div className="mt-6 p-4 bg-amber-50 border border-amber-200">
                <div className="flex items-start gap-2">
                  <div>
                    <div className="font-medium text-amber-800 mb-2">
                      Safety Warnings
                    </div>
                    <ul className="space-y-1 text-sm text-amber-700">
                      {result.warnings.map((warning, idx) => (
                        <li key={idx}>• {warning}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === "preblast" && (
          <div className="space-y-3">
            <h4 className="font-medium text-gray-800 flex items-center gap-2">
              Pre-Blast Precautions
            </h4>
            <ul className="space-y-2 ml-7">
              {safetyMeasures.preBlastPrecautions?.map(
                (item: string, idx: number) => (
                  <li
                    key={idx}
                    className="text-sm text-gray-700 flex items-start gap-2"
                  >
                    <span className="text-blue-500 mt-0.5">•</span>
                    <span>{item}</span>
                  </li>
                ),
              ) || (
                <li className="text-sm text-gray-500">
                  No precautions defined
                </li>
              )}
            </ul>
          </div>
        )}

        {activeTab === "postblast" && (
          <div className="space-y-3">
            <h4 className="font-medium text-gray-800 flex items-center gap-2">
              Post-Blast Procedures
            </h4>
            <ul className="space-y-2 ml-7">
              {safetyMeasures.postBlastProcedures?.map(
                (item: string, idx: number) => (
                  <li
                    key={idx}
                    className="text-sm text-gray-700 flex items-start gap-2"
                  >
                    <span className="text-blue-500 mt-0.5">•</span>
                    <span>{item}</span>
                  </li>
                ),
              ) || (
                <li className="text-sm text-gray-500">No procedures defined</li>
              )}
            </ul>
          </div>
        )}

        {activeTab === "storage" && (
          <div className="space-y-3">
            <h4 className="font-medium text-gray-800 flex items-center gap-2">
              Explosive Storage Requirements
            </h4>
            <ul className="space-y-2 ml-7">
              {safetyMeasures.explosiveStorageRequirements?.map(
                (item: string, idx: number) => (
                  <li
                    key={idx}
                    className="text-sm text-gray-700 flex items-start gap-2"
                  >
                    <span className="text-blue-500 mt-0.5">•</span>
                    <span>{item}</span>
                  </li>
                ),
              ) || (
                <li className="text-sm text-gray-500">
                  No requirements defined
                </li>
              )}
            </ul>
          </div>
        )}

        {activeTab === "geology" && (
          <div className="space-y-3">
            <h4 className="font-medium text-gray-800 flex items-center gap-2">
              Rock & Geology Considerations
            </h4>
            <ul className="space-y-2 ml-7">
              {safetyMeasures.rockAndGeologyConsiderations?.map(
                (item: string, idx: number) => (
                  <li
                    key={idx}
                    className="text-sm text-gray-700 flex items-start gap-2"
                  >
                    <span className="text-blue-500 mt-0.5">•</span>
                    <span>{item}</span>
                  </li>
                ),
              ) || (
                <li className="text-sm text-gray-500">
                  No considerations defined
                </li>
              )}
            </ul>
          </div>
        )}

        {activeTab === "backup" && (
          <div className="space-y-3">
            <h4 className="font-medium text-gray-800 flex items-center gap-2">
              Backup Blast Safety Features
            </h4>
            <ul className="space-y-2 ml-7">
              {safetyMeasures.backupBlastSafetyFeatures?.map(
                (item: string, idx: number) => (
                  <li
                    key={idx}
                    className="text-sm text-gray-700 flex items-start gap-2"
                  >
                    <span className="text-blue-500 mt-0.5">•</span>
                    <span>{item}</span>
                  </li>
                ),
              ) || (
                <li className="text-sm text-gray-500">No features defined</li>
              )}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
