// hooks/useChat.js
import { useState, useEffect, useCallback } from 'react';
import { storage, generateId } from '../utils/storage';
import { getConversationId, getMessages, markConversationRead } from '../utils/chatHelpers';

export function useChat(currentUserId, friendId) {
  const [messages, setMessages] = useState(() =>
    friendId ? getMessages(currentUserId, friendId) : []
  );

  const refresh = useCallback(() => {
    if (friendId) setMessages(getMessages(currentUserId, friendId));
  }, [currentUserId, friendId]);

  useEffect(() => {
    refresh();
  }, [friendId, refresh]);

  useEffect(() => {
    function handleStorageEvent(event) {
      if (event.key === 'messages') {
        refresh();
      }
    }
    window.addEventListener('storage', handleStorageEvent);
    return () => window.removeEventListener('storage', handleStorageEvent);
  }, [refresh]);

  function sendMessage({ type, content, aiGenerated = false }) {
    const conversationId = getConversationId(currentUserId, friendId);
    const newMessage = {
      id: generateId('msg'),
      conversationId,
      senderId: currentUserId,
      receiverId: friendId,
      type,
      content,
      timestamp: new Date().toISOString(),
      read: false,
      aiGenerated,
    };

    const next = [...storage.getMessages(), newMessage];
    storage.setMessages(next);
    setMessages(getMessages(currentUserId, friendId));
    return newMessage;
  }

  function markRead() {
    if (!friendId) return;
    markConversationRead(currentUserId, friendId);
    refresh();
  }

  function toggleReaction(messageId, emoji) {
    const all = storage.getMessages();
    const next = all.map((m) => {
      if (m.id !== messageId) return m;
      const reactions = { ...(m.reactions || {}) };
      const users = reactions[emoji] || [];
      reactions[emoji] = users.includes(currentUserId)
        ? users.filter((id) => id !== currentUserId)
        : [...users, currentUserId];
      return { ...m, reactions };
    });
    storage.setMessages(next);
    setMessages(getMessages(currentUserId, friendId));
  }

  return { messages, sendMessage, markRead, toggleReaction, refresh };
}