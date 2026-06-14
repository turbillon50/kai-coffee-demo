"use client";

import React, { useMemo, useState } from "react";
import { C, money, moneyShort } from "./theme";
import { logoDataUri } from "./logo";
import {
  MENU, SPACES, RESERVATIONS, CUSTOMERS, POINTS_HISTORY, NIVELES, ME,
  type MenuItem, type Space, type Reservation,
} from "./data";
import {
  IconHome, IconCup, IconSpace, IconStar, IconUser, IconBag, IconPlus, IconMinus,
  IconCheck, IconX, IconClock, IconUsers, IconCalendar, IconChart, IconGrid,
  IconBean, IconChevron, IconArrowLeft, IconLeaf, IconWifi, IconTrophy,
} from "./icons";

type Mode = "publico" | "cliente" | "admin";

/* ============================ helpers UI ============================ */

const radius = 16;

const cardStyle: React.CSSProperties = {
  background: C.card,
  border: `1px solid ${C.border}`,
  borderRadius: radius,
};

function Pill({ children, color = C.violet }: { children: React.ReactNode; color?: string }) {
  return (
    <span style={{
      fontSize: 11, fontWeight: 700, letterSpacing: 0.3, color,
      background: color + "1f", border: `1px solid ${color}40`,
      padding: "3px 9px", borderRadius: 999, whiteSpace: "nowrap",
    }}>{children}</span>
  );
}

function SectionTitle({ children, sub }: { children: React.ReactNode; sub?: string }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ fontSize: 19, fontWeight: 800, letterSpacing: -0.3 }}>{children}</div>
      {sub && <div style={{ fontSize: 13, color: C.sub, marginTop: 3 }}>{sub}</div>}
    </div>
  );
}

function PrimaryButton({ children, onClick, full, disabled }: { children: React.ReactNode; onClick?: () => void; full?: boolean; disabled?: boolean }) {
  return (
    <button onClick={onClick} disabled={disabled} style={{
      width: full ? "100%" : "auto",
      background: disabled ? C.muted : `linear-gradient(135deg, ${C.violet}, #5b21b6)`,
      color: "#fff", border: "none", borderRadius: 12,
      padding: "14px 20px", fontSize: 15, fontWeight: 700,
      opacity: disabled ? 0.6 : 1,
      boxShadow: disabled ? "none" : `0 8px 24px ${C.violet}40`,
    }}>{children}</button>
  );
}

function GhostButton({ children, onClick, color = C.text }: { children: React.ReactNode; onClick?: () => void; color?: string }) {
  return (
    <button onClick={onClick} style={{
      background: "transparent", color, border: `1px solid ${C.border}`,
      borderRadius: 12, padding: "12px 16px", fontSize: 14, fontWeight: 600,
    }}>{children}</button>
  );
}

/* ============================ logo + header ============================ */

function BrandLogo({ size = 40 }: { size?: number }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: 12, overflow: "hidden",
      border: `1px solid ${C.border}`, background: "#fff", flexShrink: 0,
    }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={logoDataUri} alt="Kai Coffee" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
    </div>
  );
}

function TopBar({ title, right, onBack }: { title: string; right?: React.ReactNode; onBack?: () => void }) {
  return (
    <div style={{
      position: "sticky", top: 0, zIndex: 20,
      background: "rgba(10,8,20,0.82)", backdropFilter: "blur(12px)",
      borderBottom: `1px solid ${C.border}`,
      display: "flex", alignItems: "center", gap: 12,
      padding: "14px 18px",
    }}>
      {onBack ? (
        <button onClick={onBack} style={{ background: "none", border: "none", color: C.text, padding: 0, display: "flex" }}>
          <IconArrowLeft size={22} color={C.text} />
        </button>
      ) : <BrandLogo size={36} />}
      <div style={{ fontSize: 16, fontWeight: 800, flex: 1, letterSpacing: -0.2 }}>{title}</div>
      {right}
    </div>
  );
}

/* ============================ bottom nav ============================ */

function BottomNav({ items, active, onChange }: {
  items: { key: string; label: string; icon: (p: { size?: number; color?: string }) => React.ReactNode }[];
  active: string; onChange: (k: string) => void;
}) {
  return (
    <div style={{
      position: "sticky", bottom: 0, zIndex: 20,
      background: "rgba(16,13,30,0.92)", backdropFilter: "blur(12px)",
      borderTop: `1px solid ${C.border}`,
      display: "flex", padding: "8px 6px calc(10px + env(safe-area-inset-bottom))",
    }}>
      {items.map((it) => {
        const on = it.key === active;
        return (
          <button key={it.key} onClick={() => onChange(it.key)} style={{
            flex: 1, background: "none", border: "none",
            display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
            color: on ? C.violet : C.muted, padding: "6px 0",
          }}>
            {it.icon({ size: 23, color: on ? C.violet : C.muted })}
            <span style={{ fontSize: 11, fontWeight: on ? 700 : 500 }}>{it.label}</span>
          </button>
        );
      })}
    </div>
  );
}

/* ============================ modal + toast ============================ */

function Modal({ open, onClose, children }: { open: boolean; onClose: () => void; children: React.ReactNode }) {
  if (!open) return null;
  return (
    <div onClick={onClose} style={{
      position: "fixed", inset: 0, zIndex: 60,
      background: "rgba(3,2,10,0.7)", backdropFilter: "blur(4px)",
      display: "flex", alignItems: "flex-end", justifyContent: "center",
    }}>
      <div onClick={(e) => e.stopPropagation()} style={{
        width: "100%", maxWidth: 480,
        background: C.surface, borderTop: `1px solid ${C.border}`,
        borderRadius: "22px 22px 0 0", padding: 22,
        boxShadow: "0 -20px 60px rgba(0,0,0,0.5)",
        maxHeight: "88vh", overflowY: "auto",
      }}>
        <div style={{ width: 40, height: 4, background: C.border, borderRadius: 99, margin: "0 auto 18px" }} />
        {children}
      </div>
    </div>
  );
}

function Toast({ msg }: { msg: string | null }) {
  if (!msg) return null;
  return (
    <div style={{
      position: "fixed", bottom: 96, left: "50%", transform: "translateX(-50%)",
      zIndex: 80, background: C.green, color: "#04140e",
      padding: "12px 20px", borderRadius: 999, fontSize: 14, fontWeight: 700,
      display: "flex", alignItems: "center", gap: 8,
      boxShadow: `0 10px 30px ${C.green}55`, maxWidth: 440,
    }}>
      <IconCheck size={18} color="#04140e" /> {msg}
    </div>
  );
}

