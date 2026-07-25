// pages/PeoplePage.jsx
import { useMemo } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useFriends } from '../hooks/useFriends';
import { storage } from '../utils/storage';
import {
  getRelationshipStatus,
  getPendingRequestBetween,
  getMutualFriendsCount,
} from '../utils/friendHelpers';
import FriendRequestCard from '../components/friends/FriendRequestCard';

export default function PeoplePage() {
  const { currentUser } = useAuth();
  const { sendRequest, acceptRequest, rejectRequest, refresh } = useFriends();

  const people = useMemo(() => {
    const users = storage.getUsers().filter((u) => u.id !== currentUser.id);

    const withRelationship = users
      .map((user) => {
        const relationship = getRelationshipStatus(currentUser.id, user.id);
        return { user, relationship };
      })
      .filter((entry) => entry.relationship !== 'friends');

    const priority = { request_received: 0, none: 1, request_sent: 2 };
    withRelationship.sort((a, b) => priority[a.relationship] - priority[b.relationship]);

    return withRelationship;
  }, [currentUser.id, refresh]);

  function handleAddFriend(targetId) {
    sendRequest(currentUser.id, targetId);
    refresh();
  }

  function handleAccept(targetId) {
    const req = getPendingRequestBetween(currentUser.id, targetId);
    if (req) acceptRequest(req.id);
    refresh();
  }

  function handleReject(targetId) {
    const req = getPendingRequestBetween(currentUser.id, targetId);
    if (req) rejectRequest(req.id);
    refresh();
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="font-display text-2xl font-semibold text-ink dark:text-paper mb-6">
        People You May Know
      </h1>

      {people.length === 0 ? (
        <div className="text-center py-20 animate-fadeUp">
          <p className="text-mutedLight dark:text-muted">No suggestions right now.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {people.map(({ user, relationship }) => (
            <FriendRequestCard
              key={user.id}
              user={user}
              relationship={relationship}
              mutualCount={getMutualFriendsCount(currentUser.id, user.id)}
              onAddFriend={() => handleAddFriend(user.id)}
              onAccept={() => handleAccept(user.id)}
              onReject={() => handleReject(user.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}