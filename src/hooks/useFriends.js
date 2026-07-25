// hooks/useFriends.js
import { useState, useCallback } from 'react';
import { storage, generateId } from '../utils/storage';

export function useFriends() {
  const [requests, setRequests] = useState(() => storage.getFriendRequests());

  const refresh = useCallback(() => setRequests(storage.getFriendRequests()), []);

  function sendRequest(fromUserId, toUserId) {
    const newRequest = {
      id: generateId('req'),
      fromUserId,
      toUserId,
      status: 'pending',
      sentAt: new Date().toISOString(),
      respondedAt: null,
    };
    const next = [...storage.getFriendRequests(), newRequest];
    storage.setFriendRequests(next);
    setRequests(next);
    return newRequest;
  }

  function acceptRequest(requestId) {
    const next = storage.getFriendRequests().map((r) =>
      r.id === requestId ? { ...r, status: 'accepted', respondedAt: new Date().toISOString() } : r
    );
    storage.setFriendRequests(next);
    setRequests(next);
  }

  function rejectRequest(requestId) {
    const next = storage.getFriendRequests().map((r) =>
      r.id === requestId ? { ...r, status: 'rejected', respondedAt: new Date().toISOString() } : r
    );
    storage.setFriendRequests(next);
    setRequests(next);
  }

  function cancelRequest(requestId) {
    const next = storage.getFriendRequests().filter((r) => r.id !== requestId);
    storage.setFriendRequests(next);
    setRequests(next);
  }

  function unfriend(userId1, userId2) {
    const next = storage.getFriendRequests().filter(
      (r) =>
        !(
          r.status === 'accepted' &&
          ((r.fromUserId === userId1 && r.toUserId === userId2) ||
            (r.fromUserId === userId2 && r.toUserId === userId1))
        )
    );
    storage.setFriendRequests(next);
    setRequests(next);
  }

  return { requests, refresh, sendRequest, acceptRequest, rejectRequest, cancelRequest, unfriend };
}