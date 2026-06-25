import { useState, type ElementType } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Info, Mail, Share2, PanelBottom, Image as ImageIcon, Search,
  Phone, MapPin, MessageCircle, Globe, Briefcase, Video, Upload
} from 'lucide-react'

type TabKey = 'general' | 'contact' | 'social' | 'footer' | 'images' | 'seo'

const tabs: { key: TabKey; label: string; icon: ElementType }[] = [
  { key: 'general', label: 'Informations générales', icon: Info },
  { key: 'contact', label: 'Contact', icon: Mail },
  { key: 'social', label: 'Réseaux sociaux', icon: Share2 },
  { key: 'footer', label: 'Footer', icon: PanelBottom },
  { key: 'images', label: 'Images', icon: ImageIcon },
  { key: 'seo', label: 'SEO', icon: Search },
]

const inputClass =
  'w-full px-3.5 py-2.5 rounded-lg border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-small'
const labelClass = 'block text-small font-medium text-gray-700 mb-1.5'

const Settings = () => {
  const [activeTab, setActiveTab] = useState<TabKey>('general')

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    // À connecter à l'API backend
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Paramètres du site</h1>
        <p className="text-gray-500 text-small mt-1">Tableau de bord &gt; Paramètres</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-6">
        {/* Sous-menu à onglets */}
        <nav className="bg-white rounded-xl shadow-sm border border-gray-100 p-2 flex lg:flex-col gap-1 overflow-x-auto lg:overflow-visible">
          {tabs.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg text-small font-medium whitespace-nowrap transition-colors ${
                activeTab === key
                  ? 'bg-primary text-white'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Icon size={16} />
              {label}
            </button>
          ))}
        </nav>

        {/* Panneau de contenu */}
        <form onSubmit={handleSave}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
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
                    <h3 className="font-semibold text-gray-900 text-body mb-5">Informations générales</h3>
                    <div className="space-y-5">
                      <div>
                        <label className={labelClass}>Nom de l'ONG</label>
                        <input type="text" defaultValue="ZONAL ONG Développement Durable" className={inputClass} />
                      </div>

                      <div>
                        <label className={labelClass}>Logo</label>
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2 border border-gray-200 rounded-lg px-4 py-2.5">
                            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold text-sm">Z</div>
                            <span className="font-bold text-gray-900 text-small leading-tight">
                              ZONAL <span className="text-primary">ONG</span>
                              <span className="block text-[9px] font-medium text-gray-500">Développement Durable</span>
                            </span>
                          </div>
                          <button
                            type="button"
                            className="flex items-center gap-1.5 text-primary text-small font-medium hover:text-primary-dark transition-colors"
                          >
                            <Upload size={14} />
                            Changer le logo
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className={labelClass}>Slogan</label>
                        <input type="text" defaultValue="Agir aujourd'hui pour un avenir durable" className={inputClass} />
                      </div>

                      <div>
                        <label className={labelClass}>Description</label>
                        <textarea
                          rows={3}
                          defaultValue="Zonal ONG Développement Durable œuvre pour un développement humain, social et équitable au Tchad."
                          className={`${inputClass} resize-none`}
                        />
                      </div>

                      <div>
                        <label className={labelClass}>Email</label>
                        <input type="email" defaultValue="contact@zonalong.org" className={inputClass} />
                      </div>

                      <div>
                        <label className={labelClass}>Téléphone</label>
                        <input type="text" defaultValue="+235 66 00 00 00" className={inputClass} />
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'contact' && (
                  <div>
                    <h3 className="font-semibold text-gray-900 text-body mb-5">Coordonnées de contact</h3>
                    <div className="space-y-5">
                      <div>
                        <label className={`${labelClass} flex items-center gap-2`}>
                          <Mail size={14} /> Email principal
                        </label>
                        <input type="email" defaultValue="contact@zonalong.org" className={inputClass} />
                      </div>
                      <div>
                        <label className={`${labelClass} flex items-center gap-2`}>
                          <Phone size={14} /> Téléphone
                        </label>
                        <input type="text" defaultValue="+235 66 00 00 00" className={inputClass} />
                      </div>
                      <div>
                        <label className={`${labelClass} flex items-center gap-2`}>
                          <Phone size={14} /> Téléphone secondaire
                        </label>
                        <input type="text" defaultValue="+235 90 00 00 00" className={inputClass} />
                      </div>
                      <div>
                        <label className={`${labelClass} flex items-center gap-2`}>
                          <MapPin size={14} /> Adresse
                        </label>
                        <input type="text" defaultValue="N'Djamena, Tchad — Quartier Klemat, Avenue des Écologistes" className={inputClass} />
                      </div>
                      <div>
                        <label className={`${labelClass} flex items-center gap-2`}>
                          <MessageCircle size={14} /> Numéro WhatsApp
                        </label>
                        <input type="text" defaultValue="+235 66 00 00 00" className={inputClass} />
                      </div>
                      <div>
                        <label className={labelClass}>Lien Google Maps (iframe)</label>
                        <input type="text" defaultValue="https://www.google.com/maps/embed?pb=..." className={inputClass} />
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'social' && (
                  <div>
                    <h3 className="font-semibold text-gray-900 text-body mb-5">Réseaux sociaux</h3>
                    <div className="space-y-5">
                      <div>
                        <label className={`${labelClass} flex items-center gap-2`}>
                          <Globe size={14} /> Facebook
                        </label>
                        <input type="url" placeholder="https://facebook.com/zonalong" className={inputClass} />
                      </div>
                      <div>
                        <label className={`${labelClass} flex items-center gap-2`}>
                          <Briefcase size={14} /> LinkedIn
                        </label>
                        <input type="url" placeholder="https://linkedin.com/company/zonalong" className={inputClass} />
                      </div>
                      <div>
                        <label className={`${labelClass} flex items-center gap-2`}>
                          <Video size={14} /> YouTube
                        </label>
                        <input type="url" placeholder="https://youtube.com/@zonalong" className={inputClass} />
                      </div>
                      <div>
                        <label className={`${labelClass} flex items-center gap-2`}>
                          <MessageCircle size={14} /> WhatsApp
                        </label>
                        <input type="url" placeholder="https://wa.me/23566000000" className={inputClass} />
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'footer' && (
                  <div>
                    <h3 className="font-semibold text-gray-900 text-body mb-5">Contenu du footer</h3>
                    <div className="space-y-5">
                      <div>
                        <label className={labelClass}>Texte de présentation</label>
                        <textarea
                          rows={3}
                          defaultValue="Agir aujourd'hui pour un avenir durable. Ensemble, construisons un Tchad vert, équitable et prospère."
                          className={`${inputClass} resize-none`}
                        />
                      </div>
                      <div>
                        <label className={labelClass}>Texte de copyright</label>
                        <input type="text" defaultValue="Zonal ONG Développement Durable - Tous droits réservés" className={inputClass} />
                      </div>
                      <div>
                        <label className={labelClass}>Heures d'ouverture</label>
                        <div className="space-y-2.5">
                          <input type="text" defaultValue="Lundi - Vendredi : 08h00 - 17h00" className={inputClass} />
                          <input type="text" defaultValue="Samedi : 08h00 - 13h00" className={inputClass} />
                          <input type="text" defaultValue="Dimanche : Fermé" className={inputClass} />
                        </div>
                      </div>
                      <div>
                        <label className={labelClass}>Liens "Mentions légales" et "Politique de confidentialité"</label>
                        <div className="grid grid-cols-2 gap-3">
                          <input type="url" placeholder="/mentions-legales" className={inputClass} />
                          <input type="url" placeholder="/politique-confidentialite" className={inputClass} />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'images' && (
                  <div>
                    <h3 className="font-semibold text-gray-900 text-body mb-5">Images du site</h3>
                    <div className="space-y-6">
                      {[
                        { label: "Image de fond - Page d'accueil (Hero)" },
                        { label: 'Image de fond - À propos' },
                        { label: 'Image de fond - Programmes' },
                        { label: 'Image de fond - Événements' },
                        { label: 'Image de fond - Contact' },
                      ].map((item, i) => (
                        <div key={i}>
                          <label className={labelClass}>{item.label}</label>
                          <label className="flex items-center justify-center gap-2 border-2 border-dashed border-gray-200 rounded-xl py-6 cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-colors text-gray-500 text-small">
                            <Upload size={16} />
                            Cliquez pour uploader ou glissez-déposez une image
                            <input type="file" accept="image/*" className="hidden" />
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'seo' && (
                  <div>
                    <h3 className="font-semibold text-gray-900 text-body mb-5">Référencement (SEO)</h3>
                    <div className="space-y-5">
                      <div>
                        <label className={labelClass}>Titre de la page (meta title)</label>
                        <input
                          type="text"
                          defaultValue="ZONAL ONG Développement Durable - Tchad"
                          className={inputClass}
                        />
                      </div>
                      <div>
                        <label className={labelClass}>Méta description</label>
                        <textarea
                          rows={3}
                          defaultValue="Zonal ONG Développement Durable œuvre pour un développement humain, social et environnemental équilibré au Tchad."
                          className={`${inputClass} resize-none`}
                        />
                      </div>
                      <div>
                        <label className={labelClass}>Mots-clés (séparés par des virgules)</label>
                        <input
                          type="text"
                          defaultValue="ONG, Tchad, développement durable, environnement, gouvernance locale"
                          className={inputClass}
                        />
                      </div>
                      <div>
                        <label className={labelClass}>Image de partage (Open Graph)</label>
                        <label className="flex items-center justify-center gap-2 border-2 border-dashed border-gray-200 rounded-xl py-6 cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-colors text-gray-500 text-small">
                          <Upload size={16} />
                          Cliquez pour uploader une image (1200×630px recommandé)
                          <input type="file" accept="image/*" className="hidden" />
                        </label>
                      </div>
                      <div>
                        <label className={labelClass}>Google Analytics / Tag Manager ID</label>
                        <input type="text" placeholder="G-XXXXXXXXXX" className={inputClass} />
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 mt-8 pt-6 border-t border-gray-100">
              <button
                type="button"
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
          </motion.div>
        </form>
      </div>
    </div>
  )
}

export default Settings