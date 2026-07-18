// context/AuthContext.jsx   hanldes authentication of the sysytem like login , signup , logout and handles curretn user , it store data in storage and with the help of  contextapi(pass data without prop drilling) it moves data in over all application 
import { createContext, useState } from 'react';
//createContext use to share data globally  , useState use to store current login user 

import { storage, generateId } from '../utils/storage';
//storage deals with the local storage to get or set items ,generateId use to generate a unique id for user

export const AuthContext = createContext(null);    // create authcontext act as a global container where we can store are authentication related data 

//authprovider provide authentication data ,childrens means the component inside the authprovider can access authentication data 
export function AuthProvider({ children }) {
  // Lazy init: read localStorage only once, on first mount
  const [currentUser, setCurrentUser] = useState(() => storage.getCurrentUser());


  //create  new account 
  function signup({ name, email, password }) {
    const users = storage.getUsers();             //get exisiting users from storage 
    const exists = users.some((u) => u.email.toLowerCase() === email.toLowerCase());         //chk if this email is already registered or not 
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
      joinedAt: new Date().toISOString(),          //saving user account creation time 
    };
 
    // saves user 
    const success = storage.setUsers([...users, newUser]);
    if (!success) {
      throw new Error('Could not create your account — please try again.');
    }
    return newUser;           //new user return after signup
  }


  // it receive emial and password 
  function login(email, password) {
    const users = storage.getUsers();
    const found = users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );

    if (!found) {
      throw new Error('Invalid email or password');
    }

    // Never keep the password in the session object 
    const { password: _pw, ...safeUser } = found;      //remove password  from object like name , email, password after this only name and email
    setCurrentUser(safeUser);         //update user 
    storage.setCurrentUser(safeUser);
    return safeUser;
  }

  function logout() {
    setCurrentUser(null);
    storage.clearCurrentUser();
  }

  //profile update like name bio location and avatar
  function updateCurrentUser(updatedFields) {
    if (!currentUser) return;      //if no user login it stops 

    const merged = { ...currentUser, ...updatedFields };    //combine old nad new data chnges 

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

  // define things that other componets can use 
  const value = {
    currentUser,
    isAuthenticated: !!currentUser,
    signup,
    login,
    logout,
    updateCurrentUser,
  };


  //means value ky andr jo bhi data pass ho ga wo sary child components ko available ho ga 
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}