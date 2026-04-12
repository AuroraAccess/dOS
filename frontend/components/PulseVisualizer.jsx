// NOTICE: This file is protected under RCF-PL v1.3
// [RCF:PUBLIC]
// components/PulseVisualizer.jsx
export default function PulseVisualizer({ accounts }) {
  return (
    <div className="mt-6 flex justify-center gap-4 flex-wrap">
      {accounts.map((acc, i) => (
        <div
          key={i}
          className="w-16 h-16 rounded-full bg-indigo-500 animate-pulse flex items-center justify-center text-white font-bold"
          title={acc.user}
        >
          {acc.user[0].toUpperCase()}
        </div>
      ))}
    </div>
  );
}
