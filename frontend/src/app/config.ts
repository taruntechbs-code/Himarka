/**
 * HIMARKA Frontend Application Configuration
 * Strictly exposes only client-safe environment variables.
 */

export const config = {
  appName: import.meta.env.VITE_APP_NAME || 'HIMARKA',
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1',
  appEnv: import.meta.env.VITE_APP_ENV || 'development',
  defaultLocale: import.meta.env.VITE_DEFAULT_LOCALE || 'en',
  isDev: import.meta.env.DEV,
} as const;
