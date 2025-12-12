import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { Edit2, X, Save, UserCheck, BookOpen, Loader2 } from "lucide-react";

export default function GestionUsuarios() {
  const { user } = useContext(AuthContext);

  const [usuarios, setUsuarios] = useState([]);
  const [cursos, setCursos] = useState([]);
  const [loading, setLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [editForm, setEditForm] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resUsuarios, resCursos] = await Promise.all([
          fetch("https://servidor-proyecto-final-itla.vercel.app/api/usuarios"),
          fetch("https://servidor-proyecto-final-itla.vercel.app/api/cursos"),
        ]);

        const usuariosData = await resUsuarios.json();
        const cursosData = await resCursos.json();

        setUsuarios(usuariosData);
        setCursos(cursosData);
      } catch (e) {
        console.log("Error cargando datos", e);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const openModal = (usuario) => {
    setEditUser(usuario);
    setEditForm(usuario);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditUser(null);
    setEditForm({});
  };

  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const actualizarUsuario = async () => {
    try {
      const res = await fetch(
        `https://servidor-proyecto-final-itla.vercel.app/api/usuarios/${editUser.usuario_id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(editForm),
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Error al actualizar");

      alert("Usuario actualizado correctamente");

      setUsuarios((prev) =>
        prev.map((u) => (u.usuario_id === editUser.usuario_id ? editForm : u))
      );

      closeModal();
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Cargando datos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}

        <div className="mb-10 flex">
          <button
            onClick={() => navigate(-1)}
            className="absolute top-6 left-6 mb-3 text-indigo-950  hover:text-white font-semibold transition"
          >
            ← Volver
          </button>
          <h1 className="text-4xl font-bold text-gray-800 flex items-center gap-3">
            <UserCheck className="w-10 h-10 text-blue-600" />
            Gestión de Usuarios
          </h1>
          <p className="text-gray-600 mt-3 text-lg">
            Admin conectado → ID:{" "}
            <span className="font-bold text-blue-700">{user?.usuario_id}</span>
          </p>
        </div>

        {/* Tabla de Usuarios */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 overflow-hidden mb-12">
          <div className="p-8 border-b border-gray-200/60">
            <h2 className="text-2xl font-bold text-gray-800">
              Lista de Usuarios
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
                  <th className="px-8 py-5 text-left font-semibold">ID</th>
                  <th className="px-8 py-5 text-left font-semibold">
                    Nombre Completo
                  </th>
                  <th className="px-8 py-5 text-left font-semibold">
                    Correo Electrónico
                  </th>
                  <th className="px-8 py-5 text-left font-semibold">Rol</th>
                  <th className="px-8 py-5 text-center font-semibold">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {usuarios.map((u) => (
                  <tr
                    key={u.usuario_id}
                    className="hover:bg-blue-50/60 transition-all duration-200 group"
                  >
                    <td className="px-8 py-6 font-mono text-blue-700 font-bold">
                      #{u.usuario_id}
                    </td>
                    <td className="px-8 py-6 font-semibold text-gray-900">
                      {u.nombre} {u.apellido}
                    </td>
                    <td className="px-8 py-6 text-gray-700">{u.email}</td>
                    <td className="px-8 py-6">
                      <span
                        className={`inline-flex items-center px-4 py-2 rounded-full text-xs font-bold shadow-sm
                        ${
                          u.rol === "ADMIN"
                            ? "bg-purple-100 text-purple-800"
                            : ""
                        }
                        ${
                          u.rol === "DOCENTE" ? "bg-blue-100 text-blue-800" : ""
                        }
                        ${
                          u.rol === "ESTUDIANTE"
                            ? "bg-emerald-100 text-emerald-800"
                            : ""
                        }
                      `}
                      >
                        {u.rol}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-center">
                      <button
                        onClick={() => openModal(u)}
                        className="inline-flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                      >
                        <Edit2 className="w-4 h-4" />
                        Editar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Cursos */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3 mb-6">
            <BookOpen className="w-8 h-8 text-emerald-600" />
            Cursos Disponibles
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {cursos.map((c) => (
            <div
              key={c.curso_id}
              className="group bg-white/90 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-2xl hover:-translate-y-2 transition-all duration-300"
            >
              <div className="h-2 bg-gradient-to-r from-emerald-500 to-teal-600"></div>
              <div className="p-6">
                <h3 className="font-bold text-xl text-gray-800 group-hover:text-emerald-700 transition">
                  {c.nombre}
                </h3>
                <p className="text-sm text-gray-600 mt-2 font-mono">
                  Código:{" "}
                  <span className="text-emerald-700 font-bold">{c.codigo}</span>
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* MODAL CORREGIDO - LOS BOTONES AHORA SE VEN PERFECTAMENTE */}
        {modalOpen && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-screen overflow-y-auto">
              {" "}
              {/* ← Aquí estaba el problema */}
              {/* Header del modal */}
              <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-white sticky top-0">
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-bold flex items-center gap-3">
                    <Edit2 className="w-7 h-7" />
                    Editar Usuario
                  </h3>
                  <button
                    onClick={closeModal}
                    className="p-2 hover:bg-white/20 rounded-xl transition"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>
              {/* Formulario */}
              <div className="p-8 space-y-5">
                {["nombre", "apellido", "email", "telefono"].map((field) => (
                  <div key={field}>
                    <label className="block text-sm font-semibold text-gray-700 mb-2 capitalize">
                      {field === "email"
                        ? "Correo"
                        : field === "telefono"
                        ? "Teléfono"
                        : field}
                    </label>
                    <input
                      type={
                        field === "email"
                          ? "email"
                          : field === "telefono"
                          ? "tel"
                          : "text"
                      }
                      name={field}
                      value={editForm[field] || ""}
                      onChange={handleEditChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                      placeholder={`Ingrese ${field}`}
                    />
                  </div>
                ))}

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Rol
                  </label>
                  <select
                    name="rol"
                    value={editForm.rol || ""}
                    onChange={handleEditChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition font-medium"
                  >
                    <option value="ADMIN">ADMINISTRADOR</option>
                    <option value="DOCENTE">DOCENTE</option>
                    <option value="ESTUDIANTE">ESTUDIANTE</option>
                  </select>
                </div>
              </div>
              {/* Botones siempre visibles */}
              <div className="bg-gray-50 px-8 py-6 flex justify-end gap-4 border-t sticky bottom-0">
                <button
                  onClick={closeModal}
                  className="px-6 py-3 bg-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-400 transition"
                >
                  Cancelar
                </button>
                <button
                  onClick={actualizarUsuario}
                  className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition flex items-center gap-2"
                >
                  <Save className="w-5 h-5" />
                  Guardar Cambios
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
