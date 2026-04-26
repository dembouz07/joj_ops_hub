import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { setAuthToken, getStoredToken } from '../lib/api';
import type { User } from '../types';

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

const DEMO_USER: User = {
  id: 1,
  name: 'Moussa Diallo',
  email: 'moussa.diallo@joj2026.sn',
  role_id: 1,
  site_id: null,
  team: null,
  role: { id: 1, name: 'chef d\'équipe', description: 'Chef d\'équipe' },
};

const DEMO_MANAGER: User = {
  id: 9,
  name: 'Abdoulaye Seck',
  email: 'abdoulaye.seck@joj2026.sn',
  role_id: 7,
  site_id: null,
  team: 'accreditations',
  role: { id: 7, name: 'manager', description: 'Manager opérationnel' },
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const stored = getStoredToken();
    if (stored) {
      setToken(stored);
      setUser(DEMO_USER);
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, _password: string) => {
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 1200));
    const demoToken = 'demo_token_joj_2026';
    setAuthToken(demoToken);
    setToken(demoToken);
    
    // Si l'email correspond au manager, connecter en tant que manager
    if (email === 'abdoulaye.seck@joj2026.sn' || email.toLowerCase().includes('manager')) {
      setUser({ ...DEMO_MANAGER, email });
    } else {
      setUser({ ...DEMO_USER, email });
    }
    
    setIsLoading(false);
  };

  const logout = () => {
    setAuthToken(null);
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
