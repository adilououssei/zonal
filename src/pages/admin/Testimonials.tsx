import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Plus, Edit, Trash2, Star, Search, ChevronDown, ChevronsLeft, ChevronRight } from 'lucide-react'
import { adminTestimonials, testimonialStatusColorMap } from '../../data/adminTestimonialsData'

const Testimonials = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('Tous')

  const filtered = adminTestimonials.filter((item) => {
    const matchesSearch = item.author.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === 'Tous' || item.status === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Témoignages</h1>
          <p className="text-gray-500 text-small mt-1">Tableau de bord &gt; Témoignages</p>
        </div>
        <Link
          to="/admin/testimonials/new"
          className="inline-flex items-center gap-2 bg-primary text-white px-4 py-2.5 rounded-lg font-medium text-small hover:bg-primary-dark transition-colors"
        >
          <Plus size={18} />
          Ajouter un témoignage
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Rechercher un témoignage..."
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 text-small focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
          />
        </div>
        <div className="relative">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="appearance-none pl-4 pr-9 py-2.5 rounded-lg border border-gray-200 text-small text-gray-600 focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer"
          >
            <option value="Tous">Statut: Tous</option>
            <option value="published">Publié</option>
            <option value="draft">Brouillon</option>
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
                <th className="text-left px-5 py-3.5 text-gray-600 text-xs font-semibold tracking-wider">Auteur</th>
                <th className="text-left px-5 py-3.5 text-gray-600 text-xs font-semibold tracking-wider">Fonction</th>
                <th className="text-left px-5 py-3.5 text-gray-600 text-xs font-semibold tracking-wider">Note</th>
                <th className="text-left px-5 py-3.5 text-gray-600 text-xs font-semibold tracking-wider">Date</th>
                <th className="text-left px-5 py-3.5 text-gray-600 text-xs font-semibold tracking-wider">Statut</th>
                <th className="text-right px-5 py-3.5 text-gray-600 text-xs font-semibold tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length > 0 ? (
                filtered.map((item, i) => (
                  <tr key={item.id} className={`border-b border-gray-50 ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'}`}>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-small shrink-0">
                          {item.author[0]}
                        </div>
                        <div>
                          <span className="text-gray-800 text-small font-medium">{item.author}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-gray-600 text-small">{item.role}</td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-0.5">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star key={i} size={13} className={i < item.rating ? 'text-amber-400 fill-amber-400' : 'text-gray-200'} />
                        ))}
                      </div>
                    </td>
                    <td className="px-5 py-4 text-gray-600 text-small">{item.date}</td>
                    <td className="px-5 py-4">
                      <span className={`inline-block px-2.5 py-1 rounded-full text-[11px] font-semibold ${testimonialStatusColorMap[item.status]}`}>
                        {item.status === 'published' ? 'Publié' : 'Brouillon'}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Link
                          to={`/admin/testimonials/${item.id}/edit`}
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
                    Aucun témoignage trouvé.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-center gap-2 px-5 py-4 border-t border-gray-100">
          <button className="w-9 h-9 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 transition-colors" aria-label="Précédent">
            <ChevronsLeft size={16} />
          </button>
          {[1].map((page) => (
            <button
              key={page}
              className="w-9 h-9 flex items-center justify-center rounded-lg text-small font-medium bg-primary text-white"
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

export default Testimonials
