"use client";

import { useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import axios from 'axios';
import 'ol/ol.css';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import Overlay from 'ol/Overlay';
import { fromLonLat } from 'ol/proj';
import Navbar from "@/components/navbar";

const USUARIO_BASE_API = process.env.NEXT_PUBLIC_USUARIO_DB_URI;

export default function MapaUsuario() {
  const { data: session, status } = useSession();
  const mapRef = useRef(null);
  const markersRef = useRef([]);

  useEffect(() => {
    if (status === 'authenticated') {
      fetchMarkers();
    }
  }, [status]);

  const fetchMarkers = async () => {
    try {
      const response = await axios.get(`${USUARIO_BASE_API}/${session.user.email}/marcadores`, {
        headers: {
          "Authorization": `Bearer ${session.accessToken}`,
          "Content-Type": "application/json",
        },
      });
      const markers = response.data;
      initializeMap(markers);
    } catch (error) {
      console.error("Error al obtener los marcadores:", error);
      initializeMap([]);
    }
  };

  const initializeMap = (markers) => {
    const map = new Map({
      target: mapRef.current,
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
      ],
      view: new View({
        center: fromLonLat([-3.7038, 40.4168]), // Coordenadas iniciales (Madrid)
        zoom: 2,
      }),
    });

    markers.forEach(marker => {
      const markerElement = document.createElement('div');
      markerElement.className = 'marker';
      const overlay = new Overlay({
        position: fromLonLat([marker.longitud, marker.latitud]),
        positioning: 'center-center',
        element: markerElement,
        stopEvent: false,
      });
      map.addOverlay(overlay);
      markersRef.current.push(overlay);
    });
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Navbar />
      <main className="flex flex-1 p-4">
        <div className="map-container flex-1 bg-white rounded-3xl p-8 shadow-lg" style={{ height: '80vh' }}>
          <div ref={mapRef} style={{ height: '100%', width: '100%' }}></div>
        </div>
      </main>
    </div>
  );
}