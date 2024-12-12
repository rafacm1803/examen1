"use client"; // Esto convierte este archivo en un componente del cliente
import { Button } from "@/components/ui/button";
import {Button as Button1} from "@mui/material";
import { useSession, signIn, signOut } from "next-auth/react";
import { useRouter } from "next/navigation"; // Importa useRouter para la navegación

export default function Landing() {
  // Hook para obtener la sesión del usuario
  const { data: session, status } = useSession();
  const router = useRouter(); // Inicializa el router

  // Verifica el estado de la sesión
  if (status === "loading") {
    return <p>Cargando...</p>;
  }

  const handleGitHubLogin = () => {
    // Redirige al usuario al flujo de inicio de sesión con GitHub
    signIn("github");
  };

  const handleLogout = () => {
    // Cierra la sesión
    signOut();
  };

  const navigateToHome = () => {
    // Redirige a la página de home
    router.push("/home");
  };

  return (
    <div className="landing flex h-screen p-4 bg-gray-100">
      {/* Sección izquierda */}
      <div className="left-section flex-1 bg-gradient-to-r from-green-200 to-blue-200 rounded-3xl flex flex-col justify-center items-center text-center p-8 shadow-lg">
        <h1 className="text-5xl font-bold text-blue-800 mb-4 font-poppins">
          Bienvenido a Couchsurfing!
        </h1>
        <p className="text-xl text-gray-700 italic font-poppins">
          Romantizando dormir en un puñetero sofa
        </p>
        <div className="mt-8 flex space-x-4 text-2xl">
          <span>💻</span>
          <span>🌐</span>
        </div>
      </div>

      {/* Sección derecha */}
      <div className="right-section flex-1 flex flex-col justify-center items-center p-8 bg-white rounded-3xl shadow-lg">
        <h2 className="text-3xl font-bold mb-6 text-gray-800 font-poppins">
          Inicia Sesión
        </h2>
        <div className="form w-full max-w-sm space-y-4">
          {!session ? (
            <Button
              className="w-full bg-blue-500 text-white"
              onClick={handleGitHubLogin}
            >
              Iniciar sesión con GitHub
            </Button>
          ) : (
            <div>
              <p className="mb-4">Hola, {session.user.email}. Estás autenticado.</p>
              <Button
                className="w-full bg-blue-500 text-white mb-4"
                onClick={navigateToHome} // Redirige a la página de home
              >
                Ir a Home
              </Button>
              <Button
                className="w-full bg-red-500 text-white"
                onClick={handleLogout}
              >
                Cerrar sesión
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
