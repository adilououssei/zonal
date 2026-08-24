import { useEffect, useRef, useState } from 'react'
import { Outlet, useNavigation, useLocation } from 'react-router-dom'
import Header from './Header.tsx'
import Footer from './Footer.tsx'
import Loader from '../ui/Loader.tsx'

// Mise en page commune à toutes les pages publiques du site (header + footer
// fixes, contenu de la page courante injecté via <Outlet />). Utilisé comme
// route parente dans main.tsx.
const Layout = () => {
  const navigation = useNavigation()
  const location = useLocation()
  const prevPath = useRef(location.pathname)
  const [showLoader, setShowLoader] = useState(false)

  useEffect(() => {
    if (location.pathname !== prevPath.current) {
      prevPath.current = location.pathname
    }
  }, [location.pathname])

  // Affiche le loader seulement si la navigation dure plus de 150ms, pour
  // éviter un flash inutile sur les changements de page quasi instantanés
  useEffect(() => {
    const timer = setTimeout(
      () => setShowLoader(navigation.state === 'loading'),
      navigation.state === 'loading' ? 150 : 0
    )
    return () => clearTimeout(timer)
  }, [navigation.state])

  return (
    <div className="min-h-screen flex flex-col">
      {showLoader && <Loader />}
      <Header />
      <main className="grow pt-18 md:pt-30">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

export default Layout