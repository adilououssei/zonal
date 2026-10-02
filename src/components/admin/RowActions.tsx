import { useEffect, useLayoutEffect, useRef, useState, type ElementType } from 'react'
import { createPortal } from 'react-dom'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { AnimatePresence, motion } from 'framer-motion'
import { MoreHorizontal } from 'lucide-react'

// Menu « ⋯ » regroupant les actions d'une ligne des tableaux admin (voir,
// modifier, partager, supprimer...), à la place d'une rangée d'icônes qui
// élargissait les tableaux. Le menu est rendu dans un portail en position
// fixe : il n'est ni coupé par le conteneur du tableau, ni à l'origine d'un
// défilement, et s'ouvre vers le haut quand la ligne est en bas de l'écran.

export interface RowAction {
  key: string
  label: string
  icon: ElementType
  onClick?: () => void
  // Lien interne (React Router) ou externe (téléchargement, nouvel onglet)
  to?: string
  href?: string
  // Action destructrice : affichée en rouge, séparée des autres, en dernier
  danger?: boolean
}

interface RowActionsProps {
  actions: RowAction[]
  // Nom de l'élément, lu par les lecteurs d'écran (« Actions pour ... »)
  label?: string
}

const MENU_WIDTH = 208
const GAP = 6

const RowActions = ({ actions, label }: RowActionsProps) => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const [position, setPosition] = useState<{ top: number; left: number; up: boolean } | null>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)

  const safeActions = actions.filter((a) => !a.danger)
  const dangerActions = actions.filter((a) => a.danger)

  // Placement sous le bouton, aligné à droite, retourné vers le haut s'il ne
  // reste pas la place en dessous
  useLayoutEffect(() => {
    if (!open || !triggerRef.current) return
    const rect = triggerRef.current.getBoundingClientRect()
    const menuHeight = menuRef.current?.offsetHeight ?? actions.length * 40 + 16
    const up = rect.bottom + GAP + menuHeight > window.innerHeight && rect.top - GAP - menuHeight > 0
    const left = Math.min(Math.max(8, rect.right - MENU_WIDTH), window.innerWidth - MENU_WIDTH - 8)
    setPosition({ top: up ? rect.top - GAP - menuHeight : rect.bottom + GAP, left, up })
  }, [open, actions.length])

  // Fermeture : clic à l'extérieur, Échap, défilement ou redimensionnement
  useEffect(() => {
    if (!open) return
    const close = () => setOpen(false)
    const onPointerDown = (e: PointerEvent) => {
      const target = e.target as Node
      if (!menuRef.current?.contains(target) && !triggerRef.current?.contains(target)) close()
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        close()
        triggerRef.current?.focus()
      }
    }
    document.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('keydown', onKey)
    window.addEventListener('scroll', close, true)
    window.addEventListener('resize', close)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('keydown', onKey)
      window.removeEventListener('scroll', close, true)
      window.removeEventListener('resize', close)
    }
  }, [open])

  // Focus sur la première action à l'ouverture, pour le clavier
  useEffect(() => {
    if (open && position) menuRef.current?.querySelector<HTMLElement>('[role="menuitem"]')?.focus()
  }, [open, position])

  const onMenuKeyDown = (e: React.KeyboardEvent) => {
    if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return
    e.preventDefault()
    const items = Array.from(menuRef.current?.querySelectorAll<HTMLElement>('[role="menuitem"]') ?? [])
    const index = items.indexOf(document.activeElement as HTMLElement)
    const next = e.key === 'ArrowDown' ? (index + 1) % items.length : (index - 1 + items.length) % items.length
    items[next]?.focus()
  }

  const run = (action: RowAction) => {
    setOpen(false)
    if (action.to) navigate(action.to)
    else action.onClick?.()
  }

  const renderItem = (action: RowAction) => {
    const Icon = action.icon
    const className = `w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-small text-left transition-colors focus:outline-none ${
      action.danger
        ? 'text-red hover:bg-red/10 focus:bg-red/10'
        : 'text-gray-700 hover:bg-gray-100 focus:bg-gray-100'
    }`
    const content = (
      <>
        <Icon size={15} className={action.danger ? '' : 'text-gray-400'} />
        {action.label}
      </>
    )

    return action.href ? (
      <a key={action.key} role="menuitem" href={action.href} target="_blank" rel="noopener noreferrer" className={className} onClick={() => setOpen(false)}>
        {content}
      </a>
    ) : (
      <button key={action.key} role="menuitem" type="button" className={className} onClick={() => run(action)}>
        {content}
      </button>
    )
  }

  if (actions.length === 0) return null

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => {
          setPosition(null)
          setOpen((o) => !o)
        }}
        className={`w-8 h-8 inline-flex items-center justify-center rounded-lg transition-colors ${
          open ? 'bg-gray-100 text-gray-700' : 'text-gray-400 hover:text-gray-700 hover:bg-gray-100'
        }`}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={label ? t('admin.rowActions.labelFor', { name: label }) : t('admin.rowActions.label')}
        title={t('admin.rowActions.label')}
      >
        <MoreHorizontal size={18} />
      </button>

      {createPortal(
        <AnimatePresence>
          {open && (
            <motion.div
              ref={menuRef}
              role="menu"
              onKeyDown={onMenuKeyDown}
              className="fixed z-50 p-1.5 bg-white rounded-xl shadow-lg ring-1 ring-black/5 text-left"
              style={{ width: MENU_WIDTH, top: position?.top ?? -9999, left: position?.left ?? -9999 }}
              initial={{ opacity: 0, scale: 0.95, y: position?.up ? 4 : -4 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.12 }}
            >
              {safeActions.map(renderItem)}
              {safeActions.length > 0 && dangerActions.length > 0 && <div className="my-1 border-t border-gray-100" />}
              {dangerActions.map(renderItem)}
            </motion.div>
          )}
        </AnimatePresence>,
        document.body,
      )}
    </>
  )
}

export default RowActions
