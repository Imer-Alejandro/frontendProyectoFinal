/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

export default function Pago() {
  const { user } = useContext(AuthContext);

  const [inscripciones, setInscripciones] = useState([]);
  const [cursos, setCursos] = useState([]);
  const [pagos, setPagos] = useState([]);
  const [cursoSeleccionado, setCursoSeleccionado] = useState(null);

  // tarjeta (simulación)
  const [tarjeta, setTarjeta] = useState({
    numero: "",
    nombre: "",
    mes: "",
    year: "",
    cvv: "",
  });

  const [monto, setMonto] = useState("");
  const [enviando, setEnviando] = useState(false);

  /* =========================
     CARGA INICIAL
  ========================== */
  useEffect(() => {
    if (!user?.usuario_id) return;

    const fetchData = async () => {
      try {
        // Inscripciones
        const resIns = await fetch(
          `https://servidor-proyecto-final-itla.vercel.app/api/inscripcion/estudiante/${user.usuario_id}`
        );
        const dataIns = await resIns.json();
        setInscripciones(dataIns);
        if (dataIns.length > 0) setCursoSeleccionado(dataIns[0]);

        // Cursos
        const resCursos = await fetch(
          "https://servidor-proyecto-final-itla.vercel.app/api/cursos"
        );
        setCursos(await resCursos.json());

        // Pagos
        const resPagos = await fetch(
          `https://servidor-proyecto-final-itla.vercel.app/api/pago/estudiante/${user.usuario_id}`
        );
        const dataPagos = await resPagos.json();
        setPagos(dataPagos.data || []);
      } catch (err) {
        console.error("Error cargando datos", err);
      }
    };

    fetchData();
  }, [user]);

  /* =========================
     UTILIDAD
  ========================== */
  const getCostoCurso = (nombreCurso) => {
    const curso = cursos.find((c) => c.nombre === nombreCurso);
    return curso ? Number(curso.costo_total) : 0;
  };

  /* =========================
     CÁLCULOS
  ========================== */
  const totalCursos = inscripciones.reduce(
    (acc, i) => acc + getCostoCurso(i.nombre_curso),
    0
  );

  const totalPagado = pagos.reduce((acc, p) => acc + Number(p.monto || 0), 0);

  const deudaGeneral = Math.max(totalCursos - totalPagado, 0);

  const descuento = tarjeta.numero ? deudaGeneral * 0.1 : 0;
  const deudaFinal = deudaGeneral - descuento;

  /* =========================
     REGISTRAR PAGO
  ========================== */
  const handlePago = async (e) => {
    e.preventDefault();

    const montoNum = Number(monto);
    if (isNaN(montoNum) || montoNum <= 0) return alert("Monto inválido");

    if (montoNum > deudaFinal) return alert("El monto excede la deuda");

    try {
      setEnviando(true);

      const res = await fetch(
        "https://servidor-proyecto-final-itla.vercel.app/api/pago",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            inscripcion_id: cursoSeleccionado.inscripcion_id,
            monto: montoNum,
            metodo: "Tarjeta",
            referencia: tarjeta.numero.slice(-4),
            registrado_por: user.usuario_id,
            estado: "Pendiente",
          }),
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      setPagos((prev) => [data.data, ...prev]);
      setMonto("");
      alert("✅ Pago simulado correctamente");
    } catch (err) {
      alert(err.message);
    } finally {
      setEnviando(false);
    }
  };

  if (inscripciones.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        No tienes cursos inscritos
      </div>
    );
  }

  return (
    <div className="bg-gray-50 p-4 md:p-8 min-h-screen">
      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-lg">
        {/* HEADER */}
        <div className="relative rounded-t-2xl">
          <button
            onClick={() => window.history.back()}
            className="absolute top-4 left-4 bg-white/80 px-4 py-2 rounded-lg shadow text-sm"
          >
            ← Regresar
          </button>
          <div className="h-32 bg-linear-to-r from-blue-500 to-indigo-600"></div>
        </div>

        <div className="p-6 md:p-8 lg:flex lg:gap-8">
          {/* IZQUIERDA */}
          <div className="lg:w-1/2 space-y-6">
            <h2 className="text-2xl font-bold">
              {user.nombre} {user.apellido}
            </h2>

            <div>
              <label className="font-semibold">Curso a pagar</label>
              <select
                className="w-full mt-1 px-4 py-2 border rounded"
                value={cursoSeleccionado?.inscripcion_id}
                onChange={(e) =>
                  setCursoSeleccionado(
                    inscripciones.find(
                      (i) => i.inscripcion_id === Number(e.target.value)
                    )
                  )
                }
              >
                {inscripciones.map((i) => (
                  <option key={i.inscripcion_id} value={i.inscripcion_id}>
                    {i.nombre_curso} — RD$
                    {getCostoCurso(i.nombre_curso).toLocaleString()}
                  </option>
                ))}
              </select>
            </div>

            <p>
              <strong>Deuda total:</strong>{" "}
              <span className="text-red-600 font-bold">
                RD$ {deudaFinal.toLocaleString()}
              </span>
            </p>

            {descuento > 0 && (
              <p className="text-green-600 font-medium">
                🎉 Descuento aplicado: RD$ {descuento.toLocaleString()}
              </p>
            )}

            {/* HISTORIAL */}
            <div>
              <h4 className="font-bold mb-2">Historial de pagos</h4>
              {pagos.length === 0 ? (
                <p className="text-sm text-gray-500">
                  No hay pagos registrados
                </p>
              ) : (
                <ul className="space-y-2">
                  {pagos.map((p) => (
                    <li
                      key={p.pago_id}
                      className="bg-green-50 px-4 py-2 rounded border"
                    >
                      RD$ {Number(p.monto).toLocaleString()} —{" "}
                      {new Date(
                        p.fecha_pago || p.created_at || Date.now()
                      ).toLocaleString()}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* DERECHA */}
          <div className="lg:w-1/2 mt-8 lg:mt-0">
            <h3 className="text-2xl font-bold mb-6">Datos de la tarjeta</h3>

            <form onSubmit={handlePago} className="space-y-4">
              <input
                placeholder="Número de tarjeta"
                className="w-full px-4 py-3 bg-gray-100 border rounded"
                onChange={(e) =>
                  setTarjeta({ ...tarjeta, numero: e.target.value })
                }
              />

              <input
                placeholder="Nombre en la tarjeta"
                className="w-full px-4 py-3 bg-gray-100 border rounded"
                onChange={(e) =>
                  setTarjeta({ ...tarjeta, nombre: e.target.value })
                }
              />

              <div className="flex gap-2">
                <input
                  placeholder="MM"
                  className="w-1/3 px-4 py-3 bg-gray-100 border rounded"
                  onChange={(e) =>
                    setTarjeta({ ...tarjeta, mes: e.target.value })
                  }
                />
                <input
                  placeholder="YY"
                  className="w-1/3 px-4 py-3 bg-gray-100 border rounded"
                  onChange={(e) =>
                    setTarjeta({ ...tarjeta, year: e.target.value })
                  }
                />
                <input
                  placeholder="CVV"
                  className="w-1/3 px-4 py-3 bg-gray-100 border rounded"
                  onChange={(e) =>
                    setTarjeta({ ...tarjeta, cvv: e.target.value })
                  }
                />
              </div>

              <input
                type="number"
                placeholder="Monto a abonar"
                value={monto}
                onChange={(e) => setMonto(e.target.value)}
                className="w-full px-4 py-3 bg-gray-100 border rounded"
              />

              <button
                disabled={enviando}
                className="w-full bg-linear-to-r from-blue-600 to-indigo-600 text-white py-4 rounded-lg font-bold"
              >
                {enviando ? "Procesando..." : "Realizar abono"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
