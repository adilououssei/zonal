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

// Photos de l'équipe (public/images/equipes). `focus` = point du visage dans
// l'image (utilisé comme object-position et origine du zoom) et `zoom` =
// grossissement pour que le visage remplisse le cercle. Noms et rôles sont
// dans i18n (about.teamMembers.<key>).
export const teamMembers = [
  { key: 'houssoube', image: '/images/equipes/tof1.jpeg', focus: '49% 8%', zoom: 1.15 },
  { key: 'yanne', image: '/images/equipes/tof4.jpeg', focus: '45% 8%', zoom: 1.15 },
  { key: 'bachirou', image: '/images/equipes/tof3.jpeg', focus: '48% 100%', zoom: 0.9 },
  { key: 'laoukoura', image: '/images/equipes/tof2.jpeg', focus: '51% 5%', zoom: 1.1 },
  { key: 'nenbara', image: '/images/equipes/tof5.jpeg', focus: '55% 45%', zoom: 1.05 },
  { key: 'bedin', image: '/images/equipes/tof6.jpeg', focus: '55% 0%', zoom: 1.5 },
]
