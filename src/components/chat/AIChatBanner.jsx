// components/chat/AIChatBanner.jsx
export default function AIChatBanner({ onDisable }) {
  return (
    <button
      onClick={onDisable}
      className="w-full text-center text-xs font-medium text-brand-700 dark:text-brand-400 bg-brand-500/10 border-b border-brand-500/20 py-2 hover:bg-brand-500/15 transition-colors"
    >
      ✨ AI is responding on your behalf — tap to disable
    </button>
  );
}