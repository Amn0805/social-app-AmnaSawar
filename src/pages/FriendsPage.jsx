// pages/FriendsPage.jsx
import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useFriends } from '../hooks/useFriends';
import { getFriendsOf } from '../utils/friendHelpers';
import FriendCard from '../components/friends/FriendCard';

export default function FriendsPage() {
  const { currentUser } = useAuth();
  const { requests, unfriend } = useFriends();
  const location = useLocation();

  const friends = useMemo(() => getFriendsOf(currentUser.id), [currentUser.id, requests]);

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="font-display text-2xl font-semibold text-ink dark:text-paper mb-6">
        Friends
      </h1>

      {location.state?.message && (
        <div className="mb-6 text-sm text-rose-600 dark:text-rose-400 bg-rose-500/10 border border-rose-500/20 rounded-lg px-4 py-2.5 animate-fadeUp">
          {location.state.message}
        </div>
      )}

      {friends.length === 0 ? (
        <div className="text-center py-20 animate-fadeUp">
          <p className="text-mutedLight dark:text-muted">
            No friends yet — go to People to connect
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {friends.map((friend) => (
            <FriendCard
              key={friend.id}
              user={friend}
              onUnfriend={() => unfriend(currentUser.id, friend.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}