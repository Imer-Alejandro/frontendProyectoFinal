import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        console.log("🔁 Sesión restaurada:", parsedUser);
      } catch (e) {
        console.error("❌ Error al parsear usuario:", e);
      }
    }
    setIsLoading(false);
  }, []);

  const login = (userData) => {
    // Aquí se guardan TODOS los campos del usuario exactamente como vienen
    const formattedUser = {
      ...userData,
      rol: userData.rol?.toUpperCase() || "",
    };

    localStorage.setItem("user", JSON.stringify(formattedUser));
    setUser(formattedUser);
    console.log("✅ Usuario guardado en contexto:", formattedUser);
  };

  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
  };

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider
      value={{ user, login, logout, isAuthenticated, isLoading }}
    >
      {children}
    </AuthContext.Provider>
  );
};
