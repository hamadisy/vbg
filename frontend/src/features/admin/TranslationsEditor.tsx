import { useFieldArray, useFormContext } from 'react-hook-form';
import { Box, Button, IconButton, TextField, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { useTranslation } from 'react-i18next';

export function TranslationsEditor({ name }: { name: string }) {
  const { t } = useTranslation();
  const { control, register } = useFormContext();
  const { fields, append, remove } = useFieldArray({ control, name });

  return (
    <Box className="flex flex-col gap-2">
      <Typography variant="subtitle2">{t('admin.translations')}</Typography>
      {fields.map((field, index) => (
        <Box key={field.id} className="flex items-center gap-2">
          <TextField
            {...register(`${name}.${index}.locale`)}
            label={t('admin.locale')}
            size="small"
            className="w-28"
          />
          <TextField
            {...register(`${name}.${index}.label`)}
            label={t('admin.label')}
            size="small"
            className="flex-1"
          />
          <IconButton size="small" onClick={() => remove(index)} disabled={fields.length <= 1}>
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Box>
      ))}
      <Button
        size="small"
        startIcon={<AddIcon />}
        onClick={() => append({ locale: '', label: '' })}
      >
        {t('admin.addTranslation')}
      </Button>
    </Box>
  );
}
