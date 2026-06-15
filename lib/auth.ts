import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const secret = new TextEncoder().encode(
  process.env.JWT_SECRET || "kai-coffee-dev-secret-change-me-please-0001"
);

export const USER_COOKIE = "kai_session";
export const ADMIN_COOKIE = "kai_admin";

export type SessionPayload = { uid: number; email: string; nombre: string };

export async function signSession(payload: SessionPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("30d")
    .sign(secret);
}

export async function signAdmin(): Promise<string> {
  return new SignJWT({ role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("1d")
    .sign(secret);
}

export async function verifySession(token: string | undefined): Promise<SessionPayload | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secret);
    if (typeof payload.uid !== "number") return null;
    return { uid: payload.uid as number, email: payload.email as string, nombre: payload.nombre as string };
  } catch {
    return null;
  }
}

export async function verifyAdmin(token: string | undefined): Promise<boolean> {
  if (!token) return false;
  try {
    const { payload } = await jwtVerify(token, secret);
    return payload.role === "admin";
  } catch {
    return false;
  }
}

// Helpers para route handlers
export async function getSession(): Promise<SessionPayload | null> {
  const c = await cookies();
  return verifySession(c.get(USER_COOKIE)?.value);
}

export async function getAdmin(): Promise<boolean> {
  const c = await cookies();
  return verifyAdmin(c.get(ADMIN_COOKIE)?.value);
}

// Cálculo de nivel de lealtad a partir de puntos
export function nivelFromPuntos(puntos: number): string {
  if (puntos >= 2800) return "Platinum";
  if (puntos >= 1500) return "Gold";
  if (puntos >= 500) return "Silver";
  return "Bronze";
}
