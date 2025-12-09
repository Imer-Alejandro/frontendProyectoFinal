import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

export default function GestionUsuarios() {
  const { user } = useContext(AuthContext); // ID del admin logueado

  const [usuarios, setUsuarios] = useState([]);
  const [cursos, setCursos] = useState([]);

  const [loading, setLoading] = useState(true);

  // Estados para el modal de edición
  const [modalOpen, setModalOpen] = useState(false);
  const [editUser, setEditUser] = useState(null); // Datos del usuario a editar
  const [editForm, setEditForm] = useState({});

  // Cargar usuarios y cursos
  useEffect(() => {
    const fetchData = async () => {
      try {
        const resUsuarios = await fetch(
          "https://servidor-proyecto-final-itla.vercel.app/api/usuarios"
        );
        const usuariosData = await resUsuarios.json();

        const resCursos = await fetch(
          "https://servidor-proyecto-final-itla.vercel.app/api/cursos"
        );
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

  // Abrir modal
  const openModal = (usuario) => {
    setEditUser(usuario);
    setEditForm(usuario); // Cargar datos actuales al formulario
    setModalOpen(true);
  };

  // Cerrar modal
  const closeModal = () => {
    setModalOpen(false);
    setEditUser(null);
  };

  // Control de inputs del modal
  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  // Enviar cambios al backend
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
      if (!res.ok) throw new Error(data.message);

      alert("Usuario actualizado correctamente");

      // Refrescar lista
      setUsuarios((prev) =>
        prev.map((u) => (u.usuario_id === editUser.usuario_id ? editForm : u))
      );

      closeModal();
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  if (loading) return <p className="text-center p-4">Cargando...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Gestión de Usuarios</h1>
      <p className="text-sm text-gray-600 mb-6">
        Admin logueado ID: <strong>{user?.usuario_id}</strong>
      </p>

      {/* Tabla usuarios */}
      <table className="w-full bg-white shadow-lg rounded-lg overflow-hidden">
        <thead className="bg-blue-700 text-white">
          <tr>
            <th className="p-3 text-left">ID</th>
            <th className="p-3 text-left">Nombre</th>
            <th className="p-3 text-left">Correo</th>
            <th className="p-3 text-left">Rol</th>
            <th className="p-3 text-left">Acciones</th>
          </tr>
        </thead>

        <tbody>
          {usuarios.map((u) => (
            <tr key={u.usuario_id} className="border-b">
              <td className="p-3">{u.usuario_id}</td>
              <td className="p-3">
                {u.nombre} {u.apellido}
              </td>
              <td className="p-3">{u.email}</td>
              <td className="p-3">{u.rol}</td>
              <td className="p-3">
                <button
                  onClick={() => openModal(u)}
                  className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-800 transition"
                >
                  Editar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Lista de cursos */}
      <h2 className="text-xl font-semibold mt-10 mb-3">Cursos disponibles</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {cursos.map((c) => (
          <div key={c.curso_id} className="p-4 bg-gray-100 rounded shadow">
            <p className="font-bold">{c.nombre}</p>
            <p className="text-sm text-gray-600">Código: {c.codigo}</p>
          </div>
        ))}
      </div>

      {/* MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h3 className="text-xl font-semibold mb-4">Editar Usuario</h3>

            <div className="space-y-3">
              <input
                type="text"
                name="nombre"
                value={editForm.nombre}
                onChange={handleEditChange}
                className="w-full p-2 border rounded"
              />
              <input
                type="text"
                name="apellido"
                value={editForm.apellido}
                onChange={handleEditChange}
                className="w-full p-2 border rounded"
              />
              <input
                type="email"
                name="email"
                value={editForm.email}
                onChange={handleEditChange}
                className="w-full p-2 border rounded"
              />
              <input
                type="tel"
                name="telefono"
                value={editForm.telefono}
                onChange={handleEditChange}
                className="w-full p-2 border rounded"
              />
              <select
                name="rol"
                value={editForm.rol}
                onChange={handleEditChange}
                className="w-full p-2 border rounded"
              >
                <option value="ADMIN">ADMIN</option>
                <option value="DOCENTE">DOCENTE</option>
                <option value="ESTUDIANTE">ESTUDIANTE</option>
              </select>
            </div>

            <div className="flex justify-end mt-5 gap-3">
              <button
                onClick={closeModal}
                className="px-4 py-2 bg-gray-400 text-white rounded"
              >
                Cancelar
              </button>

              <button
                onClick={actualizarUsuario}
                className="px-4 py-2 bg-blue-700 text-white rounded hover:bg-blue-900"
              >
                Guardar cambios
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
