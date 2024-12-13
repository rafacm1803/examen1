


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