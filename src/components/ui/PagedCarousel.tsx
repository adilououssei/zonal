import { useEffect, useState, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { AnimatePresence, motion, type PanInfo } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'

// Carrousel « par pages » de l'accueil (réalisations, albums) : 3 cartes par
// page sur ordinateur, 1 sur mobile. Défilement manuel uniquement (flèches,
// points, glissement du doigt), sans lecture automatique, avec un simple
// fondu légèrement décalé entre deux pages.

interface PagedCarouselProps<T> {
  items: T[]
  getKey: (item: T) => string | number
  renderItem: (item: T) => ReactNode
  perPage?: number
}

const MOBILE_QUERY = '(max-width: 767px)'
const SWIPE_THRESHOLD = 50

const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(() => typeof window !== 'undefined' && window.matchMedia(MOBILE_QUERY).matches)
  useEffect(() => {
    const media = window.matchMedia(MOBILE_QUERY)
    const onChange = (e: MediaQueryListEvent) => setIsMobile(e.matches)
    media.addEventListener('change', onChange)
    return () => media.removeEventListener('change', onChange)
  }, [])
  return isMobile
}

function PagedCarousel<T>({ items, getKey, renderItem, perPage = 3 }: PagedCarouselProps<T>) {
  const { t } = useTranslation()
  const isMobile = useIsMobile()
  const size = isMobile ? 1 : perPage
  const pageCount = Math.max(1, Math.ceil(items.length / size))
  const [[page, direction], setPage] = useState<[number, number]>([0, 0])
  // Reste dans les bornes quand le nombre de pages change (passage mobile ↔ ordinateur)
  const current = Math.min(page, pageCount - 1)

  const goTo = (next: number, dir: number) => setPage([(next + pageCount) % pageCount, dir])
  const paginate = (dir: number) => goTo(current + dir, dir)

  const onDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.x < -SWIPE_THRESHOLD) paginate(1)
    else if (info.offset.x > SWIPE_THRESHOLD) paginate(-1)
  }

  const visible = items.slice(current * size, current * size + size)
  const multiple = pageCount > 1

  return (
    <div>
      <div className="relative">
        <div className="overflow-hidden -m-3 p-3">
          <AnimatePresence mode="wait" initial={false} custom={direction}>
            <motion.div
              key={`${current}-${size}`}
              custom={direction}
              variants={{
                enter: (d: number) => ({ opacity: 0, x: d * 24 }),
                center: { opacity: 1, x: 0 },
                exit: (d: number) => ({ opacity: 0, x: d * -24 }),
              }}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.35, ease: 'easeOut' }}
              drag={multiple && isMobile ? 'x' : false}
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.3}
              onDragEnd={onDragEnd}
              className="grid grid-cols-1 md:grid-cols-3 gap-6"
            >
              {visible.map((item) => (
                <div key={getKey(item)} className="min-w-0">{renderItem(item)}</div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>

        {multiple && (
          <>
            <button
              onClick={() => paginate(-1)}
              aria-label={t('carousel.prev')}
              className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-6 w-11 h-11 rounded-full bg-primary text-white items-center justify-center shadow-lg hover:bg-primary-dark transition-colors z-10"
            >
              <ChevronLeft size={22} />
            </button>
            <button
              onClick={() => paginate(1)}
              aria-label={t('carousel.next')}
              className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-6 w-11 h-11 rounded-full bg-primary text-white items-center justify-center shadow-lg hover:bg-primary-dark transition-colors z-10"
            >
              <ChevronRight size={22} />
            </button>
          </>
        )}
      </div>

      {multiple && (
        <div className="flex items-center justify-center gap-2 mt-8">
          {Array.from({ length: pageCount }).map((_, index) => (
            <button
              key={index}
              onClick={() => goTo(index, index > current ? 1 : -1)}
              aria-label={t('carousel.slide', { n: index + 1 })}
              aria-current={index === current}
              className={`h-2.5 rounded-full transition-all duration-300 ${
                index === current ? 'w-6 bg-red' : 'w-2.5 bg-gray-300 hover:bg-gray-400'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default PagedCarousel
