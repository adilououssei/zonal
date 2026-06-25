import { useState, useEffect, useRef, type FormEvent } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Image as ImageIcon, MapPin, Coins, Loader2 } from 'lucide-react'
import { statusLabelMap } from '../../data/adminProjectsData'
import { api } from '../../services/api'
import { projectsService } from '../../services/projects'

const ProjectsForm = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const isEditing = Boolean(id)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(isEditing)
  const [uploading, setUploading] = useState(false)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [image, setImage] = useState('')
  const [location, setLocation] = useState('')
  const [budget, setBudget] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [status, setStatus] = useState('ongoing')

  useEffect(() => {
    if (!id) return
    const fetchProject = async () => {
      try {
        const project = await projectsService.getById(Number(id))
        setTitle(project.title)
        setDescription(project.description ?? '')
        setImage(project.image ?? '')
        setLocation(project.location)
        setBudget(project.budget ?? '')
        setStartDate(project.startDate ?? '')
        setEndDate(project.endDate ?? '')
        setStatus(project.status)
      } catch {
        console.error('Erreur lors du chargement du projet')
        navigate('/admin/projects')
      } finally {
        setFetching(false)
      }
    }
    fetchProject()
  }, [id, navigate])

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      const result = await api.upload<{ url: string }>('/api/upload', formData)
      setImage(result.url)
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
        title,
        description: description || undefined,
        image: image || undefined,
        location,
        budget: budget || undefined,
        startDate: startDate || undefined,
        endDate: endDate || undefined,
        status,
      }

      if (isEditing && id) {
        await projectsService.update(Number(id), payload)
      } else {
        await projectsService.create(payload as {
          title: string
          description?: string
          image?: string
          location: string
          budget?: string
          startDate?: string
          endDate?: string
          status?: string
        })
      }
      navigate('/admin/projects')
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
        <h1 className="text-2xl font-bold text-gray-900">
          {isEditing ? 'Modifier le projet' : 'Ajouter un projet'}
        </h1>
        <p className="text-gray-500 text-small mt-1">
          Tableau de bord &gt; Projets &gt; {isEditing ? 'Modifier' : 'Ajouter'}
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
              <label className="block text-small font-medium text-gray-700 mb-2">Image du projet</label>
              {image ? (
                <div className="relative rounded-xl overflow-hidden mb-2">
                  <img src={image} alt="Aperçu" className="w-full h-48 object-cover" />
                  <button
                    type="button"
                    onClick={() => { setImage(''); if (fileInputRef.current) fileInputRef.current.value = '' }}
                    className="absolute top-2 right-2 w-8 h-8 bg-white/80 rounded-full flex items-center justify-center text-gray-600 hover:text-red transition-colors text-lg"
                  >
                    &times;
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-gray-200 rounded-xl py-12 cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-colors overflow-hidden">
                  {uploading ? (
                    <Loader2 size={24} className="animate-spin text-primary" />
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
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageChange}
                    disabled={uploading}
                  />
                </label>
              )}
            </div>
            <div>
              <label className="block text-small font-medium text-gray-700 mb-2">Titre du projet</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ex : Projet de reboisement du Guera"
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-small focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
                required
              />
            </div>
            <div>
              <label className="block text-small font-medium text-gray-700 mb-2">Description</label>
              <textarea
                rows={5}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Décrivez le projet..."
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-small focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition resize-none"
              />
            </div>
            <div>
              <label className="block text-small font-medium text-gray-700 mb-2">Lieu</label>
              <div className="relative">
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Ex : N'Djamena, Tchad"
                  className="w-full px-4 py-2.5 pr-10 rounded-lg border border-gray-200 text-small focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
                  required
                />
                <MapPin size={16} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-small font-medium text-gray-700 mb-2">Budget</label>
              <div className="relative">
                <input
                  type="text"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  placeholder="Ex : 25 000 000 F CFA"
                  className="w-full px-4 py-2.5 pr-10 rounded-lg border border-gray-200 text-small focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
                />
                <Coins size={16} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
            </div>
            <div>
              <label className="block text-small font-medium text-gray-700 mb-2">Date de début</label>
              <div className="relative">
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-small focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
                />
              </div>
            </div>
            <div>
              <label className="block text-small font-medium text-gray-700 mb-2">Date de fin</label>
              <div className="relative">
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-small focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
                />
              </div>
            </div>
            <div>
              <label className="block text-small font-medium text-gray-700 mb-2">Statut</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-small text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition cursor-pointer"
              >
                {Object.entries(statusLabelMap).map(([key, label]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 mt-8 pt-6 border-t border-gray-100">
          <button
            type="button"
            onClick={() => navigate('/admin/projects')}
            className="px-5 py-2.5 rounded-lg text-gray-600 font-medium text-small border border-gray-200 hover:bg-gray-50 transition-colors"
          >
            Annuler
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2.5 rounded-lg bg-primary text-white font-medium text-small hover:bg-primary-dark transition-colors disabled:opacity-50"
          >
            {loading ? 'Enregistrement...' : 'Enregistrer'}
          </button>
        </div>
      </motion.form>
    </div>
  )
}

export default ProjectsForm
