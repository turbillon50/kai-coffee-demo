// Paleta V.Momentum — NO NEGOCIABLE
export const C = {
  void: "#03020a",
  bg: "#0a0814",
  surface: "#100d1e",
  card: "#16122a",
  border: "#1e1a35",
  violet: "#7c3aed",
  cyan: "#22d3ee",
  text: "#f0f4ff",
  sub: "#a8b4d0",
  muted: "#4a4f6a",
  green: "#10b981",
  red: "#ef4444",
  amber: "#f59e0b",
};

export const money = (n: number) =>
  "$" + n.toLocaleString("es-MX", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export const moneyShort = (n: number) =>
  "$" + n.toLocaleString("es-MX", { minimumFractionDigits: 0, maximumFractionDigits: 0 });

export const LIGHT = {
  void: '#ffffff',
  bg: '#f7f5f0',
  surface: '#ffffff',
  card: '#ffffff',
  border: '#e5e0d8',
  violet: '#7c3aed',
  cyan: '#0891b2',
  text: '#1a1208',
  sub: '#5a5040',
  muted: '#9e9080',
  green: '#059669',
  red: '#dc2626',
  amber: '#d97706',
};