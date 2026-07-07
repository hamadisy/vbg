import { useEffect, useMemo } from 'react';
import { CacheProvider } from '@emotion/react';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './i18n/i18n';
import { isRtlLanguage } from './i18n/i18n';
import { createAppTheme } from './theme/theme';
import { createEmotionCache } from './theme/emotion-cache';
import { AuthProvider } from './features/auth/AuthContext';
import { LoginPage } from './features/auth/LoginPage';
import { OpenCasesBadge } from './components/OpenCasesBadge';
import { ProtectedRoute } from './routes/ProtectedRoute';
import { AppLayout } from './components/layout/AppLayout';
import { NewCaseWizard } from './features/cases/new-case/NewCaseWizard';
import { CaseListPage } from './features/cases/list/CaseListPage';
import { CaseDetailPage } from './features/cases/detail/CaseDetailPage';
import { DashboardPage } from './features/dashboard/DashboardPage';
import { AdminLayout } from './features/admin/AdminLayout';
import { UsersAdminPage } from './features/admin/UsersAdminPage';
import { RegionsAdminPage } from './features/admin/RegionsAdminPage';
import { ViolenceCategoriesAdminPage } from './features/admin/ViolenceCategoriesAdminPage';
import { ReferralStructuresAdminPage } from './features/admin/ReferralStructuresAdminPage';
import { NotificationRecipientsAdminPage } from './features/admin/NotificationRecipientsAdminPage';
import { AuditLogAdminPage } from './features/admin/AuditLogAdminPage';

const queryClient = new QueryClient();

function AppShell() {
  const { i18n } = useTranslation();
  const direction = isRtlLanguage(i18n.language) ? 'rtl' : 'ltr';

  const theme = useMemo(() => createAppTheme(direction), [direction]);
  const cache = useMemo(() => createEmotionCache(direction), [direction]);

  useEffect(() => {
    document.documentElement.dir = direction;
    document.documentElement.lang = i18n.language;
  }, [direction, i18n.language]);

  return (
    <CacheProvider value={cache}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <BrowserRouter>
          <Routes>
            <Route
              path="/login"
              element={
                <>
                  <OpenCasesBadge variant="fixed" />
                  <LoginPage />
                </>
              }
            />
            <Route element={<ProtectedRoute />}>
              <Route element={<AppLayout />}>
                <Route path="/" element={<CaseListPage />} />
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/cases/:id" element={<CaseDetailPage />} />
                <Route
                  element={<ProtectedRoute allowedRoles={['community_relay', 'administrator']} />}
                >
                  <Route path="/cases/new" element={<NewCaseWizard />} />
                </Route>
                <Route element={<ProtectedRoute allowedRoles={['administrator']} />}>
                  <Route path="/admin" element={<AdminLayout />}>
                    <Route index element={<Navigate to="/admin/users" replace />} />
                    <Route path="users" element={<UsersAdminPage />} />
                    <Route path="regions" element={<RegionsAdminPage />} />
                    <Route path="violence-categories" element={<ViolenceCategoriesAdminPage />} />
                    <Route path="referral-structures" element={<ReferralStructuresAdminPage />} />
                    <Route
                      path="notification-recipients"
                      element={<NotificationRecipientsAdminPage />}
                    />
                    <Route path="audit-log" element={<AuditLogAdminPage />} />
                  </Route>
                </Route>
              </Route>
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </CacheProvider>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <AppShell />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
