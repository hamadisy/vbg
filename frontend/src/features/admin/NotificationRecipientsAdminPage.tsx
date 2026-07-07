import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Button,
  Chip,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import { listRegions } from '../../api/regions.api';
import { listViolenceCategories, translateCategory } from '../../api/violence-categories.api';
import {
  createNotificationRecipient,
  listNotificationRecipients,
  updateNotificationRecipient,
  type CreateNotificationRecipientRequest,
  type NotificationRecipient,
  type UpdateNotificationRecipientRequest,
} from '../../api/notification-recipients.api';
import { NotificationRecipientFormDialog } from './NotificationRecipientFormDialog';

export function NotificationRecipientsAdminPage() {
  const { t, i18n } = useTranslation();
  const queryClient = useQueryClient();
  const [editingRecipient, setEditingRecipient] = useState<NotificationRecipient | null>(null);
  const [formOpen, setFormOpen] = useState(false);

  const recipientsQuery = useQuery({
    queryKey: ['admin-notification-recipients'],
    queryFn: () => listNotificationRecipients(true),
  });
  const regionsQuery = useQuery({ queryKey: ['regions'], queryFn: () => listRegions() });
  const categoriesQuery = useQuery({
    queryKey: ['violence-categories'],
    queryFn: () => listViolenceCategories(),
  });
  const regionNameById = new Map((regionsQuery.data ?? []).map((r) => [r.id, r.name]));
  const categoryById = new Map((categoriesQuery.data ?? []).map((c) => [c.id, c]));

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: ['admin-notification-recipients'] });

  const createMutation = useMutation({
    mutationFn: (payload: CreateNotificationRecipientRequest) =>
      createNotificationRecipient(payload),
    onSuccess: async () => {
      await invalidate();
      setFormOpen(false);
    },
  });
  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateNotificationRecipientRequest }) =>
      updateNotificationRecipient(id, payload),
    onSuccess: async () => {
      await invalidate();
      setFormOpen(false);
    },
  });

  const openCreate = () => {
    createMutation.reset();
    updateMutation.reset();
    setEditingRecipient(null);
    setFormOpen(true);
  };
  const openEdit = (recipient: NotificationRecipient) => {
    createMutation.reset();
    updateMutation.reset();
    setEditingRecipient(recipient);
    setFormOpen(true);
  };

  return (
    <Box className="flex flex-col gap-4">
      <Box className="flex items-center justify-between">
        <Typography variant="h5">{t('admin.tabs.notificationRecipients')}</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={openCreate}>
          {t('admin.notificationRecipients.add')}
        </Button>
      </Box>

      <Paper>
        <Box className="overflow-x-auto">
          <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>{t('admin.notificationRecipients.name')}</TableCell>
              <TableCell>{t('admin.notificationRecipients.phone')}</TableCell>
              <TableCell>{t('admin.notificationRecipients.region')}</TableCell>
              <TableCell>{t('admin.notificationRecipients.violenceType')}</TableCell>
              <TableCell>{t('admin.active')}</TableCell>
              <TableCell sx={{ textAlign: 'end' }} />
            </TableRow>
          </TableHead>
          <TableBody>
            {(recipientsQuery.data ?? []).map((recipient) => {
              const category = recipient.violenceCategoryId
                ? categoryById.get(recipient.violenceCategoryId)
                : undefined;
              return (
                <TableRow key={recipient.id}>
                  <TableCell>{recipient.name}</TableCell>
                  <TableCell>{recipient.phone}</TableCell>
                  <TableCell>
                    {recipient.regionId
                      ? (regionNameById.get(recipient.regionId) ?? '-')
                      : t('admin.notificationRecipients.allRegions')}
                  </TableCell>
                  <TableCell>
                    {category
                      ? translateCategory(category, i18n.language)
                      : t('admin.notificationRecipients.allViolenceTypes')}
                  </TableCell>
                  <TableCell>
                    <Chip
                      size="small"
                      color={recipient.isActive ? 'success' : 'default'}
                      label={t(recipient.isActive ? 'admin.active' : 'admin.inactive')}
                    />
                  </TableCell>
                  <TableCell sx={{ textAlign: 'end' }}>
                    <IconButton
                      size="small"
                      onClick={() => openEdit(recipient)}
                      aria-label={t('admin.edit')}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
          </Table>
        </Box>
      </Paper>

      <NotificationRecipientFormDialog
        open={formOpen}
        recipient={editingRecipient}
        regions={regionsQuery.data ?? []}
        categories={categoriesQuery.data ?? []}
        onClose={() => setFormOpen(false)}
        onSubmitCreate={(payload) => createMutation.mutate(payload)}
        onSubmitUpdate={(id, payload) => updateMutation.mutate({ id, payload })}
        submitting={createMutation.isPending || updateMutation.isPending}
        error={createMutation.isError || updateMutation.isError ? t('admin.saveError') : undefined}
      />
    </Box>
  );
}
