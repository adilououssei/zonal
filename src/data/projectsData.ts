// Ancien jeu de données fictif (n'est plus importé nulle part) : les projets
// réels viennent désormais de l'API via services/projects.ts (publicProjectsService).
export interface PublicProject {
  id: number
  title: string
  description: string
  image: string
  location: string
  status: 'ongoing' | 'completed' | 'planned'
  budget: string
  period: string
}

export const publicProjects: PublicProject[] = [
  {
    id: 1,
    title: 'Projet de reboisement du Guera',
    description: 'Plantation de 50 000 arbres et restauration de 500 hectares de terres dégradées dans la région du Guera. Ce projet vise à lutter contre la désertification et à améliorer les conditions de vie des communautés locales.',
    image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&h=500&fit=crop',
    location: 'Guera',
    status: 'ongoing',
    budget: '25 000 000 F CFA',
    period: 'Jan 2024 - Déc 2025',
  },
  {
    id: 2,
    title: "Accès à l'eau potable",
    description: 'Construction de 15 puits et installation de systèmes de filtration dans les communautés rurales de la région d\'Abéché, permettant à plus de 10 000 personnes d\'avoir accès à une eau potable et salubre.',
    image: 'https://images.unsplash.com/photo-1543168256-4183f1f5aab1?w=800&h=500&fit=crop',
    location: 'Abéché',
    status: 'ongoing',
    budget: '15 000 000 F CFA',
    period: 'Mar 2024 - Juin 2025',
  },
  {
    id: 3,
    title: 'Formation des jeunes en gouvernance',
    description: 'Programme de formation de 200 jeunes sur le leadership, la gouvernance locale et l\'engagement citoyen. Les participants bénéficient d\'un accompagnement pour mettre en œuvre des initiatives communautaires.',
    image: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&h=500&fit=crop',
    location: "N'Djamena",
    status: 'completed',
    budget: '8 000 000 F CFA',
    period: 'Fév 2023 - Fév 2024',
  },
  {
    id: 4,
    title: 'Campagne agricole durable',
    description: 'Soutien à 500 agriculteurs locaux avec des techniques agricoles durables, des semences améliorées et un accès au microcrédit pour améliorer la sécurité alimentaire dans la région du Mayo-Kebbi.',
    image: 'https://images.unsplash.com/photo-1560493676-04071c5f467b?w=800&h=500&fit=crop',
    location: 'Mayo-Kebbi',
    status: 'ongoing',
    budget: '12 000 000 F CFA',
    period: 'Mai 2024 - Août 2025',
  },
  {
    id: 5,
    title: 'Sensibilisation environnementale',
    description: 'Campagne de sensibilisation dans 30 écoles et 15 villages sur la protection de l\'environnement, la gestion des déchets et les gestes éco-responsables.',
    image: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=800&h=500&fit=crop',
    location: 'Logone',
    status: 'planned',
    budget: '5 000 000 F CFA',
    period: 'Sep 2025 - Déc 2025',
  },
  {
    id: 6,
    title: 'Appui à l\'éducation scolaire',
    description: 'Distribution de kits scolaires, construction de 3 salles de classe et formation de 60 enseignants pour améliorer la qualité de l\'éducation dans les zones rurales.',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=500&fit=crop',
    location: "N'Djamena",
    status: 'ongoing',
    budget: '10 000 000 F CFA',
    period: 'Oct 2024 - Sep 2025',
  },
]

export const projectStatusLabels: Record<string, string> = {
  ongoing: 'En cours',
  completed: 'Terminé',
  planned: 'Planifié',
}

export const projectStatusColors: Record<string, string> = {
  ongoing: 'bg-emerald-100 text-emerald-700',
  completed: 'bg-gray-100 text-gray-500',
  planned: 'bg-blue-100 text-blue-700',
}
