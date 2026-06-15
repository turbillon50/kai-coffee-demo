"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { logoDataUri } from "./logo";
import { MENU as MENU_FALLBACK, SPACES, type MenuItem } from "./data";
import {
  IconCup, IconBean, IconLeaf, IconTrophy, IconWifi, IconUsers, IconStar,
  IconChevron, IconClock,
} from "./icons";
import { useUI, ThemeLangToggle, Pill, PrimaryButton, GhostButton, money } from "@/lib/ui";

export const HERO_URL =
  "https://d8j0ntlcm91z4.cloudfront.net/user_3DDb66hXpSaWG4DmoX3Ae5V2dqt/hf_20260615_004633_ccde94f1-8505-4e5e-a353-190e40fb11df.png";

type Tab = "cafe" | "grano" | "comida";

const maxW = 1180;
const fadeUp = {
  initial: { opacity: 0, y: 26 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as const },
};

export default function Landing() {
  const ui = useUI();
  const router = useRouter();
  const { t } = ui;
  const [tab, setTab] = useState<Tab>("cafe");
  const [menu, setMenu] = useState<MenuItem[]>(MENU_FALLBACK);

  useEffect(() => {
    fetch("/api/menu")
      .then((r) => r.json())
      .then((d) => { if (d?.menu?.length) setMenu(d.menu); })
      .catch(() => {});
  }, []);

  const goAuth = () => router.push("/register");
  const goLogin = () => router.push("/login");

  const filtered = useMemo(() => menu.filter((m) => m.tag === tab), [menu, tab]);

  return (
    <main style={{ minHeight: "100vh", background: "var(--k-bg)", color: "var(--k-text)" }}>
      {/* ===== Header ===== */}
      <header
        style={{
          position: "sticky", top: 0, zIndex: 50,
          background: "color-mix(in srgb, var(--k-bg) 82%, transparent)",
          backdropFilter: "blur(14px)", WebkitBackdropFilter: "blur(14px)",
          borderBottom: "1px solid var(--k-border)",
        }}
      >
        <div style={{ maxWidth: maxW, margin: "0 auto", padding: "11px 16px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <img src={logoDataUri} alt="KAI COFFEE" width={38} height={38} style={{ borderRadius: 10, objectFit: "cover", boxShadow: "0 4px 14px var(--k-shadow)" }} />
            <div style={{ lineHeight: 1 }}>
              <div style={{ fontSize: 17, fontWeight: 900, letterSpacing: 1 }}>KAI</div>
              <div style={{ fontSize: 9.5, fontWeight: 700, letterSpacing: 3, color: "var(--k-sub)" }}>COFFEE</div>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <ThemeLangToggle theme={ui.theme} lang={ui.lang} toggleTheme={ui.toggleTheme} toggleLang={ui.toggleLang} />
            <button onClick={goLogin} style={{
              height: 38, padding: "0 16px", borderRadius: 999, fontSize: 13.5, fontWeight: 700,
              color: "#fff", border: "none", background: "linear-gradient(135deg, var(--k-violet), #5b21b6)",
              boxShadow: "0 6px 18px rgba(124,58,237,0.35)",
            }}>{t("login")}</button>
          </div>
        </div>
      </header>

      {/* ===== Hero ===== */}
      <section style={{ position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0 }}>
          <img src={HERO_URL} alt="" onError={(e) => { e.currentTarget.style.display = "none"; }}
            style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, color-mix(in srgb, var(--k-bg) 35%, transparent) 0%, color-mix(in srgb, var(--k-bg) 72%, transparent) 55%, var(--k-bg) 100%)" }} />
        </div>
        <div style={{ position: "relative", maxWidth: maxW, margin: "0 auto", padding: "76px 18px 92px", textAlign: "center" }}>
          <motion.div initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}>
            <div style={{ display: "inline-block", marginBottom: 18 }}>
              <Pill color="var(--k-cyan)">{t("heroEyebrow")}</Pill>
            </div>
            <h1 style={{ fontSize: "clamp(34px, 7vw, 62px)", lineHeight: 1.04, fontWeight: 900, letterSpacing: -1.5, margin: "0 auto 18px", maxWidth: 760, textShadow: "0 2px 30px rgba(0,0,0,0.45)" }}>
              {t("heroTitle")}
            </h1>
            <p style={{ fontSize: "clamp(15px, 2.4vw, 19px)", color: "var(--k-text)", opacity: 0.92, maxWidth: 560, margin: "0 auto 28px", textShadow: "0 1px 12px rgba(0,0,0,0.4)" }}>
              {t("heroSub")}
            </p>
            <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
              <PrimaryButton onClick={() => document.getElementById("menu")?.scrollIntoView({ behavior: "smooth" })}>
                <IconCup size={18} color="#fff" /> {t("heroCtaMenu")}
              </PrimaryButton>
              <GhostButton onClick={() => document.getElementById("spaces")?.scrollIntoView({ behavior: "smooth" })}>
                {t("heroCtaReserve")}
              </GhostButton>
            </div>
            <div style={{ marginTop: 20, fontSize: 12.5, color: "var(--k-sub)", display: "flex", gap: 7, alignItems: "center", justifyContent: "center" }}>
              <span style={{ width: 7, height: 7, borderRadius: 99, background: "var(--k-green)", boxShadow: "0 0 8px var(--k-green)" }} />
              {t("exploreNoLogin")}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ===== Menu ===== */}
      <section id="menu" style={{ maxWidth: maxW, margin: "0 auto", padding: "56px 16px 30px" }}>
        <motion.div {...fadeUp} style={{ textAlign: "center", marginBottom: 26 }}>
          <h2 style={{ fontSize: "clamp(26px,4vw,38px)", fontWeight: 900, letterSpacing: -0.8, margin: "0 0 8px" }}>{t("menuTitle")}</h2>
          <p style={{ color: "var(--k-sub)", fontSize: 15, margin: 0 }}>{t("menuSub")}</p>
        </motion.div>

        <div style={{ display: "flex", gap: 8, justifyContent: "center", marginBottom: 26, flexWrap: "wrap" }}>
          {([["cafe", t("tabCafe"), IconCup], ["grano", t("tabGrano"), IconBean], ["comida", t("tabComida"), IconLeaf]] as const).map(([key, label, Ic]) => {
            const on = tab === key;
            return (
              <button key={key} onClick={() => setTab(key as Tab)} style={{
                display: "inline-flex", alignItems: "center", gap: 7, padding: "10px 18px", borderRadius: 999,
                fontSize: 14, fontWeight: 700,
                color: on ? "#fff" : "var(--k-text)",
                background: on ? "linear-gradient(135deg, var(--k-violet), #5b21b6)" : "var(--k-surface)",
                border: `1px solid ${on ? "transparent" : "var(--k-border)"}`,
                boxShadow: on ? "0 6px 18px rgba(124,58,237,0.32)" : "none",
              }}>
                <Ic size={17} color={on ? "#fff" : "var(--k-violet)"} /> {label}
              </button>
            );
          })}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(270px, 1fr))", gap: 14 }}>
          {filtered.map((m, i) => (
            <motion.div key={m.id}
              initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: i * 0.03 }}
              style={{ background: "var(--k-card)", border: "1px solid var(--k-border)", borderRadius: 16, padding: 16, display: "flex", flexDirection: "column", gap: 8 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10 }}>
                <div style={{ fontSize: 16.5, fontWeight: 800 }}>{m.name}</div>
                {m.badge && <Pill color="var(--k-cyan)">{m.badge}</Pill>}
              </div>
              <div style={{ fontSize: 13.5, color: "var(--k-sub)", lineHeight: 1.45, flex: 1 }}>{m.desc}</div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 4 }}>
                <div style={{ fontSize: 19, fontWeight: 900, color: "var(--k-violet)" }}>{money(m.price)}</div>
                <button onClick={goAuth} style={{
                  display: "inline-flex", alignItems: "center", gap: 6, padding: "9px 14px", borderRadius: 10, fontSize: 13.5, fontWeight: 700,
                  color: "var(--k-text)", background: "var(--k-surface)", border: "1px solid var(--k-border)",
                }}>{t("order")} <IconChevron size={15} color="var(--k-violet)" /></button>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ===== Spaces ===== */}
      <section id="spaces" style={{ maxWidth: maxW, margin: "0 auto", padding: "44px 16px 30px" }}>
        <motion.div {...fadeUp} style={{ textAlign: "center", marginBottom: 26 }}>
          <h2 style={{ fontSize: "clamp(26px,4vw,38px)", fontWeight: 900, letterSpacing: -0.8, margin: "0 0 8px" }}>{t("spacesTitle")}</h2>
          <p style={{ color: "var(--k-sub)", fontSize: 15, margin: 0 }}>{t("spacesSub")}</p>
        </motion.div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(290px, 1fr))", gap: 14 }}>
          {SPACES.map((s, i) => (
            <motion.div key={s.id} {...fadeUp} transition={{ duration: 0.5, delay: i * 0.04 }}
              style={{ background: "var(--k-card)", border: "1px solid var(--k-border)", borderRadius: 18, overflow: "hidden" }}>
              <div style={{ height: 110, background: s.type === "patio"
                ? "linear-gradient(135deg, #0e3b2e, #134e3a)"
                : "linear-gradient(135deg, #2a1d52, #3b2a6e)", position: "relative", display: "flex", alignItems: "flex-end", padding: 14 }}>
                <div style={{ position: "absolute", top: 12, right: 12 }}>
                  <Pill color="var(--k-green)">{t("available")}</Pill>
                </div>
                <div style={{ color: "#fff", fontWeight: 900, fontSize: 18, textShadow: "0 1px 8px rgba(0,0,0,0.5)" }}>{s.name}</div>
              </div>
              <div style={{ padding: 16, display: "flex", flexDirection: "column", gap: 10 }}>
                <div style={{ fontSize: 13.5, color: "var(--k-sub)", lineHeight: 1.45 }}>{s.desc}</div>
                <div style={{ display: "flex", alignItems: "center", gap: 14, fontSize: 13, color: "var(--k-text)" }}>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}><IconUsers size={16} color="var(--k-cyan)" /> {s.capacity} {t("people")}</span>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}><IconClock size={16} color="var(--k-cyan)" /> {t("perHour")}</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 2 }}>
                  <div style={{ fontSize: 19, fontWeight: 900, color: "var(--k-violet)" }}>{money(s.price)}<span style={{ fontSize: 12, color: "var(--k-sub)", fontWeight: 600 }}>{t("perHour")}</span></div>
                  <button onClick={goAuth} style={{
                    padding: "9px 16px", borderRadius: 10, fontSize: 13.5, fontWeight: 700, color: "#fff", border: "none",
                    background: "linear-gradient(135deg, var(--k-violet), #5b21b6)", boxShadow: "0 6px 16px rgba(124,58,237,0.3)",
                  }}>{t("reserve")}</button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ===== Why Kai ===== */}
      <section style={{ maxWidth: maxW, margin: "0 auto", padding: "44px 16px 30px" }}>
        <motion.div {...fadeUp} style={{ textAlign: "center", marginBottom: 28 }}>
          <h2 style={{ fontSize: "clamp(24px,3.6vw,34px)", fontWeight: 900, letterSpacing: -0.6, margin: "0 0 8px" }}>{t("why")}</h2>
          <p style={{ color: "var(--k-sub)", fontSize: 15, margin: 0 }}>{t("whySub")}</p>
        </motion.div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 14 }}>
          {([[IconBean, "val1t", "val1d"], [IconLeaf, "val2t", "val2d"], [IconTrophy, "val3t", "val3d"], [IconWifi, "val4t", "val4d"]] as const).map(([Ic, tk, dk], i) => (
            <motion.div key={tk} {...fadeUp} transition={{ duration: 0.5, delay: i * 0.05 }}
              style={{ background: "var(--k-card)", border: "1px solid var(--k-border)", borderRadius: 16, padding: 20 }}>
              <div style={{ width: 46, height: 46, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", background: "color-mix(in srgb, var(--k-violet) 16%, transparent)", border: "1px solid color-mix(in srgb, var(--k-violet) 30%, transparent)", marginBottom: 14 }}>
                <Ic size={24} color="var(--k-violet)" />
              </div>
              <div style={{ fontSize: 17, fontWeight: 800, marginBottom: 6 }}>{t(tk)}</div>
              <div style={{ fontSize: 13.5, color: "var(--k-sub)", lineHeight: 1.5 }}>{t(dk)}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ===== CTA Banner ===== */}
      <section style={{ maxWidth: maxW, margin: "0 auto", padding: "30px 16px 60px" }}>
        <motion.div {...fadeUp} style={{
          borderRadius: 24, padding: "40px 24px", textAlign: "center", position: "relative", overflow: "hidden",
          background: "linear-gradient(135deg, #2a1d52, #160f2e)", border: "1px solid var(--k-border)",
        }}>
          <div style={{ position: "absolute", top: -60, right: -40, width: 220, height: 220, borderRadius: "50%", background: "radial-gradient(circle, rgba(34,211,238,0.25), transparent 70%)" }} />
          <div style={{ position: "relative" }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 7, marginBottom: 12 }}>
              <IconStar size={18} color="var(--k-amber)" fill="var(--k-amber)" />
              <span style={{ fontSize: 12, fontWeight: 800, letterSpacing: 1.5, color: "var(--k-amber)" }}>KAI REWARDS</span>
            </div>
            <h2 style={{ fontSize: "clamp(22px,3.4vw,32px)", fontWeight: 900, letterSpacing: -0.6, color: "#fff", margin: "0 auto 10px", maxWidth: 520 }}>{t("ctaBannerT")}</h2>
            <p style={{ color: "#cbd5e1", fontSize: 15, margin: "0 auto 22px", maxWidth: 460 }}>{t("ctaBannerD")}</p>
            <PrimaryButton onClick={goAuth}>{t("signupCta")}</PrimaryButton>
          </div>
        </motion.div>
      </section>

      {/* ===== Footer ===== */}
      <footer style={{ borderTop: "1px solid var(--k-border)", padding: "26px 16px", textAlign: "center" }}>
        <div style={{ maxWidth: maxW, margin: "0 auto", display: "flex", flexDirection: "column", gap: 8, alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
            <img src={logoDataUri} alt="" width={30} height={30} style={{ borderRadius: 8 }} />
            <span style={{ fontSize: 15, fontWeight: 900, letterSpacing: 1 }}>KAI COFFEE</span>
          </div>
          <div style={{ fontSize: 12.5, color: "var(--k-muted)" }}>© 2026 KAI COFFEE · Café de especialidad</div>
        </div>
      </footer>
    </main>
  );
}
