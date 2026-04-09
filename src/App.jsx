import React, { useState, useEffect, useRef } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from './firebase';
import { useStore } from './useStore';
import AuthScreen from './AuthScreen';
import Onboarding from './Onboarding';
import { getColor, dk, fmtDate } from './constants';
import { generatePrompt } from './promptGenerator';

// ═══════════════════════════════════════════════════════
// STYLES — design system
// ═══════════════════════════════════════════════════════
const C = {
  bg: '#07070f',
  card: 'rgba(255,255,255,0.025)',
  cardBorder: 'rgba(255,255,255,0.06)',
  accent: '#6366f1',
  accentSoft: 'rgba(99,102,241,0.12)',
  text: '#e0e4ec',
  textMid: '#94a3b8',
  textDim: '#475569',
  textFaint: '#2a2d3a',
  red: '#ef4444',
  green: '#22c55e',
  orange: '#f97316',
};

const S = {
  card: {
    background: C.card, borderRadius: 16,
    border: `1px solid ${C.cardBorder}`,
    padding: '14px 16px', marginBottom: 10,
  },
  input: {
    width: '100%', background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 12, padding: '12px 14px',
    color: C.text, fontSize: 14, fontFamily: 'inherit',
    boxSizing: 'border-box', outline: 'none',
  },
  btn: (bg = C.accent) => ({
    padding: '12px 16px', background: bg,
    border: 'none', borderRadius: 12,
    color: '#fff', fontSize: 14, fontWeight: 700,
    cursor: 'pointer', width: '100%',
  }),
  label: {
    fontSize: 11, fontWeight: 700, color: C.textDim,
    letterSpacing: '0.05em', textTransform: 'uppercase',
    display: 'block', marginBottom: 6,
  },
};

// ═══════════════════════════════════════════════════════
// APP WRAPPER
// ═══════════════════════════════════════════════════════
export default function App() {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setAuthLoading(false);
    });
    return unsub;
  }, []);

  if (authLoading) return (
    <div style={{ minHeight: '100vh', background: C.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: 24, height: 24, borderRadius: '50%', border: '2px solid rgba(99,102,241,0.3)', borderTopColor: '#6366f1', animation: 'spin 0.8s linear infinite' }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  );

  if (!user) return <AuthScreen />;
  return <MainApp user={user} />;
}

