"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { logoDataUri } from "../logo";
import { SPACES, NIVELES } from "../data";
import { useUI, ThemeLangToggle, Pill, PrimaryButton, GhostButton, Field, Spinner, money } from "@/lib/ui";
import {
  IconHome, IconCup, IconSpace, IconUser, IconBag, IconPlus, IconMinus, IconCheck,
  IconClock, IconUsers, IconCalendar, IconTrophy, IconStar, IconChevron,
} from "../icons";

type MenuItem = { id: string; name: string; desc: string; price: number; tag: string; badge?: string };
type Me = { id: number; nombre: string; telefono?: string; email: string; puntos: number; nivel: string };
type Pedido = { id: number; items: { name: string; qty: number; price: number }[]; total: number; estado: string; created_at: string };
type Reserva = { id: number; espacio_nombre: string; fecha: string; horas: string; personas: number; total: number; estado: string; created_at: string };

type View = "home" | "order" | "reserve" | "history" | "profile";

function levelInfo(puntos: number) {
  type Nivel = (typeof NIVELES)[number];
  let cur: Nivel = NIVELES[0];
  for (const n of NIVELES) if (puntos >= n.min) cur = n;
  const idx = NIVELES.findIndex((n) => n.nivel === cur.nivel);
  const next = NIVELES[idx + 1];
  const floor = cur.min;
  const ceil = next ? next.min : cur.min;
  const pct = next ? Math.min(100, Math.round(((puntos - floor) / (ceil - floor)) * 100)) : 100;
  return { cur, next, pct, falta: next ? Math.max(0, ceil - puntos) : 0 };
}

