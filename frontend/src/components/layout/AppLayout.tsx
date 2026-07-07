import { useState } from 'react';
import type { ReactElement } from 'react';
import {
  AppBar,
  Box,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Tooltip,
  Typography,
} from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import DashboardIcon from '@mui/icons-material/Dashboard';
import LanguageIcon from '@mui/icons-material/Language';
import LogoutIcon from '@mui/icons-material/Logout';
import { useTranslation } from 'react-i18next';
import { Link, Outlet } from 'react-router-dom';
import { useAuth } from '../../features/auth/auth-context';
import { LANGUAGE_STORAGE_KEY, SUPPORTED_LANGUAGES } from '../../i18n/i18n';
import { OpenCasesBadge } from '../OpenCasesBadge';

const CAN_CREATE_CASE_ROLES = ['community_relay', 'administrator'];

function NavAction({
  to,
  label,
  icon,
}: {
  to: string;
  label: string;
  icon: ReactElement;
}) {
  return (
    <>
      <Tooltip title={label}>
        <IconButton
          component={Link}
          to={to}
          color="inherit"
          aria-label={label}
          sx={{ display: { xs: 'inline-flex', sm: 'none' } }}
        >
          {icon}
        </IconButton>
      </Tooltip>
      <Button
        component={Link}
        to={to}
        color="inherit"
        startIcon={icon}
        className="shrink-0"
        sx={{ display: { xs: 'none', sm: 'inline-flex' } }}
      >
        {label}
      </Button>
    </>
  );
}

export function AppLayout() {
  const { t, i18n } = useTranslation();
  const { user, logout } = useAuth();
  const [languageMenuAnchor, setLanguageMenuAnchor] = useState<HTMLElement | null>(null);

  const handleLanguageChange = (language: string) => {
    void i18n.changeLanguage(language);
    localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
    setLanguageMenuAnchor(null);
  };

  return (
    <Box className="flex h-full flex-col">
      <AppBar position="static" color="primary">
        <Toolbar className="gap-1 sm:gap-2">
          <Box className="flex grow items-center gap-3">
            <Box
              component={Link}
              to="/"
              className="flex items-center gap-2 text-inherit no-underline"
            >
              <img src="/img/csvvdh-logo.png" alt="CSVVDH" className="h-8" />
              <Typography variant="h6" sx={{ display: { xs: 'none', sm: 'block' } }}>
                {t('app.title')}
              </Typography>
            </Box>
            <OpenCasesBadge variant="inline" />
          </Box>
          {user && (
            <NavAction to="/dashboard" label={t('dashboard.navLink')} icon={<DashboardIcon />} />
          )}
          {user && CAN_CREATE_CASE_ROLES.includes(user.role) && (
            <NavAction to="/cases/new" label={t('newCase.navLink')} icon={<AddCircleIcon />} />
          )}
          {user?.role === 'administrator' && (
            <NavAction to="/admin" label={t('admin.navLink')} icon={<AdminPanelSettingsIcon />} />
          )}
          {user && (
            <Typography variant="body2" sx={{ display: { xs: 'none', sm: 'block' } }}>
              {user.fullName}
            </Typography>
          )}
          <IconButton
            color="inherit"
            onClick={(event) => setLanguageMenuAnchor(event.currentTarget)}
            aria-label={t('language.label')}
          >
            <LanguageIcon />
          </IconButton>
          <Menu
            anchorEl={languageMenuAnchor}
            open={!!languageMenuAnchor}
            onClose={() => setLanguageMenuAnchor(null)}
          >
            {SUPPORTED_LANGUAGES.map((language) => (
              <MenuItem key={language} onClick={() => handleLanguageChange(language)}>
                {language.toUpperCase()}
              </MenuItem>
            ))}
          </Menu>
          <IconButton color="inherit" onClick={logout} aria-label={t('auth.logout')}>
            <LogoutIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Box component="main" className="flex-1 p-4">
        <Outlet />
      </Box>
    </Box>
  );
}
