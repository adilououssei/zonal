import { useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { useTranslation } from 'react-i18next'
import { AnimatePresence, motion, type PanInfo } from 'framer-motion'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'

// Visionneuse plein écran des photos (galerie publique) : flèches, clavier
// (← → Échap), glissement du doigt sur mobile, compteur et bande de vignettes.
// Rendue dans un portail pour passer au-dessus du header fixe du site.

interface LightboxProps {
  images: string[]
  // Index de la photo affichée, null quand la visionneuse est fermée
  index: number | null
  onIndexChange: (index: number | null) => void
  title?: string
}

const SWIPE_THRESHOLD = 60

const Lightbox = ({ images, index, onIndexChange, title }: LightboxProps) => {
  const { t } = useTranslation()
  const [direction, setDirection] = useState(0)
  const closeRef = useRef<HTMLButtonElement>(null)
  const thumbsRef = useRef<HTMLDivElement>(null)
  const open = index !== null && images.length > 0

  const go = useCallback((step: number) => {
    if (index === null) return
    setDirection(step)
    onIndexChange((index + step + images.length) % images.length)
  }, [index, images.length, onIndexChange])

  const close = useCallback(() => onIndexChange(null), [onIndexChange])

  // Clavier et blocage du défilement de la page pendant l'ouverture
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
      else if (e.key === 'ArrowRight') go(1)
      else if (e.key === 'ArrowLeft') go(-1)
    }
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', onKey)
    }
  }, [open, go, close])

  useEffect(() => {
    if (open) closeRef.current?.focus()
  }, [open])

  // Garde la vignette active visible dans la bande du bas
  useEffect(() => {
    if (index === null) return
    thumbsRef.current?.querySelector<HTMLElement>(`[data-index="${index}"]`)?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })
  }, [index])

  const onDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.x < -SWIPE_THRESHOLD) go(1)
    else if (info.offset.x > SWIPE_THRESHOLD) go(-1)
  }

  const multiple = images.length > 1

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label={title ?? t('gallery.lightbox.label')}
          className="fixed inset-0 z-[100] flex flex-col bg-black/95 text-white select-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Barre du haut : titre, compteur, fermeture */}
          <div className="flex items-center justify-between gap-4 px-4 sm:px-6 py-3">
            <div className="min-w-0">
              {title && <p className="truncate text-small sm:text-body font-medium text-white/90">{title}</p>}
              <p className="text-xs text-white/60">{t('gallery.lightbox.counter', { current: index + 1, total: images.length })}</p>
            </div>
            <button
              ref={closeRef}
              onClick={close}
              className="shrink-0 w-11 h-11 flex items-center justify-center rounded-full hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60 transition-colors"
              aria-label={t('gallery.lightbox.close')}
            >
              <X size={24} />
            </button>
          </div>

          {/* Photo */}
          <div className="relative flex-1 min-h-0 flex items-center justify-center overflow-hidden" onClick={close}>
            <AnimatePresence initial={false} custom={direction} mode="popLayout">
              <motion.img
                key={index}
                src={images[index]}
                alt={title ? `${title} — ${t('gallery.lightbox.counter', { current: index + 1, total: images.length })}` : ''}
                custom={direction}
                variants={{
                  enter: (d: number) => ({ x: d > 0 ? 80 : d < 0 ? -80 : 0, opacity: 0 }),
                  center: { x: 0, opacity: 1 },
                  exit: (d: number) => ({ x: d > 0 ? -80 : 80, opacity: 0 }),
                }}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.25, ease: 'easeOut' }}
                drag={multiple ? 'x' : false}
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.7}
                onDragEnd={onDragEnd}
                onClick={(e) => e.stopPropagation()}
                className="max-h-full max-w-full object-contain px-2 sm:px-20 cursor-grab active:cursor-grabbing"
                draggable={false}
              />
            </AnimatePresence>

            {multiple && (
              <>
                <button
                  onClick={(e) => { e.stopPropagation(); go(-1) }}
                  className="hidden sm:flex absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm transition-colors"
                  aria-label={t('gallery.lightbox.previous')}
                >
                  <ChevronLeft size={28} />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); go(1) }}
                  className="hidden sm:flex absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm transition-colors"
                  aria-label={t('gallery.lightbox.next')}
                >
                  <ChevronRight size={28} />
                </button>
              </>
            )}
          </div>

          {/* Vignettes */}
          {multiple && (
            <div ref={thumbsRef} className="flex gap-2 overflow-x-auto px-4 py-3 justify-start sm:justify-center [scrollbar-width:none]">
              {images.map((src, i) => (
                <button
                  key={`${src}-${i}`}
                  data-index={i}
                  onClick={() => { setDirection(i > index ? 1 : -1); onIndexChange(i) }}
                  className={`shrink-0 w-14 h-14 sm:w-16 sm:h-16 rounded-lg overflow-hidden transition-all ${
                    i === index ? 'ring-2 ring-white opacity-100' : 'opacity-40 hover:opacity-80'
                  }`}
                  aria-label={t('gallery.lightbox.goTo', { n: i + 1 })}
                  aria-current={i === index}
                >
                  <img src={src} alt="" className="w-full h-full object-cover" loading="lazy" draggable={false} />
                </button>
              ))}
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  )
}

export default Lightbox
