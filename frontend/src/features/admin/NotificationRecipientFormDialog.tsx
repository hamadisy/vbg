import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
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
import type { ViolenceCategory } from '../../api/violence-categories.api';
import { translateCategory } from '../../api/violence-categories.api';
import type {
  CreateNotificationRecipientRequest,
  NotificationRecipient,
  UpdateNotificationRecipientRequest,
} from '../../api/notification-recipients.api';

// E.164 without the leading '+' - the format Vonage's SMS API expects for "to".
const E164_NO_PLUS = /^[1-9]\d{7,14}$/;

const schema = z.object({
  name: z.string().min(1),
  phone: z
    .string()
    .transform((value) => value.replace(/[\s-]/g, '').replace(/^\+/, ''))
    .pipe(z.string().regex(E164_NO_PLUS, 'admin.notificationRecipients.phoneInvalid')),
  regionId: z.string().optional(),
  violenceCategoryId: z.string().optional(),
  isActive: z.boolean(),
});

type NotificationRecipientFormValues = z.infer<typeof schema>;

interface NotificationRecipientFormDialogProps {
  open: boolean;
  recipient: NotificationRecipient | null;
  regions: Region[];
  categories: ViolenceCategory[];
  onClose: () => void;
  onSubmitCreate: (payload: CreateNotificationRecipientRequest) => void;
  onSubmitUpdate: (id: string, payload: UpdateNotificationRecipientRequest) => void;
  submitting?: boolean;
  error?: string;
}

export function NotificationRecipientFormDialog({
  open,
  recipient,
  regions,
  categories,
  onClose,
  onSubmitCreate,
  onSubmitUpdate,
  submitting,
  error,
}: NotificationRecipientFormDialogProps) {
  const { t, i18n } = useTranslation();
  const isCreate = !recipient;

  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<NotificationRecipientFormValues>({ resolver: zodResolver(schema) });

  useEffect(() => {
    if (open) {
      reset({
        name: recipient?.name ?? '',
        phone: recipient?.phone ?? '',
        regionId: recipient?.regionId ?? '',
        violenceCategoryId: recipient?.violenceCategoryId ?? '',
        isActive: recipient?.isActive ?? true,
      });
    }
  }, [open, recipient, reset]);

  const onSubmit = (values: NotificationRecipientFormValues) => {
    const shared = {
      name: values.name,
      phone: values.phone,
      regionId: values.regionId || undefined,
      violenceCategoryId: values.violenceCategoryId || undefined,
    };
    if (isCreate) {
      onSubmitCreate(shared);
    } else {
      onSubmitUpdate(recipient.id, { ...shared, isActive: values.isActive });
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle>
        {isCreate
          ? t('admin.notificationRecipients.addTitle')
          : t('admin.notificationRecipients.editTitle')}
      </DialogTitle>
      <form onSubmit={(event) => void handleSubmit(onSubmit)(event)}>
        <DialogContent className="flex flex-col gap-4">
          <TextField
            {...register('name')}
            label={t('admin.notificationRecipients.name')}
            error={!!errors.name}
            fullWidth
            autoFocus
          />
          <TextField
            {...register('phone')}
            label={t('admin.notificationRecipients.phone')}
            error={!!errors.phone}
            helperText={
              errors.phone ? t(errors.phone.message as string) : t('admin.notificationRecipients.phoneHelp')
            }
            fullWidth
          />
          <Controller
            name="regionId"
            control={control}
            render={({ field }) => (
              <FormControl fullWidth>
                <InputLabel>{t('admin.notificationRecipients.region')}</InputLabel>
                <Select {...field} label={t('admin.notificationRecipients.region')}>
                  <MenuItem value="">{t('admin.notificationRecipients.allRegions')}</MenuItem>
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
          <Controller
            name="violenceCategoryId"
            control={control}
            render={({ field }) => (
              <FormControl fullWidth>
                <InputLabel>{t('admin.notificationRecipients.violenceType')}</InputLabel>
                <Select {...field} label={t('admin.notificationRecipients.violenceType')}>
                  <MenuItem value="">{t('admin.notificationRecipients.allViolenceTypes')}</MenuItem>
                  {categories.map((category) => (
                    <MenuItem key={category.id} value={category.id}>
                      {translateCategory(category, i18n.language)}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
          />
          {!isCreate && (
            <FormControlLabel
              control={<Switch {...register('isActive')} defaultChecked={recipient?.isActive} />}
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
