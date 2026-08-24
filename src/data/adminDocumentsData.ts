// Ancien jeu de données fictif (n'est plus importé nulle part) : la liste
// admin réelle vient désormais de l'API via services/documents.ts.
export interface AdminDocument {
  id: number
  name: string
  type: string
  size: string
  date: string
  category: string
}

export const adminDocuments: AdminDocument[] = [
  { id: 1, name: 'Rapport annuel 2024.pdf', type: 'PDF', size: '2.4 Mo', date: '15 Mars 2025', category: 'Rapports' },
  { id: 2, name: 'Proposition projet reboisement.docx', type: 'DOCX', size: '1.8 Mo', date: '10 Fév 2025', category: 'Propositions' },
  { id: 3, name: 'Budget prévisionnel 2025.xlsx', type: 'XLSX', size: '856 Ko', date: '20 Jan 2025', category: 'Finances' },
  { id: 4, name: 'Compte-rendu CA Mars.pptx', type: 'PPTX', size: '3.2 Mo', date: '5 Mars 2025', category: 'Réunions' },
  { id: 5, name: 'Convention partenariat PNUD.pdf', type: 'PDF', size: '1.1 Mo', date: '12 Déc 2024', category: 'Conventions' },
  { id: 6, name: 'Plan stratégique 2025-2030.pdf', type: 'PDF', size: '4.5 Mo', date: '1 Jan 2025', category: 'Stratégie' },
  { id: 7, name: 'Rapport mission Guera.docx', type: 'DOCX', size: '2.0 Mo', date: '22 Nov 2024', category: 'Rapports' },
]

export const typeColors: Record<string, string> = {
  PDF: 'bg-red-50 text-red-500',
  DOCX: 'bg-blue-50 text-blue-500',
  XLSX: 'bg-emerald-50 text-emerald-500',
  PPTX: 'bg-orange-50 text-orange-500',
}

export const documentCategories = ['Toutes', 'Rapports', 'Propositions', 'Finances', 'Réunions', 'Conventions', 'Stratégie']
