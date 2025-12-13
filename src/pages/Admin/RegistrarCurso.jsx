import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function RegistrarCurso() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nombre: "",
    descripcion: "",
    costo_total: "",
    requisitos: "",
    fecha_inicio: "",
    fecha_fin: "",
    fecha_limite_inscripcion: "",
    estado: "programado",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Manejar cambios de input
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // Enviar formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch(
        "https://servidor-proyecto-final-itla.vercel.app/api/cursos",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Error al registrar el curso.");
        setLoading(false);
        return;
      }

      // Registro exitoso
      alert("Curso registrado correctamente");
      navigate(-1);
    } catch (err) {
      setError("Error de conexión con el servidor.");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex">
      {/* Lado Izquierdo - Formulario */}
      <div className="w-full lg:w-1/2 bg-blue-700 flex flex-col justify-center items-center p-8 lg:p-16">
        <button
          onClick={() => navigate(-1)}
          className="absolute top-6 left-6 text-blue-200 hover:text-white transition text-sm font-medium"
        >
          ← Volver
        </button>

        <div className="w-full max-w-md">
          {/* Logo y título */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="bg-white p-3 rounded-lg shadow-lg">
                <svg
                  className="w-12 h-12 text-blue-700"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 14l9-5-9-5-9 5 9 5z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 14v7m-3-3h6"
                  />
                </svg>
              </div>
            </div>
            <h1 className="text-3xl font-bold text-white">ERP Académico</h1>
            <p className="text-blue-200 text-sm">Registro de Curso</p>
          </div>

          {/* Formulario */}
          <form className="space-y-4" onSubmit={handleSubmit}>
            <input
              name="nombre"
              type="text"
              placeholder="Nombre del curso"
              value={form.nombre}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-blue-600 text-white placeholder-blue-300 border border-blue-500 rounded-md focus:outline-none focus:ring-2 focus:ring-white"
            />

            <textarea
              name="descripcion"
              placeholder="Descripción del curso"
              value={form.descripcion}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-blue-600 text-white placeholder-blue-300 border border-blue-500 rounded-md h-24 resize-none focus:outline-none focus:ring-2 focus:ring-white"
            />

            <input
              name="costo_total"
              type="number"
              placeholder="Costo del curso"
              value={form.costo_total}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-blue-600 text-white placeholder-blue-300 border border-blue-500 rounded-md focus:outline-none focus:ring-2 focus:ring-white"
            />

            <input
              name="requisitos"
              type="text"
              placeholder="Requisitos"
              value={form.requisitos}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-blue-600 text-white placeholder-blue-300 border border-blue-500 rounded-md focus:outline-none focus:ring-2 focus:ring-white"
            />
            <span className="text-amber-50">Fecha de inicio</span>
            <input
              name="fecha_inicio"
              type="date"
              value={form.fecha_inicio}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-blue-600 text-white border border-blue-500 rounded-md focus:outline-none focus:ring-2 focus:ring-white"
            />

            <span className="text-amber-50">Fecha de termino</span>
            <input
              name="fecha_fin"
              type="date"
              value={form.fecha_fin}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-blue-600 text-white border border-blue-500 rounded-md focus:outline-none focus:ring-2 focus:ring-white"
            />

            {/* Campo extra: fecha límite de inscripción */}
            <span className="text-amber-50">Fecha limite inscripcion</span>
            <input
              name="fecha_limite_inscripcion"
              type="date"
              value={form.fecha_limite_inscripcion}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-blue-600 text-white border border-blue-500 rounded-md focus:outline-none focus:ring-2 focus:ring-white"
            />

            {error && (
              <p className="text-red-300 text-sm text-center">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-blue-800 hover:bg-blue-900 text-white font-semibold rounded-md transition duration-200 disabled:bg-blue-500"
            >
              {loading ? "Registrando..." : "Registrar curso"}
            </button>
          </form>
        </div>
      </div>

      {/* Lado Derecho - Imagen */}
      <div
        className="hidden lg:block w-1/2 bg-cover bg-center"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1553877522-43269d4ea984?ixlib=rb-4.0.3&auto=format&fit=crop&w=1740&q=80')`,
        }}
      >
        <div className="h-full bg-linear-to-t from-blue-900 via-transparent to-transparent opacity-60"></div>
      </div>
    </div>
  );
}
