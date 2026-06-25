import { useState, useRef, useEffect } from 'react'
import { Link, Outlet, useLocation, useNavigate, useNavigation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import {
  LayoutDashboard, Calendar, Newspaper, FolderOpen, Image as ImageIcon,
  Handshake, MessageSquare, FileText, Users, Shield, Settings,
  LogOut, ChevronDown, Menu, X, User
} from 'lucide-react'
import { useAuth } from '../../contexts/useAuth'
import Loader from '../../components/ui/Loader'

const AdminLayout = () => {
  const { t } = useTranslation()
  const location = useLocation()
  const navigate = useNavigate()
  const { user, isAuthenticated, logout } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const profileRef = useRef<HTMLDivElement>(null)

  const navigation = useNavigation()
  const [showLoader, setShowLoader] = useState(false)

  useEffect(() => {
    if (navigation.state === 'loading') {
      const timer = setTimeout(() => setShowLoader(true), 150)
      return () => { clearTimeout(timer); setShowLoader(false) }
    } else {
      setShowLoader(false)
    }
  }, [navigation.state])

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { replace: true })
    }
  }, [isAuthenticated, navigate])

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const userInitial = user?.firstName?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || 'A'

  const navItems = [
    { path: '/admin', label: t('admin.sidebar.dashboard'), icon: LayoutDashboard, end: true },
    { path: '/admin/events', label: t('admin.sidebar.events'), icon: Calendar },
    { path: '/admin/news', label: t('admin.sidebar.news'), icon: Newspaper },
    { path: '/admin/projects', label: t('admin.sidebar.projects'), icon: FolderOpen },
    { path: '/admin/gallery', label: t('admin.sidebar.gallery'), icon: ImageIcon },
    { path: '/admin/partners', label: t('admin.sidebar.partners'), icon: Handshake },
    { path: '/admin/testimonials', label: t('admin.sidebar.testimonials'), icon: MessageSquare },
    { path: '/admin/documents', label: t('admin.sidebar.documents'), icon: FileText },
    { path: '/admin/users', label: t('admin.sidebar.users'), icon: Users },
    { path: '/admin/roles', label: t('admin.sidebar.roles'), icon: Shield },
    { path: '/admin/settings', label: t('admin.sidebar.settings'), icon: Settings },
  ]

  const isActive = (path: string, end?: boolean) =>
    end ? location.pathname === path : location.pathname.startsWith(path)

  return (
    <>
      {showLoader && <Loader />}
      <div className="min-h-screen flex bg-gray-50">
      <aside className={`fixed inset-y-0 left-0 z-40 w-64 bg-primary-dark text-white transform transition-transform duration-300 lg:translate-x-0 lg:z-auto ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center h-16 px-5 border-b border-white/10">
          <img src="/images/logoOrigin.png" alt="ZONAL" className="h-20 w-auto" />
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden ml-auto">
            <X size={20} />
          </button>
        </div>
        <nav className="p-4 space-y-1 overflow-y-auto" style={{ height: 'calc(100vh - 4rem)' }}>
          {navItems.map((item) => {
            const Icon = item.icon
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-small transition-colors ${
                  isActive(item.path, item.end)
                    ? 'bg-white/15 text-white font-medium'
                    : 'text-white/60 hover:text-white hover:bg-white/10'
                }`}
              >
                <Icon size={18} />
                {item.label}
              </Link>
            )
          })}
          <div className="pt-3 mt-3 border-t border-white/10">
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-small text-white/60 hover:text-white hover:bg-white/10 transition-colors w-full text-left cursor-pointer"
            >
              <LogOut size={18} />
              {t('admin.sidebar.logout')}
            </button>
          </div>
        </nav>
      </aside>

      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <div className="flex-1 flex flex-col min-w-0 lg:ml-64">
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 lg:px-6 shrink-0">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-gray-600">
            <Menu size={24} />
          </button>
          <div className="hidden lg:block" />
          <div className="flex items-center gap-4">
            <Link to="/" className="text-gray-400 hover:text-primary text-small transition-colors">
              {t('admin.topbar.backToSite')}
            </Link>
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2 text-gray-600 cursor-pointer hover:text-gray-900 transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-small">
                  {userInitial}
                </div>
                <span className="text-small font-medium hidden sm:inline">
                  {user?.firstName || t('admin.topbar.admin')}
                </span>
                <ChevronDown size={14} className={`transition-transform ${profileOpen ? 'rotate-180' : ''}`} />
              </button>
              {profileOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50">
                  <Link
                    to="/admin/profile"
                    onClick={() => setProfileOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2.5 text-gray-700 text-small hover:bg-gray-50 transition-colors"
                  >
                    <User size={16} />
                    {t('admin.topbar.myProfile')}
                  </Link>
                  <Link
                    to="/admin/settings"
                    onClick={() => setProfileOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2.5 text-gray-700 text-small hover:bg-gray-50 transition-colors"
                  >
                    <Settings size={16} />
                    {t('admin.topbar.settings')}
                  </Link>
                  <div className="border-t border-gray-100 my-1" />
                  <button
                    onClick={() => { setProfileOpen(false); handleLogout() }}
                    className="flex items-center gap-2.5 px-4 py-2.5 text-red text-small hover:bg-red-50 transition-colors w-full text-left cursor-pointer"
                  >
                    <LogOut size={16} />
                    {t('admin.sidebar.logout')}
                  </button>
                </div>
              )}
            </div>
            <button onClick={handleLogout} className="text-gray-400 hover:text-red transition-colors cursor-pointer">
              <LogOut size={18} />
            </button>
          </div>
        </header>

        <main className="flex-1 p-4 lg:p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  </>
)
}

export default AdminLayout
