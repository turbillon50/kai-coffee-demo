// TODOS los datos demo hardcodeados — sin backend, sin DB, sin APIs.

export type MenuItem = {
  id: string;
  name: string;
  desc: string;
  price: number;
  tag: "cafe" | "grano" | "comida";
  badge?: string;
};

export const MENU: MenuItem[] = [
  // Café
  { id: "c1", name: "Espresso Doble", desc: "Tueste medio, notas a cacao y caramelo", price: 48, tag: "cafe", badge: "Top" },
  { id: "c2", name: "Cappuccino", desc: "Espresso, leche vaporizada, espuma sedosa", price: 62, tag: "cafe" },
  { id: "c3", name: "Latte Kai", desc: "Nuestra firma con un toque de vainilla", price: 68, tag: "cafe", badge: "Firma" },
  { id: "c4", name: "Cold Brew", desc: "16 hrs de extracción en frío, suave y dulce", price: 70, tag: "cafe" },
  { id: "c5", name: "Flat White", desc: "Doble ristretto con microespuma", price: 64, tag: "cafe" },
  { id: "c6", name: "Matcha Latte", desc: "Matcha ceremonial con leche de avena", price: 75, tag: "cafe" },

  // Grano (para llevar)
  { id: "g1", name: "Chiapas Altura · 250g", desc: "Lavado, floral y cítrico. Tueste claro", price: 220, tag: "grano", badge: "Single Origin" },
  { id: "g2", name: "Veracruz Natural · 250g", desc: "Cuerpo redondo, frutos rojos", price: 195, tag: "grano" },
  { id: "g3", name: "Blend Kai · 500g", desc: "Nuestra mezcla de casa, balanceado", price: 340, tag: "grano", badge: "Más vendido" },
  { id: "g4", name: "Oaxaca Honey · 250g", desc: "Proceso honey, dulzor a panela", price: 240, tag: "grano" },

  // Comida
  { id: "f1", name: "Croissant de Almendra", desc: "Horneado en casa cada mañana", price: 58, tag: "comida" },
  { id: "f2", name: "Avocado Toast", desc: "Pan masa madre, aguacate, huevo pochado", price: 125, tag: "comida", badge: "Top" },
  { id: "f3", name: "Pan de Elote", desc: "Receta de la abuela, esponjoso", price: 52, tag: "comida" },
  { id: "f4", name: "Bowl de Yogurt", desc: "Granola artesanal, frutos rojos, miel", price: 98, tag: "comida" },
  { id: "f5", name: "Sandwich Caprese", desc: "Pesto, mozzarella fresca, jitomate", price: 135, tag: "comida" },
];

export type Space = {
  id: string;
  name: string;
  type: "salon" | "patio";
  capacity: number;
  price: number;
  desc: string;
};

export const SPACES: Space[] = [
  { id: "s1", name: "Salón Norte", type: "salon", capacity: 12, price: 180, desc: "Luz natural, pizarrón y proyector. Ideal juntas" },
  { id: "s2", name: "Salón Estudio", type: "salon", capacity: 8, price: 180, desc: "Silencio total, enchufes en cada mesa" },
  { id: "s3", name: "Salón Creativo", type: "salon", capacity: 16, price: 180, desc: "Mesas modulares, pared de notas" },
  { id: "s4", name: "Salón Privado", type: "salon", capacity: 6, price: 180, desc: "Cerrado, perfecto para entrevistas" },
  { id: "p1", name: "Patio Jardín", type: "patio", capacity: 40, price: 450, desc: "Al aire libre, plantas y string lights" },
  { id: "p2", name: "Patio Terraza", type: "patio", capacity: 30, price: 450, desc: "Vista a la ciudad, ideal eventos" },
];

export type Reservation = {
  id: string;
  cliente: string;
  space: string;
  fecha: string;
  hora: string;
  personas: number;
  total: number;
  status: "pendiente" | "confirmada" | "cancelada";
};

