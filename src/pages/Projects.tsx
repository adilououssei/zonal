import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { MapPin, ArrowUpRight } from 'lucide-react'
import { publicProjectsService } from '../services/projects'
import type { PublicProject } from '../services/projects'

// Page "Projets" : liste filtrable par statut (tous / en cours / terminé / planifié).

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

const filters = ['Tous', 'ongoing', 'completed', 'planned'] as const
type Filter = (typeof filters)[number]

// Formate une période de dates dans la langue courante ; si début et fin sont
// la même année, n'affiche l'année qu'une seule fois (ex: "3 mars - 12 juin 2026")
const formatPeriod = (start: string | null, end: string | null, i18n: { language: string }): string => {
  const locale = i18n.language === 'en' ? 'en-US' : 'fr-FR'
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

const Projects = () => {
  const { t, i18n } = useTranslation()
  const [projects, setProjects] = useState<PublicProject[]>([])
  const [loading, setLoading] = useState(true)
  const [activeFilter, setActiveFilter] = useState<Filter>('Tous')

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await publicProjectsService.getAll()
        setProjects(data)
      } catch {
        console.error('Erreur lors du chargement des projets')
      } finally {
        setLoading(false)
      }
    }
    fetchProjects()
  }, [i18n.language])

  const visibleProjects = activeFilter === 'Tous'
    ? projects
    : projects.filter((p) => p.status === activeFilter)

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {t('projects.hero.title')}
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            {t('projects.hero.subtitle')}
          </p>
        </motion.div>

        {/* Filtres */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-10">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-medium text-sm border transition-all duration-300 ${
                activeFilter === f
                  ? 'bg-primary text-white border-primary shadow-md'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-primary hover:text-primary'
              }`}
            >
              {f === 'Tous' ? t('projects.filter.all') : t(statusLabelMap[f])}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
          </div>
        ) : visibleProjects.length === 0 ? (
          <p className="text-center text-gray-400 py-10">{t('projects.empty')}</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {visibleProjects.map((project, i) => (
              <motion.article
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.075, duration: 0.45 }}
                className="group bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300"
              >
                <div className="relative h-48 bg-gray-200 overflow-hidden">
                  {project.image ? (
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <MapPin size={32} />
                    </div>
                  )}
                  <span className={`absolute top-3 left-3 px-2.5 py-1 rounded-full text-[11px] font-semibold ${statusColorMap[project.status] ?? 'bg-gray-100 text-gray-500'}`}>
                    {t(statusLabelMap[project.status] ?? project.status)}
                  </span>
                </div>

                <div className="p-5">
                  <div className="flex items-center gap-4 text-gray-500 text-xs mb-3">
                    <span className="flex items-center gap-1">
                      <MapPin size={13} />
                      {project.location}
                    </span>
                    {project.startDate && (
                      <span>{formatPeriod(project.startDate, project.endDate, i18n)}</span>
                    )}
                  </div>

                  <h3 className="font-bold text-gray-900 text-lg mb-2 group-hover:text-primary transition-colors">
                    {project.title}
                  </h3>

                  <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-2">
                    {project.description}
                  </p>

                  <Link to={`/projects/${project.id}`} className="inline-flex items-center gap-1.5 text-primary font-medium text-sm hover:gap-2.5 transition-all">
                    {t('programs.domains.learnMore')}
                    <ArrowUpRight size={15} />
                  </Link>
                </div>
              </motion.article>
            ))}
          </div>
        )}


      </div>
    </section>
  )
}

export default Projects
