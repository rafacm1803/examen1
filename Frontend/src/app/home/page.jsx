"use client";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react"; 
import { Button } from "@/components/ui/button"; 
import Navbar from "@/components/navbar";
import { Button as Button1, TextField, IconButton } from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import axios from "axios";

const MAPAS_BASE_API = process.env.NEXT_PUBLIC_VERSION_MAPA_API;
const SOFA_BASE_API = process.env.NEXT_PUBLIC_SOFA_DB_URI;
const RESERVA_BASE_API = process.env.NEXT_PUBLIC_RESERVA_DB_URI;

export default function Home() {
  const { data: session, status } = useSession();
  
  // Estados del formulario
  const [direccion, setDireccion] = useState("");
  const [ubicacion, setUbicacion] = useState("");
  const [images, setImages] = useState([""]); // Estado para múltiples URLs de imágenes

  if (status === "loading") {
    return <p>Cargando...</p>;
  }

  const handleAddImageField = () => {
    setImages([...images, ""]); // Agrega un nuevo campo vacío
  };

  const handleRemoveImageField = (index) => {
    const updatedImages = images.filter((_, i) => i !== index);
    setImages(updatedImages); // Elimina el campo seleccionado
  };

  const handleImageChange = (index, value) => {
    const updatedImages = [...images];
    updatedImages[index] = value; // Actualiza el valor del campo específico
    setImages(updatedImages);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
  
    let coordenadas = null;
    if (ubicacion.trim()) {
      try {
        const response = await axios.get(`${MAPAS_BASE_API}/${encodeURIComponent(ubicacion)}`);
        if (response.status === 200 && response.data) {
          coordenadas = { latitud: response.data.lat, longitud: response.data.lon };
        } else {
          alert("No se pudieron obtener coordenadas para la dirección.");
          return;
        }
      } catch (error) {
        alert("Hubo un problema al procesar la ubicación.");
        return;
      }
    }
  
    // Asegúrate de que todas las imágenes tengan una URL válida
    if (!images.every((url) => url.trim() !== "")) {
      alert("Por favor, ingresa URLs válidas para todas las imágenes.");
      return;
    }
  
    const data = {
      anfitrion: session.user.email,
      direccion: direccion.trim(),
      latitud: coordenadas?.latitud || null,
      longitud: coordenadas?.longitud || null,
      fotos: images, // Incluye las URLs de las imágenes directamente
    };
  
    try {
      const res = await axios.post(`${SOFA_BASE_API}/`, data, {
        headers: {
          "Authorization": `Bearer ${session.accessToken}`, // Enviar el token aquí
          "Content-Type": "application/json", // JSON en lugar de FormData
        },
      });
  
      if (res.status === 201) {
        alert("¡Sofá creado con éxito!");
      }
    } catch (error) {
      console.error("Error al crear el sofá:", error);
      alert("Error al crear el sofá.");
    }
  };
  

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Navbar />

      <main className="flex flex-1 p-4">
        <div className="left-section flex-1 bg-gradient-to-r from-green-200 to-blue-200 rounded-3xl flex flex-col justify-center items-center text-center p-8 shadow-lg">
          <h1 className="text-5xl font-bold text-blue-800 mb-4 font-poppins">
            ¡Bienvenido a CouchSurfing!
          </h1>
          <p className="text-xl text-gray-700 italic font-poppins">
            Formulario de imagenes y mapas
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
            <TextField label="Direccion" value={direccion} onChange={(e) => setDireccion(e.target.value)} required />
            <TextField
              label="Ubicacion"
              value={ubicacion}
              onChange={(e) => setUbicacion(e.target.value)}
              helperText="Ejemplo: Calle Mayor, 1, Madrid"
              multiline
            />

            {/* Renderiza dinámicamente los campos para imágenes */}
            {images.map((image, index) => (
              <div key={index} style={{ display: "flex", alignItems: "center" }}>
                <TextField
                  label={`URL de la imagen ${index + 1}`}
                  value={image}
                  onChange={(e) => handleImageChange(index, e.target.value)}
                  fullWidth
                  required
                />
                <IconButton onClick={() => handleRemoveImageField(index)} color="secondary">
                  <RemoveCircleOutlineIcon />
                </IconButton>
              </div>
            ))}
            <Button1 variant="outlined" onClick={handleAddImageField} startIcon={<AddCircleOutlineIcon />}>
              Añadir imagen
            </Button1>

            <Button1 type="submit" variant="contained" color="primary">
              Crear
            </Button1>
          </form>
        </div>
      </main>
    </div>
  );
}
