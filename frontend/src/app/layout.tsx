import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
  title: "Plataforma de Gestión de Torneos Deportivos",
  description: "Gestión de torneos, equipos, jugadores y partidos",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <nav className="bg-blue-700 text-white px-6 py-3 flex flex-wrap gap-4">
          <Link href="/" className="font-bold text-lg mr-4">🏆 Torneos</Link>
          <Link href="/torneos" className="hover:underline">Torneos</Link>
          <Link href="/canchas" className="hover:underline">Canchas</Link>
          <Link href="/equipos" className="hover:underline">Equipos</Link>
          <Link href="/jugadores" className="hover:underline">Jugadores</Link>
          <Link href="/partidos" className="hover:underline">Partidos</Link>
          <Link href="/resultados" className="hover:underline">Resultados</Link>
          <Link href="/goleadores" className="hover:underline">Goleadores</Link>
        </nav>
        <main className="flex-1">{children}</main>
      </body>
    </html>
  );
}