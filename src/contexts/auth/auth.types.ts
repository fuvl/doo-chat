import type { ReactNode } from 'react';

export interface AuthContextValue {
  username: string | null;
  login: (username: string) => void;
  logout: () => void;
}

export interface AuthProviderProps {
  children: ReactNode;
}