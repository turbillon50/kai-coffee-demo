import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { sql } from "@/lib/db";
import { signSession, USER_COOKIE } from "@/lib/auth";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();
    if (!email || !password) return NextResponse.json({ error: "errFields" }, { status: 400 });
    const mail = String(email).trim().toLowerCase();

    const rows = await sql`SELECT id, nombre, email, password_hash, puntos, nivel FROM kai_users WHERE email = ${mail}`;
    if (rows.length === 0) return NextResponse.json({ error: "errBadLogin" }, { status: 401 });

    const u = rows[0];
    const ok = await bcrypt.compare(String(password), u.password_hash);
    if (!ok) return NextResponse.json({ error: "errBadLogin" }, { status: 401 });

    const token = await signSession({ uid: u.id, email: u.email, nombre: u.nombre });
    const res = NextResponse.json({ user: { id: u.id, nombre: u.nombre, email: u.email, puntos: u.puntos, nivel: u.nivel } });
    res.cookies.set(USER_COOKIE, token, {
      httpOnly: true, secure: true, sameSite: "lax", path: "/", maxAge: 60 * 60 * 24 * 30,
    });
    return res;
  } catch (e) {
    console.error("login", e);
    return NextResponse.json({ error: "errGeneric" }, { status: 500 });
  }
}
