import { useState, useEffect, useRef, type ElementType, type FormEvent } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { Info, Mail, Phone, MapPin, MessageCircle, Upload, Loader2 } from 'lucide-react'
import { settingsService } from '../../services/settings'
import { api } from '../../services/api'
import type { SettingsData } from '../../services/settings'

// Page "Paramètres" (réservée au super administrateur). IMPORTANT : le
// backend (entité Settings + SettingsController) gère bien plus de champs que
// ce que cette page expose actuellement — seuls les onglets Général et
// Contact sont implémentés ici. Les champs réseaux sociaux/pied de
// page/images/SEO existent dans SettingsData mais restent figés à `null` dans
// ce formulaire (jamais affichés ni modifiables) : c'est pour cette raison que
// les liens Facebook/LinkedIn/YouTube sont codés en dur dans Header.tsx,
// Footer.tsx et Contact.tsx plutôt que gérés depuis l'admin. Ajouter les
// onglets manquants ici serait nécessaire pour les rendre configurables.
type TabKey = 'general' | 'contact'

const inputClass = 'w-full px-3.5 py-2.5 rounded-lg border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-small'
const labelClass = 'block text-small font-medium text-gray-700 mb-1.5'

const Settings = () => {
  const { t, i18n } = useTranslation()
  const tabs: { key: TabKey; label: string; icon: ElementType }[] = [
    { key: 'general', label: t('admin.settings.generalInfo'), icon: Info },
    { key: 'contact', label: t('admin.settings.contact'), icon: Mail },
  ]
  const [activeTab, setActiveTab] = useState<TabKey>('general')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploadingField, setUploadingField] = useState<string | null>(null)

  const [form, setForm] = useState<SettingsData>({
    orgName: '', logo: '', slogan: '', description: '', email: '', phone: '',
    contactEmail: '', contactPhone: '', contactPhoneSecondary: '', address: '', whatsapp: '', googleMapsIframe: '',
    facebook: null, linkedin: null, youtube: null, whatsappUrl: null,
    footerPresentation: null, copyright: null, openingHours: null, legalLink: null, privacyLink: null,
    heroImage: null, aboutImage: null, programsImage: null, eventsImage: null, contactImage: null,
    metaTitle: null, metaDescription: null, metaKeywords: null, ogImage: null, googleAnalyticsId: null,
  })

  useEffect(() => {
    settingsService.get()
      .then((data) => {
        setForm({
          orgName: data.orgName ?? '',
          logo: data.logo ?? '',
          slogan: data.slogan ?? '',
          description: data.description ?? '',
          email: data.email ?? '',
          phone: data.phone ?? '',
          contactEmail: data.contactEmail ?? '',
          contactPhone: data.contactPhone ?? '',
          contactPhoneSecondary: data.contactPhoneSecondary ?? '',
          address: data.address ?? '',
          whatsapp: data.whatsapp ?? '',
          googleMapsIframe: data.googleMapsIframe ?? '',
          facebook: null, linkedin: null, youtube: null, whatsappUrl: null,
          footerPresentation: null, copyright: null, openingHours: null, legalLink: null, privacyLink: null,
          heroImage: null, aboutImage: null, programsImage: null, eventsImage: null, contactImage: null,
          metaTitle: null, metaDescription: null, metaKeywords: null, ogImage: null, googleAnalyticsId: null,
        })
      })
      .catch(() => console.error('Erreur chargement paramètres'))
      .finally(() => setLoading(false))
  }, [i18n.language])

  const set = (field: keyof SettingsData, value: unknown) => setForm((prev) => ({ ...prev, [field]: value }))

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadingField('logo')
    try {
      const fd = new FormData()
      fd.append('file', file)
      const result = await api.upload<{ url: string }>('/api/upload', fd)
      set('logo', result.url)
    } catch {
      console.error('Erreur upload')
    } finally {
      setUploadingField(null)
    }
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      await settingsService.update(form)
    } catch {
      console.error('Erreur enregistrement')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    )
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">{t('admin.sidebar.settings')}</h1>
        <p className="text-gray-500 text-small mt-1">{t('admin.sidebar.dashboard')} &gt; {t('admin.sidebar.settings')}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-6">
        <nav className="bg-white rounded-xl shadow-sm border border-gray-100 p-2 flex lg:flex-col gap-1 overflow-x-auto lg:overflow-visible">
          {tabs.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg text-small font-medium whitespace-nowrap transition-colors ${
                activeTab === key ? 'bg-primary text-white' : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Icon size={16} />
              {label}
            </button>
          ))}
        </nav>

        <form onSubmit={handleSubmit}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 overflow-y-auto max-h-[calc(100vh-13rem)]"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                {activeTab === 'general' && (
                  <div>
                    <h3 className="font-semibold text-gray-900 text-body mb-5">{t('admin.settings.generalInfo')}</h3>
                    <div className="space-y-5">
                      <div>
                        <label className={labelClass}>{t('admin.settings.orgName')}</label>
                        <input type="text" value={form.orgName ?? ''} onChange={(e) => set('orgName', e.target.value)} className={inputClass} />
                      </div>
                      <div>
                        <label className={labelClass}>{t('admin.settings.logo')}</label>
                        <div className="flex items-center gap-4">
                          {form.logo ? (
                            <div className="relative">
                              <img src={form.logo} alt="Logo" className="w-12 h-12 rounded-lg object-cover" />
                              <button type="button" onClick={() => set('logo', '')} className="absolute -top-2 -right-2 w-5 h-5 bg-red text-white rounded-full flex items-center justify-center text-[10px]">&times;</button>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2 border border-gray-200 rounded-lg px-4 py-2.5">
                              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold text-sm">Z</div>
                              <span className="font-bold text-gray-900 text-small leading-tight">
                                ZONAL <span className="text-primary">ONG</span>
                                <span className="block text-[9px] font-medium text-gray-500">Développement Durable</span>
                              </span>
                            </div>
                          )}
                          <ImageUploadButton uploading={uploadingField} onUpload={handleLogoUpload} t={t} />
                        </div>
                      </div>
                      <div>
                        <label className={labelClass}>{t('admin.settings.slogan')}</label>
                        <input type="text" value={form.slogan ?? ''} onChange={(e) => set('slogan', e.target.value)} className={inputClass} />
                      </div>
                      <div>
                        <label className={labelClass}>{t('admin.settings.description')}</label>
                        <textarea rows={3} value={form.description ?? ''} onChange={(e) => set('description', e.target.value)} className={`${inputClass} resize-none`} />
                      </div>
                      <div>
                        <label className={labelClass}>{t('admin.settings.email')}</label>
                        <input type="email" value={form.email ?? ''} onChange={(e) => set('email', e.target.value)} className={inputClass} />
                      </div>
                      <div>
                        <label className={labelClass}>{t('admin.settings.phone')}</label>
                        <input type="text" value={form.phone ?? ''} onChange={(e) => set('phone', e.target.value)} className={inputClass} />
                      </div>
                      <div>
                        <label className={labelClass}>{t('admin.labels.footerPresentation')}</label>
                        <textarea rows={3} value={form.footerPresentation ?? ''} onChange={(e) => set('footerPresentation', e.target.value)} className={`${inputClass} resize-none`} />
                      </div>
                      <div>
                        <label className={labelClass}>{t('admin.labels.copyright')}</label>
                        <input type="text" value={form.copyright ?? ''} onChange={(e) => set('copyright', e.target.value)} className={inputClass} />
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'contact' && (
                  <div>
                    <h3 className="font-semibold text-gray-900 text-body mb-5">{t('admin.settings.contactInfo')}</h3>
                    <div className="space-y-5">
                      <div>
                        <label className={`${labelClass} flex items-center gap-2`}><Mail size={14} /> {t('admin.settings.primaryEmail')}</label>
                        <input type="email" value={form.contactEmail ?? ''} onChange={(e) => set('contactEmail', e.target.value)} className={inputClass} />
                      </div>
                      <div>
                        <label className={`${labelClass} flex items-center gap-2`}><Phone size={14} /> {t('admin.settings.phone')}</label>
                        <input type="text" value={form.contactPhone ?? ''} onChange={(e) => set('contactPhone', e.target.value)} className={inputClass} />
                      </div>
                      <div>
                        <label className={`${labelClass} flex items-center gap-2`}><Phone size={14} /> {t('admin.settings.secondaryPhone')}</label>
                        <input type="text" value={form.contactPhoneSecondary ?? ''} onChange={(e) => set('contactPhoneSecondary', e.target.value)} className={inputClass} />
                      </div>
                      <div>
                        <label className={`${labelClass} flex items-center gap-2`}><MapPin size={14} /> {t('admin.settings.address')}</label>
                        <input type="text" value={form.address ?? ''} onChange={(e) => set('address', e.target.value)} className={inputClass} />
                      </div>
                      <div>
                        <label className={`${labelClass} flex items-center gap-2`}><MessageCircle size={14} /> {t('admin.settings.whatsapp')}</label>
                        <input type="text" value={form.whatsapp ?? ''} onChange={(e) => set('whatsapp', e.target.value)} className={inputClass} />
                      </div>
                      <div>
                        <label className={labelClass}>{t('admin.settings.googleMapsIframe')}</label>
                        <input type="text" value={form.googleMapsIframe ?? ''} onChange={(e) => set('googleMapsIframe', e.target.value)} className={inputClass} />
                      </div>
                    </div>
                  </div>
                )}


              </motion.div>
            </AnimatePresence>

            <div className="flex items-center justify-end gap-3 mt-8 pt-6 border-t border-gray-100">
              <button type="button" onClick={() => window.location.reload()} className="px-5 py-2.5 rounded-lg text-gray-600 font-medium text-small border border-gray-200 hover:bg-gray-50 transition-colors">
                {t('admin.actions.cancel')}
              </button>
              <button type="submit" disabled={saving} className="px-6 py-2.5 rounded-lg bg-primary text-white font-medium text-small hover:bg-primary-dark transition-colors disabled:opacity-50">
                {saving ? t('admin.actions.saving') : t('admin.actions.save')}
              </button>
            </div>
          </motion.div>
        </form>
      </div>
    </div>
  )
}

function ImageUploadButton({ uploading, onUpload, t: translate }: { uploading: string | null; onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void; t: (key: string) => string }) {
  const ref = useRef<HTMLInputElement>(null)
  return (
    <>
      <button type="button" onClick={() => ref.current?.click()} className="flex items-center gap-1.5 text-primary text-small font-medium hover:text-primary-dark transition-colors">
        {uploading === 'logo' ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
        {uploading === 'logo' ? translate('admin.settings.uploading') : translate('admin.settings.changeLogo')}
      </button>
      <input ref={ref} type="file" accept="image/*" className="hidden" onChange={onUpload} />
    </>
  )
}

export default Settings
