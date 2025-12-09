import React, { useState } from "react";
import {
  Search,
  User,
  Users,
  Calendar,
  Phone,
  Edit,
  Trash2,
  Filter,
  ChevronDown,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function AdminDashboard() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("todos");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const navigate = useNavigate(); // 🔑 Necesario para navegar

  // Datos de ejemplo
  const students = [
    {
      id: 1,
      matricula: "1234532",
      nombre: "Nombre estudiante",
      apellido: "Apellido estudiante",
      telefono: "8296714173",
      fecha: "7/8/2025 - 4:56 pm",
      estado: "activo",
      curso: "Introducción a la ciencia...",
    },
    {
      id: 2,
      matricula: "1234532",
      nombre: "Nombre estudiante",
      apellido: "Apellido estudiante",
      telefono: "8296714173",
      fecha: "7/8/2025 - 4:56 pm",
      estado: "activo",
      curso: "Introducción a la ciencia...",
    },
    {
      id: 3,
      matricula: "1234532",
      nombre: "Nombre estudiante",
      apellido: "Apellido estudiante",
      telefono: "8296714173",
      fecha: "7/8/2025 - 4:56 pm",
      estado: "activo",
      curso: "Introducción a la ciencia...",
    },
  ];

  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      student.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.matricula.includes(searchTerm);
    const matchesFilter = filter === "todos" || student.estado === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
      {/* Header */}
      <header className="mb-8 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Buscar estudiante..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />
        </div>

        {/* Dropdown de usuario */}
        <div className="relative">
          <button
            className="flex items-center gap-2 bg-white px-4 py-3 rounded-lg shadow-sm focus:outline-none"
            onClick={() => setDropdownOpen((prev) => !prev)}
          >
            <div className="w-8 h-8 bg-blue-900 text-white rounded-full flex items-center justify-center text-sm font-bold">
              NU
            </div>
            <span className="font-medium text-gray-700">Nombre usuario</span>
            <ChevronDown className="w-4 h-4 text-gray-500" />
          </button>

          {/* Dropdown */}
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
              <button
                className="w-full text-left px-4 py-2 hover:bg-gray-100"
                onClick={() => navigate("/PerfilUsuario")}
              >
                Perfil
              </button>
              <button
                className="w-full text-left px-4 py-2 hover:bg-gray-100"
                onClick={() => navigate("/PublicarNotas")}
              >
                Publicar Notas
              </button>
              <button
                className="w-full text-left px-4 py-2 hover:bg-gray-100"
                onClick={() => navigate("/Seccion")}
              >
                Secciones
              </button>
              <button
                className="w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600"
                onClick={() => {
                  localStorage.removeItem("role");
                  navigate("/PublicarNotas");
                }}
              >
                Cerrar sesión
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <div className="bg-linear-to-r from-blue-500 to-blue-600 text-white p-6 rounded-2xl shadow-lg flex items-center justify-between transform transition hover:scale-105">
          <div>
            <h3 className="text-lg font-semibold">Estudiantes</h3>
            <p className="text-3xl font-bold mt-1">45</p>
            <p className="text-sm opacity-90">
              Total de estudiantes registrados
            </p>
          </div>
          <Users className="w-12 h-12 opacity-80" />
        </div>

        <div className="`bg-linear-to-r from-emerald-500 to-teal-600 text-white p-6 rounded-2xl shadow-lg flex items-center justify-between transform transition hover:scale-105">
          <div>
            <h3 className="text-lg font-semibold">Secciones</h3>
            <p className="text-3xl font-bold mt-1">12</p>
            <p className="text-sm opacity-90">Total de secciones registradas</p>
          </div>
          <div className="bg-white/20 p-3 rounded-xl">
            <Calendar className="w-8 h-8" />
          </div>
        </div>
      </div>

      {/* Table Section */}
      <section className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <h2 className="text-xl font-bold text-gray-800">
            Registros de los estudiantes
          </h2>
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-500" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="todos">Filtro de búsqueda</option>
              <option value="activo">Activos</option>
              <option value="inactivo">Inactivos</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                {[
                  "Matrícula",
                  "Nombre",
                  "Apellido",
                  "Teléfono",
                  "Fecha de registro",
                  "Estado",
                  "Curso",
                  "Operaciones",
                ].map((header) => (
                  <th
                    key={header}
                    className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredStudents.map((student) => (
                <tr key={student.id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4 font-mono text-sm text-gray-900">
                    {student.matricula}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {student.nombre}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {student.apellido}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700 flex items-center gap-1">
                    <Phone className="w-4 h-4 text-gray-500" />
                    {student.telefono}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {student.fecha}
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      activo
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700 max-w-xs truncate">
                    {student.curso}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button className="text-blue-600 hover:text-blue-800 transition">
                        <User className="w-5 h-5" />
                      </button>
                      <button className="text-amber-600 hover:text-amber-800 transition">
                        <Edit className="w-5 h-5" />
                      </button>
                      <button className="text-red-600 hover:text-red-800 transition">
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 text-sm text-gray-600">
          Mostrando {filteredStudents.length} de {students.length} registros
        </div>
      </section>
    </div>
  );
}
