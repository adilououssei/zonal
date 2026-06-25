import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import { MapPin, ChevronRight, ChevronLeft, Clock, Coins } from 'lucide-react'
import { publicProjects, projectStatusLabels, projectStatusColors, type PublicProject } from '../data/projectsData'

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 }
}

const statusFilters: ('Tous' | PublicProject['status'])[] = ['Tous', 'ongoing', 'completed', 'planned']

const Projects = () => {
  const { t } = useTranslation()
  const [filter, setFilter] = useState<'Tous' | PublicProject['status']>('Tous')

  const filtered = filter === 'Tous'
    ? publicProjects
    : publicProjects.filter((p) => p.status === filter)

  return (
    <div>
      {/* Hero */}
      <div className="relative h-[45vh] min-h-[320px] overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=1600&h=600&fit=crop"
            alt=""
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-linear-to-r from-black/75 via-black/50 to-black/25" />
          <div className="absolute inset-0 container-custom flex items-center">
            <div className="relative text-white">
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-4xl md:text-section font-bold mb-4"
              >
                {t('projects.hero.title')}
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.15 }}
                className="text-subtitle text-gray-200 max-w-2xl mb-5"
              >
                {t('projects.hero.subtitle')}
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.25 }}
                className="flex items-center gap-2 text-gray-200 text-body"
              >
                <a href="/" className="hover:text-primary-light transition-colors">{t('projects.breadcrumb.home')}</a>
                <ChevronRight size={16} />
                <span className="text-primary-light">{t('projects.breadcrumb.current')}</span>
              </motion.div>
          </div>
        </div>
      </div>

      {/* Filtres */}
      <section className="py-10 bg-white border-b border-gray-100">
        <div className="container-custom">
          <div className="flex items-center justify-center gap-2 sm:gap-3 flex-wrap">
            {statusFilters.map((s) => (
              <button
                key={s}
                onClick={() => setFilter(s)}
                className={`px-5 py-2 rounded-full text-small font-medium transition-colors ${
                  filter === s
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {s === 'Tous' ? t('projects.filter.all') : projectStatusLabels[s]}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Liste des projets */}
      <section className="py-16">
        <div className="container-custom">
          <AnimatePresence mode="wait">
            <motion.div
              key={filter}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {filtered.map((project, index) => (
                <motion.div
                  key={project.id}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.1 }}
                  variants={fadeUp}
                  transition={{ duration: 0.5, delay: index * 0.08 }}
                  className="card overflow-hidden group flex flex-col"
                >
                  <div className="aspect-4/3 overflow-hidden">
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-6 flex flex-col flex-1">
                    <span className={`inline-block self-start px-3 py-1 rounded-full text-[11px] font-semibold mb-3 ${projectStatusColors[project.status]}`}>
                      {projectStatusLabels[project.status]}
                    </span>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{project.title}</h3>
                    <p className="text-gray-600 text-body leading-relaxed mb-4 flex-1">
                      {project.description}
                    </p>
                    <div className="space-y-2 pt-4 border-t border-gray-100">
                      <span className="flex items-center gap-2 text-gray-500 text-small">
                        <MapPin size={14} className="text-primary shrink-0" />
                        {project.location}
                      </span>
                      <span className="flex items-center gap-2 text-gray-500 text-small">
                        <Coins size={14} className="text-primary shrink-0" />
                        {project.budget}
                      </span>
                      <span className="flex items-center gap-2 text-gray-500 text-small">
                        <Clock size={14} className="text-primary shrink-0" />
                        {project.period}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>

          {filtered.length === 0 && (
            <div className="text-center py-20 text-gray-400">
              {t('projects.empty')}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

export default Projects
