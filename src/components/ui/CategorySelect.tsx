import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ArrowLeft } from 'lucide-react'

// Menu déroulant de catégorie avec option "Autre" : bascule vers un champ
// texte libre quand l'utilisateur choisit "+ Autre" ou que la valeur actuelle
// ne fait pas partie de la liste prédéfinie (ex: catégorie saisie manuellement
// lors d'un ajout précédent). Utilisé dans les formulaires admin (actualités,
// événements, galerie...).
interface Props {
  value: string
  onChange: (value: string) => void
  options: string[]
  labelKey?: string
  hideLabel?: boolean
  placeholderKey?: string
  optionKey?: (cat: string) => string
  required?: boolean
}

const CategorySelect = ({
  value,
  onChange,
  options,
  labelKey = 'admin.table.category',
  hideLabel = false,
  placeholderKey = 'admin.placeholders.selectCategory',
  optionKey,
  required = false,
}: Props) => {
  const { t } = useTranslation()
  const [customMode, setCustomMode] = useState(value !== '' && !options.includes(value))

  // Mode "saisie libre" actif si l'utilisateur l'a choisi explicitement, ou si
  // la valeur reçue ne correspond à aucune option de la liste
  const isOther = customMode || (value !== '' && !options.includes(value))

  return (
    <div>
      {!hideLabel && <label className="block text-small font-medium text-gray-700 mb-2">{t(labelKey)}</label>}
      {!isOther ? (
        <select
          value={value}
          onChange={(e) => {
            const v = e.target.value
            if (v === '__other__') {
              setCustomMode(true)
              onChange('')
            } else {
              onChange(v)
            }
          }}
          className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-small text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition cursor-pointer"
          required={required}
        >
          <option value="">{t(placeholderKey)}</option>
          {options.map((cat) => (
            <option key={cat} value={cat}>
              {optionKey ? t(optionKey(cat)) : cat}
            </option>
          ))}
          <option value="__other__" className="text-primary font-medium">
            + {t('admin.categories.other')}
          </option>
        </select>
      ) : (
        <div className="flex gap-2">
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={t('admin.categories.customPlaceholder')}
            className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-small focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
            required={required}
            autoFocus
          />
          <button
            type="button"
            onClick={() => { setCustomMode(false); onChange('') }}
            className="px-3 py-2 rounded-lg border border-gray-200 text-gray-500 text-small hover:bg-gray-50 transition-colors shrink-0 flex items-center gap-1"
          >
            <ArrowLeft size={14} />
            {t('admin.categories.backToSelect')}
          </button>
        </div>
      )}
    </div>
  )
}

export default CategorySelect
