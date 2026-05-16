import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function AdminPage() {
  const user = await currentUser(); // currentUser() obtiene la información del usuario actual

  if (!user || user.publicMetadata?.role !== "admin") { // Verificar si el usuario no es admin
    redirect("/"); // Redirigir a la página de inicio 
  }

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold">Panel de Moderación</h1>
      <p className="text-gray-500 mt-2">Acá irán los reportes pendientes de revisión.</p>
    </main>
  ); 
}
