import { useState, type FormEvent, type ElementType } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  User, Lock, Monitor, Camera, Mail, Phone, Smartphone, Laptop, LogOut
} from 'lucide-react'

type TabKey = 'info' | 'password' | 'sessions'

const tabs: { key: TabKey; label: string; icon: ElementType }[] = [
  { key: 'info', label: 'Informations', icon: User },
  { key: 'password', label: 'Changer le mot de passe', icon: Lock },
  { key: 'sessions', label: 'Sessions actives', icon: Monitor },
]

const inputClass =
  'w-full px-3.5 py-2.5 rounded-lg border border-gray-200 text-small focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition'
const labelClass = 'block text-small font-medium text-gray-700 mb-1.5'

const activeSessions = [
  { device: 'Chrome — Windows', location: "N'Djamena, Tchad", lastActive: 'Maintenant', icon: Laptop, current: true },
  { device: 'Application — Android', location: "N'Djamena, Tchad", lastActive: 'Il y a 2 heures', icon: Smartphone, current: false },
  { device: 'Safari — macOS', location: 'Moundou, Tchad', lastActive: 'Il y a 3 jours', icon: Laptop, current: false },
]

const Profile = () => {
  const [activeTab, setActiveTab] = useState<TabKey>('info')
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)

  const [name, setName] = useState('Admin Principal')
  const [email, setEmail] = useState('admin@zonalong.org')
  const [phone, setPhone] = useState('+235 66 00 00 00')

  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) setAvatarPreview(URL.createObjectURL(file))
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    // À connecter à l'API backend
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Mon profil</h1>
        <p className="text-gray-500 text-small mt-1">Tableau de bord &gt; Mon profil</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-6">
        {/* Sous-menu à onglets */}
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

        {/* Panneau de contenu */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
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
                <form onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 sm:grid-cols-[140px_1fr] gap-8">
                    {/* Photo */}
                    <div>
                      <p className="text-small font-medium text-gray-700 mb-3">Photo de profil</p>
                      <label className="relative cursor-pointer group block w-28 h-28">
                        <div className="w-28 h-28 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-3xl overflow-hidden">
                          {avatarPreview ? (
                            <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover" />
                          ) : (
                            <img
                              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop"
                              alt="Avatar"
                              className="w-full h-full object-cover"
                            />
                          )}
                        </div>
                        <div className="absolute inset-0 rounded-full bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                          <Camera size={20} className="text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                        <input type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
                      </label>
                      <label className="block text-center mt-3 text-primary text-small font-medium hover:text-primary-dark transition-colors cursor-pointer">
                        Changer la photo
                        <input type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
                      </label>
                    </div>

                    {/* Champs */}
                    <div>
                      <h3 className="font-semibold text-gray-900 text-body mb-4">Informations personnelles</h3>
                      <div className="space-y-4">
                        <div>
                          <label className={labelClass}>Nom complet</label>
                          <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className={inputClass}
                          />
                        </div>
                        <div>
                          <label className={`${labelClass} flex items-center gap-2`}>
                            <Mail size={14} /> Email
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
                            <Phone size={14} /> Téléphone
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
                      className="px-5 py-2.5 rounded-lg text-gray-600 font-medium text-small border border-gray-200 hover:bg-gray-50 transition-colors"
                    >
                      Annuler
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2.5 rounded-lg bg-primary text-white font-medium text-small hover:bg-primary-dark transition-colors"
                    >
                      Enregistrer
                    </button>
                  </div>
                </form>
              )}

              {activeTab === 'password' && (
                <form onSubmit={handleSubmit}>
                  <h3 className="font-semibold text-gray-900 text-body mb-4">Changer le mot de passe</h3>
                  <div className="space-y-4 max-w-md">
                    <div>
                      <label className={`${labelClass} flex items-center gap-2`}>
                        <Lock size={14} /> Mot de passe actuel
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
                      <label className={labelClass}>Nouveau mot de passe</label>
                      <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="••••••••"
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className={labelClass}>Confirmer le nouveau mot de passe</label>
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
                      className="px-5 py-2.5 rounded-lg text-gray-600 font-medium text-small border border-gray-200 hover:bg-gray-50 transition-colors"
                    >
                      Annuler
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2.5 rounded-lg bg-primary text-white font-medium text-small hover:bg-primary-dark transition-colors"
                    >
                      Enregistrer
                    </button>
                  </div>
                </form>
              )}

              {activeTab === 'sessions' && (
                <div>
                  <h3 className="font-semibold text-gray-900 text-body mb-1">Sessions actives</h3>
                  <p className="text-gray-500 text-small mb-5">
                    Liste des appareils actuellement connectés à votre compte.
                  </p>
                  <ul className="space-y-3">
                    {activeSessions.map((session, i) => {
                      const Icon = session.icon
                      return (
                        <li
                          key={i}
                          className="flex items-center justify-between gap-4 p-4 rounded-xl border border-gray-100"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                              <Icon size={18} />
                            </div>
                            <div>
                              <p className="text-gray-800 text-small font-medium flex items-center gap-2">
                                {session.device}
                                {session.current && (
                                  <span className="bg-emerald-100 text-emerald-700 text-[10px] font-semibold px-2 py-0.5 rounded-full">
                                    Session actuelle
                                  </span>
                                )}
                              </p>
                              <p className="text-gray-400 text-xs">{session.location} · {session.lastActive}</p>
                            </div>
                          </div>
                          {!session.current && (
                            <button
                              className="flex items-center gap-1.5 text-red text-small font-medium hover:text-red/80 transition-colors flex-shrink-0"
                              title="Déconnecter cette session"
                            >
                              <LogOut size={14} />
                              Déconnecter
                            </button>
                          )}
                        </li>
                      )
                    })}
                  </ul>

                  <button className="mt-6 text-red text-small font-medium hover:text-red/80 transition-colors">
                    Déconnecter toutes les autres sessions
                  </button>
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