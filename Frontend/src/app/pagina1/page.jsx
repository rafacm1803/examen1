"use client";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/navbar";
import { TextField, IconButton } from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import axios from "axios";

const MAPAS_BASE_API = process.env.NEXT_PUBLIC_VERSION_MAPA_API;
const SOFA_BASE_API = process.env.NEXT_PUBLIC_SOFA_DB_URI;
const RESERVA_BASE_API = process.env.NEXT_PUBLIC_RESERVA_DB_URI;

export default function Home() {
  const { data: session, status } = useSession();
  const [sofas, setSofas] = useState([]);
  const [reservas, setReservas] = useState({});

  useEffect(() => {
    const fetchSofas = async () => {
      try {
        const response = await axios.get(`${SOFA_BASE_API}/`, {
          headers: {
            "Authorization": `Bearer ${session.accessToken}`, // Enviar el token aquí
            "Content-Type": "application/json", // JSON en lugar de FormData
          },
        });
        setSofas(response.data);
        
        // Después de obtener los sofás, obtenemos las reservas para cada uno
        response.data.forEach((sofa) => {
          fetchReservas(sofa.anfitrion);
        });
      } catch (error) {
        console.error("Error al obtener los sofás:", error);
      }
    };

    fetchSofas();
  }, []);

  // Obtener las reservas para un sofá específico
  const fetchReservas = async (anfitrion) => {
    try {
      const response = await axios.get(`${RESERVA_BASE_API}/${anfitrion}`, {
        headers: {
          "Authorization": `Bearer ${session.accessToken}`, // Enviar el token aquí
          "Content-Type": "application/json", // JSON en lugar de FormData
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

  // Mostrar los sofás y las reservas
  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Navbar />

      <main className="flex flex-1 p-4">
        {/* Sección izquierda */}
        <div className="left-section flex-1 bg-gradient-to-r from-green-200 to-blue-200 rounded-3xl flex flex-col justify-center items-center text-center p-8 shadow-lg">
          <h1 className="text-5xl font-bold text-blue-800 mb-4 font-poppins">
            Mostrar todo
          </h1>
          <p className="text-xl text-gray-700 italic font-poppins">
            Sofas y reservas
          </p>
          <div className="mt-8 text-gray-700 flex space-x-4 text-2xl">
            <span>Mostramos todos los sofas y dentro de cada uno, las reservas que tiene</span>
          </div>
        </div>

        {/* Sección derecha */}
        <div className="right-section flex-1 bg-white rounded-3xl p-8 shadow-lg flex flex-col justify-center items-center text-center">
  <h2 className="text-3xl text-gray-700 font-semibold mb-6">Sofás y Reservas</h2>

  {/* Contenedor con scroll */}
  <div className="space-y-6 overflow-y-auto max-h-[29rem] w-full">
    {sofas.map((sofa) => (
      <div key={sofa._id} className="bg-gray-200 text-gray-700 p-4 rounded-lg shadow-md">
        <h3 className="text-2xl text-gray-700 font-bold">{sofa.direccion}</h3>
        <p>Host: {sofa.anfitrion}</p>
        <p>Coordenadas: {sofa.coordenadas.latitud}, {sofa.coordenadas.longitud}</p>

        <div className="mt-4">
          <h4 className="text-xl text-gray-700 font-medium">Fotos:</h4>
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

        {/* Mostrar las reservas dentro del sofá */}
        <div className="mt-6">
          {reservas[sofa.anfitrion] && reservas[sofa.anfitrion].length > 0 ? (
            <div className="mt-4 space-y-4">
              {reservas[sofa.anfitrion].map((reserva, index) => (
                <div key={index} className="bg-blue-100 p-4 rounded-lg shadow-md">
                  <p>Huesped: {reserva.huesped}</p>
                  <p>Desde: {new Date(reserva.desde).toLocaleDateString()}</p>
                  <p>Días: {reserva.dias}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-4 text-xl font-semibold text-gray-600">Sin reservas</div>
          )}
        </div>
      </div>
    ))}
  </div>
</div>

      </main>
    </div>
  );
}
