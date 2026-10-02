import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { Handshake, Plus, Edit, Trash2, Mail, Phone, ToggleLeft, ToggleRight, Search, ChevronDown } from 'lucide-react'
import { partnersService } from '../../services/partners'
import type { AdminPartner } from '../../services/partners'
import RowActions from '../../components/admin/RowActions'

const statusColorMap: Record<string, string> = {
  active: 'bg-emerald-100 text-emerald-700',
  inactive: 'bg-gray-100 text-gray-500',
}

// Liste admin des partenaires : recherche, filtre par statut, et bascule
// rapide actif/inactif directement depuis la liste (sans passer par le formulaire).
const Partners = () => {
  const { t, i18n } = useTranslation()
  const [partners, setPartners] = useState<AdminPartner[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('Tous')

  useEffect(() => {
    let mounted = true
    const fetchData = async () => {
      try {
        setLoading(true)
        const data = await partnersService.getAll()
        if (mounted) setPartners(data)
      } catch {
        if (mounted) console.error('Erreur lors du chargement')
      } finally {
        if (mounted) setLoading(false)
      }
    }
    fetchData()
    return () => { mounted = false }
  }, [i18n.language])

  const handleToggleStatus = async (id: number) => {
    try {
      const updated = await partnersService.toggleStatus(id)
      setPartners((prev) => prev.map((p) => p.id === id ? { ...p, status: updated.status } : p))
    } catch {
      console.error('Erreur lors du changement de statut')
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm(t('admin.confirm.deleteItem'))) return
    try {
      await partnersService.delete(id)
      setPartners((prev) => prev.filter((p) => p.id !== id))
    } catch {
      console.error('Erreur lors de la suppression')
    }
  }

  const filtered = partners.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === 'Tous' || p.status === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t('admin.sidebar.partners')}</h1>
          <p className="text-gray-500 text-small mt-1">{t('admin.pages.partners')}</p>
        </div>
        <Link
          to="/admin/partners/new"
          className="inline-flex items-center gap-2 bg-primary text-white px-4 py-2.5 rounded-lg font-medium text-small hover:bg-primary-dark transition-colors"
        >
          <Plus size={18} />
          {t('admin.actions.addPartner')}
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t('admin.placeholders.searchPartner')}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 text-small focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
          />
        </div>
        <div className="relative">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="appearance-none pl-4 pr-9 py-2.5 rounded-lg border border-gray-200 text-small text-gray-600 focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer"
          >
            <option value="Tous">{t('admin.filters.statusAll')}</option>
            <option value="active">{t('admin.status.active')}</option>
            <option value="inactive">{t('admin.status.inactive')}</option>
          </select>
          <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
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
                  <th className="text-left px-4 py-3.5 text-gray-600 text-xs font-semibold tracking-wider">{t('admin.table.partner')}</th>
                  <th className="hidden md:table-cell text-left px-4 py-3.5 text-gray-600 text-xs font-semibold tracking-wider">{t('admin.table.domain')}</th>
                  <th className="hidden lg:table-cell text-left px-4 py-3.5 text-gray-600 text-xs font-semibold tracking-wider">{t('admin.table.contact')}</th>
                  <th className="hidden sm:table-cell text-left px-4 py-3.5 text-gray-600 text-xs font-semibold tracking-wider">{t('admin.table.status')}</th>
                  <th className="w-14 text-right px-4 py-3.5 text-gray-600 text-xs font-semibold tracking-wider">{t('admin.table.actions')}</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length > 0 ? (
                  filtered.map((partner, i) => (
                    <tr key={partner.id} className={`border-b border-gray-50 hover:bg-gray-50/80 transition-colors ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'}`}>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-lg bg-orange-50 flex items-center justify-center text-orange-500 shrink-0">
                            <Handshake size={16} />
                          </div>
                          <div className="min-w-0">
                            <span title={partner.name} className="block max-w-md text-gray-800 text-small font-medium leading-snug line-clamp-2 break-words">{partner.name}</span>
                            {/* Infos des colonnes masquées sur les écrans plus étroits */}
                            <div className="lg:hidden mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-500">
                              {partner.domain && <span className="md:hidden">{partner.domain}</span>}
                              {partner.email && <span className="inline-flex items-center gap-1 min-w-0"><Mail size={12} className="shrink-0" /><span className="truncate max-w-[14rem]">{partner.email}</span></span>}
                              {partner.phone && <span className="inline-flex items-center gap-1"><Phone size={12} />{partner.phone}</span>}
                              <span className={`sm:hidden inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold ${statusColorMap[partner.status] ?? 'bg-gray-100 text-gray-500'}`}>
                                {partner.status === 'active' ? t('admin.status.active') : t('admin.status.inactive')}
                              </span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="hidden md:table-cell px-4 py-3 text-gray-600 text-small">{partner.domain}</td>
                      <td className="hidden lg:table-cell px-4 py-3">
                        <div className="flex flex-col gap-0.5 text-gray-600 text-small max-w-[16rem]">
                          {partner.email && (
                            <span className="flex items-center gap-1.5 min-w-0" title={partner.email}>
                              <Mail size={13} className="shrink-0" />
                              <span className="truncate">{partner.email}</span>
                            </span>
                          )}
                          {partner.phone && (
                            <span className="flex items-center gap-1.5 whitespace-nowrap">
                              <Phone size={13} className="shrink-0" />
                              {partner.phone}
                            </span>
                          )}
                          {!partner.email && !partner.phone && (
                            <span className="text-gray-400 italic">—</span>
                          )}
                        </div>
                      </td>
                      <td className="hidden sm:table-cell px-4 py-3">
                        <button
                          onClick={() => handleToggleStatus(partner.id)}
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold whitespace-nowrap cursor-pointer hover:opacity-80 transition-opacity ${statusColorMap[partner.status] ?? 'bg-gray-100 text-gray-500'}`}
                          title={partner.status === 'active' ? t('admin.actions.deactivate') : t('admin.actions.activate')}
                        >
                          {partner.status === 'active' ? <ToggleRight size={13} /> : <ToggleLeft size={13} />}
                          {partner.status === 'active' ? t('admin.status.active') : t('admin.status.inactive')}
                        </button>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <RowActions
                          label={partner.name}
                          actions={[
                            { key: 'edit', label: t('admin.actions.edit'), icon: Edit, to: `/admin/partners/${partner.id}/edit` },
                            {
                              key: 'toggle',
                              label: partner.status === 'active' ? t('admin.actions.deactivate') : t('admin.actions.activate'),
                              icon: partner.status === 'active' ? ToggleLeft : ToggleRight,
                              onClick: () => handleToggleStatus(partner.id),
                            },
                            { key: 'delete', label: t('admin.actions.delete'), icon: Trash2, danger: true, onClick: () => handleDelete(partner.id) },
                          ]}
                        />
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-5 py-10 text-center text-gray-400 text-small">
                      {t('admin.empty.noPartners')}
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

export default Partners
