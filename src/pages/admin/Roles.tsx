import { type ElementType } from 'react'
import { motion } from 'framer-motion'
import {
  Plus, Edit, Trash2, Check, X, LayoutDashboard, Calendar, Newspaper,
  FolderOpen, Users, Settings
} from 'lucide-react'
import { roles, permissionModules } from '../../data/adminRolesData'

const iconMap: Record<string, ElementType> = {
  LayoutDashboard, Calendar, Newspaper, FolderOpen, Users, Settings
}

const Roles = () => {
  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Rôles & Permissions</h1>
          <p className="text-gray-500 text-small mt-1">Tableau de bord &gt; Rôles & Permissions</p>
        </div>
        <button className="inline-flex items-center gap-2 bg-primary text-white px-4 py-2.5 rounded-lg font-medium text-small hover:bg-primary-dark transition-colors">
          <Plus size={18} />
          Ajouter un rôle
        </button>
      </div>

      {/* Matrice des permissions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 mb-6"
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                <th className="text-left pb-4 text-gray-600 text-xs font-semibold tracking-wider">Rôle</th>
                <th colSpan={permissionModules.length} className="pb-4 text-center text-gray-600 text-xs font-semibold tracking-wider">
                  Permissions
                </th>
                <th className="text-right pb-4 text-gray-600 text-xs font-semibold tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {roles.map((role, i) => (
                <tr key={role.id} className={i !== roles.length - 1 ? 'border-b border-gray-100' : ''}>
                  <td className="py-4 pr-4 text-gray-800 text-small font-semibold whitespace-nowrap">{role.name}</td>
                  {permissionModules.map((mod) => {
                    const allowed = role.permissions[mod.key]
                    return (
                      <td key={mod.key} className="py-4 text-center">
                        <span
                          className={`inline-flex w-7 h-7 rounded-md items-center justify-center ${
                            allowed ? 'bg-primary text-white' : 'bg-gray-100 text-gray-300'
                          }`}
                          title={mod.label}
                        >
                          {allowed ? <Check size={15} /> : <X size={15} />}
                        </span>
                      </td>
                    )
                  })}
                  <td className="py-4 pl-4 text-right whitespace-nowrap">
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
              ))}
            </tbody>
          </table>
        </div>

        {/* Légende */}
        <div className="flex items-center gap-6 mt-5 pt-5 border-t border-gray-100 text-small text-gray-600">
          <span className="text-gray-500 font-medium">Légende :</span>
          <span className="flex items-center gap-2">
            <span className="w-5 h-5 rounded-md bg-primary text-white flex items-center justify-center">
              <Check size={12} />
            </span>
            Autorisé
          </span>
          <span className="flex items-center gap-2">
            <span className="w-5 h-5 rounded-md bg-gray-100 text-gray-300 flex items-center justify-center">
              <X size={12} />
            </span>
            Non autorisé
          </span>
        </div>
      </motion.div>

      {/* Liste des modules */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-xl shadow-sm border border-gray-100 p-5"
      >
        <h3 className="font-semibold text-gray-900 text-body mb-4">Modules disponibles</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {permissionModules.map((mod) => {
            const Icon = iconMap[mod.icon] || LayoutDashboard
            return (
              <div key={mod.key} className="flex items-center gap-2.5 text-gray-600 text-small">
                <span className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <Icon size={16} />
                </span>
                {mod.label}
              </div>
            )
          })}
        </div>
      </motion.div>
    </div>
  )
}

export default Roles