import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Calendar, User, Eye, ArrowLeft, Edit, Trash2,
} from 'lucide-react'
import { newsService } from '../../services/news'
import type { AdminNews } from '../../services/news'

const categoryColors: Record<string, string> = {
  'Environnement': 'bg-emerald-100 text-emerald-700',
  'Éducation': 'bg-blue-100 text-blue-700',
  'Eau & Assainissement': 'bg-cyan-100 text-cyan-700',
  'Gestion des catastrophes': 'bg-orange-100 text-orange-700',
  'Développement rural': 'bg-green-100 text-green-700',
  'Gouvernance locale': 'bg-purple-100 text-purple-700',
}

const monthNames = [
  'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
  'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre',
]

const NewsDetail = () => {
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
        console.error('Erreur lors du chargement de l\'article')
        navigate('/admin/news')
      } finally {
        setLoading(false)
      }
    }
    fetchNews()
  }, [id, navigate])

  const handleDelete = async () => {
    if (!confirm('Confirmer la suppression de cet article ?')) return
    try {
      await newsService.delete(Number(id))
      navigate('/admin/news')
    } catch {
      console.error('Erreur lors de la suppression')
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
      <div className="text-center py-20 text-gray-500">Article introuvable.</div>
    )
  }

  const articleDate = new Date(article.date + 'T00:00:00')

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <Link to="/admin/news" className="inline-flex items-center gap-1.5 text-gray-500 hover:text-primary transition-colors text-small mb-2">
            <ArrowLeft size={16} />
            Retour aux actualités
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">{article.title}</h1>
          <p className="text-gray-500 text-small mt-1">Tableau de bord &gt; Actualités &gt; Détails</p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            to={`/admin/news/${article.id}/edit`}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-white font-medium text-small hover:bg-primary-dark transition-colors"
          >
            <Edit size={16} />
            Modifier
          </Link>
          <button
            onClick={handleDelete}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-red text-red font-medium text-small hover:bg-red/10 transition-colors"
          >
            <Trash2 size={16} />
            Supprimer
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
                  <h2 className="text-lg font-semibold text-gray-900 mb-2">Extrait</h2>
                  <p className="text-gray-600 leading-relaxed italic border-l-4 border-primary pl-4">{article.excerpt}</p>
                </div>
              )}

              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-2">Contenu</h2>
                {article.content ? (
                  <div className="text-gray-600 leading-relaxed" dangerouslySetInnerHTML={{ __html: article.content }} />
                ) : (
                  <p className="text-gray-400 italic">Aucun contenu.</p>
                )}
              </div>

              {article.gallery && article.gallery.length > 0 && (
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-3">Galerie photos</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {article.gallery.map((src, i) => (
                      <div key={i} className="aspect-video rounded-lg overflow-hidden">
                        <img src={src} alt={`Photo ${i + 1}`} className="w-full h-full object-cover" />
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
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Catégorie</label>
                  <div className="mt-1">
                    <span className={`inline-block px-2.5 py-1 rounded-full text-[11px] font-semibold ${categoryColors[article.category] ?? 'bg-primary/10 text-primary'}`}>
                      {article.category}
                    </span>
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Date</label>
                  <p className="flex items-center gap-1.5 text-gray-800 text-small mt-1">
                    <Calendar size={14} className="text-primary" />
                    {articleDate.getDate()} {monthNames[articleDate.getMonth()]} {articleDate.getFullYear()}
                  </p>
                </div>
                {article.author && (
                  <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Auteur</label>
                    <p className="flex items-center gap-1.5 text-gray-800 text-small mt-1">
                      <User size={14} className="text-primary" />
                      {article.author}
                    </p>
                  </div>
                )}
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Vues</label>
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
