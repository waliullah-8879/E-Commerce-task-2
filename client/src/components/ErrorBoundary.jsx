import React from 'react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({ errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '2rem', background: '#faeaea', color: '#c1492c', fontFamily: 'monospace' }}>
          <h1 style={{ fontSize: '24px', marginBottom: '1rem' }}>React Rendering Error</h1>
          <p style={{ fontWeight: 'bold' }}>{this.state.error?.toString()}</p>
          <pre style={{ marginTop: '1rem', whiteSpace: 'pre-wrap', fontSize: '12px', background: '#fff', padding: '1rem', border: '1px solid #c1492c' }}>
            {this.state.errorInfo?.componentStack}
          </pre>
        </div>
      );
    }
    return this.props.children;
  }
}
