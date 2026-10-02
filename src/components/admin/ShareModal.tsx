import { useEffect, useRef, useState, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { AnimatePresence, motion } from 'framer-motion'
import {
  X, Copy, Check, ExternalLink, Mail, Send, Share2, PartyPopper, Link2, Calendar, MapPin,
} from 'lucide-react'
import { SITE_URL } from '../Seo'

// Fenêtre de partage des publications (événements, actualités, projets) vers
// les réseaux sociaux, réservée à l'admin. Ouverte automatiquement juste après
// la création d'une publication (justPublished) et depuis le bouton « Partager »
// de chaque ligne des listes admin (voir useShareModal).
//
// Aucun compte développeur ni jeton n'est nécessaire : chaque réseau s'ouvre sur
// sa propre fenêtre de publication avec le lien déjà rempli, et l'admin valide
// là-bas. L'image et le résumé de l'aperçu sont fournis aux réseaux par le
// backend (LinkPreviewController), les robots étant aiguillés par le Nginx du front.

export type ShareType = 'events' | 'news' | 'projects'

export interface ShareItem {
  type: ShareType
  id: number
  title: string
  summary?: string | null
  image?: string | null
  date?: string | null
  location?: string | null
}

interface ShareModalProps {
  item: ShareItem | null
  justPublished?: boolean
  onClose: () => void
}

const SUMMARY_MAX_LENGTH = 220

// Texte brut à partir de la description HTML saisie dans les formulaires
// (DOMParser n'exécute aucun script : il ne sert qu'à lire le texte).
const toPlainText = (html: string | null | undefined): string => {
  if (!html) return ''
  const text = new DOMParser().parseFromString(html, 'text/html').body.textContent ?? ''
  return text.replace(/\s+/g, ' ').trim()
}

const truncate = (text: string, max: number): string => {
  if (text.length <= max) return text
  const cut = text.slice(0, max)
  const lastSpace = cut.lastIndexOf(' ')
  return `${(lastSpace > 0 ? cut.slice(0, lastSpace) : cut).replace(/[\s,;:.]+$/, '')}…`
}

// Les dates arrivent au format AAAA-MM-JJ : on les affiche en toutes lettres
const formatDate = (date: string | null | undefined, language: string): string | null => {
  if (!date) return null
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return date
  return new Date(`${date}T00:00:00`).toLocaleDateString(language, { day: 'numeric', month: 'long', year: 'numeric' })
}

const shareUrlFor = (item: Pick<ShareItem, 'type' | 'id'>) => `${SITE_URL}/${item.type}/${item.id}`

const openPopup = (url: string) => {
  const width = 640
  const height = 640
  const left = Math.max(0, window.screenX + (window.outerWidth - width) / 2)
  const top = Math.max(0, window.screenY + (window.outerHeight - height) / 2)
  window.open(url, '_blank', `noopener,noreferrer,width=${width},height=${height},left=${left},top=${top}`)
}

const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    // Repli pour les navigateurs qui refusent l'API Clipboard (contexte non sécurisé...)
    const ta = document.createElement('textarea')
    ta.value = text
    ta.style.position = 'fixed'
    ta.style.opacity = '0'
    document.body.appendChild(ta)
    ta.select()
    const ok = document.execCommand('copy')
    document.body.removeChild(ta)
    return ok
  }
}

interface Network {
  key: string
  label: string
  icon: ReactNode
  // Les réseaux qui ignorent le texte pré-rempli (Facebook, LinkedIn, Instagram)
  // reçoivent le message dans le presse-papier, prêt à être collé.
  copiesMessage?: boolean
  action: () => void
}

const ShareModal = ({ item, justPublished = false, onClose }: ShareModalProps) => (
  <AnimatePresence>
    {item && (
      // La clé repart d'un état neuf (message, lien copié...) à chaque publication ouverte
      <ShareDialog key={`${item.type}-${item.id}`} item={item} justPublished={justPublished} onClose={onClose} />
    )}
  </AnimatePresence>
)

