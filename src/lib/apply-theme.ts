// lib/apply-theme.ts
import { setFavicon } from "@/lib/set-favicon";

interface ApplyTheme {
  primaryColor: string;
  secondaryColor: string;
  accentColor?: string;
  darkMode?: string;
  logo?: string;
  icon?: string;
}

export function applyTheme(theme: ApplyTheme) {
  if (!theme) {
    setFavicon(); // default
    return;
  }

  const root = document.documentElement;

  root.style.setProperty("--primary", theme.primaryColor);
  root.style.setProperty("--secondary", theme.secondaryColor);

  if (theme.accentColor) {
    root.style.setProperty("--accent", theme.accentColor);
  }
  // if (theme.logo){
  //     setFavicon(theme.logo);
  // }
}
