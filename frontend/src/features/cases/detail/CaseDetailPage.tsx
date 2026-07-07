import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { Box, Divider, Paper, Typography } from '@mui/material';
import { useAuth } from '../../auth/auth-context';
import { getCase } from '../../../api/cases.api';
import { listViolenceCategories, translateCategory } from '../../../api/violence-categories.api';
import { CaseStatusChip } from '../CaseStatusChip';
import { StatusUpdateControl } from './StatusUpdateControl';
import { FollowUpSection } from './FollowUpSection';
import { CaseAuditTrail } from './CaseAuditTrail';

function InfoRow({ label, value }: { label: string; value?: string }) {
  return (
    <Box className="flex justify-between gap-4 py-1">
      <Typography color="text.secondary">{label}</Typography>
      <Typography sx={{ textAlign: 'end' }}>{value || '-'}</Typography>
    </Box>
  );
}

export function CaseDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { t, i18n } = useTranslation();
  const { user } = useAuth();

  const caseQuery = useQuery({
    queryKey: ['case', id],
    queryFn: () => getCase(id!),
    enabled: !!id,
  });
  const categoriesQuery = useQuery({
    queryKey: ['violence-categories'],
    queryFn: () => listViolenceCategories(),
  });

  if (caseQuery.isLoading) {
    return <Typography>{t('caseList.loading')}</Typography>;
  }

  const caseItem = caseQuery.data;
  if (!caseItem) {
    return <Typography color="error">{t('caseDetail.notFound')}</Typography>;
  }

  const fullCategory = categoriesQuery.data?.find((c) => c.id === caseItem.violenceCategory.id);
  const categoryLabel = fullCategory
    ? translateCategory(fullCategory, i18n.language)
    : caseItem.violenceCategory.code;

  return (
    <Box className="mx-auto flex max-w-3xl flex-col gap-4">
      <Paper className="flex flex-col gap-3 p-4">
        <Box className="flex flex-wrap items-center justify-between gap-2">
          <Typography variant="h5">{categoryLabel}</Typography>
          <CaseStatusChip status={caseItem.status} />
        </Box>
        <InfoRow
          label={t('newCase.fields.region')}
          value={`${caseItem.region.name}${caseItem.region.municipality ? ` - ${caseItem.region.municipality}` : ''}`}
        />
        <InfoRow
          label={t('newCase.fields.incidentAt')}
          value={
            caseItem.incidentAt
              ? new Date(caseItem.incidentAt).toLocaleString(i18n.language)
              : undefined
          }
        />
        <InfoRow
          label={t('caseDetail.createdBy')}
          value={`${caseItem.createdBy.fullName} · ${new Date(caseItem.createdAt).toLocaleString(i18n.language)}`}
        />
        <Divider />
        <Typography variant="subtitle2">{t('newCase.fields.description')}</Typography>
        <Typography>{caseItem.description}</Typography>
        {caseItem.measuresTaken && (
          <>
            <Typography variant="subtitle2">{t('newCase.fields.measuresTaken')}</Typography>
            <Typography>{caseItem.measuresTaken}</Typography>
          </>
        )}
        <InfoRow
          label={t('newCase.fields.referralStructure')}
          value={caseItem.referralStructure.name}
        />
      </Paper>

      <Paper className="flex flex-col gap-1 p-4">
        <Typography variant="h6" className="mb-2">
          {t('caseDetail.victimSituation')}
        </Typography>
        <InfoRow
          label={t('newCase.fields.ageRange')}
          value={t(`newCase.ageRange.${caseItem.victim.ageRange}`)}
        />
        <InfoRow label={t('newCase.fields.sex')} value={t(`newCase.sex.${caseItem.victim.sex}`)} />
        <InfoRow
          label={t('newCase.fields.relationshipToPerpetrator')}
          value={t(`newCase.relationship.${caseItem.victim.relationshipToPerpetrator}`)}
        />
        <InfoRow
          label={t('newCase.fields.perpetratorKnown')}
          value={caseItem.victim.perpetratorKnown ? t('caseDetail.yes') : t('caseDetail.no')}
        />
        <InfoRow
          label={t('newCase.fields.cohabitingWithPerpetrator')}
          value={
            caseItem.victim.cohabitingWithPerpetrator ? t('caseDetail.yes') : t('caseDetail.no')
          }
        />
        <InfoRow
          label={t('newCase.fields.vulnerabilityFactors')}
          value={
            caseItem.victim.vulnerabilityFactors?.length
              ? caseItem.victim.vulnerabilityFactors
                  .map((factor) => t(`newCase.vulnerabilityFactor.${factor}`))
                  .join(', ')
              : undefined
          }
        />
        <InfoRow
          label={t('newCase.fields.safetyRisk')}
          value={t(`newCase.safetyRisk.${caseItem.victim.safetyRisk}`)}
        />
      </Paper>

      <Paper className="p-4">
        <StatusUpdateControl caseItem={caseItem} />
      </Paper>

      <FollowUpSection caseItem={caseItem} />

      {user?.role === 'administrator' && <CaseAuditTrail caseId={caseItem.id} />}
    </Box>
  );
}
