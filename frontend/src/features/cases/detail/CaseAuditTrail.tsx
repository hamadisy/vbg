import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { Paper, Typography } from '@mui/material';
import { listAuditLog } from '../../../api/audit-log.api';

// Admin-only - the backend's /audit-log endpoint is @Roles(Administrator), so
// callers must only render this component for administrators.
export function CaseAuditTrail({ caseId }: { caseId: string }) {
  const { t, i18n } = useTranslation();
  const auditQuery = useQuery({
    queryKey: ['audit-log', 'Case', caseId],
    queryFn: () => listAuditLog({ entityType: 'Case', entityId: caseId }),
  });

  return (
    <Paper className="flex flex-col gap-2 p-4">
      <Typography variant="h6">{t('caseDetail.auditTrail')}</Typography>
      {(auditQuery.data ?? []).map((entry) => (
        <Typography key={entry.id} variant="body2" color="text.secondary">
          {entry.user.fullName} &middot; {t(`auditAction.${entry.action}`)} &middot;{' '}
          {new Date(entry.timestamp).toLocaleString(i18n.language)}
        </Typography>
      ))}
    </Paper>
  );
}
