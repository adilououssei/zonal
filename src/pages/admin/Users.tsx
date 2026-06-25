import { useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, Edit, Trash2, Search, ChevronsLeft, ChevronRight } from 'lucide-react'
import { adminUsers, userStatusColorMap } from '../../data/adminUsersData'

const avatarColors = ['bg-purple-50 text-purple-500', 'bg-blue-50 text-blue-500', 'bg-emerald-50 text-emerald-600', 'bg-orange-50 text-orange-500']

const Users = () => {
  const [searchQuery, setSearchQuery] = useState('')

  const filteredUsers = adminUsers.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Utilisateurs</h1>
          <p className="text-gray-500 text-small mt-1">Tableau de bord &gt; Utilisateurs</p>
        </div>
        <button className="inline-flex items-center gap-2 bg-primary text-white px-4 py-2.5 rounded-lg font-medium text-small hover:bg-primary-dark transition-colors">
          <Plus size={18} />
          Ajouter un utilisateur
        </button>
      </div>

      {/* Recherche */}
      <div className="relative mb-5 max-w-md">
        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Rechercher un utilisateur..."
          className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 text-small focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
        />
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
                <th className="text-left px-5 py-3.5 text-gray-600 text-xs font-semibold tracking-wider">Nom</th>
                <th className="text-left px-5 py-3.5 text-gray-600 text-xs font-semibold tracking-wider">Email</th>
                <th className="text-left px-5 py-3.5 text-gray-600 text-xs font-semibold tracking-wider">Téléphone</th>
                <th className="text-left px-5 py-3.5 text-gray-600 text-xs font-semibold tracking-wider">Rôle</th>
                <th className="text-left px-5 py-3.5 text-gray-600 text-xs font-semibold tracking-wider">Statut</th>
                <th className="text-left px-5 py-3.5 text-gray-600 text-xs font-semibold tracking-wider">Dernière connexion</th>
                <th className="text-right px-5 py-3.5 text-gray-600 text-xs font-semibold tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user, i) => (
                  <tr key={user.id} className={`border-b border-gray-50 ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'}`}>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-full flex items-center justify-center font-semibold text-small shrink-0 ${avatarColors[i % avatarColors.length]}`}>
                          {user.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                        </div>
                        <span className="text-gray-800 text-small font-medium whitespace-nowrap">{user.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-gray-600 text-small whitespace-nowrap">{user.email}</td>
                    <td className="px-5 py-4 text-gray-600 text-small whitespace-nowrap">{user.phone}</td>
                    <td className="px-5 py-4 text-gray-600 text-small whitespace-nowrap">{user.role}</td>
                    <td className="px-5 py-4">
                      <span className={`inline-block px-2.5 py-1 rounded-full text-[11px] font-semibold ${userStatusColorMap[user.status]}`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-gray-500 text-small whitespace-nowrap">{user.lastLogin}</td>
                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-primary hover:bg-primary/10 transition-colors"
                          title="Modifier"
                        >
                          <Edit size={15} />
                        </button>
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
                  <td colSpan={7} className="px-5 py-10 text-center text-gray-400 text-small">
                    Aucun utilisateur ne correspond à votre recherche.
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

export default Users