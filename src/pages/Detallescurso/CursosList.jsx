import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

const API = "https://servidor-proyecto-final-itla.vercel.app/api";

export default function VerCursos() {
  const navigate = useNavigate();
  const [cursos, setCursos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busqueda, setBusqueda] = useState("");
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchCursos = async () => {
      try {
        const res = await fetch(`${API}/cursos`);
        const data = await res.json();
        setCursos(data);
      } catch (err) {
        alert("Error cargando cursos");
      }
      setLoading(false);
    };

    fetchCursos();
  }, []);

  // 🔍 Filtro de búsqueda (ahora más robusto)
  const cursosFiltrados = cursos.filter((curso) => {
    const texto = busqueda.toLowerCase();
    const nombre = curso.nombre?.toLowerCase() || "";
    const descripcion = curso.descripcion?.toLowerCase() || "";
    return nombre.includes(texto) || descripcion.includes(texto);
  });

  if (loading) {
    return (
      <p className="text-center mt-10 text-gray-700 text-lg">
        Cargando cursos...
      </p>
    );
  }

  return (
    <div className="font-sans bg-gray-100 text-gray-800 min-h-screen">
      {/* HEADER */}
      <header className="flex justify-between items-center bg-white px-5 py-3 shadow-sm">
        {/* Regresar */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-700 hover:text-[#24324a] font-medium text-sm transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Regresar
        </button>

        {/* Buscador */}
        <input
          type="text"
          placeholder="Buscar cursos..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="w-80 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#24324a]"
        />

        {/* Logo */}
        <button className="bg-[#24324a] text-white font-bold px-4 py-2 rounded-md">
          {`${user?.nombre?.charAt(0) || ""}${
            user?.apellido?.charAt(0) || ""
          }`.toUpperCase()}
        </button>
      </header>

      {/* GRID */}
      <main className="p-8 flex justify-center">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-7xl">
          {cursosFiltrados.length === 0 ? (
            <p className="text-center text-gray-600 text-sm col-span-full">
              No se encontraron cursos.
            </p>
          ) : (
            cursosFiltrados.map((curso) => {
              const inicio = new Date(curso.fecha_inicio).toLocaleDateString(
                "es-ES",
                { day: "numeric", month: "long", year: "numeric" }
              );

              return (
                <div
                  key={curso.curso_id}
                  className="bg-white rounded-xl p-6 shadow-sm hover:shadow-xl hover:scale-[1.02] transition-transform cursor-pointer border border-gray-100"
                >
                  <span className="text-xs bg-[#24324a] text-white px-3 py-1 rounded-full uppercase">
                    {curso.estado}
                  </span>

                  <h2 className="text-xl font-bold mt-3 text-[#24324a]">
                    {curso.nombre}
                  </h2>

                  <p className="text-sm text-gray-600 mt-2 line-clamp-3">
                    {curso.descripcion || "Sin descripción disponible..."}
                  </p>

                  <div className="mt-4 text-sm">
                    <p className="text-gray-700">
                      <strong className="text-[#24324a]">Costo:</strong> RD${" "}
                      {curso.costo_total}
                    </p>
                    <p className="text-gray-700">
                      <strong className="text-[#24324a]">Inicio:</strong>{" "}
                      {inicio}
                    </p>
                  </div>

                  <button
                    onClick={() => navigate(`/DetalleCursos/${curso.curso_id}`)}
                    className="mt-5 bg-[#24324a] w-full text-white py-2 rounded-md font-medium hover:bg-[#1a2537] transition"
                  >
                    Ver detalles
                  </button>
                </div>
              );
            })
          )}
        </div>
      </main>
    </div>
  );
}
