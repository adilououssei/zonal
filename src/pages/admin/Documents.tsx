import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { FileText, Plus, Download, Trash2, FileType, Search, ChevronDown } from 'lucide-react'
import { documentsService, formatFileSize } from '../../services/documents'
import type { AdminDocument } from '../../services/documents'

const typeColors: Record<string, string> = {
  PDF: 'bg-red-50 text-red-500',
  DOCX: 'bg-blue-50 text-blue-500',
  XLSX: 'bg-emerald-50 text-emerald-500',
  PPTX: 'bg-orange-50 text-orange-500',
}

const typeOptions = ['Tous', 'PDF', 'DOCX', 'XLSX', 'PPTX']

// Liste admin des documents téléchargeables : recherche, filtre par type de fichier.
const Documents = () => {
  const { t, i18n } = useTranslation()
  const [documents, setDocuments] = useState<AdminDocument[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [typeFilter, setTypeFilter] = useState('Tous')

  useEffect(() => {
    const loadDocuments = async () => {
      try {
        setLoading(true)
        const data = await documentsService.getAll()
        setDocuments(data)
      } catch {
        console.error('Erreur lors du chargement')
      } finally {
        setLoading(false)
      }
    }

    void loadDocuments()
  }, [i18n.language])

  const handleDelete = async (id: number) => {
    if (!confirm(t('admin.confirm.deleteItem'))) return
    try {
      await documentsService.delete(id)
      setDocuments((prev) => prev.filter((d) => d.id !== id))
    } catch {
      console.error('Erreur lors de la suppression')
    }
  }

  const formatDate = (d: string | null) => {
    if (!d) return '—'
    return new Date(d + 'T00:00:00').toLocaleDateString(i18n.language === 'en' ? 'en-US' : 'fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })
  }

  const filtered = documents.filter((doc) => {
    const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesType = typeFilter === 'Tous' || doc.type === typeFilter
    return matchesSearch && matchesType
  })

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t('admin.sidebar.documents')}</h1>
          <p className="text-gray-500 text-small mt-1">{t('admin.pages.documents')}</p>
        </div>
        <Link to="/admin/documents/new" className="inline-flex items-center gap-2 bg-primary text-white px-4 py-2.5 rounded-lg font-medium text-small hover:bg-primary-dark transition-colors">
          <Plus size={18} />
          {t('admin.actions.addDocument')}
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder={t('admin.placeholders.searchDocument')} className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 text-small focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition" />
        </div>
        <div className="relative">
          <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className="appearance-none pl-4 pr-9 py-2.5 rounded-lg border border-gray-200 text-small text-gray-600 focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer">
            {typeOptions.map((option) => (
              <option key={option} value={option}>
                {option === 'Tous' ? t('admin.filters.typeAll') : option}
              </option>
            ))}
          </select>
          <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
        </div>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/50">
                  <th className="text-left px-5 py-3.5 text-gray-600 text-xs font-semibold tracking-wider">{t('admin.table.name')}</th>
                  <th className="text-left px-5 py-3.5 text-gray-600 text-xs font-semibold tracking-wider">{t('admin.table.type')}</th>
                  <th className="text-left px-5 py-3.5 text-gray-600 text-xs font-semibold tracking-wider">{t('admin.table.size')}</th>
                  <th className="text-left px-5 py-3.5 text-gray-600 text-xs font-semibold tracking-wider">{t('admin.table.date')}</th>
                  <th className="text-right px-5 py-3.5 text-gray-600 text-xs font-semibold tracking-wider">{t('admin.table.actions')}</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length > 0 ? (
                  filtered.map((doc, i) => (
                    <tr key={doc.id} className={`border-b border-gray-50 ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'}`}>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${typeColors[doc.type] || 'bg-gray-50 text-gray-500'}`}>
                            <FileText size={16} />
                          </div>
                          <span className="text-gray-800 text-small font-medium">{doc.name}</span>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <span className={`inline-block px-2.5 py-1 rounded-full text-[11px] font-semibold ${typeColors[doc.type] || 'bg-gray-100 text-gray-500'}`}>
                          <FileType size={12} className="inline mr-1" />
                          {doc.type}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-gray-600 text-small">{formatFileSize(doc.size)}</td>
                      <td className="px-5 py-4 text-gray-600 text-small">{formatDate(doc.date)}</td>
                      <td className="px-5 py-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <a
                            href={doc.file}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-primary hover:bg-primary/10 transition-colors"
                            title={t('admin.actions.download')}
                          >
                            <Download size={15} />
                          </a>
                          <Link to={`/admin/documents/${doc.id}/edit`} className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-primary hover:bg-primary/10 transition-colors" title={t('admin.actions.edit')}>
                            <FileText size={15} />
                          </Link>
                          <button
                            onClick={() => handleDelete(doc.id)}
                            className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-red hover:bg-red/10 transition-colors"
                            title={t('admin.actions.delete')}
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan={5} className="px-5 py-10 text-center text-gray-400 text-small">{t('admin.empty.noDocuments')}</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>
    </div>
  )
}

export default Documents
