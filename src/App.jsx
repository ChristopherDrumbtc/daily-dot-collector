import React, { useState, useEffect } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from './firebase';
import { useStore } from './useStore';
import AuthScreen from './AuthScreen';
import { AREAS, ACTIVITY_TAGS, getColor, getBg, dk, fmtDate } from './constants';
import { generatePrompt } from './promptGenerator';

const S = {
  card: { background: 'rgba(255,255,255,0.025)', borderRadius: 14, border: '1px solid rgba(255,255,255,0.06)', padding: '14px 16px', marginBottom: 10 },
  input: { width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, padding: '10px 12px', color: '#e2e8f0', fontSize: 13, fontFamily: 'inherit', boxSizing: 'border-box', outline: 'none' },
  btn: (bg) => ({ padding: '10px 16px', background: bg, border: 'none', borderRadius: 10, color: '#fff', fontSize: 13, fontWeight: 700, cursor: 'pointer', width: '100%' }),
  label: { fontSize: 11, fontWeight: 600, color: '#64748b', display: 'block', marginBottom: 4 },
};

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
    <div style={{ minHeight: '100vh', background: '#080810', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ color: '#475569', fontSize: 14 }}>Caricamento...</p>
    </div>
  );

  if (!user) return <AuthScreen />;

  return <MainApp user={user} />;
}

