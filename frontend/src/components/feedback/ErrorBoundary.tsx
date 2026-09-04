import { Component, ErrorInfo, ReactNode } from 'react';
import i18n from '@/lib/i18n/i18n';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error caught by HIMARKA ErrorBoundary:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      return (
        <div style={{ padding: '2rem', textAlign: 'center' }}>
          <div className="himarka-card" style={{ maxWidth: '600px', margin: '0 auto' }}>
            <h2 style={{ color: 'var(--color-danger)', marginBottom: '1rem' }}>
              {i18n.t('common.appError', 'Application Error')}
            </h2>
            <p style={{ color: 'var(--color-text-muted)', marginBottom: '1.5rem' }}>
              {this.state.error?.message || 'An unexpected error occurred in the HIMARKA interface.'}
            </p>
            <button
              id="error-boundary-retry-btn"
              onClick={() => window.location.reload()}
              style={{
                backgroundColor: 'var(--color-primary)',
                color: '#fff',
                padding: '0.5rem 1.25rem',
                borderRadius: 'var(--radius-md)',
                fontWeight: 600,
              }}
            >
              {i18n.t('common.reloadApp', 'Reload Application')}
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