export default function ClientApp() {
  const router = useRouter();
  const { theme, lang, t, toggleTheme, toggleLang } = useUI();
  const [me, setMe] = useState<Me | null>(null);
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [view, setView] = useState<View>("home");
  const [booting, setBooting] = useState(true);
  const [toast, setToast] = useState<{ title: string; sub: string } | null>(null);

  async function loadMe() {
    const r = await fetch("/api/me");
    if (r.status === 401) { router.replace("/login"); return null; }
    const d = await r.json();
    setMe(d.user);
    return d.user;
  }
  async function loadOrders() { const d = await (await fetch("/api/pedidos")).json(); setPedidos(d.pedidos || []); }
  async function loadReservas() { const d = await (await fetch("/api/reservas")).json(); setReservas(d.reservas || []); }

  useEffect(() => {
    (async () => {
      const u = await loadMe();
      if (!u) return;
      fetch("/api/menu").then((r) => r.json()).then((d) => setMenu(d.menu || []));
      await Promise.all([loadOrders(), loadReservas()]);
      setBooting(false);
    })();
  }, []);

  function showToast(title: string, sub: string) {
    setToast({ title, sub });
    setTimeout(() => setToast(null), 2600);
  }

  if (booting) {
    return (
      <main style={{ minHeight: "100vh", background: "var(--k-bg)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
          <img src={logoDataUri} alt="" width={56} height={56} style={{ borderRadius: 14 }} />
          <Spinner size={24} />
        </div>
      </main>
    );
  }

  const nav: { k: View; label: string; Icon: typeof IconHome }[] = [
    { k: "home", label: t("home"), Icon: IconHome },
    { k: "order", label: t("order"), Icon: IconCup },
    { k: "reserve", label: t("reserve"), Icon: IconSpace },
    { k: "history", label: t("history"), Icon: IconClock },
    { k: "profile", label: t("profile"), Icon: IconUser },
  ];

  return (
    <main style={{ minHeight: "100vh", background: "var(--k-bg)", color: "var(--k-text)", paddingBottom: 80 }}>
      {/* Top bar */}
      <header style={{ position: "sticky", top: 0, zIndex: 40, background: "color-mix(in srgb, var(--k-bg) 88%, transparent)", backdropFilter: "blur(12px)", borderBottom: "1px solid var(--k-border)" }}>
        <div style={{ maxWidth: 640, margin: "0 auto", padding: "10px 16px", display: "flex", alignItems: "center", gap: 10 }}>
          <img src={logoDataUri} alt="" width={32} height={32} style={{ borderRadius: 9 }} />
          <span style={{ fontWeight: 800, fontSize: 16, flex: 1 }}>KAI</span>
          <ThemeLangToggle theme={theme} lang={lang} toggleTheme={toggleTheme} toggleLang={toggleLang} />
        </div>
      </header>

      <div style={{ maxWidth: 640, margin: "0 auto", padding: "16px 16px 30px" }}>
        <AnimatePresence mode="wait">
          <motion.div key={view} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.25 }}>
            {view === "home" && me && <Home me={me} t={t} pedidos={pedidos} reservas={reservas} go={setView} />}
            {view === "order" && <OrderView menu={menu} t={t} onDone={async (msg) => { await Promise.all([loadMe(), loadOrders()]); showToast(t("orderPlaced"), msg); setView("history"); }} />}
            {view === "reserve" && <ReserveView t={t} onDone={async (msg) => { await Promise.all([loadMe(), loadReservas()]); showToast(t("reservationPlaced"), msg); setView("history"); }} />}
            {view === "history" && <History t={t} pedidos={pedidos} reservas={reservas} />}
            {view === "profile" && me && <Profile me={me} t={t} onSaved={loadMe} onLogout={async () => { await fetch("/api/logout", { method: "POST" }); router.replace("/"); }} />}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 30 }}
            style={{ position: "fixed", bottom: 88, left: "50%", transform: "translateX(-50%)", zIndex: 60, background: "var(--k-card)", border: "1px solid var(--k-violet)", borderRadius: 16, padding: "14px 18px", display: "flex", alignItems: "center", gap: 12, boxShadow: "0 16px 40px var(--k-shadow)", maxWidth: 360, width: "90%" }}>
            <div style={{ width: 38, height: 38, borderRadius: 10, background: "color-mix(in srgb, var(--k-green) 18%, transparent)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <IconCheck size={20} color="var(--k-green)" />
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: 15 }}>{toast.title}</div>
              <div style={{ fontSize: 13, color: "var(--k-sub)" }}>{toast.sub}</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom nav */}
      <nav style={{ position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 50, background: "color-mix(in srgb, var(--k-surface) 95%, transparent)", backdropFilter: "blur(14px)", borderTop: "1px solid var(--k-border)" }} className="pb-safe">
        <div style={{ maxWidth: 640, margin: "0 auto", display: "flex", padding: "8px 6px 0" }}>
          {nav.map(({ k, label, Icon }) => {
            const on = view === k;
            return (
              <button key={k} onClick={() => setView(k)} style={{ flex: 1, background: "transparent", border: "none", display: "flex", flexDirection: "column", alignItems: "center", gap: 3, padding: "4px 0", color: on ? "var(--k-violet)" : "var(--k-muted)" }}>
                <Icon size={22} color={on ? "var(--k-violet)" : "var(--k-muted)"} />
                <span style={{ fontSize: 10.5, fontWeight: on ? 800 : 600 }}>{label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </main>
  );
}

/* ===================== HOME ===================== */
function Home({ me, t, pedidos, reservas, go }: { me: Me; t: (k: string) => string; pedidos: Pedido[]; reservas: Reserva[]; go: (v: View) => void }) {
  const li = levelInfo(me.puntos);
  return (
    <div>
      <div style={{ fontSize: 14, color: "var(--k-sub)", marginBottom: 2 }}>{t("hello")},</div>
      <div style={{ fontSize: 26, fontWeight: 900, letterSpacing: -0.6, marginBottom: 18 }}>{me.nombre.split(" ")[0]} 👋</div>

      {/* Points card */}
      <div style={{ borderRadius: 22, padding: 22, background: "linear-gradient(135deg, var(--k-violet), #4c1d95)", color: "#fff", boxShadow: "0 18px 44px rgba(124,58,237,0.35)", marginBottom: 18 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <div style={{ fontSize: 13, opacity: 0.85 }}>{t("points")}</div>
            <div style={{ fontSize: 40, fontWeight: 900, lineHeight: 1 }}>{me.puntos.toLocaleString("es-MX")}</div>
          </div>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(255,255,255,0.18)", padding: "6px 12px", borderRadius: 999, fontWeight: 800, fontSize: 13 }}>
            <IconTrophy size={16} color="#fff" /> {me.nivel}
          </div>
        </div>
        <div style={{ marginTop: 18 }}>
          <div style={{ height: 8, background: "rgba(255,255,255,0.2)", borderRadius: 99, overflow: "hidden" }}>
            <motion.div initial={{ width: 0 }} animate={{ width: `${li.pct}%` }} transition={{ duration: 0.7 }} style={{ height: "100%", background: "#fff", borderRadius: 99 }} />
          </div>
          <div style={{ fontSize: 12.5, opacity: 0.9, marginTop: 8 }}>
            {li.next ? `${li.falta} ${t("pts")} ${t("toNext")} (${li.next.nivel})` : "Nivel máximo ✦"}
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 22 }}>
        <button onClick={() => go("order")} style={qa()}>
          <IconCup size={26} color="var(--k-violet)" /><span style={{ fontWeight: 800 }}>{t("newOrder")}</span>
        </button>
        <button onClick={() => go("reserve")} style={qa()}>
          <IconSpace size={26} color="var(--k-cyan)" /><span style={{ fontWeight: 800 }}>{t("newReservation")}</span>
        </button>
      </div>

      <SectionLabel>{t("history")}</SectionLabel>
      {pedidos.length === 0 && reservas.length === 0 && (
        <Empty t={t} label={t("noOrders")} />
      )}
      {[...pedidos.slice(0, 2).map((p) => ({ kind: "p" as const, ...p })), ...reservas.slice(0, 2).map((r) => ({ kind: "r" as const, ...r }))].map((x, i) => (
        <ActivityRow key={x.kind + x.id} item={x} t={t} />
      ))}
    </div>
  );
}

function qa(): React.CSSProperties {
  return { background: "var(--k-card)", border: "1px solid var(--k-border)", borderRadius: 18, padding: "20px 14px", display: "flex", flexDirection: "column", alignItems: "center", gap: 10, color: "var(--k-text)", fontSize: 14 };
}

/* ===================== ORDER ===================== */
function OrderView({ menu, t, onDone }: { menu: MenuItem[]; t: (k: string) => string; onDone: (msg: string) => void }) {
  const [tab, setTab] = useState<"cafe" | "grano" | "comida">("cafe");
  const [cart, setCart] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(false);

  const items = menu.filter((m) => m.tag === tab);
  const cartItems = menu.filter((m) => cart[m.id] > 0);
  const total = cartItems.reduce((s, m) => s + m.price * cart[m.id], 0);
  const count = Object.values(cart).reduce((s, n) => s + n, 0);

  const add = (id: string) => setCart((c) => ({ ...c, [id]: (c[id] || 0) + 1 }));
  const sub = (id: string) => setCart((c) => { const n = (c[id] || 0) - 1; const nc = { ...c }; if (n <= 0) delete nc[id]; else nc[id] = n; return nc; });

  async function place() {
    if (count === 0) return;
    setLoading(true);
    const payload = cartItems.map((m) => ({ id: m.id, name: m.name, qty: cart[m.id], price: m.price }));
    const r = await fetch("/api/pedidos", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ items: payload, total }) });
    const d = await r.json();
    setLoading(false);
    if (r.ok) onDone(`+${d.ganados} ${t("pts")}`);
  }

  const tabs: { k: "cafe" | "grano" | "comida"; label: string }[] = [
    { k: "cafe", label: t("tabCafe") }, { k: "grano", label: t("tabGrano") }, { k: "comida", label: t("tabComida") },
  ];

  return (
    <div style={{ paddingBottom: count > 0 ? 90 : 0 }}>
      <h1 style={{ fontSize: 24, fontWeight: 900, letterSpacing: -0.6, margin: "0 0 16px" }}>{t("newOrder")}</h1>
      <div style={{ display: "flex", gap: 8, marginBottom: 18 }}>
        {tabs.map(({ k, label }) => (
          <button key={k} onClick={() => setTab(k)} style={{ flex: 1, padding: "10px 0", borderRadius: 12, fontSize: 14, fontWeight: 700, background: tab === k ? "linear-gradient(135deg, var(--k-violet), #5b21b6)" : "var(--k-surface)", color: tab === k ? "#fff" : "var(--k-sub)", border: tab === k ? "1px solid transparent" : "1px solid var(--k-border)" }}>{label}</button>
        ))}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {items.map((m) => (
          <div key={m.id} style={{ background: "var(--k-card)", border: "1px solid var(--k-border)", borderRadius: 16, padding: 14, display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 800, fontSize: 15 }}>{m.name}</div>
              <div style={{ color: "var(--k-sub)", fontSize: 13, marginTop: 2 }}>{m.desc}</div>
              <div style={{ fontWeight: 900, color: "var(--k-violet)", marginTop: 6 }}>{money(m.price)}</div>
            </div>
            {cart[m.id] ? (
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <button onClick={() => sub(m.id)} style={stepBtn()}><IconMinus size={16} color="var(--k-text)" /></button>
                <span style={{ fontWeight: 800, minWidth: 16, textAlign: "center" }}>{cart[m.id]}</span>
                <button onClick={() => add(m.id)} style={stepBtn(true)}><IconPlus size={16} color="#fff" /></button>
              </div>
            ) : (
              <button onClick={() => add(m.id)} style={stepBtn(true)}><IconPlus size={18} color="#fff" /></button>
            )}
          </div>
        ))}
      </div>

      <AnimatePresence>
        {count > 0 && (
          <motion.div initial={{ y: 80 }} animate={{ y: 0 }} exit={{ y: 80 }}
            style={{ position: "fixed", bottom: 76, left: 0, right: 0, zIndex: 45, padding: "0 16px" }}>
            <div style={{ maxWidth: 640, margin: "0 auto", background: "var(--k-card)", border: "1px solid var(--k-violet)", borderRadius: 18, padding: 14, display: "flex", alignItems: "center", gap: 12, boxShadow: "0 16px 40px var(--k-shadow)" }}>
              <div style={{ position: "relative" }}>
                <IconBag size={26} color="var(--k-violet)" />
                <span style={{ position: "absolute", top: -6, right: -8, background: "var(--k-violet)", color: "#fff", fontSize: 10, fontWeight: 800, borderRadius: 99, padding: "1px 6px" }}>{count}</span>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 12, color: "var(--k-sub)" }}>{t("total")}</div>
                <div style={{ fontWeight: 900, fontSize: 18 }}>{money(total)}</div>
              </div>
              <PrimaryButton onClick={place} disabled={loading}>{loading ? <Spinner /> : t("placeOrder")}</PrimaryButton>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function stepBtn(filled?: boolean): React.CSSProperties {
  return { width: 34, height: 34, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", border: filled ? "none" : "1px solid var(--k-border)", background: filled ? "linear-gradient(135deg, var(--k-violet), #5b21b6)" : "var(--k-surface)" };
}

/* ===================== RESERVE ===================== */
function ReserveView({ t, onDone }: { t: (k: string) => string; onDone: (msg: string) => void }) {
  const [spaceId, setSpaceId] = useState(SPACES[0].id);
  const [fecha, setFecha] = useState("");
  const [hora, setHora] = useState("10:00");
  const [horas, setHoras] = useState(2);
  const [personas, setPersonas] = useState(2);
  const [loading, setLoading] = useState(false);
  const space = SPACES.find((s) => s.id === spaceId)!;
  const total = space.price * horas;

  async function reserve() {
    if (!fecha) return;
    setLoading(true);
    const r = await fetch("/api/reservas", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ espacio_nombre: space.name, fecha, horas: `${hora} · ${horas}h`, personas, total }) });
    const d = await r.json();
    setLoading(false);
    if (r.ok) onDone(`+${d.ganados} ${t("pts")}`);
  }

  return (
    <div>
      <h1 style={{ fontSize: 24, fontWeight: 900, letterSpacing: -0.6, margin: "0 0 16px" }}>{t("newReservation")}</h1>
      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 18 }}>
        {SPACES.map((s) => {
          const on = s.id === spaceId;
          return (
            <button key={s.id} onClick={() => setSpaceId(s.id)} style={{ textAlign: "left", background: "var(--k-card)", border: on ? "2px solid var(--k-violet)" : "1px solid var(--k-border)", borderRadius: 16, padding: 14, display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", background: s.type === "patio" ? "linear-gradient(135deg,#1b5e20,#2e7d32)" : "linear-gradient(135deg,#4a3a7a,#2a1a4a)" }}>
                <IconSpace size={22} color="#fff" />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 800, fontSize: 15, color: "var(--k-text)" }}>{s.name}</div>
                <div style={{ fontSize: 12.5, color: "var(--k-sub)", display: "flex", alignItems: "center", gap: 5 }}><IconUsers size={14} color="var(--k-sub)" /> {s.capacity} · {money(s.price)}{t("perHour")}</div>
              </div>
              {on && <IconCheck size={20} color="var(--k-violet)" />}
            </button>
          );
        })}
      </div>

      <div style={{ background: "var(--k-card)", border: "1px solid var(--k-border)", borderRadius: 18, padding: 18 }}>
        <Field label={t("date")} value={fecha} onChange={setFecha} type="date" />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <Field label={t("time")} value={hora} onChange={setHora} type="time" />
          <Stepper label={t("hours")} value={horas} setValue={setHoras} min={1} max={8} />
        </div>
        <Stepper label={`${t("people")} (${t("capacity")} ${space.capacity})`} value={personas} setValue={(n) => setPersonas(Math.min(n, space.capacity))} min={1} max={space.capacity} />
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", margin: "8px 0 16px", paddingTop: 14, borderTop: "1px solid var(--k-border)" }}>
          <span style={{ color: "var(--k-sub)", fontWeight: 600 }}>{t("total")}</span>
          <span style={{ fontWeight: 900, fontSize: 22, color: "var(--k-violet)" }}>{money(total)}</span>
        </div>
        <PrimaryButton full onClick={reserve} disabled={loading || !fecha}>{loading ? <Spinner /> : t("confirmReservation")}</PrimaryButton>
      </div>
    </div>
  );
}

