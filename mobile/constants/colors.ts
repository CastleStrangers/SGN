import { Appearance } from "react-native";

const LIGHT = {
  primary: "#1a5632",
  primaryDark: "#0f3d23",
  accent: "#c8a84e",
  accentDark: "#b8973f",
  background: "#f8fafc",
  card: "#ffffff",
  text: "#1a1a2e",
  textSecondary: "#64748b",
  border: "#e2e8f0",
  error: "#dc2626",
  success: "#16a34a",
};

const DARK = {
  primary: "#22c55e",
  primaryDark: "#15803d",
  accent: "#c8a84e",
  accentDark: "#b8973f",
  background: "#0f172a",
  card: "#1e293b",
  text: "#f8fafc",
  textSecondary: "#94a3b8",
  border: "#334155",
  error: "#ef4444",
  success: "#22c55e",
};

export const COLORS = new Proxy(LIGHT, {
  get(target, prop) {
    const isDark = Appearance.getColorScheme() === "dark";
    const theme = isDark ? DARK : LIGHT;
    return theme[prop as keyof typeof LIGHT] ?? target[prop as keyof typeof LIGHT];
  }
});