export const RESERVATIONS: Reservation[] = [
  { id: "R-1042", cliente: "Sofía Márquez", space: "Salón Norte", fecha: "14 jun", hora: "10:00", personas: 8, total: 360, status: "pendiente" },
  { id: "R-1041", cliente: "Mateo Rivera", space: "Patio Jardín", fecha: "14 jun", hora: "18:00", personas: 25, total: 1350, status: "confirmada" },
  { id: "R-1040", cliente: "Camila Torres", space: "Salón Estudio", fecha: "15 jun", hora: "09:00", personas: 4, total: 180, status: "pendiente" },
  { id: "R-1039", cliente: "Diego Fuentes", space: "Salón Creativo", fecha: "15 jun", hora: "16:00", personas: 12, total: 540, status: "confirmada" },
  { id: "R-1038", cliente: "Valentina Cruz", space: "Patio Terraza", fecha: "16 jun", hora: "19:00", personas: 18, total: 900, status: "pendiente" },
  { id: "R-1037", cliente: "Emiliano Soto", space: "Salón Privado", fecha: "16 jun", hora: "11:00", personas: 5, total: 360, status: "confirmada" },
  { id: "R-1036", cliente: "Renata Vega", space: "Salón Norte", fecha: "13 jun", hora: "14:00", personas: 10, total: 540, status: "cancelada" },
];

export type Customer = {
  id: string;
  name: string;
  nivel: "Bronze" | "Silver" | "Gold" | "Platinum";
  puntos: number;
  visitas: number;
  gasto: number;
};

export const CUSTOMERS: Customer[] = [
  { id: "u1", name: "Sofía Márquez", nivel: "Gold", puntos: 1840, visitas: 47, gasto: 8920 },
  { id: "u2", name: "Mateo Rivera", nivel: "Platinum", puntos: 3210, visitas: 82, gasto: 15400 },
  { id: "u3", name: "Camila Torres", nivel: "Silver", puntos: 720, visitas: 19, gasto: 3450 },
  { id: "u4", name: "Diego Fuentes", nivel: "Bronze", puntos: 240, visitas: 7, gasto: 1180 },
  { id: "u5", name: "Valentina Cruz", nivel: "Gold", puntos: 1560, visitas: 38, gasto: 7240 },
  { id: "u6", name: "Emiliano Soto", nivel: "Silver", puntos: 910, visitas: 24, gasto: 4100 },
  { id: "u7", name: "Renata Vega", nivel: "Bronze", puntos: 410, visitas: 11, gasto: 1980 },
  { id: "u8", name: "Andrés Lara", nivel: "Gold", puntos: 1720, visitas: 41, gasto: 8050 },
  { id: "u9", name: "Lucía Ramos", nivel: "Platinum", puntos: 2980, visitas: 74, gasto: 13900 },
  { id: "u10", name: "Tomás Herrera", nivel: "Silver", puntos: 640, visitas: 17, gasto: 2980 },
];

export type PointEntry = { fecha: string; concepto: string; puntos: number };

export const POINTS_HISTORY: PointEntry[] = [
  { fecha: "13 jun", concepto: "Latte Kai + Croissant", puntos: 13 },
  { fecha: "11 jun", concepto: "Reserva Salón Estudio", puntos: 36 },
  { fecha: "09 jun", concepto: "Blend Kai · 500g", puntos: 34 },
  { fecha: "07 jun", concepto: "Cold Brew x2", puntos: 14 },
  { fecha: "04 jun", concepto: "Avocado Toast + Cappuccino", puntos: 19 },
  { fecha: "01 jun", concepto: "Bono nivel Gold", puntos: 100 },
];

export const NIVELES = [
  { nivel: "Bronze", min: 0, color: "#a16207", next: "Silver" },
  { nivel: "Silver", min: 500, color: "#94a3b8", next: "Gold" },
  { nivel: "Gold", min: 1500, color: "#f59e0b", next: "Platinum" },
  { nivel: "Platinum", min: 2800, color: "#22d3ee", next: "—" },
] as const;

// Cliente "logueado" en la demo
export const ME = {
  name: "Sofía Márquez",
  nivel: "Gold" as const,
  puntos: 1840,
  visitas: 47,
};
