import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import {
  Plus, Edit, Trash2, Search, ChevronDown,
  ChevronsLeft, ChevronRight, Eye, Share2
} from 'lucide-react'
import { newsService, type AdminNews } from '../../services/news'
import ShareModal from '../../components/admin/ShareModal'
import { useShareModal } from '../../components/admin/useShareModal'
import RowActions from '../../components/admin/RowActions'

// Liste admin des articles d'actualité : recherche, filtre par catégorie
// (déduite dynamiquement des articles existants). Le tri "récent/populaire"
// et la pagination sont pour l'instant des contrôles décoratifs (non branchés
// sur filteredNews).
const NewsList = () => {
  const { t, i18n } = useTranslation()
  const [news, setNews] = useState<AdminNews[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('Toutes')
  const { shareItem, justPublished, openShare, closeShare } = useShareModal()

  const categories = ['Toutes', ...Array.from(new Set(news.map((a) => a.category)))]
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    let mounted = true
    const fetchData = async () => {
      try {
        setLoading(true)
        const data = await newsService.getAll()
        if (mounted) setNews(data)
      } catch {
        if (mounted) console.error(t('admin.errors.loadError'))
      } finally {
        if (mounted) setLoading(false)
      }
    }
    fetchData()
    return () => { mounted = false }
  }, [i18n.language, t])

  const handleDelete = async (id: number) => {
    if (!confirm(t('admin.confirm.deleteNews'))) return
    try {
      await newsService.delete(id)
      setNews((prev) => prev.filter((a) => a.id !== id))
    } catch {
      console.error(t('admin.errors.deleteError'))
    }
  }

  const filteredNews = news.filter((article) => {
    const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = categoryFilter === 'Toutes' || article.category === categoryFilter
    return matchesSearch && matchesCategory
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
          <h1 className="text-2xl font-bold text-gray-900">{t('admin.pages.news.title')}</h1>
          <p className="text-gray-500 text-small mt-1">{t('admin.dashboard.title')} &gt; {t('admin.sidebar.news')}</p>
        </div>
        <Link
          to="/admin/news/new"
          className="inline-flex items-center gap-2 bg-primary text-white px-4 py-2.5 rounded-lg font-medium text-small hover:bg-primary-dark transition-colors"
        >
          <Plus size={18} />
          {t('admin.actions.addArticle')}
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t('admin.placeholders.searchArticle')}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 text-small focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
          />
        </div>
        <div className="relative">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="appearance-none pl-4 pr-9 py-2.5 rounded-lg border border-gray-200 text-small text-gray-600 focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer"
          >
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat === 'Toutes' ? t('admin.categories.all') : cat}</option>
              ))}
          </select>
          <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
        </div>
        <div className="relative">
          <select
            defaultValue="recent"
            className="appearance-none pl-4 pr-9 py-2.5 rounded-lg border border-gray-200 text-small text-gray-600 focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer"
          >
            <option value="recent">{t('news.sort.recent')}</option>
            <option value="oldest">{t('news.sort.oldest')}</option>
            <option value="popular">{t('news.sort.popular')}</option>
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
                <th className="hidden lg:table-cell text-left px-4 py-3.5 text-gray-600 text-xs font-semibold tracking-wider">{t('admin.table.category')}</th>
                <th className="hidden md:table-cell text-left px-4 py-3.5 text-gray-600 text-xs font-semibold tracking-wider">{t('admin.table.date')}</th>
                <th className="hidden xl:table-cell text-left px-4 py-3.5 text-gray-600 text-xs font-semibold tracking-wider">{t('admin.table.views')}</th>
                <th className="w-14 text-right px-4 py-3.5 text-gray-600 text-xs font-semibold tracking-wider">{t('admin.table.actions')}</th>
              </tr>
            </thead>
            <tbody>
              {filteredNews.length > 0 ? (
                filteredNews.map((article, i) => (
                  <tr key={article.id} className={`border-b border-gray-50 hover:bg-gray-50/80 transition-colors ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'}`}>
                    <td className="hidden sm:table-cell px-4 py-3">
                      <div className="w-14 h-14 rounded-lg overflow-hidden bg-gray-100">
                        {article.coverImage && <img src={article.coverImage} alt="" className="w-full h-full object-cover" />}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      {/* Titre limité à 2 lignes : le titre complet est au survol et sur la fiche détail */}
                      <Link
                        to={`/admin/news/${article.id}`}
                        title={article.title}
                        className="block max-w-md text-gray-800 text-small font-medium leading-snug line-clamp-2 break-words hover:text-primary transition-colors"
                      >
                        {article.title}
                      </Link>
                      {/* Infos des colonnes masquées sur les écrans plus étroits */}
                      <div className="xl:hidden mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-500">
                        <span className="lg:hidden inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold bg-primary/10 text-primary">{article.category}</span>
                        <span className="md:hidden">{article.date}</span>
                        <span className="inline-flex items-center gap-1"><Eye size={12} />{article.views}</span>
                      </div>
                    </td>
                    <td className="hidden lg:table-cell px-4 py-3">
                      <span className="inline-block px-2.5 py-1 rounded-full text-[11px] font-semibold bg-primary/10 text-primary whitespace-nowrap">
                        {article.category}
                      </span>
                    </td>
                    <td className="hidden md:table-cell px-4 py-3 text-gray-600 text-small whitespace-nowrap">{article.date}</td>
                    <td className="hidden xl:table-cell px-4 py-3">
                      <span className="flex items-center gap-1.5 text-gray-600 text-small">
                        <Eye size={14} className="text-gray-400" />
                        {article.views}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <RowActions
                        label={article.title}
                        actions={[
                          { key: 'view', label: t('admin.actions.view'), icon: Eye, to: `/admin/news/${article.id}` },
                          { key: 'edit', label: t('admin.actions.edit'), icon: Edit, to: `/admin/news/${article.id}/edit` },
                          {
                            key: 'share', label: t('admin.share.share'), icon: Share2,
                            onClick: () => openShare({
                              type: 'news', id: article.id, title: article.title,
                              summary: article.excerpt || article.content, image: article.coverImage, date: article.date,
                            }),
                          },
                          { key: 'delete', label: t('admin.actions.delete'), icon: Trash2, danger: true, onClick: () => handleDelete(article.id) },
                        ]}
                      />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-5 py-10 text-center text-gray-400 text-small">
                    {t('admin.empty.noSearchResults')}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-center gap-2 px-5 py-4 border-t border-gray-100">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            className="w-9 h-9 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 transition-colors"
            aria-label={t('carousel.prev')}
          >
            <ChevronsLeft size={16} />
          </button>
          {[1, 2, 3].map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`w-9 h-9 flex items-center justify-center rounded-lg text-small font-medium transition-colors ${
                page === currentPage ? 'bg-primary text-white' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {page}
            </button>
          ))}
          <button
            onClick={() => setCurrentPage((p) => p + 1)}
            className="flex items-center gap-1 px-3 h-9 rounded-lg text-gray-600 text-small font-medium hover:bg-gray-100 transition-colors"
          >
            {t('carousel.next')} <ChevronRight size={14} />
          </button>
        </div>
      </motion.div>
      <ShareModal item={shareItem} justPublished={justPublished} onClose={closeShare} />
    </div>
  )
}

export default NewsList
