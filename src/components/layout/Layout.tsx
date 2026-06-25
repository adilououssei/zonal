import { useEffect, useRef, useState } from 'react'
import { Outlet, useNavigation, useLocation } from 'react-router-dom'
import Header from './Header.tsx'
import Footer from './Footer.tsx'
import Loader from '../ui/Loader.tsx'

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

  useEffect(() => {
    if (navigation.state === 'loading') {
      const timer = setTimeout(() => setShowLoader(true), 150)
      return () => { clearTimeout(timer); setShowLoader(false) }
    } else {
      setShowLoader(false)
    }
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