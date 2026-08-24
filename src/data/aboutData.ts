// Données statiques de la page "À propos". Seul `teamMembers` (photos + ordre)
// est encore utilisé par About.tsx, qui associe chaque membre à ses
// traductions via i18n. `aboutStats` n'est plus utilisé : la page calcule
// désormais ses statistiques dynamiquement à partir de l'API (voir dynamicStats
// dans About.tsx).
export const aboutStats = [
  { value: 15, suffix: '+', label: "Années d'expérience", icon: 'Award' },
  { value: 120, suffix: '+', label: 'Projets réalisés', icon: 'Leaf' },
  { value: 350, suffix: '+', label: 'Bénéficiaires', icon: 'Users' },
  { value: 45, suffix: '+', label: 'Partenaires', icon: 'Handshake' },
  { value: 18, label: 'Régions couvertes', icon: 'MapPin' },
]

export const teamMembers = [
  {
    name: 'Mahamat Ali',
    role: 'Directeur Exécutif',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=500&fit=crop',
  },
  {
    name: 'Fatimé Hassana',
    role: 'Responsable Programmes',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=500&fit=crop',
  },
  {
    name: 'Abakar Moussa',
    role: 'Responsable Environnement & Climat',
    image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=500&fit=crop',
  },
  {
    name: 'Aïssatou Mbodou',
    role: 'Responsable Suivi & Évaluation',
    image: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400&h=500&fit=crop',
  },
]