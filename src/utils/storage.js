// storage.js
// Every component that reads or writes localStorage goes through THIS file.
// Never call localStorage.getItem/setItem directly from a component.

const KEYS = {     //define key for localstorage because in locala storage data save in key value pairs 
  USERS: 'users',
  POSTS: 'posts',
  COMMENTS: 'comments',
  LIKES: 'likes',
  CURRENT_USER: 'currentUser',
};

// Generic safe read/write so we don't repeat try/catch everywhere  
function read(key, fallback) {       //reuseable function that read data from local storage  first key data read and fallback means if data is not available then what to show 
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (err) {         //if error occurs in read time catch execute 
    console.error(`storage: failed to read ${key}`, err);
    return fallback;
  }
}


//store data in local storage 
function write(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (err) {
    console.error(`storage: failed to write ${key}`, err);
    return false;
  }
}


//object creation where every functon organaize in storage 
export const storage = {
  // Users 
  getUsers: () => read(KEYS.USERS, []),
  setUsers: (users) => write(KEYS.USERS, users), // save user array in storage 

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