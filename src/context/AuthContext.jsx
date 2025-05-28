import { createContext, useState, useEffect } from "react";
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { db, app } from "../firebaseConfig";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const auth = getAuth(app);
  const [isAdmin, setIsAdmin] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const allowedAdmins = ["59YpxKhCvmimS0YWzSMQMwSTMXZQ", "1lVl1cgsgQTvmFAieyhTVk3yAYF2"];
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      if (user && allowedAdmins.includes(user.uid)) {
        setIsAdmin(true);
      } else {
        setIsAdmin(false);
      }
    });
    return () => unsubscribe();
  }, [auth, allowedAdmins]);

  const login = async (email, password) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
      console.error("Login failed:", err.message);
    }
  };

  const logout = async () => {
    await signOut(auth);
    setIsAdmin(false);
    setCurrentUser(null);
  };

  return (
    <AuthContext.Provider value={{ isAdmin, currentUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
