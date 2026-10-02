import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import {
  FolderOpen, Plus, Edit, Trash2, MapPin, Search, ChevronDown,
  ChevronsLeft, ChevronRight, Share2, Coins
} from 'lucide-react'
import { projectsService } from '../../services/projects'
import type { AdminProject } from '../../services/projects'
import ShareModal from '../../components/admin/ShareModal'
import { useShareModal } from '../../components/admin/useShareModal'
import RowActions from '../../components/admin/RowActions'
import { statusLabelMap, statusColorMap } from '../../data/adminProjectsData'

const statusFilters: ('Tous' | string)[] = ['Tous', 'ongoing', 'completed', 'planned']

// Liste admin des projets : recherche et filtre par statut.
const Projects = () => {
  const { t, i18n } = useTranslation()
  const [projects, setProjects] = useState<AdminProject[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<'Tous' | string>('Tous')
  const { shareItem, justPublished, openShare, closeShare } = useShareModal()

  useEffect(() => {
    let mounted = true
    const fetchData = async () => {
      try {
        setLoading(true)
        const data = await projectsService.getAll()
        if (mounted) setProjects(data)
      } catch {
        if (mounted) console.error('Erreur lors du chargement des projets')
      } finally {
        if (mounted) setLoading(false)
      }
    }
    fetchData()
    return () => { mounted = false }
  }, [i18n.language])

  const handleDelete = async (id: number) => {
    if (!confirm(t('admin.confirm.deleteProject'))) return
    try {
      await projectsService.delete(id)
      setProjects((prev) => prev.filter((p) => p.id !== id))
    } catch {
      console.error('Erreur lors de la suppression')
    }
  }

  const filteredProjects = projects.filter((project) => {
    const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === 'Tous' || project.status === statusFilter
    return matchesSearch && matchesStatus
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
          <h1 className="text-2xl font-bold text-gray-900">{t('admin.sidebar.projects')}</h1>
          <p className="text-gray-500 text-small mt-1">{t('admin.pages.projects')}</p>
        </div>
        <Link
          to="/admin/projects/new"
          className="inline-flex items-center gap-2 bg-primary text-white px-4 py-2.5 rounded-lg font-medium text-small hover:bg-primary-dark transition-colors"
        >
          <Plus size={18} />
          {t('admin.actions.addProject')}
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t('admin.placeholders.searchProject')}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 text-small focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
          />
        </div>
        <div className="relative">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="appearance-none pl-4 pr-9 py-2.5 rounded-lg border border-gray-200 text-small text-gray-600 focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer"
          >
            {statusFilters.map((s) => (
              <option key={s} value={s}>{s === 'Tous' ? `${t('admin.table.status')}: ${t('projects.filter.all')}` : statusLabelMap[s]}</option>
            ))}
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
                <th className="text-left px-4 py-3.5 text-gray-600 text-xs font-semibold tracking-wider">{t('admin.table.project')}</th>
                <th className="hidden lg:table-cell text-left px-4 py-3.5 text-gray-600 text-xs font-semibold tracking-wider">{t('admin.table.location')}</th>
                <th className="hidden xl:table-cell text-left px-4 py-3.5 text-gray-600 text-xs font-semibold tracking-wider">{t('admin.table.budget')}</th>
                <th className="hidden sm:table-cell text-left px-4 py-3.5 text-gray-600 text-xs font-semibold tracking-wider">{t('admin.table.status')}</th>
                <th className="w-14 text-right px-4 py-3.5 text-gray-600 text-xs font-semibold tracking-wider">{t('admin.table.actions')}</th>
              </tr>
            </thead>
            <tbody>
              {filteredProjects.length > 0 ? (
                filteredProjects.map((project, i) => (
                  <tr key={project.id} className={`border-b border-gray-50 hover:bg-gray-50/80 transition-colors ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'}`}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-500 shrink-0">
                          <FolderOpen size={16} />
                        </div>
                        <div className="min-w-0">
                          {/* Titre limité à 2 lignes : le titre complet est au survol et dans le formulaire */}
                          <Link
                            to={`/admin/projects/${project.id}/edit`}
                            title={project.title}
                            className="block max-w-md text-gray-800 text-small font-medium leading-snug line-clamp-2 break-words hover:text-primary transition-colors"
                          >
                            {project.title}
                          </Link>
                          {/* Infos des colonnes masquées sur les écrans plus étroits */}
                          <div className="xl:hidden mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-500">
                            {project.location && <span className="lg:hidden inline-flex items-center gap-1 min-w-0"><MapPin size={12} className="shrink-0" /><span className="truncate max-w-[14rem]">{project.location}</span></span>}
                            {project.budget && <span className="inline-flex items-center gap-1"><Coins size={12} />{project.budget}</span>}
                            <span className={`sm:hidden inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold ${statusColorMap[project.status] ?? 'bg-gray-100 text-gray-500'}`}>{statusLabelMap[project.status] ?? project.status}</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="hidden lg:table-cell px-4 py-3">
                      <span className="flex items-center gap-1.5 text-gray-600 text-small max-w-[14rem]" title={project.location}>
                        <MapPin size={14} className="shrink-0" />
                        <span className="truncate">{project.location}</span>
                      </span>
                    </td>
                    <td className="hidden xl:table-cell px-4 py-3 text-gray-600 text-small whitespace-nowrap">{project.budget}</td>
                    <td className="hidden sm:table-cell px-4 py-3">
                      <span className={`inline-block px-2.5 py-1 rounded-full text-[11px] font-semibold whitespace-nowrap ${statusColorMap[project.status] ?? 'bg-gray-100 text-gray-500'}`}>
                        {statusLabelMap[project.status] ?? project.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <RowActions
                        label={project.title}
                        actions={[
                          { key: 'edit', label: t('admin.actions.edit'), icon: Edit, to: `/admin/projects/${project.id}/edit` },
                          {
                            key: 'share', label: t('admin.share.share'), icon: Share2,
                            onClick: () => openShare({
                              type: 'projects', id: project.id, title: project.title, summary: project.description,
                              image: project.image, location: project.location,
                            }),
                          },
                          { key: 'delete', label: t('admin.actions.delete'), icon: Trash2, danger: true, onClick: () => handleDelete(project.id) },
                        ]}
                      />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-5 py-10 text-center text-gray-400 text-small">
                    {t('admin.empty.noSearchResults')}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-center gap-2 px-5 py-4 border-t border-gray-100">
            <button className="w-9 h-9 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 transition-colors" aria-label={t('admin.pagination.previous')}>
            <ChevronsLeft size={16} />
          </button>
          {[1, 2, 3].map((page) => (
            <button
              key={page}
              className={`w-9 h-9 flex items-center justify-center rounded-lg text-small font-medium transition-colors ${page === 1 ? 'bg-primary text-white' : 'text-gray-600 hover:bg-gray-100'}`}
            >
              {page}
            </button>
          ))}
          <button className="flex items-center gap-1 px-3 h-9 rounded-lg text-gray-600 text-small font-medium hover:bg-gray-100 transition-colors">
            {t('admin.pagination.next')} <ChevronRight size={14} />
          </button>
        </div>
      </motion.div>
      <ShareModal item={shareItem} justPublished={justPublished} onClose={closeShare} />
    </div>
  )
}

export default Projects
