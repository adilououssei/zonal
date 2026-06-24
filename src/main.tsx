// src/main.tsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import Layout from './components/layout/Layout'
import Home from './pages/Home'
import About from './pages/About'
import Programs from './pages/Programs'
import Events from './pages/Events'
import News from './pages/News'
import Contact from './pages/Contact'
import Login from './pages/Login'
import AdminLayout from './pages/admin/AdminLayout'
import Dashboard from './pages/admin/Dashboard'
import './index.css'
import './i18n/config'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'about', element: <About /> },
      { path: 'programs', element: <Programs /> },
      { path: 'events', element: <Events /> },
      { path: 'news', element: <News /> },
      { path: 'contact', element: <Contact /> },
    ],
  },
  { path: '/login', element: <Login /> },
  {
    path: '/admin',
    element: <AdminLayout />,
    children: [
      { index: true, element: <Dashboard /> },
    ],
  },
])

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <HelmetProvider>
      <RouterProvider router={router} />
    </HelmetProvider>
  </React.StrictMode>,
)