function Stepper({ label, value, setValue, min, max }: { label: string; value: number; setValue: (n: number) => void; min: number; max: number }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <span style={{ display: "block", fontSize: 13, fontWeight: 600, color: "var(--k-sub)", marginBottom: 6 }}>{label}</span>
      <div style={{ display: "flex", alignItems: "center", gap: 12, height: 48, padding: "0 12px", background: "var(--k-surface)", border: "1px solid var(--k-border)", borderRadius: 12 }}>
        <button onClick={() => setValue(Math.max(min, value - 1))} style={stepBtn()}><IconMinus size={16} color="var(--k-text)" /></button>
        <span style={{ flex: 1, textAlign: "center", fontWeight: 800, fontSize: 16 }}>{value}</span>
        <button onClick={() => setValue(Math.min(max, value + 1))} style={stepBtn(true)}><IconPlus size={16} color="#fff" /></button>
      </div>
    </div>
  );
}

/* ===================== HISTORY ===================== */
function History({ t, pedidos, reservas }: { t: (k: string) => string; pedidos: Pedido[]; reservas: Reserva[] }) {
  return (
    <div>
      <h1 style={{ fontSize: 24, fontWeight: 900, letterSpacing: -0.6, margin: "0 0 18px" }}>{t("history")}</h1>
      <SectionLabel>{t("myOrders")}</SectionLabel>
      {pedidos.length === 0 ? <Empty t={t} label={t("noOrders")} /> : pedidos.map((p) => (
        <div key={p.id} style={card()}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}><IconBag size={18} color="var(--k-violet)" /><span style={{ fontWeight: 800 }}>#{p.id}</span></div>
            <Estado estado={p.estado} t={t} />
          </div>
          <div style={{ fontSize: 13, color: "var(--k-sub)", marginBottom: 8 }}>{(p.items || []).map((it) => `${it.qty}× ${it.name}`).join(", ")}</div>
          <div style={{ fontWeight: 900, color: "var(--k-violet)" }}>{money(p.total)}</div>
        </div>
      ))}
      <div style={{ height: 18 }} />
      <SectionLabel>{t("myReservations")}</SectionLabel>
      {reservas.length === 0 ? <Empty t={t} label={t("noReservations")} /> : reservas.map((r) => (
        <div key={r.id} style={card()}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}><IconSpace size={18} color="var(--k-cyan)" /><span style={{ fontWeight: 800 }}>{r.espacio_nombre}</span></div>
            <Estado estado={r.estado} t={t} />
          </div>
          <div style={{ fontSize: 13, color: "var(--k-sub)", display: "flex", gap: 12, marginBottom: 8 }}>
            <span style={{ display: "inline-flex", gap: 4, alignItems: "center" }}><IconCalendar size={14} color="var(--k-sub)" /> {r.fecha}</span>
            <span style={{ display: "inline-flex", gap: 4, alignItems: "center" }}><IconClock size={14} color="var(--k-sub)" /> {r.horas}</span>
            <span style={{ display: "inline-flex", gap: 4, alignItems: "center" }}><IconUsers size={14} color="var(--k-sub)" /> {r.personas}</span>
          </div>
          <div style={{ fontWeight: 900, color: "var(--k-violet)" }}>{money(r.total)}</div>
        </div>
      ))}
    </div>
  );
}

