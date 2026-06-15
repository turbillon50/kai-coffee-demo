import { NextResponse } from "next/server";
import { sql } from "@/lib/db";

export const runtime = "nodejs";

export async function GET() {
  try {
    const rows = await sql`
      SELECT id, name, descr AS desc, price::float8 AS price, tag, badge, activo
      FROM kai_menu WHERE activo = true ORDER BY orden ASC, id ASC
    `;
    return NextResponse.json({ menu: rows });
  } catch (e) {
    console.error("menu", e);
    return NextResponse.json({ menu: [] }, { status: 500 });
  }
}
