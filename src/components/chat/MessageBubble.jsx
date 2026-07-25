// components/chat/MessageBubble.jsx
import { useState } from 'react';
import clsx from 'clsx';
import Avatar from '../ui/Avatar';
import MessageReactions from './MessageReactions';

function formatTime(isoString) {
  return new Date(isoString).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
}

export default function MessageBubble({
  message,
  isOwn,
  friendAvatar,
  friendName,
  isHighlighted = false,
  currentUserId,
  onToggleReaction,
}) {
  const [lightboxOpen, setLightboxOpen] = useState(false);

  return (
    <div className={clsx('flex items-end gap-2 mb-1 group', isOwn ? 'justify-end' : 'justify-start')}>
      {!isOwn && <Avatar src={friendAvatar} name={friendName} size="sm" />}

      <div className={clsx('flex flex-col', isOwn ? 'items-end' : 'items-start')}>
        {message.type === 'text' && (
          <div
            className={clsx(
              'rounded-2xl px-4 py-2 max-w-[70%] text-sm whitespace-pre-wrap break-words',
              isOwn
                ? 'bg-brand-600 text-white rounded-br-sm ml-auto'
                : 'bg-ink/5 dark:bg-white/10 text-ink dark:text-paper rounded-bl-sm',
              isHighlighted && 'ring-2 ring-amber-400'
            )}
          >
            {message.aiGenerated && (
              <span className="mr-1" title="AI-generated message">✨</span>
            )}
            {message.content}
          </div>
        )}

        {message.type === 'image' && (
          <>
            <button
              onClick={() => setLightboxOpen(true)}
              className={clsx('block rounded-2xl overflow-hidden max-w-[70%]', isOwn ? 'ml-auto' : '')}
            >
              <img src={message.content} alt="Sent image" className="max-h-64 object-cover" />
            </button>
            {lightboxOpen && (
              <div
                className="fixed inset-0 z-50 bg-black/80 grid place-items-center p-4"
                onClick={() => setLightboxOpen(false)}
              >
                <img
                  src={message.content}
                  alt="Full size"
                  className="max-w-full max-h-full rounded-lg"
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
            )}
          </>
        )}

        {message.type === 'video' && (
          <video
            src={message.content}
            controls
            className={clsx('rounded-2xl max-w-[70%] max-h-64', isOwn ? 'ml-auto' : '')}
          />
        )}

        <span className="flex items-center gap-1 text-[11px] text-mutedLight dark:text-muted font-mono mt-0.5 px-1">
          {formatTime(message.timestamp)}
          {isOwn && <ReadReceipt read={message.read} />}
        </span>

        <MessageReactions
          message={message}
          currentUserId={currentUserId}
          onToggleReaction={onToggleReaction}
          isOwn={isOwn}
        />
      </div>
    </div>
  );
}

function ReadReceipt({ read }) {
  if (read) {
    return (
      <span className="text-brand-500" title="Read">
        ✓✓
      </span>
    );
  }
  return (
    <span className="text-mutedLight dark:text-muted" title="Sent">
      ✓
    </span>
  );
}