// ═══════════════════════════════════════════════════════
// MAIN APP
// ═══════════════════════════════════════════════════════
function MainApp({ user }) {
  const { data, persist, loading, saving, error, setError, forceSave } = useStore(user.uid);
  const [date, setDate] = useState(new Date());
  const [view, setView] = useState('input');
  const [newIssue, setNI] = useState({ problem: '', severity: 5, area: '', root: '', fix: '' });
  const [prompt, setPrompt] = useState('');
  const [copied, setCopied] = useState(false);
  const scrollRef = useRef(null);

  // Profile & areas
  const profile = data.profile;
  const areas = profile?.areas || [];
  const activities = profile?.activities || [];

  const key = dk(date);
  const entry = data.entries?.[key] || { scores: {}, lesson: '', action: '', wins: '', activities: {}, notes: '' };

  // Update helpers
  const upd = (field, val) => {
    const ne = { ...entry, [field]: val };
    persist({ ...data, entries: { ...data.entries, [key]: ne } });
  };
  const setScore = (id, v) => upd('scores', { ...entry.scores, [id]: v });
  const toggleActivity = (id) => {
    const cur = { ...(entry.activities || {}) };
    if (cur[id]) delete cur[id]; else cur[id] = true;
    upd('activities', cur);
  };

  const addIssue = () => {
    if (!newIssue.problem.trim()) return;
    const issue = { ...newIssue, date: key, id: Date.now(), status: 'open' };
    if (!issue.area && areas.length) issue.area = areas[0].id;
    persist({ ...data, issues: [...(data.issues || []), issue] });
    setNI({ problem: '', severity: 5, area: areas[0]?.id || '', root: '', fix: '' });
  };
  const toggleIssue = (id) => {
    persist({ ...data, issues: (data.issues || []).map(i => i.id === id ? { ...i, status: i.status === 'open' ? 'resolved' : 'open' } : i) });
  };

  // Stats
  const filled = Object.values(entry.scores || {}).filter(v => v > 0);
  const avg = filled.length ? filled.reduce((a, b) => a + b, 0) / filled.length : 0;

  const last30 = [];
  const now = new Date();
  for (let i = 0; i < 30; i++) {
    const d = new Date(now); d.setDate(d.getDate() - i);
    const e = data.entries?.[dk(d)];
    if (e && Object.keys(e.scores || {}).length > 0) {
      const vs = Object.values(e.scores).filter(v => v > 0);
      if (vs.length) last30.push({ date: dk(d), avg: vs.reduce((a, b) => a + b, 0) / vs.length, scores: e.scores, entry: e });
    }
  }

  const areaRank = areas.map(a => {
    const vs = last30.filter(d => d.scores[a.id] > 0).map(d => d.scores[a.id]);
    return { ...a, avg: vs.length ? vs.reduce((x, y) => x + y, 0) / vs.length : 0, n: vs.length };
  }).sort((a, b) => b.avg - a.avg);

  const weakest = [...areaRank].filter(a => a.n > 0).sort((a, b) => a.avg - b.avg).slice(0, 3);

  const prevDay = () => { const d = new Date(date); d.setDate(d.getDate() - 1); setDate(d); };
  const nextDay = () => { const d = new Date(date); d.setDate(d.getDate() + 1); setDate(d); };

  const handleCopy = (text) => {
    navigator.clipboard?.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Onboarding handler
  const handleOnboardingComplete = (profileData) => {
    persist({ ...data, profile: profileData });
  };

  // Loading
  if (loading) return (
    <div style={{ minHeight: '100vh', background: C.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: 24, height: 24, borderRadius: '50%', border: '2px solid rgba(99,102,241,0.3)', borderTopColor: '#6366f1', animation: 'spin 0.8s linear infinite' }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  );

  // No profile → onboarding
  if (!profile) return <Onboarding onComplete={handleOnboardingComplete} />;

  // ═══════════════════════════════════════════════════════
  // MAIN RENDER
  // ═══════════════════════════════════════════════════════
  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', background: C.bg, color: C.text }}>

      {/* HEADER */}
      <div style={{
        padding: '12px 20px',
        borderBottom: `1px solid ${C.cardBorder}`,
        flexShrink: 0,
      }}>
        <div style={{ maxWidth: 600, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 28, height: 28, borderRadius: 8,
              background: 'linear-gradient(135deg, #6366f1, #7c3aed)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#fff' }} />
            </div>
            <span style={{ fontSize: 15, fontWeight: 800, color: '#f0f1f5', letterSpacing: '-0.03em' }}>
              Dot Collector
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {saving && <span style={{ fontSize: 10, color: C.accent, background: C.accentSoft, padding: '3px 8px', borderRadius: 6, fontWeight: 600 }}>Salva...</span>}
            <button onClick={() => signOut(auth)} style={{
              background: 'rgba(255,255,255,0.04)', border: `1px solid ${C.cardBorder}`,
              color: C.textDim, fontSize: 11, padding: '5px 10px', borderRadius: 8, cursor: 'pointer', fontWeight: 600,
            }}>Esci</button>
          </div>
        </div>
      </div>

      {/* NAV TABS */}
      <div style={{ flexShrink: 0, borderBottom: `1px solid ${C.cardBorder}` }}>
        <div style={{ maxWidth: 600, margin: '0 auto', display: 'flex' }}>
          {[['input', '⚡', 'Sera'], ['stats', '📊', 'Stats'], ['issues', '🔴', 'Issues'], ['agenda', '📅', 'Agenda']].map(([v, icon, label]) => (
            <button key={v} onClick={() => { setView(v); scrollRef.current?.scrollTo(0, 0); }} style={{
              flex: 1, padding: '10px 0', background: 'transparent', border: 'none',
              borderBottom: view === v ? '2px solid #6366f1' : '2px solid transparent',
              color: view === v ? '#e0e4ec' : '#3b3f51', fontSize: 12, fontWeight: 700, cursor: 'pointer',
              transition: 'all 0.15s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4,
            }}>
              <span style={{ fontSize: 13 }}>{icon}</span> {label}
            </button>
          ))}
        </div>
      </div>

      {/* CONTENT — scrollable */}
      <div ref={scrollRef} style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', WebkitOverflowScrolling: 'touch' }}>
        <div style={{ maxWidth: 600, margin: '0 auto', padding: '14px 16px', paddingBottom: 40 }}>

          {/* Error */}
          {error && (
            <div style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 12, padding: '10px 14px', marginBottom: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <p style={{ fontSize: 12, color: '#fca5a5', margin: 0 }}>⚠️ {error}</p>
              <button onClick={forceSave} style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: 8, color: '#fca5a5', fontSize: 11, padding: '5px 10px', cursor: 'pointer', fontWeight: 600 }}>Riprova</button>
            </div>
          )}

          {/* ═══════════════════════════════════════════ */}
          {/* INPUT TAB                                  */}
          {/* ═══════════════════════════════════════════ */}
          {view === 'input' && (
            <div>
              {/* Date nav */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <button onClick={prevDay} style={navBtn}>‹</button>
                <div style={{ textAlign: 'center' }}>
                  <p style={{ fontSize: 15, fontWeight: 700, margin: 0, color: '#f0f1f5' }}>{fmtDate(date)}</p>
                  {avg > 0 && <p style={{ fontSize: 30, fontWeight: 900, margin: '2px 0 0', color: getColor(avg), lineHeight: 1 }}>{avg.toFixed(1)}</p>}
                </div>
                <button onClick={nextDay} style={navBtn}>›</button>
              </div>

              {/* Activity tags */}
              {activities.length > 0 && (
                <div style={{ ...S.card, padding: '12px 14px' }}>
                  <p style={S.label}>Attività fatte oggi</p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {activities.map(t => {
                      const on = entry.activities?.[t.id];
                      return (
                        <button key={t.id} onClick={() => toggleActivity(t.id)} style={{
                          padding: '6px 12px', borderRadius: 10,
                          border: on ? '1px solid rgba(99,102,241,0.3)' : `1px solid ${C.cardBorder}`,
                          background: on ? C.accentSoft : 'rgba(255,255,255,0.02)',
                          color: on ? '#a5b4fc' : C.textDim,
                          fontSize: 12, fontWeight: 600, cursor: 'pointer', transition: 'all 0.15s',
                        }}>{t.icon} {t.name}</button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Score cards */}
              {areas.map(a => {
                const s = entry.scores?.[a.id] || 0;
                return (
                  <div key={a.id} style={{
                    ...S.card, padding: '12px 14px',
                    borderColor: s > 0 ? getColor(s) + '25' : C.cardBorder,
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1, minWidth: 0 }}>
                        <span style={{ fontSize: 18, flexShrink: 0 }}>{a.icon}</span>
                        <div style={{ minWidth: 0 }}>
                          <p style={{ fontSize: 13, fontWeight: 700, margin: 0, color: '#f0f1f5' }}>{a.name}</p>
                          <p style={{ fontSize: 11, color: C.textDim, margin: '1px 0 0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{a.q}</p>
                        </div>
                      </div>
                      {s > 0 && <span style={{ fontSize: 24, fontWeight: 900, color: getColor(s), marginLeft: 8, flexShrink: 0 }}>{s}</span>}
                    </div>
                    {/* Score buttons */}
                    <div style={{ display: 'flex', gap: 3 }}>
                      {[1,2,3,4,5,6,7,8,9,10].map(v => (
                        <button key={v} onClick={() => setScore(a.id, v)} style={{
                          flex: 1, height: 32, borderRadius: 8, border: 'none', cursor: 'pointer',
                          background: s === v ? getColor(v) : 'rgba(255,255,255,0.04)',
                          color: s === v ? '#fff' : '#4a4e5e',
                          fontSize: 11, fontWeight: s === v ? 800 : 500,
                          transition: 'all 0.12s',
                        }}>{v}</button>
                      ))}
                    </div>
                  </div>
                );
              })}

              {/* Text fields */}
              {[
                ['wins', '🏆 Vittorie', 'Cosa è andato bene oggi?'],
                ['lesson', '🔥 Pain + Reflection', 'Cosa ho imparato dal dolore/errore?'],
                ['action', '⚡ Azione per domani', 'Cosa farò diversamente?'],
                ['notes', '📝 Note', 'Qualsiasi cosa...'],
              ].map(([f, label, ph]) => (
                <div key={f} style={S.card}>
                  <label style={S.label}>{label}</label>
                  <textarea value={entry[f] || ''} onChange={e => upd(f, e.target.value)} placeholder={ph}
                    rows={2}
                    style={{ ...S.input, minHeight: 44 }} />
                </div>
              ))}
            </div>
          )}

          {/* ═══════════════════════════════════════════ */}
          {/* STATS TAB                                  */}
          {/* ═══════════════════════════════════════════ */}
          {view === 'stats' && (
            <div>
              {last30.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '60px 20px', color: C.textDim }}>
                  <p style={{ fontSize: 36, marginBottom: 10 }}>📊</p>
                  <p style={{ fontSize: 15, color: C.textMid }}>Compila la tua prima sera per vedere le statistiche.</p>
                </div>
              ) : (
                <>
                  {/* Trend chart */}
                  <div style={S.card}>
                    <p style={{ ...S.label, marginBottom: 12 }}>Trend ultimi {last30.length} giorni</p>
                    <div style={{ display: 'flex', gap: 2, alignItems: 'flex-end', height: 100 }}>
                      {[...last30].reverse().map(d => (
                        <div key={d.date} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                          <span style={{ fontSize: 7, color: getColor(d.avg), fontWeight: 700 }}>{d.avg.toFixed(1)}</span>
                          <div style={{
                            width: '100%', maxWidth: 16,
                            height: `${d.avg * 10}%`,
                            background: `linear-gradient(180deg, ${getColor(d.avg)}, ${getColor(d.avg)}88)`,
                            borderRadius: 4, minHeight: 3,
                          }} />
                          <span style={{ fontSize: 7, color: '#2a2d3a' }}>{d.date.slice(8)}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Area ranking */}
                  <div style={S.card}>
                    <p style={{ ...S.label, marginBottom: 12 }}>Ranking aree (30g)</p>
                    {areaRank.filter(a => a.n > 0).map((a, i, arr) => (
                      <div key={a.id} style={{
                        display: 'flex', alignItems: 'center', gap: 8, padding: '8px 0',
                        borderBottom: i < arr.length - 1 ? '1px solid rgba(255,255,255,0.03)' : 'none',
                      }}>
                        <span style={{
                          fontSize: 12, fontWeight: 800, width: 22, flexShrink: 0,
                          color: i === 0 ? '#fbbf24' : i >= arr.length - 2 ? C.red : '#3b3f51',
                        }}>#{i + 1}</span>
                        <span style={{ fontSize: 15, flexShrink: 0 }}>{a.icon}</span>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <p style={{ fontSize: 13, fontWeight: 600, margin: 0 }}>{a.name}</p>
                          <div style={{ height: 4, background: 'rgba(255,255,255,0.04)', borderRadius: 2, marginTop: 4 }}>
                            <div style={{ height: '100%', width: `${a.avg * 10}%`, background: getColor(a.avg), borderRadius: 2, transition: 'width 0.3s' }} />
                          </div>
                        </div>
                        <span style={{ fontSize: 17, fontWeight: 800, color: getColor(a.avg), flexShrink: 0 }}>{a.avg.toFixed(1)}</span>
                      </div>
                    ))}
                  </div>

                  {/* Weak areas */}
                  {weakest.length > 0 && weakest[0].avg < 6 && (
                    <div style={{ ...S.card, background: 'rgba(239,68,68,0.04)', borderColor: 'rgba(239,68,68,0.12)' }}>
                      <p style={{ ...S.label, color: C.red, marginBottom: 8 }}>⚠️ Aree critiche</p>
                      {weakest.filter(a => a.avg < 6).map(a => (
                        <p key={a.id} style={{ fontSize: 13, margin: '4px 0', color: '#fca5a5' }}>
                          {a.icon} {a.name}: <strong>{a.avg.toFixed(1)}</strong>
                        </p>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {/* ═══════════════════════════════════════════ */}
          {/* ISSUES TAB                                 */}
          {/* ═══════════════════════════════════════════ */}
          {view === 'issues' && (
            <div>
              <div style={{ ...S.card, background: 'rgba(239,68,68,0.03)', borderColor: 'rgba(239,68,68,0.1)' }}>
                <p style={{ fontSize: 12, color: C.textDim, margin: '0 0 12px', fontStyle: 'italic' }}>
                  Se lo loggi, puoi fixarlo. Se non lo loggi, si ripeterà.
                </p>
                <input value={newIssue.problem} onChange={e => setNI({ ...newIssue, problem: e.target.value })} placeholder="Problema / Errore"
                  style={{ ...S.input, marginBottom: 8 }} />
                <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                  <select value={newIssue.severity} onChange={e => setNI({ ...newIssue, severity: +e.target.value })}
                    style={{ ...S.input, width: '30%' }}>
                    {[1,2,3,4,5,6,7,8,9,10].map(v => <option key={v} value={v}>Sev: {v}</option>)}
                  </select>
                  <select value={newIssue.area || areas[0]?.id || ''} onChange={e => setNI({ ...newIssue, area: e.target.value })}
                    style={{ ...S.input, width: '70%' }}>
                    {areas.map(a => <option key={a.id} value={a.id}>{a.icon} {a.name}</option>)}
                  </select>
                </div>
                <input value={newIssue.root} onChange={e => setNI({ ...newIssue, root: e.target.value })} placeholder="Root Cause"
                  style={{ ...S.input, marginBottom: 8 }} />
                <input value={newIssue.fix} onChange={e => setNI({ ...newIssue, fix: e.target.value })} placeholder="Soluzione progettata"
                  style={{ ...S.input, marginBottom: 10 }} />
                <button onClick={addIssue} style={S.btn('#dc2626')}>+ Logga Issue</button>
              </div>

              {(data.issues || []).length === 0 ? (
                <p style={{ color: '#2a2d3a', fontSize: 13, textAlign: 'center', padding: 40 }}>
                  Nessuna issue. Buon segno... o stai evitando?
                </p>
              ) : (
                [...(data.issues || [])].reverse().map(i => (
                  <div key={i.id} onClick={() => toggleIssue(i.id)} style={{
                    ...S.card, cursor: 'pointer',
                    opacity: i.status === 'resolved' ? 0.45 : 1,
                    background: i.status === 'resolved' ? 'rgba(34,197,94,0.03)' : 'rgba(239,68,68,0.03)',
                    borderColor: i.status === 'resolved' ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.08)',
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ fontSize: 13, fontWeight: 600, margin: 0, textDecoration: i.status === 'resolved' ? 'line-through' : 'none' }}>{i.problem}</p>
                        {i.root && <p style={{ fontSize: 11, color: C.textMid, margin: '3px 0 0' }}>Root: {i.root}</p>}
                        {i.fix && <p style={{ fontSize: 11, color: '#818cf8', margin: '2px 0 0' }}>Fix: {i.fix}</p>}
                      </div>
                      <div style={{ textAlign: 'right', marginLeft: 10, flexShrink: 0 }}>
                        <p style={{ fontSize: 9, color: C.textDim, margin: 0 }}>{i.date}</p>
                        <p style={{ fontSize: 18, fontWeight: 800, color: getColor(11 - i.severity), margin: 0 }}>{i.severity}</p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* ═══════════════════════════════════════════ */}
          {/* AGENDA TAB                                 */}
          {/* ═══════════════════════════════════════════ */}
          {view === 'agenda' && (
            <div>
              <div style={S.card}>
                <p style={{ fontSize: 14, fontWeight: 700, margin: '0 0 6px', color: '#f0f1f5' }}>📅 Genera prompt per Claude</p>
                <p style={{ fontSize: 12, color: C.textDim, margin: '0 0 14px', lineHeight: 1.5 }}>
                  Genera il testo con tutti i tuoi dati. Copialo in Claude per organizzare domani.
                </p>
                <button onClick={() => { setPrompt(generatePrompt(data, date, entry, avg, filled, last30, areaRank, weakest)); setCopied(false); }} style={S.btn('#6366f1')}>
                  Genera prompt
                </button>
              </div>

              {prompt && (
                <div style={{ ...S.card, background: 'rgba(99,102,241,0.04)', borderColor: 'rgba(99,102,241,0.15)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                    <p style={{ fontSize: 12, fontWeight: 700, color: '#818cf8', margin: 0 }}>Copia e incolla in Claude:</p>
                    <button onClick={() => handleCopy(prompt)} style={{
                      padding: '5px 12px', borderRadius: 8,
                      background: copied ? 'rgba(34,197,94,0.12)' : 'rgba(99,102,241,0.12)',
                      border: `1px solid ${copied ? 'rgba(34,197,94,0.25)' : 'rgba(99,102,241,0.25)'}`,
                      color: copied ? '#4ade80' : '#818cf8', fontSize: 12, fontWeight: 600, cursor: 'pointer',
                    }}>{copied ? '✓ Copiato!' : 'Copia'}</button>
                  </div>
                  <pre style={{
                    fontSize: 11, color: '#94a3b8', whiteSpace: 'pre-wrap', wordBreak: 'break-word',
                    margin: 0, lineHeight: 1.5, background: 'rgba(0,0,0,0.3)', padding: 14, borderRadius: 10,
                    maxHeight: 350, overflow: 'auto',
                  }}>{prompt}</pre>
                </div>
              )}

              {last30.length > 0 && (
                <div style={S.card}>
                  <p style={{ ...S.label, marginBottom: 10 }}>Snapshot</p>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                    {[
                      ['Giorni tracciati', last30.length, '#e0e4ec'],
                      ['Media globale', (last30.reduce((a, b) => a + b.avg, 0) / last30.length).toFixed(1), getColor(last30.reduce((a, b) => a + b.avg, 0) / last30.length)],
                      ['Issues aperte', (data.issues || []).filter(i => i.status === 'open').length, (data.issues || []).filter(i => i.status === 'open').length > 0 ? C.red : C.green],
                      ['Best day', Math.max(...last30.map(d => d.avg)).toFixed(1), '#a855f7'],
                    ].map(([label, val, color]) => (
                      <div key={label} style={{
                        background: 'rgba(255,255,255,0.025)', borderRadius: 10,
                        padding: '10px 12px', textAlign: 'center',
                        border: `1px solid ${C.cardBorder}`,
                      }}>
                        <p style={{ fontSize: 10, color: C.textDim, margin: 0, fontWeight: 600 }}>{label}</p>
                        <p style={{ fontSize: 22, fontWeight: 800, color, margin: '4px 0 0' }}>{val}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const navBtn = {
  background: 'rgba(255,255,255,0.04)',
  border: `1px solid rgba(255,255,255,0.08)`,
  color: '#94a3b8', padding: '8px 16px',
  borderRadius: 10, cursor: 'pointer', fontSize: 16,
};
