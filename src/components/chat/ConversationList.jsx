// components/chat/ConversationList.jsx
import ConversationItem from './ConversationItem';

export default function ConversationList({ conversations, activeFriendId, onSelect }) {
  if (conversations.length === 0) {
    return (
      <div className="p-6 text-center text-sm text-mutedLight dark:text-muted">
        You have no friends yet — go to People to connect
      </div>
    );
  }

  return (
    <div className="divide-y divide-ink/5 dark:divide-surface-border overflow-y-auto">
      {conversations.map((conversation) => (
        <ConversationItem
          key={conversation.friend.id}
          conversation={conversation}
          isActive={conversation.friend.id === activeFriendId}
          onClick={() => onSelect(conversation.friend.id)}
        />
      ))}
    </div>
  );
}