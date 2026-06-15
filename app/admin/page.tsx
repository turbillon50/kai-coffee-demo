"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { logoDataUri } from "../logo";
import { useUI, ThemeLangToggle, Pill, PrimaryButton, GhostButton, Field, Spinner, money } from "@/lib/ui";
import {
  IconChart, IconCalendar, IconUsers, IconCup, IconCheck, IconX, IconPlus, IconTrophy, IconBag, IconClock,
} from "../icons";

type Tab = "dash" | "reservas" | "clientes" | "menu";
type Stats = { ingresos: number; reservasActivas: number; pedidosHoy: number; clientes: number };
type Reserva = { id: number; cliente: string; espacio_nombre: string; fecha: string; horas: string; personas: number; total: number; estado: string };
type Cliente = { id: number; nombre: string; email: string; telefono?: string; puntos: number; nivel: string; pedidos: number; reservas: number };
type MenuItem = { id: string; name: string; desc: string; price: number; tag: string; badge?: string; activo: boolean };

export default function AdminPage() {
  const router = useRouter();
  const { theme, lang, t, toggleTheme, toggleLang } = useUI();
  const [authed, setAuthed] = useState<boolean | null>(null);
  const [pass, setPass] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState<Tab>("dash");

  const [stats, setStats] = useState<Stats | null>(null);
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [menu, setMenu] = useState<MenuItem[]>([]);

  async function loadAll() {
    const s = await fetch("/api/admin/stats");
    if (s.status === 403) { setAuthed(false); return; }
    setStats(await s.json());
    setReservas((await (await fetch("/api/admin/reservas")).json()).reservas || []);
    setClientes((await (await fetch("/api/admin/clientes")).json()).clientes || []);
    setMenu((await (await fetch("/api/admin/menu")).json()).menu || []);
    setAuthed(true);
  }

  useEffect(() => { loadAll(); }, []);

  async function login(e: React.FormEvent) {
    e.preventDefault(); setErr(""); setLoading(true);
    const r = await fetch("/api/admin/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ password: pass }) });
    setLoading(false);
    if (!r.ok) { setErr(t("wrongPassword")); return; }
    await loadAll();
  }

  async function setEstado(id: number, estado: string) {
    await fetch("/api/admin/reservas", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, estado }) });
    setReservas((rs) => rs.map((r) => (r.id === id ? { ...r, estado } : r)));
    const s = await (await fetch("/api/admin/stats")).json(); setStats(s);
  }

  if (authed === null) {
    return <Center><Spinner size={24} /></Center>;
  }

  if (authed === false) {
    return (
      <main style={{ minHeight: "100vh", background: "var(--k-bg)", display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex", justifyContent: "flex-end", padding: 16 }}>
          <ThemeLangToggle theme={theme} lang={lang} toggleTheme={toggleTheme} toggleLang={toggleLang} />
        </div>
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: 18 }}>
          <motion.form onSubmit={login} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            style={{ width: "100%", maxWidth: 400, background: "var(--k-card)", border: "1px solid var(--k-border)", borderRadius: 22, padding: 28 }}>
            <div style={{ display: "flex", justifyContent: "center", marginBottom: 18 }}><img src={logoDataUri} alt="" width={56} height={56} style={{ borderRadius: 14 }} /></div>
            <h1 style={{ fontSize: 22, fontWeight: 900, textAlign: "center", margin: "0 0 6px" }}>{t("adminLogin")}</h1>
            <p style={{ textAlign: "center", color: "var(--k-sub)", fontSize: 14, margin: "0 0 20px" }}>KAI COFFEE</p>
            <Field label={t("adminPass")} value={pass} onChange={setPass} type="password" placeholder="••••••••" />
            {err && <div style={{ color: "var(--k-red)", fontSize: 14, marginBottom: 12 }}>{err}</div>}
            <PrimaryButton type="submit" full disabled={loading}>{loading ? <Spinner /> : t("enter")}</PrimaryButton>
            <p style={{ textAlign: "center", marginTop: 16 }}><a onClick={() => router.push("/")} style={{ color: "var(--k-muted)", fontSize: 13, cursor: "pointer" }}>← {t("back")}</a></p>
          </motion.form>
        </div>
      </main>
    );
  }

  const tabs: { k: Tab; label: string; Icon: typeof IconChart }[] = [
    { k: "dash", label: t("dashboard"), Icon: IconChart },
    { k: "reservas", label: t("manageReservations"), Icon: IconCalendar },
    { k: "clientes", label: t("clients"), Icon: IconUsers },
    { k: "menu", label: t("manageMenu"), Icon: IconCup },
  ];

  return (
    <main style={{ minHeight: "100vh", background: "var(--k-bg)", color: "var(--k-text)" }}>
      <header style={{ position: "sticky", top: 0, zIndex: 40, background: "color-mix(in srgb, var(--k-bg) 88%, transparent)", backdropFilter: "blur(12px)", borderBottom: "1px solid var(--k-border)" }}>
        <div style={{ maxWidth: 960, margin: "0 auto", padding: "12px 18px", display: "flex", alignItems: "center", gap: 10 }}>
          <img src={logoDataUri} alt="" width={32} height={32} style={{ borderRadius: 9 }} />
          <span style={{ fontWeight: 800, fontSize: 16, flex: 1 }}>{t("adminPanel")}</span>
          <ThemeLangToggle theme={theme} lang={lang} toggleTheme={toggleTheme} toggleLang={toggleLang} />
          <button onClick={async () => { await fetch("/api/admin/login", { method: "DELETE" }); setAuthed(false); }} style={{ height: 38, padding: "0 14px", borderRadius: 999, fontSize: 13, fontWeight: 700, background: "var(--k-surface)", border: "1px solid var(--k-border)", color: "var(--k-text)" }}>{t("logout")}</button>
        </div>
        <div style={{ maxWidth: 960, margin: "0 auto", padding: "0 12px 0", display: "flex", gap: 4, overflowX: "auto" }}>
          {tabs.map(({ k, label, Icon }) => {
            const on = tab === k;
            return (
              <button key={k} onClick={() => setTab(k)} style={{ display: "inline-flex", alignItems: "center", gap: 7, padding: "10px 14px", background: "transparent", border: "none", borderBottom: on ? "2px solid var(--k-violet)" : "2px solid transparent", color: on ? "var(--k-violet)" : "var(--k-sub)", fontWeight: 700, fontSize: 14, whiteSpace: "nowrap" }}>
                <Icon size={17} color={on ? "var(--k-violet)" : "var(--k-sub)"} /> {label}
              </button>
            );
          })}
        </div>
      </header>

      <div style={{ maxWidth: 960, margin: "0 auto", padding: "20px 16px 50px" }}>
        <AnimatePresence mode="wait">
          <motion.div key={tab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
            {tab === "dash" && stats && <Dash stats={stats} t={t} reservas={reservas} />}
            {tab === "reservas" && <ReservasTab reservas={reservas} t={t} setEstado={setEstado} />}
            {tab === "clientes" && <ClientesTab clientes={clientes} t={t} />}
            {tab === "menu" && <MenuTab menu={menu} setMenu={setMenu} t={t} />}
          </motion.div>
        </AnimatePresence>
      </div>
    </main>
  );
}

