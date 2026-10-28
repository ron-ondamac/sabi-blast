import { z } from 'zod';

export const roundInputSchema = z.object({
  blastType: z.enum(['underground', 'bench']).default('underground'),
  openingType: z.enum(['tunnel', 'stope', 'shaft']),
  widthM: z.coerce.number().positive().max(20),
  heightOrDiameterM: z.coerce.number().positive().max(20),
  advanceRequiredM: z.coerce.number().positive().max(20),
  desiredFragmentationMm: z.coerce.number().min(32).max(100).multipleOf(2),
  environment: z.enum(['wet', 'dry']),
  rockTypeId: z.coerce.number().int().positive(),
  burdenM: z.coerce.number().positive().max(20).optional(),
  spacingM: z.coerce.number().positive().max(20).optional()
}).superRefine((input, ctx) => {
  if (input.blastType === 'bench') {
    if (input.burdenM === undefined) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['burdenM'], message: 'Burden is required for a bench blast' });
    }
    if (input.spacingM === undefined) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['spacingM'], message: 'Spacing is required for a bench blast' });
    }
  } else if (input.advanceRequiredM > 3) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['advanceRequiredM'], message: 'Underground advance cannot exceed 3 m' });
  }
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
});
