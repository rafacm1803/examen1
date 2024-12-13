"use client"; 
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Función para manejar el cierre de sesión
  const handleLogout = async () => {
    await signOut({ redirect: false }); // No redirigir automáticamente
    router.push("/"); // Redirigir a la página principal después de cerrar sesión
  };

  // Redirigir a la página principal si no hay sesión
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/"); // Redirige a la página principal si el usuario no está autenticado
    }
  }, [status, router]); // Ejecutar cuando cambie el estado de la sesión

  // Obtener el primer nombre del usuario
  const firstName = session?.user?.name?.split(" ")[0]; // Toma solo el primer nombre

  return (
    <nav className="bg-gradient-to-r from-green-200 to-blue-200 p-4 shadow-md">
      <div className="flex justify-between items-center max-w-screen-xl mx-auto">
        <div className="flex items-center space-x-6">
          {/* Logo o nombre */}
          <h1 className="text-3xl font-bold text-blue-800 font-poppins">MiMapa</h1>
        </div>

        {/* Menú de navegación */}
        <div className="flex space-x-6">
          {/* Modificar las rutas de los botones aquí */}
          <Button 
            onClick={() => router.push("/home")} // Ruta del Botón 1
            className="bg-blue-500 hover:bg-blue-600 text-white rounded-lg px-4 py-2 font-semibold"
          >
            Home
          </Button>

          <Button 
            onClick={() => router.push("/pagina1")} // Ruta del Botón 1
            className="bg-blue-500 hover:bg-blue-600 text-white rounded-lg px-4 py-2 font-semibold"
          >
            Mostrar todo
          </Button>

          <Button 
            onClick={() => router.push("/pagina2")} // Ruta del Botón 2
            className="bg-blue-500 hover:bg-blue-600 text-white rounded-lg px-4 py-2 font-semibold"
          >
            Formulario 2
          </Button>

          <Button 
            onClick={() => router.push("/pagina3")} // Ruta del Botón 2
            className="bg-blue-500 hover:bg-blue-600 text-white rounded-lg px-4 py-2 font-semibold"
          >
            Filtrar 1
          </Button>

          <Button 
            onClick={() => router.push("/pagina4")} // Ruta del Botón 2
            className="bg-blue-500 hover:bg-blue-600 text-white rounded-lg px-4 py-2 font-semibold"
          >
            Filtrar 2
          </Button>

          <Button 
            onClick={() => router.push("/pagina5")} // Ruta del Botón 2
            className="bg-blue-500 hover:bg-blue-600 text-white rounded-lg px-4 py-2 font-semibold"
          >
            Mostrar Mapas
          </Button>

          {/* Si el usuario está logueado, mostrar el nombre (solo primer nombre) y el botón de logout */}
          {session ? (
            <div className="flex items-center space-x-4">
              <Button 
                onClick={handleLogout} 
                className="bg-red-500 hover:bg-red-600 text-white rounded-lg px-4 py-2 font-semibold"
              >
                {firstName}, cerrar sesión
              </Button>
            </div>
          ) : (
            <Button
              onClick={() => router.push("/login")} // Ruta de login si no estás logueado
              className="bg-green-500 hover:bg-green-600 text-white rounded-lg px-4 py-2 font-semibold"
            >
              Iniciar sesión
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
}
