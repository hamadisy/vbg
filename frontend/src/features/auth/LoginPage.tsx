import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Alert, Box, Button, Paper, TextField, Typography } from '@mui/material';
import { useAuth } from './auth-context';

const loginSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export function LoginPage() {
  const { t } = useTranslation();
  const { login } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [loginError, setLoginError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (values: LoginFormValues) => {
    setLoginError(null);
    try {
      await login(values.username, values.password);
      const redirectTo = searchParams.get('from') || '/';
      void navigate(redirectTo, { replace: true });
    } catch {
      setLoginError(t('auth.loginError'));
    }
  };

  return (
    <Box className="flex h-full items-center justify-center p-4">
      <Paper elevation={2} className="w-full max-w-sm p-8">
        <Box className="mb-6 flex flex-col items-center gap-2">
          <img src="/img/csvvdh-logo.png" alt="CSVVDH" className="h-10" />
          <Typography variant="body2" color="text.secondary" align="center">
            {t('app.tagline')}
          </Typography>
        </Box>
        <form onSubmit={(event) => void handleSubmit(onSubmit)(event)} noValidate>
          <TextField
            {...register('username')}
            label={t('auth.username')}
            fullWidth
            margin="normal"
            error={!!errors.username}
            autoFocus
          />
          <TextField
            {...register('password')}
            label={t('auth.password')}
            type="password"
            fullWidth
            margin="normal"
            error={!!errors.password}
          />
          {loginError && (
            <Alert severity="error" className="mt-2">
              {loginError}
            </Alert>
          )}
          <Button
            type="submit"
            variant="contained"
            fullWidth
            className="mt-4"
            disabled={isSubmitting}
          >
            {t('auth.loginButton')}
          </Button>
        </form>
      </Paper>
    </Box>
  );
}
