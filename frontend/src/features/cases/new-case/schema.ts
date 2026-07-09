import { z } from 'zod';

export const ageRangeOptions = ['under_18', '18_40', 'over_40'] as const;
export const sexOptions = ['female', 'male', 'other'] as const;
export const relationshipOptions = [
  'family_member',
  'intimate_partner',
  'acquaintance',
  'stranger',
  'authority_figure',
  'other',
] as const;
export const vulnerabilityFactorOptions = [
  'minor',
  'disability',
  'pregnant',
  'displaced_refugee',
  'other',
] as const;
export const safetyRiskOptions = ['low', 'medium', 'high'] as const;

export const victimSchema = z.object({
  alias: z.string().optional(),
  ageRange: z.enum(ageRangeOptions),
  sex: z.enum(sexOptions),
  contactPhone: z.string().optional(),
  relationshipToPerpetrator: z.enum(relationshipOptions),
  perpetratorKnown: z.boolean(),
  cohabitingWithPerpetrator: z.boolean(),
  vulnerabilityFactors: z.array(z.enum(vulnerabilityFactorOptions)).optional(),
  safetyRisk: z.enum(safetyRiskOptions),
});

export const newCaseSchema = z.object({
  violenceCategoryId: z.string().min(1),
  regionId: z.string().min(1),
  incidentAt: z.string().min(1),
  description: z.string().min(1),
  measuresTaken: z.string().optional(),
  referralStructureId: z.string().min(1),
  victim: victimSchema,
});

export type NewCaseFormValues = z.infer<typeof newCaseSchema>;

// MUI Select/ToggleButtonGroup need a defined initial value to stay
// controlled from the first render - empty strings are the "nothing
// selected yet" sentinel for fields with no natural default, which is
// why this is cast rather than satisfying NewCaseFormValues structurally.
export const newCaseDefaultValues = {
  violenceCategoryId: '',
  regionId: '',
  incidentAt: '',
  description: '',
  measuresTaken: '',
  referralStructureId: '',
  victim: {
    alias: '',
    ageRange: '18_40',
    sex: 'female',
    contactPhone: '',
    relationshipToPerpetrator: 'stranger',
    perpetratorKnown: false,
    cohabitingWithPerpetrator: false,
    vulnerabilityFactors: [],
    safetyRisk: 'medium',
  },
} as unknown as NewCaseFormValues;
