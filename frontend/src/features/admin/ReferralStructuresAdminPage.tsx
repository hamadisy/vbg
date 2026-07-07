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
import {
  createReferralStructure,
  listReferralStructures,
  updateReferralStructure,
  type CreateReferralStructureRequest,
  type ReferralStructure,
  type UpdateReferralStructureRequest,
} from '../../api/referral-structures.api';
import { ReferralStructureFormDialog } from './ReferralStructureFormDialog';

export function ReferralStructuresAdminPage() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [editingStructure, setEditingStructure] = useState<ReferralStructure | null>(null);
  const [formOpen, setFormOpen] = useState(false);

  const structuresQuery = useQuery({
    queryKey: ['admin-referral-structures'],
    queryFn: () => listReferralStructures(undefined, true),
  });
  const regionsQuery = useQuery({ queryKey: ['regions'], queryFn: () => listRegions() });
  const regionNameById = new Map((regionsQuery.data ?? []).map((r) => [r.id, r.name]));

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: ['admin-referral-structures'] });

  const createMutation = useMutation({
    mutationFn: (payload: CreateReferralStructureRequest) => createReferralStructure(payload),
    onSuccess: async () => {
      await invalidate();
      setFormOpen(false);
    },
  });
  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateReferralStructureRequest }) =>
      updateReferralStructure(id, payload),
    onSuccess: async () => {
      await invalidate();
      setFormOpen(false);
    },
  });

  const openCreate = () => {
    createMutation.reset();
    updateMutation.reset();
    setEditingStructure(null);
    setFormOpen(true);
  };
  const openEdit = (structure: ReferralStructure) => {
    createMutation.reset();
    updateMutation.reset();
    setEditingStructure(structure);
    setFormOpen(true);
  };

  return (
    <Box className="flex flex-col gap-4">
      <Box className="flex items-center justify-between">
        <Typography variant="h5">{t('admin.tabs.referralStructures')}</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={openCreate}>
          {t('admin.referralStructures.add')}
        </Button>
      </Box>

      <Paper>
        <Box className="overflow-x-auto">
          <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>{t('admin.referralStructures.name')}</TableCell>
              <TableCell>{t('admin.referralStructures.type')}</TableCell>
              <TableCell>{t('admin.referralStructures.region')}</TableCell>
              <TableCell>{t('admin.referralStructures.contactPhone')}</TableCell>
              <TableCell>{t('admin.active')}</TableCell>
              <TableCell sx={{ textAlign: 'end' }} />
            </TableRow>
          </TableHead>
          <TableBody>
            {(structuresQuery.data ?? []).map((structure) => (
              <TableRow key={structure.id}>
                <TableCell>{structure.name}</TableCell>
                <TableCell>{t(`referralStructureType.${structure.type}`)}</TableCell>
                <TableCell>{regionNameById.get(structure.regionId) ?? '-'}</TableCell>
                <TableCell>{structure.contactPhone || '-'}</TableCell>
                <TableCell>
                  <Chip
                    size="small"
                    color={structure.isActive ? 'success' : 'default'}
                    label={t(structure.isActive ? 'admin.active' : 'admin.inactive')}
                  />
                </TableCell>
                <TableCell sx={{ textAlign: 'end' }}>
                  <IconButton
                    size="small"
                    onClick={() => openEdit(structure)}
                    aria-label={t('admin.edit')}
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          </Table>
        </Box>
      </Paper>

      <ReferralStructureFormDialog
        open={formOpen}
        structure={editingStructure}
        regions={regionsQuery.data ?? []}
        onClose={() => setFormOpen(false)}
        onSubmitCreate={(payload) => createMutation.mutate(payload)}
        onSubmitUpdate={(id, payload) => updateMutation.mutate({ id, payload })}
        submitting={createMutation.isPending || updateMutation.isPending}
        error={createMutation.isError || updateMutation.isError ? t('admin.saveError') : undefined}
      />
    </Box>
  );
}
