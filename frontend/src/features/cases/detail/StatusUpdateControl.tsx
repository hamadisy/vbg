import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { Box, Button, FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { useAuth } from '../../auth/auth-context';
import { updateCaseStatus } from '../../../api/cases.api';
import type { CaseResponse, CaseStatus } from '../../../api/cases.api';

const STATUS_VALUES: CaseStatus[] = ['new', 'acknowledged', 'in_process', 'closed'];

export function StatusUpdateControl({ caseItem }: { caseItem: CaseResponse }) {
  const { t } = useTranslation();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [nextStatus, setNextStatus] = useState<CaseStatus>(caseItem.status);

  const mutation = useMutation({
    mutationFn: (status: CaseStatus) => updateCaseStatus(caseItem.id, { status }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['case', caseItem.id] });
      await queryClient.invalidateQueries({ queryKey: ['cases'] });
    },
  });

  if (!user) {
    return null;
  }

  if (user.role === 'institutional_user') {
    if (caseItem.status !== 'new') {
      return null;
    }
    return (
      <Button
        variant="contained"
        onClick={() => mutation.mutate('acknowledged')}
        disabled={mutation.isPending}
      >
        {t('caseDetail.acknowledge')}
      </Button>
    );
  }

  if (user.role === 'regional_director' || user.role === 'administrator') {
    return (
      <Box className="flex items-center gap-2">
        <FormControl size="small" sx={{ minWidth: 160 }}>
          <InputLabel>{t('caseDetail.status')}</InputLabel>
          <Select
            value={nextStatus}
            label={t('caseDetail.status')}
            onChange={(event) => setNextStatus(event.target.value)}
          >
            {STATUS_VALUES.map((value) => (
              <MenuItem key={value} value={value}>
                {t(`caseStatus.${value}`)}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Button
          variant="contained"
          disabled={nextStatus === caseItem.status || mutation.isPending}
          onClick={() => mutation.mutate(nextStatus)}
        >
          {t('caseDetail.updateStatus')}
        </Button>
      </Box>
    );
  }

  return null;
}
