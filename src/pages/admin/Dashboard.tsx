import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import {
  FolderOpen, Calendar, Newspaper, Users, Handshake, Loader2
} from 'lucide-react'
import { SimpleLineChart, SimpleDonutChart } from '../../components/admin/Charts'
import { adminService } from '../../services/admin'
import type { DashboardStats } from '../../services/admin'

const Dashboard = () => {
  const { t, i18n } = useTranslation()
  const [data, setData] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    adminService.getDashboardStats()
      .then(setData)
      .catch(() => setError('Erreur lors du chargement des statistiques'))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 size={32} className="animate-spin text-primary" />
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-3">
        <p className="text-gray-500">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="btn-primary px-4 py-2 rounded-lg"
        >
          Réessayer
        </button>
      </div>
    )
  }

  const { stats, recentEvents, recentNews, recentProjects, monthlyStats, contentDistribution } = data

  const statCards = [
    { label: t('admin.dashboard.stats.projects'), value: stats.totalProjects, icon: FolderOpen, color: 'bg-emerald-500' },
    { label: t('admin.dashboard.stats.events'), value: stats.totalEvents, icon: Calendar, color: 'bg-red' },
    { label: t('admin.dashboard.stats.articles'), value: stats.totalNews, icon: Newspaper, color: 'bg-blue-500' },
    { label: t('admin.dashboard.stats.users'), value: stats.totalUsers, icon: Users, color: 'bg-purple-500' },
    { label: t('admin.dashboard.stats.partners'), value: stats.totalPartners, icon: Handshake, color: 'bg-orange-500' },
  ]

  const now = new Date()
  const currentYear = now.getFullYear()
  const currentMonth = now.getMonth()
  const today = now.getDate()
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate()
  const firstDayOfWeek = (new Date(currentYear, currentMonth, 1).getDay() + 6) % 7
  const monthName = now.toLocaleDateString(
    i18n.language === 'fr' ? 'fr-FR' : 'en-US',
    { month: 'long', year: 'numeric' }
  )
  const calendarDays = Array.from({ length: daysInMonth }, (_, i) => i + 1)
  const leadingBlanks = Array.from({ length: firstDayOfWeek }, (_, i) => null)

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
        {statCards.map((stat, index) => {
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
            {recentEvents.map((item) => (
              <li key={item.id} className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
                  <Calendar size={16} />
                </div>
                <div className="min-w-0">
                  <p className="text-gray-800 text-small font-medium truncate">{item.title}</p>
                  <p className="text-gray-400 text-xs">{item.date ?? 'Date non définie'}</p>
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
            {recentNews.map((item) => (
              <li key={item.id} className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center text-blue-500 shrink-0">
                  <Newspaper size={16} />
                </div>
                <div className="min-w-0">
                  <p className="text-gray-800 text-small font-medium truncate">{item.title}</p>
                  <p className="text-gray-400 text-xs">{item.date ?? 'Date non définie'}</p>
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
            <h3 className="font-semibold text-gray-900 text-body">{monthName}</h3>
          </div>
          <div className="grid grid-cols-7 gap-1 text-center">
            {weekDays.map((d) => (
              <span key={d} className="text-gray-400 text-[10px] font-medium py-1">{d}</span>
            ))}
            {leadingBlanks.map((_, i) => (
              <span key={`b-${i}`} />
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
          <SimpleLineChart data={monthlyStats} />
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
