import { useEffect, useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Card,
  CardActionArea,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import { useAuth } from '../../auth/auth-context';
import { listCases } from '../../../api/cases.api';
import type { CaseStatus } from '../../../api/cases.api';
import { listRegions } from '../../../api/regions.api';
import { listViolenceCategories, translateCategory } from '../../../api/violence-categories.api';
import { CaseStatusChip } from '../CaseStatusChip';

const STATUS_VALUES: CaseStatus[] = ['new', 'acknowledged', 'in_process', 'closed'];
const REGION_FILTER_ROLES = ['administrator', 'institutional_user'];

function useDebouncedValue<T>(value: T, delayMs: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const handle = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(handle);
  }, [value, delayMs]);
  return debounced;
}

export function CaseListPage() {
  const { t, i18n } = useTranslation();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [status, setStatus] = useState('');
  const [violenceCategoryId, setViolenceCategoryId] = useState('');
  const [regionId, setRegionId] = useState('');
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebouncedValue(search, 300);

  const showRegionFilter = !!user && REGION_FILTER_ROLES.includes(user.role);

  const casesQuery = useQuery({
    queryKey: ['cases', { status, violenceCategoryId, regionId, search: debouncedSearch }],
    queryFn: () =>
      listCases({
        status: (status || undefined) as CaseStatus | undefined,
        violenceCategoryId: violenceCategoryId || undefined,
        regionId: showRegionFilter ? regionId || undefined : undefined,
        search: debouncedSearch || undefined,
      }),
  });

  const categoriesQuery = useQuery({
    queryKey: ['violence-categories'],
    queryFn: () => listViolenceCategories(),
  });
  const regionsQuery = useQuery({
    queryKey: ['regions'],
    queryFn: () => listRegions(),
    enabled: showRegionFilter,
  });

  const categoryLabelById = useMemo(() => {
    const map = new Map<string, string>();
    for (const category of categoriesQuery.data ?? []) {
      map.set(category.id, translateCategory(category, i18n.language));
    }
    return map;
  }, [categoriesQuery.data, i18n.language]);

  return (
    <Box className="mx-auto flex max-w-4xl flex-col gap-4">
      <Typography variant="h5">{t('caseList.title')}</Typography>

      <Paper className="flex flex-wrap gap-3 p-4">
        <FormControl size="small" sx={{ minWidth: 160 }}>
          <InputLabel>{t('caseList.filters.status')}</InputLabel>
          <Select
            value={status}
            label={t('caseList.filters.status')}
            onChange={(event) => setStatus(event.target.value)}
          >
            <MenuItem value="">{t('caseList.filters.all')}</MenuItem>
            {STATUS_VALUES.map((value) => (
              <MenuItem key={value} value={value}>
                {t(`caseStatus.${value}`)}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ minWidth: 208 }}>
          <InputLabel>{t('caseList.filters.violenceType')}</InputLabel>
          <Select
            value={violenceCategoryId}
            label={t('caseList.filters.violenceType')}
            onChange={(event) => setViolenceCategoryId(event.target.value)}
          >
            <MenuItem value="">{t('caseList.filters.all')}</MenuItem>
            {(categoriesQuery.data ?? []).map((category) => (
              <MenuItem key={category.id} value={category.id}>
                {translateCategory(category, i18n.language)}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {showRegionFilter && (
          <FormControl size="small" sx={{ minWidth: 160 }}>
            <InputLabel>{t('caseList.filters.region')}</InputLabel>
            <Select
              value={regionId}
              label={t('caseList.filters.region')}
              onChange={(event) => setRegionId(event.target.value)}
            >
              <MenuItem value="">{t('caseList.filters.all')}</MenuItem>
              {(regionsQuery.data ?? []).map((region) => (
                <MenuItem key={region.id} value={region.id}>
                  {region.name}
                  {region.municipality ? ` - ${region.municipality}` : ''}
                  {region.village ? ` (${region.village})` : ''}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}

        <TextField
          size="small"
          className="flex-1"
          sx={{ minWidth: 208 }}
          label={t('caseList.filters.search')}
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
      </Paper>

      {casesQuery.isLoading && <Typography>{t('caseList.loading')}</Typography>}
      {casesQuery.data && casesQuery.data.length === 0 && (
        <Typography color="text.secondary">{t('caseList.empty')}</Typography>
      )}

      <Box className="flex flex-col gap-2">
        {(casesQuery.data ?? []).map((c) => (
          <Card key={c.id} variant="outlined">
            <CardActionArea onClick={() => void navigate(`/cases/${c.id}`)} className="p-4">
              <Box className="flex flex-wrap items-center justify-between gap-2">
                <Box>
                  <Typography variant="subtitle1">
                    {categoryLabelById.get(c.violenceCategory.id) ?? c.violenceCategory.code}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {c.region.name}
                    {c.region.municipality ? ` - ${c.region.municipality}` : ''} &middot;{' '}
                    {new Date(c.createdAt).toLocaleDateString(i18n.language)}
                  </Typography>
                </Box>
                <CaseStatusChip status={c.status} />
              </Box>
            </CardActionArea>
          </Card>
        ))}
      </Box>
    </Box>
  );
}
