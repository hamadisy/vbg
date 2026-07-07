import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Button,
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
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { listRegions } from '../../api/regions.api';
import { createUser, deleteUser, listUsers, updateUser } from '../../api/users.api';
import type { CreateUserRequest, UpdateUserRequest, User } from '../../api/users.api';
import { UserFormDialog } from './UserFormDialog';
import { ConfirmDialog } from './ConfirmDialog';

export function UsersAdminPage() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [deletingUser, setDeletingUser] = useState<User | null>(null);

  const usersQuery = useQuery({ queryKey: ['admin-users'], queryFn: () => listUsers() });
  const regionsQuery = useQuery({ queryKey: ['regions'], queryFn: () => listRegions() });
  const regionNameById = new Map((regionsQuery.data ?? []).map((r) => [r.id, r.name]));

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ['admin-users'] });

  const createMutation = useMutation({
    mutationFn: (payload: CreateUserRequest) => createUser(payload),
    onSuccess: async () => {
      await invalidate();
      setFormOpen(false);
    },
  });
  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateUserRequest }) =>
      updateUser(id, payload),
    onSuccess: async () => {
      await invalidate();
      setFormOpen(false);
    },
  });
  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteUser(id),
    onSuccess: async () => {
      await invalidate();
      setDeletingUser(null);
    },
  });

  const openCreate = () => {
    createMutation.reset();
    updateMutation.reset();
    setEditingUser(null);
    setFormOpen(true);
  };
  const openEdit = (user: User) => {
    createMutation.reset();
    updateMutation.reset();
    setEditingUser(user);
    setFormOpen(true);
  };

  return (
    <Box className="flex flex-col gap-4">
      <Box className="flex items-center justify-between">
        <Typography variant="h5">{t('admin.tabs.users')}</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={openCreate}>
          {t('admin.users.add')}
        </Button>
      </Box>

      <Paper>
        <Box className="overflow-x-auto">
          <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>{t('admin.users.fullName')}</TableCell>
              <TableCell>{t('admin.users.username')}</TableCell>
              <TableCell>{t('admin.users.role')}</TableCell>
              <TableCell>{t('admin.users.region')}</TableCell>
              <TableCell>{t('language.label')}</TableCell>
              <TableCell sx={{ textAlign: 'end' }} />
            </TableRow>
          </TableHead>
          <TableBody>
            {(usersQuery.data ?? []).map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.fullName}</TableCell>
                <TableCell>{user.username}</TableCell>
                <TableCell>{t(`role.${user.role}`)}</TableCell>
                <TableCell>
                  {user.regionId ? (regionNameById.get(user.regionId) ?? '-') : '-'}
                </TableCell>
                <TableCell>{user.language.toUpperCase()}</TableCell>
                <TableCell sx={{ textAlign: 'end' }}>
                  <IconButton
                    size="small"
                    onClick={() => openEdit(user)}
                    aria-label={t('admin.edit')}
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => setDeletingUser(user)}
                    aria-label={t('admin.delete')}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          </Table>
        </Box>
      </Paper>

      <UserFormDialog
        open={formOpen}
        user={editingUser}
        regions={regionsQuery.data ?? []}
        onClose={() => setFormOpen(false)}
        onSubmitCreate={(payload) => createMutation.mutate(payload)}
        onSubmitUpdate={(id, payload) => updateMutation.mutate({ id, payload })}
        submitting={createMutation.isPending || updateMutation.isPending}
        error={createMutation.isError || updateMutation.isError ? t('admin.saveError') : undefined}
      />

      <ConfirmDialog
        open={!!deletingUser}
        title={t('admin.users.deleteTitle')}
        message={t('admin.users.deleteMessage', { name: deletingUser?.fullName ?? '' })}
        onCancel={() => setDeletingUser(null)}
        onConfirm={() => deletingUser && deleteMutation.mutate(deletingUser.id)}
        loading={deleteMutation.isPending}
      />
    </Box>
  );
}
