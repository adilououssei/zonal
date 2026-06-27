import { useState, useEffect, useRef, type FormEvent, type ElementType } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import {
  User, Lock, Monitor, Camera, Mail, Phone, Laptop, CheckCircle, Loader2
} from 'lucide-react'
import { useAuth } from '../../contexts/useAuth'
import { adminService } from '../../services/admin'
import { api } from '../../services/api'
import { authService } from '../../services/auth'

type TabKey = 'info' | 'password' | 'sessions'

const tabs: { key: TabKey; label: string; icon: ElementType }[] = [
  { key: 'info', label: 'info', icon: User },
  { key: 'password', label: 'password', icon: Lock },
  { key: 'sessions', label: 'sessions', icon: Monitor },
]

const inputClass =
  'w-full px-3.5 py-2.5 rounded-lg border border-gray-200 text-small focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition'
const labelClass = 'block text-small font-medium text-gray-700 mb-1.5'

const Profile = () => {
  const { t } = useTranslation()
  const tabs: { key: TabKey; label: string; icon: ElementType }[] = [
    { key: 'info', label: t('admin.profile.tabs.info'), icon: User },
    { key: 'password', label: t('admin.profile.tabs.password'), icon: Lock },
    { key: 'sessions', label: t('admin.profile.tabs.sessions'), icon: Monitor },
  ]
  const { user: authUser, refreshUser } = useAuth()
  const [activeTab, setActiveTab] = useState<TabKey>('info')
  const [uploadingAvatar, setUploadingAvatar] = useState(false)
  const [loading, setLoading] = useState(true)
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')

  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [avatar, setAvatar] = useState('')

  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  useEffect(() => {
    adminService.getProfile().then((data) => {
      setFirstName(data.firstName || '')
      setLastName(data.lastName || '')
      setEmail(data.email)
      setPhone(data.phone || '')
      setAvatar(data.avatar ?? '')
    }).catch((err) => {
      setError(err instanceof Error ? err.message : t('admin.errors.generic'))
    }).finally(() => {
      setLoading(false)
    })
  }, [])

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadingAvatar(true)
    try {
      const fd = new FormData()
      fd.append('file', file)
      const result = await api.upload<{ url: string }>('/api/upload', fd)
      const updated = await adminService.updateProfile({ avatar: result.url })
      setAvatar(updated.avatar ?? '')
      authService.updateUser(updated)
      refreshUser()
    } catch {
      setError(t('admin.errors.uploadPhoto'))
    } finally {
      setUploadingAvatar(false)
    }
  }

  const handleInfoSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    try {
      const updated = await adminService.updateProfile({ firstName, lastName, email, phone })
      setFirstName(updated.firstName || '')
      setLastName(updated.lastName || '')
      setEmail(updated.email)
      setPhone(updated.phone || '')
      authService.updateUser(updated)
      refreshUser()
      setSuccess(t('admin.profile.updated'))
    } catch (err) {
      setError(err instanceof Error ? err.message : t('admin.errors.updateProfile'))
    }
  }

  const handlePasswordSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!currentPassword || !newPassword) {
      setError(t('admin.errors.allFieldsRequired'))
      return
    }
    if (newPassword.length < 6) {
      setError(t('admin.errors.passwordLength'))
      return
    }
    if (newPassword !== confirmPassword) {
      setError(t('admin.errors.passwordMismatch'))
      return
    }

    try {
      await adminService.changePassword({ currentPassword, newPassword })
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
      setSuccess(t('admin.profile.passwordUpdated'))
    } catch (err) {
      setError(err instanceof Error ? err.message : t('admin.errors.generic'))
    }
  }

  if (loading) {
    return <div className="p-8 text-center text-gray-400">{t('admin.loading')}</div>
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">{t('admin.profile.title')}</h1>
        <p className="text-gray-500 text-small mt-1">{t('admin.sidebar.dashboard')} &gt; {t('admin.profile.title')}</p>
      </div>

      {success && (
        <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 text-small rounded-lg flex items-center gap-2">
          <CheckCircle size={16} />
          {success}
          <button onClick={() => setSuccess('')} className="ml-auto font-bold">&times;</button>
        </div>
      )}

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red text-small rounded-lg">
          {error}
          <button onClick={() => setError('')} className="ml-2 font-bold">&times;</button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-6">
        <nav className="bg-white rounded-xl shadow-sm border border-gray-100 p-2 flex lg:flex-col gap-1 overflow-x-auto lg:overflow-visible">
          {tabs.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg text-small font-medium whitespace-nowrap transition-colors ${
                activeTab === key ? 'bg-primary text-white' : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Icon size={16} />
              {label}
            </button>
          ))}
        </nav>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 overflow-y-auto max-h-[calc(100vh-13rem)]"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {activeTab === 'info' && (
                <form onSubmit={handleInfoSubmit}>
                  <div className="grid grid-cols-1 sm:grid-cols-[140px_1fr] gap-8">
                    <div>
                      <p className="text-small font-medium text-gray-700 mb-3">{t('admin.profile.profilePhoto')}</p>
                      <label className="relative cursor-pointer group block w-28 h-28">
                        <div className="w-28 h-28 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-3xl overflow-hidden">
                          {uploadingAvatar ? (
                            <div className="w-full h-full flex items-center justify-center">
                              <Loader2 size={24} className="animate-spin text-primary" />
                            </div>
                          ) : avatar ? (
                            <img src={avatar} alt="Avatar" className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-primary font-bold text-3xl">
                              {authUser?.firstName?.charAt(0)?.toUpperCase() || authUser?.email?.charAt(0)?.toUpperCase() || '?'}
                            </div>
                          )}
                        </div>
                        <div className="absolute inset-0 rounded-full bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                          <Camera size={20} className="text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                        <input type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} disabled={uploadingAvatar} />
                      </label>
                      <label className="block text-center mt-3 text-primary text-small font-medium hover:text-primary-dark transition-colors cursor-pointer">
                        {uploadingAvatar ? t('admin.profile.uploading') : t('admin.profile.changePhoto')}
                        <input type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} disabled={uploadingAvatar} />
                      </label>
                    </div>

                    <div>
                      <h3 className="font-semibold text-gray-900 text-body mb-4">{t('admin.profile.personalInfo')}</h3>
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className={labelClass}>{t('admin.labels.firstName')}</label>
                            <input
                              type="text"
                              value={firstName}
                              onChange={(e) => setFirstName(e.target.value)}
                              className={inputClass}
                            />
                          </div>
                          <div>
                            <label className={labelClass}>{t('admin.labels.lastName')}</label>
                            <input
                              type="text"
                              value={lastName}
                              onChange={(e) => setLastName(e.target.value)}
                              className={inputClass}
                            />
                          </div>
                        </div>
                        <div>
                          <label className={`${labelClass} flex items-center gap-2`}>
                            <Mail size={14} /> {t('admin.profile.email')}
                          </label>
                          <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className={inputClass}
                          />
                        </div>
                        <div>
                          <label className={`${labelClass} flex items-center gap-2`}>
                            <Phone size={14} /> {t('admin.profile.phone')}
                          </label>
                          <input
                            type="text"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className={inputClass}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-3 mt-8 pt-6 border-t border-gray-100">
                    <button
                      type="button"
                      onClick={() => {
                        setFirstName(authUser?.firstName || '')
                        setLastName(authUser?.lastName || '')
                        setEmail(authUser?.email || '')
                        setPhone(authUser?.phone || '')
                      }}
                      className="px-5 py-2.5 rounded-lg text-gray-600 font-medium text-small border border-gray-200 hover:bg-gray-50 transition-colors"
                    >
                      {t('admin.actions.cancel')}
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2.5 rounded-lg bg-primary text-white font-medium text-small hover:bg-primary-dark transition-colors"
                    >
                      {t('admin.actions.save')}
                    </button>
                  </div>
                </form>
              )}

              {activeTab === 'password' && (
                <form onSubmit={handlePasswordSubmit}>
                  <h3 className="font-semibold text-gray-900 text-body mb-4">{t('admin.profile.changePassword')}</h3>
                  <div className="space-y-4 max-w-md">
                    <div>
                      <label className={`${labelClass} flex items-center gap-2`}>
                        <Lock size={14} /> {t('admin.profile.currentPassword')}
                      </label>
                      <input
                        type="password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        placeholder="••••••••"
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className={labelClass}>{t('admin.profile.newPassword')}</label>
                      <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="••••••••"
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className={labelClass}>{t('admin.profile.confirmNewPassword')}</label>
                      <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="••••••••"
                        className={inputClass}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-3 mt-8 pt-6 border-t border-gray-100">
                    <button
                      type="button"
                      onClick={() => { setCurrentPassword(''); setNewPassword(''); setConfirmPassword('') }}
                      className="px-5 py-2.5 rounded-lg text-gray-600 font-medium text-small border border-gray-200 hover:bg-gray-50 transition-colors"
                    >
                      {t('admin.actions.cancel')}
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2.5 rounded-lg bg-primary text-white font-medium text-small hover:bg-primary-dark transition-colors"
                    >
                      {t('admin.actions.save')}
                    </button>
                  </div>
                </form>
              )}

              {activeTab === 'sessions' && (
                <div>
                  <h3 className="font-semibold text-gray-900 text-body mb-1">{t('admin.profile.activeSessions')}</h3>
                  <p className="text-gray-500 text-small mb-5">
                    {t('admin.profile.sessionDescription')}
                  </p>
                  <ul className="space-y-3">
                    <li className="flex items-center justify-between gap-4 p-4 rounded-xl border border-gray-100">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                          <Laptop size={18} />
                        </div>
                        <div>
                          <p className="text-gray-800 text-small font-medium flex items-center gap-2">
                            {t('admin.profile.currentSession')}
                            <span className="bg-emerald-100 text-emerald-700 text-[10px] font-semibold px-2 py-0.5 rounded-full">
                              {t('admin.profile.currentSession')}
                            </span>
                          </p>
                          <p className="text-gray-400 text-xs">{t('admin.profile.sampleLocation')}</p>
                        </div>
                      </div>
                    </li>
                  </ul>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  )
}

export default Profile
