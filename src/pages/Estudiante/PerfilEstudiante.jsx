/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function PerfilEstudiante() {
  const { user, login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [openModal, setOpenModal] = useState(false);

  const [formData, setFormData] = useState({
    nombre: user?.nombre || "",
    apellido: user?.apellido || "",
    telefono: user?.telefono || "",
    email: user?.email || "",
  });

  const handleRegresar = () => window.history.back();
  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const guardarCambios = async () => {
    try {
      await axios.put(
        `https://servidor-proyecto-final-itla.vercel.app/api/usuarios/${user.usuario_id}`,
        formData
      );

      login({ ...user, ...formData });
      setOpenModal(false);
      alert("Datos actualizados correctamente");
    } catch (error) {
      alert("Error al actualizar los datos");
      console.error(error);
    }
  };

  return (
    <div className="p-6 font-sans text-gray-800">
      {/* Header */}
      <div className="flex items-center mb-6">
        <button
          onClick={handleRegresar}
          className="text-gray-600 text-sm cursor-pointer mr-3 hover:text-blue-600 transition flex items-center gap-1"
        >
          ← Regresar
        </button>
        <div className="bg-blue-900 h-[70px] flex-1 rounded-md border-2 border-blue-400"></div>
      </div>

      {/* Content */}
      <div className="flex gap-10 mt-5">
        {/* Información del estudiante */}
        <div className="flex-1 bg-white p-5 rounded shadow">
          <div className="bg-blue-900 text-white w-16 h-16 rounded-lg flex items-center justify-center font-bold text-lg mb-4 uppercase">
            {user?.nombre?.slice(0, 2) || "U"}
          </div>

          <h2 className="text-xl font-semibold mb-1 capitalize">
            {user?.nombre} {user?.apellido}
          </h2>
          <p className="text-sm text-gray-600 mb-2">{user?.rol}</p>

          <p className="text-sm mb-1">📧 {user?.email}</p>
          <p className="text-sm mb-3">📱 {user?.telefono || "No registrado"}</p>

          <p className="text-sm text-gray-700 font-medium">
            Matrícula:{" "}
            <span className="font-semibold">
              {user?.matricula || "No asignada"}
            </span>
          </p>

          <button
            onClick={() => setOpenModal(true)}
            className="bg-blue-600 text-white py-2 px-6 rounded mt-4 hover:bg-blue-700 transition"
          >
            Editar perfil
          </button>
        </div>

        {/* Curso Actual */}
        <div className="flex-1 bg-white p-5 rounded shadow">
          <h3 className="text-lg font-semibold mb-4">Curso en curso</h3>

          {user?.curso_actual_id ? (
            <div className="bg-gray-100 p-3 rounded-md flex justify-between items-center">
              <div>
                <p className="font-medium text-sm">
                  Curso #{user.curso_actual_id}
                </p>
                <button
                  onClick={() =>
                    navigate(`/DetalleCursos/${user.curso_actual_id}`)
                  }
                  className="text-blue-600 text-xs underline mt-1"
                >
                  Ver detalle del curso
                </button>
              </div>

              <div className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                En curso
              </div>
            </div>
          ) : (
            <div className="bg-yellow-100 text-yellow-800 p-3 rounded text-sm font-medium">
              📌 No tienes curso asignado actualmente
            </div>
          )}
        </div>
      </div>

      {/* Modal de edición */}
      {openModal && (
        <>
          <div
            className="fixed inset-0 bg-black bg-opacity-40"
            onClick={() => setOpenModal(false)}
          />

          <div className="fixed top-1/2 left-1/2 w-80 -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg p-5 shadow-lg z-50">
            <h3 className="text-lg font-semibold mb-3">Editar perfil</h3>

            <input
              name="nombre"
              placeholder="Nombre"
              value={formData.nombre}
              onChange={handleChange}
              className="border w-full p-2 rounded mb-2 text-sm"
            />

            <input
              name="apellido"
              placeholder="Apellido"
              value={formData.apellido}
              onChange={handleChange}
              className="border w-full p-2 rounded mb-2 text-sm"
            />

            <input
              name="email"
              placeholder="Correo"
              value={formData.email}
              onChange={handleChange}
              className="border w-full p-2 rounded mb-2 text-sm"
            />

            <input
              name="telefono"
              placeholder="Teléfono"
              value={formData.telefono}
              onChange={handleChange}
              className="border w-full p-2 rounded mb-4 text-sm"
            />

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setOpenModal(false)}
                className="text-gray-700 px-3 py-1 text-sm"
              >
                Cancelar
              </button>
              <button
                onClick={guardarCambios}
                className="bg-blue-600 text-white px-3 py-1 text-sm rounded hover:bg-blue-700"
              >
                Guardar
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
