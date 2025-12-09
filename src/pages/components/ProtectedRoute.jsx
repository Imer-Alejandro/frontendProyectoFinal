import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const ProtectedRoute = ({ children, allowedRole }) => {
  const { user, isAuthenticated, isLoading } = useContext(AuthContext);

  console.log("🧭 ProtectedRoute Check:", {
    isAuthenticated,
    isLoading,
    user,
    allowedRole,
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen text-xl">
        Cargando sesión...
      </div>
    );
  }

  if (!isAuthenticated) {
    console.log("❌ Usuario no autenticado → redirigiendo al login");
    return <Navigate to="/" replace />;
  }

  if (allowedRole && user?.rol?.toUpperCase() !== allowedRole) {
    console.log(
      `🚫 Acceso denegado. Rol usuario: ${user?.rol}, Requerido: ${allowedRole}`
    );
    return <Navigate to="/" replace />;
  }

  console.log("✅ Acceso permitido a", allowedRole);
  return children;
};

export default ProtectedRoute;
