import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const API = "https://servidor-proyecto-final-itla.vercel.app/api";

export default function RegistrarSeccion() {
  const navigate = useNavigate();

  const [cursos, setCursos] = useState([]);
  const [docentes, setDocentes] = useState([]);
  const [cursoId, setCursoId] = useState("");
  const [docenteId, setDocenteId] = useState("");
  const [capacidad, setCapacidad] = useState("");
  const [loading, setLoading] = useState(true);
  const [enviando, setEnviando] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resCursos = await fetch(`${API}/cursos`);
        const dataCursos = await resCursos.json();
        setCursos(dataCursos);

        const resUsers = await fetch(`${API}/usuarios`);
        const dataUsers = await resUsers.json();
        setDocentes(
          dataUsers.filter((u) => u.rol?.toUpperCase() === "DOCENTE")
        );
      } catch (error) {
        alert("Error cargando información");
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  const registrarSeccion = async () => {
    if (!cursoId || !docenteId || !capacidad) {
      alert("Debe completar todos los campos");
      return;
    }
    console.log("📌 Usuarios cargados:", cursoId);
    console.log("👨‍🏫 Docentes filtrados:", docenteId);

    setEnviando(true);

    try {
      const resp = await fetch(`${API}/secciones`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          curso_id: Number(cursoId),
          docente_id: Number(docenteId),
          capacidad_maxima: Number(capacidad),
          estado: "abierta",
        }),
      });

      const result = await resp.json();
      if (!resp.ok) {
        alert(result.error || "Error registrando sección");
      } else {
        alert("Sección registrada correctamente");
        navigate(-1);
      }
    } catch (err) {
      alert("Fallo al conectar con el servidor");
    }

    setEnviando(false);
  };

  if (loading)
    return <p className="text-center mt-10 text-white">Cargando...</p>;

  return (
    <div className="min-h-screen flex">
      {/* Panel izquierdo - Formulario */}
      <div className="w-full lg:w-1/2 bg-blue-700 flex flex-col justify-center items-center p-8 lg:p-16">
        <h1 className="text-white text-3xl font-semibold mb-14">
          Registrar Sección
        </h1>

        <select
          name="curso"
          className="w-full p-3 rounded mb-4 text-black"
          value={cursoId}
          onChange={(e) => setCursoId(e.target.value)}
        >
          <option value="">Seleccione un curso</option>
          {cursos.map((c) => (
            <option key={c.curso_id} value={c.curso_id}>
              {c.nombre}
            </option>
          ))}
        </select>

        <select
          name="docente"
          className="w-full p-3 rounded mb-4 text-black"
          value={docenteId}
          onChange={(e) => setDocenteId(e.target.value)}
        >
          <option value="">Seleccione un docente</option>
          {docentes.map((d) => (
            <option key={d.usuario_id} value={d.usuario_id}>
              {d.nombre} {d.apellido}
            </option>
          ))}
        </select>

        <input
          name="capacidad"
          type="number"
          className="w-full p-3 rounded mb-6 text-black"
          placeholder="Capacidad máxima"
          value={capacidad}
          onChange={(e) => setCapacidad(e.target.value)}
          min="1"
        />

        <button
          disabled={enviando || !cursoId || !docenteId || !capacidad}
          onClick={registrarSeccion}
          className={`${
            enviando || !cursoId || !docenteId || !capacidad
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-white hover:bg-gray-200"
          } text-blue-700 font-semibold px-8 py-3 rounded transition w-full`}
        >
          {enviando ? "Guardando..." : "Registrar"}
        </button>
      </div>

      {/* Panel derecho con imagen */}
      <div className="hidden lg:flex lg:w-1/2 w-full bg-white items-center justify-center">
        <img
          src="https://afsformacion.com/wp-content/uploads/2023/01/cursos-online-consejos.jpg"
          className="w-[80%]"
          alt="side-img"
        />
      </div>
    </div>
  );
}
