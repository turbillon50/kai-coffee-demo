import { NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { getSession, nivelFromPuntos } from "@/lib/auth";

export const runtime = "nodejs";

export async function GET() {
  const s = await getSession();
  if (!s) return NextResponse.json({ reservas: [] }, { status: 401 });
  try {
    const rows = await sql`
      SELECT id, espacio_nombre, fecha, horas, personas, total::float8 AS total, estado, created_at
      FROM kai_reservas WHERE user_id = ${s.uid} ORDER BY created_at DESC
    `;
    return NextResponse.json({ reservas: rows });
  } catch (e) {
    console.error("reservas-get", e);
    return NextResponse.json({ reservas: [] }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const s = await getSession();
  if (!s) return NextResponse.json({ error: "errBadLogin" }, { status: 401 });
  try {
    const { espacio_nombre, fecha, horas, personas, total } = await req.json();
    if (!espacio_nombre || !fecha || !horas) {
      return NextResponse.json({ error: "errFields" }, { status: 400 });
    }
    const tot = Number(total) || 0;
    const rows = await sql`
      INSERT INTO kai_reservas (user_id, espacio_nombre, fecha, horas, personas, total, estado)
      VALUES (${s.uid}, ${espacio_nombre}, ${fecha}, ${horas}, ${Number(personas) || 1}, ${tot}, 'pendiente')
      RETURNING id, espacio_nombre, fecha, horas, personas, total::float8 AS total, estado, created_at
    `;
    const ganados = Math.floor(tot / 10);
    const up = await sql`
      UPDATE kai_users SET puntos = puntos + ${ganados} WHERE id = ${s.uid} RETURNING puntos
    `;
    const puntos = up[0].puntos;
    await sql`UPDATE kai_users SET nivel = ${nivelFromPuntos(puntos)} WHERE id = ${s.uid}`;
    return NextResponse.json({ reserva: rows[0], ganados, puntos });
  } catch (e) {
    console.error("reservas-post", e);
    return NextResponse.json({ error: "errGeneric" }, { status: 500 });
  }
}
