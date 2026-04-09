// ═══════════════════════════════════════════════════════
// AREA TEMPLATES — preset pronti + possibilità custom
// ═══════════════════════════════════════════════════════

export const AREA_TEMPLATES = {
  peak: {
    id: 'peak',
    name: 'Peak Performance',
    desc: 'Le 8 leve fondamentali della produttività e crescita personale',
    areas: [
      { id: 'execution', name: 'Execution', icon: '⚡', q: 'Ho completato ciò che avevo pianificato?' },
      { id: 'focus', name: 'Deep Focus', icon: '🎯', q: 'Ho protetto il focus e lavorato senza distrazioni?' },
      { id: 'decisions', name: 'Decisioni', icon: '♟️', q: 'Ho preso decisioni lucide o ho procrastinato/evitato?' },
      { id: 'energy', name: 'Energia', icon: '🔋', q: 'Ho gestito bene sonno, cibo, movimento, stress?' },
      { id: 'learning', name: 'Apprendimento', icon: '🧠', q: 'Ho imparato qualcosa di utile oggi?' },
      { id: 'relationships', name: 'Relazioni', icon: '🤝', q: 'Ho investito nelle relazioni che contano?' },
      { id: 'honesty', name: 'Onestà Radicale', icon: '💎', q: 'Sono stato onesto con me stesso e gli altri?' },
      { id: 'vision', name: 'Visione', icon: '🔭', q: 'Le mie azioni di oggi servono il mio obiettivo a 1-3 anni?' },
    ]
  },
  dalio: {
    id: 'dalio',
    name: 'Ray Dalio 5-Step',
    desc: 'Il processo in 5 step + principi comportamentali di Ray Dalio',
    areas: [
      { id: 'goals', name: 'Chiarezza Obiettivi', icon: '🎯', q: 'Obiettivi chiari e definiti oggi?' },
      { id: 'problems', name: 'Identif. Problemi', icon: '🔍', q: 'Ho visto i problemi reali senza evitarli?' },
      { id: 'diagnosis', name: 'Diagnosi Root Cause', icon: '🧬', q: 'Ho cercato la causa profonda, non il sintomo?' },
      { id: 'design', name: 'Design Soluzioni', icon: '📐', q: 'Ho progettato prima di agire?' },
      { id: 'execution', name: 'Esecuzione', icon: '⚡', q: 'Ho completato ciò che avevo pianificato?' },
      { id: 'truth', name: 'Radical Truth', icon: '💎', q: 'Onesto con me stesso e gli altri?' },
      { id: 'pain', name: 'Pain + Reflection', icon: '🔥', q: 'Frustrazione trasformata in apprendimento?' },
      { id: 'openmind', name: 'Open-Mindedness', icon: '🌐', q: 'Ho considerato prospettive diverse?' },
      { id: 'focus', name: 'Disciplina / Focus', icon: '🧘', q: 'Focus protetto, distrazioni evitate?' },
      { id: 'higher', name: 'Higher-Level Thinking', icon: '🦅', q: 'Mi sono visto dall\'alto come designer?' },
    ]
  },
  founder: {
    id: 'founder',
    name: 'Founder Mode',
    desc: 'Per imprenditori e freelancer — revenue, prodotto, crescita',
    areas: [
      { id: 'revenue', name: 'Revenue Actions', icon: '💰', q: 'Ho fatto azioni dirette verso il fatturato?' },
      { id: 'product', name: 'Prodotto/Valore', icon: '🛠️', q: 'Ho migliorato il prodotto o il servizio?' },
      { id: 'outreach', name: 'Outreach', icon: '📡', q: 'Ho contattato prospect, partner, clienti?' },
      { id: 'execution', name: 'Execution', icon: '⚡', q: 'Ho chiuso ciò che dovevo chiudere?' },
      { id: 'learning', name: 'Skill Building', icon: '🧠', q: 'Ho investito in competenze critiche?' },
      { id: 'systems', name: 'Sistemi/Processi', icon: '⚙️', q: 'Ho automatizzato o sistematizzato qualcosa?' },
      { id: 'energy', name: 'Energia', icon: '🔋', q: 'Gestione corpo e mente: sonno, cibo, sport?' },
      { id: 'vision', name: 'Strategia', icon: '♟️', q: 'Le azioni di oggi portano dove voglio tra 1 anno?' },
    ]
  },
  wellness: {
    id: 'wellness',
    name: 'Life Balance',
    desc: 'Equilibrio vita — mente, corpo, relazioni, crescita',
    areas: [
      { id: 'body', name: 'Corpo', icon: '💪', q: 'Ho fatto movimento e mangiato bene?' },
      { id: 'mind', name: 'Mente', icon: '🧘', q: 'Ho avuto momenti di calma e presenza?' },
      { id: 'sleep', name: 'Sonno', icon: '🌙', q: 'Qualità e quantità del sonno?' },
      { id: 'work', name: 'Lavoro', icon: '⚡', q: 'Sono stato produttivo e soddisfatto?' },
      { id: 'relationships', name: 'Relazioni', icon: '❤️', q: 'Ho dedicato tempo a chi conta?' },
      { id: 'growth', name: 'Crescita', icon: '📚', q: 'Ho imparato o provato qualcosa di nuovo?' },
      { id: 'joy', name: 'Gioia', icon: '✨', q: 'Ho fatto qualcosa che mi rende felice?' },
      { id: 'integrity', name: 'Integrità', icon: '💎', q: 'Ho agito in linea con i miei valori?' },
    ]
  }
};

