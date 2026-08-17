import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import {
  Calendar, User, Eye, ArrowLeft, Edit, Trash2,
} from 'lucide-react'
import { newsService } from '../../services/news'
import type { AdminNews } from '../../services/news'
import { sanitizeHtml } from '../../lib/sanitize'

const categoryColors: Record<string, string> = {
  'Environnement': 'bg-emerald-100 text-emerald-700',
  'Éducation': 'bg-blue-100 text-blue-700',
  'Eau & Assainissement': 'bg-cyan-100 text-cyan-700',
  'Gestion des catastrophes': 'bg-orange-100 text-orange-700',
  'Développement rural': 'bg-green-100 text-green-700',
  'Gouvernance locale': 'bg-purple-100 text-purple-700',
}

const NewsDetail = () => {
  const { t } = useTranslation()
  const monthNames = [
    t('months.january'), t('months.february'), t('months.march'), t('months.april'),
    t('months.may'), t('months.june'), t('months.july'), t('months.august'),
    t('months.september'), t('months.october'), t('months.november'), t('months.december'),
  ]
  const { id } = useParams()
  const navigate = useNavigate()
  const [article, setArticle] = useState<AdminNews | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) return
    const fetchNews = async () => {
      try {
        const data = await newsService.getById(Number(id))
        setArticle(data)
      } catch {
        console.error(t('admin.errors.loadError'))
        navigate('/admin/news')
      } finally {
        setLoading(false)
      }
    }
    fetchNews()
  }, [id, navigate, t])

  const handleDelete = async () => {
    if (!confirm(t('admin.confirm.deleteNews'))) return
    try {
      await newsService.delete(Number(id))
      navigate('/admin/news')
    } catch {
      console.error(t('admin.errors.deleteError'))
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    )
  }

  if (!article) {
    return (
      <div className="text-center py-20 text-gray-500">{t('admin.errors.articleNotFound')}</div>
    )
  }

  const articleDate = new Date(article.date + 'T00:00:00')

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <Link to="/admin/news" className="inline-flex items-center gap-1.5 text-gray-500 hover:text-primary transition-colors text-small mb-2">
            <ArrowLeft size={16} />
            {t('admin.actions.backToNews')}
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">{article.title}</h1>
          <p className="text-gray-500 text-small mt-1">{t('admin.dashboard.title')} &gt; {t('admin.sidebar.news')} &gt; {t('admin.pages.news.details')}</p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            to={`/admin/news/${article.id}/edit`}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-white font-medium text-small hover:bg-primary-dark transition-colors"
          >
            <Edit size={16} />
            {t('admin.actions.edit')}
          </Link>
          <button
            onClick={handleDelete}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-red text-red font-medium text-small hover:bg-red/10 transition-colors"
          >
            <Trash2 size={16} />
            {t('admin.actions.delete')}
          </button>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
      >
        {/* Cover */}
        {article.coverImage && (
          <div className="aspect-video w-full overflow-hidden">
            <img src={article.coverImage} alt={article.title} className="w-full h-full object-cover" />
          </div>
        )}

        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main info */}
            <div className="lg:col-span-2 space-y-6">
              {article.excerpt && (
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-2">{t('admin.labels.excerpt')}</h2>
                  <p className="text-gray-600 leading-relaxed italic border-l-4 border-primary pl-4">{article.excerpt}</p>
                </div>
              )}

              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-2">{t('admin.labels.content')}</h2>
                {article.content ? (
                  <div className="text-gray-600 leading-relaxed" dangerouslySetInnerHTML={{ __html: sanitizeHtml(article.content) }} />
                ) : (
                  <p className="text-gray-400 italic">{t('admin.empty.noContent')}</p>
                )}
              </div>

              {article.gallery && article.gallery.length > 0 && (
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-3">{t('admin.labels.photoGallery')}</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {article.gallery.map((src, i) => (
                      <div key={i} className="aspect-video rounded-lg overflow-hidden">
                        <img src={src} alt={t('admin.labels.galleryPhoto', { index: i + 1 })} className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-4">
              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{t('admin.table.category')}</label>
                  <div className="mt-1">
                    <span className={`inline-block px-2.5 py-1 rounded-full text-[11px] font-semibold ${categoryColors[article.category] ?? 'bg-primary/10 text-primary'}`}>
                      {article.category}
                    </span>
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{t('admin.table.date')}</label>
                  <p className="flex items-center gap-1.5 text-gray-800 text-small mt-1">
                    <Calendar size={14} className="text-primary" />
                    {articleDate.getDate()} {monthNames[articleDate.getMonth()]} {articleDate.getFullYear()}
                  </p>
                </div>
                {article.author && (
                  <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{t('admin.labels.author')}</label>
                    <p className="flex items-center gap-1.5 text-gray-800 text-small mt-1">
                      <User size={14} className="text-primary" />
                      {article.author}
                    </p>
                  </div>
                )}
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{t('admin.table.views')}</label>
                  <p className="flex items-center gap-1.5 text-gray-800 text-small mt-1">
                    <Eye size={14} className="text-primary" />
                    {article.views}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default NewsDetail
