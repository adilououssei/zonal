import { useState, useEffect, type FormEvent } from 'react'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { Plus, Edit, Trash2, Search, ChevronsLeft, ChevronRight } from 'lucide-react'
import { adminService, type AdminUser, type Role } from '../../services/admin'

const avatarColors = ['bg-purple-50 text-purple-500', 'bg-blue-50 text-blue-500', 'bg-emerald-50 text-emerald-600', 'bg-orange-50 text-orange-500']

const userStatusColorMap: Record<string, string> = {
  Actif: 'bg-emerald-100 text-emerald-700',
  Inactif: 'bg-gray-100 text-gray-500',
}

const Users = () => {
  const { t, i18n } = useTranslation()
  const [users, setUsers] = useState<AdminUser[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [roles, setRoles] = useState<Role[]>([])
  const [modalOpen, setModalOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null)
  const [formData, setFormData] = useState({ email: '', password: '', firstName: '', lastName: '', phone: '', roleId: '' })

  useEffect(() => {
    let cancelled = false
    Promise.all([
      adminService.getUsers(),
      adminService.getRoles(),
    ]).then(([usersData, rolesData]) => {
      if (!cancelled) { setUsers(usersData); setRoles(rolesData) }
    }).catch((err) => {
      if (!cancelled) setError(err instanceof Error ? err.message : t('admin.errors.generic'))
    }).finally(() => {
      if (!cancelled) setLoading(false)
    })
    return () => { cancelled = true }
  }, [i18n.language, t])

  const reloadUsers = async () => {
    try {
      setLoading(true)
      const data = await adminService.getUsers()
      setUsers(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : t('admin.errors.generic'))
    } finally {
      setLoading(false)
    }
  }

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const openCreateModal = () => {
    setEditingUser(null)
    setFormData({ email: '', password: '', firstName: '', lastName: '', phone: '', roleId: '' })
    setModalOpen(true)
  }

  const openEditModal = (user: AdminUser) => {
    setEditingUser(user)
    setFormData({
      email: user.email,
      password: '',
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      phone: user.phone || '',
      roleId: String(user.roleEntity?.id ?? ''),
    })
    setModalOpen(true)
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    try {
      const roleId = formData.roleId ? Number(formData.roleId) : undefined
      if (editingUser) {
        const payload: Record<string, unknown> = { email: formData.email, roleId }
        if (formData.firstName) payload.firstName = formData.firstName
        if (formData.lastName) payload.lastName = formData.lastName
        if (formData.phone) payload.phone = formData.phone
        if (formData.password) payload.password = formData.password
        await adminService.updateUser(editingUser.id, payload as Parameters<typeof adminService.updateUser>[1])
      } else {
        await adminService.createUser({ ...formData, password: formData.password, roleId } as Parameters<typeof adminService.createUser>[0])
      }
      setModalOpen(false)
      reloadUsers()
    } catch (err) {
      setError(err instanceof Error ? err.message : t('admin.errors.generic'))
    }
  }

  const handleDelete = async (user: AdminUser) => {
    if (!confirm(t('admin.confirm.deleteUser', { name: user.name }))) return
    try {
      await adminService.deleteUser(user.id)
      reloadUsers()
    } catch (err) {
      setError(err instanceof Error ? err.message : t('admin.errors.generic'))
    }
  }

  const handleToggleStatus = async (user: AdminUser) => {
    try {
      await adminService.toggleUserStatus(user.id)
      reloadUsers()
    } catch (err) {
      setError(err instanceof Error ? err.message : t('admin.errors.generic'))
    }
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t('admin.sidebar.users')}</h1>
          <p className="text-gray-500 text-small mt-1">{t('admin.sidebar.dashboard')} &gt; {t('admin.sidebar.users')}</p>
        </div>
        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 bg-primary text-white px-4 py-2.5 rounded-lg font-medium text-small hover:bg-primary-dark transition-colors"
        >
          <Plus size={18} />
          {t('admin.actions.addUser')}
        </button>
      </div>

      <div className="relative mb-5 max-w-md">
        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={t('admin.placeholders.searchUser')}
          className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 text-small focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
        />
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red text-small rounded-lg">
          {error}
          <button onClick={() => setError('')} className="ml-2 font-bold">&times;</button>
        </div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
      >
        {loading ? (
          <div className="p-8 text-center text-gray-400">{t('admin.loading')}</div>
        ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="text-left px-5 py-3.5 text-gray-600 text-xs font-semibold tracking-wider">{t('admin.table.name')}</th>
                <th className="text-left px-5 py-3.5 text-gray-600 text-xs font-semibold tracking-wider">{t('admin.table.email')}</th>
                <th className="text-left px-5 py-3.5 text-gray-600 text-xs font-semibold tracking-wider">{t('admin.table.phone')}</th>
                <th className="text-left px-5 py-3.5 text-gray-600 text-xs font-semibold tracking-wider">{t('admin.table.role')}</th>
                <th className="text-left px-5 py-3.5 text-gray-600 text-xs font-semibold tracking-wider">{t('admin.table.status')}</th>
                <th className="text-left px-5 py-3.5 text-gray-600 text-xs font-semibold tracking-wider">{t('admin.table.lastLogin')}</th>
                <th className="text-right px-5 py-3.5 text-gray-600 text-xs font-semibold tracking-wider">{t('admin.table.actions')}</th>
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
                    <td className="px-5 py-4 text-gray-600 text-small whitespace-nowrap">{user.phone || '-'}</td>
                    <td className="px-5 py-4 text-gray-600 text-small whitespace-nowrap">{user.role}</td>
                    <td className="px-5 py-4">
                      <button onClick={() => handleToggleStatus(user)} className="cursor-pointer">
                        <span className={`inline-block px-2.5 py-1 rounded-full text-[11px] font-semibold ${userStatusColorMap[user.status]}`}>
                          {user.status}
                        </span>
                      </button>
                    </td>
                    <td className="px-5 py-4 text-gray-500 text-small whitespace-nowrap">{user.lastLogin || '-'}</td>
                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => openEditModal(user)}
                          className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-primary hover:bg-primary/10 transition-colors"
                          title={t('admin.actions.edit')}
                        >
                          <Edit size={15} />
                        </button>
                        <button
                          onClick={() => handleDelete(user)}
                          className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-red hover:bg-red/10 transition-colors"
                          title={t('admin.actions.delete')}
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
                    {t('admin.empty.users')}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        )}

        <div className="flex items-center justify-center gap-2 px-5 py-4 border-t border-gray-100">
          <button className="w-9 h-9 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 transition-colors" aria-label={t('carousel.prev')}>
            <ChevronsLeft size={16} />
          </button>
          {[1].map((page) => (
            <button
              key={page}
              className={`w-9 h-9 flex items-center justify-center rounded-lg text-small font-medium transition-colors bg-primary text-white`}
            >
              {page}
            </button>
          ))}
          <button className="flex items-center gap-1 px-3 h-9 rounded-lg text-gray-600 text-small font-medium hover:bg-gray-100 transition-colors">
            {t('carousel.next')} <ChevronRight size={14} />
          </button>
        </div>
      </motion.div>

      {modalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setModalOpen(false)}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-lg font-bold text-gray-900 mb-4">
              {editingUser ? t('admin.form.editUser') : t('admin.form.addUser')}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-small font-medium text-gray-700 mb-1">{t('admin.labels.email')}</label>
                <input
                  type="email" required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-gray-200 text-small focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>
              {!editingUser && (
                <div>
                  <label className="block text-small font-medium text-gray-700 mb-1">{t('admin.labels.password')}</label>
                  <input
                    type="password" required
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-gray-200 text-small focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>
              )}
              {editingUser && (
                <div>
                  <label className="block text-small font-medium text-gray-700 mb-1">{t('admin.labels.newPasswordOptional')}</label>
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-gray-200 text-small focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>
              )}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-small font-medium text-gray-700 mb-1">{t('admin.labels.firstName')}</label>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-gray-200 text-small focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-small font-medium text-gray-700 mb-1">{t('admin.labels.lastName')}</label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-gray-200 text-small focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>
              </div>
              <div>
                <label className="block text-small font-medium text-gray-700 mb-1">{t('admin.labels.phone')}</label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-gray-200 text-small focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-small font-medium text-gray-700 mb-1">{t('admin.labels.role')}</label>
                <select
                  value={formData.roleId}
                  onChange={(e) => setFormData({ ...formData, roleId: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-gray-200 text-small text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition cursor-pointer"
                >
                  <option value="">{t('admin.labels.selectRole')}</option>
                  {roles.map((r) => (
                    <option key={r.id} value={r.id}>{r.name}</option>
                  ))}
                </select>
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
                  {editingUser ? t('admin.actions.save') : t('admin.actions.create')}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  )
}

export default Users