export const ACTIVITY_CATEGORIES = [
  {
    label: 'Lavoro & Produttività',
    items: [
      { id: 'deepwork', name: 'Deep Work', icon: '🧠' },
      { id: 'meetings', name: 'Meeting', icon: '💬' },
      { id: 'emails', name: 'Email & Admin', icon: '📧' },
      { id: 'planning', name: 'Pianificazione', icon: '📋' },
      { id: 'creative', name: 'Lavoro Creativo', icon: '🎨' },
      { id: 'coding', name: 'Coding', icon: '💻' },
      { id: 'writing', name: 'Scrittura', icon: '✍️' },
    ]
  },
  {
    label: 'Corpo & Salute',
    items: [
      { id: 'workout', name: 'Allenamento', icon: '🏋️' },
      { id: 'running', name: 'Corsa / Cardio', icon: '🏃' },
      { id: 'walk', name: 'Camminata', icon: '🚶' },
      { id: 'cooking', name: 'Cucina sana', icon: '🥗' },
      { id: 'sleep', name: 'Sonno 7h+', icon: '😴' },
      { id: 'noalcohol', name: 'Zero alcol', icon: '🚫' },
    ]
  },
  {
    label: 'Mente & Crescita',
    items: [
      { id: 'reading', name: 'Lettura', icon: '📖' },
      { id: 'learning', name: 'Studio / Corso', icon: '📚' },
      { id: 'meditation', name: 'Meditazione', icon: '🧘' },
      { id: 'journaling', name: 'Journaling', icon: '📝' },
      { id: 'podcast', name: 'Podcast', icon: '🎧' },
      { id: 'nophone', name: 'Digital Detox', icon: '📵' },
    ]
  },
  {
    label: 'Relazioni & Social',
    items: [
      { id: 'family', name: 'Tempo famiglia', icon: '👨‍👩‍👧' },
      { id: 'friends', name: 'Tempo amici', icon: '🍻' },
      { id: 'networking', name: 'Networking', icon: '🤝' },
      { id: 'date', name: 'Coppia / Date', icon: '❤️' },
      { id: 'helping', name: 'Aiutare qualcuno', icon: '🫶' },
    ]
  },
  {
    label: 'Business & Vendita',
    items: [
      { id: 'coldcall', name: 'Cold Call', icon: '📞' },
      { id: 'sales', name: 'Vendita / Demo', icon: '🖥️' },
      { id: 'content', name: 'Contenuti Social', icon: '🎬' },
      { id: 'outreach', name: 'Outreach', icon: '📡' },
      { id: 'clients', name: 'Gestione Clienti', icon: '💼' },
    ]
  },
  {
    label: 'Tempo Libero',
    items: [
      { id: 'hobby', name: 'Hobby', icon: '🎯' },
      { id: 'music', name: 'Musica', icon: '🎵' },
      { id: 'gaming', name: 'Gaming', icon: '🎮' },
      { id: 'nature', name: 'Natura / Aria aperta', icon: '🌿' },
      { id: 'travel', name: 'Viaggio / Gita', icon: '✈️' },
    ]
  },
];

// Helpers
export const getColor = (v) => {
  if (!v || v === 0) return '#3b3f51';
  if (v <= 2) return '#ef4444';
  if (v <= 4) return '#f97316';
  if (v <= 5) return '#a1a1aa';
  if (v <= 7) return '#22c55e';
  if (v <= 9) return '#6366f1';
  return '#a855f7';
};

export const dk = (d) => d.toISOString().split('T')[0];
export const fmtDate = (d) => d.toLocaleDateString('it-IT', { weekday: 'short', day: 'numeric', month: 'short' });
export const fmtDateLong = (d) => d.toLocaleDateString('it-IT', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
