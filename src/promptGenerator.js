import { dk, fmtDate } from './constants';

export function generatePrompt(data, date, entry, avg, filled, last30, areaRank, weakest) {
  const areas = data.profile?.areas || [];
  const activities = data.profile?.activities || [];
  
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomLabel = tomorrow.toLocaleDateString('it-IT', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  let p = `ORGANIZZA LA MIA AGENDA DI DOMANI: ${tomLabel}\n\n`;

  p += `═══════════════════════════════════════\n`;
  p += `IL MIO PROFILO\n`;
  p += `═══════════════════════════════════════\n\n`;
  p += `Sto usando il Daily Dot Collector, un sistema per misurare la mia crescita quotidiana su ${areas.length} aree personalizzate. Ti passo i miei dati così puoi organizzarmi la giornata in modo ottimale.\n\n`;

  p += `LE MIE AREE DI TRACCIAMENTO:\n`;
  areas.forEach((a, i) => {
    p += `${i + 1}. ${a.icon} ${a.name} — "${a.q}"\n`;
  });

  p += `\nREGOLE GENERALI:\n`;
  p += `- Controlla il mio Google Calendar per domani e identifica gli slot liberi reali\n`;
  p += `- MAI sovrapporre eventi già esistenti\n`;
  p += `- Proponi l'agenda completa PRIMA di creare eventi\n`;
  p += `- Dopo la mia conferma, crea gli eventi nel Google Calendar\n`;
  p += `- Rispondi in italiano\n\n`;

  p += `═══════════════════════════════════════\n`;
  p += `DATI DAL MIO DOT COLLECTOR\n`;
  p += `═══════════════════════════════════════\n\n`;

  if (last30.length > 0) {
    p += `📊 Performance ultimi ${last30.length} giorni:\n\n`;
    p += `RANKING AREE (dalla più forte alla più debole):\n`;
    areaRank.filter(a => a.n > 0).forEach((a, i) => {
      const bar = a.avg >= 7 ? '✅' : a.avg >= 5 ? '⚠️' : '🔴';
      p += `${i + 1}. ${bar} ${a.name}: ${a.avg.toFixed(1)}/10 (${a.n} giorni)\n`;
    });

    if (weakest.length > 0 && weakest[0].n > 0) {
      p += `\n⚠️ AREE CRITICHE DA MIGLIORARE (priorità nell'agenda):\n`;
      weakest.filter(a => a.n > 0).forEach(a => {
        p += `- ${a.icon} ${a.name}: ${a.avg.toFixed(1)}/10\n`;
      });
    }

    const recent = last30.slice(0, 3);
    if (recent.length > 0) {
      p += `\nULTIMI 3 GIORNI:\n`;
      recent.forEach(d => {
        const e = data.entries[d.date];
        p += `\n${d.date} — Media: ${d.avg.toFixed(1)}\n`;
        areas.forEach(a => {
          if (d.scores[a.id]) p += `  ${a.icon} ${a.name}: ${d.scores[a.id]}/10\n`;
        });
        if (e?.wins) p += `  🏆 Vittorie: ${e.wins}\n`;
        if (e?.lesson) p += `  🔥 Lezione: ${e.lesson}\n`;
        if (e?.action) p += `  ⚡ Azione correttiva: ${e.action}\n`;
      });
    }
  } else {
    p += `📊 Nessun dato ancora nel Dot Collector (primo giorno).\n`;
  }

  if (filled.length > 0) {
    p += `\n═══════════════════════════════════════\n`;
    p += `VALUTAZIONE DI OGGI (${fmtDate(date)})\n`;
    p += `═══════════════════════════════════════\n`;
    p += `Media: ${avg.toFixed(1)}/10\n`;
    areas.forEach(a => {
      if (entry.scores[a.id]) p += `${a.icon} ${a.name}: ${entry.scores[a.id]}/10\n`;
    });
    if (entry.wins) p += `🏆 Vittorie: ${entry.wins}\n`;
    if (entry.lesson) p += `🔥 Lezione: ${entry.lesson}\n`;
    if (entry.action) p += `⚡ Azione correttiva per domani: ${entry.action}\n`;
    const acts = activities.filter(t => entry.activities?.[t.id]);
    if (acts.length) p += `Attività fatte: ${acts.map(t => t.name).join(', ')}\n`;
  }

  const openIssues = (data.issues || []).filter(i => i.status === 'open');
  if (openIssues.length > 0) {
    p += `\n═══════════════════════════════════════\n`;
    p += `ISSUE LOG APERTE (${openIssues.length})\n`;
    p += `═══════════════════════════════════════\n`;
    openIssues.forEach(i => {
      const areaName = areas.find(a => a.id === i.area)?.name || i.area;
      p += `- [Sev ${i.severity}] ${i.problem} | Area: ${areaName} | Root: ${i.root || '?'} | Fix: ${i.fix || 'da progettare'}\n`;
    });
  }

  p += `\n═══════════════════════════════════════\n`;
  p += `ISTRUZIONI\n`;
  p += `═══════════════════════════════════════\n\n`;
  p += `1. CONTROLLA il mio Google Calendar per domani ${tomLabel}\n`;
  p += `2. IDENTIFICA gli slot liberi reali\n`;
  p += `3. ORGANIZZA la giornata ottimale, dando priorità al miglioramento delle aree deboli\n`;
  p += `4. Se c'è un'azione correttiva da oggi, integrala nell'agenda\n`;
  p += `5. PROPONI l'agenda prima di creare gli eventi\n`;
  p += `6. Dopo conferma, CREA gli eventi nel Google Calendar\n`;

  return p;
}
