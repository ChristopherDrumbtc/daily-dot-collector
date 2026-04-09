import React, { useState, useRef, useEffect } from 'react';
import { AREA_TEMPLATES, DEFAULT_ACTIVITIES } from './constants';

const EMOJI_OPTIONS = ['⚡','🎯','💰','🧠','💪','❤️','📚','🔥','✨','🛠️','📞','🎬','🧘','🤝','📡','🏋️','✍️','🎵','🏃','🍳','💤','🗣️','📈','🎨','🧪','🌍','💼','🔬','📱','🎮'];

export default function Onboarding({ onComplete }) {
  const [step, setStep] = useState(0);
  const [selectedTemplate, setSelectedTemplate] = useState('peak');
  const [areas, setAreas] = useState([...AREA_TEMPLATES.peak.areas]);
  const [customActivities, setCustomActivities] = useState(
    DEFAULT_ACTIVITIES.map(a => ({ ...a, selected: ['coldcall','deepwork','workout','reading','content','networking'].includes(a.id) }))
  );
  const [newActName, setNewActName] = useState('');
  const [newActIcon, setNewActIcon] = useState('⚡');
  const [showAddAct, setShowAddAct] = useState(false);
  const [newAreaName, setNewAreaName] = useState('');
  const [newAreaQ, setNewAreaQ] = useState('');
  const [newAreaIcon, setNewAreaIcon] = useState('⚡');
  const [showAddArea, setShowAddArea] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    scrollRef.current?.scrollTo(0, 0);
  }, [step]);

  const selectTemplate = (id) => {
    setSelectedTemplate(id);
    setAreas([...AREA_TEMPLATES[id].areas]);
  };

  const removeArea = (id) => {
    setAreas(prev => prev.filter(a => a.id !== id));
  };

  const addArea = () => {
    if (!newAreaName.trim()) return;
    const id = 'custom_' + Date.now();
    setAreas(prev => [...prev, { id, name: newAreaName.trim(), icon: newAreaIcon, q: newAreaQ.trim() || `Come è andata con ${newAreaName.trim()}?` }]);
    setNewAreaName('');
    setNewAreaQ('');
    setNewAreaIcon('⚡');
    setShowAddArea(false);
  };

  const toggleAct = (idx) => {
    setCustomActivities(prev => prev.map((a, i) => i === idx ? { ...a, selected: !a.selected } : a));
  };

  const addCustomAct = () => {
    if (!newActName.trim()) return;
    setCustomActivities(prev => [...prev, { id: 'custom_' + Date.now(), name: newActName.trim(), icon: newActIcon, selected: true }]);
    setNewActName('');
    setNewActIcon('⚡');
    setShowAddAct(false);
  };

  const finish = () => {
    onComplete({
      templateId: selectedTemplate,
      areas: areas,
      activities: customActivities.filter(a => a.selected).map(({ selected, ...rest }) => rest),
      createdAt: new Date().toISOString(),
    });
  };

  return (
    <div ref={scrollRef} style={styles.wrap}>
      <div style={styles.container}>
        {/* Progress */}
        <div style={styles.progress}>
          {[0, 1, 2].map(i => (
            <div key={i} style={{
              flex: 1, height: 3, borderRadius: 2,
              background: i <= step ? '#6366f1' : 'rgba(255,255,255,0.06)',
              transition: 'background 0.3s',
            }} />
          ))}
        </div>

        {/* ═══ STEP 0: INTRO ═══ */}
        {step === 0 && (
          <div>
            <div style={{ fontSize: 40, color: '#6366f1', marginBottom: 20 }}>◉</div>
            <h1 style={styles.h1}>Ogni sera, 2 minuti.</h1>
            <p style={styles.p}>
              Valuti la tua giornata sulle aree che contano per te.
              Niente motivazione vuota — solo dati, pattern, e azioni concrete.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 36 }}>
              {[
                { icon: '⚡', title: 'Valuta', desc: 'Dai un voto da 1 a 10 su ogni area' },
                { icon: '🔍', title: 'Analizza', desc: 'Vedi trend, punti deboli, progressi' },
                { icon: '🔄', title: 'Chiudi il loop', desc: 'Errore → causa → fix → azione domani' },
              ].map((item, i) => (
                <div key={i} style={styles.howItem}>
                  <span style={{ fontSize: 20 }}>{item.icon}</span>
                  <div>
                    <p style={{ fontSize: 14, fontWeight: 700, color: '#e0e4ec', marginBottom: 2 }}>{item.title}</p>
                    <p style={{ fontSize: 13, color: '#6b7185', lineHeight: 1.4 }}>{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <button onClick={() => setStep(1)} style={styles.btn}>Inizia il setup</button>
          </div>
        )}

        {/* ═══ STEP 1: AREE ═══ */}
        {step === 1 && (
          <div>
            <h2 style={styles.h2}>Cosa vuoi tracciare?</h2>
            <p style={styles.pSm}>Scegli un preset, poi personalizza aggiungendo o rimuovendo aree.</p>

            {/* Template selector — compact pills */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
              {Object.values(AREA_TEMPLATES).map(t => (
                <button key={t.id} onClick={() => selectTemplate(t.id)} style={{
                  padding: '8px 14px', borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: 'pointer',
                  border: selectedTemplate === t.id ? '1px solid #6366f1' : '1px solid rgba(255,255,255,0.06)',
                  background: selectedTemplate === t.id ? 'rgba(99,102,241,0.12)' : 'rgba(255,255,255,0.02)',
                  color: selectedTemplate === t.id ? '#c7d2fe' : '#64748b',
                  transition: 'all 0.15s',
                }}>{t.name}</button>
              ))}
            </div>

            {/* Current areas — editable */}
            <div style={styles.preview}>
              <p style={styles.previewTitle}>Le tue {areas.length} aree (tocca ✕ per rimuovere):</p>
              {areas.map(a => (
                <div key={a.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '7px 0', borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                  <span style={{ fontSize: 16 }}>{a.icon}</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: 13, fontWeight: 600, color: '#e0e4ec', margin: 0 }}>{a.name}</p>
                    <p style={{ fontSize: 11, color: '#475569', margin: '1px 0 0' }}>{a.q}</p>
                  </div>
                  <button onClick={() => removeArea(a.id)} style={{
                    background: 'none', border: 'none', color: '#475569', fontSize: 16, cursor: 'pointer', padding: '4px 8px',
                  }}>✕</button>
                </div>
              ))}

              {/* Add custom area */}
              {!showAddArea ? (
                <button onClick={() => setShowAddArea(true)} style={{
                  width: '100%', padding: '10px', marginTop: 10, borderRadius: 10,
                  border: '1px dashed rgba(99,102,241,0.3)', background: 'transparent',
                  color: '#6366f1', fontSize: 13, fontWeight: 600, cursor: 'pointer',
                }}>+ Aggiungi area personalizzata</button>
              ) : (
                <div style={{ marginTop: 12, padding: '12px', background: 'rgba(99,102,241,0.06)', borderRadius: 12, border: '1px solid rgba(99,102,241,0.15)' }}>
                  <div style={{ display: 'flex', gap: 6, marginBottom: 8, flexWrap: 'wrap' }}>
                    {EMOJI_OPTIONS.slice(0, 15).map(e => (
                      <button key={e} onClick={() => setNewAreaIcon(e)} style={{
                        width: 32, height: 32, borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: 16,
                        background: newAreaIcon === e ? 'rgba(99,102,241,0.2)' : 'rgba(255,255,255,0.04)',
                      }}>{e}</button>
                    ))}
                  </div>
                  <input value={newAreaName} onChange={e => setNewAreaName(e.target.value)} placeholder="Nome area (es: Finanze)"
                    style={styles.input} />
                  <input value={newAreaQ} onChange={e => setNewAreaQ(e.target.value)} placeholder="Domanda serale (es: Ho gestito bene i soldi?)"
                    style={{ ...styles.input, marginTop: 6 }} />
                  <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                    <button onClick={() => setShowAddArea(false)} style={{ ...styles.btnSmall, background: 'rgba(255,255,255,0.04)', color: '#6b7185' }}>Annulla</button>
                    <button onClick={addArea} style={{ ...styles.btnSmall, background: '#6366f1', color: '#fff' }}>Aggiungi</button>
                  </div>
                </div>
              )}
            </div>

            <div style={styles.btnRow}>
              <button onClick={() => setStep(0)} style={styles.btnBack}>Indietro</button>
              <button onClick={() => setStep(2)} style={styles.btn}>Avanti</button>
            </div>
          </div>
        )}

        {/* ═══ STEP 2: ATTIVITÀ ═══ */}
        {step === 2 && (
          <div>
            <h2 style={styles.h2}>Attività ricorrenti</h2>
            <p style={styles.pSm}>Seleziona quelle che fai spesso, o aggiungine di tue.</p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 16 }}>
              {customActivities.map((a, idx) => (
                <button key={a.id} onClick={() => toggleAct(idx)} style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
                  padding: '14px 10px', borderRadius: 14, cursor: 'pointer', transition: 'all 0.15s',
                  border: a.selected ? '1px solid #6366f1' : '1px solid rgba(255,255,255,0.06)',
                  background: a.selected ? 'rgba(99,102,241,0.1)' : 'rgba(255,255,255,0.02)',
                  color: a.selected ? '#c7d2fe' : '#64748b',
                }}>
                  <span style={{ fontSize: 18 }}>{a.icon}</span>
                  <span style={{ fontSize: 12, fontWeight: 600 }}>{a.name}</span>
                </button>
              ))}
            </div>

            {/* Add custom activity */}
            {!showAddAct ? (
              <button onClick={() => setShowAddAct(true)} style={{
                width: '100%', padding: '12px', marginBottom: 24, borderRadius: 12,
                border: '1px dashed rgba(99,102,241,0.3)', background: 'transparent',
                color: '#6366f1', fontSize: 13, fontWeight: 600, cursor: 'pointer',
              }}>+ Aggiungi attività personalizzata</button>
            ) : (
              <div style={{ marginBottom: 24, padding: '12px', background: 'rgba(99,102,241,0.06)', borderRadius: 12, border: '1px solid rgba(99,102,241,0.15)' }}>
                <div style={{ display: 'flex', gap: 6, marginBottom: 8, flexWrap: 'wrap' }}>
                  {EMOJI_OPTIONS.slice(0, 15).map(e => (
                    <button key={e} onClick={() => setNewActIcon(e)} style={{
                      width: 32, height: 32, borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: 16,
                      background: newActIcon === e ? 'rgba(99,102,241,0.2)' : 'rgba(255,255,255,0.04)',
                    }}>{e}</button>
                  ))}
                </div>
                <input value={newActName} onChange={e => setNewActName(e.target.value)} placeholder="Nome attività (es: Corsa mattutina)"
                  style={styles.input} />
                <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                  <button onClick={() => setShowAddAct(false)} style={{ ...styles.btnSmall, background: 'rgba(255,255,255,0.04)', color: '#6b7185' }}>Annulla</button>
                  <button onClick={addCustomAct} style={{ ...styles.btnSmall, background: '#6366f1', color: '#fff' }}>Aggiungi</button>
                </div>
              </div>
            )}

            <div style={styles.btnRow}>
              <button onClick={() => setStep(1)} style={styles.btnBack}>Indietro</button>
              <button onClick={finish} style={styles.btn}>Inizia a tracciare</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  wrap: {
    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
    background: '#07070f',
    overflowY: 'auto', WebkitOverflowScrolling: 'touch',
    padding: '20px 16px 80px',
    display: 'flex', justifyContent: 'center',
  },
  container: {
    maxWidth: 440, width: '100%',
  },
  progress: {
    display: 'flex', gap: 6, marginBottom: 32,
  },
  h1: {
    fontSize: 26, fontWeight: 800, color: '#f0f1f5',
    letterSpacing: '-0.04em', marginBottom: 12, lineHeight: 1.2,
  },
  h2: {
    fontSize: 22, fontWeight: 800, color: '#f0f1f5',
    letterSpacing: '-0.03em', marginBottom: 6,
  },
  p: {
    fontSize: 15, color: '#6b7185', lineHeight: 1.6, marginBottom: 28,
  },
  pSm: {
    fontSize: 14, color: '#6b7185', lineHeight: 1.5, marginBottom: 20,
  },
  howItem: {
    display: 'flex', gap: 14, alignItems: 'flex-start',
    padding: '14px 16px', borderRadius: 14,
    background: 'rgba(255,255,255,0.025)',
    border: '1px solid rgba(255,255,255,0.05)',
  },
  preview: {
    padding: '14px 16px', borderRadius: 14,
    background: 'rgba(255,255,255,0.02)',
    border: '1px solid rgba(255,255,255,0.05)',
    marginBottom: 24,
  },
  previewTitle: {
    fontSize: 11, fontWeight: 700, color: '#475569',
    textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 10,
  },
  input: {
    width: '100%', background: 'rgba(255,255,255,0.06)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: 10, padding: '10px 12px',
    color: '#e0e4ec', fontSize: 13, fontFamily: 'inherit',
    boxSizing: 'border-box', outline: 'none',
  },
  btn: {
    flex: 1, padding: '15px 24px', borderRadius: 14,
    background: 'linear-gradient(135deg, #6366f1 0%, #7c3aed 100%)',
    border: 'none', color: '#fff', fontSize: 15, fontWeight: 700,
    cursor: 'pointer', boxShadow: '0 4px 24px rgba(99,102,241,0.2)',
  },
  btnBack: {
    padding: '15px 20px', borderRadius: 14,
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.08)',
    color: '#6b7185', fontSize: 14, fontWeight: 600, cursor: 'pointer',
  },
  btnSmall: {
    flex: 1, padding: '10px', borderRadius: 10,
    border: 'none', fontSize: 13, fontWeight: 600, cursor: 'pointer',
  },
  btnRow: {
    display: 'flex', gap: 10,
  },
};
