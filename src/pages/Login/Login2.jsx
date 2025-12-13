import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, Lock, Loader2 } from "lucide-react";
import { AuthContext } from "../../context/AuthContext";
import api from "../../api/axiosConfig";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  // Estados del modal y registro
  const [showRegister, setShowRegister] = useState(false);
  const { user } = useContext(AuthContext);
  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data } = await api.post("/usuarios/login", { email, password });
      console.log("🔍 Datos recibidos del backend:", data);

      if (!data?.data) {
        alert("Credenciales incorrectas");
        return;
      }

      const userDB = data.data;

      const userData = {
        usuario_id: userDB.usuario_id,
        nombre: userDB.nombre,
        apellido: userDB.apellido,
        email: userDB.email,
        rol: userDB.rol?.toUpperCase(),
        telefono: userDB.telefono,
        estado: userDB.estado,
        matricula: userDB.matricula,
        curso_actual_id: userDB.curso_actual_id,
        especialidad: userDB.especialidad,
        titulo_academico: userDB.titulo_academico,
        fecha_ingreso: userDB.fecha_ingreso,
      };

      console.log("💾 Guardando sesión:", userData);
      login(userData);

      // Redirección por rol
      if (userData.rol === "ADMIN") navigate("/admin");
      else if (userData.rol === "DOCENTE")
        navigate(`/docente/${user.usuario_id}`);
      else if (userData.rol === "ESTUDIANTE") navigate(`/estudiante`);
      else alert("Rol desconocido en el sistema.");
    } catch (error) {
      console.error("❌ Error en login:", error);
      alert("Error en credenciales o conexión");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-purple-50 via-pink-50 to-blue-50 flex items-center justify-center p-4 overflow-hidden">
      <div className="absolute inset-0 bg-grid-slate-100 opacity-20 pointer-events-none"></div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative z-10 w-full max-w-5xl"
      >
        <div className="flex flex-col md:flex-row bg-white rounded-3xl shadow-2xl overflow-hidden">
          {/* Panel Lateral con Animación */}
          <motion.div
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="hidden md:flex relative w-1/2 bg-linear-to-br from-violet-600 via-purple-600 to-indigo-700 p-12 items-center justify-center overflow-hidden"
          >
            <div className="absolute inset-0 opacity-20">
              <div className="absolute top-10 left-10 w-72 h-72 bg-white rounded-full blur-3xl animate-pulse"></div>
              <div className="absolute bottom-10 right-10 w-96 h-96 bg-pink-400 rounded-full blur-3xl animate-pulse delay-700"></div>
            </div>

            <div className="relative text-center text-white z-10">
              <motion.h2
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="text-5xl font-bold mb-4"
              >
                ¡Hola de nuevo!
              </motion.h2>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="text-lg opacity-90 max-w-xs mx-auto"
              >
                Accede a tu cuenta y continúa donde lo dejaste.
              </motion.p>

              <motion.div
                className="flex justify-center space-x-3 mt-10"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.8, staggerChildren: 0.2 }}
              >
                {[0, 1, 2].map((i) => (
                  <motion.span
                    key={i}
                    animate={{
                      y: [0, -10, 0],
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      delay: i * 0.2,
                      ease: "easeInOut",
                    }}
                    className="w-3 h-3 bg-white rounded-full"
                  />
                ))}
              </motion.div>
            </div>
          </motion.div>

          {/* Formulario */}
          <motion.div
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="w-full md:w-1/2 p-8 lg:p-14"
          >
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <h1 className=" lg:text-3xl font-bold text-gray-800 bg-clip-text bg-linear-to-r from-violet-600 to-blue-600">
                Bienvenido al ERP Udomi
              </h1>
              <p className="font-medium text-lg text-gray-500 mt-2">
                Por favor, ingresa tus datos para continuar.
              </p>
            </motion.div>

            <form onSubmit={handleLogin} className="mt-10 space-y-6">
              {/* Email */}
              <motion.div
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                <label className="text-lg font-medium text-gray-700 flex items-center gap-2">
                  <Mail className="w-5 h-5 text-violet-600" />
                  Correo
                </label>
                <motion.input
                  whileFocus={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  type="email"
                  className="w-full border-2 border-gray-300 rounded-xl p-4 mt-1 bg-gray-50/50 focus:bg-white focus:border-violet-500 focus:ring-4 focus:ring-violet-200 outline-none transition-all duration-300"
                  placeholder="tu@correo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </motion.div>

              {/* Contraseña */}
              <motion.div
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.7 }}
              >
                <label className="text-lg font-medium text-gray-700 flex items-center gap-2">
                  <Lock className="w-5 h-5 text-violet-600" />
                  Contraseña
                </label>
                <motion.input
                  whileFocus={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  type="password"
                  className="w-full border-2 border-gray-300 rounded-xl p-4 mt-1 bg-gray-50/50 focus:bg-white focus:border-violet-500 focus:ring-4 focus:ring-violet-200 outline-none transition-all duration-300"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </motion.div>

              {/* Opciones */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="flex justify-between items-center"
              ></motion.div>

              {/* Botón */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.9 }}
              >
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-linear-to-r from-violet-600 to-indigo-600 text-white py-4 rounded-xl text-lg font-bold shadow-lg hover:shadow-xl flex items-center justify-center gap-3 transition-all duration-300 disabled:opacity-80"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-6 h-6 animate-spin" />
                      Iniciando...
                    </>
                  ) : (
                    "Iniciar Sesión"
                  )}
                </motion.button>
              </motion.div>
            </form>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="mt-8 text-center"
            ></motion.div>
          </motion.div>
        </div>
      </motion.div>
      {showRegister && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="bg-white w-full max-w-lg p-8 rounded-3xl shadow-2xl relative"
          >
            <button
              className="absolute top-4 right-4 text-gray-500 text-xl hover:text-gray-700"
              onClick={() => setShowRegister(false)}
            >
              ✕
            </button>

            <h2 className="text-3xl font-bold text-gray-800 text-center mb-6 bg-clip-text bg-linear-to-r from-violet-600 to-blue-600">
              Crear Cuenta Estudiante
            </h2>

            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label className="text-gray-700 font-medium">Nombre</label>
                <input
                  type="text"
                  required
                  className="w-full border-2 border-gray-300 rounded-xl p-3 mt-1"
                  value={regData.nombre}
                  onChange={(e) =>
                    setRegData({ ...regData, nombre: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="text-gray-700 font-medium">Apellido</label>
                <input
                  type="text"
                  required
                  className="w-full border-2 border-gray-300 rounded-xl p-3 mt-1"
                  value={regData.apellido}
                  onChange={(e) =>
                    setRegData({ ...regData, apellido: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="text-gray-700 font-medium">Correo</label>
                <input
                  type="email"
                  required
                  className="w-full border-2 border-gray-300 rounded-xl p-3 mt-1"
                  value={regData.email}
                  onChange={(e) =>
                    setRegData({ ...regData, email: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="text-gray-700 font-medium">Contraseña</label>
                <input
                  type="password"
                  required
                  className="w-full border-2 border-gray-300 rounded-xl p-3 mt-1"
                  value={regData.password}
                  onChange={(e) =>
                    setRegData({ ...regData, password: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="text-gray-700 font-medium">Teléfono</label>
                <input
                  type="text"
                  required
                  className="w-full border-2 border-gray-300 rounded-xl p-3 mt-1"
                  value={regData.telefono}
                  onChange={(e) =>
                    setRegData({ ...regData, telefono: e.target.value })
                  }
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-linear-to-r from-violet-600 to-indigo-600 text-white py-3 rounded-xl text-lg font-bold mt-4 shadow-md hover:shadow-lg transition-all"
              >
                {isLoading ? "Registrando..." : "Crear Cuenta"}
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
