import { NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { getAdmin } from "@/lib/auth";

export const runtime = "nodejs";

export async function GET() {
  if (!(await getAdmin())) return NextResponse.json({ error: "forbidden" }, { status: 403 });
  try {
    const ingresosR = await sql`SELECT COALESCE(SUM(total),0)::float8 AS v FROM kai_reservas WHERE estado != 'cancelada'`;
    const ingresosP = await sql`SELECT COALESCE(SUM(total),0)::float8 AS v FROM kai_pedidos WHERE estado != 'cancelada'`;
    const activeRes = await sql`SELECT COUNT(*)::int AS v FROM kai_reservas WHERE estado IN ('pendiente','confirmada')`;
    const pedidosHoy = await sql`SELECT COUNT(*)::int AS v FROM kai_pedidos WHERE created_at::date = now()::date`;
    const clientes = await sql`SELECT COUNT(*)::int AS v FROM kai_users`;
    return NextResponse.json({
      ingresos: (ingresosR[0].v || 0) + (ingresosP[0].v || 0),
      reservasActivas: activeRes[0].v,
      pedidosHoy: pedidosHoy[0].v,
      clientes: clientes[0].v,
    });
  } catch (e) {
    console.error("admin-stats", e);
    return NextResponse.json({ error: "errGeneric" }, { status: 500 });
  }
}
