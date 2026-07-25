// pages/FriendRequestsPage.jsx
import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import clsx from 'clsx';
import { useAuth } from '../hooks/useAuth';
import { useFriends } from '../hooks/useFriends';
import { storage } from '../utils/storage';
import Avatar from '../components/ui/Avatar';
import Button from '../components/ui/Button';

export default function FriendRequestsPage() {
  const { currentUser } = useAuth();
  const { requests, acceptRequest, rejectRequest, cancelRequest } = useFriends();
  const [tab, setTab] = useState('received');

  const usersById = useMemo(
    () => Object.fromEntries(storage.getUsers().map((u) => [u.id, u])),
    [requests]
  );

  const received = requests.filter((r) => r.status === 'pending' && r.toUserId === currentUser.id);
  const sent = requests.filter((r) => r.status === 'pending' && r.fromUserId === currentUser.id);

  return (
    <div className="max-w-xl mx-auto px-4 py-8">
      <h1 className="font-display text-2xl font-semibold text-ink dark:text-paper mb-6">
        Friend Requests
      </h1>

      <div className="flex gap-1 mb-6 bg-white dark:bg-surface border border-ink/5 dark:border-surface-border rounded-xl p-1 w-fit">
        {['received', 'sent'].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={clsx(
              'px-4 py-1.5 rounded-lg text-sm font-medium transition-colors capitalize',
              tab === t
                ? 'bg-brand-500/10 text-brand-600 dark:text-brand-400'
                : 'text-mutedLight dark:text-muted hover:text-ink dark:hover:text-paper'
            )}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === 'received' && (
        received.length === 0 ? (
          <div className="text-center py-16 animate-fadeUp">
            <p className="text-mutedLight dark:text-muted">No pending requests.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {received.map((req) => {
              const sender = usersById[req.fromUserId];
              if (!sender) return null;
              return (
                <div
                  key={req.id}
                  className="bg-white dark:bg-surface border border-ink/5 dark:border-surface-border rounded-2xl p-4 flex items-center gap-3 animate-fadeUp"
                >
                  <Link to={`/profile/${sender.id}`}>
                    <Avatar src={sender.avatar} name={sender.name} size="md" />
                  </Link>
                  <Link
                    to={`/profile/${sender.id}`}
                    className="flex-1 font-display font-semibold text-sm text-ink dark:text-paper hover:text-brand-600 dark:hover:text-brand-400"
                  >
                    {sender.name}
                  </Link>
                  <Button size="sm" onClick={() => acceptRequest(req.id)}>
                    Accept
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => rejectRequest(req.id)}>
                    Reject
                  </Button>
                </div>
              );
            })}
          </div>
        )
      )}

      {tab === 'sent' && (
        sent.length === 0 ? (
          <div className="text-center py-16 animate-fadeUp">
            <p className="text-mutedLight dark:text-muted">You haven't sent any requests.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {sent.map((req) => {
              const receiver = usersById[req.toUserId];
              if (!receiver) return null;
              return (
                <div
                  key={req.id}
                  className="bg-white dark:bg-surface border border-ink/5 dark:border-surface-border rounded-2xl p-4 flex items-center gap-3 animate-fadeUp"
                >
                  <Link to={`/profile/${receiver.id}`}>
                    <Avatar src={receiver.avatar} name={receiver.name} size="md" />
                  </Link>
                  <Link
                    to={`/profile/${receiver.id}`}
                    className="flex-1 font-display font-semibold text-sm text-ink dark:text-paper hover:text-brand-600 dark:hover:text-brand-400"
                  >
                    {receiver.name}
                  </Link>
                  <Button variant="ghost" size="sm" onClick={() => cancelRequest(req.id)}>
                    Cancel Request
                  </Button>
                </div>
              );
            })}
          </div>
        )
      )}
    </div>
  );
}