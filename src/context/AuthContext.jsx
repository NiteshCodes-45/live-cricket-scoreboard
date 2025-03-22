import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isAdmin, setIsAdmin] = useState(false);

  // Check if the user is already logged in
  useEffect(() => {
    const storedAdmin = localStorage.getItem("isAdmin");
    setIsAdmin(storedAdmin === "true");
  }, []);

  const login = (password) => {
    if (password === "Nitesh@45") {  // ✅ Change this to a more secure method later
      setIsAdmin(true);
      localStorage.setItem("isAdmin", "true");
    }
  };

  const logout = () => {
    setIsAdmin(false);
    localStorage.removeItem("isAdmin");
  };

  return (
    <AuthContext.Provider value={{ isAdmin, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
