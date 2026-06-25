import { useState, type FormEvent } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FileText } from 'lucide-react'
import { documentCategories } from '../../data/adminDocumentsData'

const DocumentsForm = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const isEditing = Boolean(id)

  const [name, setName] = useState('')
  const [type, setType] = useState('PDF')
  const [category, setCategory] = useState('')

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    navigate('/admin/documents')
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          {isEditing ? "Modifier le document" : 'Ajouter un document'}
        </h1>
        <p className="text-gray-500 text-small mt-1">
          Tableau de bord &gt; Documents &gt; {isEditing ? 'Modifier' : 'Ajouter'}
        </p>
      </div>

      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        onSubmit={handleSubmit}
        className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 max-w-2xl"
      >
        <div className="space-y-6">
          <div>
            <label className="block text-small font-medium text-gray-700 mb-2">Fichier</label>
            <label className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-gray-200 rounded-xl py-10 cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-colors">
              <div className="w-11 h-11 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
                <FileText size={20} />
              </div>
              <span className="text-gray-500 text-small text-center">
                Cliquez pour uploader<br />ou glissez-déposez un fichier
              </span>
              <span className="text-gray-400 text-xs">PDF, DOCX, XLSX, PPTX - Max 10 Mo</span>
              <input type="file" className="hidden" />
            </label>
          </div>

          <div>
            <label className="block text-small font-medium text-gray-700 mb-2">Nom du document</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex : Rapport annuel 2024"
              className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-small focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-small font-medium text-gray-700 mb-2">Type de fichier</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-small text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition cursor-pointer"
              >
                <option value="PDF">PDF</option>
                <option value="DOCX">DOCX</option>
                <option value="XLSX">XLSX</option>
                <option value="PPTX">PPTX</option>
              </select>
            </div>
            <div>
              <label className="block text-small font-medium text-gray-700 mb-2">Catégorie</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-small text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition cursor-pointer"
              >
                <option value="">Sélectionnez une catégorie</option>
                {documentCategories.filter((c) => c !== 'Toutes').map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 mt-8 pt-6 border-t border-gray-100">
          <button
            type="button"
            onClick={() => navigate('/admin/documents')}
            className="px-5 py-2.5 rounded-lg text-gray-600 font-medium text-small border border-gray-200 hover:bg-gray-50 transition-colors"
          >
            Annuler
          </button>
          <button
            type="submit"
            className="px-6 py-2.5 rounded-lg bg-primary text-white font-medium text-small hover:bg-primary-dark transition-colors"
          >
            Enregistrer
          </button>
        </div>
      </motion.form>
    </div>
  )
}

export default DocumentsForm
