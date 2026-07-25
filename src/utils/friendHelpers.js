// utils/friendHelpers.js
import { storage } from './storage';

export function areFriends(userId1, userId2) {
  const requests = storage.getFriendRequests();
  return requests.some(
    (r) =>
      r.status === 'accepted' &&
      ((r.fromUserId === userId1 && r.toUserId === userId2) ||
        (r.fromUserId === userId2 && r.toUserId === userId1))
  );
}

export function getFriendsOf(userId) {
  const requests = storage.getFriendRequests();
  const users = storage.getUsers();

  const friendIds = requests
    .filter((r) => r.status === 'accepted' && (r.fromUserId === userId || r.toUserId === userId))
    .map((r) => (r.fromUserId === userId ? r.toUserId : r.fromUserId));

  return users.filter((u) => friendIds.includes(u.id));
}

export function getMutualFriendsCount(userIdA, userIdB) {
  const friendsA = getFriendsOf(userIdA).map((u) => u.id);
  const friendsB = getFriendsOf(userIdB).map((u) => u.id);
  return friendsA.filter((id) => friendsB.includes(id)).length;
}

export function getRelationshipStatus(viewerId, targetId) {
  if (viewerId === targetId) return 'self';

  const requests = storage.getFriendRequests();

  const accepted = requests.find(
    (r) =>
      r.status === 'accepted' &&
      ((r.fromUserId === viewerId && r.toUserId === targetId) ||
        (r.fromUserId === targetId && r.toUserId === viewerId))
  );
  if (accepted) return 'friends';

  const sentByViewer = requests.find(
    (r) => r.status === 'pending' && r.fromUserId === viewerId && r.toUserId === targetId
  );
  if (sentByViewer) return 'request_sent';

  const sentByTarget = requests.find(
    (r) => r.status === 'pending' && r.fromUserId === targetId && r.toUserId === viewerId
  );
  if (sentByTarget) return 'request_received';

  return 'none';
}

export function getPendingRequestBetween(userId1, userId2) {
  const requests = storage.getFriendRequests();
  return requests.find(
    (r) =>
      r.status === 'pending' &&
      ((r.fromUserId === userId1 && r.toUserId === userId2) ||
        (r.fromUserId === userId2 && r.toUserId === userId1))
  );
}

export function getPendingReceivedCount(userId) {
  const requests = storage.getFriendRequests();
  return requests.filter((r) => r.status === 'pending' && r.toUserId === userId).length;
}