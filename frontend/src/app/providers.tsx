import React, { ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { TelemetryProvider } from '@/services/telemetry/TelemetryContext';
import '@/lib/i18n/i18n'; // Initialize i18n
import '@/styles/index.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5000,
    },
  },
});

interface ProvidersProps {
  children: ReactNode;
}

export const Providers: React.FC<ProvidersProps> = ({ children }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <TelemetryProvider>
        {children}
      </TelemetryProvider>
    </QueryClientProvider>
  );
};
