import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import { AuthProvider } from './contexts/AuthProvider'
import ScrollToTop from './components/ScrollToTop'
import Layout from './components/layout/Layout'
import Home from './pages/Home'
import About from './pages/About'
import Programs from './pages/Programs'
import Events from './pages/Events'
import EventDetail from './pages/EventDetail'
import News from './pages/News'
import NewsDetail from './pages/NewsDetail'
import Projects from './pages/Projects'
import ProjectDetail from './pages/ProjectDetail'
import Contact from './pages/Contact'
import Login from './pages/Login'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'
import AdminLayout from './pages/admin/AdminLayout'
import Dashboard from './pages/admin/Dashboard'
import EventsList from './pages/admin/EventsList'
import EventForm from './pages/admin/EventForm'
import AdminEventDetail from './pages/admin/EventDetail'
import NewsList from './pages/admin/NewsList'
import NewsForm from './pages/admin/NewsForm'
import AdminNewsDetail from './pages/admin/NewsDetail'
import AdminProjects from './pages/admin/Projects'
import ProjectsForm from './pages/admin/ProjectsForm'
import Gallery from './pages/admin/Gallery'
import GalleryForm from './pages/admin/GalleryForm'
import Partners from './pages/admin/Partners'
import PartnersForm from './pages/admin/PartnersForm'
import Testimonials from './pages/admin/Testimonials'
import TestimonialsForm from './pages/admin/TestimonialsForm'
import Documents from './pages/admin/Documents'
import DocumentsForm from './pages/admin/DocumentsForm'
import Users from './pages/admin/Users'
import Roles from './pages/admin/Roles'
import Settings from './pages/admin/Settings'
import Profile from './pages/admin/Profile'
import './index.css'
import './i18n/config'

const router = createBrowserRouter([
  {
    element: <><ScrollToTop /><Outlet /></>,
    children: [
      {
        path: '/',
        element: <Layout />,
        children: [
          { index: true, element: <Home /> },
          { path: 'about', element: <About /> },
          { path: 'programs', element: <Programs /> },
          { path: 'projects', element: <Projects /> },
          { path: 'projects/:id', element: <ProjectDetail /> },
          { path: 'events', element: <Events /> },
          { path: 'events/:id', element: <EventDetail /> },
          { path: 'news', element: <News /> },
          { path: 'news/:id', element: <NewsDetail /> },
          { path: 'contact', element: <Contact /> },
        ],
      },
      { path: '/login', element: <Login /> },
      { path: '/forgot-password', element: <ForgotPassword /> },
      { path: '/reset-password/:token', element: <ResetPassword /> },
      {
        path: '/admin',
        element: <AdminLayout />,
        children: [
          { index: true, element: <Dashboard /> },
          { path: 'events', element: <EventsList /> },
          { path: 'events/new', element: <EventForm /> },
          { path: 'events/:id', element: <AdminEventDetail /> },
          { path: 'events/:id/edit', element: <EventForm /> },
          { path: 'news', element: <NewsList /> },
          { path: 'news/new', element: <NewsForm /> },
          { path: 'news/:id', element: <AdminNewsDetail /> },
          { path: 'news/:id/edit', element: <NewsForm /> },
          { path: 'projects', element: <AdminProjects /> },
          { path: 'projects/new', element: <ProjectsForm /> },
          { path: 'projects/:id/edit', element: <ProjectsForm /> },
          { path: 'gallery', element: <Gallery /> },
          { path: 'gallery/new', element: <GalleryForm /> },
          { path: 'gallery/:id/edit', element: <GalleryForm /> },
          { path: 'partners', element: <Partners /> },
          { path: 'partners/new', element: <PartnersForm /> },
          { path: 'partners/:id/edit', element: <PartnersForm /> },
          { path: 'testimonials', element: <Testimonials /> },
          { path: 'testimonials/new', element: <TestimonialsForm /> },
          { path: 'testimonials/:id/edit', element: <TestimonialsForm /> },
          { path: 'documents', element: <Documents /> },
          { path: 'documents/new', element: <DocumentsForm /> },
          { path: 'documents/:id/edit', element: <DocumentsForm /> },
          { path: 'users', element: <Users /> },
          { path: 'roles', element: <Roles /> },
          { path: 'settings', element: <Settings /> },
          { path: 'profile', element: <Profile /> },
        ],
      },
    ],
  },
])

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <HelmetProvider>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </HelmetProvider>
  </React.StrictMode>,
)

console.log(
  '%c◈ Site développé par Ousseï Adilou',
  'font-size:14px; font-weight:bold; color:#0B6B3A; padding:4px 8px;'
)
