import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import {
  FolderOpen, Calendar, Newspaper, Users, Handshake, ChevronLeft, ChevronRight
} from 'lucide-react'
import { SimpleLineChart, SimpleDonutChart } from '../../components/admin/Charts'

const Dashboard = () => {
  const { t } = useTranslation()

  const stats = [
    { label: t('admin.dashboard.stats.projects'), value: 24, icon: FolderOpen, color: 'bg-emerald-500' },
    { label: t('admin.dashboard.stats.events'), value: 18, icon: Calendar, color: 'bg-red' },
    { label: t('admin.dashboard.stats.articles'), value: 32, icon: Newspaper, color: 'bg-blue-500' },
    { label: t('admin.dashboard.stats.users'), value: 56, icon: Users, color: 'bg-purple-500' },
    { label: t('admin.dashboard.stats.partners'), value: 12, icon: Handshake, color: 'bg-orange-500' },
  ]

  const recentEvents = [
    { title: "Journée mondiale de l'environnement", date: '05 Juin 2024' },
    { title: 'Atelier sur la gouvernance locale', date: '12 Juin 2024' },
    { title: 'Campagne de reboisement', date: '20 Juin 2024' },
  ]

  const recentArticles = [
    { title: 'Agir ensemble pour la planète', date: '02 Juin 2024' },
    { title: 'Le changement commence localement', date: '28 Mai 2024' },
    { title: 'Nos actions en 2024', date: '20 Mai 2024' },
  ]

  const publicationsPerMonth = [
    { label: 'Jan', value: 4 },
    { label: 'Fév', value: 7 },
    { label: 'Mar', value: 5 },
    { label: 'Avr', value: 9 },
    { label: 'Mai', value: 6 },
    { label: 'Juin', value: 12 },
  ]

  const contentDistribution = [
    { label: t('admin.dashboard.stats.projects'), value: 24, color: '#1a6b3c' },
    { label: t('admin.dashboard.stats.events'), value: 18, color: '#dc2626' },
    { label: t('admin.dashboard.stats.articles'), value: 32, color: '#3b82f6' },
    { label: t('admin.dashboard.stats.partners'), value: 14, color: '#f59e0b' },
  ]

  const calendarDays = Array.from({ length: 30 }, (_, i) => i + 1)
  const today = 19

  const weekDays = t('admin.dashboard.calendarDays', { returnObjects: true }) as string[]

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t('admin.dashboard.title')}</h1>
          <p className="text-gray-500 text-small mt-1">{t('admin.dashboard.welcome')}</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.06 }}
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-5"
            >
              <div className={`w-11 h-11 rounded-lg ${stat.color} flex items-center justify-center text-white mb-3`}>
                <Icon size={20} />
              </div>
              <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
              <p className="text-gray-500 text-small">{stat.label}</p>
            </motion.div>
          )
        })}
      </div>

      {/* Activity overview */}
      <h2 className="font-semibold text-gray-900 mb-4">{t('admin.dashboard.activityOverview')}</h2>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Recent events */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-white rounded-xl shadow-sm border border-gray-100 p-5"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900 text-body">{t('admin.dashboard.recentEvents')}</h3>
            <Link to="/admin/events" className="text-primary text-small font-medium hover:text-primary-dark transition-colors">
              {t('admin.dashboard.viewAll')}
            </Link>
          </div>
          <ul className="space-y-3">
            {recentEvents.map((item, i) => (
              <li key={i} className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
                  <Calendar size={16} />
                </div>
                <div className="min-w-0">
                  <p className="text-gray-800 text-small font-medium truncate">{item.title}</p>
                  <p className="text-gray-400 text-xs">{item.date}</p>
                </div>
              </li>
            ))}
          </ul>
        </motion.div>

        {/* Recent articles */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.08 }}
          className="bg-white rounded-xl shadow-sm border border-gray-100 p-5"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900 text-body">{t('admin.dashboard.recentArticles')}</h3>
            <Link to="/admin/news" className="text-primary text-small font-medium hover:text-primary-dark transition-colors">
              {t('admin.dashboard.viewAll')}
            </Link>
          </div>
          <ul className="space-y-3">
            {recentArticles.map((item, i) => (
              <li key={i} className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center text-blue-500 shrink-0">
                  <Newspaper size={16} />
                </div>
                <div className="min-w-0">
                  <p className="text-gray-800 text-small font-medium truncate">{item.title}</p>
                  <p className="text-gray-400 text-xs">{item.date}</p>
                </div>
              </li>
            ))}
          </ul>
        </motion.div>

        {/* Mini calendar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.16 }}
          className="bg-white rounded-xl shadow-sm border border-gray-100 p-5"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900 text-body">{t('admin.dashboard.calendarTitle')}</h3>
            <div className="flex items-center gap-1">
              <button className="w-6 h-6 flex items-center justify-center rounded text-gray-400 hover:bg-gray-100">
                <ChevronLeft size={14} />
              </button>
              <button className="w-6 h-6 flex items-center justify-center rounded text-gray-400 hover:bg-gray-100">
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
          <div className="grid grid-cols-7 gap-1 text-center">
            {weekDays.map((d) => (
              <span key={d} className="text-gray-400 text-[10px] font-medium py-1">{d}</span>
            ))}
            {calendarDays.map((day) => (
              <span
                key={day}
                className={`text-xs py-1.5 rounded-full ${
                  day === today
                    ? 'bg-primary text-white font-semibold'
                    : 'text-gray-600 hover:bg-gray-100 cursor-pointer'
                }`}
              >
                {day}
              </span>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Statistics */}
      <h2 className="font-semibold text-gray-900 mb-4">{t('admin.dashboard.statsTitle')}</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-white rounded-xl shadow-sm border border-gray-100 p-5"
        >
          <h3 className="font-semibold text-gray-900 text-body mb-4">{t('admin.dashboard.publicationsPerMonth')}</h3>
          <SimpleLineChart data={publicationsPerMonth} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.08 }}
          className="bg-white rounded-xl shadow-sm border border-gray-100 p-5"
        >
          <h3 className="font-semibold text-gray-900 text-body mb-4">{t('admin.dashboard.contentDistribution')}</h3>
          <div className="flex items-center justify-center h-full">
            <SimpleDonutChart data={contentDistribution} />
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default Dashboard
