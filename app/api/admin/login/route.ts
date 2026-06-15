import { NextResponse } from "next/server";
import { signAdmin, ADMIN_COOKIE } from "@/lib/auth";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const { password } = await req.json();
    const expected = process.env.ADMIN_PASSWORD || "kai-admin-2026";
    if (!password || String(password) !== expected) {
      return NextResponse.json({ error: "wrongPassword" }, { status: 401 });
    }
    const token = await signAdmin();
    const res = NextResponse.json({ ok: true });
    res.cookies.set(ADMIN_COOKIE, token, {
      httpOnly: true, secure: true, sameSite: "lax", path: "/", maxAge: 60 * 60 * 24,
    });
    return res;
  } catch (e) {
    console.error("admin-login", e);
    return NextResponse.json({ error: "errGeneric" }, { status: 500 });
  }
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_COOKIE, "", { httpOnly: true, path: "/", maxAge: 0 });
  return res;
}
