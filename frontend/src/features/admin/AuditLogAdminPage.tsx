import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import { listAuditLog } from '../../api/audit-log.api';
import { listUsers } from '../../api/users.api';

export function AuditLogAdminPage() {
  const { t, i18n } = useTranslation();
  const [entityType, setEntityType] = useState('');
  const [entityId, setEntityId] = useState('');
  const [userId, setUserId] = useState('');

  const usersQuery = useQuery({ queryKey: ['admin-users'], queryFn: () => listUsers() });

  const auditQuery = useQuery({
    queryKey: ['admin-audit-log', { entityType, entityId, userId }],
    queryFn: () =>
      listAuditLog({
        entityType: entityType || undefined,
        entityId: entityId || undefined,
        userId: userId || undefined,
      }),
  });

  return (
    <Box className="flex flex-col gap-4">
      <Typography variant="h5">{t('admin.tabs.auditLog')}</Typography>

      <Paper className="flex flex-wrap gap-3 p-4">
        <TextField
          size="small"
          label={t('admin.auditLog.entityType')}
          value={entityType}
          onChange={(event) => setEntityType(event.target.value)}
          sx={{ minWidth: 160 }}
        />
        <TextField
          size="small"
          label={t('admin.auditLog.entityId')}
          value={entityId}
          onChange={(event) => setEntityId(event.target.value)}
          sx={{ minWidth: 240 }}
        />
        <FormControl size="small" sx={{ minWidth: 200 }}>
          <InputLabel>{t('admin.auditLog.user')}</InputLabel>
          <Select
            value={userId}
            label={t('admin.auditLog.user')}
            onChange={(event) => setUserId(event.target.value)}
          >
            <MenuItem value="">{t('admin.auditLog.allUsers')}</MenuItem>
            {(usersQuery.data ?? []).map((user) => (
              <MenuItem key={user.id} value={user.id}>
                {user.fullName} ({user.username})
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Paper>

      <Paper>
        <Box className="overflow-x-auto">
          <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>{t('admin.auditLog.timestamp')}</TableCell>
              <TableCell>{t('admin.auditLog.user')}</TableCell>
              <TableCell>{t('admin.auditLog.action')}</TableCell>
              <TableCell>{t('admin.auditLog.entityType')}</TableCell>
              <TableCell>{t('admin.auditLog.entityId')}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {(auditQuery.data ?? []).map((entry) => (
              <TableRow key={entry.id}>
                <TableCell>{new Date(entry.timestamp).toLocaleString(i18n.language)}</TableCell>
                <TableCell>{entry.user.fullName}</TableCell>
                <TableCell>{t(`auditAction.${entry.action}`)}</TableCell>
                <TableCell>{entry.entityType}</TableCell>
                <TableCell className="font-mono text-xs">{entry.entityId}</TableCell>
              </TableRow>
            ))}
          </TableBody>
          </Table>
        </Box>
        {(auditQuery.data ?? []).length === 0 && (
          <Typography color="text.secondary" className="p-4">
            {t('admin.auditLog.empty')}
          </Typography>
        )}
      </Paper>
    </Box>
  );
}
