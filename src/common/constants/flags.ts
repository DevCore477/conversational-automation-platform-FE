import arFlag from '@/assets/flags/ar.svg';
import csFlag from '@/assets/flags/cs.svg';
import deFlag from '@/assets/flags/de.svg';
import enFlag from '@/assets/flags/en.svg';
import esFlag from '@/assets/flags/es.svg';
import frFlag from '@/assets/flags/fr.svg';
import hiFlag from '@/assets/flags/hi.svg';
import itFlag from '@/assets/flags/it.svg';
import jaFlag from '@/assets/flags/ja.svg';
import nlFlag from '@/assets/flags/nl.svg';
import phFlag from '@/assets/flags/ph.svg';
import plFlag from '@/assets/flags/pl.svg';
import ptFlag from '@/assets/flags/pt.svg';
import roFlag from '@/assets/flags/ro.svg';
import skFlag from '@/assets/flags/sk.svg';
import svFlag from '@/assets/flags/sv.svg';
import trFlag from '@/assets/flags/tr.svg';
import zhFlag from '@/assets/flags/zh.svg';

export const flagImages = {
  en: enFlag,
  ph: phFlag,
  fr: frFlag,
  de: deFlag,
  es: esFlag,
  it: itFlag,
  ja: jaFlag,
  pl: plFlag,
  pt: ptFlag,
  ro: roFlag,
  sk: skFlag,
  sv: svFlag,
  cs: csFlag,
  zh: zhFlag,
  hi: hiFlag,
  tr: trFlag,
  nl: nlFlag,
  ar: arFlag,
} as const;

export type FlagKey = keyof typeof flagImages;