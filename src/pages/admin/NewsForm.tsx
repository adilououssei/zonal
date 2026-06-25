import { useState, type FormEvent } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Image as ImageIcon, Bold, Italic, Underline, Link2, List, ListOrdered,
  AlignLeft, Quote, Plus, Calendar, Eye
} from 'lucide-react'

const NewsForm = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const isEditing = Boolean(id)

  const [coverPreview, setCoverPreview] = useState<string | null>(null)
  const [title, setTitle] = useState('')
  const [excerpt, setExcerpt] = useState('')
  const [content, setContent] = useState('')
  const [category, setCategory] = useState('')
  const [date, setDate] = useState('')
  const [author, setAuthor] = useState('')
  const [gallery, setGallery] = useState<string[]>([])

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) setCoverPreview(URL.createObjectURL(file))
  }

  const handleGalleryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return
    const urls = Array.from(files).map((f) => URL.createObjectURL(f))
    setGallery((prev) => [...prev, ...urls])
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    // À connecter à l'API backend
    navigate('/admin/news')
  }

  const toolbarButtons = [Bold, Italic, Underline, Link2, List, ListOrdered, AlignLeft, Quote]

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          {isEditing ? "Modifier l'article" : 'Ajouter un article'}
        </h1>
        <p className="text-gray-500 text-small mt-1">
          Tableau de bord &gt; Actualités &gt; {isEditing ? 'Modifier' : 'Ajouter'}
        </p>
      </div>

      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        onSubmit={handleSubmit}
        className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Colonne gauche */}
          <div className="space-y-6">
            <div>
              <label className="block text-small font-medium text-gray-700 mb-2">Image de couverture</label>
              <label className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-gray-200 rounded-xl py-10 cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-colors overflow-hidden">
                {coverPreview ? (
                  <img src={coverPreview} alt="Aperçu" className="w-full h-40 object-cover rounded-lg" />
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
                <input type="file" accept="image/*" className="hidden" onChange={handleCoverChange} />
              </label>
            </div>

            <div>
              <label className="block text-small font-medium text-gray-700 mb-2">Titre de l'article</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ex : Lancement d'un nouveau projet de reboisement"
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-small focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
              />
            </div>

            <div>
              <label className="block text-small font-medium text-gray-700 mb-2">Extrait</label>
              <textarea
                rows={3}
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                placeholder="Petit résumé de l'article..."
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-small focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition resize-none"
              />
            </div>

            <div>
              <label className="block text-small font-medium text-gray-700 mb-2">Contenu</label>
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <div className="flex items-center gap-1 px-2 py-1.5 border-b border-gray-100 bg-gray-50/60">
                  {toolbarButtons.map((Icon, i) => (
                    <button
                      key={i}
                      type="button"
                      className="w-7 h-7 flex items-center justify-center rounded text-gray-500 hover:bg-gray-200 transition-colors"
                    >
                      <Icon size={14} />
                    </button>
                  ))}
                </div>
                <textarea
                  rows={8}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Rédigez le contenu de l'article..."
                  className="w-full px-4 py-3 text-small focus:outline-none resize-none"
                />
              </div>
            </div>
          </div>

          {/* Colonne droite */}
          <div className="space-y-6">
            <div>
              <label className="block text-small font-medium text-gray-700 mb-2">Catégorie</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-small text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition cursor-pointer"
              >
                <option value="">Sélectionnez une catégorie</option>
                <option value="Environnement">Environnement</option>
                <option value="Éducation">Éducation</option>
                <option value="Eau & Assainissement">Eau & Assainissement</option>
                <option value="Gestion des catastrophes">Gestion des catastrophes</option>
                <option value="Développement rural">Développement rural</option>
                <option value="Gouvernance locale">Gouvernance locale</option>
              </select>
            </div>

            <div>
              <label className="block text-small font-medium text-gray-700 mb-2">Date de publication</label>
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
              <label className="block text-small font-medium text-gray-700 mb-2">Auteur</label>
              <input
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="Nom de l'auteur"
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-small focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
              />
            </div>

            <div>
              <label className="block text-small font-medium text-gray-700 mb-2">Galerie photos</label>
              <label className="flex items-center justify-center gap-2 border-2 border-dashed border-gray-200 rounded-xl py-6 cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-colors text-primary font-medium text-small">
                <Plus size={16} />
                Ajouter des images
                <input type="file" accept="image/*" multiple className="hidden" onChange={handleGalleryChange} />
              </label>
              {gallery.length > 0 && (
                <div className="grid grid-cols-4 gap-2 mt-3">
                  {gallery.map((src, i) => (
                    <img key={i} src={src} alt={`Galerie ${i + 1}`} className="w-full aspect-square object-cover rounded-lg" />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 mt-8 pt-6 border-t border-gray-100">
          <button
            type="button"
            onClick={() => navigate('/admin/news')}
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

export default NewsForm
