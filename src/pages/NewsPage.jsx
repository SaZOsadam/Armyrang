import { useState } from 'react'
import { ExternalLink, MessageSquare, TrendingUp, Calendar, ArrowRight, Loader2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { FAN_DISCUSSIONS } from '../lib/newsData'
import { usePageTitle } from '../hooks/usePageTitle'
import { useNews } from '../hooks/useNews'
import { useEvents } from '../hooks/useEvents'

const CATEGORY_STYLES = {
  Interview:   'bg-purple-500/15 text-purple-300 border-purple-500/30',
  News:        'bg-blue-500/15 text-blue-300 border-blue-500/30',
  'Market Data': 'bg-green-500/15 text-green-300 border-green-500/30',
  Analysis:    'bg-orange-500/15 text-orange-300 border-orange-500/30',
  Rumour:      'bg-yellow-500/15 text-yellow-300 border-yellow-500/30',
}

const FILTERS = ['All', 'Interview', 'News', 'Market Data', 'Analysis', 'Rumour']

function timeAgo(dateStr) {
  const diff = (Date.now() - new Date(dateStr)) / 1000
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  return `${Math.floor(diff / 86400)}d ago`
}

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

const EVENT_ICONS = { release: '🎵', media: '🎬', live: '📡', announcement: '📢' }

export default function NewsPage() {
  usePageTitle('Coverage & News')
  const [activeFilter, setActiveFilter] = useState('All')
  const { articles, featuredArticle, loading: newsLoading } = useNews()
  const { upcoming: upcomingEvents } = useEvents()

  const filtered = activeFilter === 'All'
    ? articles
    : articles.filter((a) => a.category === activeFilter)

  const nonFeatured = filtered.filter((a) => !a.featured)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-10">
          <div className="inline-flex items-center gap-2 bg-red-50 text-red-700 text-xs font-semibold px-3 py-1.5 rounded-full mb-4 border border-red-100">
            📡 Live Coverage
          </div>
          <h1
            className="text-4xl md:text-5xl font-bold text-gray-900 mb-3"
            style={{ fontFamily: 'Playfair Display, Georgia, serif' }}
          >
            ARIRANG Coverage
          </h1>
          <p className="text-gray-500 max-w-xl">
            News, interviews, fan discussions, and event tracking — everything around the BTS comeback in one place.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

          {/* Main content — left 2/3 */}
          <div className="lg:col-span-2 space-y-12">

            {/* Featured — GQ Interview */}
            {featuredArticle && (
              <section>
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-xs font-bold tracking-widest uppercase text-red-600">Featured</span>
                </div>
                <div className="bg-white rounded-3xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all">
                  {featuredArticle.youtube_id && (
                    <div className="aspect-video w-full bg-black">
                      <iframe
                        className="w-full h-full"
                        src={`https://www.youtube.com/embed/${featuredArticle.youtube_id}`}
                        title={featuredArticle.title}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                  )}
                  <div className="p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-lg border ${CATEGORY_STYLES[featuredArticle.category]}`}>
                        {featuredArticle.category}
                      </span>
                      <span className="text-gray-400 text-xs font-semibold">{featuredArticle.source}</span>
                      <span className="text-gray-400 text-xs">{timeAgo(featuredArticle.published_at)}</span>
                    </div>
                    <h2
                      className="text-xl font-bold text-gray-900 mb-2"
                      style={{ fontFamily: 'Playfair Display, Georgia, serif' }}
                    >
                      {featuredArticle.title}
                    </h2>
                    <p className="text-gray-500 text-sm leading-relaxed mb-4">{featuredArticle.excerpt}</p>
                    <a
                      href={featuredArticle.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-red-600 hover:text-red-700 text-sm font-semibold no-underline transition-colors"
                    >
                      Watch on YouTube <ExternalLink size={14} />
                    </a>
                  </div>
                </div>
              </section>
            )}

            {/* Filter Bar */}
            <section>
              <div className="flex items-center gap-2 flex-wrap mb-6">
                {FILTERS.map((f) => (
                  <button
                    key={f}
                    onClick={() => setActiveFilter(f)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                      activeFilter === f
                        ? 'bg-gray-900 text-white'
                        : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>

              {/* Article Grid */}
              <div className="space-y-4">
                {nonFeatured.length === 0 && (
                  <p className="text-gray-400 text-sm text-center py-8">No articles in this category yet.</p>
                )}
                {nonFeatured.map((article) => (
                  <a
                    key={article.id}
                    href={article.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex gap-5 bg-white rounded-2xl border border-gray-200 p-5 hover:shadow-md hover:border-gray-300 transition-all no-underline group"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-2">
                        <span className={`text-xs font-bold px-2.5 py-1 rounded-lg border ${CATEGORY_STYLES[article.category] || 'bg-gray-100 text-gray-500 border-gray-200'}`}>
                          {article.category}
                        </span>
                        <span className="text-gray-400 text-xs font-semibold">{article.source}</span>
                        <span className="text-gray-400 text-xs">{timeAgo(article.published_at)}</span>
                      </div>
                      <h3
                        className="text-gray-900 font-semibold mb-1.5 group-hover:text-red-600 transition-colors leading-snug"
                        style={{ fontFamily: 'Playfair Display, Georgia, serif' }}
                      >
                        {article.title}
                      </h3>
                      <p className="text-gray-500 text-sm leading-relaxed line-clamp-2">{article.excerpt}</p>
                      <div className="flex flex-wrap gap-1.5 mt-3">
                        {article.tags.map((tag) => (
                          <span key={tag} className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-lg">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                    <ExternalLink size={16} className="text-gray-300 group-hover:text-red-400 flex-shrink-0 mt-1 transition-colors" />
                  </a>
                ))}
              </div>
            </section>

            {/* Fan Discussions */}
            <section>
              <div className="flex items-center gap-2 mb-6">
                <MessageSquare size={16} className="text-red-500" />
                <span className="text-xs font-bold tracking-widest uppercase text-red-600">Fan Discussions</span>
              </div>
              <div className="space-y-3">
                {FAN_DISCUSSIONS.map((thread) => (
                  <a
                    key={thread.id}
                    href={thread.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-start gap-4 bg-white rounded-2xl border border-gray-200 p-5 hover:shadow-md hover:border-gray-300 transition-all no-underline group"
                  >
                    <span className="text-2xl flex-shrink-0">{thread.platform_icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-bold text-gray-400">{thread.community}</span>
                        <span className="text-gray-300 text-xs">·</span>
                        <span className="text-xs text-gray-400">{timeAgo(thread.posted_at)}</span>
                      </div>
                      <p
                        className="text-gray-900 font-medium text-sm group-hover:text-red-600 transition-colors leading-snug"
                      >
                        {thread.title}
                      </p>
                      <div className="flex items-center gap-4 mt-2">
                        <span className="flex items-center gap-1 text-xs text-gray-400">
                          <TrendingUp size={11} /> {thread.upvotes} upvotes
                        </span>
                        <span className="flex items-center gap-1 text-xs text-gray-400">
                          <MessageSquare size={11} /> {thread.comments.toLocaleString()} comments
                        </span>
                      </div>
                    </div>
                    <ExternalLink size={15} className="text-gray-300 group-hover:text-red-400 flex-shrink-0 transition-colors" />
                  </a>
                ))}
              </div>
            </section>
          </div>

          {/* Sidebar — right 1/3 */}
          <div className="space-y-8">

            {/* ARIRANG Hub CTA */}
            <div
              className="rounded-3xl p-6 border border-purple-500/20"
              style={{ background: 'linear-gradient(135deg, #0d0118 0%, #1e0a3c 100%)' }}
            >
              <p className="text-purple-300 text-xs font-bold tracking-widest uppercase mb-3">💜 ARIRANG Hub</p>
              <h3
                className="text-white text-xl font-bold mb-2"
                style={{ fontFamily: 'Playfair Display, Georgia, serif' }}
              >
                아리랑<br />March 20, 2026
              </h3>
              <p className="text-purple-200/60 text-sm mb-4">Live countdown, tracklist speculation, and all ARIRANG predictions.</p>
              <Link
                to="/arirang"
                className="flex items-center justify-center gap-2 w-full py-3 bg-purple-600 hover:bg-purple-500 text-white rounded-2xl text-sm font-bold no-underline transition-all active:scale-[0.98]"
              >
                Go to ARIRANG Hub <ArrowRight size={14} />
              </Link>
            </div>

            {/* Upcoming Events */}
            <div className="bg-white rounded-3xl border border-gray-200 p-6">
              <div className="flex items-center gap-2 mb-5">
                <Calendar size={15} className="text-red-500" />
                <span className="text-xs font-bold tracking-widest uppercase text-red-600">Upcoming</span>
              </div>
              <div className="space-y-4">
                {upcomingEvents.map((event) => (
                  <div key={event.id} className="flex gap-3">
                    <span className="text-lg flex-shrink-0">{EVENT_ICONS[event.type]}</span>
                    <div className="min-w-0">
                      <p className="text-gray-900 text-sm font-medium leading-snug">{event.title}</p>
                      <p className="text-gray-400 text-xs mt-0.5">{formatDate(event.date)}</p>
                      {!event.confirmed && (
                        <span className="text-orange-500 text-xs">Unconfirmed</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <Link
                to="/arirang"
                className="flex items-center gap-1.5 mt-5 text-xs font-semibold text-red-600 hover:text-red-700 no-underline transition-colors"
              >
                Full timeline <ArrowRight size={12} />
              </Link>
            </div>

            {/* Predictions CTA */}
            <div className="bg-gray-900 rounded-3xl p-6 text-center">
              <p className="text-gray-400 text-xs font-bold tracking-widest uppercase mb-3">ARIRANG Predictions</p>
              <p className="text-white font-semibold mb-1" style={{ fontFamily: 'Playfair Display, Georgia, serif' }}>
                What do you see coming?
              </p>
              <p className="text-gray-500 text-xs mb-4">File your ARIRANG prediction before the album drops.</p>
              <Link
                to="/predictions"
                className="flex items-center justify-center gap-2 w-full py-3 bg-red-600 hover:bg-red-700 text-white rounded-2xl text-sm font-bold no-underline transition-all active:scale-[0.98]"
              >
                File Prediction <TrendingUp size={14} />
              </Link>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}
