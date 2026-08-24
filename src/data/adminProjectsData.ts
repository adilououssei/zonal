// Seuls statusLabelMap et statusColorMap sont encore utilisés (par
// pages/admin/Projects.tsx et ProjectsForm.tsx) pour l'affichage des statuts.
// Le tableau `adminProjects` ci-dessous est un ancien jeu de données fictif
// laissé pour référence : les projets réels viennent maintenant de l'API
// (voir services/projects.ts), pas de ce fichier.
export interface AdminProject {
  id: number
  title: string
  location: string
  budget: string
  status: 'ongoing' | 'completed' | 'planned'
  startDate: string
  endDate: string
  description: string
}

export const adminProjects: AdminProject[] = [
  { id: 1, title: 'Projet de reboisement du Guera', location: 'Guera', budget: '25 000 000 F CFA', status: 'ongoing', startDate: 'Jan 2024', endDate: 'Déc 2025', description: 'Reforestation de 500 hectares dans la région du Guera.' },
  { id: 2, title: "Accès à l'eau potable", location: 'Abéché', budget: '15 000 000 F CFA', status: 'ongoing', startDate: 'Mar 2024', endDate: 'Juin 2025', description: 'Construction de 10 puits et systèmes de filtration.' },
  { id: 3, title: 'Formation des jeunes en gouvernance', location: "N'Djamena", budget: '8 000 000 F CFA', status: 'completed', startDate: 'Fév 2023', endDate: 'Fév 2024', description: 'Programme de formation pour 200 jeunes sur la gouvernance locale.' },
  { id: 4, title: 'Campagne agricole durable', location: 'Mayo-Kebbi', budget: '12 000 000 F CFA', status: 'ongoing', startDate: 'Mai 2024', endDate: 'Août 2025', description: 'Soutien aux agriculteurs locaux avec des techniques durables.' },
  { id: 5, title: 'Sensibilisation environnementale', location: 'Logone', budget: '5 000 000 F CFA', status: 'planned', startDate: 'Sep 2025', endDate: 'Déc 2025', description: 'Campagne de sensibilisation sur la protection de l\'environnement.' },
]

export const statusLabelMap: Record<string, string> = {
  ongoing: 'En cours',
  completed: 'Terminé',
  planned: 'Planifié',
}

export const statusColorMap: Record<string, string> = {
  ongoing: 'bg-emerald-100 text-emerald-700',
  completed: 'bg-gray-100 text-gray-500',
  planned: 'bg-blue-100 text-blue-700',
}
