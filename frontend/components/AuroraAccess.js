// NOTICE: This file is protected under RCF-PL v1.2.3
// [RCF:PUBLIC]
import { useState } from 'react';

export default function AuroraAccess() {
  const [user, setUser] = useState('');
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleConnect() {
    setLoading(true);
    try {
      // Подключаемся напрямую к Kernel API на домене auroraid.site
      const res = await fetch('http://auroraid.site:8000/api/aurora/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user }),
      });
      const data = await res.json();
      setResponse(data);
    } catch (err) {
      setResponse({ error: 'Connection to Kernel failed. Is the OS running?' });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col items-center justify-center p-4">
      {/* System Status Badge */}
      <div className="mb-8 flex items-center gap-3 bg-indigo-900/30 border border-indigo-500/30 px-4 py-2 rounded-full backdrop-blur-sm">
        <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
        <span className="text-xs font-mono text-indigo-300 uppercase tracking-widest">
          Aurora Access Portal — Active @ auroraaccess.site
        </span>
      </div>

      <input
        type="text"
        value={user}
        onChange={(e) => setUser(e.target.value)}
        placeholder="Enter your username"
        className="p-2 rounded bg-gray-800 border border-gray-600 text-white w-64 mb-4 text-center"
      />
      <button
        onClick={handleConnect}
        disabled={loading || !user}
        className="px-4 py-2 bg-indigo-600 rounded-xl hover:bg-indigo-500 disabled:bg-gray-700"
      >
        {loading ? 'Connecting...' : 'Generate Aurora Key'}
      </button>

      {response && (
        <div className="mt-6 p-4 bg-gray-800 rounded-xl shadow-lg text-center max-w-lg">
          {response.error ? (
            <p className="text-red-400">{response.error}</p>
          ) : (
            <>
              <p className="text-green-400 font-semibold mb-2">
                {response.message}
              </p>
              {response.key && (
                <p className="text-sm text-gray-300">🔑 {response.key}</p>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}

