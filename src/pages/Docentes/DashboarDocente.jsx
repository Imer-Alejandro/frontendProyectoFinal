import React, { useEffect, useState, useContext } from "react";
import { Users, Calendar, Filter, ChevronDown, BookOpen } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

export default function AdminDashboard() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const docenteId = user?.usuario_id;

  const [docente, setDocente] = useState(null);
  const [secciones, setSecciones] = useState([]);
  const [estudiantesPorSeccion, setEstudiantesPorSeccion] = useState({});
  const [viewMode, setViewMode] = useState("secciones"); // 👈 CLAVE
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  /* =========================
     CARGA DE DATOS REALES
  ========================== */
  useEffect(() => {
    if (!docenteId) return;

    const fetchData = async () => {
      try {
        // 1. Docente
        const docenteRes = await fetch(
          `https://servidor-proyecto-final-itla.vercel.app/api/docente/${docenteId}`
        );
        const docenteData = await docenteRes.json();
        setDocente(docenteData.data);

        // 2. Todas las secciones
        const seccionesRes = await fetch(
          `https://servidor-proyecto-final-itla.vercel.app/api/secciones`
        );
        const allSecciones = await seccionesRes.json();

        // 3. Filtrar secciones del docente
        const seccionesDocente = allSecciones.filter(
          (s) => s.docente_id === docenteId
        );
        setSecciones(seccionesDocente);

        // 4. Cursos únicos
        const cursosUnicos = [
          ...new Set(seccionesDocente.map((s) => s.curso_id)),
        ];

        // 5. Inscripciones por curso
        let inscripciones = [];
        for (const cursoId of cursosUnicos) {
          const res = await fetch(
            `https://servidor-proyecto-final-itla.vercel.app/api/inscripcion/curso/${cursoId}`
          );
          const data = await res.json();
          inscripciones = inscripciones.concat(data || []);
        }

        // 6. Agrupar estudiantes por sección
        const agrupado = {};
        inscripciones.forEach((i) => {
          if (!agrupado[i.seccion_id]) {
            agrupado[i.seccion_id] = [];
          }
          agrupado[i.seccion_id].push(i);
        });

        setEstudiantesPorSeccion(agrupado);
      } catch (error) {
        console.error("Error cargando dashboard docente", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [docenteId]);

  /* =========================
     MÉTRICAS
  ========================== */
  const totalSecciones = secciones.length;

  const totalEstudiantes = Object.values(estudiantesPorSeccion).reduce(
    (acc, arr) => acc + arr.length,
    0
  );

  /* =========================
     LISTA PLANA DE ESTUDIANTES
  ========================== */
  const estudiantesFlat = Object.entries(estudiantesPorSeccion).flatMap(
    ([seccionId, estudiantes]) =>
      estudiantes.map((e) => ({
        ...e,
        seccion_id: Number(seccionId),
        curso_nombre:
          secciones.find((s) => s.seccion_id === Number(seccionId))
            ?.curso_nombre || "N/A",
      }))
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        Cargando dashboard del docente...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
      {/* HEADER */}
      <header className="mb-8 flex justify-end">
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 bg-white px-4 py-3 rounded-lg shadow-sm"
          >
            <div className="w-8 h-8 bg-blue-900 text-white rounded-full flex items-center justify-center text-sm font-bold">
              {`${docente?.nombre?.[0] || ""}${docente?.apellido?.[0] || ""}`}
            </div>
            <span className="font-medium text-gray-700">{docente?.nombre}</span>
            <ChevronDown className="w-4 h-4 text-gray-500" />
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border z-50">
              <button
                className="w-full px-4 py-2 text-left hover:bg-gray-100"
                onClick={() => navigate("/PerfilDocente")}
              >
                Perfil
              </button>
              <button
                className="w-full px-4 py-2 text-left hover:bg-gray-100"
                onClick={() => navigate("/notas")}
              >
                Publicar notas
              </button>
              <button
                className="w-full px-4 py-2 text-left hover:bg-gray-100 text-red-600"
                onClick={() => {
                  localStorage.clear();
                  navigate("/");
                }}
              >
                Cerrar sesión
              </button>
            </div>
          )}
        </div>
      </header>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <div className="bg-linear-to-r from-blue-500 to-blue-600 text-white p-6 rounded-2xl shadow-lg flex justify-between">
          <div>
            <h3 className="text-lg font-semibold">Estudiantes</h3>
            <p className="text-3xl font-bold">{totalEstudiantes}</p>
            <p className="text-sm opacity-90">Asignados a tus secciones</p>
          </div>
          <Users className="w-12 h-12 opacity-80" />
        </div>

        <div className="bg-linear-to-r from-emerald-500 to-teal-600 text-white p-6 rounded-2xl shadow-lg flex justify-between">
          <div>
            <h3 className="text-lg font-semibold">Secciones</h3>
            <p className="text-3xl font-bold">{totalSecciones}</p>
            <p className="text-sm opacity-90">Asignadas al docente</p>
          </div>
          <Calendar className="w-10 h-10 opacity-80" />
        </div>
      </div>

      {/* TABLA */}
      <section className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="p-6 border-b flex justify-between items-center">
          <h2 className="text-xl font-bold">
            {viewMode === "secciones"
              ? "Secciones Asignadas"
              : "Estudiantes Inscritos"}
          </h2>

          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-500" />
            <select
              value={viewMode}
              onChange={(e) => setViewMode(e.target.value)}
              className="px-4 py-2 border rounded-lg text-sm"
            >
              <option value="secciones">Ver Secciones</option>
              <option value="estudiantes">Ver Estudiantes</option>
            </select>
          </div>
        </div>

        {/* TABLA SECCIONES */}
        {viewMode === "secciones" && (
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                {[
                  "Curso",
                  "Capacidad",
                  "Estudiantes",
                  "Estado",
                  "Acciones",
                ].map((h) => (
                  <th
                    key={h}
                    className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y">
              {secciones.map((s) => (
                <tr key={s.seccion_id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-gray-500" />
                    {s.curso_nombre}
                  </td>
                  <td className="px-6 py-4">{s.capacidad_maxima}</td>
                  <td className="px-6 py-4 font-semibold">
                    {estudiantesPorSeccion[s.seccion_id]?.length || 0}
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      {s.estado}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => navigate(`/notas`)}
                      className="w-10 h-10 bg-blue-600 text-white rounded-full hover:bg-blue-700"
                    >
                      +
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* TABLA ESTUDIANTES */}
        {viewMode === "estudiantes" && (
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                {["Estudiante", "Curso", "Sección", "Estado", "Nota Final"].map(
                  (h) => (
                    <th
                      key={h}
                      className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase"
                    >
                      {h}
                    </th>
                  )
                )}
              </tr>
            </thead>

            <tbody className="divide-y">
              {estudiantesFlat.map((e) => (
                <tr key={e.inscripcion_id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium">
                    {e.nombre_estudiante} {e.apellido_estudiante}
                  </td>
                  <td className="px-6 py-4">{e.curso_nombre}</td>
                  <td className="px-6 py-4">#{e.seccion_id}</td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                      {e.estado}
                    </span>
                  </td>
                  <td className="px-6 py-4">{e.nota_final}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
}
