import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
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
import type { CreateRegionRequest, Region, UpdateRegionRequest } from '../../api/regions.api';

const schema = z.object({
  name: z.string().min(1),
  municipality: z.string().min(1),
  village: z.string().optional(),
  isActive: z.boolean(),
});

type RegionFormValues = z.infer<typeof schema>;

interface RegionFormDialogProps {
  open: boolean;
  region: Region | null;
  onClose: () => void;
  onSubmitCreate: (payload: CreateRegionRequest) => void;
  onSubmitUpdate: (id: string, payload: UpdateRegionRequest) => void;
  submitting?: boolean;
  error?: string;
}

export function RegionFormDialog({
  open,
  region,
  onClose,
  onSubmitCreate,
  onSubmitUpdate,
  submitting,
  error,
}: RegionFormDialogProps) {
  const { t } = useTranslation();
  const isCreate = !region;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<RegionFormValues>({ resolver: zodResolver(schema) });

  useEffect(() => {
    if (open) {
      reset({
        name: region?.name ?? '',
        municipality: region?.municipality ?? '',
        village: region?.village ?? '',
        isActive: region?.isActive ?? true,
      });
    }
  }, [open, region, reset]);

  const onSubmit = (values: RegionFormValues) => {
    const shared = {
      name: values.name,
      municipality: values.municipality,
      village: values.village || undefined,
    };
    if (isCreate) {
      onSubmitCreate(shared);
    } else {
      onSubmitUpdate(region.id, { ...shared, isActive: values.isActive });
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle>
        {isCreate ? t('admin.regions.addTitle') : t('admin.regions.editTitle')}
      </DialogTitle>
      <form onSubmit={(event) => void handleSubmit(onSubmit)(event)}>
        <DialogContent className="flex flex-col gap-4">
          <TextField
            {...register('name')}
            label={t('admin.regions.name')}
            error={!!errors.name}
            fullWidth
            autoFocus
          />
          <TextField
            {...register('municipality')}
            label={t('admin.regions.municipality')}
            error={!!errors.municipality}
            fullWidth
          />
          <TextField {...register('village')} label={t('admin.regions.village')} fullWidth />
          {!isCreate && (
            <FormControlLabel
              control={<Switch {...register('isActive')} defaultChecked={region?.isActive} />}
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
    </Dialog>
  );
}
