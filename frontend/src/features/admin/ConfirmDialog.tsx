import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { useTranslation } from 'react-i18next';

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
}

export function ConfirmDialog({
  open,
  title,
  message,
  onConfirm,
  onCancel,
  loading,
}: ConfirmDialogProps) {
  const { t } = useTranslation();
  return (
    <Dialog open={open} onClose={onCancel}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>{message}</DialogContent>
      <DialogActions>
        <Button onClick={onCancel}>{t('admin.cancel')}</Button>
        <Button color="error" variant="contained" onClick={onConfirm} disabled={loading}>
          {t('admin.confirm')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
