// components/friends/FriendRequestCard.jsx
import { Link } from 'react-router-dom';
import Avatar from '../ui/Avatar';
import Button from '../ui/Button';

function truncate(text, max) {
  if (!text) return '';
  return text.length > max ? text.slice(0, max).trimEnd() + '…' : text;
}

export default function FriendRequestCard({
  user,
  relationship,
  mutualCount,
  onAddFriend,
  onAccept,
  onReject,
}) {
  return (
    <div className="bg-white dark:bg-surface border border-ink/5 dark:border-surface-border rounded-2xl p-4 flex flex-col animate-fadeUp">
      <Link to={`/profile/${user.id}`} className="flex items-center gap-3 mb-3">
        <Avatar src={user.avatar} name={user.name} size="md" />
        <div className="min-w-0">
          <p className="font-display font-semibold text-sm text-ink dark:text-paper truncate">
            {user.name}
          </p>
          {typeof mutualCount === 'number' && (
            <p className="text-xs text-mutedLight dark:text-muted">
              {mutualCount} mutual friend{mutualCount === 1 ? '' : 's'}
            </p>
          )}
        </div>
      </Link>

      {user.bio && (
        <p className="text-xs text-ink/70 dark:text-paper/70 mb-3 line-clamp-2">
          {truncate(user.bio, 60)}
        </p>
      )}

      <div className="mt-auto">
        {relationship === 'request_sent' && (
          <Button variant="secondary" size="sm" disabled className="w-full opacity-60 cursor-not-allowed">
            Request Sent
          </Button>
        )}

        {relationship === 'request_received' && (
          <div className="flex gap-2">
            <Button size="sm" className="flex-1" onClick={onAccept}>
              Accept
            </Button>
            <Button variant="ghost" size="sm" className="flex-1" onClick={onReject}>
              Reject
            </Button>
          </div>
        )}

        {relationship === 'none' && (
          <Button size="sm" className="w-full" onClick={onAddFriend}>
            Add Friend
          </Button>
        )}
      </div>
    </div>
  );
}