export interface AdminPartner {
  id: number
  name: string
  domain: string
  contact: string
  status: 'active' | 'inactive'
  logo?: string
}

export const adminPartners: AdminPartner[] = [
  { id: 1, name: 'PNUD', domain: 'Développement', contact: 'contact@pnud.org', status: 'active' },
  { id: 2, name: 'UNICEF', domain: 'Éducation', contact: 'info@unicef.org', status: 'active' },
  { id: 3, name: 'UE', domain: 'Financement', contact: 'partnerships@eu.int', status: 'active' },
  { id: 4, name: "Ministère de l'Environnement", domain: 'Gouvernement', contact: 'contact@environnement.td', status: 'inactive' },
  { id: 5, name: 'OXFAM', domain: 'Humanitaire', contact: 'info@oxfam.org', status: 'active' },
  { id: 6, name: 'UNESCO', domain: 'Éducation', contact: 'info@unesco.org', status: 'active' },
  { id: 7, name: 'FEM', domain: 'Environnement', contact: 'partnerships@fem.int', status: 'inactive' },
]

export const partnerStatusColorMap: Record<string, string> = {
  active: 'bg-emerald-100 text-emerald-700',
  inactive: 'bg-gray-100 text-gray-500',
}
