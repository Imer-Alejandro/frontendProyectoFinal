import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const API = "https://servidor-proyecto-final-itla.vercel.app/api";

export default function RegistrarSeccion() {
  const navigate = useNavigate();

  // Estado del formulario
  const [form, setForm] = useState({
    curso_id: "",
    docente_id: "",
    capacidad_maxima: "",
  });

  const [cursos, setCursos] = useState([]);
  const [docentes, setDocentes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Cargar cursos y docentes
  useEffect(() => {
    const fetchData = async () => {
      try {
        const resCursos = await fetch(`${API}/cursos`);
        const dataCursos = await resCursos.json();
        setCursos(dataCursos);

        const resUsuarios = await fetch(`${API}/usuarios`);
        const dataUsuarios = await resUsuarios.json();

        setDocentes(
          dataUsuarios.filter((u) => u.rol?.toUpperCase() === "DOCENTE")
        );
      } catch {
        setError("Error cargando cursos o docentes");
      }
    };

    fetchData();
  }, []);

  // Manejo de inputs
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Enviar formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${API}/secciones`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          curso_id: Number(form.curso_id),
          docente_id: Number(form.docente_id),
          capacidad_maxima: Number(form.capacidad_maxima),
          estado: "abierta",
        }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Error al registrar sección");

      alert("Sección registrada correctamente");
      navigate(-1);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Botón Volver */}

      {/* Lado Izquierdo */}
      <div className="w-full lg:w-1/2 bg-blue-700 flex flex-col justify-center items-center p-8 lg:p-16 relative">
        <button
          onClick={() => navigate(-1)}
          className="absolute top-6 left-6 text-blue-200 hover:text-white transition text-sm font-medium"
        >
          ← Volver
        </button>
        <div className="w-full max-w-md">
          {/* Título */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white">ERP Académico</h1>
            <p className="text-blue-200 text-sm">Registro de Sección</p>
          </div>

          {/* Error */}
          {error && (
            <p className="bg-red-500 text-white px-4 py-2 rounded mb-3 text-center">
              {error}
            </p>
          )}

          {/* Formulario */}
          <form className="space-y-4" onSubmit={handleSubmit}>
            <select
              name="curso_id"
              value={form.curso_id}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-blue-600 text-white border border-blue-500 rounded-md focus:ring-2 focus:ring-white"
            >
              <option value="">Seleccione un curso</option>
              {cursos.map((c) => (
                <option key={c.curso_id} value={c.curso_id}>
                  {c.nombre}
                </option>
              ))}
            </select>

            <select
              name="docente_id"
              value={form.docente_id}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-blue-600 text-white border border-blue-500 rounded-md focus:ring-2 focus:ring-white"
            >
              <option value="">Seleccione un docente</option>
              {docentes.map((d) => (
                <option key={d.usuario_id} value={d.usuario_id}>
                  {d.nombre} {d.apellido}
                </option>
              ))}
            </select>

            <input
              type="number"
              name="capacidad_maxima"
              placeholder="Capacidad máxima"
              value={form.capacidad_maxima}
              onChange={handleChange}
              min="1"
              required
              className="w-full px-4 py-3 bg-blue-600 text-white placeholder-blue-300 border border-blue-500 rounded-md focus:ring-2 focus:ring-white"
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-blue-800 hover:bg-blue-900 text-white font-semibold rounded-md transition duration-200"
            >
              {loading ? "Registrando..." : "Registrar sección"}
            </button>
          </form>
        </div>
      </div>

      {/* Lado derecho (MISMA IMAGEN) */}
      <div
        className="hidden lg:block w-1/2 bg-cover bg-center"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&w=1740&q=80')`,
        }}
      >
        <div className="h-full bg-linear-to-t from-blue-900 via-transparent to-transparent opacity-60"></div>
      </div>
    </div>
  );
}
