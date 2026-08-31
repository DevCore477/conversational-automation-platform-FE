import Image from "next/image";
import { flagImages } from "@/common/constants/flags";

export const getFlagSVG = (langCode: string): React.ReactNode => {
  const code = langCode.toLowerCase();

  const flagMap: Record<string, string> = {
    en: "en",
    us: "en",
    gb: "gb",
    au: "au",
    fil: "ph",
    ph: "ph",
    fr: "fr",
    de: "de",
    es: "es",
    it: "it",
    ja: "ja",
    jp: "jp",
    pl: "pl",
    pt: "pt",
    ro: "ro",
    sk: "sk",
    sv: "sv",
    se: "se",
    cs: "cs",
    cz: "cz",
    zh: "zh",
    cn: "cn",
    hi: "hi",
    in: "in",
    tr: "tr",
    nl: "nl",
    ar: "ar",
  };

  const flagName = flagMap[code] || "en";
  const flagImage = flagImages[flagName as keyof typeof flagImages];

  return (
    <Image
      src={flagImage}
      alt={`${code.toUpperCase()} flag`}
      width={60}
      height={45}
      priority={false}
    />
  );
};