function Dash({ stats, t, reservas }: { stats: Stats; t: (k: string) => string; reservas: Reserva[] }) {
  const kpis = [
    { label: t("revenue"), value: money(stats.ingresos), Icon: IconChart, color: "var(--k-violet)" },
    { label: t("activeReservations"), value: String(stats.reservasActivas), Icon: IconCalendar, color: "var(--k-cyan)" },
    { label: t("ordersToday"), value: String(stats.pedidosHoy), Icon: IconBag, color: "var(--k-amber)" },
    { label: t("totalClients"), value: String(stats.clientes), Icon: IconUsers, color: "var(--k-green)" },
  ];
  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 14, marginBottom: 24 }}>
        {kpis.map((k, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
            style={{ background: "var(--k-card)", border: "1px solid var(--k-border)", borderRadius: 18, padding: 18 }}>
            <div style={{ width: 42, height: 42, borderRadius: 11, background: `color-mix(in srgb, ${k.color} 16%, transparent)`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 12 }}>
              <k.Icon size={22} color={k.color} />
            </div>
            <div style={{ fontSize: 26, fontWeight: 900, letterSpacing: -0.5 }}>{k.value}</div>
            <div style={{ fontSize: 13, color: "var(--k-sub)", marginTop: 2 }}>{k.label}</div>
          </motion.div>
        ))}
      </div>
      <div style={{ fontSize: 13, fontWeight: 800, textTransform: "uppercase", letterSpacing: 0.6, color: "var(--k-muted)", marginBottom: 10 }}>{t("manageReservations")}</div>
      {reservas.slice(0, 5).map((r) => (
        <div key={r.id} style={{ background: "var(--k-card)", border: "1px solid var(--k-border)", borderRadius: 14, padding: 14, marginBottom: 8, display: "flex", alignItems: "center", gap: 12 }}>
          <IconCalendar size={18} color="var(--k-cyan)" />
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 700, fontSize: 14 }}>{r.cliente} · {r.espacio_nombre}</div>
            <div style={{ fontSize: 12.5, color: "var(--k-sub)" }}>{r.fecha} · {r.horas}</div>
          </div>
          <Estado estado={r.estado} t={t} />
        </div>
      ))}
    </div>
  );
}

