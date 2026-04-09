import React from 'react';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from './firebase';

export default function AuthScreen() {
  const [loading, setLoading] = React.useState(false);
  const [err, setErr] = React.useState(null);

  const login = async () => {
    setLoading(true);
    setErr(null);
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (e) {
      setErr('Login fallito. Riprova.');
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh', background: '#080810', display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 24
    }}>
      <div style={{ maxWidth: 380, width: '100%', textAlign: 'center' }}>
        {/* Logo area */}
        <div style={{
          width: 72, height: 72, borderRadius: 20, margin: '0 auto 24px',
          background: 'linear-gradient(135deg, #1e3a5f 0%, #0f1f35 100%)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          border: '1px solid rgba(255,255,255,0.06)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.4)'
        }}>
          <span style={{ fontSize: 32 }}>◉</span>
        </div>

        <h1 style={{
          fontSize: 26, fontWeight: 900, color: '#e2e8f0', marginBottom: 8,
          letterSpacing: '-0.03em'
        }}>Daily Dot Collector</h1>

        <p style={{ fontSize: 14, color: '#64748b', marginBottom: 8, lineHeight: 1.5 }}>
          Misura la tua crescita ogni giorno.
        </p>
        <p style={{ fontSize: 12, color: '#334155', marginBottom: 32 }}>
          Basato sui Principi di Ray Dalio
        </p>

        <button onClick={login} disabled={loading} style={{
          width: '100%', padding: '14px 24px', borderRadius: 12,
          background: loading ? '#1e293b' : 'linear-gradient(135deg, #1e3a5f 0%, #2563eb 100%)',
          border: '1px solid rgba(255,255,255,0.08)',
          color: '#e2e8f0', fontSize: 15, fontWeight: 700, cursor: loading ? 'default' : 'pointer',
          transition: 'all 0.2s',
          boxShadow: loading ? 'none' : '0 4px 20px rgba(37,99,235,0.3)'
        }}>
          {loading ? 'Accesso in corso...' : '🔐 Accedi con Google'}
        </button>

        {err && <p style={{ color: '#ef4444', fontSize: 12, marginTop: 12 }}>{err}</p>}

        <p style={{ fontSize: 10, color: '#1e293b', marginTop: 24, lineHeight: 1.5 }}>
          I tuoi dati sono privati e salvati nel tuo account personale.
        </p>
      </div>
    </div>
  );
}
