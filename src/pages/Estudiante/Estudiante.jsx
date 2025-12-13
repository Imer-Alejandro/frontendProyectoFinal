import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

export default function Estudiante() {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [inscripciones, setInscripciones] = useState([]);
  const [recomendados, setRecomendados] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.usuario_id) return;

    const fetchData = async () => {
      try {
        const resIns = await fetch(
          `https://servidor-proyecto-final-itla.vercel.app/api/inscripcion/estudiante/${user.usuario_id}`
        );
        const dataIns = await resIns.json();
        setInscripciones(dataIns);

        const resCursos = await fetch(
          "https://servidor-proyecto-final-itla.vercel.app/api/cursos"
        );
        const cursos = await resCursos.json();

        const cursosInscritos = dataIns.map((i) => i.nombre_curso);

        const recomendadosFiltrados = cursos
          .filter(
            (c) =>
              c.estado === "programado" && !cursosInscritos.includes(c.nombre)
          )
          .slice(0, 3);

        setRecomendados(recomendadosFiltrados);
      } catch (error) {
        console.error("Error dashboard estudiante", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Cargando información...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* HEADER */}
      <header className="bg-white shadow p-4 flex justify-between items-center">
        <button
          onClick={() => navigate("/cursosList")}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Ver cursos disponibles
        </button>

        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 px-4 py-2 w-[220px] bg-gray-200 rounded"
          >
            <div className="bg-teal-500 text-white w-10 h-10 flex items-center justify-center rounded-full font-bold text-sm">
              {`${user?.nombre?.charAt(0)}${user?.apellido?.charAt(0)}`}
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
                  localStorage.clear();
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

      <main className="max-w-6xl mx-auto p-6 space-y-12">
        {/* 📘 CURSOS EN CURSO – SLIDER */}
        <section>
          <h2 className="text-xl font-bold mb-4">📘 Cursos en curso</h2>

          {inscripciones.length === 0 ? (
            <p className="text-gray-500 text-sm">
              Aún no estás inscrito en ningún curso.
            </p>
          ) : (
            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-blue-500">
              {inscripciones.map((i) => (
                <div
                  key={i.inscripcion_id}
                  className="min-w-[280px] bg-white rounded-xl shadow-md p-5 border hover:shadow-lg transition"
                >
                  <h3 className="font-semibold text-lg text-gray-800">
                    {i.nombre_curso}
                  </h3>

                  <p className="text-xs text-gray-500 mt-1">
                    Inscrito el{" "}
                    <strong>
                      {new Date(i.fecha_inscripcion).toLocaleDateString()}
                    </strong>
                  </p>

                  <p className="text-sm text-gray-600 mt-2">
                    Sección:{" "}
                    <span className="font-medium capitalize">
                      {i.estado_seccion}
                    </span>
                  </p>

                  {/* PROGRESO */}
                  <div className="mt-4">
                    <p className="text-sm font-medium mb-1">
                      Progreso: {i.nota_final}%
                    </p>

                    <div className="w-full bg-gray-200 h-3 rounded-full overflow-hidden">
                      <div
                        className="h-3 bg-linear-to-r from-blue-500 to-blue-700 rounded-full transition-all"
                        style={{ width: `${i.nota_final}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* ⭐ CURSOS RECOMENDADOS */}
        <section>
          <h2 className="text-xl font-bold mb-4">⭐ Cursos recomendados</h2>

          {recomendados.length === 0 ? (
            <p className="text-gray-500 text-sm">
              No hay cursos recomendados por ahora.
            </p>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {recomendados.map((curso) => (
                <div
                  key={curso.curso_id}
                  className="bg-white p-5 rounded-xl shadow hover:shadow-lg transition cursor-pointer border"
                  onClick={() => navigate(`/DetalleCursos/${curso.curso_id}`)}
                >
                  <h3 className="font-semibold text-lg">{curso.nombre}</h3>

                  <p className="text-xs text-gray-600 mt-1 line-clamp-3">
                    {curso.descripcion}
                  </p>

                  <p className="text-blue-600 mt-3 font-bold text-sm">
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
