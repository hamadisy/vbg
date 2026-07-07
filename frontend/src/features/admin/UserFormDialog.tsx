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
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from '@mui/material';
import type { Region } from '../../api/regions.api';
import type { CreateUserRequest, UpdateUserRequest, User } from '../../api/users.api';
import { SUPPORTED_LANGUAGES } from '../../i18n/i18n';

const roleOptions = [
  'community_relay',
  'regional_director',
  'institutional_user',
  'administrator',
] as const;

function buildSchema(isCreate: boolean) {
  return z.object({
    fullName: z.string().min(1),
    username: z.string().min(3),
    password: isCreate ? z.string().min(8) : z.string().min(8).optional().or(z.literal('')),
    phone: z.string().optional(),
    email: z.string().email().optional().or(z.literal('')),
    role: z.enum(roleOptions),
    regionId: z.string().optional(),
    language: z.string().optional(),
  });
}

type UserFormValues = z.infer<ReturnType<typeof buildSchema>>;

interface UserFormDialogProps {
  open: boolean;
  user: User | null;
  regions: Region[];
  onClose: () => void;
  onSubmitCreate: (payload: CreateUserRequest) => void;
  onSubmitUpdate: (id: string, payload: UpdateUserRequest) => void;
  submitting?: boolean;
  error?: string;
}

export function UserFormDialog({
  open,
  user,
  regions,
  onClose,
  onSubmitCreate,
  onSubmitUpdate,
  submitting,
  error,
}: UserFormDialogProps) {
  const { t } = useTranslation();
  const isCreate = !user;

  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UserFormValues>({ resolver: zodResolver(buildSchema(isCreate)) });

  useEffect(() => {
    if (open) {
      reset({
        fullName: user?.fullName ?? '',
        username: user?.username ?? '',
        password: '',
        phone: user?.phone ?? '',
        email: user?.email ?? '',
        role: user?.role ?? 'community_relay',
        regionId: user?.regionId ?? '',
        language: user?.language ?? 'fr',
      });
    }
  }, [open, user, reset]);

  const onSubmit = (values: UserFormValues) => {
    const shared = {
      fullName: values.fullName,
      phone: values.phone || undefined,
      email: values.email || undefined,
      role: values.role,
      regionId: values.regionId || undefined,
      language: values.language || undefined,
    };
    if (isCreate) {
      onSubmitCreate({ ...shared, username: values.username, password: values.password! });
    } else {
      const update: UpdateUserRequest = { ...shared };
      if (values.password) {
        update.password = values.password;
      }
      onSubmitUpdate(user.id, update);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle>{isCreate ? t('admin.users.addTitle') : t('admin.users.editTitle')}</DialogTitle>
      <form onSubmit={(event) => void handleSubmit(onSubmit)(event)}>
        <DialogContent className="flex flex-col gap-4">
          <TextField
            {...register('fullName')}
            label={t('admin.users.fullName')}
            error={!!errors.fullName}
            fullWidth
            autoFocus
          />
          <TextField
            {...register('username')}
            label={t('admin.users.username')}
            error={!!errors.username}
            disabled={!isCreate}
            fullWidth
          />
          <TextField
            {...register('password')}
            type="password"
            label={isCreate ? t('admin.users.password') : t('admin.users.passwordOptional')}
            error={!!errors.password}
            fullWidth
          />
          <TextField {...register('phone')} label={t('admin.users.phone')} fullWidth />
          <TextField
            {...register('email')}
            label={t('admin.users.email')}
            error={!!errors.email}
            fullWidth
          />
          <Controller
            name="role"
            control={control}
            render={({ field }) => (
              <FormControl fullWidth>
                <InputLabel>{t('admin.users.role')}</InputLabel>
                <Select {...field} label={t('admin.users.role')}>
                  {roleOptions.map((value) => (
                    <MenuItem key={value} value={value}>
                      {t(`role.${value}`)}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
          />
          <Controller
            name="regionId"
            control={control}
            render={({ field }) => (
              <FormControl fullWidth>
                <InputLabel>{t('admin.users.region')}</InputLabel>
                <Select {...field} label={t('admin.users.region')}>
                  <MenuItem value="">{t('admin.users.noRegion')}</MenuItem>
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
            name="language"
            control={control}
            render={({ field }) => (
              <FormControl fullWidth>
                <InputLabel>{t('language.label')}</InputLabel>
                <Select {...field} label={t('language.label')}>
                  {SUPPORTED_LANGUAGES.map((language) => (
                    <MenuItem key={language} value={language}>
                      {language.toUpperCase()}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
          />
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
