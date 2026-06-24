'use client';
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { authAPI } from '@/lib/api';
import { useRouter } from 'next/navigation';

interface User {
  _id: string;
  name: string;
  email: string;
  role: 'donor' | 'ngo' | 'volunteer' | 'admin';
  avatar?: string;
  isVerified: boolean;
  ngoName?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  setUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const storedToken = localStorage.getItem('foodbridge_token');
    const storedUser = localStorage.getItem('foodbridge_user');
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    const { data } = await authAPI.login({ email, password });
    setToken(data.token);
    setUser(data.user);
    localStorage.setItem('foodbridge_token', data.token);
    localStorage.setItem('foodbridge_user', JSON.stringify(data.user));
    const dashboardMap: Record<string, string> = {
      donor: '/dashboard/donor',
      ngo: '/dashboard/ngo',
      volunteer: '/dashboard/volunteer',
      admin: '/dashboard/admin',
    };
    router.push(dashboardMap[data.user.role] || '/');
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('foodbridge_token');
    localStorage.removeItem('foodbridge_user');
    router.push('/auth/login');
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      token, 
      loading, 
      isAuthenticated: !!user, 
      login, 
      logout, 
      setUser 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
