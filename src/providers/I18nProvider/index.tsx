import { Language } from '@/languages'
import { createContext } from 'react'

const defaultValue: Language | null = null

export const I18nContext = createContext<Language | null>(defaultValue)

const I18nProvider = ({ children, language }: { children: React.ReactNode; language: Language | null }) => {
  return <I18nContext.Provider value={language}>{children}</I18nContext.Provider>
}

export default I18nProvider
