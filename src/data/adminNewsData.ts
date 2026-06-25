// src/data/adminNewsData.ts
export interface AdminNewsItem {
  id: number
  image: string
  title: string
  excerpt: string
  category: string
  date: string
  author: string
  views: number
}

export const adminNews: AdminNewsItem[] = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=200&h=200&fit=crop',
    title: "Lancement d'un nouveau projet de reboisement dans le Guera",
    excerpt: "Dans le cadre de notre engagement pour la protection de l'environnement, nous avons lancé un vaste programme de reboisement dans la région du Guera.",
    category: 'Environnement',
    date: '12/03/2025',
    author: 'Admin',
    views: 245,
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?w=200&h=200&fit=crop',
    title: 'Formation en leadership pour 100 jeunes à N\'Djamena',
    excerpt: 'Une formation intensive en leadership et gouvernance a été organisée pour 100 jeunes issus de différents quartiers.',
    category: 'Éducation',
    date: '05/02/2025',
    author: 'Admin',
    views: 189,
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=200&h=200&fit=crop',
    title: "Construction d'un nouveau point d'eau à Abéché",
    excerpt: "Un nouveau forage d'eau potable a été inauguré à Abéché, desservant plus de 500 ménages de la communauté locale.",
    category: 'Eau & Assainissement',
    date: '20/01/2025',
    author: 'Admin',
    views: 312,
  },
  {
    id: 4,
    image: 'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?w=200&h=200&fit=crop',
    title: 'Atelier sur la gestion des catastrophes naturelles',
    excerpt: 'Un atelier de formation sur la prévention et la gestion des catastrophes naturelles a réuni 50 participants.',
    category: 'Gestion des catastrophes',
    date: '15/12/2024',
    author: 'Admin',
    views: 98,
  },
  {
    id: 5,
    image: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=200&h=200&fit=crop',
    title: "Campagne de sensibilisation à l'hygiène en milieu scolaire",
    excerpt: "Notre équipe a organisé une campagne de sensibilisation à l'hygiène dans 20 écoles primaires de la région du Logone.",
    category: 'Éducation',
    date: '08/11/2024',
    author: 'Admin',
    views: 156,
  },
  {
    id: 6,
    image: 'https://images.unsplash.com/photo-1560493676-04071c5f467b?w=200&h=200&fit=crop',
    title: 'Remise de matériel agricole aux coopératives féminines',
    excerpt: 'Nous avons remis du matériel agricole à 15 coopératives féminines de la région du Mayo-Kebbi.',
    category: 'Développement rural',
    date: '22/10/2024',
    author: 'Admin',
    views: 203,
  },
]
