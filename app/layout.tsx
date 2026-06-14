import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Kai Coffee — Cafetería",
  description: "Kai Coffee · café de especialidad, grano selecto, espacios para tu momento.",
};

export const viewport: Viewport = {
  themeColor: "#0a0814",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
