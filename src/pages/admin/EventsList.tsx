import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Calendar, MapPin, Plus, Edit, Trash2, Search, ChevronDown,
  ChevronsLeft, ChevronRight
} from 'lucide-react'
import { adminEvents, statusColorMap, type AdminEventStatus } from '../../data/adminEventsData'

const statusFilters: ('Tous' | AdminEventStatus)[] = ['Tous', 'À venir', 'En cours', 'Terminé']

const EventsList = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<'Tous' | AdminEventStatus>('Tous')

  const filteredEvents = adminEvents.filter((event) => {
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === 'Tous' || event.status === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Événements</h1>
          <p className="text-gray-500 text-small mt-1">Tableau de bord &gt; Événements</p>
        </div>
        <Link
          to="/admin/events/new"
          className="inline-flex items-center gap-2 bg-primary text-white px-4 py-2.5 rounded-lg font-medium text-small hover:bg-primary-dark transition-colors"
        >
          <Plus size={18} />
          Ajouter un événement
        </Link>
      </div>

      {/* Filtres */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Rechercher un événement..."
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 text-small focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
          />
        </div>
        <div className="relative">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as 'Tous' | AdminEventStatus)}
            className="appearance-none pl-4 pr-9 py-2.5 rounded-lg border border-gray-200 text-small text-gray-600 focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer"
          >
            {statusFilters.map((s) => (
              <option key={s} value={s}>{s === 'Tous' ? 'Statut: Tous' : s}</option>
            ))}
          </select>
          <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
        </div>
        <div className="relative">
          <select
            defaultValue="toutes"
            className="appearance-none pl-4 pr-9 py-2.5 rounded-lg border border-gray-200 text-small text-gray-600 focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer"
          >
            <option value="toutes">Date: Toutes</option>
            <option value="month">Ce mois-ci</option>
            <option value="week">Cette semaine</option>
          </select>
          <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
        </div>
      </div>

      {/* Tableau */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="text-left px-5 py-3.5 text-gray-600 text-xs font-semibold tracking-wider">Image</th>
                <th className="text-left px-5 py-3.5 text-gray-600 text-xs font-semibold tracking-wider">Titre</th>
                <th className="text-left px-5 py-3.5 text-gray-600 text-xs font-semibold tracking-wider">Date</th>
                <th className="text-left px-5 py-3.5 text-gray-600 text-xs font-semibold tracking-wider">Lieu</th>
                <th className="text-left px-5 py-3.5 text-gray-600 text-xs font-semibold tracking-wider">Statut</th>
                <th className="text-right px-5 py-3.5 text-gray-600 text-xs font-semibold tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredEvents.length > 0 ? (
                filteredEvents.map((event, i) => (
                  <tr key={event.id} className={`border-b border-gray-50 ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'}`}>
                    <td className="px-5 py-4">
                      <div className="w-14 h-14 rounded-lg overflow-hidden bg-gray-100">
                        <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2 text-gray-800 text-small font-medium max-w-xs">
                        <Calendar size={14} className="text-primary shrink-0" />
                        {event.title}
                      </div>
                    </td>
                    <td className="px-5 py-4 text-gray-600 text-small whitespace-nowrap">{event.date}</td>
                    <td className="px-5 py-4">
                      <span className="flex items-center gap-1.5 text-gray-600 text-small whitespace-nowrap">
                        <MapPin size={14} className="text-gray-400" />
                        {event.location}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`inline-block px-2.5 py-1 rounded-full text-[11px] font-semibold ${statusColorMap[event.status]}`}>
                        {event.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Link
                          to={`/admin/events/${event.id}/edit`}
                          className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-primary hover:bg-primary/10 transition-colors"
                          title="Modifier"
                        >
                          <Edit size={15} />
                        </Link>
                        <button
                          className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-red hover:bg-red/10 transition-colors"
                          title="Supprimer"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-5 py-10 text-center text-gray-400 text-small">
                    Aucun événement ne correspond à votre recherche.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-center gap-2 px-5 py-4 border-t border-gray-100">
          <button className="w-9 h-9 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 transition-colors" aria-label="Précédent">
            <ChevronsLeft size={16} />
          </button>
          {[1, 2, 3].map((page) => (
            <button
              key={page}
              className={`w-9 h-9 flex items-center justify-center rounded-lg text-small font-medium transition-colors ${
                page === 1 ? 'bg-primary text-white' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {page}
            </button>
          ))}
          <button className="flex items-center gap-1 px-3 h-9 rounded-lg text-gray-600 text-small font-medium hover:bg-gray-100 transition-colors">
            Suivant <ChevronRight size={14} />
          </button>
        </div>
      </motion.div>
    </div>
  )
}

export default EventsList