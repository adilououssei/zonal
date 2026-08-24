import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

// React Router ne remet pas le scroll en haut de page lors d'une navigation
// interne : ce composant (monté une fois dans main.tsx) le fait manuellement
// à chaque changement d'URL.
const ScrollToTop = () => {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return null
}

export default ScrollToTop
