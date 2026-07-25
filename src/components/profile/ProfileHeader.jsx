// components/profile/ProfileHeader.jsx
import { Link, useNavigate } from 'react-router-dom';
import Avatar from '../ui/Avatar';
import Button from '../ui/Button';
import { formatJoinDate } from '../../utils/helpers';

export default function ProfileHeader({
  user,
  relationship,
  onAddFriend,
  onAccept,
  onReject,
  onUnfriend,
}) {
  const navigate = useNavigate();

  return (
    <div className="bg-white dark:bg-surface border border-ink/5 dark:border-surface-border rounded-2xl overflow-hidden shadow-card animate-fadeUp">
      <div
        className="h-40 sm:h-48 w-full bg-cover bg-center"
        style={
          user.coverImage
            ? { backgroundImage: `url(${user.coverImage})` }
            : { background: 'linear-gradient(135deg, #1FB88A 0%, #158F6C 50%, #0B0F14 100%)' }
        }
      />

      <div className="px-6 pb-6">
        <div className="flex items-end justify-between -mt-10 gap-2">
          <Avatar
            src={user.avatar}
            name={user.name}
            size="lg"
            className="ring-4 ring-white dark:ring-surface"
          />

          <div className="mb-1 flex gap-2">
            {relationship === 'self' && (
              <Link to="/dashboard/settings">
                <Button variant="secondary" size="sm">
                  Edit Profile
                </Button>
              </Link>
            )}

            {relationship === 'none' && (
              <Button size="sm" onClick={onAddFriend}>
                Add Friend
              </Button>
            )}

            {relationship === 'request_sent' && (
              <Button variant="secondary" size="sm" disabled className="opacity-60 cursor-not-allowed">
                Request Sent
              </Button>
            )}

            {relationship === 'request_received' && (
              <>
                <Button size="sm" onClick={onAccept}>
                  Accept
                </Button>
                <Button variant="ghost" size="sm" onClick={onReject}>
                  Reject
                </Button>
              </>
            )}

            {relationship === 'friends' && (
              <>
                <Button size="sm" onClick={() => navigate(`/chat/${user.id}`)}>
                  Message
                </Button>
                <Button variant="ghost" size="sm" onClick={onUnfriend}>
                  Unfriend
                </Button>
              </>
            )}
          </div>
        </div>

        <h1 className="font-display text-xl font-semibold text-ink dark:text-paper mt-3">
          {user.name}
        </h1>

        {user.bio && (
          <p className="text-sm text-ink/80 dark:text-paper/80 mt-2 whitespace-pre-wrap">
            {user.bio}
          </p>
        )}

        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-3 text-sm text-mutedLight dark:text-muted">
          {user.location && (
            <span className="flex items-center gap-1.5">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              {user.location}
            </span>
          )}
          <span className="flex items-center gap-1.5 font-mono">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="4" width="18" height="18" rx="2" />
              <path d="M16 2v4M8 2v4M3 10h18" />
            </svg>
            Joined {formatJoinDate(user.joinedAt)}
          </span>
        </div>
      </div>
    </div>
  );
}