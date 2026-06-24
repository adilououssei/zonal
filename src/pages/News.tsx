import { useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import {
  Calendar, ArrowRight, ChevronRight, ChevronDown, Search, Send,
  ChevronsLeft, ChevronsRight, Mail
} from 'lucide-react'
import { categories, articles } from '../data/newsData'

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 }
}

const News = () => {
  const { t } = useTranslation()
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const recentArticles = articles.slice(0, 4)

  return (
    <>
      {/* Hero */}
      <section className="relative py-20 md:py-28 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=1920&h=600&fit=crop"
            alt={t('news.hero.title')}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-linear-to-r from-black/75 via-black/50 to-black/20" />
        </div>
        <div className="relative container-custom text-white">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-section font-bold mb-4"
          >
            {t('news.hero.title')}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="text-subtitle text-gray-200 max-w-2xl mb-5"
          >
            {t('news.hero.subtitle')}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="flex items-center gap-2 text-gray-200 text-body"
          >
            <Link to="/" className="hover:text-primary-light transition-colors">{t('news.breadcrumb.home')}</Link>
            <ChevronRight size={16} />
            <span className="text-primary-light">{t('news.breadcrumb.current')}</span>
          </motion.div>
        </div>
      </section>

      {/* Contenu principal */}
      <section className="py-20">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-[68%_32%] gap-10">
            {/* Colonne articles */}
            <div>
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{t('news.allTitle')}</h2>
                  <div className="w-10 h-1 bg-red mt-2" />
                </div>
                <div className="relative">
                  <select
                    defaultValue="recent"
                    className="appearance-none pl-4 pr-10 py-2.5 rounded-lg border border-gray-200 text-gray-600 text-body focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer"
                  >
                    <option value="recent">{t('news.sort.recent')}</option>
                    <option value="popular">{t('news.sort.popular')}</option>
                    <option value="oldest">{t('news.sort.oldest')}</option>
                  </select>
                  <ChevronDown size={16} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
                {articles.map((article, index) => (
                  <motion.article
                    key={article.id}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.1 }}
                    variants={fadeUp}
                    transition={{ duration: 0.5, delay: (index % 6) * 0.08 }}
                    className="card overflow-hidden group"
                  >
                    <div className="relative aspect-video overflow-hidden">
                      <img
                        src={article.image}
                        alt={article.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <span className={`absolute top-3 left-3 ${article.categoryColor} text-white text-[11px] font-semibold tracking-wide px-3 py-1 rounded-full`}>
                        {article.category}
                      </span>
                    </div>
                    <div className="p-5">
                      <span className="flex items-center gap-1.5 text-gray-500 text-small mb-2">
                        <Calendar size={14} />
                        {article.date}
                      </span>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2 leading-snug line-clamp-2">
                        {article.title}
                      </h3>
                      <p className="text-gray-600 text-body mb-4 line-clamp-2">
                        {article.excerpt}
                      </p>
                      <Link to="/news" className="text-primary font-semibold text-body hover:text-primary-dark transition-colors inline-flex items-center gap-1.5">
                        {t('news.readMore')} <ArrowRight size={16} />
                      </Link>
                    </div>
                  </motion.article>
                ))}
              </div>

              {/* Pagination */}
              <nav className="flex items-center justify-center gap-2">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  aria-label={t('news.pagination.prev')}
                  className="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-200 hover:bg-primary hover:text-white hover:border-primary transition-colors"
                >
                  <ChevronsLeft size={18} />
                </button>
                {[1, 2, 3].map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-10 h-10 flex items-center justify-center rounded-lg font-medium transition-colors ${
                      currentPage === page
                        ? 'bg-primary text-white'
                        : 'border border-gray-200 text-gray-600 hover:bg-primary hover:text-white hover:border-primary'
                    }`}
                  >
                    {page}
                  </button>
                ))}
                <span className="px-1 text-gray-400">…</span>
                <button
                  onClick={() => setCurrentPage((p) => p + 1)}
                  aria-label={t('news.pagination.next')}
                  className="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-200 hover:bg-primary hover:text-white hover:border-primary transition-colors"
                >
                  <ChevronsRight size={18} />
                </button>
              </nav>
            </div>

            {/* Sidebar */}
            <aside className="space-y-8">
              {/* Recherche */}
              <div className="card p-6">
                <h3 className="font-semibold text-gray-900 mb-4">{t('news.sidebar.searchTitle')}</h3>
                <form
                  className="flex gap-2"
                  onSubmit={(e) => e.preventDefault()}
                >
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={t('news.sidebar.searchPlaceholder')}
                    className="flex-1 px-4 py-2.5 rounded-lg border border-gray-200 text-body focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
                  />
                  <button
                    type="submit"
                    aria-label={t('news.sidebar.searchAria')}
                    className="w-11 h-11 bg-primary text-white rounded-lg flex items-center justify-center hover:bg-primary-dark transition-colors shrink-0"
                  >
                    <Search size={18} />
                  </button>
                </form>
              </div>

              {/* Catégories */}
              <div className="card p-6">
                <h3 className="font-semibold text-gray-900 mb-4">{t('news.sidebar.categoriesTitle')}</h3>
                <ul className="space-y-3">
                  {categories.map((cat) => (
                    <li key={cat.slug}>
                      <Link
                        to="/news"
                        className="flex items-center justify-between text-gray-600 hover:text-primary transition-colors text-body"
                      >
                        <span className="flex items-center gap-2.5">
                          <span className={`w-2 h-2 rounded-full ${cat.color}`} />
                          {cat.label}
                        </span>
                        <span className="text-gray-400 text-small">({cat.count})</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Articles récents */}
              <div className="card p-6">
                <h3 className="font-semibold text-gray-900 mb-4">{t('news.sidebar.recentTitle')}</h3>
                <ul className="space-y-4">
                  {recentArticles.map((article) => (
                    <li key={article.id}>
                      <Link to="/news" className="flex items-start gap-3 group">
                        <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0">
                          <img
                            src={article.image}
                            alt={article.title}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        </div>
                        <div>
                          <h4 className="text-body font-medium text-gray-900 leading-snug line-clamp-2 group-hover:text-primary transition-colors">
                            {article.title}
                          </h4>
                          <p className="text-gray-400 text-small mt-1">{article.date}</p>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Newsletter */}
              <div className="bg-primary-dark rounded-card p-6 text-white">
                <div className="w-12 h-12 rounded-full bg-primary-light/20 flex items-center justify-center text-primary-light mb-4">
                  <Mail size={22} />
                </div>
                <h3 className="font-semibold text-lg mb-1">{t('news.newsletter.title')}</h3>
                <p className="text-gray-300 text-body mb-4">
                  {t('news.newsletter.desc')}
                </p>
                <form className="space-y-3" onSubmit={(e) => e.preventDefault()}>
                  <input
                    type="email"
                    required
                    placeholder={t('news.newsletter.placeholder')}
                    className="w-full px-4 py-2.5 rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-light text-body"
                  />
                  <button
                    type="submit"
                    className="w-full bg-primary hover:bg-primary-light transition-colors text-white py-2.5 rounded-lg font-medium text-body inline-flex items-center justify-center gap-2"
                  >
                    {t('news.newsletter.button')} <Send size={16} />
                  </button>
                </form>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </>
  )
}

export default News
