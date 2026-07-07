import { useCallback, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import i18n, { LANGUAGE_STORAGE_KEY } from '../../i18n/i18n';
import { AUTH_TOKEN_STORAGE_KEY } from '../../api/client';
import * as authApi from '../../api/auth.api';
import type { CurrentUser } from '../../api/auth.api';
import { AuthContext } from './auth-context';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadCurrentUser = useCallback(async () => {
    const token = localStorage.getItem(AUTH_TOKEN_STORAGE_KEY);
    if (!token) {
      setUser(null);
      setIsLoading(false);
      return;
    }
    try {
      const currentUser = await authApi.me();
      setUser(currentUser);
      if (!localStorage.getItem(LANGUAGE_STORAGE_KEY)) {
        await i18n.changeLanguage(currentUser.language);
      }
    } catch {
      localStorage.removeItem(AUTH_TOKEN_STORAGE_KEY);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    // Mount-time auth bootstrap (check localStorage, fetch /auth/me) can't be
    // expressed any other way than an effect that eventually sets state.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void loadCurrentUser();
  }, [loadCurrentUser]);

  const login = useCallback(
    async (username: string, password: string) => {
      const { accessToken } = await authApi.login({ username, password });
      localStorage.setItem(AUTH_TOKEN_STORAGE_KEY, accessToken);
      await loadCurrentUser();
    },
    [loadCurrentUser],
  );

  const logout = useCallback(() => {
    localStorage.removeItem(AUTH_TOKEN_STORAGE_KEY);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
