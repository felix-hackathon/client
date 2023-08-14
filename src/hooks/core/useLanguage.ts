import { Language } from '@/languages'
import { I18nContext } from '@/providers/I18nProvider'
import { useContext } from 'react'
const useLanguage = () => {
  const language = useContext(I18nContext)
  return language as Language
}

export default useLanguage
