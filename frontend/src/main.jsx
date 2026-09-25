import React, { Component, StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('SelectMyFlight UI Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          background: '#070c18',
          color: '#f8fafc',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 24,
          fontFamily: 'system-ui, sans-serif',
          textAlign: 'center'
        }}>
          <h2 style={{ fontSize: 24, color: '#f87171', marginBottom: 12 }}>
            Something went wrong while rendering the view
          </h2>
          <pre style={{
            background: 'rgba(255, 255, 255, 0.08)',
            padding: '12px 18px',
            borderRadius: 8,
            maxWidth: 600,
            overflow: 'auto',
            fontSize: 12,
            color: '#cbd5e1',
            marginBottom: 20
          }}>
            {this.state.error?.toString()}
          </pre>
          <button
            onClick={() => {
              try {
                localStorage.removeItem('smf_user');
                localStorage.removeItem('smf_wishlist');
              } catch {
                // ignore
              }
              window.location.hash = '';
              window.location.reload();
            }}
            style={{
              background: 'linear-gradient(135deg, #00d2ff, #3a7bd5)',
              color: '#fff',
              border: 'none',
              padding: '10px 22px',
              borderRadius: 8,
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            Reset Session & Reload Portal
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
)

