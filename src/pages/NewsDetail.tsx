import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import {
  Calendar, User, ChevronRight, ArrowLeft, ArrowRight, Eye,
} from 'lucide-react'
import { publicNewsService } from '../services/news'
import type { PublicNews } from '../services/news'

const getExcerpt = (html: string | null, maxLength = 120): string => {
  if (!html) return ''
  const text = html.replace(/<[^>]*>/g, '')
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength).trimEnd() + '...'
}

const categoryColors: Record<string, string> = {
  'Environnement': 'bg-emerald-100 text-emerald-700',
  'Éducation': 'bg-blue-100 text-blue-700',
  'Eau & Assainissement': 'bg-cyan-100 text-cyan-700',
  'Gestion des catastrophes': 'bg-orange-100 text-orange-700',
  'Développement rural': 'bg-green-100 text-green-700',
  'Gouvernance locale': 'bg-purple-100 text-purple-700',
}

const NewsDetail = () => {
  const { t, i18n } = useTranslation()
  const { id } = useParams()
  const [article, setArticle] = useState<PublicNews | null>(null)
  const [loading, setLoading] = useState(true)
  const [relatedNews, setRelatedNews] = useState<PublicNews[]>([])

  useEffect(() => {
    if (!id) return
    const fetchNews = async () => {
      try {
        const data = await publicNewsService.getById(Number(id))
        setArticle(data)
        const all = await publicNewsService.getAll()
        const related = all.filter((a) => a.id !== data.id && a.category === data.category)
        setRelatedNews(related.slice(0, 3))
      } catch {
        console.error('Erreur lors du chargement de l\'article')
      } finally {
        setLoading(false)
      }
    }
    fetchNews()
  }, [id, i18n.language])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    )
  }

  if (!article) {
    return (
      <div className="container-custom py-20 text-center">
        <p className="text-gray-500 text-lg">{t('news.notFound')}</p>
        <Link to="/news" className="text-primary font-medium mt-4 inline-block">&larr; {t('news.backToNews')}</Link>
      </div>
    )
  }

  const articleDate = new Date(article.date + 'T00:00:00')

  return (
    <>
      {/* Hero with cover */}
      <section className="relative py-20 md:py-28 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={article.image ?? ''}
            alt={article.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-linear-to-r from-black/75 via-black/50 to-black/25" />
        </div>
        <div className="relative container-custom text-white">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Link to="/news" className="inline-flex items-center gap-1.5 text-gray-200 hover:text-primary-light transition-colors mb-4 text-body">
              <ArrowLeft size={16} />
              {t('news.backToNews')}
            </Link>
            <span className={`inline-block px-3 py-1 rounded-full text-[11px] font-semibold tracking-wide mb-4 ${categoryColors[article.category] ?? 'bg-primary/10 text-primary'}`}>
              {article.category}
            </span>
            <h1 className="text-3xl md:text-section font-bold mb-4">{article.title}</h1>
            <div className="flex flex-wrap items-center gap-4 text-gray-200 text-body">
              <span className="flex items-center gap-1.5">
                <Calendar size={16} />
                {articleDate.getDate()} {t('months.' + ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'][articleDate.getMonth()])} {articleDate.getFullYear()}
              </span>
              {article.author && (
                <span className="flex items-center gap-1.5">
                  <User size={16} />
                  {article.author}
                </span>
              )}
              <span className="flex items-center gap-1.5">
                <Eye size={16} />
                {article.views} {t('news.views')}
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="py-14">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto">
            {/* Excerpt */}
            {article.excerpt && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-lg text-gray-600 font-medium leading-relaxed mb-8 italic border-l-4 border-primary pl-4"
              >
                {article.excerpt}
              </motion.div>
            )}

            {/* Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="prose prose-lg max-w-none"
            >
              {article.content ? (
                <div className="text-gray-700 leading-relaxed" dangerouslySetInnerHTML={{ __html: article.content }} />
              ) : (
                <p className="text-gray-400 italic">{t('news.noContent')}</p>
              )}
            </motion.div>

            {/* Gallery */}
            {article.gallery && article.gallery.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="mt-12"
              >
                <h2 className="text-xl font-bold text-gray-900 mb-6">{t('news.galleryTitle')}</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {article.gallery.map((src, i) => (
                    <div key={i} className="aspect-video rounded-xl overflow-hidden">
                      <img src={src} alt={t('admin.labels.photoN', { n: i + 1 })} className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Related articles */}
            {relatedNews.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.25 }}
                className="mt-16"
              >
                <h2 className="text-xl font-bold text-gray-900 mb-6">{t('news.relatedTitle')}</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {relatedNews.map((related) => {
                    const d = new Date(related.date + 'T00:00:00')
                    return (
                      <Link key={related.id} to={`/news/${related.id}`} className="card group overflow-hidden">
                        <div className="relative aspect-4/3 overflow-hidden">
                          <img src={related.image ?? ''} alt={related.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                        </div>
                        <div className="p-4">
                          <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold tracking-wide mb-2 ${categoryColors[related.category] ?? 'bg-primary/10 text-primary'}`}>
                            {related.category}
                          </span>
                          <h3 className="text-sm font-semibold text-gray-900 leading-snug mb-2 line-clamp-2">{related.title}</h3>
                          <p className="text-gray-500 text-xs mb-3">{getExcerpt(related.content)}</p>
                          <span className="text-primary text-small font-medium inline-flex items-center gap-1 group-hover:gap-2 transition-all">
                            {t('events.details')} <ArrowRight size={14} />
                          </span>
                        </div>
                      </Link>
                    )
                  })}
                </div>
              </motion.div>
            )}

            {/* Back link */}
            <div className="mt-12 text-center">
              <Link
                to="/news"
                className="inline-flex items-center gap-2 text-primary font-semibold hover:gap-3 transition-all"
              >
                <ArrowLeft size={16} />
                {t('news.backToAll')}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Breadcrumb */}
      <section className="pb-10">
        <div className="container-custom">
          <div className="flex items-center gap-2 text-gray-500 text-small">
            <Link to="/" className="hover:text-primary transition-colors">{t('news.breadcrumb.home')}</Link>
            <ChevronRight size={14} />
            <Link to="/news" className="hover:text-primary transition-colors">{t('news.breadcrumb.current')}</Link>
            <ChevronRight size={14} />
            <span className="text-gray-800">{article.title}</span>
          </div>
        </div>
      </section>
    </>
  )
}

export default NewsDetail
