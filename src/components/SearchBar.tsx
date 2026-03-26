'use client';

import { useState } from 'react';

interface Props {
  onSearch: (prompt: string) => void;
  loading?: boolean;
}

const SUGGESTIONS = [
  'A thriller with a twist ending like Shutter Island',
  'Funny romantic comedies from the 90s',
  'Epic sci-fi space adventures',
  'Dark psychological horror movies',
  'Feel-good animated movies for adults',
];

export default function SearchBar({ onSearch, loading }: Props) {
  const [prompt, setPrompt] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim()) {
      onSearch(prompt.trim());
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="relative">
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Describe the movie you want to watch..."
          className="w-full bg-slate-800 border border-slate-600 text-white placeholder-slate-400 rounded-xl px-5 py-4 pr-36 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 text-base"
          disabled={loading}
        />
        <button
          type="submit"
          disabled={loading || !prompt.trim()}
          className="absolute right-2 top-2 bottom-2 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 disabled:cursor-not-allowed text-black font-semibold px-5 rounded-lg transition-colors"
        >
          {loading ? '🔍 Searching...' : '🎬 Search'}
        </button>
      </form>
      <div className="mt-3 flex flex-wrap gap-2 justify-center">
        {SUGGESTIONS.slice(0, 3).map((s) => (
          <button
            key={s}
            onClick={() => setPrompt(s)}
            className="text-xs text-slate-400 hover:text-amber-400 bg-slate-800 hover:bg-slate-700 px-3 py-1 rounded-full border border-slate-700 transition-colors"
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}
