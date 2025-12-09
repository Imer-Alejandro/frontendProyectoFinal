import React from "react";
import { ArrowLeft, User, ClipboardList, FileText } from "lucide-react";

export default function CourseView() {
  // Función para regresar
  const handleRegresar = () => {
    window.history.back();
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
      {/* Back Button - FUNCIONAL */}
      <button
        onClick={() => window.history.back()}
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

      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Header */}
            <div className="flex items-start gap-4">
              <div className="bg-linear-to-br from-blue-900 to-blue-800 text-white w-16 h-16 rounded-xl flex items-center justify-center font-bold text-lg shadow-lg">
                NU
              </div>
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-gray-900">
                  Nombre curso - #2 (numero de sección)
                </h1>
                <div className="mt-4 space-y-4">
                  <div>
                    <p className="text-sm font-semibold text-gray-700">
                      Detalles
                    </p>
                    <p className="text-sm text-gray-600 mt-1 leading-relaxed">
                      Este curso informaciones Este es un curso que busca que el
                      estudiante consiga aprender todos los fundamentos y lógica
                      detrás de la programación orientada a objeto aplicando en
                      la práctica la teorías correspondientes para concretar el
                      conocimiento adquirido en proyectos durante todo el curso
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-700">
                      Cantidad de estudiantes:{" "}
                      <span className="font-bold text-blue-600">56</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Fechas Importantes */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h3 className="text-lg font-bold text-gray-800 mb-4">
                Fechas importantes
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Inicio:</span>
                  <span className="font-medium text-gray-900">
                    14 de noviembre del 2025
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Termino:</span>
                  <span className="font-medium text-red-600">
                    14 de enero del 2026
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Criterio de Evaluación */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-800">
                  Criterio de evaluación
                </h3>
                <User className="w-6 h-6 text-gray-500" />
              </div>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Examenes</span>
                  <span className="font-semibold text-gray-900">15</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Practica</span>
                  <span className="font-semibold text-gray-900">45</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Foros</span>
                  <span className="font-semibold text-gray-900">20</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Investigacion</span>
                  <span className="font-semibold text-gray-900">20</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button className="w-full bg-linear-to-r from-blue-900 to-blue-800 text-white py-3 rounded-lg font-medium flex items-center justify-center gap-2 hover:from-blue-800 hover:to-blue-700 transition shadow-md">
                <ClipboardList className="w-5 h-5" />
                pasar lista
              </button>
              <button className="w-full border border-gray-300 text-gray-700 py-3 rounded-lg font-medium flex items-center justify-center gap-2 hover:bg-gray-50 transition">
                <FileText className="w-5 h-5" />
                publicar notas
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
