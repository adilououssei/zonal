import { useCallback, useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import type { ShareItem } from './ShareModal'

// État de la fenêtre de partage d'une liste admin. Les formulaires de création
// reviennent sur la liste avec { state: { shareItem } } : la fenêtre s'ouvre
// alors en mode « publication réussie ». L'état de navigation est effacé
// aussitôt, pour qu'un rafraîchissement de la page ne la rouvre pas.
export const useShareModal = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const [fromForm] = useState(() => (location.state as { shareItem?: ShareItem } | null)?.shareItem ?? null)
  const [shareItem, setShareItem] = useState<ShareItem | null>(fromForm)
  const [justPublished, setJustPublished] = useState(fromForm !== null)

  useEffect(() => {
    if (fromForm) navigate(location.pathname, { replace: true, state: null })
  }, [fromForm, location.pathname, navigate])

  const openShare = useCallback((item: ShareItem) => {
    setJustPublished(false)
    setShareItem(item)
  }, [])

  const closeShare = useCallback(() => setShareItem(null), [])

  return { shareItem, justPublished, openShare, closeShare }
}