function ReservasTab({ reservas, t, setEstado }: { reservas: Reserva[]; t: (k: string) => string; setEstado: (id: number, e: string) => void }) {
  if (reservas.length === 0) return <Empty label={t("noReservations")} />;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {reservas.map((r) => (
        <div key={r.id} style={{ background: "var(--k-card)", border: "1px solid var(--k-border)", borderRadius: 16, padding: 16 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
            <div>
              <div style={{ fontWeight: 800, fontSize: 15 }}>{r.cliente}</div>
              <div style={{ fontSize: 13, color: "var(--k-sub)" }}>{r.espacio_nombre}</div>
            </div>
            <Estado estado={r.estado} t={t} />
          </div>
          <div style={{ fontSize: 13, color: "var(--k-sub)", display: "flex", gap: 14, marginBottom: 12, flexWrap: "wrap" }}>
            <span style={{ display: "inline-flex", gap: 4, alignItems: "center" }}><IconCalendar size={14} color="var(--k-sub)" /> {r.fecha}</span>
            <span style={{ display: "inline-flex", gap: 4, alignItems: "center" }}><IconClock size={14} color="var(--k-sub)" /> {r.horas}</span>
            <span style={{ display: "inline-flex", gap: 4, alignItems: "center" }}><IconUsers size={14} color="var(--k-sub)" /> {r.personas}</span>
            <span style={{ fontWeight: 800, color: "var(--k-violet)" }}>{money(r.total)}</span>
          </div>
          {r.estado !== "cancelada" && (
            <div style={{ display: "flex", gap: 8 }}>
              {r.estado !== "confirmada" && (
                <button onClick={() => setEstado(r.id, "confirmada")} style={actBtn("var(--k-green)")}><IconCheck size={16} color="var(--k-green)" /> {t("confirmAction")}</button>
              )}
              <button onClick={() => setEstado(r.id, "cancelada")} style={actBtn("var(--k-red)")}><IconX size={16} color="var(--k-red)" /> {t("cancelAction")}</button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function ClientesTab({ clientes, t }: { clientes: Cliente[]; t: (k: string) => string }) {
  if (clientes.length === 0) return <Empty label="—" />;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {clientes.map((c) => (
        <div key={c.id} style={{ background: "var(--k-card)", border: "1px solid var(--k-border)", borderRadius: 16, padding: 16, display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ width: 46, height: 46, borderRadius: 13, background: "linear-gradient(135deg, var(--k-btn-from), var(--k-btn-to))", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 900, fontSize: 18 }}>{c.nombre[0]?.toUpperCase()}</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontWeight: 800, fontSize: 15 }}>{c.nombre}</div>
            <div style={{ fontSize: 12.5, color: "var(--k-sub)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.email}</div>
            <div style={{ fontSize: 12, color: "var(--k-muted)", marginTop: 2 }}>{c.pedidos} {t("myOrders").toLowerCase()} · {c.reservas} {t("spaces").toLowerCase()}</div>
          </div>
          <div style={{ textAlign: "right" }}>
            <Pill color="var(--k-amber)">{c.nivel}</Pill>
            <div style={{ fontWeight: 800, fontSize: 14, marginTop: 5, display: "flex", alignItems: "center", gap: 4, justifyContent: "flex-end" }}><IconTrophy size={14} color="var(--k-amber)" /> {c.puntos}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

function MenuTab({ menu, setMenu, t }: { menu: MenuItem[]; setMenu: (m: MenuItem[]) => void; t: (k: string) => string }) {
  const [form, setForm] = useState<{ name: string; desc: string; price: string; tag: string; badge: string }>({ name: "", desc: "", price: "", tag: "cafe", badge: "" });
  const [adding, setAdding] = useState(false);
  const [busy, setBusy] = useState(false);

  async function add() {
    if (!form.name) return;
    setBusy(true);
    const r = await fetch("/api/admin/menu", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...form, price: Number(form.price) || 0 }) });
    const d = await r.json();
    setBusy(false);
    if (r.ok) { setMenu([...menu, d.item]); setForm({ name: "", desc: "", price: "", tag: "cafe", badge: "" }); setAdding(false); }
  }
  async function toggle(it: MenuItem) {
    const r = await fetch("/api/admin/menu", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: it.id, activo: !it.activo, badge: it.badge ?? null }) });
    if (r.ok) setMenu(menu.map((m) => (m.id === it.id ? { ...m, activo: !m.activo } : m)));
  }
  async function del(id: string) {
    const r = await fetch("/api/admin/menu", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
    if (r.ok) setMenu(menu.filter((m) => m.id !== id));
  }

  const tags = [{ k: "cafe", l: t("tabCafe") }, { k: "grano", l: t("tabGrano") }, { k: "comida", l: t("tabComida") }];

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 14 }}>
        <PrimaryButton onClick={() => setAdding((v) => !v)}><IconPlus size={18} color="#fff" /> {t("addItem")}</PrimaryButton>
      </div>
      <AnimatePresence>
        {adding && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
            style={{ overflow: "hidden", marginBottom: 16 }}>
            <div style={{ background: "var(--k-card)", border: "1px solid var(--k-border)", borderRadius: 18, padding: 18 }}>
              <Field label={t("name")} value={form.name} onChange={(v) => setForm({ ...form, name: v })} />
              <Field label="Desc" value={form.desc} onChange={(v) => setForm({ ...form, desc: v })} />
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <Field label="$" value={form.price} onChange={(v) => setForm({ ...form, price: v })} type="number" />
                <Field label="Badge" value={form.badge} onChange={(v) => setForm({ ...form, badge: v })} />
              </div>
              <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
                {tags.map((tg) => (
                  <button key={tg.k} onClick={() => setForm({ ...form, tag: tg.k })} style={{ flex: 1, padding: "10px 0", borderRadius: 10, fontWeight: 700, fontSize: 13, background: form.tag === tg.k ? "var(--k-violet)" : "var(--k-surface)", color: form.tag === tg.k ? "#fff" : "var(--k-sub)", border: "1px solid var(--k-border)" }}>{tg.l}</button>
                ))}
              </div>
              <PrimaryButton full onClick={add} disabled={busy}>{busy ? <Spinner /> : t("save")}</PrimaryButton>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {menu.map((it) => (
          <div key={it.id} style={{ background: "var(--k-card)", border: "1px solid var(--k-border)", borderRadius: 16, padding: 14, display: "flex", alignItems: "center", gap: 12, opacity: it.activo ? 1 : 0.5 }}>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontWeight: 800, fontSize: 15 }}>{it.name}</span>
                {it.badge && <Pill color="var(--k-amber)">{it.badge}</Pill>}
              </div>
              <div style={{ fontSize: 12.5, color: "var(--k-sub)", marginTop: 2 }}>{it.desc}</div>
              <div style={{ fontWeight: 800, color: "var(--k-violet)", marginTop: 4 }}>{money(it.price)}</div>
            </div>
            <button onClick={() => toggle(it)} style={actBtn(it.activo ? "var(--k-green)" : "var(--k-muted)")}>{it.activo ? t("active") : t("inactive")}</button>
            <button onClick={() => del(it.id)} style={{ width: 38, height: 38, borderRadius: 10, border: "1px solid color-mix(in srgb, var(--k-red) 35%, transparent)", background: "color-mix(in srgb, var(--k-red) 12%, transparent)", display: "flex", alignItems: "center", justifyContent: "center" }}><IconX size={16} color="var(--k-red)" /></button>
          </div>
        ))}
      </div>
    </div>
  );
}

/* shared */
function Center({ children }: { children: React.ReactNode }) {
  return <main style={{ minHeight: "100vh", background: "var(--k-bg)", display: "flex", alignItems: "center", justifyContent: "center" }}>{children}</main>;
}
function Empty({ label }: { label: string }) {
  return <div style={{ textAlign: "center", padding: "40px 0", color: "var(--k-muted)", fontSize: 14 }}>{label}</div>;
}
function actBtn(color: string): React.CSSProperties {
  return { display: "inline-flex", alignItems: "center", gap: 6, padding: "8px 12px", borderRadius: 10, fontSize: 13, fontWeight: 700, color, background: `color-mix(in srgb, ${color} 12%, transparent)`, border: `1px solid color-mix(in srgb, ${color} 30%, transparent)` };
}
function Estado({ estado, t }: { estado: string; t: (k: string) => string }) {
  const map: Record<string, string> = { pendiente: "var(--k-amber)", confirmada: "var(--k-green)", cancelada: "var(--k-red)" };
  const color = map[estado] || "var(--k-muted)";
  return <span style={{ fontSize: 12, fontWeight: 700, color, background: `color-mix(in srgb, ${color} 14%, transparent)`, border: `1px solid color-mix(in srgb, ${color} 35%, transparent)`, padding: "2px 9px", borderRadius: 999 }}>{t(estado)}</span>;
}
