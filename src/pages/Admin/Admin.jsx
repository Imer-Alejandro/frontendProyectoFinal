import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar, Pie } from "react-chartjs-2";
import { useNavigate } from "react-router-dom";

import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";

ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  ArcElement,
  Tooltip,
  Legend
);

export default function Student() {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  // Estado global de usuarios
  const [usuarios, setUsuarios] = useState([]);
  const [filtro, setFiltro] = useState("ESTUDIANTE");

  // Conteos
  const [countEst, setCountEst] = useState(0);
  const [countDoc, setCountDoc] = useState(0);
  const [countAdmin, setCountAdmin] = useState(0);

  // Cargar datos reales
  useEffect(() => {
    fetch("https://servidor-proyecto-final-itla.vercel.app/api/usuarios")
      .then((res) => res.json())
      .then((data) => {
        setUsuarios(data);

        // Contar por rol
        setCountEst(data.filter((u) => u.rol === "ESTUDIANTE").length);
        setCountDoc(data.filter((u) => u.rol === "DOCENTE").length);
        setCountAdmin(data.filter((u) => u.rol === "ADMIN").length);
      })
      .catch((err) => console.error("Error cargando usuarios:", err));
  }, []);

  // Filtrar por rol seleccionado
  const usuariosFiltrados = usuarios.filter((u) => u.rol === filtro);

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-blue-600 text-white flex flex-col h-full shadow-xl">
        <div className="p-6 border-b border-blue-500">
          <h2 className="text-xl font-bold text-center">ERP Académico</h2>
          <p className="text-xs text-blue-200 text-center mt-1">
            Sistema de gestión
          </p>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          <button
            onClick={() => navigate("/registrar-docente")}
            className="w-full text-left px-4 py-3 rounded-lg hover:bg-blue-700 font-medium text-sm transition"
          >
            Registrar docente
          </button>
          <button
            onClick={() => navigate("/registrar-estudiante")}
            className="w-full text-left px-4 py-3 rounded-lg hover:bg-blue-700 font-medium text-sm transition"
          >
            Registrar estudiante
          </button>
          <button
            onClick={() => navigate("/registrar-curso")}
            className="w-full text-left px-4 py-3 rounded-lg hover:bg-blue-700 font-medium text-sm transition"
          >
            Registrar curso
          </button>
          <button
            onClick={() => navigate("/registrar-seccion")}
            className="w-full text-left px-4 py-3 rounded-lg hover:bg-blue-700 font-medium text-sm transition"
          >
            Registrar sección
          </button>
          <button
            onClick={() => navigate("/registrar-admin")}
            className="w-full text-left px-4 py-3 rounded-lg hover:bg-blue-700 font-medium text-sm transition"
          >
            Registrar admin
          </button>
          <button
            onClick={() => navigate("/ConfiguracionAdmin")}
            className="w-full text-left px-4 py-3 rounded-lg hover:bg-blue-700 font-medium text-sm transition"
          >
            Configuración
          </button>
        </nav>

        <div className="p-4 border-t border-blue-500">
          <button
            onClick={() => navigate("/")}
            className="w-full bg-blue-700 hover:bg-blue-800 text-white py-3 rounded-lg font-medium transition"
          >
            Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* Contenido */}
      <div className="flex-1 overflow-y-auto">
        <header className="sticky top-0 z-40 bg-white shadow-md p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-teal-500 text-white w-10 h-10 flex items-center justify-center rounded-full font-bold text-sm">
                {`${user?.nombre?.charAt(0) || ""}${
                  user?.apellido?.charAt(0) || ""
                }`.toUpperCase()}
              </div>
              <div>
                <p className="font-semibold text-gray-800">{user?.nombre}</p>
                <p className="text-xs text-gray-500">Administrador</p>
              </div>
            </div>
          </div>
        </header>

        {/* Tarjetas estadísticas */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-green-100 p-5 rounded-xl shadow">
            <h5 className="text-lg font-bold text-green-800">
              Docentes registrados
            </h5>
            <p className="text-2xl font-bold text-green-900 mt-1">{countDoc}</p>
          </div>

          <div className="bg-blue-100 p-5 rounded-xl shadow">
            <h5 className="text-lg font-bold text-blue-800">
              Admins registrados
            </h5>
            <p className="text-2xl font-bold text-blue-900 mt-1">
              {countAdmin}
            </p>
          </div>

          <div className="bg-gray-100 p-5 rounded-xl shadow">
            <h5 className="text-lg font-bold text-gray-800">
              Estudiantes registrados
            </h5>
            <p className="text-2xl font-bold text-gray-900 mt-1">{countEst}</p>
          </div>
        </div>

        {/* Tabla */}
        <div className="p-6">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
            <div className="bg-blue-600 p-5 text-white flex justify-between items-center">
              <h3 className="text-xl font-bold">Registros</h3>

              {/* FILTRO POR ROL */}
              <select
                className="px-3 py-2 rounded text-black"
                value={filtro}
                onChange={(e) => setFiltro(e.target.value)}
              >
                <option value="ESTUDIANTE">Estudiantes</option>
                <option value="DOCENTE">Docentes</option>
                <option value="ADMIN">Admins</option>
              </select>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                      ID
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                      Nombre
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                      Estado
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {usuariosFiltrados.map((u) => (
                    <tr key={u.usuario_id} className="hover:bg-blue-50">
                      <td className="px-6 py-4 font-medium text-gray-900">
                        #{u.usuario_id}
                      </td>

                      <td className="px-6 py-4 text-sm">
                        <p className="font-medium">{u.nombre}</p>
                        <p className="text-xs text-gray-500">{u.apellido}</p>
                      </td>

                      <td className="px-6 py-4">{u.email}</td>

                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 text-xs font-bold rounded-full ${
                            u.estado === "activo"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {u.estado}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {usuariosFiltrados.length === 0 && (
                <p className="text-center py-4 text-gray-600">
                  No hay usuarios con este rol.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
