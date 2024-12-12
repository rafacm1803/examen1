"use client";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/navbar";
import { Button as Button1, TextField, CircularProgress } from "@mui/material";
import axios from "axios";

const SOFA_BASE_API = process.env.NEXT_PUBLIC_SOFA_DB_URI;
const RESERVA_BASE_API = process.env.NEXT_PUBLIC_RESERVA_DB_URI;

export default function FiltrarPorCoordenadas() {
  const { data: session } = useSession();
  const [latitud, setLatitud] = useState("");
  const [longitud, setLongitud] = useState("");
  const [sofas, setSofas] = useState([]);
  const [reservas, setReservas] = useState({});
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState("");

  const handleBuscar = () => {
    if (!latitud || !longitud) {
      alert("Por favor, ingresa latitud y longitud.");
      return;
    }

    setIsSearching(true);
    setError(""); // Reiniciar errores
    setSofas([]); // Reiniciar resultados previos
    setReservas({}); // Reiniciar reservas previas
  };

  // Fetch sofas by coordinates
  const fetchSofas = async () => {
    setIsSearching(true);
    try {
      const response = await axios.get(`${SOFA_BASE_API}/buscar-coordenadas?latitud=${latitud}&longitud=${longitud}`, {
        headers: {
          "Authorization": `Bearer ${session.accessToken}`,
          "Content-Type": "application/json",
        },
      });
      setSofas(response.data);

      // Fetch reservas for each sofa
      response.data.forEach((sofa) => {
        fetchReservas(sofa.anfitrion);
      });
    } catch (error) {
      console.error("Error al obtener los sofás:", error);
      setError("Ocurrió un error al obtener los sofás.");
    } finally {
      setIsSearching(false);
    }
  };

  // Fetch reservas for each host
  const fetchReservas = async (anfitrion) => {
    try {
      const response = await axios.get(`${RESERVA_BASE_API}/${anfitrion}`, {
        headers: {
          "Authorization": `Bearer ${session.accessToken}`,
          "Content-Type": "application/json",
        },
      });
      setReservas((prevReservas) => ({
        ...prevReservas,
        [anfitrion]: response.data
      }));
    } catch (error) {
      console.error(`Error al obtener las reservas para ${anfitrion}:`, error);
    }
  };

  // Use effect to trigger fetching when latitud and longitud change or the user clicks 'Buscar'
  useEffect(() => {
    if (latitud && longitud) {
      fetchSofas();
    }
  }, [latitud, longitud]);

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Navbar />

      <main className="flex flex-1 p-4">
        {/* Sección izquierda */}
        <div className="left-section flex-1 bg-gradient-to-r from-green-200 to-blue-200 rounded-3xl flex flex-col justify-center items-center text-center p-8 shadow-lg">
          <h1 className="text-5xl font-bold text-blue-800 mb-4 font-poppins">
            Filtrar por Coordenadas
          </h1>
          <p className="text-xl text-gray-700 italic font-poppins">
            Ingresa las coordenadas para buscar alojamientos cercanos.
          </p>
        </div>

        {/* Sección derecha */}
        <div className="right-section flex-1 bg-white rounded-3xl p-8 shadow-lg flex flex-col justify-center items-center text-center">
          <div className="space-y-4 w-full max-w-md">
            {/* Formulario de búsqueda */}
            <TextField
              label="Latitud"
              value={latitud}
              onChange={(e) => setLatitud(e.target.value)}
              fullWidth
              required
            />
            <TextField
              label="Longitud"
              value={longitud}
              onChange={(e) => setLongitud(e.target.value)}
              fullWidth
              required
            />
            <Button1 onClick={handleBuscar} variant="contained" color="primary" disabled={isSearching}>
              Buscar
            </Button1>

            {isSearching && (
              <div className="flex justify-center text-gray-700 items-center mt-4">
                <CircularProgress size={24} />
                <p className="ml-4">Buscando alojamientos...</p>
              </div>
            )}

            {/* Mensaje de error */}
            {error && <p className="text-red-600 mt-4">{error}</p>}

            {/* Resultados */}
            <div className="mt-6">
              {sofas.length > 0 ? (
                sofas.map((sofa) => (
                  <div key={sofa._id} className="bg-gray-200 text-gray-700 p-4 rounded-lg shadow-md mb-4">
                    <h3 className="text-2xl font-bold">{sofa.direccion}</h3>
                    <p>Host: {sofa.anfitrion}</p>
                    <p>Coordenadas: {sofa.coordenadas.latitud}, {sofa.coordenadas.longitud}</p>

                    {/* Fotos */}
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

                    {/* Reservas */}
                    <div className="mt-6">
                      <h4 className="text-xl font-medium">Reservas:</h4>
                      {reservas[sofa.anfitrion] && reservas[sofa.anfitrion].length > 0 ? (
                        reservas[sofa.anfitrion].map((reserva, index) => (
                          <div key={index} className="bg-blue-100 p-4 rounded-lg shadow-md mb-2">
                            <p>Huésped: {reserva.huesped}</p>
                            <p>Desde: {new Date(reserva.desde).toLocaleDateString()}</p>
                            <p>Días: {reserva.dias}</p>
                          </div>
                        ))
                      ) : (
                        <p className="text-gray-600">Sin reservas.</p>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                !isSearching && <p className="text-gray-600">No se encontraron alojamientos cercanos.</p>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
