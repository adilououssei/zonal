import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { Calendar, ArrowRight } from 'lucide-react'

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 }
}

const News = () => {
  const { t } = useTranslation()

  const articles = [
    {
      id: 1,
      title: t('news.articles.0.title'),
      excerpt: t('news.articles.0.excerpt'),
      date: t('news.articles.0.date'),
      category: t('news.articles.0.category'),
      image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=600&h=400&fit=crop'
    },
    {
      id: 2,
      title: t('news.articles.1.title'),
      excerpt: t('news.articles.1.excerpt'),
      date: t('news.articles.1.date'),
      category: t('news.articles.1.category'),
      image: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=600&h=400&fit=crop'
    },
    {
      id: 3,
      title: t('news.articles.2.title'),
      excerpt: t('news.articles.2.excerpt'),
      date: t('news.articles.2.date'),
      category: t('news.articles.2.category'),
      image: 'https://images.unsplash.com/photo-1543168256-4183f1f5aab1?w=600&h=400&fit=crop'
    },
    {
      id: 4,
      title: t('news.articles.3.title'),
      excerpt: t('news.articles.3.excerpt'),
      date: t('news.articles.3.date'),
      category: t('news.articles.3.category'),
      image: 'https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?w=600&h=400&fit=crop'
    },
    {
      id: 5,
      title: t('news.articles.4.title'),
      excerpt: t('news.articles.4.excerpt'),
      date: t('news.articles.4.date'),
      category: t('news.articles.4.category'),
      image: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=600&h=400&fit=crop'
    },
    {
      id: 6,
      title: t('news.articles.5.title'),
      excerpt: t('news.articles.5.excerpt'),
      date: t('news.articles.5.date'),
      category: t('news.articles.5.category'),
      image: 'https://images.unsplash.com/photo-1578574577315-3fbeb0cecd5c?w=600&h=400&fit=crop'
    }
  ]

  return (
    <>
      {/* Hero */}
      <section className="relative py-24 bg-primary text-white">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=1920&h=400&fit=crop"
            alt={t('news.hero.title')}
            className="w-full h-full object-cover opacity-20"
          />
        </div>
        <div className="relative container-custom text-center">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-section font-bold"
          >
            {t('news.hero.title')}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-subtitle text-white/80 max-w-2xl mx-auto mt-4"
          >
            {t('news.hero.subtitle')}
          </motion.p>
        </div>
      </section>

      {/* Articles */}
      <section className="py-20">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                <div className="aspect-video overflow-hidden">
                  <img
                    src={article.image}
                    alt={article.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-3 text-small text-gray-500 mb-3">
                    <span className="bg-primary/10 text-primary px-3 py-1 rounded-full font-medium">
                      {article.category}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar size={14} />
                      {article.date}
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-2">
                    {article.title}
                  </h3>
                  <p className="text-gray-600 text-body mb-4 line-clamp-3">
                    {article.excerpt}
                  </p>
                  <button className="text-primary font-semibold hover:text-primary-dark transition-colors inline-flex items-center gap-1">
                    {t('news.readMore')} <ArrowRight size={18} />
                  </button>
                </div>
              </motion.article>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex justify-center mt-12">
            <nav className="flex items-center gap-2">
              <button className="px-4 py-2 rounded-lg border border-gray-200 hover:bg-primary hover:text-white transition-colors">
                {t('news.pagination.prev')}
              </button>
              <button className="px-4 py-2 rounded-lg bg-primary text-white">1</button>
              <button className="px-4 py-2 rounded-lg border border-gray-200 hover:bg-primary hover:text-white transition-colors">
                2
              </button>
              <button className="px-4 py-2 rounded-lg border border-gray-200 hover:bg-primary hover:text-white transition-colors">
                3
              </button>
              <button className="px-4 py-2 rounded-lg border border-gray-200 hover:bg-primary hover:text-white transition-colors">
                {t('news.pagination.next')}
              </button>
            </nav>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-primary text-white">
        <div className="container-custom text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-section font-bold mb-4">{t('news.cta.title')}</h2>
            <p className="text-subtitle text-white/80 max-w-2xl mx-auto mb-8">
              {t('news.cta.desc')}
            </p>
            <button className="bg-white text-primary px-10 py-4 rounded-full text-button font-semibold hover:bg-gray-100 transition-all duration-300 hover:shadow-lg">
              {t('news.cta.button')}
            </button>
          </motion.div>
        </div>
      </section>
    </>
  )
}

export default News
