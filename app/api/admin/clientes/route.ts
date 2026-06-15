import { NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { getAdmin } from "@/lib/auth";

export const runtime = "nodejs";

export async function GET() {
  if (!(await getAdmin())) return NextResponse.json({ error: "forbidden" }, { status: 403 });
  try {
    const rows = await sql`
      SELECT u.id, u.nombre, u.email, u.telefono, u.puntos, u.nivel, u.created_at,
        (SELECT COUNT(*)::int FROM kai_pedidos p WHERE p.user_id = u.id) AS pedidos,
        (SELECT COUNT(*)::int FROM kai_reservas r WHERE r.user_id = u.id) AS reservas
      FROM kai_users u ORDER BY u.puntos DESC LIMIT 200
    `;
    return NextResponse.json({ clientes: rows });
  } catch (e) {
    console.error("admin-clientes", e);
    return NextResponse.json({ clientes: [] }, { status: 500 });
  }
}
