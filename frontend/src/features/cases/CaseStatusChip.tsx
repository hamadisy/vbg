import { Chip } from '@mui/material';
import type { ChipProps } from '@mui/material';
import { useTranslation } from 'react-i18next';
import type { CaseStatus } from '../../api/cases.api';

const COLOR_BY_STATUS: Record<CaseStatus, ChipProps['color']> = {
  new: 'info',
  acknowledged: 'warning',
  in_process: 'primary',
  closed: 'default',
};

export function CaseStatusChip({ status }: { status: CaseStatus }) {
  const { t } = useTranslation();
  return <Chip size="small" color={COLOR_BY_STATUS[status]} label={t(`caseStatus.${status}`)} />;
}
