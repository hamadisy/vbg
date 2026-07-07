import { useEffect } from 'react';
import { Controller, FormProvider, useForm } from 'react-hook-form';
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
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Select,
  Switch,
  TextField,
} from '@mui/material';
import type { Region } from '../../api/regions.api';
import type {
  CreateReferralStructureRequest,
  ReferralStructure,
  UpdateReferralStructureRequest,
} from '../../api/referral-structures.api';
import { TranslationsEditor } from './TranslationsEditor';

const typeOptions = ['police', 'gendarmerie', 'social_services', 'health_center'] as const;

const schema = z.object({
  type: z.enum(typeOptions),
  name: z.string().min(1),
  regionId: z.string().min(1),
  contactPhone: z.string().optional(),
  contactEmail: z.string().email().optional().or(z.literal('')),
  translations: z.array(z.object({ locale: z.string().min(1), label: z.string().min(1) })).min(1),
  isActive: z.boolean(),
});

type ReferralStructureFormValues = z.infer<typeof schema>;

interface ReferralStructureFormDialogProps {
  open: boolean;
  structure: ReferralStructure | null;
  regions: Region[];
  onClose: () => void;
  onSubmitCreate: (payload: CreateReferralStructureRequest) => void;
  onSubmitUpdate: (id: string, payload: UpdateReferralStructureRequest) => void;
  submitting?: boolean;
  error?: string;
}

export function ReferralStructureFormDialog({
  open,
  structure,
  regions,
  onClose,
  onSubmitCreate,
  onSubmitUpdate,
  submitting,
  error,
}: ReferralStructureFormDialogProps) {
  const { t } = useTranslation();
  const isCreate = !structure;

  const methods = useForm<ReferralStructureFormValues>({ resolver: zodResolver(schema) });
  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = methods;

  useEffect(() => {
    if (open) {
      reset({
        type: structure?.type ?? 'police',
        name: structure?.name ?? '',
        regionId: structure?.regionId ?? '',
        contactPhone: structure?.contactPhone ?? '',
        contactEmail: structure?.contactEmail ?? '',
        translations: structure?.translations.length
          ? structure.translations
          : [{ locale: 'fr', label: '' }],
        isActive: structure?.isActive ?? true,
      });
    }
  }, [open, structure, reset]);

  const onSubmit = (values: ReferralStructureFormValues) => {
    const shared = {
      type: values.type,
      name: values.name,
      regionId: values.regionId,
      contactPhone: values.contactPhone || undefined,
      contactEmail: values.contactEmail || undefined,
      translations: values.translations,
    };
    if (isCreate) {
      onSubmitCreate(shared);
    } else {
      onSubmitUpdate(structure.id, { ...shared, isActive: values.isActive });
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>
        {isCreate
          ? t('admin.referralStructures.addTitle')
          : t('admin.referralStructures.editTitle')}
      </DialogTitle>
      <FormProvider {...methods}>
        <form onSubmit={(event) => void handleSubmit(onSubmit)(event)}>
          <DialogContent className="flex flex-col gap-4">
            <Controller
              name="type"
              control={control}
              render={({ field }) => (
                <FormControl fullWidth>
                  <InputLabel>{t('admin.referralStructures.type')}</InputLabel>
                  <Select {...field} label={t('admin.referralStructures.type')}>
                    {typeOptions.map((value) => (
                      <MenuItem key={value} value={value}>
                        {t(`referralStructureType.${value}`)}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}
            />
            <TextField
              {...register('name')}
              label={t('admin.referralStructures.name')}
              error={!!errors.name}
              fullWidth
            />
            <Controller
              name="regionId"
              control={control}
              render={({ field }) => (
                <FormControl fullWidth error={!!errors.regionId}>
                  <InputLabel>{t('admin.referralStructures.region')}</InputLabel>
                  <Select {...field} label={t('admin.referralStructures.region')}>
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
            <TextField
              {...register('contactPhone')}
              label={t('admin.referralStructures.contactPhone')}
              fullWidth
            />
            <TextField
              {...register('contactEmail')}
              label={t('admin.referralStructures.contactEmail')}
              error={!!errors.contactEmail}
              fullWidth
            />
            <TranslationsEditor name="translations" />
            {!isCreate && (
              <FormControlLabel
                control={<Switch {...register('isActive')} defaultChecked={structure?.isActive} />}
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
