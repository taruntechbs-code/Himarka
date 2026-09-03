export type UserRole = 'ADMIN' | 'OPERATOR' | 'FARMER' | 'VIEWER';

export interface AuthSession {
  token: string;
  role: UserRole;
}

export const authService = {
  getToken(): string | null {
    return localStorage.getItem('himarka_token');
  },
  getRole(): UserRole {
    return (localStorage.getItem('himarka_role') as UserRole) || 'VIEWER';
  },
  saveSession(token: string, role: UserRole): void {
    localStorage.setItem('himarka_token', token);
    localStorage.setItem('himarka_role', role);
  },
  clearSession(): void {
    localStorage.removeItem('himarka_token');
    localStorage.removeItem('himarka_role');
  },
  isAuthenticated(): boolean {
    return !!this.getToken();
  },
};
