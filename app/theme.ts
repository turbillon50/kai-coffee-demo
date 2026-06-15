// Paleta KAI COFFEE — warm artisan (DARK por defecto)
export const C = {
  void: "#0f0805",
  bg: "#1a0f08",
  surface: "#241509",
  card: "#2a1a10",
  border: "#3d2a1a",
  violet: "#d98a4f", // primary accent — caramel
  cyan: "#e0a96d",   // secondary accent — honey gold
  text: "#f5f0ea",
  sub: "#c9b8a6",
  muted: "#8a7560",
  green: "#7faa5e",
  red: "#e0654a",
  amber: "#e0a96d",
};

export const money = (n: number) =>
  "$" + n.toLocaleString("es-MX", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export const moneyShort = (n: number) =>
  "$" + n.toLocaleString("es-MX", { minimumFractionDigits: 0, maximumFractionDigits: 0 });

export const LIGHT = {
  void: '#ffffff',
  bg: '#faf7f2',
  surface: '#ffffff',
  card: '#ffffff',
  border: '#e8e0d5',
  violet: '#a3551f', // primary accent — roast brown
  cyan: '#c4622d',   // secondary accent — terracotta
  text: '#1a0f08',
  sub: '#7a6654',
  muted: '#a89080',
  green: '#4e7a3a',
  red: '#c0392b',
  amber: '#b4762a',
};