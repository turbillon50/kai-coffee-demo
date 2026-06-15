import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, Fraunces } from "next/font/google";
import "./globals.css";

// Tipografía igual a Hakapoke: Plus Jakarta Sans para cuerpo.
const sans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

// Serif cálido para titulares — vibe artesanal de cafetería.
const serif = Fraunces({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
  weight: ["400", "500", "600", "700", "900"],
});

export const metadata: Metadata = {
  title: "KAI COFFEE — Café de especialidad",
  description:
    "KAI COFFEE · café de especialidad, grano selecto y espacios para tu momento. Ordena, reserva y suma puntos de lealtad.",
  manifest: "/manifest.json",
  applicationName: "KAI COFFEE",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "KAI",
  },
  icons: {
    icon: [
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/icon-192.png", sizes: "192x192", type: "image/png" }],
  },
};

export const viewport: Viewport = {
  themeColor: "#1a0f08",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
};

// Evita el flash de tema: aplica data-theme + lang antes del primer paint.
const noFlash = `(function(){try{var t=localStorage.getItem('kai_theme')||'dark';var l=localStorage.getItem('kai_lang')||'es';document.documentElement.setAttribute('data-theme',t);document.documentElement.lang=l;}catch(e){}})();`;

// Registra el service worker para la PWA.
const swReg = `if('serviceWorker' in navigator){window.addEventListener('load',function(){navigator.serviceWorker.register('/sw.js').catch(function(){});});}`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" data-theme="dark" className={`${sans.variable} ${serif.variable}`}>
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="KAI" />
        <script dangerouslySetInnerHTML={{ __html: noFlash }} />
      </head>
      <body>
        {children}
        <script dangerouslySetInnerHTML={{ __html: swReg }} />
      </body>
    </html>
  );
}
