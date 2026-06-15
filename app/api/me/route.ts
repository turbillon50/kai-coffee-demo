import { NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { getSession } from "@/lib/auth";

export const runtime = "nodejs";

export async function GET() {
  const s = await getSession();
  if (!s) return NextResponse.json({ user: null }, { status: 401 });
  try {
    const rows = await sql`SELECT id, nombre, telefono, email, puntos, nivel, created_at FROM kai_users WHERE id = ${s.uid}`;
    if (rows.length === 0) return NextResponse.json({ user: null }, { status: 401 });
    return NextResponse.json({ user: rows[0] });
  } catch (e) {
    console.error("me", e);
    return NextResponse.json({ error: "errGeneric" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  const s = await getSession();
  if (!s) return NextResponse.json({ user: null }, { status: 401 });
  try {
    const { nombre, telefono } = await req.json();
    const rows = await sql`
      UPDATE kai_users SET nombre = COALESCE(${nombre || null}, nombre),
        telefono = COALESCE(${telefono ?? null}, telefono)
      WHERE id = ${s.uid}
      RETURNING id, nombre, telefono, email, puntos, nivel
    `;
    return NextResponse.json({ user: rows[0] });
  } catch (e) {
    console.error("me-patch", e);
    return NextResponse.json({ error: "errGeneric" }, { status: 500 });
  }
}
