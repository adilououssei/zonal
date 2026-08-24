import { useState, useEffect, useRef, type FormEvent } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { Mail, Phone, Image as ImageIcon, Loader2 } from 'lucide-react'
import { api } from '../../services/api'
import { partnersService } from '../../services/partners'

// Formulaire de création/édition d'un partenaire (logo uploadé via UploadController).
const PartnersForm = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { id } = useParams()
  const isEditing = Boolean(id)

  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(isEditing)
  const [uploading, setUploading] = useState(false)
  const [name, setName] = useState('')
  const [domain, setDomain] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [logo, setLogo] = useState('')
  const [status, setStatus] = useState('active')
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!id) return
    const fetchPartner = async () => {
      try {
        const partner = await partnersService.getById(Number(id))
        setName(partner.name)
        setDomain(partner.domain ?? '')
        setEmail(partner.email ?? '')
        setPhone(partner.phone ?? '')
        setLogo(partner.logo ?? '')
        setStatus(partner.status)
      } catch {
        console.error('Erreur lors du chargement')
        navigate('/admin/partners')
      } finally {
        setFetching(false)
      }
    }
    fetchPartner()
  }, [id, navigate])

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      const result = await api.upload<{ url: string }>('/api/upload', formData)
      setLogo(result.url)
    } catch {
      console.error('Erreur lors de l\'upload du logo')
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
        domain: domain || undefined,
        email: email || undefined,
        phone: phone || undefined,
        logo: logo || undefined,
        status,
      }

      if (isEditing && id) {
        await partnersService.update(Number(id), payload)
      } else {
        await partnersService.create(payload)
      }
      navigate('/admin/partners')
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
          {isEditing ? t('admin.form.editPartner') : t('admin.form.addPartner')}
        </h1>
        <p className="text-gray-500 text-small mt-1">
          {t('admin.sidebar.dashboard')} &gt; {t('admin.sidebar.partners')} &gt; {isEditing ? t('admin.actions.edit') : t('admin.form.add')}
        </p>
      </div>

      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        onSubmit={handleSubmit}
        className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 max-w-2xl"
      >
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-small font-medium text-gray-700 mb-2">{t('admin.labels.partnerName')}</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t('admin.placeholders.partnerNameEx')}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-small focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
                required
              />
            </div>
            <div>
              <label className="block text-small font-medium text-gray-700 mb-2">{t('admin.table.domain')}</label>
              <input
                type="text"
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                placeholder={t('admin.placeholders.domainEx')}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-small focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-small font-medium text-gray-700 mb-2">{t('admin.table.email')}</label>
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t('admin.placeholders.emailEx')}
                className="w-full px-4 py-2.5 pr-10 rounded-lg border border-gray-200 text-small focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
              />
              <Mail size={16} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
          </div>

          <div>
            <label className="block text-small font-medium text-gray-700 mb-2">{t('admin.labels.phone')}</label>
            <div className="relative">
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder={t('admin.placeholders.phoneEx')}
                className="w-full px-4 py-2.5 pr-10 rounded-lg border border-gray-200 text-small focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
              />
              <Phone size={16} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
          </div>

          <div>
            <label className="block text-small font-medium text-gray-700 mb-2">{t('admin.labels.logo')}</label>
            {logo ? (
              <div className="relative rounded-xl overflow-hidden w-40 h-40">
                <img src={logo} alt="Logo" className="w-full h-full object-contain bg-gray-50" />
                <button
                  type="button"
                  onClick={() => { setLogo(''); if (fileInputRef.current) fileInputRef.current.value = '' }}
                  className="absolute top-1 right-1 w-7 h-7 bg-white/80 rounded-full flex items-center justify-center text-gray-600 hover:text-red transition-colors text-lg"
                >
                  &times;
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-gray-200 rounded-xl w-40 h-40 cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-colors overflow-hidden">
                {uploading ? (
                  <Loader2 size={22} className="animate-spin text-primary" />
                ) : (
                  <>
                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
                      <ImageIcon size={18} />
                    </div>
                    <span className="text-gray-500 text-xs text-center">{t('admin.labels.logo')}</span>
                  </>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                  disabled={uploading}
                />
              </label>
            )}
          </div>

          <div>
            <label className="block text-small font-medium text-gray-700 mb-2">{t('admin.table.status')}</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-small text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition cursor-pointer"
            >
              <option value="active">{t('admin.status.active')}</option>
              <option value="inactive">{t('admin.status.inactive')}</option>
            </select>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 mt-8 pt-6 border-t border-gray-100">
          <button
            type="button"
            onClick={() => navigate('/admin/partners')}
            className="px-5 py-2.5 rounded-lg text-gray-600 font-medium text-small border border-gray-200 hover:bg-gray-50 transition-colors"
          >
            {t('admin.actions.cancel')}
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2.5 rounded-lg bg-primary text-white font-medium text-small hover:bg-primary-dark transition-colors disabled:opacity-50"
          >
            {loading ? t('admin.actions.saving') : t('admin.actions.save')}
          </button>
        </div>
      </motion.form>
    </div>
  )
}

export default PartnersForm
