"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { logoDataUri } from "../logo";
import { useUI, ThemeLangToggle, Field, PrimaryButton, Spinner } from "@/lib/ui";
import { IconArrowLeft } from "../icons";

export default function RegisterPage() {
  const router = useRouter();
  const { theme, lang, t, toggleTheme, toggleLang } = useUI();
  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr("");
    if (!nombre || !email || !password) { setErr(t("errFields")); return; }
    setLoading(true);
    try {
      const r = await fetch("/api/register", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre, telefono, email, password }),
      });
      const d = await r.json();
      if (!r.ok) { setErr(t(d.error || "errGeneric")); setLoading(false); return; }
      router.push("/app");
    } catch {
      setErr(t("errGeneric")); setLoading(false);
    }
  }

  return (
    <Shell theme={theme} lang={lang} toggleTheme={toggleTheme} toggleLang={toggleLang} onBack={() => router.push("/")}>
      <h1 style={{ fontSize: 26, fontWeight: 900, letterSpacing: -0.8, margin: "0 0 22px" }}>{t("createAccount")}</h1>
      <form onSubmit={submit}>
        <Field label={t("name")} value={nombre} onChange={setNombre} placeholder="Ana López" />
        <Field label={t("phone")} value={telefono} onChange={setTelefono} type="tel" placeholder="+52 ..." />
        <Field label={t("email")} value={email} onChange={setEmail} type="email" placeholder="tu@correo.com" />
        <Field label={t("password")} value={password} onChange={setPassword} type="password" placeholder="••••••••" />
        {err && <div style={{ color: "var(--k-red)", fontSize: 14, marginBottom: 12 }}>{err}</div>}
        <div style={{ marginTop: 6 }}>
          <PrimaryButton type="submit" full disabled={loading}>{loading ? <Spinner /> : t("signupCta")}</PrimaryButton>
        </div>
      </form>
      <p style={{ textAlign: "center", marginTop: 18, fontSize: 14, color: "var(--k-sub)" }}>
        {t("haveAccount")}{" "}
        <a onClick={() => router.push("/login")} style={{ color: "var(--k-violet)", fontWeight: 700, cursor: "pointer" }}>{t("loginCta")}</a>
      </p>
    </Shell>
  );
}

export function Shell({
  children, theme, lang, toggleTheme, toggleLang, onBack,
}: {
  children: React.ReactNode; theme: "dark" | "light"; lang: "es" | "en";
  toggleTheme: () => void; toggleLang: () => void; onBack: () => void;
}) {
  return (
    <main style={{ minHeight: "100vh", background: "var(--k-bg)", display: "flex", flexDirection: "column" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 18px" }}>
        <button onClick={onBack} style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "transparent", border: "none", color: "var(--k-sub)", fontSize: 14, fontWeight: 600 }}>
          <IconArrowLeft size={20} color="var(--k-sub)" />
        </button>
        <ThemeLangToggle theme={theme} lang={lang} toggleTheme={toggleTheme} toggleLang={toggleLang} />
      </div>
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "10px 18px 40px" }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
          style={{ width: "100%", maxWidth: 420, background: "var(--k-card)", border: "1px solid var(--k-border)", borderRadius: 22, padding: "30px 26px", boxShadow: "0 24px 60px var(--k-shadow)" }}>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 22 }}>
            <img src={logoDataUri} alt="Kai Coffee" width={64} height={64} style={{ borderRadius: 16 }} />
          </div>
          {children}
        </motion.div>
      </div>
    </main>
  );
}
