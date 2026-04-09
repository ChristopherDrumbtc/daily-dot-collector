import React, { useState, useEffect } from 'react';
import { AREA_TEMPLATES, ACTIVITY_CATEGORIES } from './constants';

const EMOJI_OPTIONS = ['⚡','🎯','💰','🧠','💪','❤️','📚','🔥','✨','🛠️','📞','🎬','🧘','🤝','📡','🏋️','✍️','🎵','🏃','🍳','💤','🗣️','📈','🎨','🧪','🌍','💼','🔬','📱','🎮'];

export default function Onboarding({ onComplete }) {
  const [step, setStep] = useState(0);
  const [selectedTemplate, setSelectedTemplate] = useState('peak');
  const [areas, setAreas] = useState([...AREA_TEMPLATES.peak.areas]);
  
  const [actSelection, setActSelection] = useState(() => {
    const map = {};
    ACTIVITY_CATEGORIES.forEach(cat => {
      cat.items.forEach(a => { map[a.id] = false; });
    });
    ['deepwork', 'workout', 'reading', 'meditation', 'planning'].forEach(id => { map[id] = true; });
    return map;
  });
  const [customActs, setCustomActs] = useState([]);
  
  const [newActName, setNewActName] = useState('');
  const [newActIcon, setNewActIcon] = useState('⚡');
  const [showAddAct, setShowAddAct] = useState(false);
  const [newAreaName, setNewAreaName] = useState('');
  const [newAreaQ, setNewAreaQ] = useState('');
  const [newAreaIcon, setNewAreaIcon] = useState('⚡');
  const [showAddArea, setShowAddArea] = useState(false);

  useEffect(() => { window.scrollTo(0, 0); }, [step]);

  const selectTemplate = (id) => {
    setSelectedTemplate(id);
    setAreas([...AREA_TEMPLATES[id].areas]);
  };

  const removeArea = (id) => setAreas(prev => prev.filter(a => a.id !== id));

  const addArea = () => {
    if (!newAreaName.trim()) return;
    setAreas(prev => [...prev, {
      id: 'custom_' + Date.now(), name: newAreaName.trim(), icon: newAreaIcon,
      q: newAreaQ.trim() || `Come è andata con ${newAreaName.trim()}?`
    }]);
    setNewAreaName(''); setNewAreaQ(''); setNewAreaIcon('⚡'); setShowAddArea(false);
  };

  const toggleAct = (id) => setActSelection(prev => ({ ...prev, [id]: !prev[id] }));

  const addCustomAct = () => {
    if (!newActName.trim()) return;
    setCustomActs(prev => [...prev, { id: 'custom_' + Date.now(), name: newActName.trim(), icon: newActIcon }]);
    setNewActName(''); setNewActIcon('⚡'); setShowAddAct(false);
  };

  const removeCustomAct = (id) => setCustomActs(prev => prev.filter(a => a.id !== id));

  const finish = () => {
    const selected = [];
    ACTIVITY_CATEGORIES.forEach(cat => {
      cat.items.forEach(a => {
        if (actSelection[a.id]) selected.push({ id: a.id, name: a.name, icon: a.icon });
      });
    });
    customActs.forEach(a => selected.push(a));
    onComplete({
      templateId: selectedTemplate, areas,
      activities: selected, createdAt: new Date().toISOString(),
    });
  };

  const selectedCount = Object.values(actSelection).filter(Boolean).length + customActs.length;

  return (
    <div style={styles.wrap}>
      <div style={styles.container}>
        <div style={styles.progress}>
          {[0, 1, 2].map(i => (
            <div key={i} style={{ flex: 1, height: 3, borderRadius: 2, background: i <= step ? '#6366f1' : 'rgba(255,255,255,0.06)' }} />
          ))}
        </div>

        {step === 0 && (
          <div>
            <div style={{ fontSize: 40, color: '#6366f1', marginBottom: 20 }}>◉</div>
            <h1 style={styles.h1}>Ogni sera, 2 minuti.</h1>
            <p style={styles.p}>Valuti la tua giornata sulle aree che contano per te. Niente motivazione vuota — solo dati, pattern, e azioni concrete.</p>
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

        {step === 1 && (
          <div>
            <h2 style={styles.h2}>Cosa vuoi tracciare?</h2>
            <p style={styles.pSm}>Scegli un preset, poi personalizza.</p>
            <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
              {Object.values(AREA_TEMPLATES).map(t => (
                <button key={t.id} onClick={() => selectTemplate(t.id)} style={{
                  padding: '8px 14px', borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: 'pointer',
                  border: selectedTemplate === t.id ? '1px solid #6366f1' : '1px solid rgba(255,255,255,0.06)',
                  background: selectedTemplate === t.id ? 'rgba(99,102,241,0.12)' : 'rgba(255,255,255,0.02)',
                  color: selectedTemplate === t.id ? '#c7d2fe' : '#64748b',
                }}>{t.name}</button>
              ))}
            </div>
            <div style={styles.card}>
              <p style={styles.label}>Le tue {areas.length} aree (tocca ✕ per rimuovere)</p>
              {areas.map(a => (
                <div key={a.id} style={styles.listItem}>
                  <span style={{ fontSize: 16 }}>{a.icon}</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: 13, fontWeight: 600, color: '#e0e4ec', margin: 0 }}>{a.name}</p>
                    <p style={{ fontSize: 11, color: '#475569', margin: '1px 0 0' }}>{a.q}</p>
                  </div>
                  <button onClick={() => removeArea(a.id)} style={styles.removeBtn}>✕</button>
                </div>
              ))}
              {!showAddArea ? (
                <button onClick={() => setShowAddArea(true)} style={styles.addBtn}>+ Aggiungi area personalizzata</button>
              ) : (
                <div style={styles.addForm}>
                  <div style={{ display: 'flex', gap: 5, marginBottom: 8, flexWrap: 'wrap' }}>
                    {EMOJI_OPTIONS.slice(0, 15).map(e => (
                      <button key={e} onClick={() => setNewAreaIcon(e)} style={{
                        width: 32, height: 32, borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: 16,
                        background: newAreaIcon === e ? 'rgba(99,102,241,0.25)' : 'rgba(255,255,255,0.04)',
                      }}>{e}</button>
                    ))}
                  </div>
                  <input value={newAreaName} onChange={e => setNewAreaName(e.target.value)} placeholder="Nome area (es: Finanze)" style={styles.input} />
                  <input value={newAreaQ} onChange={e => setNewAreaQ(e.target.value)} placeholder="Domanda serale (opzionale)" style={{ ...styles.input, marginTop: 6 }} />
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

        {step === 2 && (
          <div>
            <h2 style={styles.h2}>Attività ricorrenti</h2>
            <p style={styles.pSm}>
              Seleziona quelle che fai regolarmente, o aggiungine di tue.
              {selectedCount > 0 && <span style={{ color: '#6366f1', fontWeight: 700 }}> {selectedCount} selezionate</span>}
            </p>
            {ACTIVITY_CATEGORIES.map(cat => (
              <div key={cat.label} style={{ marginBottom: 20 }}>
                <p style={styles.catLabel}>{cat.label}</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {cat.items.map(a => {
                    const on = actSelection[a.id];
                    return (
                      <button key={a.id} onClick={() => toggleAct(a.id)} style={{
                        padding: '8px 14px', borderRadius: 10, cursor: 'pointer',
                        display: 'flex', alignItems: 'center', gap: 6,
                        border: on ? '1px solid #6366f1' : '1px solid rgba(255,255,255,0.06)',
                        background: on ? 'rgba(99,102,241,0.1)' : 'rgba(255,255,255,0.02)',
                        color: on ? '#c7d2fe' : '#64748b', fontSize: 13, fontWeight: 600,
                      }}>
                        <span style={{ fontSize: 14 }}>{a.icon}</span> {a.name}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
            {customActs.length > 0 && (
              <div style={{ marginBottom: 20 }}>
                <p style={styles.catLabel}>Le tue personalizzate</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {customActs.map(a => (
                    <div key={a.id} style={{
                      padding: '8px 14px', borderRadius: 10, border: '1px solid #6366f1',
                      background: 'rgba(99,102,241,0.1)', color: '#c7d2fe', fontSize: 13, fontWeight: 600,
                      display: 'flex', alignItems: 'center', gap: 6,
                    }}>
                      <span style={{ fontSize: 14 }}>{a.icon}</span> {a.name}
                      <button onClick={() => removeCustomAct(a.id)} style={{ background: 'none', border: 'none', color: '#818cf8', fontSize: 14, cursor: 'pointer', padding: '0 0 0 4px' }}>✕</button>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {!showAddAct ? (
              <button onClick={() => setShowAddAct(true)} style={{ ...styles.addBtn, marginBottom: 24 }}>+ Aggiungi attività personalizzata</button>
            ) : (
              <div style={{ ...styles.addForm, marginBottom: 24 }}>
                <div style={{ display: 'flex', gap: 5, marginBottom: 8, flexWrap: 'wrap' }}>
                  {EMOJI_OPTIONS.slice(0, 15).map(e => (
                    <button key={e} onClick={() => setNewActIcon(e)} style={{
                      width: 32, height: 32, borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: 16,
                      background: newActIcon === e ? 'rgba(99,102,241,0.25)' : 'rgba(255,255,255,0.04)',
                    }}>{e}</button>
                  ))}
                </div>
                <input value={newActName} onChange={e => setNewActName(e.target.value)} placeholder="Nome attività (es: Corsa mattutina)" style={styles.input} />
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
  wrap: { minHeight: '100vh', background: '#07070f', padding: '20px 16px 100px', display: 'flex', justifyContent: 'center', alignItems: 'flex-start' },
  container: { maxWidth: 440, width: '100%' },
  progress: { display: 'flex', gap: 6, marginBottom: 32 },
  h1: { fontSize: 26, fontWeight: 800, color: '#f0f1f5', letterSpacing: '-0.04em', marginBottom: 12, lineHeight: 1.2 },
  h2: { fontSize: 22, fontWeight: 800, color: '#f0f1f5', letterSpacing: '-0.03em', marginBottom: 6 },
  p: { fontSize: 15, color: '#6b7185', lineHeight: 1.6, marginBottom: 28 },
  pSm: { fontSize: 14, color: '#6b7185', lineHeight: 1.5, marginBottom: 20 },
  howItem: { display: 'flex', gap: 14, alignItems: 'flex-start', padding: '14px 16px', borderRadius: 14, background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.05)' },
  card: { padding: '14px 16px', borderRadius: 14, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', marginBottom: 24 },
  label: { fontSize: 11, fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 10 },
  catLabel: { fontSize: 12, fontWeight: 700, color: '#6b7185', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.04em' },
  listItem: { display: 'flex', alignItems: 'center', gap: 10, padding: '7px 0', borderBottom: '1px solid rgba(255,255,255,0.03)' },
  removeBtn: { background: 'none', border: 'none', color: '#475569', fontSize: 16, cursor: 'pointer', padding: '4px 8px' },
  addBtn: { width: '100%', padding: '10px', marginTop: 10, borderRadius: 10, border: '1px dashed rgba(99,102,241,0.3)', background: 'transparent', color: '#6366f1', fontSize: 13, fontWeight: 600, cursor: 'pointer' },
  addForm: { marginTop: 12, padding: '12px', borderRadius: 12, background: 'rgba(99,102,241,0.06)', border: '1px solid rgba(99,102,241,0.15)' },
  input: { width: '100%', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, padding: '10px 12px', color: '#e0e4ec', fontSize: 13, fontFamily: 'inherit', boxSizing: 'border-box', outline: 'none' },
  btn: { flex: 1, padding: '15px 24px', borderRadius: 14, background: 'linear-gradient(135deg, #6366f1 0%, #7c3aed 100%)', border: 'none', color: '#fff', fontSize: 15, fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 24px rgba(99,102,241,0.2)' },
  btnBack: { padding: '15px 20px', borderRadius: 14, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#6b7185', fontSize: 14, fontWeight: 600, cursor: 'pointer' },
  btnSmall: { flex: 1, padding: '10px', borderRadius: 10, border: 'none', fontSize: 13, fontWeight: 600, cursor: 'pointer' },
  btnRow: { display: 'flex', gap: 10 },
};
