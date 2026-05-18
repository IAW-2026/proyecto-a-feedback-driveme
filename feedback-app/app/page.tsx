import Link from "next/link";

export default function Home() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center p-8 text-center">
      <h1 className="text-4xl font-bold">DriveMe Feedback</h1>
      <p className="mt-4 text-gray-500 max-w-md">
        Sistema de calificaciones y reportes para conductores y pasajeros.
      </p>
      <Link
        href="/dashboard"
        className="mt-8 px-6 py-3 bg-black text-white rounded-full text-sm font-medium hover:bg-zinc-800 transition-colors dark:bg-white dark:text-black dark:hover:bg-zinc-200"
      >
        Ir al Dashboard
      </Link>
    </main>
  );
}
