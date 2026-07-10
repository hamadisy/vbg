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
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import {
  createViolenceCategory,
  deactivateViolenceCategory,
  listViolenceCategories,
  translateCategory,
  updateViolenceCategory,
  type CreateViolenceCategoryRequest,
  type UpdateViolenceCategoryRequest,
  type ViolenceCategory,
} from '../../api/violence-categories.api';
import { ViolenceCategoryFormDialog } from './ViolenceCategoryFormDialog';
import { ConfirmDialog } from './ConfirmDialog';

export function ViolenceCategoriesAdminPage() {
  const { t, i18n } = useTranslation();
  const queryClient = useQueryClient();
  const [editingCategory, setEditingCategory] = useState<ViolenceCategory | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [deletingCategory, setDeletingCategory] = useState<ViolenceCategory | null>(null);

  const categoriesQuery = useQuery({
    queryKey: ['admin-violence-categories'],
    queryFn: () => listViolenceCategories(),
  });

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: ['admin-violence-categories'] });

  const createMutation = useMutation({
    mutationFn: (payload: CreateViolenceCategoryRequest) => createViolenceCategory(payload),
    onSuccess: async () => {
      await invalidate();
      setFormOpen(false);
    },
  });
  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateViolenceCategoryRequest }) =>
      updateViolenceCategory(id, payload),
    onSuccess: async () => {
      await invalidate();
      setFormOpen(false);
    },
  });
  const deleteMutation = useMutation({
    mutationFn: (id: string) => deactivateViolenceCategory(id),
    onSuccess: async () => {
      await invalidate();
      setDeletingCategory(null);
    },
  });

  const openCreate = () => {
    createMutation.reset();
    updateMutation.reset();
    setEditingCategory(null);
    setFormOpen(true);
  };
  const openEdit = (category: ViolenceCategory) => {
    createMutation.reset();
    updateMutation.reset();
    setEditingCategory(category);
    setFormOpen(true);
  };

  return (
    <Box className="flex flex-col gap-4">
      <Box className="flex items-center justify-between">
        <Typography variant="h5">{t('admin.tabs.violenceCategories')}</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={openCreate}>
          {t('admin.violenceCategories.add')}
        </Button>
      </Box>

      <Paper>
        <Box className="overflow-x-auto">
          <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>{t('admin.violenceCategories.code')}</TableCell>
              <TableCell>{t('admin.label')}</TableCell>
              <TableCell>{t('admin.violenceCategories.sortOrder')}</TableCell>
              <TableCell>{t('admin.active')}</TableCell>
              <TableCell sx={{ textAlign: 'end' }} />
            </TableRow>
          </TableHead>
          <TableBody>
            {(categoriesQuery.data ?? []).map((category) => (
              <TableRow key={category.id}>
                <TableCell>{category.code}</TableCell>
                <TableCell>{translateCategory(category, i18n.language)}</TableCell>
                <TableCell>{category.sortOrder}</TableCell>
                <TableCell>
                  <Chip
                    size="small"
                    color={category.isActive ? 'success' : 'default'}
                    label={t(category.isActive ? 'admin.active' : 'admin.inactive')}
                  />
                </TableCell>
                <TableCell sx={{ textAlign: 'end' }}>
                  <IconButton
                    size="small"
                    onClick={() => openEdit(category)}
                    aria-label={t('admin.edit')}
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => setDeletingCategory(category)}
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

      <ViolenceCategoryFormDialog
        open={formOpen}
        category={editingCategory}
        onClose={() => setFormOpen(false)}
        onSubmitCreate={(payload) => createMutation.mutate(payload)}
        onSubmitUpdate={(id, payload) => updateMutation.mutate({ id, payload })}
        submitting={createMutation.isPending || updateMutation.isPending}
        error={createMutation.isError || updateMutation.isError ? t('admin.saveError') : undefined}
      />

      <ConfirmDialog
        open={!!deletingCategory}
        title={t('admin.violenceCategories.deleteTitle')}
        message={t('admin.violenceCategories.deleteMessage', {
          name: deletingCategory ? translateCategory(deletingCategory, i18n.language) : '',
        })}
        onCancel={() => setDeletingCategory(null)}
        onConfirm={() => deletingCategory && deleteMutation.mutate(deletingCategory.id)}
        loading={deleteMutation.isPending}
      />
    </Box>
  );
}
