"use client";
import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import Navbar from '@/components/navbar';

const SOFA_BASE_API = process.env.NEXT_PUBLIC_SOFA_DB_URI;

export default function Page() {
  const { data: session, status } = useSession();
  const [sofas, setSofas] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchSofas();
  }, []);

  const fetchSofas = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${SOFA_BASE_API}/buscar`, {
        headers: {
          "Authorization": `Bearer ${session.accessToken}`,
          "Content-Type": "application/json",
        },
      });
      setSofas(response.data);
    } catch (error) {
      console.error("Error al obtener sofás:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Navbar />
      <main className="flex flex-1 p-4">
        <div className="right-section flex-1 bg-white rounded-3xl p-8 shadow-lg flex flex-col justify-center items-center text-center overflow-y-auto max-h-screen">
          {loading && <p>Cargando...</p>}
          <div className="sofas-container">
            {sofas.map((sofa) => (
              <div key={sofa._id} className="sofa-item bg-gray-200 text-gray-700 p-4 rounded-lg shadow-md mb-4">
                <h3 className="text-2xl text-gray-700 font-bold">{sofa.direccion}</h3>
                <p>Host: {sofa.anfitrion}</p>
                <p>Coordenadas: {sofa.coordenadas.latitud}, {sofa.coordenadas.longitud}</p>
                <OpenStreetMap
                  lat={sofa.coordenadas.latitud}
                  lng={sofa.coordenadas.longitud}
                  direccion={sofa.direccion}
                />
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

function OpenStreetMap({ lat, lng, direccion }) {
  const mapRef = useRef(null);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/leaflet@1.7.1/dist/leaflet.js';
    script.async = true;
    script.onload = () => {
      const map = window.L.map(mapRef.current).setView([lat, lng], 13);

      window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(map);

      window.L.marker([lat, lng]).addTo(map)
        .bindPopup(direccion)
        .openPopup();
    };

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, [lat, lng, direccion]);

  return <div ref={mapRef} style={{ height: '200px', width: '100%' }} />;
}