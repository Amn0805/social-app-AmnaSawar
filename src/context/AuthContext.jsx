// context/AuthContext.jsx
import { createContext, useState } from 'react';
import { storage, generateId } from '../utils/storage';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  // Lazy init: read localStorage only once, on first mount
  const [currentUser, setCurrentUser] = useState(() => storage.getCurrentUser());

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
      password, // plain-text on purpose: this is a localStorage-only demo, no real backend
      bio: '',
      location: '',
      avatar: null,
      coverImage: null,
      joinedAt: new Date().toISOString(),
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

    // Never keep the password in the session object
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

    // Persist into the users array first — if this fails (e.g. quota
    // exceeded from a large avatar image), don't update React state
    // either, so the UI doesn't show a "success" that never actually saved.
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

  const value = {
    currentUser,
    isAuthenticated: !!currentUser,
    signup,
    login,
    logout,
    updateCurrentUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}