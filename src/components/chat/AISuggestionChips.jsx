// components/chat/AISuggestionChips.jsx
export default function AISuggestionChips({ suggestions, onSelect }) {
  if (!suggestions || suggestions.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2 mb-3 ml-10">
      {suggestions.map((text, i) => (
        <button
          key={i}
          onClick={() => onSelect(text)}
          className="bg-white dark:bg-surface border border-brand-500/30 text-brand-600 dark:text-brand-400 text-sm rounded-full px-3 py-1 hover:bg-brand-500/10 transition-colors cursor-pointer"
        >
          {text}
        </button>
      ))}
    </div>
  );
}