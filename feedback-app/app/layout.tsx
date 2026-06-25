import type { Metadata } from "next";
import { Geist_Mono, Roboto_Flex } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";

const robotoFlex = Roboto_Flex({
  variable: "--font-roboto-flex",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DriveMe Feedback | Galactic Transport Reviews",
  description: "Calificá tu experiencia de viaje. Unite a la fuerza de mejores viajes.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${robotoFlex.variable} ${geistMono.variable}`}
    >
      <body className="font-sans antialiased bg-background min-h-screen">
        <ClerkProvider>
          {children}
        </ClerkProvider>
      </body>
    </html>
  );
}
