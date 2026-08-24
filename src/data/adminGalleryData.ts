// Ancien jeu de données fictif (n'est plus importé nulle part) : la galerie
// admin réelle vient désormais de l'API via services/gallery.ts.
export interface AdminGalleryItem {
  id: number
  src: string
  title: string
  date: string
  category: string
}

export const adminGalleryItems: AdminGalleryItem[] = [
  { id: 1, src: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=300&h=200&fit=crop', title: 'Reboisement Guera', date: '12 Mars 2025', category: 'Environnement' },
  { id: 2, src: 'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?w=300&h=200&fit=crop', title: 'Formation jeunes', date: '5 Fév 2025', category: 'Éducation' },
  { id: 3, src: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=300&h=200&fit=crop', title: "Point d'eau Abéché", date: '20 Jan 2025', category: 'Eau' },
  { id: 4, src: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=300&h=200&fit=crop', title: 'Atelier climat', date: '15 Déc 2024', category: 'Environnement' },
  { id: 5, src: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=300&h=200&fit=crop', title: 'Campagne scolaire', date: '8 Nov 2024', category: 'Éducation' },
  { id: 6, src: 'https://images.unsplash.com/photo-1560493676-04071c5f467b?w=300&h=200&fit=crop', title: 'Agriculture durable', date: '22 Oct 2024', category: 'Agriculture' },
  { id: 7, src: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=300&h=200&fit=crop', title: 'Distribution de kits', date: '10 Sep 2024', category: 'Social' },
  { id: 8, src: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=300&h=200&fit=crop', title: 'Nettoyage urbain', date: '5 Août 2024', category: 'Environnement' },
]

export const galleryCategories = ['Toutes', 'Environnement', 'Éducation', 'Eau', 'Agriculture', 'Social']
