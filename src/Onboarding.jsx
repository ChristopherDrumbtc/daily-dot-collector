import React, { useState } from 'react';
import { AREA_TEMPLATES, DEFAULT_ACTIVITIES } from './constants';

export default function Onboarding({ onComplete }) {
  const [step, setStep] = useState(0);
  const [selectedTemplate, setSelectedTemplate] = useState('peak');
  const [areas, setAreas] = useState(AREA_TEMPLATES.peak.areas);
  const [activities, setActivities] = useState(
    DEFAULT_ACTIVITIES.slice(0, 6).map(a => ({ ...a }))
  );
  const [activitySelection, setActivitySelection] = useState(
    Object.fromEntries(DEFAULT_ACTIVITIES.map(a => [a.id, ['coldcall','deepwork','workout','reading','content','networking'].includes(a.id)]))
  );

  const selectTemplate = (id) => {
    setSelectedTemplate(id);
    setAreas([...AREA_TEMPLATES[id].areas]);
  };

  const finish = () => {
    const selectedActs = DEFAULT_ACTIVITIES.filter(a => activitySelection[a.id]);
    onComplete({
      templateId: selectedTemplate,
      areas: areas,
      activities: selectedActs,
      createdAt: new Date().toISOString(),
    });
  };

  return (
    <div style={styles.wrap}>
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
          <div style={styles.stepWrap}>
            <div style={styles.heroIcon}>◉</div>
            <h1 style={styles.h1}>Ogni sera, 2 minuti.</h1>
            <p style={styles.p}>
              Valuti la tua giornata sulle aree che contano per te.
              Niente motivazione vuota — solo dati, pattern, e azioni concrete.
            </p>

            <div style={styles.howWrap}>
              {[
                { icon: '⚡', title: 'Valuta', desc: 'Dai un voto da 1 a 10 su ogni area' },
                { icon: '🔍', title: 'Analizza', desc: 'Vedi trend, punti deboli, progressi' },
                { icon: '🔄', title: 'Chiudi il loop', desc: 'Errore → causa → fix → azione domani' },
              ].map((item, i) => (
                <div key={i} style={styles.howItem}>
                  <span style={{ fontSize: 20 }}>{item.icon}</span>
                  <div>
                    <p style={styles.howTitle}>{item.title}</p>
                    <p style={styles.howDesc}>{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <button onClick={() => setStep(1)} style={styles.btn}>
              Inizia il setup
            </button>
          </div>
        )}

        {/* ═══ STEP 1: SCEGLI TEMPLATE ═══ */}
        {step === 1 && (
          <div style={styles.stepWrap}>
            <h2 style={styles.h2}>Cosa vuoi tracciare?</h2>
            <p style={styles.pSm}>Scegli un preset o personalizzalo dopo.</p>

            <div style={styles.templates}>
              {Object.values(AREA_TEMPLATES).map(t => (
                <button key={t.id} onClick={() => selectTemplate(t.id)} style={{
                  ...styles.templateCard,
                  borderColor: selectedTemplate === t.id ? '#6366f1' : 'rgba(255,255,255,0.06)',
                  background: selectedTemplate === t.id ? 'rgba(99,102,241,0.08)' : 'rgba(255,255,255,0.02)',
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <p style={styles.tName}>{t.name}</p>
                    {selectedTemplate === t.id && <span style={{ color: '#6366f1', fontSize: 16 }}>✓</span>}
                  </div>
                  <p style={styles.tDesc}>{t.desc}</p>
                  <div style={styles.tIcons}>
                    {t.areas.slice(0, 5).map(a => (
                      <span key={a.id} style={{ fontSize: 14 }}>{a.icon}</span>
                    ))}
                    {t.areas.length > 5 && <span style={{ fontSize: 11, color: '#475569' }}>+{t.areas.length - 5}</span>}
                  </div>
                </button>
              ))}
            </div>

            {/* Preview aree selezionate */}
            <div style={styles.preview}>
              <p style={styles.previewTitle}>Le tue {areas.length} aree:</p>
              {areas.map((a, i) => (
                <div key={a.id} style={styles.previewItem}>
                  <span style={{ fontSize: 14 }}>{a.icon}</span>
                  <span style={styles.previewName}>{a.name}</span>
                </div>
              ))}
            </div>

            <div style={styles.btnRow}>
              <button onClick={() => setStep(0)} style={styles.btnBack}>Indietro</button>
              <button onClick={() => setStep(2)} style={styles.btn}>Avanti</button>
            </div>
          </div>
        )}

        {/* ═══ STEP 2: ATTIVITÀ ═══ */}
        {step === 2 && (
          <div style={styles.stepWrap}>
            <h2 style={styles.h2}>Attività ricorrenti</h2>
            <p style={styles.pSm}>Seleziona le attività che fai spesso. Potrai modificarle dopo.</p>

            <div style={styles.actGrid}>
              {DEFAULT_ACTIVITIES.map(a => {
                const on = activitySelection[a.id];
                return (
                  <button key={a.id} onClick={() => setActivitySelection(prev => ({ ...prev, [a.id]: !prev[a.id] }))}
                    style={{
                      ...styles.actBtn,
                      borderColor: on ? '#6366f1' : 'rgba(255,255,255,0.06)',
                      background: on ? 'rgba(99,102,241,0.1)' : 'rgba(255,255,255,0.02)',
                      color: on ? '#c7d2fe' : '#64748b',
                    }}>
                    <span style={{ fontSize: 18 }}>{a.icon}</span>
                    <span style={{ fontSize: 12, fontWeight: 600 }}>{a.name}</span>
                  </button>
                );
              })}
            </div>

            <div style={styles.btnRow}>
              <button onClick={() => setStep(1)} style={styles.btnBack}>Indietro</button>
              <button onClick={finish} style={styles.btn}>
                Inizia a tracciare
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  wrap: {
    minHeight: '100vh', background: '#07070f',
    display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
    padding: '20px 16px', overflowY: 'auto',
  },
  container: {
    maxWidth: 440, width: '100%',
  },
  progress: {
    display: 'flex', gap: 6, marginBottom: 32,
  },
  stepWrap: {
    animation: 'fadeIn 0.3s ease',
  },
  heroIcon: {
    fontSize: 40, color: '#6366f1', marginBottom: 20,
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
    fontSize: 14, color: '#6b7185', lineHeight: 1.5, marginBottom: 24,
  },
  howWrap: {
    display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 36,
  },
  howItem: {
    display: 'flex', gap: 14, alignItems: 'flex-start',
    padding: '14px 16px', borderRadius: 14,
    background: 'rgba(255,255,255,0.025)',
    border: '1px solid rgba(255,255,255,0.05)',
  },
  howTitle: {
    fontSize: 14, fontWeight: 700, color: '#e0e4ec', marginBottom: 2,
  },
  howDesc: {
    fontSize: 13, color: '#6b7185', lineHeight: 1.4,
  },
  templates: {
    display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24,
  },
  templateCard: {
    width: '100%', textAlign: 'left', padding: '14px 16px',
    borderRadius: 14, border: '1px solid', cursor: 'pointer',
    transition: 'all 0.15s',
  },
  tName: {
    fontSize: 15, fontWeight: 700, color: '#e0e4ec', marginBottom: 4,
  },
  tDesc: {
    fontSize: 12, color: '#6b7185', lineHeight: 1.4, marginBottom: 8,
  },
  tIcons: {
    display: 'flex', gap: 6, alignItems: 'center',
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
  previewItem: {
    display: 'flex', alignItems: 'center', gap: 10,
    padding: '6px 0',
  },
  previewName: {
    fontSize: 13, color: '#94a3b8',
  },
  actGrid: {
    display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 32,
  },
  actBtn: {
    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
    padding: '14px 10px', borderRadius: 14,
    border: '1px solid', cursor: 'pointer', transition: 'all 0.15s',
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
  btnRow: {
    display: 'flex', gap: 10,
  },
};
