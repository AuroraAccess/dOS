// frontend/components/pulse/Pulse.js
import { useState, useEffect } from 'react';

export default function Pulse() {
  const [memories, setMemories] = useState([]);

 
  useEffect(() => {
    const mockMemories = [
      { id: 1, time: '09:00', description: 'Logged in', emotion: '😊' },
      { id: 2, time: '09:15', description: 'Thought about tasks', emotion: '🤔' },
      { id: 3, time: '09:30', description: 'Completed action', emotion: '🎯' },
    ];
    setMemories(mockMemories);
  }, []);

  return (
    <div className="pulse-container p-6 bg-gray-900 text-white rounded-xl w-full max-w-lg mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-indigo-400">Pulse — Your Memory Stream</h2>
      <ul className="space-y-3">
        {memories.map(mem => (
          <li key={mem.id} className="p-3 bg-gray-800 rounded-lg flex justify-between items-center">
            <div>
              <p className="font-semibold">{mem.description}</p>
              <p className="text-gray-400 text-sm">{mem.time}</p>
            </div>
            <div className="text-2xl">{mem.emotion}</div>
          </li>
        ))}
      </ul>
      <button
        className="mt-6 px-4 py-2 bg-indigo-600 rounded-xl hover:bg-indigo-500"
        onClick={() => alert('Add new memory (to be implemented)')}
      >
        + Add Memory
      </button>
    </div>
  );
}
