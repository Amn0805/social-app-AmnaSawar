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

    storage.setUsers([...users, newUser]);
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
    setCurrentUser(merged);
    storage.setCurrentUser(merged);

    // Also persist into the users array so it survives next login
    const users = storage.getUsers();
    const nextUsers = users.map((u) => (u.id === merged.id ? { ...u, ...updatedFields } : u));
    storage.setUsers(nextUsers);
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
