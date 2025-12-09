import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

export default function Estudiante() {
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { user } = useContext(AuthContext);

  const [cursoActual, setCursoActual] = useState(null);
  const [recomendados, setRecomendados] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 📌 Si el estudiante está inscrito en un curso cargar info
        if (user?.curso_actual_id) {
          const res = await fetch(
            `https://servidor-proyecto-final-itla.vercel.app/api/cursos/${user.curso_actual_id}`
          );
          setCursoActual(await res.json());
        }

        // ⭐ Cursos programados para recomendar
        const res2 = await fetch(
          "https://servidor-proyecto-final-itla.vercel.app/api/cursos"
        );
        const cursos = await res2.json();
        setRecomendados(cursos.filter((c) => c.estado === "programado"));
      } catch (err) {
        console.error("❌ Error cargando datos dashboard", err);
      }
    };

    fetchData();
  }, [user]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow p-4 flex justify-between items-center">
        <button
          onClick={() => navigate("/cursosList")}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Ver cursos disponibles
        </button>

        <div className="relative ">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex cursor-pointer items-center gap-2 px-4 py-2 w-[200px] bg-gray-200 rounded"
          >
            <div className="bg-teal-500 text-white w-10 h-10 flex items-center justify-center rounded-full font-bold text-sm">
              {`${user?.nombre?.charAt(0) || ""}${
                user?.apellido?.charAt(0) || ""
              }`.toUpperCase()}
            </div>
            {user?.nombre} {user?.apellido}
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 bg-white shadow border rounded mt-2">
              <button
                onClick={() => navigate("/PerfilEstudiante")}
                className="px-4 py-2 block hover:bg-gray-100 w-full text-left"
              >
                Perfil
              </button>
              <button
                onClick={() => navigate("/Pagos")}
                className="px-4 py-2 block hover:bg-gray-100 w-full text-left"
              >
                Pagos
              </button>
              <button
                onClick={() => {
                  localStorage.removeItem("role");
                  navigate("/");
                }}
                className="px-4 py-2 block hover:bg-gray-100 w-full text-left text-red-600"
              >
                Cerrar sesión
              </button>
            </div>
          )}
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-6 space-y-10">
        {/* Curso actual */}
        <section className="bg-white p-6 rounded shadow">
          <h2 className="text-xl font-bold mb-4">📘 Tu curso actual</h2>

          {!cursoActual ? (
            <p className="text-gray-500 text-sm">
              No estás inscrito en ningún curso actualmente.
            </p>
          ) : (
            <div>
              <h3 className="font-semibold text-lg">{cursoActual.nombre}</h3>
              <p className="text-gray-600 mt-1 text-sm">
                {cursoActual.descripcion}
              </p>

              <div className="mt-3 text-sm">
                <p>
                  <strong>Inicio:</strong>{" "}
                  {new Date(cursoActual.fecha_inicio).toLocaleDateString()}
                </p>
                <p>
                  <strong>Fin:</strong>{" "}
                  {new Date(cursoActual.fecha_fin).toLocaleDateString()}
                </p>
              </div>
            </div>
          )}
        </section>

        {/* Recordatorios */}
        {cursoActual && (
          <section className="bg-blue-700 text-white p-6 rounded shadow">
            <h2 className="text-xl font-bold mb-2">🔔 Recordatorios</h2>
            <p className="text-sm">
              Límite de inscripción:{" "}
              <strong>
                {new Date(
                  cursoActual.fecha_limite_inscripcion
                ).toLocaleDateString()}
              </strong>
            </p>
            <p className="text-sm mt-1">
              Asegúrate de completar tu curso antes del{" "}
              <strong>
                {new Date(cursoActual.fecha_fin).toLocaleDateString()}
              </strong>
            </p>
          </section>
        )}

        {/* Cursos recomendados */}
        <section>
          <h2 className="text-xl font-bold mb-4">
            ⭐ Cursos recomendados para ti
          </h2>

          {recomendados.length === 0 ? (
            <p className="text-gray-500 text-sm">
              No hay cursos disponibles ahora.
            </p>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {recomendados.map((curso) => (
                <div
                  key={curso.curso_id}
                  className="bg-white p-4 rounded shadow hover:shadow-lg transition cursor-pointer"
                  onClick={() => navigate(`/DetalleCursos/${curso.curso_id}`)}
                >
                  <h3 className="font-semibold text-lg">{curso.nombre}</h3>
                  <p className="text-xs text-gray-600 mt-1 line-clamp-3">
                    {curso.descripcion}
                  </p>
                  <p className="text-blue-600 mt-2 font-bold text-sm">
                    RD$ {parseFloat(curso.costo_total).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
