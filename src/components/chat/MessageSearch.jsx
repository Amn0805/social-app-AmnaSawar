// components/chat/MessageSearch.jsx
import { useState, useEffect, useRef } from 'react';

export default function MessageSearch({ messages, onClose, onHighlightIds }) {
  const [query, setQuery] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    const trimmed = query.trim().toLowerCase();
    if (!trimmed) {
      onHighlightIds([]);
      return;
    }
    const matches = messages
      .filter((m) => m.type === 'text' && m.content.toLowerCase().includes(trimmed))
      .map((m) => m.id);
    onHighlightIds(matches);
  }, [query, messages]); // eslint-disable-line react-hooks/exhaustive-deps

  function handleKeyDown(e) {
    if (e.key === 'Escape') onClose();
  }

  const matchCount = query.trim()
    ? messages.filter((m) => m.type === 'text' && m.content.toLowerCase().includes(query.trim().toLowerCase())).length
    : 0;

  return (
    <div className="flex items-center gap-2 px-4 py-2 border-b border-ink/5 dark:border-surface-border bg-ink/[0.02] dark:bg-white/[0.02] animate-fadeUp">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-mutedLight dark:text-muted shrink-0">
        <circle cx="11" cy="11" r="8" />
        <path d="M21 21l-4.35-4.35" />
      </svg>
      <input
        ref={inputRef}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Search messages..."
        className="flex-1 bg-transparent text-sm text-ink dark:text-paper placeholder:text-mutedLight dark:placeholder:text-muted focus:outline-none"
      />
      {query.trim() && (
        <span className="text-xs text-mutedLight dark:text-muted font-mono shrink-0">
          {matchCount} {matchCount === 1 ? 'match' : 'matches'}
        </span>
      )}
      <button
        onClick={onClose}
        aria-label="Close search"
        className="text-mutedLight dark:text-muted hover:text-ink dark:hover:text-paper shrink-0"
      >
        ✕
      </button>
    </div>
  );
}