function MainApp({ user }) {
  const { data, persist, dataRef, loading, saving, error, setError, forceSave } = useStore(user.uid);
  const [date, setDate] = useState(new Date());
  const [view, setView] = useState('input');
  const [newIssue, setNI] = useState({ problem: '', severity: 5, area: 'goals', root: '', fix: '' });
  const [prompt, setPrompt] = useState('');
  const [copied, setCopied] = useState(false);

  const key = dk(date);
  const entry = data.entries?.[key] || { scores: {}, lesson: '', action: '', wins: '', activities: {}, notes: '' };

  const upd = (field, val) => {
    const ne = { ...entry, [field]: val };
    const nd = { ...data, entries: { ...data.entries, [key]: ne } };
    persist(nd);
  };

  const setScore = (id, v) => upd('scores', { ...entry.scores, [id]: v });
  const setText = (f, v) => upd(f, v);

  const toggleActivity = (id) => {
    const cur = { ...(entry.activities || {}) };
    if (cur[id]) { delete cur[id]; } else { cur[id] = true; }
    upd('activities', cur);
  };

  const addIssue = () => {
    if (!newIssue.problem.trim()) return;
    const nd = { ...data, issues: [...(data.issues || []), { ...newIssue, date: key, id: Date.now(), status: 'open' }] };
    persist(nd);
    setNI({ problem: '', severity: 5, area: 'goals', root: '', fix: '' });
  };

  const toggleIssue = (id) => {
    const nd = { ...data, issues: (data.issues || []).map(i => i.id === id ? { ...i, status: i.status === 'open' ? 'resolved' : 'open' } : i) };
    persist(nd);
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

  const areaRank = AREAS.map(a => {
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

  if (loading) return (
    <div style={{ minHeight: '100vh', background: '#080810', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 32, marginBottom: 8 }}>⚙️</div>
        <p style={{ color: '#94a3b8', fontSize: 14 }}>Caricamento dati...</p>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: '#080810', color: '#e2e8f0' }}>
      {/* Header */}
      <div style={{ background: 'linear-gradient(145deg, #0f1628, #0a0f1e)', borderBottom: '1px solid rgba(255,255,255,0.04)', padding: '14px 20px' }}>
        <div style={{ maxWidth: 640, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ fontSize: 17, fontWeight: 800, margin: 0, letterSpacing: '-0.03em', background: 'linear-gradient(135deg, #e2e8f0, #94a3b8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Daily Dot Collector
            </h1>
            <p style={{ fontSize: 10, color: '#475569', margin: '2px 0 0', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
              Principi di Ray Dalio
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {saving && <span style={{ fontSize: 9, color: '#3b82f6', background: 'rgba(59,130,246,0.1)', padding: '3px 8px', borderRadius: 6 }}>Salva...</span>}
            <button onClick={() => signOut(auth)} style={{
              background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
              color: '#64748b', fontSize: 11, padding: '5px 10px', borderRadius: 8, cursor: 'pointer'
            }}>Esci</button>
          </div>
        </div>
      </div>

      {/* Nav */}
      <div style={{ maxWidth: 640, margin: '0 auto', display: 'flex', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
        {[['input', '📝 Sera'], ['stats', '📊 Stats'], ['issues', '🔴 Issues'], ['agenda', '📅 Agenda']].map(([v, l]) => (
          <button key={v} onClick={() => setView(v)} style={{
            flex: 1, padding: '11px 0', background: 'transparent', border: 'none',
            borderBottom: view === v ? '2px solid #3b82f6' : '2px solid transparent',
            color: view === v ? '#e2e8f0' : '#475569', fontSize: 12, fontWeight: 600, cursor: 'pointer'
          }}>{l}</button>
        ))}
      </div>

      <div style={{ maxWidth: 640, margin: '0 auto', padding: '14px 16px' }}>
        {/* Error banner */}
        {error && (
          <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 10, padding: '10px 14px', marginBottom: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <p style={{ fontSize: 12, color: '#fca5a5', margin: 0 }}>⚠️ {error}</p>
            <button onClick={forceSave} style={{ background: 'rgba(239,68,68,0.2)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 6, color: '#fca5a5', fontSize: 11, padding: '4px 10px', cursor: 'pointer' }}>Riprova</button>
          </div>
        )}

        {/* ═══ INPUT TAB ═══ */}
        {view === 'input' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <button onClick={prevDay} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#94a3b8', padding: '7px 14px', borderRadius: 8, cursor: 'pointer', fontSize: 15 }}>‹</button>
              <div style={{ textAlign: 'center' }}>
                <p style={{ fontSize: 15, fontWeight: 700, margin: 0 }}>{fmtDate(date)}</p>
                {avg > 0 && <p style={{ fontSize: 28, fontWeight: 900, margin: '2px 0 0', color: getColor(avg), lineHeight: 1 }}>{avg.toFixed(1)}</p>}
              </div>
              <button onClick={nextDay} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#94a3b8', padding: '7px 14px', borderRadius: 8, cursor: 'pointer', fontSize: 15 }}>›</button>
            </div>

            {/* Activity tags */}
            <div style={{ ...S.card, padding: '10px 12px' }}>
              <p style={{ fontSize: 10, fontWeight: 600, color: '#475569', margin: '0 0 8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Attività fatte oggi</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {ACTIVITY_TAGS.map(t => {
                  const on = entry.activities?.[t.id];
                  return (
                    <button key={t.id} onClick={() => toggleActivity(t.id)} style={{
                      padding: '5px 10px', borderRadius: 8,
                      border: on ? '1px solid rgba(59,130,246,0.3)' : '1px solid rgba(255,255,255,0.06)',
                      background: on ? 'rgba(59,130,246,0.12)' : 'rgba(255,255,255,0.03)',
                      color: on ? '#60a5fa' : '#64748b', fontSize: 11, fontWeight: 600, cursor: 'pointer'
                    }}>{t.icon} {t.name}</button>
                  );
                })}
              </div>
            </div>

            {/* Scores */}
            {AREAS.map(a => {
              const s = entry.scores?.[a.id] || 0;
              return (
                <div key={a.id} style={{ ...S.card, padding: '10px 12px', background: getBg(s), borderColor: s ? getColor(s) + '20' : 'rgba(255,255,255,0.06)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                      <span style={{ fontSize: 15 }}>{a.icon}</span>
                      <div>
                        <p style={{ fontSize: 12, fontWeight: 700, margin: 0 }}>{a.name}</p>
                        <p style={{ fontSize: 9, color: '#64748b', margin: '1px 0 0' }}>{a.q}</p>
                      </div>
                    </div>
                    {s > 0 && <span style={{ fontSize: 22, fontWeight: 900, color: getColor(s) }}>{s}</span>}
                  </div>
                  <div style={{ display: 'flex', gap: 3 }}>
                    {[1,2,3,4,5,6,7,8,9,10].map(v => (
                      <button key={v} onClick={() => setScore(a.id, v)} style={{
                        flex: 1, height: 26, borderRadius: 6, border: 'none', cursor: 'pointer',
                        background: s === v ? getColor(v) : 'rgba(255,255,255,0.05)',
                        color: s === v ? '#fff' : '#64748b', fontSize: 10, fontWeight: s === v ? 800 : 500,
                        transition: 'all 0.12s'
                      }}>{v}</button>
                    ))}
                  </div>
                </div>
              );
            })}

            {/* Text fields */}
            {[
              ['wins', '🏆 Vittorie di oggi', 'Cosa è andato bene?'],
              ['lesson', '🔥 Pain + Reflection', 'Cosa ho imparato dal dolore/errore?'],
              ['action', '⚡ Azione correttiva', 'Cosa farò diversamente domani?'],
              ['notes', '📝 Note libere', 'Qualsiasi cosa da ricordare...'],
            ].map(([f, label, ph]) => (
              <div key={f} style={S.card}>
                <label style={S.label}>{label}</label>
                <textarea value={entry[f] || ''} onChange={e => setText(f, e.target.value)} placeholder={ph}
                  style={{ ...S.input, resize: 'vertical', minHeight: 40 }} />
              </div>
            ))}
          </div>
        )}

        {/* ═══ STATS TAB ═══ */}
        {view === 'stats' && (
          <div>
            {last30.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px 20px', color: '#475569' }}>
                <p style={{ fontSize: 32, marginBottom: 8 }}>📊</p>
                <p style={{ fontSize: 14 }}>Compila la tua prima sera per vedere le statistiche.</p>
              </div>
            ) : (
              <>
                <div style={S.card}>
                  <p style={{ fontSize: 12, fontWeight: 700, margin: '0 0 10px' }}>Trend giornaliero</p>
                  <div style={{ display: 'flex', gap: 3, alignItems: 'flex-end', height: 100 }}>
                    {[...last30].reverse().map(d => (
                      <div key={d.date} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                        <span style={{ fontSize: 8, color: getColor(d.avg), fontWeight: 700 }}>{d.avg.toFixed(1)}</span>
                        <div style={{ width: '100%', maxWidth: 18, height: `${d.avg * 10}%`, background: getColor(d.avg), borderRadius: 3, minHeight: 3, opacity: 0.8 }} />
                        <span style={{ fontSize: 7, color: '#334155' }}>{d.date.slice(8)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div style={S.card}>
                  <p style={{ fontSize: 12, fontWeight: 700, margin: '0 0 10px' }}>Ranking aree (30g)</p>
                  {areaRank.filter(a => a.n > 0).map((a, i, arr) => (
                    <div key={a.id} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '7px 0', borderBottom: i < arr.length - 1 ? '1px solid rgba(255,255,255,0.03)' : 'none' }}>
                      <span style={{ fontSize: 13, fontWeight: 800, color: i === 0 ? '#fbbf24' : i >= arr.length - 2 ? '#ef4444' : '#334155', width: 22 }}>#{i + 1}</span>
                      <span style={{ fontSize: 14 }}>{a.icon}</span>
                      <div style={{ flex: 1 }}>
                        <p style={{ fontSize: 12, fontWeight: 600, margin: 0 }}>{a.name}</p>
                        <div style={{ height: 4, background: 'rgba(255,255,255,0.04)', borderRadius: 2, marginTop: 3 }}>
                          <div style={{ height: '100%', width: `${a.avg * 10}%`, background: getColor(a.avg), borderRadius: 2 }} />
                        </div>
                      </div>
                      <span style={{ fontSize: 16, fontWeight: 800, color: getColor(a.avg) }}>{a.avg.toFixed(1)}</span>
                    </div>
                  ))}
                </div>

                <div style={S.card}>
                  <p style={{ fontSize: 12, fontWeight: 700, margin: '0 0 10px' }}>5-Step Process di Dalio</p>
                  {AREAS.slice(0, 5).map(a => {
                    const d = areaRank.find(x => x.id === a.id);
                    const v = d?.avg || 0;
                    return (
                      <div key={a.id} style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                        <span style={{ width: 18, fontSize: 13 }}>{a.icon}</span>
                        <span style={{ width: 90, fontSize: 10, color: '#94a3b8' }}>{a.name}</span>
                        <div style={{ flex: 1, height: 6, background: 'rgba(255,255,255,0.04)', borderRadius: 3 }}>
                          <div style={{ height: '100%', width: `${v * 10}%`, background: getColor(v), borderRadius: 3 }} />
                        </div>
                        <span style={{ fontSize: 12, fontWeight: 800, color: getColor(v), width: 28, textAlign: 'right' }}>{v > 0 ? v.toFixed(1) : '—'}</span>
                      </div>
                    );
                  })}
                </div>

                {weakest.length > 0 && weakest[0].avg < 6 && (
                  <div style={{ ...S.card, background: 'rgba(239,68,68,0.06)', borderColor: 'rgba(239,68,68,0.15)' }}>
                    <p style={{ fontSize: 12, fontWeight: 700, margin: '0 0 6px', color: '#ef4444' }}>⚠️ Aree critiche</p>
                    {weakest.filter(a => a.avg < 6).map(a => (
                      <p key={a.id} style={{ fontSize: 12, margin: '3px 0', color: '#fca5a5' }}>
                        {a.icon} {a.name}: <strong>{a.avg.toFixed(1)}</strong> — {a.principle}
                      </p>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* ═══ ISSUES TAB ═══ */}
        {view === 'issues' && (
          <div>
            <div style={{ ...S.card, background: 'rgba(239,68,68,0.04)', borderColor: 'rgba(239,68,68,0.1)' }}>
              <p style={{ fontSize: 10, color: '#64748b', margin: '0 0 10px', fontStyle: 'italic' }}>
                "Se lo loggi, va bene. Se non lo loggi, è un problema serio." — Dalio
              </p>
              <input value={newIssue.problem} onChange={e => setNI({ ...newIssue, problem: e.target.value })} placeholder="Problema / Errore"
                style={{ ...S.input, marginBottom: 6 }} />
              <div style={{ display: 'flex', gap: 6, marginBottom: 6 }}>
                <select value={newIssue.severity} onChange={e => setNI({ ...newIssue, severity: +e.target.value })}
                  style={{ ...S.input, width: '30%' }}>
                  {[1,2,3,4,5,6,7,8,9,10].map(v => <option key={v} value={v}>Sev: {v}</option>)}
                </select>
                <select value={newIssue.area} onChange={e => setNI({ ...newIssue, area: e.target.value })}
                  style={{ ...S.input, width: '70%' }}>
                  {AREAS.map(a => <option key={a.id} value={a.id}>{a.icon} {a.name}</option>)}
                </select>
              </div>
              <input value={newIssue.root} onChange={e => setNI({ ...newIssue, root: e.target.value })} placeholder="Root Cause"
                style={{ ...S.input, marginBottom: 6 }} />
              <input value={newIssue.fix} onChange={e => setNI({ ...newIssue, fix: e.target.value })} placeholder="Soluzione progettata"
                style={{ ...S.input, marginBottom: 8 }} />
              <button onClick={addIssue} style={S.btn('#dc2626')}>+ Logga Issue</button>
            </div>

            {(data.issues || []).length === 0 ? (
              <p style={{ color: '#334155', fontSize: 12, textAlign: 'center', padding: 30 }}>Nessuna issue. Buon segno... o stai evitando?</p>
            ) : (
              [...(data.issues || [])].reverse().map(i => (
                <div key={i.id} onClick={() => toggleIssue(i.id)} style={{
                  ...S.card, cursor: 'pointer', opacity: i.status === 'resolved' ? 0.5 : 1,
                  background: i.status === 'resolved' ? 'rgba(34,197,94,0.04)' : 'rgba(239,68,68,0.04)',
                  borderColor: i.status === 'resolved' ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: 12, fontWeight: 600, margin: 0, textDecoration: i.status === 'resolved' ? 'line-through' : 'none' }}>{i.problem}</p>
                      {i.root && <p style={{ fontSize: 10, color: '#94a3b8', margin: '2px 0 0' }}>Root: {i.root}</p>}
                      {i.fix && <p style={{ fontSize: 10, color: '#60a5fa', margin: '2px 0 0' }}>Fix: {i.fix}</p>}
                    </div>
                    <div style={{ textAlign: 'right', marginLeft: 10 }}>
                      <p style={{ fontSize: 9, color: '#475569', margin: 0 }}>{i.date}</p>
                      <p style={{ fontSize: 16, fontWeight: 800, color: getColor(11 - i.severity), margin: 0 }}>{i.severity}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* ═══ AGENDA TAB ═══ */}
        {view === 'agenda' && (
          <div>
            <div style={S.card}>
              <p style={{ fontSize: 13, fontWeight: 700, margin: '0 0 8px' }}>📅 Genera prompt per Claude</p>
              <p style={{ fontSize: 11, color: '#64748b', margin: '0 0 12px' }}>
                Genera il testo con tutti i tuoi dati. Copialo in una nuova chat Claude e lui organizzerà la tua giornata.
              </p>
              <button onClick={() => { setPrompt(generatePrompt(data, date, entry, avg, filled, last30, areaRank, weakest)); setCopied(false); }} style={S.btn('#3b82f6')}>
                Genera prompt "Organizza domani"
              </button>
            </div>

            {prompt && (
              <div style={{ ...S.card, background: 'rgba(59,130,246,0.04)', borderColor: 'rgba(59,130,246,0.15)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <p style={{ fontSize: 11, fontWeight: 700, color: '#60a5fa', margin: 0 }}>Copia e incolla in Claude:</p>
                  <button onClick={() => handleCopy(prompt)} style={{
                    padding: '4px 10px', background: copied ? 'rgba(34,197,94,0.15)' : 'rgba(59,130,246,0.15)',
                    border: `1px solid ${copied ? 'rgba(34,197,94,0.3)' : 'rgba(59,130,246,0.3)'}`,
                    borderRadius: 6, color: copied ? '#4ade80' : '#60a5fa', fontSize: 11, fontWeight: 600, cursor: 'pointer'
                  }}>{copied ? '✓ Copiato!' : 'Copia'}</button>
                </div>
                <pre style={{ fontSize: 11, color: '#cbd5e1', whiteSpace: 'pre-wrap', wordBreak: 'break-word', margin: 0, lineHeight: 1.5, background: 'rgba(0,0,0,0.3)', padding: 12, borderRadius: 8, maxHeight: 400, overflow: 'auto' }}>{prompt}</pre>
              </div>
            )}

            {last30.length > 0 && (
              <div style={S.card}>
                <p style={{ fontSize: 12, fontWeight: 700, margin: '0 0 8px' }}>📈 Snapshot</p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                  {[
                    ['Giorni tracciati', last30.length, '#e2e8f0'],
                    ['Media globale', (last30.reduce((a, b) => a + b.avg, 0) / last30.length).toFixed(1), getColor(last30.reduce((a, b) => a + b.avg, 0) / last30.length)],
                    ['Issues aperte', (data.issues || []).filter(i => i.status === 'open').length, (data.issues || []).filter(i => i.status === 'open').length > 0 ? '#ef4444' : '#22c55e'],
                    ['Best day', Math.max(...last30.map(d => d.avg)).toFixed(1), '#a855f7'],
                  ].map(([label, val, color]) => (
                    <div key={label} style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 8, padding: '8px 10px', textAlign: 'center' }}>
                      <p style={{ fontSize: 9, color: '#475569', margin: 0 }}>{label}</p>
                      <p style={{ fontSize: 20, fontWeight: 800, color, margin: '2px 0 0' }}>{val}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
