import { useState, useEffect, type ElementType, type FormEvent } from 'react'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import {
  Plus, Edit, Trash2, Check, X, LayoutDashboard, Calendar, Newspaper,
  FolderOpen, Users, Settings, Image as ImageIcon, Handshake,
  MessageSquare, FileText, Shield
} from 'lucide-react'
import { adminService, type Role, type PermissionModule } from '../../services/admin'

const iconMap: Record<string, ElementType> = {
  LayoutDashboard, Calendar, Newspaper, FolderOpen, ImageIcon,
  Handshake, MessageSquare, FileText, Users, Shield, Settings,
}

const Roles = () => {
  const { t, i18n } = useTranslation()
  const [roles, setRoles] = useState<Role[]>([])
  const [modules, setModules] = useState<PermissionModule[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [modalOpen, setModalOpen] = useState(false)
  const [editingRole, setEditingRole] = useState<Role | null>(null)
  const [roleName, setRoleName] = useState('')
  const [rolePermissions, setRolePermissions] = useState<Record<string, boolean>>({})

  useEffect(() => {
    let cancelled = false
    Promise.all([
      adminService.getRoles(),
      adminService.getPermissionModules(),
    ]).then(([rolesData, modulesData]) => {
      if (!cancelled) { setRoles(rolesData); setModules(modulesData) }
    }).catch((err) => {
      if (!cancelled) setError(err instanceof Error ? err.message : t('admin.errors.generic'))
    }).finally(() => {
      if (!cancelled) setLoading(false)
    })
    return () => { cancelled = true }
  }, [i18n.language, t])

  const reloadData = async () => {
    try {
      setLoading(true)
      const [rolesData, modulesData] = await Promise.all([
        adminService.getRoles(),
        adminService.getPermissionModules(),
      ])
      setRoles(rolesData)
      setModules(modulesData)
    } catch (err) {
      setError(err instanceof Error ? err.message : t('admin.errors.generic'))
    } finally {
      setLoading(false)
    }
  }

  const openCreateModal = () => {
    setEditingRole(null)
    setRoleName('')
    const perms: Record<string, boolean> = {}
    modules.forEach((m) => { perms[m.key] = false })
    setRolePermissions(perms)
    setModalOpen(true)
  }

  const openEditModal = (role: Role) => {
    setEditingRole(role)
    setRoleName(role.name)
    const perms: Record<string, boolean> = {}
    modules.forEach((m) => { perms[m.key] = role.permissions[m.key] ?? false })
    setRolePermissions(perms)
    setModalOpen(true)
  }

  const togglePermission = (key: string) => {
    setRolePermissions((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!roleName.trim()) return
    try {
      if (editingRole) {
        await adminService.updateRole(editingRole.id, { name: roleName, permissions: rolePermissions })
      } else {
        await adminService.createRole({ name: roleName, permissions: rolePermissions })
      }
      setModalOpen(false)
      reloadData()
    } catch (err) {
      setError(err instanceof Error ? err.message : t('admin.errors.generic'))
    }
  }

  const handleDelete = async (role: Role) => {
    if (!confirm(t('admin.confirm.deleteRole', { name: role.name }))) return
    try {
      await adminService.deleteRole(role.id)
      reloadData()
    } catch (err) {
      setError(err instanceof Error ? err.message : t('admin.errors.generic'))
    }
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t('admin.sidebar.roles')}</h1>
          <p className="text-gray-500 text-small mt-1">{t('admin.sidebar.dashboard')} &gt; {t('admin.sidebar.roles')}</p>
        </div>
        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 bg-primary text-white px-4 py-2.5 rounded-lg font-medium text-small hover:bg-primary-dark transition-colors"
        >
          <Plus size={18} />
          {t('admin.actions.addRole')}
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red text-small rounded-lg">
          {error}
          <button onClick={() => setError('')} className="ml-2 font-bold">&times;</button>
        </div>
      )}

      {loading ? (
        <div className="p-8 text-center text-gray-400">{t('admin.loading')}</div>
      ) : (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 mb-6"
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                <th className="text-left pb-4 text-gray-600 text-xs font-semibold tracking-wider">{t('admin.table.role')}</th>
                <th colSpan={modules.length} className="pb-4 text-center text-gray-600 text-xs font-semibold tracking-wider">
                  {t('admin.table.permissions')}
                </th>
                <th className="text-right pb-4 text-gray-600 text-xs font-semibold tracking-wider">{t('admin.table.actions')}</th>
              </tr>
            </thead>
            <tbody>
              {roles.map((role, i) => (
                <tr key={role.id} className={i !== roles.length - 1 ? 'border-b border-gray-100' : ''}>
                  <td className="py-4 pr-4 text-gray-800 text-small font-semibold whitespace-nowrap">{role.name}</td>
                  {modules.map((mod) => {
                    const allowed = role.permissions[mod.key] ?? false
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
                        onClick={() => openEditModal(role)}
                        className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-primary hover:bg-primary/10 transition-colors"
                        title={t('admin.actions.edit')}
                      >
                        <Edit size={15} />
                      </button>
                      <button
                        onClick={() => handleDelete(role)}
                        className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-red hover:bg-red/10 transition-colors"
                        title={t('admin.actions.delete')}
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

        <div className="flex items-center gap-6 mt-5 pt-5 border-t border-gray-100 text-small text-gray-600">
          <span className="text-gray-500 font-medium">{t('admin.legend')}</span>
          <span className="flex items-center gap-2">
            <span className="w-5 h-5 rounded-md bg-primary text-white flex items-center justify-center">
              <Check size={12} />
            </span>
            {t('admin.permissions.allowed')}
          </span>
          <span className="flex items-center gap-2">
            <span className="w-5 h-5 rounded-md bg-gray-100 text-gray-300 flex items-center justify-center">
              <X size={12} />
            </span>
            {t('admin.permissions.denied')}
          </span>
        </div>
      </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-xl shadow-sm border border-gray-100 p-5"
      >
        <h3 className="font-semibold text-gray-900 text-body mb-4">{t('admin.form.availableModules')}</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {modules.map((mod) => {
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

      {modalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setModalOpen(false)}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-lg font-bold text-gray-900 mb-4">
              {editingRole ? t('admin.form.editRole') : t('admin.form.addRole')}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-small font-medium text-gray-700 mb-1">{t('admin.labels.roleName')}</label>
                <input
                  type="text" required
                  value={roleName}
                  onChange={(e) => setRoleName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-gray-200 text-small focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-small font-medium text-gray-700 mb-2">{t('admin.labels.permissions')}</label>
                <div className="grid grid-cols-2 gap-2">
                  {modules.map((mod) => {
                    const Icon = iconMap[mod.icon] || LayoutDashboard
                    const allowed = rolePermissions[mod.key] ?? false
                    return (
                      <button
                        key={mod.key}
                        type="button"
                        onClick={() => togglePermission(mod.key)}
                        className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg border text-small transition-all cursor-pointer ${
                          allowed
                            ? 'bg-primary/5 border-primary/30 text-primary'
                            : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
                        }`}
                      >
                        <Icon size={16} />
                        <span className="flex-1 text-left">{mod.label}</span>
                        {allowed ? <Check size={14} className="text-primary shrink-0" /> : <X size={14} className="text-gray-300 shrink-0" />}
                      </button>
                    )
                  })}
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="flex-1 px-4 py-2.5 rounded-lg border border-gray-200 text-gray-600 text-small font-medium hover:bg-gray-50 transition-colors"
                >
                  {t('admin.actions.cancel')}
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2.5 rounded-lg bg-primary text-white text-small font-medium hover:bg-primary-dark transition-colors"
                >
                  {editingRole ? t('admin.actions.save') : t('admin.actions.create')}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  )
}

export default Roles
