import { NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { getSession, nivelFromPuntos } from "@/lib/auth";

export const runtime = "nodejs";

export async function GET() {
  const s = await getSession();
  if (!s) return NextResponse.json({ pedidos: [] }, { status: 401 });
  try {
    const rows = await sql`
      SELECT id, items_json AS items, total::float8 AS total, estado, created_at
      FROM kai_pedidos WHERE user_id = ${s.uid} ORDER BY created_at DESC
    `;
    return NextResponse.json({ pedidos: rows });
  } catch (e) {
    console.error("pedidos-get", e);
    return NextResponse.json({ pedidos: [] }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const s = await getSession();
  if (!s) return NextResponse.json({ error: "errBadLogin" }, { status: 401 });
  try {
    const { items, total } = await req.json();
    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "emptyCart" }, { status: 400 });
    }
    const tot = Number(total) || 0;
    const rows = await sql`
      INSERT INTO kai_pedidos (user_id, items_json, total, estado)
      VALUES (${s.uid}, ${JSON.stringify(items)}, ${tot}, 'pendiente')
      RETURNING id, items_json AS items, total::float8 AS total, estado, created_at
    `;
    const ganados = Math.floor(tot / 10);
    const up = await sql`UPDATE kai_users SET puntos = puntos + ${ganados} WHERE id = ${s.uid} RETURNING puntos`;
    const puntos = up[0].puntos;
    await sql`UPDATE kai_users SET nivel = ${nivelFromPuntos(puntos)} WHERE id = ${s.uid}`;
    return NextResponse.json({ pedido: rows[0], ganados, puntos });
  } catch (e) {
    console.error("pedidos-post", e);
    return NextResponse.json({ error: "errGeneric" }, { status: 500 });
  }
}
