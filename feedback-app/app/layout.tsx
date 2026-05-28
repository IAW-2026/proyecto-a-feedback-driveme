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
          <header className="relative z-10 flex justify-between items-center px-8 py-4 bg-[#050810]/95 backdrop-blur-sm border-b border-white/5">
            <Show when="signed-in">
              <nav className="flex gap-6 text-sm font-medium">
                <Link href="/dashboard" className="text-white/70 hover:text-white transition-colors">Mis calificaciones</Link>
                {esAdmin && <Link href="/admin" className="text-white/70 hover:text-white transition-colors">Admin</Link>}
              </nav>
            </Show>
            <div className="ml-auto flex gap-4 items-center">
              <Show when="signed-out">
                <SignInButton>
                  <button className="text-white/60 hover:text-white text-sm font-medium transition-colors cursor-pointer">
                    Sign in
                  </button>
                </SignInButton>
                <SignUpButton>
                  <button className="border border-white/25 hover:border-white/60 text-white/70 hover:text-white text-sm font-medium px-4 py-1.5 rounded-full transition-all cursor-pointer">
                    Sign up
                  </button>
                </SignUpButton>
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
