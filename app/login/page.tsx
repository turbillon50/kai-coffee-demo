"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useUI, Field, PrimaryButton, Spinner } from "@/lib/ui";
import { Shell } from "../register/page";

export default function LoginPage() {
  const router = useRouter();
  const { theme, lang, t, toggleTheme, toggleLang } = useUI();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr("");
    if (!email || !password) { setErr(t("errFields")); return; }
    setLoading(true);
    try {
      const r = await fetch("/api/login", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
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
      <h1 style={{ fontSize: 26, fontWeight: 900, letterSpacing: -0.8, margin: "0 0 22px" }}>{t("welcomeBack")}</h1>
      <form onSubmit={submit}>
        <Field label={t("email")} value={email} onChange={setEmail} type="email" placeholder="tu@correo.com" />
        <Field label={t("password")} value={password} onChange={setPassword} type="password" placeholder="••••••••" />
        {err && <div style={{ color: "var(--k-red)", fontSize: 14, marginBottom: 12 }}>{err}</div>}
        <div style={{ marginTop: 6 }}>
          <PrimaryButton type="submit" full disabled={loading}>{loading ? <Spinner /> : t("loginCta")}</PrimaryButton>
        </div>
      </form>
      <p style={{ textAlign: "center", marginTop: 18, fontSize: 14, color: "var(--k-sub)" }}>
        {t("noAccount")}{" "}
        <a onClick={() => router.push("/register")} style={{ color: "var(--k-violet)", fontWeight: 700, cursor: "pointer" }}>{t("signupCta")}</a>
      </p>
    </Shell>
  );
}