/* ============================ PUBLICO · HOME ============================ */

function HomeScreen({ goMenu, goSpaces }: { goMenu: () => void; goSpaces: () => void }) {
  const features = [
    { icon: IconBean, title: "Grano de especialidad", desc: "Tostado en casa, origen rastreado" },
    { icon: IconSpace, title: "Espacios para trabajar", desc: "Salones y patios reservables" },
    { icon: IconTrophy, title: "Programa de lealtad", desc: "Acumula puntos en cada visita" },
    { icon: IconLeaf, title: "Ingredientes frescos", desc: "Repostería horneada cada mañana" },
  ];
  const previews = SPACES.slice(0, 4);
  return (
    <div style={{ padding: 18, paddingBottom: 24 }}>
      {/* hero */}
      <div style={{
        position: "relative", overflow: "hidden", borderRadius: 22, padding: "30px 22px 26px",
        background: `radial-gradient(120% 120% at 80% 0%, ${C.violet}33, transparent 60%), linear-gradient(160deg, ${C.card}, ${C.surface})`,
        border: `1px solid ${C.border}`, marginBottom: 22,
      }}>
        <div style={{
          position: "absolute", top: -60, right: -40, width: 180, height: 180,
          background: C.cyan + "22", filter: "blur(50px)", borderRadius: "50%",
        }} />
        <BrandLogo size={64} />
        <div style={{ fontSize: 30, fontWeight: 900, letterSpacing: -1, lineHeight: 1.08, marginTop: 16 }}>
          El café que<br />despierta tu día
        </div>
        <div style={{ fontSize: 14, color: C.sub, marginTop: 10, lineHeight: 1.5, maxWidth: 320 }}>
          Café de especialidad, grano selecto para llevar y espacios diseñados para tu mejor momento.
        </div>
        <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
          <PrimaryButton onClick={goMenu}>Ver menú</PrimaryButton>
          <GhostButton onClick={goSpaces} color={C.cyan}>Reservar espacio</GhostButton>
        </div>
      </div>

      {/* feature cards */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 24 }}>
        {features.map((f, i) => (
          <div key={i} style={{ ...cardStyle, padding: 16 }}>
            <div style={{
              width: 40, height: 40, borderRadius: 11, display: "flex", alignItems: "center", justifyContent: "center",
              background: C.violet + "1f", border: `1px solid ${C.violet}3a`, marginBottom: 12,
            }}>
              <f.icon size={21} color={C.cyan} />
            </div>
            <div style={{ fontSize: 14, fontWeight: 700 }}>{f.title}</div>
            <div style={{ fontSize: 12, color: C.sub, marginTop: 4, lineHeight: 1.4 }}>{f.desc}</div>
          </div>
        ))}
      </div>

      {/* preview espacios */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
        <div style={{ fontSize: 18, fontWeight: 800 }}>Nuestros espacios</div>
        <button onClick={goSpaces} style={{ background: "none", border: "none", color: C.cyan, fontSize: 13, fontWeight: 700, display: "flex", alignItems: "center", gap: 2 }}>
          Ver todos <IconChevron size={16} color={C.cyan} />
        </button>
      </div>
      <div style={{ display: "flex", gap: 12, overflowX: "auto", paddingBottom: 4, margin: "0 -18px", padding: "0 18px" }}>
        {previews.map((s) => (
          <div key={s.id} onClick={goSpaces} style={{
            ...cardStyle, minWidth: 190, padding: 0, overflow: "hidden", cursor: "pointer",
          }}>
            <div style={{
              height: 96, background: s.type === "patio"
                ? `linear-gradient(135deg, ${C.green}55, ${C.cyan}33)`
                : `linear-gradient(135deg, ${C.violet}55, ${C.card})`,
              display: "flex", alignItems: "flex-end", padding: 12,
            }}>
              <Pill color={s.type === "patio" ? C.green : C.violet}>{s.type === "patio" ? "Patio" : "Salón"}</Pill>
            </div>
            <div style={{ padding: 14 }}>
              <div style={{ fontSize: 14, fontWeight: 700 }}>{s.name}</div>
              <div style={{ fontSize: 12, color: C.sub, marginTop: 3, display: "flex", alignItems: "center", gap: 5 }}>
                <IconUsers size={14} color={C.sub} /> {s.capacity} personas
              </div>
              <div style={{ fontSize: 14, fontWeight: 800, color: C.cyan, marginTop: 8 }}>
                {moneyShort(s.price)}<span style={{ fontSize: 11, color: C.muted, fontWeight: 500 }}> /hr</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ============================ PUBLICO · MENU ============================ */

type CartLine = { item: MenuItem; qty: number };

function MenuScreen({
  cart, setCart, openCart,
}: { cart: Record<string, number>; setCart: (c: Record<string, number>) => void; openCart: () => void }) {
  const [tab, setTab] = useState<"cafe" | "grano" | "comida">("cafe");
  const tabs = [
    { key: "cafe", label: "Café", icon: IconCup },
    { key: "grano", label: "Grano", icon: IconBean },
    { key: "comida", label: "Comida", icon: IconLeaf },
  ] as const;
  const items = MENU.filter((m) => m.tag === tab);
  const count = Object.values(cart).reduce((a, b) => a + b, 0);

  const add = (id: string) => setCart({ ...cart, [id]: (cart[id] || 0) + 1 });
  const sub = (id: string) => {
    const n = (cart[id] || 0) - 1;
    const next = { ...cart };
    if (n <= 0) delete next[id]; else next[id] = n;
    setCart(next);
  };

  return (
    <div style={{ padding: 18, paddingBottom: count ? 90 : 24 }}>
      <SectionTitle sub="Pide en barra o para llevar">Menú</SectionTitle>

      {/* tabs */}
      <div style={{ display: "flex", gap: 8, marginBottom: 18 }}>
        {tabs.map((t) => {
          const on = t.key === tab;
          return (
            <button key={t.key} onClick={() => setTab(t.key)} style={{
              flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 7,
              background: on ? C.violet + "22" : C.card,
              border: `1px solid ${on ? C.violet : C.border}`,
              color: on ? C.text : C.sub, borderRadius: 12, padding: "11px 0",
              fontSize: 13, fontWeight: 700,
            }}>
              <t.icon size={17} color={on ? C.cyan : C.sub} /> {t.label}
            </button>
          );
        })}
      </div>

      {/* items */}
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {items.map((m) => {
          const q = cart[m.id] || 0;
          return (
            <div key={m.id} style={{ ...cardStyle, padding: 14, display: "flex", gap: 12, alignItems: "center" }}>
              <div style={{
                width: 52, height: 52, borderRadius: 12, flexShrink: 0,
                background: `linear-gradient(135deg, ${C.violet}33, ${C.cyan}22)`,
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                {tab === "cafe" ? <IconCup size={24} color={C.cyan} /> : tab === "grano" ? <IconBean size={24} color={C.cyan} /> : <IconLeaf size={24} color={C.cyan} />}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 15, fontWeight: 700 }}>{m.name}</span>
                  {m.badge && <Pill color={C.amber}>{m.badge}</Pill>}
                </div>
                <div style={{ fontSize: 12, color: C.sub, marginTop: 3, lineHeight: 1.35 }}>{m.desc}</div>
                <div style={{ fontSize: 15, fontWeight: 800, color: C.text, marginTop: 7 }}>{money(m.price)}</div>
              </div>
              {q === 0 ? (
                <button onClick={() => add(m.id)} style={{
                  width: 38, height: 38, borderRadius: 11, flexShrink: 0,
                  background: C.violet, border: "none", display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <IconPlus size={20} color="#fff" />
                </button>
              ) : (
                <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
                  <button onClick={() => sub(m.id)} style={qtyBtn}><IconMinus size={17} color={C.text} /></button>
                  <span style={{ width: 18, textAlign: "center", fontWeight: 800, fontSize: 15 }}>{q}</span>
                  <button onClick={() => add(m.id)} style={{ ...qtyBtn, background: C.violet, borderColor: C.violet }}><IconPlus size={17} color="#fff" /></button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {count > 0 && (
        <div style={{
          position: "fixed", bottom: "calc(74px + env(safe-area-inset-bottom))", left: "50%", transform: "translateX(-50%)",
          width: "calc(100% - 36px)", maxWidth: 444, zIndex: 30,
        }}>
          <button onClick={openCart} style={{
            width: "100%", background: `linear-gradient(135deg, ${C.violet}, #5b21b6)`,
            color: "#fff", border: "none", borderRadius: 14, padding: "15px 20px",
            display: "flex", alignItems: "center", justifyContent: "space-between",
            fontWeight: 800, fontSize: 15, boxShadow: `0 12px 30px ${C.violet}55`,
          }}>
            <span style={{ display: "flex", alignItems: "center", gap: 9 }}>
              <IconBag size={20} color="#fff" /> Ver carrito · {count}
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
              {money(MENU.reduce((t, m) => t + (cart[m.id] || 0) * m.price, 0))} <IconChevron size={18} color="#fff" />
            </span>
          </button>
        </div>
      )}
    </div>
  );
}

const qtyBtn: React.CSSProperties = {
  width: 34, height: 34, borderRadius: 10, background: C.card,
  border: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "center",
};

/* ============================ PUBLICO · ESPACIOS ============================ */

function SpacesScreen({ onReserve }: { onReserve: (s: Space) => void }) {
  const salones = SPACES.filter((s) => s.type === "salon");
  const patios = SPACES.filter((s) => s.type === "patio");
  const renderCard = (s: Space) => (
    <div key={s.id} style={{ ...cardStyle, overflow: "hidden" }}>
      <div style={{
        height: 120, position: "relative",
        background: s.type === "patio"
          ? `radial-gradient(100% 120% at 20% 0%, ${C.green}55, transparent), linear-gradient(135deg, ${C.green}33, ${C.card})`
          : `radial-gradient(100% 120% at 20% 0%, ${C.violet}55, transparent), linear-gradient(135deg, ${C.violet}33, ${C.card})`,
        display: "flex", alignItems: "flex-start", justifyContent: "space-between", padding: 14,
      }}>
        <Pill color={s.type === "patio" ? C.green : C.violet}>{s.type === "patio" ? "Patio" : "Salón"}</Pill>
        <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12, color: C.text, background: "rgba(3,2,10,0.4)", padding: "4px 9px", borderRadius: 999 }}>
          <IconUsers size={14} color={C.text} /> {s.capacity}
        </div>
      </div>
      <div style={{ padding: 16 }}>
        <div style={{ fontSize: 16, fontWeight: 800 }}>{s.name}</div>
        <div style={{ fontSize: 12.5, color: C.sub, marginTop: 4, lineHeight: 1.4 }}>{s.desc}</div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 14 }}>
          <div style={{ fontSize: 18, fontWeight: 900, color: C.cyan }}>
            {moneyShort(s.price)}<span style={{ fontSize: 12, color: C.muted, fontWeight: 500 }}> /hora</span>
          </div>
          <button onClick={() => onReserve(s)} style={{
            background: C.violet, color: "#fff", border: "none", borderRadius: 11,
            padding: "10px 18px", fontSize: 14, fontWeight: 700,
          }}>Reservar</button>
        </div>
      </div>
    </div>
  );
  return (
    <div style={{ padding: 18, paddingBottom: 24 }}>
      <SectionTitle sub="Reserva por hora · cancela sin costo 24h antes">Espacios</SectionTitle>
      <div style={{ fontSize: 13, fontWeight: 800, color: C.sub, margin: "4px 0 12px", letterSpacing: 0.3 }}>SALONES · {moneyShort(180)}/hr</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>{salones.map(renderCard)}</div>
      <div style={{ fontSize: 13, fontWeight: 800, color: C.sub, margin: "22px 0 12px", letterSpacing: 0.3 }}>PATIOS · {moneyShort(450)}/hr</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>{patios.map(renderCard)}</div>
    </div>
  );
}

/* ============================ CLIENTE · DASHBOARD ============================ */

function ClientDashboard({ goLoyalty, goMenu, goSpaces }: { goLoyalty: () => void; goMenu: () => void; goSpaces: () => void }) {
  const nivelInfo = NIVELES.find((n) => n.nivel === ME.nivel)!;
  const nextInfo = NIVELES.find((n) => n.nivel === nivelInfo.next);
  const target = nextInfo ? nextInfo.min : nivelInfo.min;
  const prev = nivelInfo.min;
  const pct = nextInfo ? Math.min(100, Math.round(((ME.puntos - prev) / (target - prev)) * 100)) : 100;
  const falta = nextInfo ? target - ME.puntos : 0;

  const quick = [
    { icon: IconCup, label: "Pedir café", action: goMenu, color: C.violet },
    { icon: IconSpace, label: "Reservar", action: goSpaces, color: C.cyan },
    { icon: IconTrophy, label: "Lealtad", action: goLoyalty, color: C.amber },
  ];

  return (
    <div style={{ padding: 18, paddingBottom: 24 }}>
      <div style={{ fontSize: 14, color: C.sub }}>Hola de nuevo,</div>
      <div style={{ fontSize: 26, fontWeight: 900, letterSpacing: -0.5, marginBottom: 18 }}>{ME.name.split(" ")[0]} 👋</div>

      {/* puntos card */}
      <div style={{
        ...cardStyle, padding: 20, marginBottom: 18, position: "relative", overflow: "hidden",
        background: `radial-gradient(120% 120% at 90% 0%, ${C.amber}22, transparent 55%), ${C.card}`,
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <div style={{ fontSize: 13, color: C.sub }}>Tus puntos Kai</div>
            <div style={{ fontSize: 38, fontWeight: 900, color: C.amber, lineHeight: 1.1 }}>{ME.puntos.toLocaleString("es-MX")}</div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6, background: nivelInfo.color + "22", border: `1px solid ${nivelInfo.color}55`, padding: "6px 12px", borderRadius: 999 }}>
            <IconTrophy size={16} color={nivelInfo.color} />
            <span style={{ fontWeight: 800, fontSize: 13, color: nivelInfo.color }}>{ME.nivel}</span>
          </div>
        </div>
        {/* progress */}
        <div style={{ marginTop: 18 }}>
          <div style={{ height: 9, background: C.border, borderRadius: 99, overflow: "hidden" }}>
            <div style={{ width: `${pct}%`, height: "100%", borderRadius: 99, background: `linear-gradient(90deg, ${C.amber}, ${C.cyan})` }} />
          </div>
          <div style={{ fontSize: 12, color: C.sub, marginTop: 8 }}>
            {nextInfo ? <>Te faltan <b style={{ color: C.text }}>{falta} pts</b> para <b style={{ color: nextInfo.color }}>{nextInfo.nivel}</b></> : "¡Nivel máximo alcanzado!"}
          </div>
        </div>
      </div>

      {/* accesos rapidos */}
      <SectionTitle>Accesos rápidos</SectionTitle>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 22 }}>
        {quick.map((q, i) => (
          <button key={i} onClick={q.action} style={{
            ...cardStyle, padding: "16px 8px", display: "flex", flexDirection: "column", alignItems: "center", gap: 9,
            color: C.text,
          }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: q.color + "1f", border: `1px solid ${q.color}40`, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <q.icon size={22} color={q.color} />
            </div>
            <span style={{ fontSize: 12, fontWeight: 700 }}>{q.label}</span>
          </button>
        ))}
      </div>

      {/* stats */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 22 }}>
        <div style={{ ...cardStyle, padding: 16 }}>
          <div style={{ fontSize: 26, fontWeight: 900 }}>{ME.visitas}</div>
          <div style={{ fontSize: 12.5, color: C.sub }}>Visitas este año</div>
        </div>
        <div style={{ ...cardStyle, padding: 16 }}>
          <div style={{ fontSize: 26, fontWeight: 900, color: C.green }}>2</div>
          <div style={{ fontSize: 12.5, color: C.sub }}>Recompensas listas</div>
        </div>
      </div>

      {/* movimiento reciente */}
      <SectionTitle>Actividad reciente</SectionTitle>
      <div style={{ ...cardStyle, padding: 6 }}>
        {POINTS_HISTORY.slice(0, 3).map((p, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 12px", borderBottom: i < 2 ? `1px solid ${C.border}` : "none" }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600 }}>{p.concepto}</div>
              <div style={{ fontSize: 12, color: C.muted }}>{p.fecha}</div>
            </div>
            <div style={{ fontSize: 14, fontWeight: 800, color: C.green }}>+{p.puntos}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ============================ CLIENTE · LEALTAD ============================ */

function LoyaltyScreen() {
  const nivelInfo = NIVELES.find((n) => n.nivel === ME.nivel)!;
  return (
    <div style={{ padding: 18, paddingBottom: 24 }}>
      <SectionTitle sub="Acumula puntos y sube de nivel">Programa de Lealtad</SectionTitle>

      {/* niveles */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 24 }}>
        {NIVELES.map((n) => {
          const reached = ME.puntos >= n.min;
          const current = n.nivel === ME.nivel;
          return (
            <div key={n.nivel} style={{
              ...cardStyle, padding: 16, display: "flex", alignItems: "center", gap: 14,
              border: current ? `1px solid ${n.color}` : `1px solid ${C.border}`,
              background: current ? n.color + "14" : C.card,
            }}>
              <div style={{
                width: 46, height: 46, borderRadius: 12, flexShrink: 0,
                background: n.color + "22", border: `1px solid ${n.color}55`,
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <IconTrophy size={23} color={n.color} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 16, fontWeight: 800, color: reached ? C.text : C.sub }}>{n.nivel}</span>
                  {current && <Pill color={n.color}>Tu nivel</Pill>}
                </div>
                <div style={{ fontSize: 12.5, color: C.sub, marginTop: 2 }}>Desde {n.min.toLocaleString("es-MX")} puntos</div>
              </div>
              {reached && <IconCheck size={20} color={current ? n.color : C.green} />}
            </div>
          );
        })}
      </div>

      {/* beneficios nivel actual */}
      <div style={{ ...cardStyle, padding: 18, marginBottom: 24, background: nivelInfo.color + "10", border: `1px solid ${nivelInfo.color}44` }}>
        <div style={{ fontSize: 15, fontWeight: 800, marginBottom: 12, color: nivelInfo.color }}>Beneficios {ME.nivel}</div>
        {["15% en grano para llevar", "1 café gratis al mes", "2 hrs de salón sin costo", "Acceso anticipado a eventos"].map((b, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "7px 0" }}>
            <IconCheck size={17} color={C.green} />
            <span style={{ fontSize: 14, color: C.text }}>{b}</span>
          </div>
        ))}
      </div>

      {/* historial */}
      <SectionTitle>Historial de puntos</SectionTitle>
      <div style={{ ...cardStyle, padding: 6 }}>
        {POINTS_HISTORY.map((p, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "13px 12px", borderBottom: i < POINTS_HISTORY.length - 1 ? `1px solid ${C.border}` : "none" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: C.violet + "1f", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <IconStar size={18} color={C.amber} />
              </div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600 }}>{p.concepto}</div>
                <div style={{ fontSize: 12, color: C.muted }}>{p.fecha}</div>
              </div>
            </div>
            <div style={{ fontSize: 15, fontWeight: 800, color: C.green }}>+{p.puntos}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ============================ ADMIN · DASHBOARD ============================ */

function AdminDashboard({ go }: { go: (k: string) => void }) {
  const kpis = [
    { label: "Ventas hoy", value: money(18450), delta: "+12%", color: C.green, icon: IconChart },
    { label: "Pedidos", value: "143", delta: "+8%", color: C.cyan, icon: IconBag },
    { label: "Reservas", value: "7", delta: "hoy", color: C.violet, icon: IconCalendar },
    { label: "Clientes activos", value: "1,284", delta: "+34", color: C.amber, icon: IconUsers },
  ];
  const modules = [
    { key: "reservas", label: "Reservas", desc: "7 por confirmar", icon: IconCalendar, color: C.violet },
    { key: "clientes", label: "Clientes", desc: "1,284 registrados", icon: IconUsers, color: C.cyan },
    { key: "menu", label: "Menú", desc: "15 productos", icon: IconCup, color: C.amber },
    { key: "reportes", label: "Reportes", desc: "Ventas y lealtad", icon: IconChart, color: C.green },
  ];
  // mini barras de ventas de la semana
  const week = [62, 78, 55, 90, 84, 100, 73];
  const days = ["L", "M", "M", "J", "V", "S", "D"];

  return (
    <div style={{ padding: 18, paddingBottom: 24 }}>
      <div style={{ fontSize: 13, color: C.sub }}>Panel de administración</div>
      <div style={{ fontSize: 24, fontWeight: 900, letterSpacing: -0.5, marginBottom: 18 }}>Kai Coffee · Centro</div>

      {/* KPIs */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 22 }}>
        {kpis.map((k, i) => (
          <div key={i} style={{ ...cardStyle, padding: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: k.color + "1f", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <k.icon size={19} color={k.color} />
              </div>
              <Pill color={k.color}>{k.delta}</Pill>
            </div>
            <div style={{ fontSize: 24, fontWeight: 900, letterSpacing: -0.5 }}>{k.value}</div>
            <div style={{ fontSize: 12.5, color: C.sub, marginTop: 2 }}>{k.label}</div>
          </div>
        ))}
      </div>

      {/* grafica ventas semana */}
      <div style={{ ...cardStyle, padding: 18, marginBottom: 22 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <div style={{ fontSize: 15, fontWeight: 800 }}>Ventas de la semana</div>
          <span style={{ fontSize: 13, color: C.green, fontWeight: 700 }}>{money(112300)}</span>
        </div>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 8, height: 110 }}>
          {week.map((v, i) => (
            <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 7 }}>
              <div style={{
                width: "100%", height: `${v}%`, borderRadius: "7px 7px 3px 3px",
                background: i === 5 ? `linear-gradient(180deg, ${C.cyan}, ${C.violet})` : C.violet + "55",
              }} />
              <span style={{ fontSize: 11, color: C.muted, fontWeight: 600 }}>{days[i]}</span>
            </div>
          ))}
        </div>
      </div>

      {/* modulos */}
      <SectionTitle>Módulos</SectionTitle>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        {modules.map((m) => (
          <button key={m.key} onClick={() => go(m.key)} style={{ ...cardStyle, padding: 16, textAlign: "left", color: C.text }}>
            <div style={{ width: 42, height: 42, borderRadius: 12, background: m.color + "1f", border: `1px solid ${m.color}40`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 12 }}>
              <m.icon size={21} color={m.color} />
            </div>
            <div style={{ fontSize: 15, fontWeight: 800 }}>{m.label}</div>
            <div style={{ fontSize: 12, color: C.sub, marginTop: 3 }}>{m.desc}</div>
          </button>
        ))}
      </div>
    </div>
  );
}

/* ============================ ADMIN · RESERVAS ============================ */

const STATUS_COLOR: Record<Reservation["status"], string> = {
  pendiente: C.amber, confirmada: C.green, cancelada: C.red,
};

function AdminReservas({ rows, onAction, notify }: {
  rows: Reservation[]; onAction: (id: string, s: Reservation["status"]) => void; notify: (m: string) => void;
}) {
  const [filter, setFilter] = useState<"todas" | Reservation["status"]>("todas");
  const filtered = filter === "todas" ? rows : rows.filter((r) => r.status === filter);
  const filters: ("todas" | Reservation["status"])[] = ["todas", "pendiente", "confirmada", "cancelada"];

  return (
    <div style={{ padding: 18, paddingBottom: 24 }}>
      <SectionTitle sub={`${rows.filter((r) => r.status === "pendiente").length} por confirmar`}>Reservas</SectionTitle>

      <div style={{ display: "flex", gap: 8, overflowX: "auto", marginBottom: 18, paddingBottom: 2 }}>
        {filters.map((f) => {
          const on = f === filter;
          return (
            <button key={f} onClick={() => setFilter(f)} style={{
              background: on ? C.violet : C.card, border: `1px solid ${on ? C.violet : C.border}`,
              color: on ? "#fff" : C.sub, borderRadius: 999, padding: "8px 16px",
              fontSize: 13, fontWeight: 700, textTransform: "capitalize", whiteSpace: "nowrap",
            }}>{f}</button>
          );
        })}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {filtered.map((r) => (
          <div key={r.id} style={{ ...cardStyle, padding: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 15, fontWeight: 800 }}>{r.cliente}</span>
                  <span style={{ fontSize: 11, color: C.muted }}>{r.id}</span>
                </div>
                <div style={{ fontSize: 13, color: C.sub, marginTop: 4, display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                  <span style={{ display: "flex", alignItems: "center", gap: 4 }}><IconSpace size={14} color={C.sub} /> {r.space}</span>
                  <span style={{ color: C.muted }}>·</span>
                  <span style={{ display: "flex", alignItems: "center", gap: 4 }}><IconCalendar size={14} color={C.sub} /> {r.fecha} {r.hora}</span>
                  <span style={{ color: C.muted }}>·</span>
                  <span style={{ display: "flex", alignItems: "center", gap: 4 }}><IconUsers size={14} color={C.sub} /> {r.personas}</span>
                </div>
              </div>
              <Pill color={STATUS_COLOR[r.status]}>{r.status}</Pill>
            </div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 14 }}>
              <div style={{ fontSize: 16, fontWeight: 800, color: C.cyan }}>{money(r.total)}</div>
              {r.status === "pendiente" ? (
                <div style={{ display: "flex", gap: 8 }}>
                  <button onClick={() => { onAction(r.id, "cancelada"); notify("Reserva cancelada"); }} style={{
                    background: C.red + "1a", color: C.red, border: `1px solid ${C.red}44`,
                    borderRadius: 10, padding: "9px 14px", fontSize: 13, fontWeight: 700,
                    display: "flex", alignItems: "center", gap: 5,
                  }}><IconX size={15} color={C.red} /> Cancelar</button>
                  <button onClick={() => { onAction(r.id, "confirmada"); notify("Reserva confirmada ✓"); }} style={{
                    background: C.green, color: "#04140e", border: "none",
                    borderRadius: 10, padding: "9px 14px", fontSize: 13, fontWeight: 800,
                    display: "flex", alignItems: "center", gap: 5,
                  }}><IconCheck size={15} color="#04140e" /> Confirmar</button>
                </div>
              ) : (
                <span style={{ fontSize: 12.5, color: C.muted }}>
                  {r.status === "confirmada" ? "Confirmada" : "Cancelada"}
                </span>
              )}
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div style={{ ...cardStyle, padding: 30, textAlign: "center", color: C.muted, fontSize: 14 }}>Sin reservas en este filtro</div>
        )}
      </div>
    </div>
  );
}

/* ============================ ADMIN · CLIENTES ============================ */

const NIVEL_COLOR: Record<string, string> = {
  Bronze: "#a16207", Silver: "#94a3b8", Gold: "#f59e0b", Platinum: "#22d3ee",
};

function AdminClientes() {
  return (
    <div style={{ padding: 18, paddingBottom: 24 }}>
      <SectionTitle sub={`${CUSTOMERS.length} de 1,284 mostrados`}>Clientes</SectionTitle>

      {/* resumen */}
      <div style={{ display: "flex", gap: 10, marginBottom: 18, overflowX: "auto" }}>
        {(["Platinum", "Gold", "Silver", "Bronze"] as const).map((lv) => {
          const n = CUSTOMERS.filter((c) => c.nivel === lv).length;
          return (
            <div key={lv} style={{ ...cardStyle, padding: "12px 16px", minWidth: 92 }}>
              <div style={{ fontSize: 20, fontWeight: 900, color: NIVEL_COLOR[lv] }}>{n}</div>
              <div style={{ fontSize: 11.5, color: C.sub }}>{lv}</div>
            </div>
          );
        })}
      </div>

      {/* tabla */}
      <div style={{ ...cardStyle, overflow: "hidden" }}>
        <div style={{ display: "flex", padding: "12px 16px", borderBottom: `1px solid ${C.border}`, fontSize: 11.5, fontWeight: 700, color: C.muted, letterSpacing: 0.3, textTransform: "uppercase" }}>
          <div style={{ flex: 1 }}>Cliente</div>
          <div style={{ width: 76, textAlign: "right" }}>Puntos</div>
          <div style={{ width: 60, textAlign: "right" }}>Gasto</div>
        </div>
        {CUSTOMERS.map((c, i) => (
          <div key={c.id} style={{ display: "flex", alignItems: "center", padding: "13px 16px", borderBottom: i < CUSTOMERS.length - 1 ? `1px solid ${C.border}` : "none" }}>
            <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 11, minWidth: 0 }}>
              <div style={{ width: 36, height: 36, borderRadius: 99, flexShrink: 0, background: NIVEL_COLOR[c.nivel] + "22", border: `1px solid ${NIVEL_COLOR[c.nivel]}55`, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 14, color: NIVEL_COLOR[c.nivel] }}>
                {c.name.charAt(0)}
              </div>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 700, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{c.name}</div>
                <div style={{ display: "flex", alignItems: "center", gap: 5, marginTop: 2 }}>
                  <span style={{ width: 7, height: 7, borderRadius: 99, background: NIVEL_COLOR[c.nivel] }} />
                  <span style={{ fontSize: 11.5, color: C.sub }}>{c.nivel} · {c.visitas} visitas</span>
                </div>
              </div>
            </div>
            <div style={{ width: 76, textAlign: "right", fontSize: 14, fontWeight: 800, color: C.amber }}>{c.puntos.toLocaleString("es-MX")}</div>
            <div style={{ width: 60, textAlign: "right", fontSize: 13, color: C.sub }}>{moneyShort(c.gasto)}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ============================ CART MODAL ============================ */

function CartModal({ open, onClose, cart, setCart, onPay }: {
  open: boolean; onClose: () => void; cart: Record<string, number>;
  setCart: (c: Record<string, number>) => void; onPay: () => void;
}) {
  const lines: CartLine[] = MENU.filter((m) => cart[m.id]).map((m) => ({ item: m, qty: cart[m.id] }));
  const subtotal = lines.reduce((t, l) => t + l.item.price * l.qty, 0);
  const propina = Math.round(subtotal * 0.1);
  const total = subtotal + propina;

  const setQty = (id: string, q: number) => {
    const next = { ...cart };
    if (q <= 0) delete next[id]; else next[id] = q;
    setCart(next);
  };

  return (
    <Modal open={open} onClose={onClose}>
      <div style={{ fontSize: 20, fontWeight: 900, marginBottom: 16 }}>Tu carrito</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 18 }}>
        {lines.map((l) => (
          <div key={l.item.id} style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 44, height: 44, borderRadius: 11, background: `linear-gradient(135deg, ${C.violet}33, ${C.cyan}22)`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              {l.item.tag === "cafe" ? <IconCup size={20} color={C.cyan} /> : l.item.tag === "grano" ? <IconBean size={20} color={C.cyan} /> : <IconLeaf size={20} color={C.cyan} />}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 14, fontWeight: 700, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{l.item.name}</div>
              <div style={{ fontSize: 13, color: C.sub }}>{money(l.item.price)}</div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <button onClick={() => setQty(l.item.id, l.qty - 1)} style={qtyBtn}><IconMinus size={16} color={C.text} /></button>
              <span style={{ width: 18, textAlign: "center", fontWeight: 800 }}>{l.qty}</span>
              <button onClick={() => setQty(l.item.id, l.qty + 1)} style={{ ...qtyBtn, background: C.violet, borderColor: C.violet }}><IconPlus size={16} color="#fff" /></button>
            </div>
          </div>
        ))}
      </div>

      <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 14, marginBottom: 18 }}>
        <Row label="Subtotal" value={money(subtotal)} />
        <Row label="Propina (10%)" value={money(propina)} />
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 10, fontSize: 18, fontWeight: 900 }}>
          <span>Total</span><span style={{ color: C.cyan }}>{money(total)}</span>
        </div>
      </div>

      <PrimaryButton full onClick={onPay}>Pagar {money(total)}</PrimaryButton>
      <div style={{ textAlign: "center", fontSize: 12, color: C.muted, marginTop: 12 }}>Pago simulado · demo sin cargos reales</div>
    </Modal>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14, color: C.sub, padding: "4px 0" }}>
      <span>{label}</span><span style={{ color: C.text, fontWeight: 600 }}>{value}</span>
    </div>
  );
}

/* ============================ RESERVE MODAL ============================ */

function ReserveModal({ space, onClose, onConfirm }: {
  space: Space | null; onClose: () => void; onConfirm: () => void;
}) {
  const [date, setDate] = useState("Hoy · 14 jun");
  const [hour, setHour] = useState("10:00");
  const [hours, setHours] = useState(2);
  const [people, setPeople] = useState(4);

  const dates = ["Hoy · 14 jun", "Mañana · 15 jun", "Lun · 16 jun"];
  const slots = ["09:00", "10:00", "12:00", "14:00", "16:00", "18:00"];

  if (!space) return null;
  const total = space.price * hours;

  return (
    <Modal open={!!space} onClose={onClose}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 18 }}>
        <div style={{ width: 48, height: 48, borderRadius: 12, background: space.type === "patio" ? C.green + "22" : C.violet + "22", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <IconSpace size={24} color={space.type === "patio" ? C.green : C.violet} />
        </div>
        <div>
          <div style={{ fontSize: 19, fontWeight: 900 }}>{space.name}</div>
          <div style={{ fontSize: 13, color: C.sub }}>{moneyShort(space.price)}/hr · hasta {space.capacity} personas</div>
        </div>
      </div>

      <Label>Fecha</Label>
      <Chips options={dates} value={date} onChange={setDate} />

      <Label>Hora de inicio</Label>
      <Chips options={slots} value={hour} onChange={setHour} />

      <Label>Duración</Label>
      <Stepper value={hours} setValue={(v) => setHours(Math.max(1, Math.min(8, v)))} suffix={hours === 1 ? "hora" : "horas"} />

      <Label>Personas</Label>
      <Stepper value={people} setValue={(v) => setPeople(Math.max(1, Math.min(space.capacity, v)))} suffix="personas" />

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", margin: "18px 0", padding: "14px 16px", background: C.surface, borderRadius: 12, border: `1px solid ${C.border}` }}>
        <span style={{ fontSize: 14, color: C.sub }}>Total · {hours} {hours === 1 ? "hora" : "horas"}</span>
        <span style={{ fontSize: 22, fontWeight: 900, color: C.cyan }}>{money(total)}</span>
      </div>

      <PrimaryButton full onClick={onConfirm}>Confirmar reserva</PrimaryButton>
      <div style={{ textAlign: "center", fontSize: 12, color: C.muted, marginTop: 12 }}>Demo · sin cargos reales</div>
    </Modal>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return <div style={{ fontSize: 13, fontWeight: 700, color: C.sub, margin: "14px 0 9px" }}>{children}</div>;
}

function Chips({ options, value, onChange }: { options: string[]; value: string; onChange: (v: string) => void }) {
  return (
    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
      {options.map((o) => {
        const on = o === value;
        return (
          <button key={o} onClick={() => onChange(o)} style={{
            background: on ? C.violet + "22" : C.card, border: `1px solid ${on ? C.violet : C.border}`,
            color: on ? C.text : C.sub, borderRadius: 10, padding: "9px 14px", fontSize: 13, fontWeight: 700,
          }}>{o}</button>
        );
      })}
    </div>
  );
}

function Stepper({ value, setValue, suffix }: { value: number; setValue: (v: number) => void; suffix: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
      <button onClick={() => setValue(value - 1)} style={{ ...qtyBtn, width: 42, height: 42 }}><IconMinus size={20} color={C.text} /></button>
      <div style={{ flex: 1, textAlign: "center", fontSize: 16, fontWeight: 800 }}>{value} <span style={{ color: C.sub, fontWeight: 500, fontSize: 14 }}>{suffix}</span></div>
      <button onClick={() => setValue(value + 1)} style={{ ...qtyBtn, width: 42, height: 42, background: C.violet, borderColor: C.violet }}><IconPlus size={20} color="#fff" /></button>
    </div>
  );
}

/* ============================ SUCCESS MODAL ============================ */

function SuccessModal({ open, title, desc, onClose }: { open: boolean; title: string; desc: string; onClose: () => void }) {
  return (
    <Modal open={open} onClose={onClose}>
      <div style={{ textAlign: "center", padding: "10px 0 6px" }}>
        <div style={{ width: 72, height: 72, borderRadius: 99, margin: "0 auto 18px", background: C.green + "22", border: `2px solid ${C.green}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <IconCheck size={38} color={C.green} />
        </div>
        <div style={{ fontSize: 22, fontWeight: 900 }}>{title}</div>
        <div style={{ fontSize: 14, color: C.sub, marginTop: 8, lineHeight: 1.5, maxWidth: 300, marginLeft: "auto", marginRight: "auto" }}>{desc}</div>
        <div style={{ marginTop: 22 }}>
          <PrimaryButton full onClick={onClose}>Listo</PrimaryButton>
        </div>
      </div>
    </Modal>
  );
}

/* ============================ DEMO TOGGLE ============================ */

function DemoToggle({ mode, setMode }: { mode: Mode; setMode: (m: Mode) => void }) {
  const opts: { key: Mode; label: string }[] = [
    { key: "publico", label: "Público" },
    { key: "cliente", label: "Cliente" },
    { key: "admin", label: "Admin" },
  ];
  return (
    <div style={{
      position: "fixed", bottom: "calc(82px + env(safe-area-inset-bottom))", right: 14, zIndex: 70,
    }}>
      <div style={{
        display: "flex", gap: 3, padding: 4,
        background: "rgba(22,18,42,0.92)", backdropFilter: "blur(12px)",
        border: `1px solid ${C.violet}55`, borderRadius: 999,
        boxShadow: `0 10px 30px rgba(3,2,10,0.6), 0 0 0 1px ${C.violet}22`,
      }}>
        {opts.map((o) => {
          const on = o.key === mode;
          return (
            <button key={o.key} onClick={() => setMode(o.key)} style={{
              background: on ? `linear-gradient(135deg, ${C.violet}, #5b21b6)` : "transparent",
              color: on ? "#fff" : C.sub, border: "none", borderRadius: 999,
              padding: "8px 14px", fontSize: 12.5, fontWeight: 700,
              boxShadow: on ? `0 4px 12px ${C.violet}66` : "none",
            }}>{o.label}</button>
          );
        })}
      </div>
    </div>
  );
}

/* ============================ APP ROOT ============================ */

export default function App() {
  const [mode, setMode] = useState<Mode>("publico");
  const [pubTab, setPubTab] = useState("home");
  const [cliTab, setCliTab] = useState("inicio");
  const [admTab, setAdmTab] = useState("dash");

  const [cart, setCart] = useState<Record<string, number>>({});
  const [cartOpen, setCartOpen] = useState(false);
  const [reserveSpace, setReserveSpace] = useState<Space | null>(null);
  const [success, setSuccess] = useState<{ title: string; desc: string } | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const [reservations, setReservations] = useState<Reservation[]>(RESERVATIONS);

  const notify = (m: string) => {
    setToast(m);
    setTimeout(() => setToast(null), 2200);
  };

  const switchMode = (m: Mode) => {
    setMode(m);
    setCartOpen(false);
    setReserveSpace(null);
  };

  const reservationAction = (id: string, s: Reservation["status"]) =>
    setReservations((rs) => rs.map((r) => (r.id === id ? { ...r, status: s } : r)));

  // ---- render screen ----
  let screen: React.ReactNode = null;
  let nav: React.ReactNode = null;
  let title = "Kai Coffee";

  if (mode === "publico") {
    title = pubTab === "menu" ? "Menú" : pubTab === "espacios" ? "Espacios" : "Kai Coffee";
    screen =
      pubTab === "menu" ? <MenuScreen cart={cart} setCart={setCart} openCart={() => setCartOpen(true)} />
      : pubTab === "espacios" ? <SpacesScreen onReserve={setReserveSpace} />
      : <HomeScreen goMenu={() => setPubTab("menu")} goSpaces={() => setPubTab("espacios")} />;
    nav = <BottomNav active={pubTab} onChange={setPubTab} items={[
      { key: "home", label: "Inicio", icon: IconHome },
      { key: "menu", label: "Menú", icon: IconCup },
      { key: "espacios", label: "Espacios", icon: IconSpace },
    ]} />;
  } else if (mode === "cliente") {
    title = cliTab === "lealtad" ? "Lealtad" : "Mi cuenta";
    screen = cliTab === "lealtad" ? <LoyaltyScreen />
      : <ClientDashboard goLoyalty={() => setCliTab("lealtad")} goMenu={() => { switchMode("publico"); setPubTab("menu"); }} goSpaces={() => { switchMode("publico"); setPubTab("espacios"); }} />;
    nav = <BottomNav active={cliTab} onChange={setCliTab} items={[
      { key: "inicio", label: "Inicio", icon: IconHome },
      { key: "lealtad", label: "Lealtad", icon: IconTrophy },
    ]} />;
  } else {
    title = admTab === "reservas" ? "Reservas" : admTab === "clientes" ? "Clientes" : "Admin";
    screen =
      admTab === "reservas" ? <AdminReservas rows={reservations} onAction={reservationAction} notify={notify} />
      : admTab === "clientes" ? <AdminClientes />
      : <AdminDashboard go={(k) => { if (k === "reservas" || k === "clientes") setAdmTab(k); else notify("Módulo demo"); }} />;
    nav = <BottomNav active={admTab} onChange={setAdmTab} items={[
      { key: "dash", label: "Panel", icon: IconChart },
      { key: "reservas", label: "Reservas", icon: IconCalendar },
      { key: "clientes", label: "Clientes", icon: IconUsers },
    ]} />;
  }

  // top bar right slot
  const right =
    mode === "publico" && pubTab !== "menu" ? (
      <button onClick={() => { switchMode("cliente"); }} style={{
        display: "flex", alignItems: "center", gap: 6, background: C.card, border: `1px solid ${C.border}`,
        borderRadius: 999, padding: "7px 12px", color: C.text, fontSize: 13, fontWeight: 700,
      }}><IconUser size={16} color={C.cyan} /> Entrar</button>
    ) : mode === "cliente" ? (
      <div style={{ display: "flex", alignItems: "center", gap: 8, background: C.amber + "1a", border: `1px solid ${C.amber}44`, borderRadius: 999, padding: "6px 12px" }}>
        <IconTrophy size={15} color={C.amber} />
        <span style={{ fontSize: 13, fontWeight: 800, color: C.amber }}>{ME.puntos.toLocaleString("es-MX")}</span>
      </div>
    ) : mode === "admin" ? (
      <div style={{ display: "flex", alignItems: "center", gap: 6, background: C.violet + "1a", border: `1px solid ${C.violet}44`, borderRadius: 999, padding: "6px 12px", fontSize: 12.5, fontWeight: 700, color: C.violet }}>
        <span style={{ width: 7, height: 7, borderRadius: 99, background: C.green }} /> Admin
      </div>
    ) : undefined;

  return (
    <div style={{
      minHeight: "100vh", background: C.bg,
      maxWidth: 480, margin: "0 auto",
      borderLeft: `1px solid ${C.border}`, borderRight: `1px solid ${C.border}`,
      display: "flex", flexDirection: "column", position: "relative",
    }}>
      <TopBar title={title} right={right} />
      <div style={{ flex: 1 }}>{screen}</div>
      {nav}

      <DemoToggle mode={mode} setMode={switchMode} />
      <Toast msg={toast} />

      <CartModal
        open={cartOpen} onClose={() => setCartOpen(false)} cart={cart} setCart={setCart}
        onPay={() => { setCartOpen(false); setCart({}); setSuccess({ title: "¡Pago exitoso!", desc: "Tu pedido está en preparación. Te avisaremos cuando esté listo en barra." }); }}
      />
      <ReserveModal
        space={reserveSpace} onClose={() => setReserveSpace(null)}
        onConfirm={() => { const n = reserveSpace?.name; setReserveSpace(null); setSuccess({ title: "¡Reserva confirmada!", desc: `Tu reserva en ${n} quedó agendada. Recibirás un recordatorio una hora antes.` }); }}
      />
      <SuccessModal open={!!success} title={success?.title || ""} desc={success?.desc || ""} onClose={() => setSuccess(null)} />
    </div>
  );
}
