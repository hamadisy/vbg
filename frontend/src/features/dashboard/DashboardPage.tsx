import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { Box, Card, CardContent, Paper, Typography } from '@mui/material';
import { BarChart } from '@mui/x-charts/BarChart';
import { getDashboardStats } from '../../api/dashboard.api';
import { listViolenceCategories, translateCategory } from '../../api/violence-categories.api';
import { getViolenceCategoryIcon } from '../cases/new-case/violenceCategoryIcons';

function ProportionalBar({ label, count, max }: { label: string; count: number; max: number }) {
  const percent = max > 0 ? Math.round((count / max) * 100) : 0;
  return (
    <Box className="flex flex-col gap-1">
      <Box className="flex justify-between">
        <Typography variant="body2">{label}</Typography>
        <Typography variant="body2" color="text.secondary">
          {count}
        </Typography>
      </Box>
      <Box sx={{ height: 8, borderRadius: 1, bgcolor: 'action.hover' }}>
        <Box sx={{ height: 8, borderRadius: 1, bgcolor: 'primary.main', width: `${percent}%` }} />
      </Box>
    </Box>
  );
}

export function DashboardPage() {
  const { t, i18n } = useTranslation();

  const statsQuery = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: () => getDashboardStats(),
  });
  const categoriesQuery = useQuery({
    queryKey: ['violence-categories'],
    queryFn: () => listViolenceCategories(),
  });

  const stats = statsQuery.data;
  const categoryLabelByCode = new Map(
    (categoriesQuery.data ?? []).map((category) => [
      category.code,
      translateCategory(category, i18n.language),
    ]),
  );

  if (statsQuery.isLoading) {
    return <Typography>{t('caseList.loading')}</Typography>;
  }
  if (!stats) {
    return null;
  }

  const maxByCategory = Math.max(1, ...stats.casesByViolenceCategory.map((c) => c.count));

  return (
    <Box className="mx-auto flex max-w-4xl flex-col gap-4">
      <Typography variant="h5">{t('dashboard.title')}</Typography>

      <Card>
        <CardContent>
          <Typography color="text.secondary">{t('dashboard.totalCases')}</Typography>
          <Typography variant="h3">{stats.totalCases}</Typography>
        </CardContent>
      </Card>

      <Paper className="p-4">
        <Typography variant="h6" className="mb-2">
          {t('dashboard.byRegion')}
        </Typography>
        {stats.casesByRegion.length === 0 ? (
          <Typography color="text.secondary">{t('dashboard.noData')}</Typography>
        ) : (
          <BarChart
            height={Math.max(120, stats.casesByRegion.length * 48)}
            layout="horizontal"
            series={[
              { data: stats.casesByRegion.map((r) => r.count), label: t('dashboard.cases') },
            ]}
            yAxis={[
              {
                data: stats.casesByRegion.map((r) => r.regionName),
                scaleType: 'band',
                width: 'auto',
              },
            ]}
            xAxis={[{ min: 0 }]}
          />
        )}
      </Paper>

      <Paper className="flex flex-col gap-3 p-4">
        <Typography variant="h6">{t('dashboard.byViolenceType')}</Typography>
        {stats.casesByViolenceCategory.length === 0 ? (
          <Typography color="text.secondary">{t('dashboard.noData')}</Typography>
        ) : (
          stats.casesByViolenceCategory.map((entry) => {
            const Icon = getViolenceCategoryIcon(entry.code);
            const label = categoryLabelByCode.get(entry.code) ?? entry.code;
            return (
              <Box key={entry.violenceCategoryId} className="flex items-center gap-3">
                <Icon color="action" />
                <Box className="flex-1">
                  <ProportionalBar label={label} count={entry.count} max={maxByCategory} />
                </Box>
              </Box>
            );
          })
        )}
      </Paper>

      {stats.casesByRegionAndCategory.length > 0 && (
        <Paper className="flex flex-col gap-2 p-4">
          <Typography variant="h6" className="mb-1">
            {t('dashboard.byRegionAndType')}
          </Typography>
          {stats.casesByRegionAndCategory.map((entry, index) => (
            <Box
              key={`${entry.regionId}-${entry.violenceCategoryId}`}
              className="flex items-center justify-between gap-2 py-1"
              sx={index > 0 ? { borderTop: '1px solid', borderColor: 'divider' } : undefined}
            >
              <Typography variant="body2">
                {entry.regionName} &middot; {categoryLabelByCode.get(entry.code) ?? entry.code}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {entry.count}
              </Typography>
            </Box>
          ))}
        </Paper>
      )}
    </Box>
  );
}
