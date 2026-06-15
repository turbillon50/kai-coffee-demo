"use client";

import React, { useCallback, useEffect, useState } from "react";
import { Lang, tr } from "./i18n";

/* ============ Theme + Lang hook ============ */
export function useUI() {
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [lang, setLang] = useState<Lang>("es");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const th = (localStorage.getItem("kai_theme") as "dark" | "light") || "dark";
    const lg = (localStorage.getItem("kai_lang") as Lang) || "es";
    setTheme(th);
    setLang(lg);
    document.documentElement.setAttribute("data-theme", th);
    document.documentElement.lang = lg;
    setMounted(true);
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => {
      const next = prev === "dark" ? "light" : "dark";
      localStorage.setItem("kai_theme", next);
      document.documentElement.setAttribute("data-theme", next);
      return next;
    });
  }, []);

  const toggleLang = useCallback(() => {
    setLang((prev) => {
      const next: Lang = prev === "es" ? "en" : "es";
      localStorage.setItem("kai_lang", next);
      document.documentElement.lang = next;
      return next;
    });
  }, []);

  const t = useCallback((key: string) => tr(key, lang), [lang]);

  return { theme, lang, t, toggleTheme, toggleLang, mounted };
}

/* ============ Icons (extra, theme/lang) ============ */
export const SunIcon = ({ size = 20 }: { size?: number }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round">
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M19.1 4.9l-1.4 1.4M6.3 17.7l-1.4 1.4" />
  </svg>
);
export const MoonIcon = ({ size = 20 }: { size?: number }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
  </svg>
);

/* ============ Theme / Lang toggle controls ============ */
export function ThemeLangToggle({
  theme, lang, toggleTheme, toggleLang, compact,
}: {
  theme: "dark" | "light"; lang: Lang;
  toggleTheme: () => void; toggleLang: () => void; compact?: boolean;
}) {
  const btn: React.CSSProperties = {
    display: "flex", alignItems: "center", justifyContent: "center",
    gap: 6, height: 38, minWidth: 38, padding: "0 10px",
    background: "var(--k-surface)", border: "1px solid var(--k-border)",
    borderRadius: 999, color: "var(--k-text)", fontSize: 13, fontWeight: 700,
  };
  return (
    <div style={{ display: "flex", gap: 8 }}>
      <button onClick={toggleLang} style={btn} aria-label="language">
        <span style={{ color: lang === "es" ? "var(--k-violet)" : "var(--k-muted)" }}>ES</span>
        <span style={{ color: "var(--k-muted)" }}>|</span>
        <span style={{ color: lang === "en" ? "var(--k-violet)" : "var(--k-muted)" }}>EN</span>
      </button>
      <button onClick={toggleTheme} style={btn} aria-label="theme">
        {theme === "dark" ? <SunIcon /> : <MoonIcon />}
      </button>
    </div>
  );
}

/* ============ Shared primitives (CSS var driven) ============ */
export function Pill({ children, color = "var(--k-violet)" }: { children: React.ReactNode; color?: string }) {
  return (
    <span style={{
      fontSize: 11, fontWeight: 700, letterSpacing: 0.3, color,
      background: "color-mix(in srgb, " + color + " 14%, transparent)",
      border: "1px solid color-mix(in srgb, " + color + " 35%, transparent)",
      padding: "3px 9px", borderRadius: 999, whiteSpace: "nowrap",
    }}>{children}</span>
  );
}

export function PrimaryButton({
  children, onClick, full, disabled, type = "button",
}: {
  children: React.ReactNode; onClick?: () => void; full?: boolean; disabled?: boolean; type?: "button" | "submit";
}) {
  return (
    <button type={type} onClick={onClick} disabled={disabled} style={{
      width: full ? "100%" : "auto",
      background: disabled ? "var(--k-muted)" : "linear-gradient(135deg, var(--k-btn-from), var(--k-btn-to))",
      color: "#fff", border: "none", borderRadius: 12,
      padding: "14px 20px", fontSize: 15, fontWeight: 700,
      opacity: disabled ? 0.6 : 1,
      boxShadow: disabled ? "none" : "0 8px 24px var(--k-glow)",
      display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8,
    }}>{children}</button>
  );
}

export function GhostButton({ children, onClick, full }: { children: React.ReactNode; onClick?: () => void; full?: boolean }) {
  return (
    <button onClick={onClick} style={{
      width: full ? "100%" : "auto",
      background: "transparent", color: "var(--k-text)",
      border: "1px solid var(--k-border)", borderRadius: 12,
      padding: "13px 18px", fontSize: 15, fontWeight: 700,
      display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8,
    }}>{children}</button>
  );
}

export function Field({
  label, value, onChange, type = "text", placeholder,
}: {
  label: string; value: string; onChange: (v: string) => void; type?: string; placeholder?: string;
}) {
  return (
    <label style={{ display: "block", marginBottom: 14 }}>
      <span style={{ display: "block", fontSize: 13, fontWeight: 600, color: "var(--k-sub)", marginBottom: 6 }}>{label}</span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        type={type}
        placeholder={placeholder}
        style={{
          width: "100%", height: 48, padding: "0 14px",
          background: "var(--k-surface)", border: "1px solid var(--k-border)",
          borderRadius: 12, color: "var(--k-text)", fontSize: 15, outline: "none",
        }}
      />
    </label>
  );
}

export function Spinner({ size = 18 }: { size?: number }) {
  return (
    <span className="kai-spin" style={{
      width: size, height: size, borderRadius: "50%",
      border: "2px solid rgba(255,255,255,0.35)", borderTopColor: "#fff", display: "inline-block",
    }} />
  );
}

export const money = (n: number) =>
  "$" + Number(n).toLocaleString("es-MX", { minimumFractionDigits: 0, maximumFractionDigits: 0 });
