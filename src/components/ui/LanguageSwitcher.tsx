import { useState, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { ChevronDown } from 'lucide-react'

const languages = [
  { code: 'fr', label: 'FR', flag: 'https://flagcdn.com/w20/fr.png' },
  { code: 'en', label: 'EN', flag: 'https://flagcdn.com/w20/gb.png' },
]

interface Props {
  variant?: 'light' | 'dark'
}

const LanguageSwitcher = ({ variant = 'light' }: Props) => {
  const { i18n } = useTranslation()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const currentLang = languages.find(l => l.code === i18n.language) || languages[0]

  const textColor = variant === 'dark' ? 'text-white' : 'text-gray-700'
  const hoverColor = variant === 'dark' ? 'hover:text-white/80' : 'hover:text-gray-900'
  const dropdownBg = variant === 'dark' ? 'bg-gray-800' : 'bg-white'

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className={`flex items-center gap-1.5 text-small cursor-pointer transition-opacity ${textColor} ${hoverColor}`}
      >
        <img src={currentLang.flag} alt={currentLang.label} className="w-5 h-3.5 rounded-sm object-cover" />
        <span>{currentLang.label}</span>
        <ChevronDown size={12} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className={`absolute top-full right-0 mt-1 ${dropdownBg} rounded-lg shadow-xl py-1 min-w-25 z-50`}>
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => { i18n.changeLanguage(lang.code); setOpen(false) }}
              className={`flex items-center gap-2 w-full px-3 py-2 text-small text-left transition-colors ${
                i18n.language === lang.code
                  ? 'text-primary font-semibold'
                  : variant === 'dark' ? 'text-gray-300 hover:text-white hover:bg-white/10' : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <img src={lang.flag} alt={lang.label} className="w-5 h-3.5 rounded-sm object-cover" />
              {lang.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default LanguageSwitcher
