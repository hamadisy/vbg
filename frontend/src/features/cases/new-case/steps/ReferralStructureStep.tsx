import { Controller, useFormContext } from 'react-hook-form';
import { FormControl, InputLabel, MenuItem, Select, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import type { ReferralStructure } from '../../../../api/referral-structures.api';
import type { NewCaseFormValues } from '../schema';

interface ReferralStructureStepProps {
  referralStructures: ReferralStructure[];
}

export function ReferralStructureStep({ referralStructures }: ReferralStructureStepProps) {
  const { t } = useTranslation();
  const { control } = useFormContext<NewCaseFormValues>();

  if (referralStructures.length === 0) {
    return <Typography color="text.secondary">{t('newCase.noReferralStructures')}</Typography>;
  }

  return (
    <Controller
      name="referralStructureId"
      control={control}
      render={({ field }) => (
        <FormControl fullWidth>
          <InputLabel>{t('newCase.fields.referralStructure')}</InputLabel>
          <Select {...field} label={t('newCase.fields.referralStructure')}>
            {referralStructures.map((structure) => (
              <MenuItem key={structure.id} value={structure.id}>
                {structure.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      )}
    />
  );
}
