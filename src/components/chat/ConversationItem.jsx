// components/chat/ConversationItem.jsx
import clsx from 'clsx';
import Avatar from '../ui/Avatar';
import { previewText } from '../../utils/chatHelpers';

function formatShortTime(isoString) {
  if (!isoString) return '';
  return new Date(isoString).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
}

export default function ConversationItem({ conversation, isActive, onClick }) {
  const { friend, lastMessage, unreadCount } = conversation;

  return (
    <button
      onClick={onClick}
      className={clsx(
        'w-full flex items-center gap-3 px-4 py-3 text-left transition-colors border-l-4',
        isActive
          ? 'bg-brand-500/10 border-brand-500'
          : 'border-transparent hover:bg-ink/5 dark:hover:bg-white/5'
      )}
    >
      <Avatar src={friend.avatar} name={friend.name} size="md" />
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <p className="font-display font-semibold text-sm text-ink dark:text-paper truncate">
            {friend.name}
          </p>
          {lastMessage && (
            <span className="text-[11px] text-mutedLight dark:text-muted font-mono shrink-0">
              {formatShortTime(lastMessage.timestamp)}
            </span>
          )}
        </div>
        <p className="text-xs text-mutedLight dark:text-muted truncate">
          {lastMessage ? previewText(lastMessage) : 'Say hello 👋'}
        </p>
      </div>
      {unreadCount > 0 && (
        <span className="bg-brand-600 text-white text-xs font-bold rounded-full px-2 py-0.5 min-w-[1.25rem] text-center shrink-0">
          {unreadCount}
        </span>
      )}
    </button>
  );
}