function ActivityRow({ item, t }: { item: any; t: (k: string) => string }) {
  const isP = item.kind === "p";
  return (
    <div style={card()}>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        {isP ? <IconBag size={20} color="var(--k-violet)" /> : <IconSpace size={20} color="var(--k-cyan)" />}
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 700, fontSize: 14 }}>{isP ? `${t("order")} #${item.id}` : item.espacio_nombre}</div>
          <div style={{ fontSize: 12.5, color: "var(--k-sub)" }}>{isP ? (item.items || []).map((x: any) => x.name).join(", ") : `${item.fecha} · ${item.horas}`}</div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontWeight: 800, color: "var(--k-violet)" }}>{money(item.total)}</div>
          <Estado estado={item.estado} t={t} small />
        </div>
      </div>
    </div>
  );
}

/* ===================== PROFILE ===================== */
function Profile({ me, t, onSaved, onLogout }: { me: Me; t: (k: string) => string; onSaved: () => void; onLogout: () => void }) {
  const [nombre, setNombre] = useState(me.nombre);
  const [telefono, setTelefono] = useState(me.telefono || "");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  async function save() {
    setSaving(true);
    await fetch("/api/me", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ nombre, telefono }) });
    await onSaved();
    setSaving(false); setSaved(true); setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div>
      <h1 style={{ fontSize: 24, fontWeight: 900, letterSpacing: -0.6, margin: "0 0 18px" }}>{t("profile")}</h1>
      <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 20 }}>
        <div style={{ width: 64, height: 64, borderRadius: 18, background: "linear-gradient(135deg, var(--k-violet), #4c1d95)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 900, fontSize: 26 }}>{me.nombre[0]?.toUpperCase()}</div>
        <div>
          <div style={{ fontWeight: 900, fontSize: 19 }}>{me.nombre}</div>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 5, marginTop: 4 }}><Pill color="var(--k-amber)">{me.nivel}</Pill><span style={{ fontSize: 13, color: "var(--k-sub)" }}>{me.puntos} {t("pts")}</span></div>
        </div>
      </div>
      <div style={{ background: "var(--k-card)", border: "1px solid var(--k-border)", borderRadius: 18, padding: 18, marginBottom: 16 }}>
        <Field label={t("name")} value={nombre} onChange={setNombre} />
        <Field label={t("phone")} value={telefono} onChange={setTelefono} type="tel" />
        <Field label={t("email")} value={me.email} onChange={() => {}} />
        <PrimaryButton full onClick={save} disabled={saving}>{saving ? <Spinner /> : saved ? <><IconCheck size={18} color="#fff" /> {t("save")}</> : t("save")}</PrimaryButton>
      </div>
      <GhostButton full onClick={onLogout}>{t("logout")}</GhostButton>
    </div>
  );
}

