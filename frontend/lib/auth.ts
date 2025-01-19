const TOKEN_KEY = 'expense_pad_token';
const USER_KEY = 'expense_pad_user';

export const getToken = (): string | null =>
  typeof window !== 'undefined' ? localStorage.getItem(TOKEN_KEY) : null;

export const setToken = (token: string): void => {
  localStorage.setItem(TOKEN_KEY, token);
  const maxAge = 7 * 24 * 60 * 60;
  document.cookie = `expense_pad_token=${token}; path=/; max-age=${maxAge}; SameSite=Strict`;
};

export const removeToken = (): void => {
  localStorage.removeItem(TOKEN_KEY);
  document.cookie = 'expense_pad_token=; path=/; max-age=0';
};

export interface AuthUser {
  id: string;
  name: string;
  email: string;
}

export const getUser = (): AuthUser | null => {
  if (typeof window === 'undefined') return null;
  const data = localStorage.getItem(USER_KEY);
  return data ? JSON.parse(data) : null;
};

export const setUser = (user: AuthUser): void =>
  localStorage.setItem(USER_KEY, JSON.stringify(user));

export const removeUser = (): void => localStorage.removeItem(USER_KEY);
