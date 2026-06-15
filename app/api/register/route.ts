import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { sql } from "@/lib/db";
import { signSession, USER_COOKIE } from "@/lib/auth";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const { nombre, telefono, email, password } = await req.json();
    if (!nombre || !email || !password) {
      return NextResponse.json({ error: "errFields" }, { status: 400 });
    }
    const mail = String(email).trim().toLowerCase();

    const existing = await sql`SELECT id FROM kai_users WHERE email = ${mail}`;
    if (existing.length > 0) {
      return NextResponse.json({ error: "errEmailUsed" }, { status: 409 });
    }

    const hash = await bcrypt.hash(String(password), 10);
    const rows = await sql`
      INSERT INTO kai_users (nombre, telefono, email, password_hash, puntos, nivel)
      VALUES (${nombre}, ${telefono || null}, ${mail}, ${hash}, 50, 'Bronze')
      RETURNING id, nombre, email, puntos, nivel
    `;
    const u = rows[0];
    const token = await signSession({ uid: u.id, email: u.email, nombre: u.nombre });

    const res = NextResponse.json({ user: u });
    res.cookies.set(USER_COOKIE, token, {
      httpOnly: true, secure: true, sameSite: "lax", path: "/", maxAge: 60 * 60 * 24 * 30,
    });
    return res;
  } catch (e) {
    console.error("register", e);
    return NextResponse.json({ error: "errGeneric" }, { status: 500 });
  }
}
