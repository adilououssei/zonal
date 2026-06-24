// src/data/newsData.ts
export interface CategoryItem {
  slug: string
  label: string
  count: number
  color: string
}

export interface ArticleItem {
  id: number
  title: string
  excerpt: string
  date: string
  category: string
  categoryColor: string
  image: string
}

export const categories: CategoryItem[] = [
  { slug: 'environnement', label: 'Environnement', count: 12, color: 'bg-primary' },
  { slug: 'gouvernance', label: 'Gouvernance', count: 8, color: 'bg-primary' },
  { slug: 'developpement-rural', label: 'Développement rural', count: 10, color: 'bg-primary' },
  { slug: 'eau-assainissement', label: 'Eau & Assainissement', count: 6, color: 'bg-primary' },
  { slug: 'biodiversite', label: 'Biodiversité', count: 7, color: 'bg-primary' },
  { slug: 'gestion-catastrophes', label: 'Gestion des catastrophes', count: 4, color: 'bg-primary' },
  { slug: 'education-sensibilisation', label: 'Éducation & Sensibilisation', count: 9, color: 'bg-primary' },
]

export const articles: ArticleItem[] = [
  {
    id: 1,
    title: "Journée mondiale de l'environnement 2024",
    excerpt: 'Une journée de sensibilisation et de plantation d\'arbres pour promouvoir la protection de notre planète.',
    date: '05 Juin 2024',
    category: 'ENVIRONNEMENT',
    categoryColor: 'bg-primary',
    image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=600&h=400&fit=crop',
  },
  {
    id: 2,
    title: 'Atelier de renforcement des capacités des leaders locaux',
    excerpt: 'Zonal ONG a organisé un atelier pour renforcer les compétences des leaders communautaires en gouvernance locale.',
    date: '28 Mai 2024',
    category: 'GOUVERNANCE',
    categoryColor: 'bg-primary',
    image: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=600&h=400&fit=crop',
  },
  {
    id: 3,
    title: 'Mission d\'évaluation des zones humides du Lac Fitri',
    excerpt: 'Une mission de terrain pour évaluer l\'état de conservation des zones humides et identifier les actions prioritaires.',
    date: '18 Mai 2024',
    category: 'ENVIRONNEMENT',
    categoryColor: 'bg-primary',
    image: 'https://images.unsplash.com/photo-1543168256-4183f1f5aab1?w=600&h=400&fit=crop',
  },
  {
    id: 4,
    title: "Inauguration d'un point d'eau potable à Abéché",
    excerpt: 'Grâce à nos partenaires, un nouveau point d\'eau potable a été mis en service pour le bien-être des communautés.',
    date: '10 Mai 2024',
    category: 'EAU & ASSAINISSEMENT',
    categoryColor: 'bg-primary',
    image: 'https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?w=600&h=400&fit=crop',
  },
  {
    id: 5,
    title: 'Campagne de sensibilisation pour la protection de la biodiversité',
    excerpt: 'Nos équipes mènent des actions de sensibilisation auprès des communautés riveraines pour préserver la biodiversité.',
    date: '02 Mai 2024',
    category: 'BIODIVERSITÉ',
    categoryColor: 'bg-primary',
    image: 'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?w=600&h=400&fit=crop',
  },
  {
    id: 6,
    title: 'Appui aux groupements agricoles dans la province du Logone',
    excerpt: 'Distribution de semences améliorées et formations techniques pour renforcer la productivité agricole.',
    date: '25 Avril 2024',
    category: 'DÉVELOPPEMENT RURAL',
    categoryColor: 'bg-primary',
    image: 'https://images.unsplash.com/photo-1500651230702-0e2d8a49d4ad?w=600&h=400&fit=crop',
  },
]