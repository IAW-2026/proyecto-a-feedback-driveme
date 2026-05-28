import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ClerkProvider, SignInButton, SignUpButton, UserButton, Show } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";
import Link from "next/link";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DriveMe Feedback",
  description: "App de calificaciones y reportes de DriveMe",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await currentUser();
  const esAdmin = user?.publicMetadata?.role === "admin";

  return (
    <html
      lang="es" // el lenguaje de la aplicación es español
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`} 
    >
      <body className="min-h-full flex flex-col"> 
        <ClerkProvider>
          <header className="flex justify-between items-center p-4 border-b">
            <Show when="signed-in">
              <nav className="flex gap-6 text-sm font-medium">
                <Link href="/dashboard">Mis calificaciones</Link>
                {esAdmin && <Link href="/admin">Admin</Link>} 
              </nav>
            </Show>
            <div className="ml-auto flex gap-6 items-center">
              <Show when="signed-out">
                <SignInButton />
                <SignUpButton />
              </Show>
              <Show when="signed-in">
                <UserButton />
              </Show>
            </div>
          </header>
          {children}
        </ClerkProvider>
      </body>
    </html>
  );
}
