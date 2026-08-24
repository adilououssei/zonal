// Ancien jeu de données fictif (n'est plus importé nulle part) : la liste
// admin réelle vient désormais de l'API via services/events.ts (eventsService).
export type AdminEventStatus = 'À venir' | 'En cours' | 'Terminé'

export interface AdminEventItem {
  id: number
  image: string
  title: string
  date: string
  location: string
  status: AdminEventStatus
}

export const adminEvents: AdminEventItem[] = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?w=200&h=200&fit=crop',
    title: "Journée mondiale de l'environnement",
    date: '05/06/2024',
    location: "N'Djamena, Tchad",
    status: 'À venir',
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?w=200&h=200&fit=crop',
    title: 'Atelier sur la gouvernance locale',
    date: '12/06/2024',
    location: "N'Djamena, Tchad",
    status: 'À venir',
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=200&h=200&fit=crop',
    title: 'Campagne de reboisement',
    date: '20/06/2024',
    location: 'Abéché, Tchad',
    status: 'À venir',
  },
  {
    id: 4,
    image: 'https://images.unsplash.com/photo-1500651230702-0e2d8a49d4ad?w=200&h=200&fit=crop',
    title: "Semaine de l'arbre",
    date: '25/04/2024',
    location: 'Moundou, Tchad',
    status: 'Terminé',
  },
  {
    id: 5,
    image: 'https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?w=200&h=200&fit=crop',
    title: 'Formation sur le climat',
    date: '10/03/2024',
    location: 'Sarh, Tchad',
    status: 'Terminé',
  },
]

export const statusColorMap: Record<AdminEventStatus, string> = {
  'À venir': 'bg-emerald-100 text-emerald-700',
  'En cours': 'bg-blue-100 text-blue-700',
  Terminé: 'bg-gray-100 text-gray-500',
}