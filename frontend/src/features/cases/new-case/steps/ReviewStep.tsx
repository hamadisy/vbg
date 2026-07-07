import { useFormContext } from 'react-hook-form';
import { Box, Divider, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import type { Region } from '../../../../api/regions.api';
import type { ViolenceCategory } from '../../../../api/violence-categories.api';
import { translateCategory } from '../../../../api/violence-categories.api';
import type { ReferralStructure } from '../../../../api/referral-structures.api';
import type { NewCaseFormValues } from '../schema';

interface ReviewStepProps {
  categories: ViolenceCategory[];
  regions: Region[];
  referralStructures: ReferralStructure[];
}

function ReviewRow({ label, value }: { label: string; value?: string }) {
  return (
    <Box className="flex justify-between py-1">
      <Typography color="text.secondary">{label}</Typography>
      <Typography>{value || '-'}</Typography>
    </Box>
  );
}

export function ReviewStep({ categories, regions, referralStructures }: ReviewStepProps) {
  const { t, i18n } = useTranslation();
  const { watch } = useFormContext<NewCaseFormValues>();
  const values = watch();

  const category = categories.find((c) => c.id === values.violenceCategoryId);
  const region = regions.find((r) => r.id === values.regionId);
  const referralStructure = referralStructures.find((r) => r.id === values.referralStructureId);

  return (
    <Box>
      <ReviewRow
        label={t('newCase.fields.violenceType')}
        value={category ? translateCategory(category, i18n.language) : undefined}
      />
      <ReviewRow label={t('newCase.fields.region')} value={region?.name} />
      <ReviewRow label={t('newCase.fields.incidentAt')} value={values.incidentAt} />
      <Divider className="my-2" />
      <ReviewRow
        label={t('newCase.fields.ageRange')}
        value={
          values.victim?.ageRange ? t(`newCase.ageRange.${values.victim.ageRange}`) : undefined
        }
      />
      <ReviewRow
        label={t('newCase.fields.sex')}
        value={values.victim?.sex ? t(`newCase.sex.${values.victim.sex}`) : undefined}
      />
      <ReviewRow
        label={t('newCase.fields.safetyRisk')}
        value={
          values.victim?.safetyRisk
            ? t(`newCase.safetyRisk.${values.victim.safetyRisk}`)
            : undefined
        }
      />
      <Divider className="my-2" />
      <ReviewRow label={t('newCase.fields.referralStructure')} value={referralStructure?.name} />
    </Box>
  );
}
