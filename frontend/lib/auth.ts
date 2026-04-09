import { jwtDecode } from 'jwt-decode';
import type { AuthPayload, Role } from './types';

const TOKEN_KEY = 'access_token';

export const saveToken = (token: string): void => {
  localStorage.setItem(TOKEN_KEY, token);
  document.cookie = `${TOKEN_KEY}=${token}; path=/; max-age=${
    60 * 60 * 24
  }; SameSite=Strict`;
};

export const removeToken = (): void => {
  localStorage.removeItem(TOKEN_KEY);
  document.cookie = `${TOKEN_KEY}=; path=/; max-age=0`;
};

export const getToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(TOKEN_KEY);
};

export const getPayload = (): AuthPayload | null => {
  const token = getToken();
  if (!token) return null;
  try {
    return jwtDecode<AuthPayload>(token);
  } catch {
    return null;
  }
};

export const getRole = (): Role | null => {
  return getPayload()?.role ?? null;
};

export const isAuthenticated = (): boolean => {
  return !!getToken();
};

export const logout = (): void => {
  removeToken();
  window.location.href = '/login';
};
