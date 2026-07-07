import { useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTranslation } from 'react-i18next';
import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Switch,
  TextField,
} from '@mui/material';
import type {
  CreateViolenceCategoryRequest,
  UpdateViolenceCategoryRequest,
  ViolenceCategory,
} from '../../api/violence-categories.api';
import { TranslationsEditor } from './TranslationsEditor';

const schema = z.object({
  code: z.string().min(1),
  sortOrder: z.number().optional(),
  translations: z.array(z.object({ locale: z.string().min(1), label: z.string().min(1) })).min(1),
  isActive: z.boolean(),
});

type ViolenceCategoryFormValues = z.infer<typeof schema>;

interface ViolenceCategoryFormDialogProps {
  open: boolean;
  category: ViolenceCategory | null;
  onClose: () => void;
  onSubmitCreate: (payload: CreateViolenceCategoryRequest) => void;
  onSubmitUpdate: (id: string, payload: UpdateViolenceCategoryRequest) => void;
  submitting?: boolean;
  error?: string;
}

export function ViolenceCategoryFormDialog({
  open,
  category,
  onClose,
  onSubmitCreate,
  onSubmitUpdate,
  submitting,
  error,
}: ViolenceCategoryFormDialogProps) {
  const { t } = useTranslation();
  const isCreate = !category;

  const methods = useForm<ViolenceCategoryFormValues>({ resolver: zodResolver(schema) });
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = methods;

  useEffect(() => {
    if (open) {
      reset({
        code: category?.code ?? '',
        sortOrder: category?.sortOrder ?? 0,
        translations: category?.translations.length
          ? category.translations
          : [{ locale: 'fr', label: '' }],
        isActive: category?.isActive ?? true,
      });
    }
  }, [open, category, reset]);

  const onSubmit = (values: ViolenceCategoryFormValues) => {
    const shared = {
      code: values.code,
      sortOrder: values.sortOrder,
      translations: values.translations,
    };
    if (isCreate) {
      onSubmitCreate(shared);
    } else {
      onSubmitUpdate(category.id, { ...shared, isActive: values.isActive });
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>
        {isCreate
          ? t('admin.violenceCategories.addTitle')
          : t('admin.violenceCategories.editTitle')}
      </DialogTitle>
      <FormProvider {...methods}>
        <form onSubmit={(event) => void handleSubmit(onSubmit)(event)}>
          <DialogContent className="flex flex-col gap-4">
            <TextField
              {...register('code')}
              label={t('admin.violenceCategories.code')}
              error={!!errors.code}
              disabled={!isCreate}
              fullWidth
              autoFocus={isCreate}
            />
            <TextField
              {...register('sortOrder', { valueAsNumber: true })}
              type="number"
              label={t('admin.violenceCategories.sortOrder')}
              fullWidth
            />
            <TranslationsEditor name="translations" />
            {!isCreate && (
              <FormControlLabel
                control={<Switch {...register('isActive')} defaultChecked={category?.isActive} />}
                label={t('admin.active')}
              />
            )}
            {error && <Alert severity="error">{error}</Alert>}
          </DialogContent>
          <DialogActions>
            <Button onClick={onClose}>{t('admin.cancel')}</Button>
            <Button type="submit" variant="contained" disabled={submitting}>
              {t('admin.save')}
            </Button>
          </DialogActions>
        </form>
      </FormProvider>
    </Dialog>
  );
}
