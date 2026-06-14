// Iconos SVG inline custom — CERO Lucide, CERO emojis como iconos.
import React from "react";

type P = { size?: number; color?: string; stroke?: number };
const base = (size: number): React.CSSProperties => ({
  width: size,
  height: size,
  display: "block",
  flexShrink: 0,
});

export const IconHome = ({ size = 22, color = "currentColor", stroke = 1.8 }: P) => (
  <svg viewBox="0 0 24 24" fill="none" style={base(size)} stroke={color} strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 11l9-8 9 8" />
    <path d="M5 10v10h5v-6h4v6h5V10" />
  </svg>
);

export const IconCup = ({ size = 22, color = "currentColor", stroke = 1.8 }: P) => (
  <svg viewBox="0 0 24 24" fill="none" style={base(size)} stroke={color} strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 8h13v6a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5V8z" />
    <path d="M17 9h2.5a2.5 2.5 0 0 1 0 5H17" />
    <path d="M8 2c-.6 1 .6 1.6 0 2.6M11.5 2c-.6 1 .6 1.6 0 2.6" />
  </svg>
);

export const IconSpace = ({ size = 22, color = "currentColor", stroke = 1.8 }: P) => (
  <svg viewBox="0 0 24 24" fill="none" style={base(size)} stroke={color} strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="14" rx="2" />
    <path d="M3 9h18M8 18v2M16 18v2M8 13h3" />
  </svg>
);

export const IconStar = ({ size = 22, color = "currentColor", stroke = 1.8, fill = "none" }: P & { fill?: string }) => (
  <svg viewBox="0 0 24 24" fill={fill} style={base(size)} stroke={color} strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 3l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.9 6.8 19.2l1-5.8L3.5 9.2l5.9-.9L12 3z" />
  </svg>
);

export const IconUser = ({ size = 22, color = "currentColor", stroke = 1.8 }: P) => (
  <svg viewBox="0 0 24 24" fill="none" style={base(size)} stroke={color} strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="8" r="4" />
    <path d="M4 21c0-4 3.5-6 8-6s8 2 8 6" />
  </svg>
);

export const IconBag = ({ size = 22, color = "currentColor", stroke = 1.8 }: P) => (
  <svg viewBox="0 0 24 24" fill="none" style={base(size)} stroke={color} strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 8h12l-1 12H7L6 8z" />
    <path d="M9 8V6a3 3 0 0 1 6 0v2" />
  </svg>
);

export const IconPlus = ({ size = 22, color = "currentColor", stroke = 2 }: P) => (
  <svg viewBox="0 0 24 24" fill="none" style={base(size)} stroke={color} strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 5v14M5 12h14" />
  </svg>
);

export const IconMinus = ({ size = 22, color = "currentColor", stroke = 2 }: P) => (
  <svg viewBox="0 0 24 24" fill="none" style={base(size)} stroke={color} strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14" />
  </svg>
);

export const IconCheck = ({ size = 22, color = "currentColor", stroke = 2 }: P) => (
  <svg viewBox="0 0 24 24" fill="none" style={base(size)} stroke={color} strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 12.5l5 5 11-11" />
  </svg>
);

export const IconX = ({ size = 22, color = "currentColor", stroke = 2 }: P) => (
  <svg viewBox="0 0 24 24" fill="none" style={base(size)} stroke={color} strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 6l12 12M18 6L6 18" />
  </svg>
);

export const IconClock = ({ size = 22, color = "currentColor", stroke = 1.8 }: P) => (
  <svg viewBox="0 0 24 24" fill="none" style={base(size)} stroke={color} strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3.5 2" />
  </svg>
);

export const IconUsers = ({ size = 22, color = "currentColor", stroke = 1.8 }: P) => (
  <svg viewBox="0 0 24 24" fill="none" style={base(size)} stroke={color} strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round">
    <circle cx="9" cy="8" r="3.2" />
    <path d="M3 20c0-3.3 2.7-5 6-5s6 1.7 6 5" />
    <path d="M16 5.2A3.2 3.2 0 0 1 16 11M18 20c0-2.5-1-4-3-4.6" />
  </svg>
);

export const IconCalendar = ({ size = 22, color = "currentColor", stroke = 1.8 }: P) => (
  <svg viewBox="0 0 24 24" fill="none" style={base(size)} stroke={color} strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="5" width="18" height="16" rx="2" />
    <path d="M3 9h18M8 3v4M16 3v4" />
  </svg>
);

export const IconChart = ({ size = 22, color = "currentColor", stroke = 1.8 }: P) => (
  <svg viewBox="0 0 24 24" fill="none" style={base(size)} stroke={color} strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 20V4M4 20h16" />
    <path d="M8 16v-3M12 16V9M16 16v-6" />
  </svg>
);

export const IconGrid = ({ size = 22, color = "currentColor", stroke = 1.8 }: P) => (
  <svg viewBox="0 0 24 24" fill="none" style={base(size)} stroke={color} strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7" rx="1.5" />
    <rect x="14" y="3" width="7" height="7" rx="1.5" />
    <rect x="3" y="14" width="7" height="7" rx="1.5" />
    <rect x="14" y="14" width="7" height="7" rx="1.5" />
  </svg>
);

export const IconBean = ({ size = 22, color = "currentColor", stroke = 1.8 }: P) => (
  <svg viewBox="0 0 24 24" fill="none" style={base(size)} stroke={color} strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round">
    <ellipse cx="12" cy="12" rx="7" ry="9" />
    <path d="M9 5c2 3 2 11 0 14M15 5c-2 3-2 11 0 14" />
  </svg>
);

export const IconChevron = ({ size = 22, color = "currentColor", stroke = 1.8 }: P) => (
  <svg viewBox="0 0 24 24" fill="none" style={base(size)} stroke={color} strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 6l6 6-6 6" />
  </svg>
);

export const IconArrowLeft = ({ size = 22, color = "currentColor", stroke = 1.8 }: P) => (
  <svg viewBox="0 0 24 24" fill="none" style={base(size)} stroke={color} strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 6l-6 6 6 6M9 12h11" />
  </svg>
);

export const IconLeaf = ({ size = 22, color = "currentColor", stroke = 1.8 }: P) => (
  <svg viewBox="0 0 24 24" fill="none" style={base(size)} stroke={color} strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 20C4 12 9 5 19 4c1 9-3 15-11 15-1.5 0-3-.3-3-.3" />
    <path d="M5 20c2-5 5-8 10-10" />
  </svg>
);

export const IconWifi = ({ size = 22, color = "currentColor", stroke = 1.8 }: P) => (
  <svg viewBox="0 0 24 24" fill="none" style={base(size)} stroke={color} strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 9c6-5 14-5 20 0M5 12.5c4-3.3 10-3.3 14 0M8.5 16c2-1.6 5-1.6 7 0" />
    <circle cx="12" cy="19" r="1" fill={color} stroke="none" />
  </svg>
);

export const IconTrophy = ({ size = 22, color = "currentColor", stroke = 1.8 }: P) => (
  <svg viewBox="0 0 24 24" fill="none" style={base(size)} stroke={color} strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round">
    <path d="M7 4h10v4a5 5 0 0 1-10 0V4z" />
    <path d="M7 6H4v1a3 3 0 0 0 3 3M17 6h3v1a3 3 0 0 1-3 3" />
    <path d="M10 14v3M14 14v3M8 20h8" />
  </svg>
);
