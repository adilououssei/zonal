import { useState, useEffect, useRef, type FormEvent } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { FileText, Loader2 } from 'lucide-react'
import { api } from '../../services/api'
import { documentsService, getFileTypeFromMime } from '../../services/documents'
import CategorySelect from '../../components/ui/CategorySelect'

// Formulaire de création/édition d'un document. Le type de fichier (PDF,
// DOCX...) est déduit automatiquement du type MIME au moment de l'upload
// (getFileTypeFromMime), pas saisi manuellement.
const DocumentsForm = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { id } = useParams()
  const isEditing = Boolean(id)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(isEditing)
  const [uploading, setUploading] = useState(false)
  const [name, setName] = useState('')
  const [type, setType] = useState('PDF')
  const [file, setFile] = useState('')
  const [category, setCategory] = useState('')
  const [uploadedFileName, setUploadedFileName] = useState('')

  useEffect(() => {
    if (!id) return
    const fetchDocument = async () => {
      try {
        const doc = await documentsService.getById(Number(id))
        setName(doc.name)
        setType(doc.type)
        setFile(doc.file)
        setCategory(doc.category ?? '')
        setUploadedFileName(doc.file.split('/').pop() ?? '')
      } catch {
        console.error('Erreur lors du chargement')
        navigate('/admin/documents')
      } finally {
        setFetching(false)
      }
    }
    fetchDocument()
  }, [id, navigate])

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]
    if (!f) return

    setUploading(true)
    try {
      const fd = new FormData()
      fd.append('file', f)
      const result = await api.upload<{ url: string }>('/api/upload', fd)
      setFile(result.url)
      setUploadedFileName(f.name)

      const detectedType = getFileTypeFromMime(f.type)
      setType(detectedType)

      if (!name) {
        setName(f.name.replace(/\.[^/.]+$/, ''))
      }
    } catch {
      console.error('Erreur lors de l\'upload')
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const payload = {
        name,
        type,
        file,
        category: category || undefined,
      }

      if (isEditing && id) {
        await documentsService.update(Number(id), payload)
      } else {
        await documentsService.create(payload)
      }
      navigate('/admin/documents')
    } catch {
      console.error('Erreur lors de l\'enregistrement')
    } finally {
      setLoading(false)
    }
  }

  if (fetching) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    )
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">{isEditing ? t('admin.form.editDocument') : t('admin.form.addDocument')}</h1>
        <p className="text-gray-500 text-small mt-1">{t('admin.sidebar.dashboard')} &gt; {t('admin.sidebar.documents')} &gt; {isEditing ? t('admin.actions.edit') : t('admin.form.add')}</p>
      </div>

      <motion.form initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 max-w-2xl">
        <div className="space-y-6">
          <div>
            <label className="block text-small font-medium text-gray-700 mb-2">{t('admin.labels.file')}</label>
            {file ? (
              <div className="flex items-center gap-3 px-4 py-3 rounded-lg border border-gray-200 bg-gray-50">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
                  <FileText size={18} />
                </div>
                <span className="text-small text-gray-700 truncate flex-1">{uploadedFileName || file.split('/').pop()}</span>
                <button type="button" onClick={() => { setFile(''); setUploadedFileName(''); if (fileInputRef.current) fileInputRef.current.value = '' }} className="text-small text-red hover:text-red/80 transition-colors">{t('admin.actions.remove')}</button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-gray-200 rounded-xl py-10 cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-colors overflow-hidden">
                {uploading ? (
                  <>
                    <Loader2 size={24} className="animate-spin text-primary" />
                    <span className="text-gray-500 text-small">{t('admin.labels.uploading')}</span>
                  </>
                ) : (
                  <>
                    <div className="w-11 h-11 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
                      <FileText size={20} />
                    </div>
                    <span className="text-gray-500 text-small text-center">{t('admin.labels.clickToUpload')}<br />{t('admin.labels.dragDropFile')}</span>
                    <span className="text-gray-400 text-xs">{t('admin.labels.maxFileSize')}</span>
                  </>
                )}
                <input ref={fileInputRef} type="file" accept=".pdf,.docx,.xlsx,.pptx" className="hidden" onChange={handleFileUpload} disabled={uploading} />
              </label>
            )}
          </div>

          <div>
            <label className="block text-small font-medium text-gray-700 mb-2">{t('admin.labels.documentName')}</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder={t('admin.placeholders.documentNameEx')} className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-small focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition" required />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-small font-medium text-gray-700 mb-2">{t('admin.labels.fileType')}</label>
              <select value={type} onChange={(e) => setType(e.target.value)} className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-small text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition cursor-pointer">
                <option value="PDF">PDF</option>
                <option value="DOCX">DOCX</option>
                <option value="XLSX">XLSX</option>
                <option value="PPTX">PPTX</option>
              </select>
            </div>
            <CategorySelect
              value={category}
              onChange={setCategory}
              options={['Rapports', 'Propositions', 'Finances', 'Réunions', 'Conventions', 'Stratégie']}
              optionKey={(cat) => `admin.documents.categories.${cat.toLowerCase()}`}
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 mt-8 pt-6 border-t border-gray-100">
          <button type="button" onClick={() => navigate('/admin/documents')} className="px-5 py-2.5 rounded-lg text-gray-600 font-medium text-small border border-gray-200 hover:bg-gray-50 transition-colors">{t('admin.actions.cancel')}</button>
          <button type="submit" disabled={loading || uploading || !file} className="px-6 py-2.5 rounded-lg bg-primary text-white font-medium text-small hover:bg-primary-dark transition-colors disabled:opacity-50">{loading ? t('admin.actions.saving') : t('admin.actions.save')}</button>
        </div>
      </motion.form>
    </div>
  )
}

export default DocumentsForm
