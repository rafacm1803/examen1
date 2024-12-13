"use client";
import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import Navbar from '@/components/navbar';
import 'ol/ol.css';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import Overlay from 'ol/Overlay';
import { fromLonLat } from 'ol/proj';

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
      const response = await axios.get(`${SOFA_BASE_API}/`, {
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
      <main className="flex flex-1 p-4" style={{ paddingTop: '80px' }}>
        <div className="right-section flex-1 text-gray-700 bg-white rounded-3xl p-8 shadow-lg flex flex-col justify-center items-center text-center overflow-y-auto max-h-screen">
          {loading && <p>Cargando...</p>}
          <div className="sofas-container" style={{ marginTop: '20px' }}>
            {sofas.map((sofa) => (
              <div key={sofa._id} className="sofa-item bg-gray-200 text-gray-700 p-4 rounded-lg shadow-md mb-4">
                <h3 className="text-2xl text-gray-700 font-bold">{sofa.direccion}</h3>
                <p>Host: {sofa.anfitrion}</p>
                <p>Coordenadas: {sofa.coordenadas.latitud}, {sofa.coordenadas.longitud}</p>
                <div className="map-container" style={{ height: '200px', width: '100%', marginTop: '10px' }}>
                  <OpenStreetMap
                    lat={sofa.coordenadas.latitud}
                    lng={sofa.coordenadas.longitud}
                    direccion={sofa.direccion}
                  />
                </div>
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
    const map = new Map({
      target: mapRef.current,
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
      ],
      view: new View({
        center: fromLonLat([lng, lat]),
        zoom: 13,
      }),
    });

    const marker = new Overlay({
      position: fromLonLat([lng, lat]),
      positioning: 'center-center',
      element: document.createElement('div'),
      stopEvent: false,
    });
    marker.getElement().className = 'marker';
    map.addOverlay(marker);

    return () => {
      map.setTarget(null);
    };
  }, [lat, lng, direccion]);

  return <div ref={mapRef} style={{ height: '100%', width: '100%' }} />;
}