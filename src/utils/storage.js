// storage.js
// Every component that reads or writes localStorage goes through THIS file.
// Never call localStorage.getItem/setItem directly from a component.

const KEYS = {
  USERS: 'users',
  POSTS: 'posts',
  COMMENTS: 'comments',
  LIKES: 'likes',
  CURRENT_USER: 'currentUser',
};

// Generic safe read/write so we don't repeat try/catch everywhere
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
  } catch (err) {
    console.error(`storage: failed to write ${key}`, err);
  }
}

export const storage = {
  // Users
  getUsers: () => read(KEYS.USERS, []),
  setUsers: (users) => write(KEYS.USERS, users),

  // Posts
  getPosts: () => read(KEYS.POSTS, []),
  setPosts: (posts) => write(KEYS.POSTS, posts),

  // Comments
  getComments: () => read(KEYS.COMMENTS, []),
  setComments: (comments) => write(KEYS.COMMENTS, comments),

  // Likes
  getLikes: () => read(KEYS.LIKES, []),
  setLikes: (likes) => write(KEYS.LIKES, likes),

  // Current session
  getCurrentUser: () => read(KEYS.CURRENT_USER, null),
  setCurrentUser: (user) => write(KEYS.CURRENT_USER, user),
  clearCurrentUser: () => localStorage.removeItem(KEYS.CURRENT_USER),
};

// id generator used everywhere: usr_..., post_..., cmt_..., like_...
export function generateId(prefix) {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}
