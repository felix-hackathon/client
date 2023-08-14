import 'server-only'
import type { Locale } from './config'
import en from '@/languages/en.json'
export type Language = typeof en

const languages = {
  en: () => new Promise<Language>((resolve) => resolve(en)),
  vi: () => import('@/languages/vi.json').then((module) => module.default),
}

export const getLanguage = async (locale: Locale) => {
  return languages[locale as Locale]?.() ?? languages.en()
}
