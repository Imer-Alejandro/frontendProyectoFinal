import React, { useEffect, useState } from "react";
import {
  Mail,
  Calendar,
  Building2,
  GraduationCap,
  IdCard,
  Circle,
  ArrowLeft,
  User,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

export default function PerfilDocente() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [docente, setDocente] = useState(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const fetchDocente = async () => {
      try {
        const res = await axios.get(
          `https://servidor-proyecto-final-itla.vercel.app/api/docente/${id}`
        );
        setDocente(res.data.data);
      } catch (error) {
        console.error("Error al cargar docente", error);
      } finally {
        setCargando(false);
      }
    };

    fetchDocente();
  }, [id]);

  if (cargando) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Cargando perfil del docente...
      </div>
    );
  }

  if (!docente) return null;

  const nombreCompleto = `${docente.nombre} ${docente.apellido}`;
  const isActivo = docente.estado === "activo";

  return (
    <div className="min-h-screen bg-linear-to-r from-slate-50 to-slate-100 p-6 md:p-8">
      {/* Botón regresar */}
      <div className="fixed top-6 left-6 z-50">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-3 px-4 py-2 bg-white rounded-xl shadow-md hover:shadow-lg transition"
        >
          <ArrowLeft className="w-5 h-5 text-indigo-600" />
          <span className="font-medium">Regresar</span>
        </button>
      </div>

      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="bg-linear-to-r from-blue-600 to-indigo-700 h-36" />

          <div className="relative px-8 pb-8">
            <div className="flex flex-col md:flex-row items-center md:items-end -mt-20 gap-6">
              {/* Avatar */}
              <div className="relative">
                <div className="w-32 h-32 bg-white rounded-full p-2 shadow-xl">
                  <div className="w-full h-full rounded-full bg-indigo-600 flex items-center justify-center text-white text-4xl font-bold">
                    {docente.nombre[0]}
                    {docente.apellido[0]}
                  </div>
                </div>

                <span
                  className={`absolute -bottom-2 right-0 px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-2
                  ${
                    isActivo
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  <Circle
                    className={`w-3 h-3 ${
                      isActivo
                        ? "fill-emerald-500 text-emerald-500"
                        : "fill-red-500 text-red-500"
                    }`}
                  />
                  {docente.estado}
                </span>
              </div>

              {/* Nombre */}
              <div className="text-center pb-2 md:text-left">
                <h1 className="text-3xl  font-bold text-gray-900">
                  {nombreCompleto}
                </h1>
                <p className="text-gray-600 mt-1 flex items-center gap-2 justify-center md:justify-start">
                  <GraduationCap className="w-5 h-5 text-indigo-600" />
                  {docente.especialidad || "Especialidad no registrada"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Información */}
        <div className="mt-8 bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-3">
            <IdCard className="w-6 h-6 text-indigo-600" />
            Información del Docente
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InfoItem
              icon={<User />}
              label="Nombre completo"
              value={nombreCompleto}
            />

            <InfoItem
              icon={<Mail />}
              label="Correo electrónico"
              value={docente.email}
            />

            <InfoItem
              icon={<GraduationCap />}
              label="Título académico"
              value={docente.titulo_academico || "No registrado"}
            />

            <InfoItem
              icon={<Building2 />}
              label="Especialidad"
              value={docente.especialidad || "No asignada"}
            />

            <InfoItem
              icon={<Calendar />}
              label="Estado"
              value={docente.estado}
              highlight
              activo={isActivo}
            />
          </div>
        </div>

        <div className="mt-6 text-center text-sm text-gray-500">
          Perfil del docente • Sistema académico
        </div>
      </div>
    </div>
  );
}

/* ---------------- COMPONENTE INFO ---------------- */

function InfoItem({ icon, label, value, highlight = false, activo = false }) {
  return (
    <div
      className={`flex items-start gap-4 p-4 rounded-xl
      ${
        highlight
          ? "bg-indigo-50 border border-indigo-200"
          : "bg-gray-50 hover:bg-gray-100"
      }`}
    >
      <div
        className={`p-3 rounded-lg ${
          highlight
            ? activo
              ? "bg-emerald-600 text-white"
              : "bg-red-600 text-white"
            : "bg-white shadow text-gray-600"
        }`}
      >
        {icon}
      </div>
      <div>
        <p className="text-sm text-gray-600 font-medium">{label}</p>
        <p className="text-base font-semibold text-gray-900 mt-1">{value}</p>
      </div>
    </div>
  );
}
