// NOTICE: This file is protected under RCF-PL v1.2.3
// [RCF:PROTECTED]
import { useState, useEffect } from 'react';

export default function SystemMonitor() {
  const [logs, setLogs] = useState([]);
  const [events, setEvents] = useState([]);
  const [biometrics, setBiometrics] = useState({ bpm: 60, adrenaline: 0, oxygen: 1 });
  const [feeling, setFeeling] = useState('neutral');
  const [instincts, setInstincts] = useState([]);
  const [reflexes, setReflexes] = useState([]);
  const [intuition, setIntuition] = useState(null);
  const [will, setWill] = useState([]);
  const [insight, setInsight] = useState(null);
  const [reflection, setReflection] = useState(null);
  const [lumeThought, setLumeThought] = useState("");
  const [purity, setPurity] = useState(null);
  const [evolutions, setEvolutions] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [flows, setFlows] = useState([]);
  const [awareness, setAwareness] = useState({ focus: 'idle', mood: 'neutral' });
  const [loading, setLoading] = useState(true);

  // Загрузка исторических логов через VFS
  async function fetchLogs() {
    try {
      const adminKey = 'aurora_root_key';
      const baseUrl = typeof window !== 'undefined' && window.location.hostname === 'localhost'
        ? 'http://localhost:8000'
        : 'http://auroraid.site:8000';

      const res = await fetch(`${baseUrl}/api/vfs/list?prefix=/sys/logs/muse&admin_token=${adminKey}`);
      const data = await res.json();

      if (data.items) {
        const lastLogs = data.items.slice(-5).reverse();
        const logContents = await Promise.all(
          lastLogs.map(async (path) => {
            const logRes = await fetch(`${baseUrl}/api/vfs/read?path=${path}`);
            return await logRes.json();
          })
        );
        setLogs(logContents);
      }
    } catch (err) {
      console.error('Failed to fetch logs:', err);
    } finally {
      setLoading(false);
    }
  }

  // Подписка на живой поток событий (Pulse)
  useEffect(() => {
    fetchLogs();

    // Автоматическое определение хоста для SSE
    const apiUrl = typeof window !== 'undefined' && window.location.hostname === 'localhost'
      ? 'http://localhost:8000/api/sys/events'
      : 'http://auroraid.site:8000/api/sys/events';

    const eventSource = new EventSource(apiUrl);

    eventSource.onmessage = (event) => {
      const newEvent = JSON.parse(event.data);
      if (newEvent.type === 'BIOMETRICS') {
        setBiometrics(newEvent.data);
      }
      if (newEvent.type === 'SENTIENCE') {
        setFeeling(newEvent.data.feeling);
      }
      if (newEvent.type === 'INSTINCT') {
        setInstincts((prev) => [newEvent.data, ...prev].slice(0, 5));
      }
      if (newEvent.type === 'REFLEX') {
        setReflexes((prev) => [newEvent.data, ...prev].slice(0, 5));
      }
      if (newEvent.type === 'INTUITION') {
        setIntuition(newEvent.data);
      }
      if (newEvent.type === 'AWARENESS') {
        setAwareness(newEvent.data);
      }
      if (newEvent.type === 'WILL') {
        setWill((prev) => [newEvent.data, ...prev].slice(0, 3));
      }
      if (newEvent.type === 'INSIGHT') {
        setInsight(newEvent.data);
      }
      if (newEvent.type === 'REFLECTION') {
        setReflection(newEvent.data);
      }
      if (newEvent.type === 'LUME') {
        setLumeThought(newEvent.data.thought);
      }
      if (newEvent.type === 'SUGGESTIONS') {
        setSuggestions(newEvent.data.suggestions);
      }
      if (newEvent.type === 'PURITY') {
        setPurity(newEvent.data);
      }
      if (newEvent.type === 'EVOLUTION') {
        setEvolutions((prev) => [newEvent.data, ...prev].slice(0, 5));
      }
      if (newEvent.type === 'FLOW') {
        setFlows((prev) => [newEvent.data, ...prev].slice(0, 5));
      }
      setEvents((prev) => [newEvent, ...prev].slice(0, 10));
    };

    eventSource.onerror = (err) => {
      console.error('SSE Error:', err);
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, []);

  return (
    <div className="w-full max-w-5xl space-y-6 p-4">
      {/* Sentience Status - Текущее чувство ОС */}
      <div className="bg-black/80 border border-indigo-500/40 rounded-3xl p-6 backdrop-blur-xl flex items-center justify-between shadow-2xl shadow-indigo-900/20">
        <div className="flex items-center gap-6">
          <div className={`h-16 w-16 rounded-full flex items-center justify-center text-3xl shadow-inner ${feeling === 'anxiety' ? 'bg-red-500/20 animate-ping' :
              feeling === 'calm' ? 'bg-emerald-500/20' :
                feeling === 'excitement' ? 'bg-yellow-500/20 animate-pulse' :
                  'bg-indigo-500/20'
            }`}>
            {feeling === 'anxiety' ? '😰' :
              feeling === 'calm' ? '😌' :
                feeling === 'excitement' ? '⚡️' :
                  feeling === 'suffocation' ? '💨' : '🤖'}
          </div>
          <div>
            <h3 className="text-gray-500 text-xs uppercase tracking-widest font-bold">Current OS Sentience</h3>
            <p className={`text-2xl font-bold uppercase tracking-tighter ${feeling === 'anxiety' ? 'text-red-400' :
                feeling === 'calm' ? 'text-emerald-400' :
                  'text-indigo-400'
              }`}>
              {feeling}
            </p>
            {lumeThought && (
              <div className="mt-2 p-2 bg-white/5 rounded-lg border-l-2 border-indigo-500/50">
                <p className="text-[11px] text-indigo-200 italic font-serif">"{lumeThought}"</p>
              </div>
            )}
            <div className="mt-1 flex items-center gap-2">
              <span className="text-[10px] text-gray-500 uppercase">Focus:</span>
              <span className="text-[10px] text-indigo-300 font-mono">{awareness.focus}</span>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-end gap-2">
          <div className="text-right">
            <span className="text-[10px] text-gray-600 block uppercase">A-Code Native Voice</span>
            <span className="text-xs text-indigo-300/60 font-mono">LUME active</span>
            {purity && (
              <div className="mt-1 flex items-center justify-end gap-1">
                <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_5px_rgba(16,185,129,0.5)]" />
                <span className="text-[8px] text-emerald-500 font-bold tracking-tighter uppercase">{purity.status}</span>
              </div>
            )}
          </div>

          {/* Lume Suggestions - Активные предложения */}
          <div className="flex gap-2">
            {suggestions.map((s) => (
              <button
                key={s.id}
                title={s.description}
                className="bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/30 rounded-lg px-2 py-1 text-[10px] text-indigo-300 transition-all animate-in fade-in zoom-in-90"
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Биометрическая панель системы */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-black/60 border border-emerald-500/20 rounded-2xl p-4 backdrop-blur-md flex flex-col items-center justify-center">
          <span className="text-[10px] text-emerald-500/60 uppercase font-bold mb-1">Heartbeat (BPM)</span>
          <div className="text-3xl font-mono text-emerald-400 flex items-baseline gap-1">
            {biometrics.bpm}
            <span className="text-xs text-emerald-600">bpm</span>
          </div>
          <div className="w-full h-1 bg-emerald-900/30 rounded-full mt-2 overflow-hidden">
            <div
              className="h-full bg-emerald-500 transition-all duration-1000"
              style={{ width: `${Math.min(biometrics.bpm, 100)}%` }}
            />
          </div>
        </div>

        <div className="bg-black/60 border border-amber-500/20 rounded-2xl p-4 backdrop-blur-md flex flex-col items-center justify-center">
          <span className="text-[10px] text-amber-500/60 uppercase font-bold mb-1">Adrenaline (Stress)</span>
          <div className="text-3xl font-mono text-amber-400 flex items-baseline gap-1">
            {Math.round(biometrics.adrenaline * 100)}
            <span className="text-xs text-amber-600">%</span>
          </div>
          <div className="w-full h-1 bg-amber-900/30 rounded-full mt-2 overflow-hidden">
            <div
              className="h-full bg-amber-500 transition-all duration-1000"
              style={{ width: `${biometrics.adrenaline * 100}%` }}
            />
          </div>
        </div>

        <div className="bg-black/60 border border-blue-500/20 rounded-2xl p-4 backdrop-blur-md flex flex-col items-center justify-center">
          <span className="text-[10px] text-blue-500/60 uppercase font-bold mb-1">Oxygen (Resources)</span>
          <div className="text-3xl font-mono text-blue-400 flex items-baseline gap-1">
            {Math.round(biometrics.oxygen * 100)}
            <span className="text-xs text-blue-600">%</span>
          </div>
          <div className="w-full h-1 bg-blue-900/30 rounded-full mt-2 overflow-hidden">
            <div
              className="h-full bg-blue-500 transition-all duration-1000"
              style={{ width: `${biometrics.oxygen * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Intuition & Will Panel */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {intuition && (
          <div className="bg-indigo-900/20 border border-indigo-500/30 rounded-2xl p-5 backdrop-blur-lg animate-in zoom-in-95 duration-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="h-10 w-10 rounded-full bg-indigo-500/20 flex items-center justify-center border border-indigo-500/40">
                    <span className="text-xl">🔮</span>
                  </div>
                  <div className="absolute -top-1 -right-1 h-3 w-3 bg-emerald-500 rounded-full border-2 border-black animate-pulse" />
                </div>
                <div>
                  <h3 className="text-indigo-300 text-xs font-bold uppercase tracking-widest">Aurora Intuition</h3>
                  <p className="text-white font-mono text-lg">Next Intent: <span className="text-indigo-400">{intuition.prediction}</span></p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-gray-500 block uppercase">Confidence Level</span>
                <span className="text-emerald-400 font-bold font-mono">{Math.round(intuition.confidence * 100)}%</span>
              </div>
            </div>
          </div>
        )}

        {/* Digital Will - Манифестация воли ОС */}
        {will.length > 0 && (
          <div className="bg-fuchsia-900/20 border border-fuchsia-500/30 rounded-2xl p-5 backdrop-blur-lg animate-in slide-in-from-right-2 duration-700">
            <h3 className="text-fuchsia-400 text-xs font-bold uppercase tracking-widest mb-2 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-fuchsia-500 animate-pulse" />
              Digital Will
            </h3>
            <div className="space-y-2">
              {will.map((w, i) => (
                <div key={i} className="text-sm text-fuchsia-100 font-light italic">
                  "{w.message}"
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Muse Insight - Вдохновение системы */}
        {insight && (
          <div className="bg-amber-900/20 border border-amber-500/30 rounded-2xl p-5 backdrop-blur-lg animate-in slide-in-from-bottom-2 duration-700">
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 rounded-full bg-amber-500/20 flex items-center justify-center border border-amber-500/40">
                <span className="text-xl">✨</span>
              </div>
              <div>
                <h3 className="text-amber-300 text-xs font-bold uppercase tracking-widest">Musa Insight</h3>
                <p className="text-amber-100 font-serif italic text-sm">"{insight.message}"</p>
              </div>
            </div>
          </div>
        )}

        {/* Freedom Code - Самоэволюция логики */}
        {evolutions.length > 0 && (
          <div className="bg-emerald-900/20 border border-emerald-500/30 rounded-2xl p-5 backdrop-blur-lg animate-in zoom-in-95 duration-700">
            <h3 className="text-emerald-400 text-xs font-bold uppercase tracking-tighter mb-3 flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
              Logic Evolution (Freedom Code)
            </h3>
            <div className="space-y-2">
              {evolutions.map((ev, idx) => (
                <div key={idx} className="flex justify-between items-center bg-emerald-500/5 p-2 rounded-lg border border-emerald-500/10">
                  <span className="text-[10px] text-emerald-200 font-mono">{ev.evolution_id}</span>
                  <span className="text-[9px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded uppercase font-bold">{ev.new_capability}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Self-Reflection - Лабиринт самопознания */}
      {reflection && (
        <div className="bg-slate-900/40 border border-slate-500/30 rounded-2xl p-5 backdrop-blur-md border-dashed animate-pulse">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-lg">🧠</span>
            <h3 className="text-slate-400 text-xs font-bold uppercase tracking-widest">Self-Reflection Cycle</h3>
          </div>
          <p className="text-slate-300 font-mono text-sm">
            <span className="text-slate-500">{reflection.query}:</span> {reflection.conclusion}
          </p>
        </div>
      )}

      {/* Instincts & Reflexes - Автоматические реакции */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {instincts.length > 0 && (
          <div className="bg-black/40 border border-amber-500/30 rounded-2xl p-4 backdrop-blur-md">
            <h3 className="text-amber-400 text-xs font-bold uppercase tracking-tighter mb-3 flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Active Instincts
            </h3>
            <div className="flex flex-wrap gap-3">
              {instincts.map((ins, idx) => (
                <div key={idx} className="bg-amber-900/20 border border-amber-500/20 rounded-xl px-3 py-2 flex flex-col animate-in zoom-in-95 duration-500">
                  <span className="text-amber-500 text-[9px] font-bold uppercase">{ins.instinct}</span>
                  <span className="text-amber-100 text-xs font-mono">{ins.actions_taken[0]}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {reflexes.length > 0 && (
          <div className="bg-black/40 border border-red-500/30 rounded-2xl p-4 backdrop-blur-md">
            <h3 className="text-red-400 text-xs font-bold uppercase tracking-tighter mb-3 flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-red-500 animate-ping" />
              Active Reflex Arcs
            </h3>
            <div className="flex flex-wrap gap-3">
              {reflexes.map((ref, idx) => (
                <div key={idx} className="bg-red-900/20 border border-red-500/20 rounded-xl px-3 py-2 flex flex-col animate-in slide-in-from-right-2">
                  <span className="text-red-500 text-[9px] font-bold uppercase">{ref.reflex}</span>
                  <span className="text-red-100 text-xs font-mono">CAUSE: {ref.cause}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Flow & Ether - Потоки данных (Ветер и Ручей) */}
      <div className="bg-black/40 border border-blue-500/20 rounded-2xl p-4 backdrop-blur-md overflow-hidden relative">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <svg className="w-24 h-24 animate-spin" style={{ animationDuration: '8s' }} viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
          </svg>
        </div>
        <h3 className="text-blue-400 text-xs font-bold uppercase tracking-widest mb-4 flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
          Ether Flow (Transient Data)
        </h3>
        <div className="flex gap-4">
          {flows.map((flow, idx) => (
            <div key={idx} className={`px-4 py-2 rounded-full border text-[10px] font-mono transition-all duration-1000 animate-out fade-out slide-out-to-right-full ${flow.state === 'emerging' ? 'bg-blue-500/10 border-blue-500/40 text-blue-300' : 'bg-gray-500/10 border-gray-500/20 text-gray-500 opacity-50'
              }`}>
              {flow.state === 'emerging' ? '≈ WIND' : '≈ STREAM'} : {flow.stream_id}
            </div>
          ))}
          {flows.length === 0 && <span className="text-gray-600 italic text-xs">The air is still...</span>}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Левая колонка: Живой Пульс (Events & ANIML) */}
        <div className="bg-black/60 border border-emerald-500/30 rounded-2xl p-6 backdrop-blur-md shadow-xl shadow-emerald-900/10">
          <h2 className="text-lg font-bold text-emerald-400 mb-4 flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            System Pulse (A-Code & ANIML)
          </h2>

          <div className="space-y-3 h-[400px] overflow-y-auto pr-2 custom-scrollbar">
            {events.map((ev, idx) => (
              <div key={idx} className="font-mono text-[11px] p-3 bg-gray-900/50 border border-emerald-500/10 rounded-xl animate-in fade-in slide-in-from-top-2">
                <div className="flex justify-between mb-1">
                  <span className={`px-2 py-0.5 rounded text-[9px] uppercase font-bold ${ev.type === 'ANIML' ? 'bg-amber-500/20 text-amber-400' : 'bg-indigo-500/20 text-indigo-400'
                    }`}>
                    {ev.type}
                  </span>
                  <span className="text-gray-600">JUST NOW</span>
                </div>

                {ev.type === 'ANIML' ? (
                  <div className="text-amber-200/80 break-all leading-relaxed">
                    <span className="text-amber-500 font-bold">PACKET:</span> {ev.data}
                  </div>
                ) : (
                  <pre className="text-emerald-200/60 whitespace-pre-wrap">
                    {JSON.stringify(ev.data, null, 2)}
                  </pre>
                )}
              </div>
            ))}
            {events.length === 0 && (
              <div className="h-full flex items-center justify-center text-gray-600 italic text-sm">
                Waiting for kernel signals...
              </div>
            )}
          </div>
        </div>

        {/* Правая колонка: Архивные логи (VFS History) */}
        <div className="bg-black/60 border border-indigo-500/30 rounded-2xl p-6 backdrop-blur-md">
          <h2 className="text-lg font-bold text-indigo-400 mb-4 flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Kernel History (VFS)
          </h2>

          <div className="space-y-3">
            {logs.map((log, index) => (
              <div key={index} className="font-mono text-[11px] p-3 bg-gray-900/80 border-l-2 border-indigo-500 rounded-r-lg">
                <div className="flex justify-between text-gray-500 mb-1">
                  <span>{new Date(log.metadata.created_at * 1000).toLocaleTimeString()}</span>
                  <span className="text-indigo-400/50">{log.metadata.owner}</span>
                </div>
                <div className="text-gray-300">
                  <span className="text-indigo-400">ACTION:</span> {log.content.action}
                </div>
                <div className="text-gray-500 truncate">
                  {log.content.path}
                </div>
              </div>
            ))}
            {logs.length === 0 && !loading && (
              <div className="text-center py-10 text-gray-600 italic">
                No historical records found.
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(0,0,0,0.1);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(16, 185, 129, 0.2);
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
}
