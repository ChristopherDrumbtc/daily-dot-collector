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
    <div style={styles.wrap}>
      <div style={styles.inner}>
        {/* Glow */}
        <div style={styles.glow} />

        {/* Logo */}
        <div style={styles.logo}>
          <div style={styles.logoInner}>
            <div style={styles.dot} />
          </div>
        </div>

        <h1 style={styles.title}>Dot Collector</h1>
        <p style={styles.sub}>Misura ogni giorno.<br/>Migliora ogni settimana.</p>

        <div style={styles.features}>
          {['Traccia le aree che contano per te', 'Identifica pattern e punti deboli', 'Chiudi il loop: errore → diagnosi → fix'].map((t, i) => (
            <div key={i} style={styles.feat}>
              <span style={styles.featDot}>{'◉'}</span>
              <span style={styles.featText}>{t}</span>
            </div>
          ))}
        </div>

        <button onClick={login} disabled={loading} style={{
          ...styles.btn,
          opacity: loading ? 0.5 : 1,
          cursor: loading ? 'default' : 'pointer',
        }}>
          {loading ? 'Accesso...' : 'Accedi con Google'}
        </button>

        {err && <p style={styles.err}>{err}</p>}
        <p style={styles.privacy}>I tuoi dati sono privati e salvati nel tuo account.</p>
      </div>
    </div>
  );
}

const styles = {
  wrap: {
    minHeight: '100vh', background: '#07070f',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    padding: 24, position: 'relative', overflow: 'hidden',
  },
  inner: {
    maxWidth: 360, width: '100%', textAlign: 'center',
    position: 'relative', zIndex: 1,
  },
  glow: {
    position: 'absolute', top: -120, left: '50%', transform: 'translateX(-50%)',
    width: 300, height: 300, borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(99,102,241,0.08) 0%, transparent 70%)',
    pointerEvents: 'none',
  },
  logo: {
    width: 80, height: 80, margin: '0 auto 28px',
    borderRadius: 24,
    background: 'linear-gradient(135deg, rgba(99,102,241,0.15), rgba(99,102,241,0.05))',
    border: '1px solid rgba(99,102,241,0.2)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  },
  logoInner: {
    width: 36, height: 36, borderRadius: 12,
    background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  },
  dot: {
    width: 10, height: 10, borderRadius: '50%', background: '#fff',
  },
  title: {
    fontSize: 28, fontWeight: 800, color: '#f0f1f5',
    letterSpacing: '-0.04em', marginBottom: 8,
  },
  sub: {
    fontSize: 15, color: '#6b7185', lineHeight: 1.5, marginBottom: 36,
  },
  features: {
    textAlign: 'left', marginBottom: 36,
    display: 'flex', flexDirection: 'column', gap: 14,
  },
  feat: {
    display: 'flex', alignItems: 'flex-start', gap: 12,
  },
  featDot: {
    fontSize: 10, color: '#6366f1', marginTop: 4, flexShrink: 0,
  },
  featText: {
    fontSize: 14, color: '#94a3b8', lineHeight: 1.4,
  },
  btn: {
    width: '100%', padding: '16px 24px', borderRadius: 14,
    background: 'linear-gradient(135deg, #6366f1 0%, #7c3aed 100%)',
    border: 'none', color: '#fff', fontSize: 16, fontWeight: 700,
    boxShadow: '0 4px 24px rgba(99,102,241,0.25)',
    transition: 'all 0.2s',
  },
  err: { color: '#ef4444', fontSize: 13, marginTop: 14 },
  privacy: { fontSize: 11, color: '#2a2d3a', marginTop: 24, lineHeight: 1.5 },
};
