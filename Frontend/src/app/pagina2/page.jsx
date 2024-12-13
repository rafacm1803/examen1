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


/*"use client";

import { useSession } from "next-auth/react";
import { useState } from "react"; 
import { Button } from "@/components/ui/button"; 
import Navbar from "@/components/navbar";
import { Button as Button1, TextField, IconButton } from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import axios from "axios";

const RESERVA_BASE_API = process.env.NEXT_PUBLIC_RESERVA_DB_URI;

export default function Reserva() {
  const { data: session, status } = useSession();
  
  // Estados del formulario
  const [anfitrion, setAnfitrion] = useState("");
  const [huesped, setHuesped] = useState("");
  const [desde, setDesde] = useState("");
  const [dias, setDias] = useState("");

  if (status === "loading") {
    return <p>Cargando...</p>;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!anfitrion || !huesped || !desde || !dias) {
      alert("Por favor, completa todos los campos.");
      return;
    }

    const data = {
      anfitrion,
      huesped,
      desde: new Date(desde),
      dias: parseInt(dias),
    };

    try {
      const res = await axios.post(`${RESERVA_BASE_API}/`, data, {
        headers: {
          "Authorization": `Bearer ${session.accessToken}`,
          "Content-Type": "application/json",
        },
      });

      if (res.status === 201) {
        alert("¡Reserva realizada con éxito!");
      }
    } catch (error) {
      console.error("Error al crear la reserva:", error);
      alert("Error al realizar la reserva.");
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Navbar />

      <main className="flex flex-1 p-4">
        <div className="left-section flex-1 bg-gradient-to-r from-green-200 to-blue-200 rounded-3xl flex flex-col justify-center items-center text-center p-8 shadow-lg">
          <h1 className="text-5xl font-bold text-blue-800 mb-4 font-poppins">
            ¡Reserva tu sofá!
          </h1>
          <p className="text-xl text-gray-700 italic font-poppins">
            Formulario para realizar una reserva
          </p>
        </div>

        <div className="right-section flex-1 bg-white rounded-3xl p-8 shadow-lg flex flex-col justify-center items-center text-center">
          <form
            onSubmit={handleSubmit}
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "16px",
              width: "100%",
              maxWidth: "400px",
            }}
          >
            <TextField 
              label="Anfitrión" 
              value={anfitrion} 
              onChange={(e) => setAnfitrion(e.target.value)} 
              required
            />
            <TextField 
              label="Huésped" 
              value={huesped} 
              onChange={(e) => setHuesped(e.target.value)} 
              required
            />
            <TextField 
              label="Desde (fecha)" 
              type="date"
              value={desde} 
              onChange={(e) => setDesde(e.target.value)} 
              InputLabelProps={{
                shrink: true,
              }}
              required
            />
            <TextField 
              label="Días" 
              type="number" 
              value={dias} 
              onChange={(e) => {
                const value = parseInt(e.target.value, 10);
                if (value >= 0) {
                  setDias(value);
                }
              }} 
              required
            />

            <Button1 type="submit" variant="contained" color="primary">
              Realizar Reserva
            </Button1>
          </form>
        </div>
      </main>
    </div>
  );
}
*/