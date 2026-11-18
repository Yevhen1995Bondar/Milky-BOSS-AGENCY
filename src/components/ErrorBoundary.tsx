import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface ErrorBoundaryState {
  hasError: boolean;
  errorMessage: string;
}

export class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  ErrorBoundaryState
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, errorMessage: '' };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      errorMessage: error.message || 'An unexpected error occurred.',
    };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('Application ErrorBoundary caught:', error, info);
  }

  handleReset = () => {
    this.setState({ hasError: false, errorMessage: '' });
  };

  render() {
    if (this.state.hasError) {
      let friendlyMessage = this.state.errorMessage;
      try {
        const parsed = JSON.parse(this.state.errorMessage);
        if (parsed && typeof parsed.error === 'string') {
          friendlyMessage = `${parsed.error} (${parsed.operationType || 'operation'}: ${parsed.path || 'unknown'})`;
        }
      } catch {
        // Plain error message
      }

      return (
        <div className="min-h-screen bg-[#090a0f] text-zinc-100 flex items-center justify-center p-6">
          <div className="max-w-md w-full rounded-2xl border border-red-500/30 bg-[#11141c] p-8 space-y-5 shadow-2xl">
            <div className="w-12 h-12 rounded-xl bg-red-500/15 text-red-400 flex items-center justify-center border border-red-500/30">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold font-display text-white">
                Verbindungs- oder Berechtigungsfehler
              </h2>
              <p className="text-sm text-zinc-400 mt-2 leading-relaxed">
                Bei der Kommunikation mit der Datenbank ist ein Fehler aufgetreten. Bitte versuchen Sie es erneut.
              </p>
              <div className="mt-3 p-3 rounded-lg bg-black/40 border border-white/10 text-xs text-red-300 font-mono break-words">
                {friendlyMessage}
              </div>
            </div>
            <button
              type="button"
              onClick={this.handleReset}
              className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-md text-xs uppercase tracking-wider font-semibold text-white bg-[#c81e32] hover:bg-[#b01829] transition-colors cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Erneut versuchen / Retry</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
