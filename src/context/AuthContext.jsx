// context/AuthContext.jsx
import { createContext, useState, useEffect } from 'react';
import { storage, generateId } from '../utils/storage';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => storage.getCurrentUser());

  useEffect(() => {
    if (!currentUser) return;

    function touchLastSeen() {
      const users = storage.getUsers();
      const next = users.map((u) =>
        u.id === currentUser.id ? { ...u, lastSeen: new Date().toISOString() } : u
      );
      storage.setUsers(next);
    }

    touchLastSeen();
    const interval = setInterval(touchLastSeen, 60 * 1000);
    return () => clearInterval(interval);
  }, [currentUser?.id]);

  function signup({ name, email, password }) {
    const users = storage.getUsers();
    const exists = users.some((u) => u.email.toLowerCase() === email.toLowerCase());
    if (exists) {
      throw new Error('Email already registered');
    }

    const newUser = {
      id: generateId('usr'),
      name,
      email,
      password,
      bio: '',
      location: '',
      avatar: null,
      coverImage: null,
      joinedAt: new Date().toISOString(),
      lastSeen: null,
      savedPostIds: [],
    };

    const success = storage.setUsers([...users, newUser]);
    if (!success) {
      throw new Error('Could not create your account — please try again.');
    }
    return newUser;
  }

  function login(email, password) {
    const users = storage.getUsers();
    const found = users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );

    if (!found) {
      throw new Error('Invalid email or password');
    }

    const { password: _pw, ...safeUser } = found;
    setCurrentUser(safeUser);
    storage.setCurrentUser(safeUser);
    return safeUser;
  }

  function logout() {
    setCurrentUser(null);
    storage.clearCurrentUser();
  }

  function updateCurrentUser(updatedFields) {
    if (!currentUser) return;

    const merged = { ...currentUser, ...updatedFields };

    const users = storage.getUsers();
    const nextUsers = users.map((u) => (u.id === merged.id ? { ...u, ...updatedFields } : u));
    const usersSuccess = storage.setUsers(nextUsers);
    const sessionSuccess = storage.setCurrentUser(merged);

    if (!usersSuccess || !sessionSuccess) {
      throw new Error(
        'Could not save your profile — the image may be too large for browser storage. Try a smaller image.'
      );
    }

    setCurrentUser(merged);
  }

  function toggleSavedPost(postId) {
    if (!currentUser) return;
    const savedPostIds = currentUser.savedPostIds || [];
    const next = savedPostIds.includes(postId)
      ? savedPostIds.filter((id) => id !== postId)
      : [...savedPostIds, postId];
    updateCurrentUser({ savedPostIds: next });
  }

  function isPostSaved(postId) {
    return (currentUser?.savedPostIds || []).includes(postId);
  }

  const value = {
    currentUser,
    isAuthenticated: !!currentUser,
    signup,
    login,
    logout,
    updateCurrentUser,
    toggleSavedPost,
    isPostSaved,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}