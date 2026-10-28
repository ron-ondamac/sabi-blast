import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { RockType, RoundFormValues } from "../types";

const schema = z.object({
  blastType: z.enum(["underground", "bench"]),
  openingType: z.enum(["tunnel", "stope", "shaft"]),
  widthM: z.coerce.number().positive().max(20),
  heightOrDiameterM: z.coerce.number().positive().max(20),
  advanceRequiredM: z.coerce.number().positive().max(20),
  desiredFragmentationMm: z.coerce.number().min(32).max(100).multipleOf(2),
  environment: z.enum(["wet", "dry"]),
  rockTypeId: z.coerce.number().int().positive(),
  burdenM: z.coerce.number().positive().max(20).optional(),
  spacingM: z.coerce.number().positive().max(20).optional(),
}).superRefine((values, ctx) => {
  if (values.blastType === "bench") {
    if (values.burdenM === undefined) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["burdenM"], message: "Burden is required" });
    }
    if (values.spacingM === undefined) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["spacingM"], message: "Spacing is required" });
    }
  } else if (values.advanceRequiredM > 3) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["advanceRequiredM"], message: "Underground advance cannot exceed 3 m" });
  }
});

interface Props {
  rockTypes: RockType[];
  onSubmit: (values: RoundFormValues) => void;
  isLoading: boolean;
}

const OPENING_PRESETS: Record<string, number> = {
  tunnel: 1.5,
  stope: 1,
  shaft: 1,
};

