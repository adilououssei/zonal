import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import {
  Calendar, MapPin, Plus, Edit, Trash2, Search, ChevronDown,
  ChevronsLeft, ChevronRight, Eye, Share2
} from 'lucide-react'
import { eventsService } from '../../services/events'
import type { AdminEvent } from '../../services/events'
import ShareModal from '../../components/admin/ShareModal'
import { useShareModal } from '../../components/admin/useShareModal'
import RowActions from '../../components/admin/RowActions'

// Liste admin des événements : recherche, filtre par statut et par date,
// suppression avec confirmation. La pagination en bas de tableau est pour
// l'instant un affichage statique (non branchée sur filteredEvents).
type FilterStatus = 'Tous' | 'À venir' | 'En cours' | 'Terminé'

const statusFilters: FilterStatus[] = ['Tous', 'À venir', 'En cours', 'Terminé']

const statusColorMap: Record<string, string> = {
  'À venir': 'bg-emerald-100 text-emerald-700',
  'En cours': 'bg-blue-100 text-blue-700',
  'Terminé': 'bg-gray-100 text-gray-500',
}

const EventsList = () => {
  const { t, i18n } = useTranslation()
  const [events, setEvents] = useState<AdminEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<FilterStatus>('Tous')
  const [dateFilter, setDateFilter] = useState<'toutes' | 'month' | 'week'>('toutes')
  const { shareItem, justPublished, openShare, closeShare } = useShareModal()

  useEffect(() => {
    let mounted = true
    const fetchData = async () => {
      try {
        setLoading(true)
        const data = await eventsService.getAll()
        if (mounted) setEvents(data)
      } catch {
        if (mounted) console.error(t('admin.errors.loadEvents'))
      } finally {
        if (mounted) setLoading(false)
      }
    }
    fetchData()
    return () => { mounted = false }
  }, [i18n.language, t])

  const handleDelete = async (id: number) => {
    if (!confirm(t('admin.confirm.deleteEvent'))) return
    try {
      await eventsService.delete(id)
      setEvents((prev) => prev.filter((e) => e.id !== id))
    } catch {
      console.error(t('admin.errors.deleteEvent'))
    }
  }

  // Combine les 3 filtres (recherche texte + statut + période) côté client,
  // sans re-solliciter l'API
  const filteredEvents = events.filter((event) => {
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === 'Tous' || event.status === statusFilter

    let matchesDate = true
    if (dateFilter === 'month') {
      const now = new Date()
      const eventDate = new Date(event.date)
      matchesDate =
        eventDate.getMonth() === now.getMonth() &&
        eventDate.getFullYear() === now.getFullYear()
    } else if (dateFilter === 'week') {
      const now = new Date()
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
      const eventDate = new Date(event.date)
      matchesDate = eventDate >= weekAgo && eventDate <= now
    }

    return matchesSearch && matchesStatus && matchesDate
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    )
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t('admin.sidebar.events')}</h1>
          <p className="text-gray-500 text-small mt-1">{t('admin.dashboard.title')} &gt; {t('admin.sidebar.events')}</p>
        </div>
        <Link
          to="/admin/events/new"
          className="inline-flex items-center gap-2 bg-primary text-white px-4 py-2.5 rounded-lg font-medium text-small hover:bg-primary-dark transition-colors"
        >
          <Plus size={18} />
          {t('admin.actions.addEvent')}
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t('admin.placeholders.searchEvent')}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 text-small focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
          />
        </div>
        <div className="relative">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as FilterStatus)}
            className="appearance-none pl-4 pr-9 py-2.5 rounded-lg border border-gray-200 text-small text-gray-600 focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer"
          >
            {statusFilters.map((s) => (
              <option key={s} value={s}>{s === 'Tous' ? t('admin.filters.statusAll') : s === 'À venir' ? t('admin.status.upcoming') : s === 'En cours' ? t('admin.status.ongoing') : t('admin.status.completed')}</option>
            ))}
          </select>
          <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
        </div>
        <div className="relative">
          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value as 'toutes' | 'month' | 'week')}
            className="appearance-none pl-4 pr-9 py-2.5 rounded-lg border border-gray-200 text-small text-gray-600 focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer"
          >
            <option value="toutes">{t('admin.filters.dateAll')}</option>
            <option value="month">{t('admin.filters.thisMonth')}</option>
            <option value="week">{t('admin.filters.thisWeek')}</option>
          </select>
          <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="hidden sm:table-cell w-20 text-left px-4 py-3.5 text-gray-600 text-xs font-semibold tracking-wider">{t('admin.table.image')}</th>
                <th className="text-left px-4 py-3.5 text-gray-600 text-xs font-semibold tracking-wider">{t('admin.table.title')}</th>
                <th className="hidden md:table-cell text-left px-4 py-3.5 text-gray-600 text-xs font-semibold tracking-wider">{t('admin.table.date')}</th>
                <th className="hidden xl:table-cell text-left px-4 py-3.5 text-gray-600 text-xs font-semibold tracking-wider">{t('admin.table.location')}</th>
                <th className="hidden sm:table-cell text-left px-4 py-3.5 text-gray-600 text-xs font-semibold tracking-wider">{t('admin.table.status')}</th>
                <th className="w-14 text-right px-4 py-3.5 text-gray-600 text-xs font-semibold tracking-wider">{t('admin.table.actions')}</th>
              </tr>
            </thead>
            <tbody>
              {filteredEvents.length > 0 ? (
                filteredEvents.map((event, i) => (
                  <tr key={event.id} className={`border-b border-gray-50 hover:bg-gray-50/80 transition-colors ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'}`}>
                    <td className="hidden sm:table-cell px-4 py-3">
                      <div className="w-14 h-14 rounded-lg overflow-hidden bg-gray-100">
                        {event.coverImage && <img src={event.coverImage} alt="" className="w-full h-full object-cover" />}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      {/* Titre limité à 2 lignes : le titre complet est au survol et sur la fiche détail */}
                      <Link
                        to={`/admin/events/${event.id}`}
                        title={event.title}
                        className="block max-w-md text-gray-800 text-small font-medium leading-snug line-clamp-2 break-words hover:text-primary transition-colors"
                      >
                        {event.title}
                      </Link>
                      {/* Infos des colonnes masquées sur les écrans plus étroits */}
                      <div className="xl:hidden mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-500">
                        <span className="md:hidden inline-flex items-center gap-1"><Calendar size={12} />{event.date}</span>
                        {event.location && <span className="inline-flex items-center gap-1 min-w-0"><MapPin size={12} className="shrink-0" /><span className="truncate max-w-[14rem]">{event.location}</span></span>}
                        <span className={`sm:hidden inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold ${statusColorMap[event.status] ?? 'bg-gray-100 text-gray-500'}`}>{event.status}</span>
                      </div>
                    </td>
                    <td className="hidden md:table-cell px-4 py-3 text-gray-600 text-small whitespace-nowrap">{event.date}</td>
                    <td className="hidden xl:table-cell px-4 py-3">
                      <span className="flex items-center gap-1.5 text-gray-600 text-small max-w-[14rem]" title={event.location}>
                        <MapPin size={14} className="text-gray-400 shrink-0" />
                        <span className="truncate">{event.location}</span>
                      </span>
                    </td>
                    <td className="hidden sm:table-cell px-4 py-3">
                      <span className={`inline-block px-2.5 py-1 rounded-full text-[11px] font-semibold whitespace-nowrap ${statusColorMap[event.status] ?? 'bg-gray-100 text-gray-500'}`}>
                        {event.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <RowActions
                        label={event.title}
                        actions={[
                          { key: 'view', label: t('admin.tooltip.viewDetails'), icon: Eye, to: `/admin/events/${event.id}` },
                          { key: 'edit', label: t('admin.actions.edit'), icon: Edit, to: `/admin/events/${event.id}/edit` },
                          {
                            key: 'share', label: t('admin.share.share'), icon: Share2,
                            onClick: () => openShare({
                              type: 'events', id: event.id, title: event.title, summary: event.description,
                              image: event.coverImage, date: event.date, location: event.location,
                            }),
                          },
                          { key: 'delete', label: t('admin.actions.delete'), icon: Trash2, danger: true, onClick: () => handleDelete(event.id) },
                        ]}
                      />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-5 py-10 text-center text-gray-400 text-small">
                    {t('admin.empty.noResults')}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-center gap-2 px-5 py-4 border-t border-gray-100">
          <button className="w-9 h-9 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 transition-colors" aria-label={t('carousel.prev')}>
            <ChevronsLeft size={16} />
          </button>
          {[1, 2, 3].map((page) => (
            <button
              key={page}
              className={`w-9 h-9 flex items-center justify-center rounded-lg text-small font-medium transition-colors ${
                page === 1 ? 'bg-primary text-white' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {page}
            </button>
          ))}
          <button className="flex items-center gap-1 px-3 h-9 rounded-lg text-gray-600 text-small font-medium hover:bg-gray-100 transition-colors">
            {t('carousel.next')} <ChevronRight size={14} />
          </button>
        </div>
      </motion.div>
      <ShareModal item={shareItem} justPublished={justPublished} onClose={closeShare} />
    </div>
  )
}

export default EventsList
