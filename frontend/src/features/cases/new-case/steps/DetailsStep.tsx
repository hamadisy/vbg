import { useFormContext } from 'react-hook-form';
import { Box, TextField } from '@mui/material';
import { useTranslation } from 'react-i18next';
import type { NewCaseFormValues } from '../schema';

export function DetailsStep() {
  const { t } = useTranslation();
  const {
    register,
    formState: { errors },
  } = useFormContext<NewCaseFormValues>();

  return (
    <Box className="flex flex-col gap-4">
      <TextField
        {...register('description')}
        label={t('newCase.fields.description')}
        multiline
        minRows={4}
        fullWidth
        error={!!errors.description}
      />
      <TextField
        {...register('measuresTaken')}
        label={t('newCase.fields.measuresTaken')}
        multiline
        minRows={3}
        fullWidth
      />
    </Box>
  );
}
