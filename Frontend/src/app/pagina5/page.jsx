import { useEffect, useState } from 'react';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import Navbar from '@/components/navbar';

// Configurar el icono de Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

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
                <MapContainer
                  center={[sofa.coordenadas.latitud, sofa.coordenadas.longitud]}
                  zoom={13}
                  style={{ height: "200px", width: "100%" }}
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  />
                  <Marker position={[sofa.coordenadas.latitud, sofa.coordenadas.longitud]}>
                    <Popup>
                      {sofa.direccion}
                    </Popup>
                  </Marker>
                </MapContainer>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}