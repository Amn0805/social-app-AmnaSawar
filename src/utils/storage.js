// storage.js
// Every component that reads or writes localStorage goes through THIS file.
// Never call localStorage.getItem/setItem directly from a component.

const KEYS = {
  USERS: 'users',
  POSTS: 'posts',
  COMMENTS: 'comments',
  LIKES: 'likes',
  CURRENT_USER: 'currentUser',
  FRIEND_REQUESTS: 'friendRequests',
  MESSAGES: 'messages',
  AI_SETTINGS: 'aiSettings',
};

function read(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (err) {
    console.error(`storage: failed to read ${key}`, err);
    return fallback;
  }
}

function write(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (err) {
    console.error(`storage: failed to write ${key}`, err);
    return false;
  }
}

export const storage = {
  getUsers: () => read(KEYS.USERS, []),
  setUsers: (users) => write(KEYS.USERS, users),

  getPosts: () => read(KEYS.POSTS, []),
  setPosts: (posts) => write(KEYS.POSTS, posts),

  getComments: () => read(KEYS.COMMENTS, []),
  setComments: (comments) => write(KEYS.COMMENTS, comments),

  getLikes: () => read(KEYS.LIKES, []),
  setLikes: (likes) => write(KEYS.LIKES, likes),

  getCurrentUser: () => read(KEYS.CURRENT_USER, null),
  setCurrentUser: (user) => write(KEYS.CURRENT_USER, user),
  clearCurrentUser: () => localStorage.removeItem(KEYS.CURRENT_USER),

  getFriendRequests: () => read(KEYS.FRIEND_REQUESTS, []),
  setFriendRequests: (requests) => write(KEYS.FRIEND_REQUESTS, requests),

  getMessages: () => read(KEYS.MESSAGES, []),
  setMessages: (messages) => write(KEYS.MESSAGES, messages),

  getAllAiSettings: () => read(KEYS.AI_SETTINGS, {}),
  setAllAiSettings: (settings) => write(KEYS.AI_SETTINGS, settings),
};

export function generateId(prefix) {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}