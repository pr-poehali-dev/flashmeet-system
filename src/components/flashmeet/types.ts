export type Page = "home" | "offer" | "privacy" | "b2b" | "contacts";

export const NAV_LINKS: { id: Page; label: string }[] = [
  { id: "offer", label: "Публичная оферта" },
  { id: "privacy", label: "Политика конфиденциальности" },
  { id: "b2b", label: "B2B-оферта" },
  { id: "contacts", label: "Контакты" },
];

export function hexToRgb(color: string): string {
  if (color.startsWith("var(")) {
    if (color.includes("--neon)")) return "0, 229, 192";
    if (color.includes("--sos)")) return "255, 59, 92";
    return "107, 159, 255";
  }
  const hex = color.replace("#", "");
  const r = parseInt(hex.slice(0, 2), 16);
  const g = parseInt(hex.slice(2, 4), 16);
  const b = parseInt(hex.slice(4, 6), 16);
  return `${r}, ${g}, ${b}`;
}
