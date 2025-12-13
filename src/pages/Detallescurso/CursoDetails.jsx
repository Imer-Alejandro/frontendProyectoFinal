import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

export default function CursoDetails() {
  const { id } = useParams();
  const [curso, setCurso] = useState(null);
  const [maestros, setMaestros] = useState([]);
  const [inscripciones, setInscripciones] = useState([]);
  const [cargando, setCargando] = useState(true);

  const { user } = useContext(AuthContext);

  // Modal y loading
  const [mostrarModal, setMostrarModal] = useState(false);
  const [enviando, setEnviando] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resCurso = await fetch(
          `https://servidor-proyecto-final-itla.vercel.app/api/cursos/${id}`
        );
        const dataCurso = await resCurso.json();
        setCurso(dataCurso);

        const resSec = await fetch(
          "https://servidor-proyecto-final-itla.vercel.app/api/secciones"
        );
        const dataSec = await resSec.json();
        setMaestros(dataSec.filter((s) => Number(s.curso_id) === Number(id)));

        // 🔒 Inscripciones del estudiante (VALIDACIÓN)
        const resIns = await fetch(
          `https://servidor-proyecto-final-itla.vercel.app/api/inscripcion/estudiante/${user.usuario_id}`
        );
        const dataIns = await resIns.json();
        setInscripciones(dataIns);
      } catch (error) {
        console.error("Error al cargar datos:", error);
      } finally {
        setCargando(false);
      }
    };

    fetchData();
  }, [id, user.usuario_id]);

  // ✅ VALIDACIÓN: ya inscrito en este curso
  const yaInscritoEnCurso = inscripciones.some(
    (i) => Number(i.curso_id) === Number(id)
  );

  // ✅ INSCRIPCIÓN
  const inscribirEstudiante = async (seccion_id) => {
    if (yaInscritoEnCurso) {
      alert("❌ Ya estás inscrito en este curso");
      return;
    }

    try {
      setEnviando(true);
      const res = await fetch(
        "https://servidor-proyecto-final-itla.vercel.app/api/inscripcion",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            estudiante_id: user.usuario_id,
            seccion_id,
          }),
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      alert("¡Inscripción completada con éxito! 🎉");
      setMostrarModal(false);
    } catch (err) {
      alert("Error al inscribir: " + err.message);
    } finally {
      setEnviando(false);
    }
  };

  if (cargando)
    return (
      <div className="min-h-screen flex items-center justify-center text-xl">
        Cargando información...
      </div>
    );

  if (!curso) return <p>Error: No se encontró el curso.</p>;

  return (
    <div className="font-sans bg-gray-100 text-gray-800 min-h-screen">
      {/* Header */}
      <header className="flex justify-between items-center bg-white px-5 py-3 shadow-sm">
        <button
          onClick={() => window.history.back()}
          className="flex items-center gap-2 text-gray-700 hover:text-[#24324a] font-medium text-sm transition-colors"
        >
          ← Regresar
        </button>

        <button className="bg-[#24324a] text-white font-bold px-4 py-2 rounded-md">
          {`${user?.nombre?.charAt(0) || ""}${
            user?.apellido?.charAt(0) || ""
          }`.toUpperCase()}
        </button>
      </header>

      {/* Contenido */}
      <main className="flex justify-between p-8 gap-8">
        {/* Información del curso */}
        <section className="flex-2 bg-white rounded-lg p-6 shadow-sm">
          <div className="bg-[#24324a] text-white p-8 rounded-lg mb-6">
            <h1 className="text-2xl font-bold mb-1">{curso.nombre}</h1>
            <p className="text-sm opacity-80">
              Sesiones disponibles - {maestros.length}
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mt-6 mb-3">Detalles</h3>
            <p className="text-sm leading-relaxed text-gray-700">
              {curso.descripcion}
            </p>

            <h3 className="text-lg font-semibold mt-6 mb-3">Requisitos</h3>
            <p className="text-sm text-gray-700">{curso.requisitos}</p>

            <h3 className="text-lg font-semibold mt-6 mb-3">
              Fechas importantes
            </h3>
            <p className="text-sm">
              <strong>Inicio:</strong>{" "}
              <span className="text-[#276ef1] font-medium">
                {curso.fecha_inicio
                  ? new Date(curso.fecha_inicio).toLocaleDateString()
                  : "No definido"}
              </span>
            </p>
            <p className="text-sm">
              <strong>Término:</strong>{" "}
              <span className="text-[#276ef1] font-medium">
                {curso.fecha_fin
                  ? new Date(curso.fecha_fin).toLocaleDateString()
                  : "No definido"}
              </span>
            </p>
          </div>
        </section>

        {/* Sidebar */}
        <aside className="flex-1 space-y-6">
          <div className="bg-[#24324a] text-white p-6 rounded-lg text-center shadow-md">
            <p className="text-lg">
              Costo:{" "}
              <span className="text-[#5fa8f6] text-2xl font-bold">
                {curso.costo_total
                  ? parseFloat(curso.costo_total).toLocaleString()
                  : "N/A"}
              </span>
            </p>

            <button
              disabled={maestros.length === 0 || yaInscritoEnCurso}
              onClick={() => setMostrarModal(true)}
              className={`font-bold py-2 px-6 rounded-md mt-4 w-full transition
                ${
                  yaInscritoEnCurso || maestros.length === 0
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-[#3b67d8] hover:bg-blue-700 text-white"
                }`}
            >
              {yaInscritoEnCurso
                ? "Ya estás inscrito"
                : maestros.length === 0
                ? "Sin secciones disponibles"
                : "Inscribirse"}
            </button>

            <p className="text-xs opacity-80 mt-3">
              Límite inscripción:{" "}
              {curso.fecha_limite_inscripcion
                ? new Date(curso.fecha_limite_inscripcion).toLocaleDateString()
                : "No definido"}
            </p>
          </div>
        </aside>
      </main>

      {/* MODAL */}
      {mostrarModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
          <div className="bg-white w-96 rounded-lg p-6 shadow-xl">
            <h2 className="text-xl font-bold text-center text-[#24324a] mb-4">
              Selecciona una sección
            </h2>

            <div className="space-y-3">
              {maestros.map((sec) => (
                <button
                  key={sec.seccion_id}
                  disabled={enviando}
                  onClick={() => inscribirEstudiante(sec.seccion_id)}
                  className="w-full p-3 border rounded-lg text-left hover:border-[#24324a] transition"
                >
                  <p className="font-medium text-sm">
                    {sec.docente_nombre} {sec.docente_apellido}
                  </p>
                  <p className="text-xs text-gray-600 mt-1">
                    Cupo: {sec.inscritos}/{sec.capacidad_maxima}
                  </p>
                </button>
              ))}
            </div>

            <button
              onClick={() => setMostrarModal(false)}
              className="w-full bg-gray-500 text-white py-2 rounded-md mt-4"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
