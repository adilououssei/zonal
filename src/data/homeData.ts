// Ancien jeu de données fictif (n'est plus importé nulle part) : la page
// d'accueil calcule désormais ses statistiques et domaines directement dans
// Home.tsx (en partie depuis l'API, en partie via i18n).
export const homeStats = [
  { value: 15, suffix: '+', label: "Années d'expérience" },
  { value: 120, suffix: '+', label: 'Projets réalisés' },
  { value: 45, suffix: '+', label: 'Partenaires' },
  { value: 18, label: 'Régions couvertes' },
  { value: 350, suffix: '+', label: 'Bénéficiaires' },
]

export const domains = [
  {
    icon: 'Users',
    title: 'Gouvernance locale',
    description: 'Promouvoir la participation citoyenne, la transparence et la bonne gouvernance au niveau local.',
    points: [
      'Renforcement des capacités des collectivités',
      'Appui à la décentralisation',
      'Promotion de la paix et de la cohésion sociale',
    ],
  },
  {
    icon: 'Leaf',
    title: 'Environnement & Climat',
    description: "Protéger l'environnement, lutter contre la déforestation et promouvoir l'adaptation aux changements climatiques.",
    points: [
      'Gestion durable des ressources naturelles',
      'Protection de la biodiversité',
      'Éducation environnementale',
    ],
  },
  {
    icon: 'TreePine',
    title: 'Développement rural',
    description: 'Accompagner les communautés rurales dans l\'amélioration de leurs conditions de vie et de leurs moyens de subsistance.',
    points: [
      "Appui à l'agriculture durable",
      "Accès à l'eau et à l'assainissement",
      'Appui aux initiatives économiques locales',
    ],
  },
  {
    icon: 'ShieldCheck',
    title: 'Gestion des catastrophes',
    description: 'Renforcer la résilience des communautés face aux risques naturels et aux crises.',
    points: [
      'Prévention et réduction des risques',
      'Alerte précoce et préparation',
      'Réponse humanitaire et relèvement',
    ],
  },
  {
    icon: 'GraduationCap',
    title: 'Éducation & Sensibilisation',
    description: "Promouvoir l'éducation, la formation et la sensibilisation pour un changement durable des comportements.",
    points: [
      'Éducation des jeunes et des adultes',
      'Sensibilisation communautaire',
      'Renforcement des capacités locales',
    ],
  },
  {
    icon: 'Droplets',
    title: 'Eau & Assainissement',
    description: "Améliorer l'accès à l'eau potable et promouvoir l'hygiène et l'assainissement pour tous.",
    points: [
      "Construction de points d'eau",
      "Promotion de l'hygiène",
      'Assainissement des communautés',
    ],
  },
]

export const achievements = [
  {
    title: 'Projet de reboisement',
    description: 'Plantation de 50 000 arbres dans la région du Guera',
    image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=600&h=400&fit=crop',
  },
  {
    title: 'Formation des jeunes',
    description: 'Formation de 200 jeunes en leadership et gouvernance',
    image: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=600&h=400&fit=crop',
  },
  {
    title: "Accès à l'eau potable",
    description: 'Construction de 15 puits dans les communautés rurales',
    image: 'https://images.unsplash.com/photo-1543168256-4183f1f5aab1?w=600&h=400&fit=crop',
  },
]

export const upcomingEvents = [
  {
    day: '05',
    month: 'JUIN',
    status: 'À venir',
    title: 'Journée mondiale de l\'environnement',
    location: "N'Djamena, Tchad",
    image: 'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?w=600&h=400&fit=crop',
  },
  {
    day: '12',
    month: 'JUIN',
    status: 'À venir',
    title: 'Atelier sur la gouvernance locale',
    location: "N'Djamena, Tchad",
    image: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?w=600&h=400&fit=crop',
  },
  {
    day: '20',
    month: 'JUIN',
    status: 'À venir',
    title: 'Campagne de reboisement',
    location: 'Abéché, Tchad',
    image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=600&h=400&fit=crop',
  },
]