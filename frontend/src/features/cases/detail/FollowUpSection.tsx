import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Button,
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import { useAuth } from '../../auth/auth-context';
import { addFollowUp } from '../../../api/cases.api';
import type { CaseResponse } from '../../../api/cases.api';

const OUTCOME_VALUES = [
  'community_resolution',
  'referred_to_justice',
  'in_process',
  'other',
] as const;

export function FollowUpSection({ caseItem }: { caseItem: CaseResponse }) {
  const { t, i18n } = useTranslation();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [comment, setComment] = useState('');
  const [outcome, setOutcome] = useState<(typeof OUTCOME_VALUES)[number]>('in_process');

  const canAddFollowUp = user?.role === 'regional_director' || user?.role === 'administrator';

  const mutation = useMutation({
    mutationFn: () => addFollowUp(caseItem.id, { comment, outcome }),
    onSuccess: async () => {
      setComment('');
      await queryClient.invalidateQueries({ queryKey: ['case', caseItem.id] });
    },
  });

  return (
    <Paper className="flex flex-col gap-3 p-4">
      <Typography variant="h6">{t('caseDetail.followUpHistory')}</Typography>
      {caseItem.followUpEntries.length === 0 && (
        <Typography color="text.secondary">{t('caseDetail.noFollowUps')}</Typography>
      )}
      {caseItem.followUpEntries.map((entry) => (
        <Box key={entry.id}>
          <Typography variant="body2" color="text.secondary">
            {entry.author.fullName} &middot;{' '}
            {new Date(entry.createdAt).toLocaleString(i18n.language)} &middot;{' '}
            {t(`followUpOutcome.${entry.outcome}`)}
          </Typography>
          <Typography>{entry.comment}</Typography>
          <Divider className="mt-2" />
        </Box>
      ))}

      {canAddFollowUp && (
        <Box className="flex flex-col gap-2">
          <Typography variant="subtitle2">{t('caseDetail.addFollowUp')}</Typography>
          <TextField
            multiline
            minRows={2}
            label={t('caseDetail.comment')}
            value={comment}
            onChange={(event) => setComment(event.target.value)}
          />
          <FormControl size="small" sx={{ maxWidth: 240 }}>
            <InputLabel>{t('caseDetail.outcome')}</InputLabel>
            <Select
              value={outcome}
              label={t('caseDetail.outcome')}
              onChange={(event) => setOutcome(event.target.value)}
            >
              {OUTCOME_VALUES.map((value) => (
                <MenuItem key={value} value={value}>
                  {t(`followUpOutcome.${value}`)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button
            variant="contained"
            className="self-start"
            disabled={!comment.trim() || mutation.isPending}
            onClick={() => mutation.mutate()}
          >
            {t('caseDetail.submitFollowUp')}
          </Button>
        </Box>
      )}
    </Paper>
  );
}
