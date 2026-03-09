import { useState } from 'react'
import { ExternalLink, MapPin, Calendar, Ticket } from 'lucide-react'
import { Link } from 'react-router-dom'
import {
  TOUR_DATES, TOUR_INFO, CONTINENTS, CONTINENT_META,
  formatTourDate, getTourStatus,
} from '../lib/tourData'
import { usePageTitle } from '../hooks/usePageTitle'

const STATUS_STYLE = {
  passed:     'bg-gray-100 text-gray-400 border-gray-200',
  this_week:  'bg-green-100 text-green-700 border-green-200',
  this_month: 'bg-orange-100 text-orange-700 border-orange-200',
  upcoming:   'bg-red-50 text-red-600 border-red-200',
}
const STATUS_LABEL = {
  passed: 'Past',
  this_week: 'This Week',
  this_month: 'This Month',
  upcoming: 'Upcoming',
}

const bgGradient = 'linear-gradient(160deg, #0a0000 0%, #1a0000 40%, #0a0000 100%)'

export default function TourPage() {
  usePageTitle('World Tour · ARIRANG')
  const [activeContinent, setActiveContinent] = useState('All')

  const filtered = activeContinent === 'All'
    ? TOUR_DATES
    : TOUR_DATES.filter((t) => t.continent === activeContinent)

  const totalShows = filtered.reduce((n, t) => n + t.dates.length, 0)

  return (
    <div style={{ background: bgGradient, minHeight: '100vh' }}>

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-6 pt-16 pb-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div>
            <div className="inline-flex items-center gap-2 bg-red-500/20 border border-red-500/30 text-red-300 text-xs font-bold px-4 py-2 rounded-full mb-5 tracking-widest uppercase">
              🎤 Official Tour Announcement
            </div>
            <h1
              className="text-5xl md:text-7xl font-bold text-white mb-3 leading-tight"
              style={{ fontFamily: 'Playfair Display, Georgia, serif' }}
            >
              BTS WORLD TOUR
            </h1>
            <h2
              className="text-4xl md:text-5xl font-bold mb-4 leading-tight"
              style={{ fontFamily: 'Playfair Display, Georgia, serif', color: '#ff0000' }}
            >
              ARIRANG
            </h2>
            <p className="text-red-100/50 text-sm max-w-xl leading-relaxed mb-2">
              {TOUR_INFO.tagline}
            </p>
            <p className="text-red-100/30 text-xs">{TOUR_INFO.stage} stage · April 2026 – March 2027</p>
          </div>

          {/* Stats */}
          <div className="flex gap-4 flex-shrink-0">
            {[
              { value: TOUR_INFO.total_shows, label: 'Shows' },
              { value: TOUR_INFO.total_cities, label: 'Cities' },
              { value: TOUR_INFO.total_continents, label: 'Continents' },
            ].map(({ value, label }) => (
              <div
                key={label}
                className="text-center px-6 py-4 rounded-2xl border border-red-500/20"
                style={{ background: 'rgba(255,0,0,0.06)' }}
              >
                <div className="text-3xl font-bold text-white">{value}</div>
                <div className="text-red-400/60 text-xs font-bold tracking-widest uppercase mt-1">{label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Continent Stats Row */}
        <div className="mt-10 grid grid-cols-2 md:grid-cols-5 gap-3">
          {Object.entries(CONTINENT_META).map(([continent, meta]) => (
            <button
              key={continent}
              onClick={() => setActiveContinent(continent === activeContinent ? 'All' : continent)}
              className={`text-left p-4 rounded-2xl border transition-all ${
                activeContinent === continent
                  ? 'border-red-500/50 bg-red-500/10'
                  : 'border-white/10 bg-white/5 hover:bg-white/10'
              }`}
            >
              <span className="text-2xl block mb-2">{meta.emoji}</span>
              <span className="text-white text-xs font-bold block leading-snug">{continent}</span>
              <span className="text-red-400/50 text-xs">{meta.shows} shows · {meta.cities} cities</span>
            </button>
          ))}
        </div>
      </section>

      {/* Filter Bar */}
      <div className="sticky top-16 z-30 border-b border-white/5" style={{ background: 'rgba(10,0,0,0.9)', backdropFilter: 'blur(12px)' }}>
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center gap-3 flex-wrap">
          {CONTINENTS.map((c) => (
            <button
              key={c}
              onClick={() => setActiveContinent(c)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeContinent === c
                  ? 'bg-red-600 text-white'
                  : 'bg-white/5 text-red-300/70 hover:bg-white/10 hover:text-white border border-white/10'
              }`}
            >
              {c}
            </button>
          ))}
          <span className="ml-auto text-red-400/40 text-xs font-medium">
            {totalShows} show{totalShows !== 1 ? 's' : ''}
            {activeContinent !== 'All' ? ` in ${activeContinent}` : ' worldwide'}
          </span>
        </div>
      </div>

      {/* Tour Date List */}
      <div className="max-w-7xl mx-auto px-6 py-10 space-y-10">
        {filtered.map((stop) => {
          const contMeta = CONTINENT_META[stop.continent]
          return (
            <div key={stop.id}>
              {/* City Header */}
              <div className="flex items-center gap-3 mb-4">
                <div
                  className={`text-xs font-bold px-3 py-1.5 rounded-xl border ${contMeta?.color || 'bg-white/10 text-white border-white/20'}`}
                >
                  {contMeta?.emoji} {stop.continent}
                </div>
                <div className="flex items-center gap-2">
                  <MapPin size={14} className="text-red-400/60" />
                  <h3
                    className="text-white text-xl font-bold"
                    style={{ fontFamily: 'Playfair Display, Georgia, serif' }}
                  >
                    {stop.city}
                  </h3>
                  <span className="text-red-400/40 text-sm">{stop.country}</span>
                </div>
                {stop.notes && (
                  <span className="text-xs bg-red-500/15 text-red-300 border border-red-500/25 px-3 py-1 rounded-xl">
                    {stop.notes}
                  </span>
                )}
              </div>

              <p className="text-red-300/40 text-xs mb-3 flex items-center gap-1.5">
                <MapPin size={11} /> {stop.venue}
              </p>

              {/* Individual Dates */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {stop.dates.map((date, i) => {
                  const status = getTourStatus(date)
                  const soldOut = stop.sold_out?.[i]
                  return (
                    <div
                      key={date}
                      className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${
                        soldOut
                          ? 'border-white/10 bg-white/3 opacity-60'
                          : 'border-white/10 bg-white/5 hover:bg-white/10 hover:border-red-500/30'
                      }`}
                    >
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <span className={`text-xs font-bold px-2 py-0.5 rounded-lg border ${STATUS_STYLE[status]}`}>
                            {soldOut ? 'Sold Out' : STATUS_LABEL[status]}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 text-white text-xs font-medium">
                          <Calendar size={11} className="text-red-400/60 flex-shrink-0" />
                          <span>{formatTourDate(date)}</span>
                        </div>
                      </div>
                      {!soldOut && (
                        <a
                          href={stop.ticket_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 bg-red-600 hover:bg-red-500 text-white text-xs font-bold px-3 py-2 rounded-xl transition-all no-underline flex-shrink-0 ml-2 active:scale-95"
                        >
                          <Ticket size={11} /> Tickets
                        </a>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })}

        {filtered.length === 0 && (
          <p className="text-center text-red-400/40 py-20">No tour dates found for this region.</p>
        )}

        {/* Footer CTA */}
        <div
          className="mt-12 p-8 rounded-3xl border border-red-500/20 text-center"
          style={{ background: 'rgba(255,0,0,0.04)' }}
        >
          <p className="text-red-400/60 text-xs font-bold tracking-widest uppercase mb-3">Official Source</p>
          <h3
            className="text-white text-2xl font-bold mb-2"
            style={{ fontFamily: 'Playfair Display, Georgia, serif' }}
          >
            Full tour details at btsworldtourofficial.com
          </h3>
          <p className="text-red-200/40 text-sm mb-6">
            Ticket links, VIP packages, venue info, and fan meet details.
          </p>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <a
              href={TOUR_INFO.website}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-3 bg-red-600 hover:bg-red-500 text-white rounded-2xl text-sm font-bold transition-all no-underline active:scale-[0.98]"
            >
              Official Tour Site <ExternalLink size={15} />
            </a>
            <Link
              to="/arirang"
              className="inline-flex items-center gap-2 px-8 py-3 border border-red-500/30 text-red-300 hover:bg-red-500/10 rounded-2xl text-sm font-bold transition-all no-underline active:scale-[0.98]"
            >
              ARIRANG Hub 💜
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