export default function RoundForm(props: Props) {
  const form = useForm<
    z.input<typeof schema>,
    unknown,
    z.output<typeof schema>
  >({
    resolver: zodResolver(schema),
    defaultValues: {
      blastType: "underground",
      openingType: "tunnel",
      widthM: 4,
      heightOrDiameterM: 4,
      advanceRequiredM: 1.5,
      desiredFragmentationMm: 34,
      environment: "dry",
      rockTypeId: props.rockTypes[0] ? props.rockTypes[0].id : undefined,
      burdenM: 2.5,
      spacingM: 3,
    },
  });

  const register = form.register;
  const errors = form.formState.errors;
  const blastType = form.watch("blastType");
  const openingType = form.watch("openingType");

  return (
    <form
      onSubmit={form.handleSubmit(props.onSubmit)}
      className="bg-white border border-gray-400 p-8 shadow-sm space-y-6"
    >
      <div>
        <h2 className="text-base font-medium mb-1">Blast design inputs</h2>
        <p className="text-sm text-gray-500">
          Describe the blast geometry and site conditions to generate a design.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <label className="block text-sm text-gray-600 mb-2">
            Blast type
          </label>
          <div className="flex gap-2">
            <label className="flex-1 flex items-center justify-center gap-2 border border-gray-300 px-3 py-2 text-sm cursor-pointer has-[:checked]:border-ink has-[:checked]:bg-gray-50">
              <input
                type="radio"
                value="underground"
                {...register("blastType")}
                onChange={() => {
                  form.setValue("blastType", "underground");
                  form.setValue("advanceRequiredM", 1.5);
                }}
                className="accent-ink"
              />
              Underground
            </label>
            <label className="flex-1 flex items-center justify-center gap-2 border border-gray-300 px-3 py-2 text-sm cursor-pointer has-[:checked]:border-ink has-[:checked]:bg-gray-50">
              <input
                type="radio"
                value="bench"
                {...register("blastType")}
                onChange={() => {
                  form.setValue("blastType", "bench");
                  form.setValue("advanceRequiredM", 8);
                }}
                className="accent-ink"
              />
              Bench
            </label>
          </div>
        </div>

        {blastType === "underground" && <div>
          <label className="block text-sm text-gray-600 mb-1">
            Opening type
          </label>
          <select
            className="w-full border border-gray-300 px-3 py-2 text-sm"
            {...register("openingType")}
            onChange={(e) => {
              form.setValue("openingType", e.target.value as any);
              form.setValue(
                "advanceRequiredM",
                OPENING_PRESETS[e.target.value] || 1.5,
              );
            }}
          >
            <option value="tunnel">Tunnel</option>
            <option value="stope">Stope</option>
            <option value="shaft">Shaft</option>
          </select>
        </div>}
        <div>
          <label className="block text-sm text-gray-600 mb-1">Rock type</label>
          <select
            className="w-full border border-gray-300 px-3 py-2 text-sm"
            {...register("rockTypeId")}
          >
            {props.rockTypes.map((r) => (
              <option key={r.id} value={r.id}>
                {r.name + " (UCS " + r.ucsMpa + " MPa)"}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm text-gray-600 mb-1">
            {blastType === "bench" ? "Pattern width (m)" : "Width (m)"}
          </label>
          <input
            type="number"
            step="0.1"
            className="w-full border border-gray-300 px-3 py-2 text-sm"
            {...register("widthM")}
          />
          {errors.widthM && (
            <p className="text-xs text-red-500 mt-1">{errors.widthM.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm text-gray-600 mb-1">
            {blastType === "bench"
              ? "Pattern length (m)"
              : openingType === "shaft"
                ? "Diameter (m)"
                : "Height (m)"}
          </label>
          <input
            type="number"
            step="0.1"
            className="w-full border border-gray-300 px-3 py-2 text-sm"
            {...register("heightOrDiameterM")}
          />
        </div>

        <div>
          <label className="block text-sm text-gray-600 mb-1">
            {blastType === "bench" ? "Hole depth (m)" : "Required advance (m)"}
          </label>
          <input
            type="number"
            step="0.1"
            className="w-full border border-gray-300 px-3 py-2 text-sm"
            {...register("advanceRequiredM")}
          />
          {errors.advanceRequiredM && (
            <p className="text-xs text-red-500 mt-1">{errors.advanceRequiredM.message}</p>
          )}
        </div>

        {blastType === "bench" && (
          <>
            <div>
              <label className="block text-sm text-gray-600 mb-1">
                Burden (m)
              </label>
              <input
                type="number"
                step="0.1"
                className="w-full border border-gray-300 px-3 py-2 text-sm"
                {...register("burdenM")}
              />
              {errors.burdenM && (
                <p className="text-xs text-red-500 mt-1">{errors.burdenM.message}</p>
              )}
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">
                Spacing (m)
              </label>
              <input
                type="number"
                step="0.1"
                className="w-full border border-gray-300 px-3 py-2 text-sm"
                {...register("spacingM")}
              />
              {errors.spacingM && (
                <p className="text-xs text-red-500 mt-1">{errors.spacingM.message}</p>
              )}
            </div>
          </>
        )}

        <div>
          <label className="block text-sm text-gray-600 mb-1">
            Target fragmentation (mm)
          </label>
          <input
            type="number"
            min="32"
            max="100"
            step="2"
            className="w-full border border-gray-300 px-3 py-2 text-sm"
            {...register("desiredFragmentationMm")}
          />
          {errors.desiredFragmentationMm && (
            <p className="text-xs text-red-500 mt-1">
              Use an even size from 32 mm to 100 mm
            </p>
          )}
        </div>

        <div className="col-span-2">
          <label className="block text-sm text-gray-600 mb-2">
            Environment
          </label>
          <div className="flex gap-2">
            <label className="flex-1 flex items-center justify-center gap-2 border border-gray-300 px-3 py-2 text-sm cursor-pointer has-[:checked]:border-ink has-[:checked]:bg-gray-50">
              <input
                type="radio"
                value="dry"
                {...register("environment")}
                className="accent-ink"
              />
              Dry
            </label>
            <label className="flex-1 flex items-center justify-center gap-2 border border-gray-300 px-3 py-2 text-sm cursor-pointer has-[:checked]:border-ink has-[:checked]:bg-gray-50">
              <input
                type="radio"
                value="wet"
                {...register("environment")}
                className="accent-ink"
              />
              Wet
            </label>
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={props.isLoading}
        className="w-full bg-ink text-white text-sm font-medium py-2.5 hover:bg-gray-800 transition disabled:opacity-50"
      >
        {props.isLoading
          ? "Designing blast..."
          : blastType === "bench"
            ? "Generate bench design"
            : "Generate round design"}
      </button>
    </form>
  );
}
