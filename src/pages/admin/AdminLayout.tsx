import { useState } from 'react'
import { Link, Outlet, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import {
  LayoutDashboard, Calendar, Newspaper, FolderOpen, Image as ImageIcon,
  Handshake, MessageSquare, FileText, Users, Shield, Settings,
  LogOut, ChevronDown, Menu, X
} from 'lucide-react'

const AdminLayout = () => {
  const { t } = useTranslation()
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(false)

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
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-40 w-64 bg-primary-dark text-white transform transition-transform duration-300 lg:translate-x-0 lg:z-auto ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center h-16 px-5 border-b border-white/10">
          <img src="/images/logoOrigin.png" alt="ZONAL" className="h-24 w-auto" />
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
            <Link
              to="/login"
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-small text-white/60 hover:text-white hover:bg-white/10 transition-colors"
            >
              <LogOut size={18} />
              {t('admin.sidebar.logout')}
            </Link>
          </div>
        </nav>
      </aside>

      {/* Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0 lg:ml-64">
        {/* Top bar */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 lg:px-6 shrink-0">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-gray-600">
            <Menu size={24} />
          </button>
          <div className="hidden lg:block" />
          <div className="flex items-center gap-4">
            <Link to="/" className="text-gray-400 hover:text-primary text-small transition-colors">
              {t('admin.topbar.backToSite')}
            </Link>
            <div className="flex items-center gap-2 text-gray-600 cursor-pointer">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-small">
                A
              </div>
              <span className="text-small font-medium hidden sm:inline">{t('admin.topbar.admin')}</span>
              <ChevronDown size={14} />
            </div>
            <Link to="/login" className="text-gray-400 hover:text-red transition-colors">
              <LogOut size={18} />
            </Link>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 lg:p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default AdminLayout