const ShareDialog = ({ item, justPublished, onClose }: { item: ShareItem; justPublished: boolean; onClose: () => void }) => {
  const { t, i18n } = useTranslation()
  const url = shareUrlFor(item)
  const summary = truncate(toPlainText(item.summary), SUMMARY_MAX_LENGTH)
  const displayDate = formatDate(item.date, i18n.language)

  // Message proposé par défaut, modifiable avant le partage
  const [message, setMessage] = useState(() => {
    const lines: string[] = [`${t(`admin.share.emoji.${item.type}`)} ${item.title}`]
    const meta = [displayDate, item.location].filter(Boolean).join(' · ')
    if (meta) lines.push(meta)
    if (summary) lines.push('', summary)
    lines.push('', `👉 ${t(`admin.share.cta.${item.type}`)} ${url}`, '', t('admin.share.hashtags'))
    return lines.join('\n')
  })
  const [toast, setToast] = useState<string | null>(null)
  const [linkCopied, setLinkCopied] = useState(false)
  const closeRef = useRef<HTMLButtonElement>(null)

  // Échap pour fermer, défilement de la page bloqué pendant l'ouverture
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    closeRef.current?.focus()
    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', onKey)
    }
  }, [onClose])

  // Le message de confirmation disparaît de lui-même au bout de quelques secondes
  useEffect(() => {
    if (!toast) return
    const timer = window.setTimeout(() => setToast(null), 4000)
    return () => window.clearTimeout(timer)
  }, [toast])

  const handleCopyLink = async () => {
    if (await copyToClipboard(url)) {
      setLinkCopied(true)
      setToast(t('admin.share.toast.linkCopied'))
    }
  }

  const handleCopyMessage = async () => {
    if (await copyToClipboard(message)) setToast(t('admin.share.toast.messageCopied'))
  }

  // Le texte est copié avant d'ouvrir le réseau : une fois la nouvelle fenêtre
  // au premier plan, le navigateur refuserait l'accès au presse-papier.
  const withCopiedMessage = async (open: () => void, network: string) => {
    const copied = await copyToClipboard(message)
    open()
    if (copied) setToast(t('admin.share.toast.pasteIn', { network }))
  }

  const canNativeShare = typeof navigator.share === 'function'
  const encodedUrl = encodeURIComponent(url)
  const encodedMessage = encodeURIComponent(message)
  const shortText = encodeURIComponent(`${item.title}\n${t('admin.share.hashtags')}`)

  const networks: Network[] = [
    {
      key: 'facebook',
      label: 'Facebook',
      icon: <img src="/images/icons/facebook.png" alt="" className="w-full h-full object-cover" />,
      copiesMessage: true,
      action: () => withCopiedMessage(() => openPopup(`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`), 'Facebook'),
    },
    {
      key: 'linkedin',
      label: 'LinkedIn',
      icon: <img src="/images/icons/linkedin.png" alt="" className="w-full h-full object-cover" />,
      copiesMessage: true,
      action: () => withCopiedMessage(() => openPopup(`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`), 'LinkedIn'),
    },
    {
      key: 'whatsapp',
      label: 'WhatsApp',
      icon: <img src="/images/icons/whatsapp.png" alt="" className="w-full h-full object-cover" />,
      action: () => openPopup(`https://wa.me/?text=${encodedMessage}`),
    },
    {
      key: 'x',
      label: 'X',
      icon: <span className="w-full h-full bg-black text-white flex items-center justify-center text-xl font-bold">𝕏</span>,
      action: () => openPopup(`https://x.com/intent/post?text=${shortText}&url=${encodedUrl}`),
    },
    {
      key: 'instagram',
      label: 'Instagram',
      icon: <img src="/images/icons/instagram.png" alt="" className="w-full h-full object-cover" />,
      copiesMessage: true,
      // Instagram n'a pas de lien de partage web : on prépare la légende et on
      // ouvre Instagram, où l'admin publie l'image avec le texte collé.
      action: () => withCopiedMessage(() => window.open('https://www.instagram.com/', '_blank', 'noopener,noreferrer'), 'Instagram'),
    },
    {
      key: 'telegram',
      label: 'Telegram',
      icon: <span className="w-full h-full bg-[#229ED9] text-white flex items-center justify-center"><Send size={20} className="-ml-0.5" /></span>,
      action: () => openPopup(`https://t.me/share/url?url=${encodedUrl}&text=${encodeURIComponent(message.replace(url, '').trim())}`),
    },
    {
      key: 'email',
      label: t('admin.share.email'),
      icon: <span className="w-full h-full bg-gray-700 text-white flex items-center justify-center"><Mail size={20} /></span>,
      action: () => { window.location.href = `mailto:?subject=${encodeURIComponent(item.title)}&body=${encodedMessage}` },
    },
    ...(canNativeShare ? [{
      key: 'more',
      label: t('admin.share.more'),
      icon: <span className="w-full h-full bg-primary/10 text-primary flex items-center justify-center"><Share2 size={20} /></span>,
      action: () => { navigator.share({ title: item.title, text: message, url }).catch(() => {}) },
    }] : []),
  ]

  const domain = SITE_URL.replace(/^https?:\/\//, '').toUpperCase()

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" onClick={onClose} />

      <motion.div
        role="dialog"
        aria-modal="true"
        aria-labelledby="share-modal-title"
        className="relative w-full sm:max-w-xl max-h-[92vh] overflow-y-auto bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl"
        initial={{ opacity: 0, y: 40, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 40, scale: 0.97 }}
        transition={{ type: 'spring', damping: 26, stiffness: 320 }}
      >
        {/* En-tête : célébration après publication, titre sobre sinon */}
        <div className={`relative px-6 pt-6 pb-5 ${justPublished ? 'bg-gradient-to-br from-primary to-primary-dark text-white' : 'border-b border-gray-100'}`}>
          <button
            ref={closeRef}
            onClick={onClose}
            className={`absolute top-4 right-4 w-9 h-9 flex items-center justify-center rounded-full transition-colors ${justPublished ? 'text-white/80 hover:bg-white/15' : 'text-gray-400 hover:bg-gray-100'}`}
            aria-label={t('admin.share.close')}
          >
            <X size={18} />
          </button>

          {justPublished ? (
            <div className="flex items-center gap-4 pr-8">
              <motion.div
                className="relative w-14 h-14 shrink-0 rounded-full bg-white/15 flex items-center justify-center"
                initial={{ scale: 0, rotate: -30 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', damping: 12, stiffness: 200, delay: 0.1 }}
              >
                <span className="absolute inset-0 rounded-full bg-white/20 animate-ping" />
                <PartyPopper size={26} />
              </motion.div>
              <div>
                <h2 id="share-modal-title" className="text-xl font-bold">{t(`admin.share.published.${item.type}`)}</h2>
                <p className="text-white/80 text-small mt-0.5">{t('admin.share.publishedSubtitle')}</p>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3 pr-8">
              <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <Share2 size={18} />
              </div>
              <div>
                <h2 id="share-modal-title" className="text-lg font-bold text-gray-900">{t('admin.share.title')}</h2>
                <p className="text-gray-500 text-small">{t('admin.share.subtitle')}</p>
              </div>
            </div>
          )}
        </div>

        <div className="px-6 py-5 space-y-5">
          {/* Aperçu tel qu'il apparaîtra sur les réseaux */}
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">{t('admin.share.preview')}</p>
            <div className="flex rounded-xl border border-gray-200 overflow-hidden bg-gray-50">
              {item.image ? (
                <div className="w-28 sm:w-36 shrink-0 bg-gray-100">
                  <img src={item.image} alt="" className="w-full h-full object-cover" />
                </div>
              ) : (
                <div className="w-28 sm:w-36 shrink-0 bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center p-3">
                  <img src="/images/logoOrigin.png" alt="" className="max-h-14 opacity-80" />
                </div>
              )}
              <div className="min-w-0 flex-1 px-4 py-3 border-l border-gray-200">
                <p className="text-[11px] text-gray-500 tracking-wide">{domain}</p>
                <p className="font-semibold text-gray-900 leading-snug line-clamp-2">{item.title}</p>
                {(displayDate || item.location) && (
                  <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-500 mt-1">
                    {displayDate && <span className="inline-flex items-center gap-1"><Calendar size={12} />{displayDate}</span>}
                    {item.location && <span className="inline-flex items-center gap-1"><MapPin size={12} />{item.location}</span>}
                  </p>
                )}
                {summary && <p className="text-small text-gray-600 line-clamp-2 mt-1">{summary}</p>}
              </div>
            </div>
          </div>

          {/* Réseaux */}
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">{t('admin.share.shareOn')}</p>
            <div className="grid grid-cols-4 gap-3">
              {networks.map((network, i) => (
                <motion.button
                  key={network.key}
                  type="button"
                  onClick={network.action}
                  className="group flex flex-col items-center gap-1.5 rounded-xl py-2 hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 transition-colors"
                  title={network.copiesMessage ? t('admin.share.copiesHint') : undefined}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 * i + 0.1 }}
                >
                  <span className="w-12 h-12 rounded-2xl overflow-hidden shadow-sm ring-1 ring-black/5 group-hover:-translate-y-0.5 group-hover:shadow-md transition-all">
                    {network.icon}
                  </span>
                  <span className="text-xs font-medium text-gray-700">{network.label}</span>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Message modifiable */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label htmlFor="share-message" className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{t('admin.share.message')}</label>
              <button type="button" onClick={handleCopyMessage} className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:text-primary-dark">
                <Copy size={13} /> {t('admin.share.copyMessage')}
              </button>
            </div>
            <textarea
              id="share-message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={6}
              className="w-full px-3.5 py-3 rounded-xl border border-gray-200 text-small text-gray-700 leading-relaxed resize-y focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
            <p className="text-xs text-gray-400 mt-1">{t('admin.share.messageHint')}</p>
          </div>

          {/* Lien direct */}
          <div className="flex items-center gap-2 rounded-xl border border-gray-200 pl-3.5 pr-1.5 py-1.5">
            <Link2 size={16} className="text-gray-400 shrink-0" />
            <input readOnly value={url} onFocus={(e) => e.target.select()} className="flex-1 min-w-0 text-small text-gray-600 bg-transparent focus:outline-none" aria-label={t('admin.share.link')} />
            <button
              type="button"
              onClick={handleCopyLink}
              className={`shrink-0 inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-small font-medium transition-colors ${linkCopied ? 'bg-emerald-100 text-emerald-700' : 'bg-primary text-white hover:bg-primary-dark'}`}
            >
              {linkCopied ? <Check size={15} /> : <Copy size={15} />}
              {linkCopied ? t('admin.share.copied') : t('admin.share.copyLink')}
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50/60">
          <a href={url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-small font-medium text-gray-600 hover:text-primary">
            <ExternalLink size={15} /> {t('admin.share.viewOnSite')}
          </a>
          <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg text-small font-medium text-gray-700 bg-white border border-gray-200 hover:bg-gray-100">
            {justPublished ? t('admin.share.later') : t('admin.share.close')}
          </button>
        </div>

        <AnimatePresence>
          {toast && (
            <motion.div
              role="status"
              className="sticky bottom-4 mx-auto mb-4 w-fit max-w-[90%] flex items-center gap-2 bg-gray-900 text-white text-small px-4 py-2.5 rounded-full shadow-lg"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
            >
              <Check size={15} className="text-emerald-400 shrink-0" />
              {toast}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  )
}

export default ShareModal
