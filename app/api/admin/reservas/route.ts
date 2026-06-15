import { NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { getAdmin } from "@/lib/auth";

export const runtime = "nodejs";

export async function GET() {
  if (!(await getAdmin())) return NextResponse.json({ error: "forbidden" }, { status: 403 });
  try {
    const rows = await sql`
      SELECT r.id, r.espacio_nombre, r.fecha, r.horas, r.personas,
             r.total::float8 AS total, r.estado, r.created_at, u.nombre AS cliente
      FROM kai_reservas r JOIN kai_users u ON u.id = r.user_id
      ORDER BY r.created_at DESC LIMIT 100
    `;
    return NextResponse.json({ reservas: rows });
  } catch (e) {
    console.error("admin-reservas", e);
    return NextResponse.json({ reservas: [] }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  if (!(await getAdmin())) return NextResponse.json({ error: "forbidden" }, { status: 403 });
  try {
    const { id, estado } = await req.json();
    if (!id || !["pendiente", "confirmada", "cancelada"].includes(estado)) {
      return NextResponse.json({ error: "errFields" }, { status: 400 });
    }
    await sql`UPDATE kai_reservas SET estado = ${estado} WHERE id = ${id}`;
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("admin-reservas-patch", e);
    return NextResponse.json({ error: "errGeneric" }, { status: 500 });
  }
}
