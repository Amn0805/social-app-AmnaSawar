// components/chat/MessageReactions.jsx
import { useState } from 'react';
import clsx from 'clsx';

const EMOJIS = ['👍', '❤️', '😂', '😮', '😢'];

export default function MessageReactions({ message, currentUserId, onToggleReaction, isOwn }) {
  const [pickerOpen, setPickerOpen] = useState(false);
  const reactions = message.reactions || {};

  const hasAnyReactions = Object.values(reactions).some((users) => users.length > 0);

  function handlePick(emoji) {
    onToggleReaction(message.id, emoji);
    setPickerOpen(false);
  }

  return (
    <div className={clsx('relative flex flex-col gap-1', isOwn ? 'items-end' : 'items-start')}>
      {hasAnyReactions && (
        <div className="flex gap-1">
          {Object.entries(reactions)
            .filter(([, users]) => users.length > 0)
            .map(([emoji, users]) => (
              <button
                key={emoji}
                onClick={() => handlePick(emoji)}
                className={clsx(
                  'text-xs rounded-full px-1.5 py-0.5 border transition-colors',
                  users.includes(currentUserId)
                    ? 'bg-brand-500/15 border-brand-500/40'
                    : 'bg-ink/5 dark:bg-white/10 border-ink/10 dark:border-surface-border'
                )}
              >
                {emoji} {users.length}
              </button>
            ))}
        </div>
      )}

      <div className="relative group">
        <button
          onClick={() => setPickerOpen((v) => !v)}
          className="opacity-0 group-hover:opacity-100 focus:opacity-100 text-xs text-mutedLight dark:text-muted hover:text-ink dark:hover:text-paper transition-opacity px-1"
          aria-label="Add reaction"
        >
          😊+
        </button>

        {pickerOpen && (
          <div className="absolute bottom-full mb-1 left-0 flex gap-1 bg-white dark:bg-surface border border-ink/10 dark:border-surface-border rounded-full px-2 py-1 shadow-card z-10 animate-fadeUp">
            {EMOJIS.map((emoji) => (
              <button
                key={emoji}
                onClick={() => handlePick(emoji)}
                className="text-base hover:scale-125 transition-transform"
              >
                {emoji}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}