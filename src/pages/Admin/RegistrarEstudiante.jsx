import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function RegistrarEstudiante() {
  const navigate = useNavigate();

  // Estados del formulario
  const [form, setForm] = useState({
    nombre: "",
    apellido: "",
    telefono: "",
    email: "",
    matricula: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Controlar inputs
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Enviar formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch(
        "https://servidor-proyecto-final-itla.vercel.app/api/usuarios/registro",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...form,
            rol: "ESTUDIANTE", // 👈 Rol asignado automáticamente
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Ocurrió un error");

      alert("Estudiante registrado correctamente");
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
      <button
        onClick={() => navigate(-1)}
        className="absolute top-6 left-6 text-blue-200 hover:text-white transition text-sm font-medium"
      >
        ← Volver
      </button>

      {/* Lado Izquierdo */}
      <div className="w-full lg:w-1/2 bg-blue-700 flex flex-col justify-center items-center p-8 lg:p-16 relative">
        <div className="w-full max-w-md">
          {/* Título */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white">ERP Académico</h1>
            <p className="text-blue-200 text-sm">Registro de Estudiante</p>
          </div>

          {/* Mostrar errores */}
          {error && (
            <p className="bg-red-500 text-white px-4 py-2 rounded mb-3 text-center">
              {error}
            </p>
          )}

          {/* Formulario */}
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                name="nombre"
                placeholder="Nombre"
                value={form.nombre}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-blue-600 text-white placeholder-blue-300 border border-blue-500 rounded-md focus:ring-2 focus:ring-white"
              />

              <input
                type="text"
                name="apellido"
                placeholder="Apellido"
                value={form.apellido}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-blue-600 text-white placeholder-blue-300 border border-blue-500 rounded-md focus:ring-2 focus:ring-white"
              />
            </div>

            <input
              type="tel"
              name="telefono"
              placeholder="Teléfono"
              value={form.telefono}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-blue-600 text-white placeholder-blue-300 border border-blue-500 rounded-md focus:ring-2 focus:ring-white"
            />

            <input
              type="email"
              name="email"
              placeholder="Correo institucional"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-blue-600 text-white placeholder-blue-300 border border-blue-500 rounded-md focus:ring-2 focus:ring-white"
            />

            <input
              type="text"
              name="matricula"
              placeholder="Matrícula"
              value={form.matricula}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-blue-600 text-white placeholder-blue-300 border border-blue-500 rounded-md focus:ring-2 focus:ring-white"
            />

            <input
              type="password"
              name="password"
              placeholder="Contraseña temporal"
              value={form.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-blue-600 text-white placeholder-blue-300 border border-blue-500 rounded-md focus:ring-2 focus:ring-white"
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-blue-800 hover:bg-blue-900 text-white font-semibold rounded-md transition duration-200"
            >
              {loading ? "Registrando..." : "Registrar estudiante"}
            </button>
          </form>

          {/* Ya tienes cuenta */}
          <p className="text-center text-blue-200 text-sm mt-6">
            ¿Ya tienes una cuenta?{" "}
            <a
              href="/login"
              className="text-white underline hover:text-blue-300"
            >
              Inicia sesión aquí
            </a>
          </p>
        </div>
      </div>

      {/* Lado derecho */}
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
