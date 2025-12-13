import React, { useEffect, useState, useContext } from "react";
import { ArrowLeft, Search, X, User } from "lucide-react";
import { AuthContext } from "../../context/AuthContext";

export default function GradePublish() {
  const { user } = useContext(AuthContext);
  const docenteId = user?.usuario_id;

  const [secciones, setSecciones] = useState([]);
  const [seccionSeleccionada, setSeccionSeleccionada] = useState("");
  const [estudiantes, setEstudiantes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [grade, setGrade] = useState("");
  const [loading, setLoading] = useState(true);

  /* =========================
     CARGAR SECCIONES DOCENTE
  ========================== */
  useEffect(() => {
    if (!docenteId) return;

    const fetchSecciones = async () => {
      try {
        const res = await fetch(
          "https://servidor-proyecto-final-itla.vercel.app/api/secciones"
        );
        const data = await res.json();

        const propias = data.filter(
          (s) => Number(s.docente_id) === Number(docenteId)
        );

        setSecciones(propias);
      } catch (error) {
        console.error("Error cargando secciones", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSecciones();
  }, [docenteId]);

  /* =========================
     CARGAR ESTUDIANTES
  ========================== */
  const cargarEstudiantes = async (seccionId) => {
    const seccion = secciones.find((s) => s.seccion_id === Number(seccionId));
    if (!seccion) return;

    try {
      const res = await fetch(
        `https://servidor-proyecto-final-itla.vercel.app/api/inscripcion/curso/${seccion.curso_id}`
      );
      const data = await res.json();

      const filtrados = data.filter(
        (e) => Number(e.seccion_id) === Number(seccionId)
      );

      setEstudiantes(filtrados);
      setSelectedStudent(null);
      setSearchTerm("");
    } catch (error) {
      console.error("Error cargando estudiantes", error);
    }
  };

  /* =========================
     FILTRO BUSCADOR
  ========================== */
  const estudiantesFiltrados = estudiantes.filter((e) =>
    `${e.nombre_estudiante} ${e.apellido_estudiante}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  /* =========================
     PUBLICAR NOTA (CORREGIDO)
  ========================== */
  const handlePublicar = async () => {
    if (!selectedStudent) return alert("Selecciona un estudiante");

    const notaActual = Number(selectedStudent.nota_final || 0);
    const nuevaNota = Number(grade);

    if (isNaN(nuevaNota) || nuevaNota <= 0) {
      return alert("Ingresa una nota válida");
    }

    if (notaActual >= 100) {
      return alert("Este estudiante ya tiene el 100%");
    }

    if (notaActual + nuevaNota > 100) {
      return alert(`Solo puedes agregar ${100 - notaActual}%`);
    }

    const notaFinal = Number((notaActual + nuevaNota).toFixed(2));

    try {
      const res = await fetch(
        `https://servidor-proyecto-final-itla.vercel.app/api/inscripcion/${selectedStudent.inscripcion_id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            estado: selectedStudent.estado,
            nota_final: notaFinal,
          }),
        }
      );

      if (!res.ok) {
        throw new Error("Error al actualizar nota");
      }

      /* 🔥 ACTUALIZAR ESTADO LOCAL */
      setEstudiantes((prev) =>
        prev.map((e) =>
          e.inscripcion_id === selectedStudent.inscripcion_id
            ? { ...e, nota_final: notaFinal }
            : e
        )
      );

      alert("Nota publicada correctamente ✅");
      setGrade("");
      setSelectedStudent(null);
    } catch (error) {
      console.error(error);
      alert("Error al publicar nota");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Cargando...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* REGRESAR */}
      <button
        onClick={() => window.history.back()}
        className="flex items-center gap-2 mb-6 text-gray-700 hover:text-blue-900"
      >
        <ArrowLeft /> regresar
      </button>

      <div className="max-w-2xl mx-auto bg-white p-6 rounded-xl shadow">
        <h1 className="text-2xl font-bold text-center mb-4">
          Publicar Calificaciones
        </h1>

        {/* DOCENTE */}
        <div className="flex items-center gap-3 bg-blue-50 border border-blue-100 p-4 rounded-lg mb-6">
          <div className="w-10 h-10 bg-blue-900 text-white flex items-center justify-center rounded-lg">
            <User />
          </div>
          <div>
            <p className="text-sm text-gray-600">Docente</p>
            <p className="font-semibold text-gray-800">
              {user?.nombre} {user?.apellido}
            </p>
          </div>
        </div>

        {/* SECCIONES */}
        <select
          value={seccionSeleccionada}
          onChange={(e) => {
            setSeccionSeleccionada(e.target.value);
            cargarEstudiantes(e.target.value);
          }}
          className="w-full mb-4 px-4 py-3 border rounded-lg"
        >
          <option value="">Selecciona una sección</option>
          {secciones.map((s) => (
            <option key={s.seccion_id} value={s.seccion_id}>
              {s.curso_nombre}
            </option>
          ))}
        </select>

        {/* BUSCADOR */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar estudiante..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 py-3 border rounded-lg"
          />
        </div>

        {/* LISTA */}
        {!selectedStudent &&
          estudiantesFiltrados.map((e) => (
            <div
              key={e.inscripcion_id}
              onClick={() => setSelectedStudent(e)}
              className="p-3 border rounded-lg mb-2 cursor-pointer hover:bg-gray-50"
            >
              {e.nombre_estudiante} {e.apellido_estudiante}
            </div>
          ))}

        {/* ESTUDIANTE */}
        {selectedStudent && (
          <div className="bg-gray-100 p-4 rounded-lg mb-4 flex justify-between">
            <div>
              <strong>
                {selectedStudent.nombre_estudiante}{" "}
                {selectedStudent.apellido_estudiante}
              </strong>
              <p className="text-sm text-gray-600">
                Nota actual: {selectedStudent.nota_final || 0}% — Disponible:{" "}
                {100 - Number(selectedStudent.nota_final || 0)}%
              </p>
            </div>
            <button onClick={() => setSelectedStudent(null)}>
              <X />
            </button>
          </div>
        )}

        {/* NOTA */}
        <input
          type="number"
          placeholder="Monto a agregar (%)"
          value={grade}
          onChange={(e) => setGrade(e.target.value)}
          className="w-full mb-4 px-4 py-3 border rounded-lg text-center text-lg"
        />

        <button
          onClick={handlePublicar}
          className="w-full bg-blue-900 text-white py-3 rounded-lg hover:bg-blue-800 transition"
        >
          Publicar nota
        </button>
      </div>
    </div>
  );
}
