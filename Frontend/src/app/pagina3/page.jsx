"use client";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/navbar";
import axios from "axios";

const MAPAS_BASE_API = process.env.NEXT_PUBLIC_VERSION_MAPA_API;
const SOFA_BASE_API = process.env.NEXT_PUBLIC_SOFA_DB_URI;
const RESERVA_BASE_API = process.env.NEXT_PUBLIC_RESERVA_DB_URI;

export default function Home() {
  const { data: session, status } = useSession();
  const [sofas, setSofas] = useState([]);
  const [reservas, setReservas] = useState({});
  const [direccionFiltro, setDireccionFiltro] = useState("");
  const [loading, setLoading] = useState(false);
  const [iframeUrl, setIframeUrl] = useState("");

  if (status === "loading") {
    return <p>Cargando...</p>;
  }

  useEffect(() => {
    if (direccionFiltro) {
      fetchSofas(direccionFiltro);
    }
  }, [direccionFiltro]);

  useEffect(() => {
    if (sofas.length > 0) {
      const coordenadas = sofas.map((sofa) => ({
        lat: sofa.coordenadas.latitud,
        lon: sofa.coordenadas.longitud,
      }));
      fetchMapWithMarkers(coordenadas);
    }
  }, [sofas]);

  const fetchSofas = async (direccion) => {
    setLoading(true);
    try {
      const response = await axios.get(`${SOFA_BASE_API}/buscar?direccion=${direccion}`, {
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
          "Content-Type": "application/json",
        },
      });
      setSofas(response.data);
      response.data.forEach((sofa) => {
        fetchReservas(sofa.anfitrion);
      });
    } catch (error) {
      console.error("Error al obtener los sofás:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMapWithMarkers = async (coordenadas) => {
    try {
      const response = await axios.post(`${MAPAS_BASE_API}/mapa`, { coordenadas });
      setIframeUrl(response.data.iframeUrl);
    } catch (error) {
      console.error("Error al generar el iframe del mapa:", error);
    }
  };

  const fetchReservas = async (anfitrion) => {
    try {
      const response = await axios.get(`${RESERVA_BASE_API}/${anfitrion}`, {
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
          "Content-Type": "application/json",
        },
      });
      setReservas((prevReservas) => ({
        ...prevReservas,
        [anfitrion]: response.data,
      }));
    } catch (error) {
      console.error('Error al obtener las reservas para ${anfitrion}:', error);
    }
  };

  const generateSmallMapUrl = (lat, lon) => {
    return '${MAPAS_BASE_API}/small-map?lat=${lat}&lon=${lon}';
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Navbar />
      <main className="flex flex-1 p-4">
        <div className="left-section flex-1 flex flex-col bg-gradient-to-r from-green-200 to-blue-200 rounded-3xl p-8 shadow-lg">
          <div className="flex flex-col justify-center items-center text-center">
            <h1 className="text-5xl font-bold text-blue-800 mb-4 font-poppins">
              Filtrar Alojamientos
            </h1>
            <p className="text-xl text-gray-700 italic font-poppins">
              Busca alojamientos por dirección y consulta sus reservas.
            </p>
            <div className="mt-8 flex space-x-4 text-2xl">
              <input
                type="text"
                value={direccionFiltro}
                onChange={(e) => setDireccionFiltro(e.target.value)}
                placeholder="Filtrar por dirección"
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg"
              />
            </div>
          </div>

          <div className="mt-8 flex justify-center">
            {iframeUrl ? (
              <iframe
                src={iframeUrl}
                width="100%"
                height="400"
                frameBorder="0"
                className="rounded-lg shadow-md"
                allowFullScreen=""
              ></iframe>
            ) : (
              <p className="text-xl text-gray-600">El mapa se generará aquí.</p>
            )}
          </div>
        </div>

        <div className="right-section flex-1 bg-white rounded-3xl p-8 shadow-lg flex flex-col justify-center items-center text-center">
          <h2 className="text-3xl text-gray-600 font-semibold mb-6">Sofás Encontrados</h2>
          {loading ? (
            <p>Cargando sofás...</p>
          ) : (
            <div className="space-y-6 text-gray-600">
              {sofas.length === 0 ? (
                <p>No se encontraron sofás para esa dirección.</p>
              ) : (
                sofas.map((sofa) => (
                  <div
                    key={sofa._id}
                    className="bg-gray-200 text-gray-600 p-4 rounded-lg shadow-md"
                  >
                    <h3 className="text-2xl font-bold">{sofa.direccion}</h3>
                    <p>Host: {sofa.anfitrion}</p>
                    <p>Coordenadas: {sofa.coordenadas.latitud}, {sofa.coordenadas.longitud}</p>

                    <div className="mt-4">
                      <h4 className="text-xl font-medium">Fotos:</h4>
                      <div className="flex space-x-4">
                        {sofa.fotos.map((foto, index) => (
                          <img
                            key={index}
                            src={foto.url}
                            alt={`Foto ${index + 1}`}
                            className="w-32 h-32 object-cover rounded-lg"
                          />
                        ))}
                      </div>
                    </div>

                    <div className="mt-4">
                      <iframe
                        src={generateSmallMapUrl(
                          sofa.coordenadas.latitud,
                          sofa.coordenadas.longitud
                        )}
                        width="100%"
                        height="200"
                        frameBorder="0"
                        className="rounded-lg shadow-md"
                        allowFullScreen=""
                      ></iframe>
                    </div>

                    <div className="mt-6">
                      {reservas[sofa.anfitrion] && reservas[sofa.anfitrion].length > 0 ? (
                        <div className="mt-4 space-y-4">
                          {reservas[sofa.anfitrion].map((reserva, index) => (
                            <div
                              key={index}
                              className="bg-blue-100 p-4 rounded-lg shadow-md"
                            >
                              <p>Huésped: {reserva.huesped}</p>
                              <p>
                                Desde: {new Date(reserva.desde).toLocaleDateString()}
                              </p>
                              <p>Días: {reserva.dias}</p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="mt-4 text-xl font-semibold text-gray-600">
                          Sin reservas
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
