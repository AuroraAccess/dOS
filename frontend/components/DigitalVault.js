// NOTICE: This file is protected under RCF-PL v1.3
// [RCF:PROTECTED]
import { useState } from 'react';

export default function DigitalVault() {
  const [auroraId, setAuroraId] = useState('');
  const [secretLabel, setSecretLabel] = useState('');
  const [secretValue, setSecretValue] = useState('');
  const [vaultItems, setVaultItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);

  async function handleSave() {
    if (!auroraId || !secretLabel || !secretValue) return;
    setLoading(true);
    setStatus({ type: 'info', text: 'Encrypting and saving to VFS...' });

    try {
      const path = `/users/${auroraId}/vault/${secretLabel}`;
      const res = await fetch('http://auroraid.site:8000/api/vfs/write', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          path: path,
          content: { secret: secretValue, label: secretLabel },
        }),
      });

      const data = await res.json();
      if (data.status === 'success') {
        setStatus({ type: 'success', text: `Secret '${secretLabel}' locked in vault.` });
        setSecretLabel('');
        setSecretValue('');
        // Обновляем список после сохранения
        handleLoadVault();
      }
    } catch (err) {
      setStatus({ type: 'error', text: 'Vault connection failed.' });
    } finally {
      setLoading(false);
    }
  }

  async function handleLoadVault() {
    if (!auroraId) return;
    setLoading(true);
    setStatus({ type: 'info', text: 'Accessing encrypted vault...' });

    try {
      const listRes = await fetch(`http://auroraid.site:8000/api/vfs/list?prefix=/users/${auroraId}/vault/`);
      const listData = await listRes.json();

      if (listData.items && listData.items.length > 0) {
        const items = await Promise.all(
          listData.items.map(async (path) => {
            const res = await fetch(`http://auroraid.site:8000/api/vfs/read?path=${path}&user_id=${auroraId}`);
            return await res.json();
          })
        );
        // Фильтруем пустые или ошибочные результаты
        const validItems = items.filter(item => item && item.content);
        setVaultItems(validItems);
        setStatus({ type: 'success', text: `Retrieved ${validItems.length} secrets from vault.` });
      } else {
        setVaultItems([]);
        setStatus({ type: 'info', text: 'Vault is empty.' });
      }
    } catch (err) {
      setStatus({ type: 'error', text: 'Access denied or connection failed.' });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-2xl bg-black/40 border border-emerald-500/30 rounded-2xl p-6 backdrop-blur-md">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-emerald-900/40 rounded-lg">
          <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-emerald-400">Digital Vault</h2>
      </div>

      <div className="space-y-4">
        <input
          type="text"
          value={auroraId}
          onChange={(e) => setAuroraId(e.target.value)}
          placeholder="Enter your Aurora ID"
          className="w-full p-3 rounded-xl bg-gray-900 border border-emerald-500/20 text-white font-mono text-sm focus:border-emerald-500/50 outline-none transition-all"
        />

        <div className="grid grid-cols-2 gap-4">
          <input
            type="text"
            value={secretLabel}
            onChange={(e) => setSecretLabel(e.target.value)}
            placeholder="Label (e.g. Password)"
            className="p-3 rounded-xl bg-gray-900 border border-emerald-500/20 text-white focus:border-emerald-500/50 outline-none transition-all"
          />
          <input
            type="password"
            value={secretValue}
            onChange={(e) => setSecretValue(e.target.value)}
            placeholder="Secret Value"
            className="p-3 rounded-xl bg-gray-900 border border-emerald-500/20 text-white focus:border-emerald-500/50 outline-none transition-all"
          />
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleSave}
            disabled={loading || !auroraId || !secretLabel || !secretValue}
            className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-500 disabled:bg-gray-800 rounded-xl text-white font-semibold transition-all shadow-lg shadow-emerald-900/20"
          >
            Encrypt & Lock
          </button>
          <button
            onClick={handleLoadVault}
            disabled={loading || !auroraId}
            className="px-6 py-3 border border-emerald-500/40 hover:bg-emerald-500/10 rounded-xl text-emerald-400 font-semibold transition-all"
          >
            Unlock Vault
          </button>
        </div>

        {status && (
          <div className={`p-3 rounded-lg text-sm text-center ${status.type === 'error' ? 'bg-red-900/20 text-red-400 border border-red-500/20' :
              status.type === 'success' ? 'bg-emerald-900/20 text-emerald-400 border border-emerald-500/20' :
                'bg-indigo-900/20 text-indigo-400 border border-indigo-500/20'
            }`}>
            {status.text}
          </div>
        )}

        {vaultItems.length > 0 && (
          <div className="mt-6 space-y-2 border-t border-emerald-500/10 pt-4">
            <p className="text-xs text-emerald-500/60 uppercase tracking-widest font-bold mb-3">Stored Objects (Decrypted)</p>
            {vaultItems.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-emerald-900/10 rounded-xl border border-emerald-500/10 group hover:border-emerald-500/30 transition-all">
                <span className="text-sm font-semibold text-emerald-300">{item.content.label}</span>
                <span className="text-sm font-mono text-emerald-100 bg-emerald-900/30 px-3 py-1 rounded-lg">
                  {item.content.secret}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
