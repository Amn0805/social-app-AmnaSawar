// components/friends/FriendCard.jsx
import { Link, useNavigate } from 'react-router-dom';
import Avatar from '../ui/Avatar';
import Button from '../ui/Button';

export default function FriendCard({ user, onUnfriend }) {
  const navigate = useNavigate();

  return (
    <div className="bg-white dark:bg-surface border border-ink/5 dark:border-surface-border rounded-2xl p-4 flex flex-col animate-fadeUp">
      <Link to={`/profile/${user.id}`} className="flex items-center gap-3 mb-3">
        <Avatar src={user.avatar} name={user.name} size="md" />
        <div className="min-w-0">
          <p className="font-display font-semibold text-sm text-ink dark:text-paper truncate">
            {user.name}
          </p>
          {user.bio && (
            <p className="text-xs text-mutedLight dark:text-muted truncate">{user.bio}</p>
          )}
        </div>
      </Link>

      <div className="flex gap-2 mt-auto">
        <Button size="sm" className="flex-1" onClick={() => navigate(`/chat/${user.id}`)}>
          Message
        </Button>
        <Button variant="ghost" size="sm" className="flex-1" onClick={onUnfriend}>
          Unfriend
        </Button>
      </div>
    </div>
  );
}