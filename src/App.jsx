import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";

// ✅ LOGIN
import Login from "./pages/Login/Login2.jsx";

// ✅ ADMIN
import Admin from "./pages/Admin/Admin.jsx";
import RegistrarEstudiante from "./pages/Admin/RegistrarEstudiante.jsx";
import RegistrarDocente from "./pages/Admin/RegistrarDocente.jsx";
import RegistrarAdmin from "./pages/Admin/RegistrarAdmin.jsx";
import RegistrarCurso from "./pages/Admin/RegistrarCurso.jsx";
import RegistrarSeccion from "./pages/Admin/RegistrarSeccion.jsx";
import Configuracion from "./pages/Admin/ConfiguracionAdmin.jsx";

// ✅ ESTUDIANTE
import Estudiante from "./pages/Estudiante/Estudiante.jsx";
import PerfilEstudiante from "./pages/Estudiante/PerfilEstudiante.jsx";
import CursoDetails from "./pages/Detallescurso/CursoDetails.jsx";
import Pay from "./pages/Pagos/Pay.jsx";
import EstudianteEST from "./pages/Estudiante/EstadisticasEST.jsx";
import Cursos from "./pages/Detallescurso/CursosList.jsx";

// ✅ DOCENTE
import Docente from "./pages/Docentes/DashboarDocente.jsx";
import Notas from "./pages/Docentes/PublicarNotas.jsx";
import PerfilDocente from "./pages/Docentes/PerfilDocente.jsx";

// ✅ COMPONENTE DE PROTECCIÓN
import ProtectedRoute from "./components/ProtectedRoute.jsx";

function App() {
  const location = useLocation();

  return (
    <div className="bg-white min-h-screen overflow-auto">
      <AnimatePresence mode="wait">
        {/* ✅ Mueve la animación a un motion.div y NO al Routes directamente */}
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <Routes location={location}>
            {/* LOGIN */}
            <Route path="/" element={<Login />} />

            {/* ADMIN */}
            <Route path="/admin" element={<Admin />} />
            <Route
              path="/registrar-estudiante"
              element={<RegistrarEstudiante />}
            />
            <Route path="/registrar-docente" element={<RegistrarDocente />} />
            <Route path="/registrar-admin" element={<RegistrarAdmin />} />
            <Route path="/registrar-curso" element={<RegistrarCurso />} />
            <Route path="/registrar-seccion" element={<RegistrarSeccion />} />
            <Route path="/ConfiguracionAdmin" element={<Configuracion />} />

            {/* ESTUDIANTE */}
            <Route path="/estudiante" element={<Estudiante />} />
            <Route path="/PerfilEstudiante" element={<PerfilEstudiante />} />
            <Route path="/DetalleCursos/:id" element={<CursoDetails />} />
            <Route path="/Pagos" element={<Pay />} />
            <Route path="/EstudianteEST" element={<EstudianteEST />} />
            <Route path="/cursosList" element={<Cursos />} />

            {/* DOCENTE */}

            <Route path="/PerfilDocente/:id" element={<PerfilDocente />} />
            <Route path="/docente/:id" element={<Docente />} />
            <Route path="/notas/:id" element={<Notas />} />

            {/* 🚫 RUTA POR DEFECTO */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export default App;
