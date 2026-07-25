// components/chat/AIPersonalitySelector.jsx
const PERSONALITIES = [
  { value: 'friendly', label: 'Friendly' },
  { value: 'professional', label: 'Professional' },
  { value: 'casual', label: 'Casual' },
  { value: 'funny', label: 'Funny' },
];

export default function AIPersonalitySelector({ value, onChange }) {
  return (
    <div className="px-3 py-2 border-t border-ink/10 dark:border-surface-border">
      <p className="text-[11px] text-mutedLight dark:text-muted mb-1.5 px-0.5">AI personality</p>
      <div className="flex flex-wrap gap-1">
        {PERSONALITIES.map((p) => (
          <button
            key={p.value}
            onClick={() => onChange(p.value)}
            className={
              value === p.value
                ? 'text-xs px-2.5 py-1 rounded-full bg-brand-500/15 text-brand-600 dark:text-brand-400 font-medium'
                : 'text-xs px-2.5 py-1 rounded-full text-mutedLight dark:text-muted hover:bg-ink/5 dark:hover:bg-white/5'
            }
          >
            {p.label}
          </button>
        ))}
      </div>
    </div>
  );
}