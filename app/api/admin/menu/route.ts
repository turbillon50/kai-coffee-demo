import { NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { getAdmin } from "@/lib/auth";

export const runtime = "nodejs";

export async function GET() {
  if (!(await getAdmin())) return NextResponse.json({ error: "forbidden" }, { status: 403 });
  try {
    const rows = await sql`
      SELECT id, name, descr AS desc, price::float8 AS price, tag, badge, activo, orden
      FROM kai_menu ORDER BY orden ASC, id ASC
    `;
    return NextResponse.json({ menu: rows });
  } catch (e) {
    console.error("admin-menu-get", e);
    return NextResponse.json({ menu: [] }, { status: 500 });
  }
}

export async function POST(req: Request) {
  if (!(await getAdmin())) return NextResponse.json({ error: "forbidden" }, { status: 403 });
  try {
    const { name, desc, price, tag, badge } = await req.json();
    if (!name || !tag) return NextResponse.json({ error: "errFields" }, { status: 400 });
    const id = "x" + Date.now().toString(36);
    const maxO = await sql`SELECT COALESCE(MAX(orden),0)::int AS m FROM kai_menu`;
    const rows = await sql`
      INSERT INTO kai_menu (id, name, descr, price, tag, badge, activo, orden)
      VALUES (${id}, ${name}, ${desc || ""}, ${Number(price) || 0}, ${tag}, ${badge || null}, true, ${maxO[0].m + 1})
      RETURNING id, name, descr AS desc, price::float8 AS price, tag, badge, activo, orden
    `;
    return NextResponse.json({ item: rows[0] });
  } catch (e) {
    console.error("admin-menu-post", e);
    return NextResponse.json({ error: "errGeneric" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  if (!(await getAdmin())) return NextResponse.json({ error: "forbidden" }, { status: 403 });
  try {
    const { id, name, desc, price, tag, badge, activo } = await req.json();
    if (!id) return NextResponse.json({ error: "errFields" }, { status: 400 });
    const rows = await sql`
      UPDATE kai_menu SET
        name = COALESCE(${name ?? null}, name),
        descr = COALESCE(${desc ?? null}, descr),
        price = COALESCE(${price ?? null}, price),
        tag = COALESCE(${tag ?? null}, tag),
        badge = ${badge ?? null},
        activo = COALESCE(${activo ?? null}, activo)
      WHERE id = ${id}
      RETURNING id, name, descr AS desc, price::float8 AS price, tag, badge, activo, orden
    `;
    return NextResponse.json({ item: rows[0] });
  } catch (e) {
    console.error("admin-menu-patch", e);
    return NextResponse.json({ error: "errGeneric" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  if (!(await getAdmin())) return NextResponse.json({ error: "forbidden" }, { status: 403 });
  try {
    const { id } = await req.json();
    if (!id) return NextResponse.json({ error: "errFields" }, { status: 400 });
    await sql`DELETE FROM kai_menu WHERE id = ${id}`;
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("admin-menu-delete", e);
    return NextResponse.json({ error: "errGeneric" }, { status: 500 });
  }
}
