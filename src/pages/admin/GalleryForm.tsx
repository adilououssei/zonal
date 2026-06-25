import { useState, type FormEvent } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Image as ImageIcon, Calendar } from 'lucide-react'
import { galleryCategories } from '../../data/adminGalleryData'

const GalleryForm = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const isEditing = Boolean(id)

  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [title, setTitle] = useState('')
  const [date, setDate] = useState('')
  const [category, setCategory] = useState('')

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) setImagePreview(URL.createObjectURL(file))
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    navigate('/admin/gallery')
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          {isEditing ? "Modifier l'image" : 'Ajouter une image'}
        </h1>
        <p className="text-gray-500 text-small mt-1">
          Tableau de bord &gt; Galerie &gt; {isEditing ? 'Modifier' : 'Ajouter'}
        </p>
      </div>

      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        onSubmit={handleSubmit}
        className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div>
              <label className="block text-small font-medium text-gray-700 mb-2">Image</label>
              <label className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-gray-200 rounded-xl py-16 cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-colors overflow-hidden">
                {imagePreview ? (
                  <img src={imagePreview} alt="Aperçu" className="w-full h-48 object-cover rounded-lg" />
                ) : (
                  <>
                    <div className="w-11 h-11 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
                      <ImageIcon size={20} />
                    </div>
                    <span className="text-gray-500 text-small text-center">
                      Cliquez pour uploader<br />ou glissez-déposez une image
                    </span>
                  </>
                )}
                <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
              </label>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-small font-medium text-gray-700 mb-2">Titre</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ex : Reboisement Guera"
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-small focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
              />
            </div>
            <div>
              <label className="block text-small font-medium text-gray-700 mb-2">Date</label>
              <div className="relative">
                <input
                  type="text"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  placeholder="jj/mm/aaaa"
                  className="w-full px-4 py-2.5 pr-10 rounded-lg border border-gray-200 text-small focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
                />
                <Calendar size={16} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
            </div>
            <div>
              <label className="block text-small font-medium text-gray-700 mb-2">Catégorie</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-small text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition cursor-pointer"
              >
                <option value="">Sélectionnez une catégorie</option>
                {galleryCategories.filter((c) => c !== 'Toutes').map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 mt-8 pt-6 border-t border-gray-100">
          <button
            type="button"
            onClick={() => navigate('/admin/gallery')}
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

export default GalleryForm
