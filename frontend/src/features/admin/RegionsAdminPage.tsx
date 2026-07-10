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
  createRegion,
  deactivateRegion,
  listRegions,
  updateRegion,
  type CreateRegionRequest,
  type Region,
  type UpdateRegionRequest,
} from '../../api/regions.api';
import { RegionFormDialog } from './RegionFormDialog';
import { ConfirmDialog } from './ConfirmDialog';

export function RegionsAdminPage() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [editingRegion, setEditingRegion] = useState<Region | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [deletingRegion, setDeletingRegion] = useState<Region | null>(null);

  const regionsQuery = useQuery({
    queryKey: ['admin-regions'],
    queryFn: () => listRegions(),
  });

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ['admin-regions'] });

  const createMutation = useMutation({
    mutationFn: (payload: CreateRegionRequest) => createRegion(payload),
    onSuccess: async () => {
      await invalidate();
      setFormOpen(false);
    },
  });
  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateRegionRequest }) =>
      updateRegion(id, payload),
    onSuccess: async () => {
      await invalidate();
      setFormOpen(false);
    },
  });
  const deleteMutation = useMutation({
    mutationFn: (id: string) => deactivateRegion(id),
    onSuccess: async () => {
      await invalidate();
      setDeletingRegion(null);
    },
  });

  const openCreate = () => {
    createMutation.reset();
    updateMutation.reset();
    setEditingRegion(null);
    setFormOpen(true);
  };
  const openEdit = (region: Region) => {
    createMutation.reset();
    updateMutation.reset();
    setEditingRegion(region);
    setFormOpen(true);
  };

  return (
    <Box className="flex flex-col gap-4">
      <Box className="flex items-center justify-between">
        <Typography variant="h5">{t('admin.tabs.regions')}</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={openCreate}>
          {t('admin.regions.add')}
        </Button>
      </Box>

      <Paper>
        <Box className="overflow-x-auto">
          <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>{t('admin.regions.name')}</TableCell>
              <TableCell>{t('admin.regions.municipality')}</TableCell>
              <TableCell>{t('admin.regions.village')}</TableCell>
              <TableCell>{t('admin.active')}</TableCell>
              <TableCell sx={{ textAlign: 'end' }} />
            </TableRow>
          </TableHead>
          <TableBody>
            {(regionsQuery.data ?? []).map((region) => (
              <TableRow key={region.id}>
                <TableCell>{region.name}</TableCell>
                <TableCell>{region.municipality}</TableCell>
                <TableCell>{region.village || '-'}</TableCell>
                <TableCell>
                  <Chip
                    size="small"
                    color={region.isActive ? 'success' : 'default'}
                    label={t(region.isActive ? 'admin.active' : 'admin.inactive')}
                  />
                </TableCell>
                <TableCell sx={{ textAlign: 'end' }}>
                  <IconButton
                    size="small"
                    onClick={() => openEdit(region)}
                    aria-label={t('admin.edit')}
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => setDeletingRegion(region)}
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

      <RegionFormDialog
        open={formOpen}
        region={editingRegion}
        onClose={() => setFormOpen(false)}
        onSubmitCreate={(payload) => createMutation.mutate(payload)}
        onSubmitUpdate={(id, payload) => updateMutation.mutate({ id, payload })}
        submitting={createMutation.isPending || updateMutation.isPending}
        error={createMutation.isError || updateMutation.isError ? t('admin.saveError') : undefined}
      />

      <ConfirmDialog
        open={!!deletingRegion}
        title={t('admin.regions.deleteTitle')}
        message={t('admin.regions.deleteMessage', { name: deletingRegion?.name ?? '' })}
        onCancel={() => setDeletingRegion(null)}
        onConfirm={() => deletingRegion && deleteMutation.mutate(deletingRegion.id)}
        loading={deleteMutation.isPending}
      />
    </Box>
  );
}
