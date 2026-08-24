import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import {
  MapPin, ArrowLeft, ChevronRight, Calendar,
} from 'lucide-react'
import { publicProjectsService } from '../services/projects'
import type { PublicProject } from '../services/projects'

// Page de détail d'un projet, chargée via son id dans l'URL (/projects/:id).

const statusLabelMap: Record<string, string> = {
  ongoing: 'admin.status.ongoing',
  completed: 'admin.status.completed',
  planned: 'admin.status.planned',
}

const statusColorMap: Record<string, string> = {
  ongoing: 'bg-emerald-100 text-emerald-700',
  completed: 'bg-gray-100 text-gray-500',
  planned: 'bg-blue-100 text-blue-700',
}

const formatPeriod = (start: string | null, end: string | null, locale: string): string => {
  const fullOpts: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric' }
  const monthDayOpts: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long' }
  if (start && end) {
    const s = new Date(start)
    const e = new Date(end)
    if (s.getFullYear() === e.getFullYear()) {
      return `${s.toLocaleDateString(locale, monthDayOpts)} - ${e.toLocaleDateString(locale, fullOpts)}`
    }
    return `${s.toLocaleDateString(locale, fullOpts)} - ${e.toLocaleDateString(locale, fullOpts)}`
  }
  if (start) return new Date(start).toLocaleDateString(locale, fullOpts)
  if (end) return new Date(end).toLocaleDateString(locale, fullOpts)
  return ''
}

const ProjectDetail = () => {
  const { t, i18n } = useTranslation()
  const { id } = useParams()
  const [project, setProject] = useState<PublicProject | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) return
    const fetchProject = async () => {
      try {
        const data = await publicProjectsService.getById(Number(id))
        setProject(data)
      } catch {
        console.error('Erreur lors du chargement du projet')
      } finally {
        setLoading(false)
      }
    }
    fetchProject()
  }, [id, i18n.language])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    )
  }

  if (!project) {
    return (
      <div className="container-custom py-20 text-center">
        <p className="text-gray-500 text-lg">{t('projects.notFound')}</p>
        <Link to="/projects" className="text-primary font-medium mt-4 inline-block">&larr; {t('projects.backToProjects')}</Link>
      </div>
    )
  }

  return (
    <>
      {/* Hero */}
      <section className="relative py-20 md:py-28 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={project.image ?? 'https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=1920&h=600&fit=crop'}
            alt={project.title}
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
            <Link to="/projects" className="inline-flex items-center gap-1.5 text-gray-200 hover:text-primary-light transition-colors mb-4 text-body">
              <ArrowLeft size={16} />
              {t('projects.backToProjects')}
            </Link>
            <span className={`inline-block px-3 py-1 rounded-full text-[11px] font-semibold tracking-wide mb-4 ${statusColorMap[project.status] ?? 'bg-gray-100 text-gray-500'}`}>
              {t(statusLabelMap[project.status] ?? project.status)}
            </span>
            <h1 className="text-3xl md:text-section font-bold mb-4">{project.title}</h1>
            <div className="flex flex-wrap items-center gap-4 text-gray-200 text-body">
              <span className="flex items-center gap-1.5">
                <MapPin size={16} />
                {project.location}
              </span>
              {project.startDate && (
                <span className="flex items-center gap-1.5">
                  <Calendar size={16} />
                  {formatPeriod(project.startDate, project.endDate, i18n.language === 'en' ? 'en-US' : 'fr-FR')}
                </span>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="py-14">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="prose prose-lg max-w-none"
            >
              {project.description ? (
                <div className="text-gray-700 leading-relaxed whitespace-pre-line">{project.description}</div>
              ) : (
                <p className="text-gray-400 italic">{t('projects.noDescription')}</p>
              )}
            </motion.div>

            {/* Back link */}
            <div className="mt-12 text-center">
              <Link
                to="/projects"
                className="inline-flex items-center gap-2 text-primary font-semibold hover:gap-3 transition-all"
              >
                <ArrowLeft size={16} />
                {t('projects.backToAll')}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Breadcrumb */}
      <section className="pb-10">
        <div className="container-custom">
          <div className="flex items-center gap-2 text-gray-500 text-small">
            <Link to="/" className="hover:text-primary transition-colors">{t('projects.breadcrumb.home')}</Link>
            <ChevronRight size={14} />
            <Link to="/projects" className="hover:text-primary transition-colors">{t('projects.breadcrumb.current')}</Link>
            <ChevronRight size={14} />
            <span className="text-gray-800">{project.title}</span>
          </div>
        </div>
      </section>
    </>
  )
}

export default ProjectDetail
