// Ancien jeu de données fictif (n'est plus importé nulle part) : la liste
// admin réelle vient désormais de l'API via services/testimonials.ts.
export interface AdminTestimonial {
  id: number
  author: string
  role: string
  content: string
  rating: number
  date: string
  status: 'published' | 'draft'
}

export const adminTestimonials: AdminTestimonial[] = [
  { id: 1, author: 'Mariam Abakar', role: 'Chef de village', content: "Grâce à ZONAL, notre village a désormais accès à l'eau potable. Un changement immense pour nos enfants.", rating: 5, date: '12 Mars 2025', status: 'published' },
  { id: 2, author: 'Oumar Mahamat', role: 'Enseignant', content: "La formation en leadership a transformé ma façon d'enseigner. Les jeunes sont plus engagés que jamais.", rating: 5, date: '5 Fév 2025', status: 'published' },
  { id: 3, author: 'Fatimé Hassane', role: 'Présidente coopérative', content: 'Le matériel agricole reçu nous a permis d\'augmenter nos récoltes et d\'améliorer nos conditions de vie.', rating: 4, date: '20 Jan 2025', status: 'published' },
  { id: 4, author: 'Ali Moussa', role: 'Bénévole', content: 'Travailler avec ZONAL m\'a donné l\'opportunité de contribuer au développement de ma communauté.', rating: 5, date: '15 Déc 2024', status: 'published' },
  { id: 5, author: 'Aïchatou Mahamat', role: 'Mère de famille', content: 'Les programmes de sensibilisation ont changé notre quotidien.', rating: 4, date: '10 Nov 2024', status: 'draft' },
]

export const testimonialStatusColorMap: Record<string, string> = {
  published: 'bg-emerald-100 text-emerald-700',
  draft: 'bg-gray-100 text-gray-500',
}
