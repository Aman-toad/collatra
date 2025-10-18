import { createContext, useState, useEffect } from "react";
import api from '../utils/api.js';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const getStoredUser = () => {
    try {
      const storedUser = localStorage.getItem("user");
      if (!storedUser || storedUser === "undefined") return null;
      return JSON.parse(storedUser);
    } catch (err) {
      console.error("Error parsing stored user:", err);

      localStorage.removeItem("user");
      localStorage.removeItem("token"); //to prevent infinite loop
      return null;
    }
  };

  const [user, setUser] = useState(getStoredUser);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuthStatus = async () => {
      const storedToken = localStorage.getItem("token");

      if (storedToken) {
        try {
          // This uses the token automatically attached by api.js interceptor
          const { data } = await api.get('/auth/me');

          const userObject = { _id: data._id, name: data.name, email: data.email };
          localStorage.setItem('user', JSON.stringify(userObject));
          setUser(userObject);

        } catch (error) {
          console.warn("Token validation failed. Clearing session.");
          localStorage.removeItem("user");
          localStorage.removeItem("token");
          setUser(null);
        }
      } else {
        setUser(null);
      }
      setIsLoading(false);
    };

    checkAuthStatus();
  }, [])

  const login = (userData) => {
    localStorage.setItem('token', userData.token);

    const userObject = { _id: userData._id, name: userData.name, email: userData.email };
    localStorage.setItem('user', JSON.stringify(userObject));
    setUser(userObject);
  }

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
