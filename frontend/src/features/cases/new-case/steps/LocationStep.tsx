import { Controller, useFormContext } from 'react-hook-form';
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { useTranslation } from 'react-i18next';
import type { Region } from '../../../../api/regions.api';
import type { NewCaseFormValues } from '../schema';

interface LocationStepProps {
  regions: Region[];
}

export function LocationStep({ regions }: LocationStepProps) {
  const { t } = useTranslation();
  const { control } = useFormContext<NewCaseFormValues>();

  return (
    <Controller
      name="regionId"
      control={control}
      render={({ field }) => (
        <FormControl fullWidth>
          <InputLabel>{t('newCase.fields.region')}</InputLabel>
          <Select {...field} label={t('newCase.fields.region')}>
            {regions.map((region) => (
              <MenuItem key={region.id} value={region.id}>
                {region.name}
                {region.municipality ? ` - ${region.municipality}` : ''}
                {region.village ? ` (${region.village})` : ''}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      )}
    />
  );
}
