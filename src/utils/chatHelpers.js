// utils/chatHelpers.js
import { storage } from './storage';

export function getConversationId(userId1, userId2) {
  return [userId1, userId2].sort().join('_');
}

export function getMessages(userId1, userId2) {
  const conversationId = getConversationId(userId1, userId2);
  return storage
    .getMessages()
    .filter((m) => m.conversationId === conversationId)
    .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
}

export function getConversations(currentUserId, friends) {
  const allMessages = storage.getMessages();

  const conversations = friends.map((friend) => {
    const conversationId = getConversationId(currentUserId, friend.id);
    const messages = allMessages
      .filter((m) => m.conversationId === conversationId)
      .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

    const lastMessage = messages[messages.length - 1] || null;
    const unreadCount = messages.filter(
      (m) => m.receiverId === currentUserId && !m.read
    ).length;

    return {
      friend,
      conversationId,
      lastMessage,
      unreadCount,
      sortTime: lastMessage ? new Date(lastMessage.timestamp).getTime() : 0,
    };
  });

  return conversations.sort((a, b) => b.sortTime - a.sortTime);
}

export function markConversationRead(currentUserId, friendId) {
  const conversationId = getConversationId(currentUserId, friendId);
  const all = storage.getMessages();
  const next = all.map((m) =>
    m.conversationId === conversationId && m.receiverId === currentUserId && !m.read
      ? { ...m, read: true }
      : m
  );
  storage.setMessages(next);
}

export function getTotalUnreadCount(currentUserId) {
  return storage.getMessages().filter((m) => m.receiverId === currentUserId && !m.read).length;
}

export function previewText(message) {
  if (!message) return '';
  if (message.type === 'image') return '📷 Photo';
  if (message.type === 'video') return '🎥 Video';
  const text = message.content || '';
  return text.length > 40 ? text.slice(0, 40).trimEnd() + '…' : text;
}

export function isOnline(user) {
  if (!user?.lastSeen) return false;
  const diffMs = Date.now() - new Date(user.lastSeen).getTime();
  return diffMs < 5 * 60 * 1000;
}

export function getAiSettings(userId) {
  const all = storage.getAllAiSettings();
  return all[userId] || { aiChatEnabled: false, aiPersonality: 'friendly' };
}

export function setAiSettings(userId, settings) {
  const all = storage.getAllAiSettings();
  all[userId] = { ...getAiSettings(userId), ...settings };
  storage.setAllAiSettings(all);
}