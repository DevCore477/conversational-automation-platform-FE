// types/theme.types.ts
export interface CompanyTheme {
  primaryColor: string;
  secondaryColor: string;
  // accentColor?: string;
  logo?: string;
  icon?: string;
  // darkMode?: boolean;
}

export type UpdateThemeDto = CompanyTheme;
