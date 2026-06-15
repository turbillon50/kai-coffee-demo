import { neon } from "@neondatabase/serverless";

// Cliente SQL sobre Neon (HTTP) — funciona en serverless de Vercel.
const url = process.env.DATABASE_URL;
if (!url) {
  // No reventamos en build; las rutas que lo usen fallarán con mensaje claro.
  console.warn("DATABASE_URL no definido");
}

export const sql = neon(url || "postgresql://invalid");
