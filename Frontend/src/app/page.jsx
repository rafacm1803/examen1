"use client";
import { Button } from "@/components/ui/button";
import { useSession, signIn, signOut } from "next-auth/react";
import { useRouter } from "next/navigation"; 

export default function Landing() {
  // Hook para obtener la sesión del usuario
  const { data: session, status } = useSession();

  // Verifica el estado de la sesión
  if (status === "loading") {
    return <p>Cargando...</p>;
  }

  const handleGitHubLogin = () => {
    signIn("github");
  };

  const handleLogout = () => {
    signOut();
  };

  const navigateToHome = () => {
    router.push("/home");
  };

  return (
    <div className="landing flex h-screen p-4 bg-gray-100">
      {/* Sección izquierda */}
      <div className="left-section flex-1 bg-gradient-to-r from-green-200 to-blue-200 rounded-3xl flex flex-col justify-center items-center text-center p-8 shadow-lg">
        <h1 className="text-5xl font-bold text-blue-800 mb-4 font-poppins">
          Bienvenido a MiMapa!
        </h1>
        <p className="text-xl text-gray-700 italic font-poppins">
          Parcial 3 de Rafael Ceballos Martinez
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
              <p className="mb-4 text-gray-700">Hola, {session.user.email}. Ya has iniciado sesion.</p>
              <Button
                className="w-full text-gray-700 bg-blue-500 text-white mb-4"
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
