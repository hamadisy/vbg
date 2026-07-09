import { Controller, useFormContext } from 'react-hook-form';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';
import type { NewCaseFormValues } from '../schema';

export function DateTimeStep() {
  const { t } = useTranslation();
  const { control } = useFormContext<NewCaseFormValues>();

  return (
    <Controller
      name="incidentAt"
      control={control}
      render={({ field }) => (
        <DateTimePicker
          label={t('newCase.fields.incidentAt')}
          value={field.value ? dayjs(field.value) : null}
          onChange={(value) => field.onChange(value ? value.format('YYYY-MM-DDTHH:mm') : '')}
          disableFuture
          ampm={false}
          sx={{ width: '100%' }}
        />
      )}
    />
  );
}
