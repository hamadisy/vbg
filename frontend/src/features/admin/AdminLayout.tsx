import { Box, Tab, Tabs } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';

const TABS = [
  { path: '/admin/users', key: 'users' },
  { path: '/admin/regions', key: 'regions' },
  { path: '/admin/violence-categories', key: 'violenceCategories' },
  { path: '/admin/referral-structures', key: 'referralStructures' },
  { path: '/admin/notification-recipients', key: 'notificationRecipients' },
  { path: '/admin/audit-log', key: 'auditLog' },
] as const;

export function AdminLayout() {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();

  const currentTab =
    TABS.find((tab) => location.pathname.startsWith(tab.path))?.path ?? TABS[0].path;

  return (
    <Box className="mx-auto flex max-w-5xl flex-col gap-4">
      <Tabs
        value={currentTab}
        onChange={(_event, value: string) => void navigate(value)}
        variant="scrollable"
        scrollButtons="auto"
      >
        {TABS.map((tab) => (
          <Tab key={tab.path} value={tab.path} label={t(`admin.tabs.${tab.key}`)} />
        ))}
      </Tabs>
      <Outlet />
    </Box>
  );
}
