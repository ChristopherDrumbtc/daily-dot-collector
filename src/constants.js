export const AREAS = [
  { id: "goals", name: "Chiarezza Obiettivi", icon: "🎯", principle: "5-Step #1: Have clear goals", q: "Obiettivi chiari e definiti oggi?" },
  { id: "problems", name: "Identif. Problemi", icon: "🔍", principle: "5-Step #2: Identify problems", q: "Ho visto i problemi reali senza evitarli?" },
  { id: "diagnosis", name: "Diagnosi Root Cause", icon: "🧬", principle: "5-Step #3: Diagnose root causes", q: "Ho cercato la causa profonda, non il sintomo?" },
  { id: "design", name: "Design Soluzioni", icon: "📐", principle: "5-Step #4: Design plans", q: "Ho progettato prima di agire?" },
  { id: "execution", name: "Esecuzione", icon: "⚡", principle: "5-Step #5: Push through", q: "Ho completato ciò che avevo pianificato?" },
  { id: "truth", name: "Radical Truth", icon: "💎", principle: "Embrace reality", q: "Onesto con me stesso e gli altri?" },
  { id: "pain", name: "Pain + Reflection", icon: "🔥", principle: "Pain + Reflection = Progress", q: "Frustrazione trasformata in apprendimento?" },
  { id: "openmind", name: "Open-Mindedness", icon: "🌐", principle: "Radically open-minded", q: "Ho considerato prospettive diverse?" },
  { id: "focus", name: "Disciplina / Focus", icon: "🧘", principle: "Good work habits", q: "Focus protetto, distrazioni evitate?" },
  { id: "higher", name: "Higher-Level Thinking", icon: "🦅", principle: "Machine thinking", q: "Mi sono visto dall'alto come designer?" },
];

export const ACTIVITY_TAGS = [
  { id: "coldcall", name: "Cold Call", icon: "📞" },
  { id: "beclub", name: "BE Club", icon: "💬" },
  { id: "studio", name: "Studio/Formazione", icon: "📚" },
  { id: "social", name: "Contenuti Social", icon: "🎬" },
  { id: "palestra", name: "Palestra", icon: "🏋️" },
  { id: "demo", name: "Demo/Call Vendita", icon: "🖥️" },
  { id: "lettura", name: "Lettura", icon: "📖" },
  { id: "networking", name: "Networking", icon: "🤝" },
];

export const getColor = (v) => {
  if (!v) return "#475569";
  if (v <= 2) return "#ef4444"; if (v <= 4) return "#f97316";
  if (v <= 5) return "#6b7280"; if (v <= 7) return "#22c55e";
  if (v <= 9) return "#3b82f6"; return "#a855f7";
};

export const getBg = (v) => {
  if (!v) return "rgba(71,85,105,0.06)";
  if (v <= 2) return "rgba(239,68,68,0.06)"; if (v <= 4) return "rgba(249,115,22,0.06)";
  if (v <= 5) return "rgba(107,114,128,0.06)"; if (v <= 7) return "rgba(34,197,94,0.06)";
  if (v <= 9) return "rgba(59,130,246,0.06)"; return "rgba(168,85,247,0.06)";
};

export const dk = (d) => d.toISOString().split("T")[0];
export const fmtDate = (d) => d.toLocaleDateString("it-IT", { weekday: "short", day: "numeric", month: "short" });