/* ===================== shared bits ===================== */
function SectionLabel({ children }: { children: React.ReactNode }) {
  return <div style={{ fontSize: 13, fontWeight: 800, textTransform: "uppercase", letterSpacing: 0.6, color: "var(--k-muted)", marginBottom: 10 }}>{children}</div>;
}
function card(): React.CSSProperties {
  return { background: "var(--k-card)", border: "1px solid var(--k-border)", borderRadius: 16, padding: 16, marginBottom: 10 };
}
function Empty({ t, label }: { t: (k: string) => string; label: string }) {
  return <div style={{ textAlign: "center", padding: "30px 0", color: "var(--k-muted)", fontSize: 14 }}>{label}</div>;
}
function Estado({ estado, t, small }: { estado: string; t: (k: string) => string; small?: boolean }) {
  const map: Record<string, string> = { pendiente: "var(--k-amber)", confirmada: "var(--k-green)", cancelada: "var(--k-red)", lista: "var(--k-cyan)", entregado: "var(--k-green)" };
  const color = map[estado] || "var(--k-muted)";
  return <span style={{ fontSize: small ? 11 : 12, fontWeight: 700, color, background: `color-mix(in srgb, ${color} 14%, transparent)`, border: `1px solid color-mix(in srgb, ${color} 35%, transparent)`, padding: "2px 8px", borderRadius: 999 }}>{t(estado)}</span>;
}
