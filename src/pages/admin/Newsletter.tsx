import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { Trash2, Search, Mail } from 'lucide-react'
import { newsletterService } from '../../services/newsletter'
import type { NewsletterSubscriber } from '../../services/newsletter'
import RowActions from '../../components/admin/RowActions'

// Liste admin des abonnés à la newsletter : recherche et suppression.
// L'inscription se fait uniquement côté public (voir services/newsletter.ts) ;
// cette page ne permet pas d'ajouter un abonné manuellement.
const Newsletter = () => {
  const { t, i18n } = useTranslation()

  const formatDate = (d: string | null) => {
    if (!d) return '—'
    return new Date(d).toLocaleDateString(i18n.language === 'en' ? 'en-US' : 'fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })
  }

  const [subscribers, setSubscribers] = useState<NewsletterSubscriber[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    let mounted = true
    const fetchData = async () => {
      try {
        setLoading(true)
        const data = await newsletterService.getSubscribers()
        if (mounted) setSubscribers(data)
      } catch {
        if (mounted) console.error('Erreur lors du chargement')
      } finally {
        if (mounted) setLoading(false)
      }
    }
    fetchData()
    return () => { mounted = false }
  }, [])

  const handleDelete = async (id: number) => {
    if (!confirm(t('admin.confirm.deleteSubscriber'))) return
    try {
      await newsletterService.deleteSubscriber(id)
      setSubscribers((prev) => prev.filter((s) => s.id !== id))
    } catch {
      console.error('Erreur lors de la suppression')
    }
  }

  const filtered = subscribers.filter((s) =>
    s.email.toLowerCase().includes(searchQuery.toLowerCase())
    || (s.name ?? '').toLowerCase().includes(searchQuery.toLowerCase())
  )

  const activeCount = subscribers.filter((s) => s.isActive).length

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t('admin.sidebar.newsletter')}</h1>
          <p className="text-gray-500 text-small mt-1">{t('admin.sidebar.dashboard')} &gt; {t('admin.sidebar.newsletter')}</p>
        </div>
        <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2.5 rounded-lg font-medium text-small">
          <Mail size={16} />
          {activeCount} {t('admin.dashboard.stats.subscribers')}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t('admin.placeholders.searchUser')}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 text-small focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
          />
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
      >
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/50">
                  <th className="text-left px-4 py-3.5 text-gray-600 text-xs font-semibold tracking-wider">{t('admin.table.email')}</th>
                  <th className="hidden md:table-cell text-left px-4 py-3.5 text-gray-600 text-xs font-semibold tracking-wider">{t('admin.table.name')}</th>
                  <th className="hidden lg:table-cell text-left px-4 py-3.5 text-gray-600 text-xs font-semibold tracking-wider">{t('admin.table.subscribedAt')}</th>
                  <th className="hidden sm:table-cell text-left px-4 py-3.5 text-gray-600 text-xs font-semibold tracking-wider">{t('admin.table.status')}</th>
                  <th className="w-14 text-right px-4 py-3.5 text-gray-600 text-xs font-semibold tracking-wider">{t('admin.table.actions')}</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length > 0 ? (
                  filtered.map((s, i) => (
                    <tr key={s.id} className={`border-b border-gray-50 hover:bg-gray-50/80 transition-colors ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'}`}>
                      <td className="px-4 py-3">
                        <span title={s.email} className="block max-w-xs sm:max-w-sm truncate text-gray-800 text-small font-medium">{s.email}</span>
                        {/* Infos des colonnes masquées sur les écrans plus étroits */}
                        <div className="lg:hidden mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-500">
                          {s.name && <span className="md:hidden">{s.name}</span>}
                          <span>{formatDate(s.subscribedAt)}</span>
                          <span className={`sm:hidden inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold ${s.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'}`}>
                            {s.isActive ? t('admin.status.active') : t('admin.status.inactive')}
                          </span>
                        </div>
                      </td>
                      <td className="hidden md:table-cell px-4 py-3 text-gray-600 text-small">
                        <span className="block max-w-[14rem] truncate" title={s.name || undefined}>{s.name || '—'}</span>
                      </td>
                      <td className="hidden lg:table-cell px-4 py-3 text-gray-600 text-small whitespace-nowrap">{formatDate(s.subscribedAt)}</td>
                      <td className="hidden sm:table-cell px-4 py-3">
                        <span className={`inline-block px-2.5 py-1 rounded-full text-[11px] font-semibold whitespace-nowrap ${s.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'}`}>
                          {s.isActive ? t('admin.status.active') : t('admin.status.inactive')}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <RowActions
                          label={s.email}
                          actions={[
                            { key: 'delete', label: t('admin.actions.delete'), icon: Trash2, danger: true, onClick: () => handleDelete(s.id) },
                          ]}
                        />
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-5 py-10 text-center text-gray-400 text-small">
                      {t('admin.empty.newsletter')}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>
    </div>
  )
}

export default Newsletter
