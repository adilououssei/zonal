// Ancien jeu de données fictif (n'est plus importé nulle part) : les
// événements réels du site public viennent désormais de l'API via
// services/events.ts (publicEventsService).
export type EventStatus = 'À venir' | 'En cours' | 'Passé'

export interface EventItem {
  id: number
  day: string
  month: string
  year: string
  status: EventStatus
  title: string
  location: string
  time: string
  description: string
  image: string
}

export const upcomingEventsList: EventItem[] = [
  {
    id: 1,
    day: '05',
    month: 'JUIN',
    year: '2024',
    status: 'À venir',
    title: "Journée mondiale de l'environnement",
    location: "N'Djamena, Tchad",
    time: '08h00 - 14h00',
    description: "Activités de sensibilisation, plantation d'arbres et nettoyage des espaces publics.",
    image: 'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?w=600&h=450&fit=crop',
  },
  {
    id: 2,
    day: '12',
    month: 'JUIN',
    year: '2024',
    status: 'À venir',
    title: 'Atelier sur la gouvernance locale',
    location: 'Abéché, Tchad',
    time: '09h00 - 16h00',
    description: 'Renforcement des capacités des leaders communautaires sur la bonne gouvernance.',
    image: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?w=600&h=450&fit=crop',
  },
  {
    id: 3,
    day: '20',
    month: 'JUIN',
    year: '2024',
    status: 'À venir',
    title: 'Visite des zones humides du Lac Fitri',
    location: 'Faya, Tchad',
    time: '07h30 - 13h00',
    description: 'Mission d\'évaluation et de sensibilisation pour la conservation des zones humides.',
    image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=600&h=450&fit=crop',
  },
]

export const pastEventsList: EventItem[] = [
  {
    id: 4,
    day: '22',
    month: 'AVR.',
    year: '2024',
    status: 'Passé',
    title: 'Campagne de reboisement',
    location: 'Mao, Tchad',
    time: '',
    description: '',
    image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=500&h=350&fit=crop',
  },
  {
    id: 5,
    day: '15',
    month: 'MARS',
    year: '2024',
    status: 'Passé',
    title: 'Formation sur le changement climatique',
    location: 'Sarh, Tchad',
    time: '',
    description: '',
    image: 'https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?w=500&h=350&fit=crop',
  },
  {
    id: 6,
    day: '10',
    month: 'FÉV.',
    year: '2024',
    status: 'Passé',
    title: 'Sensibilisation sur la protection de la biodiversité',
    location: 'Lac Iro, Tchad',
    time: '',
    description: '',
    image: 'https://images.unsplash.com/photo-1500534623283-312aade485b7?w=500&h=350&fit=crop',
  },
]