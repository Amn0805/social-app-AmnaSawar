// components/chat/TypingIndicator.jsx
export default function TypingIndicator() {
  return (
    <div className="flex items-center gap-1 bg-ink/5 dark:bg-white/10 rounded-2xl rounded-bl-sm px-4 py-3 w-fit">
      <span className="w-1.5 h-1.5 rounded-full bg-mutedLight dark:bg-muted animate-bounce [animation-delay:-0.3s]" />
      <span className="w-1.5 h-1.5 rounded-full bg-mutedLight dark:bg-muted animate-bounce [animation-delay:-0.15s]" />
      <span className="w-1.5 h-1.5 rounded-full bg-mutedLight dark:bg-muted animate-bounce" />
    </div>
  );
}