import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { TrendingUp, ArrowRight, CheckCircle, Clock, Flame, ExternalLink, Music } from 'lucide-react'
import { MOCK_PREDICTIONS } from '../lib/mockData'
import { TRACKLIST_SPECULATION, NEWS_ARTICLES, EVENTS } from '../lib/newsData'

const MEMBER_TAG_STYLES = {
  RM:       'bg-blue-500/20 text-blue-300 border-blue-500/30',
  Jin:      'bg-pink-500/20 text-pink-300 border-pink-500/30',
  Suga:     'bg-gray-500/20 text-gray-300 border-gray-400/30',
  'J-Hope': 'bg-orange-500/20 text-orange-300 border-orange-500/30',
  Jimin:    'bg-rose-500/20 text-rose-300 border-rose-500/30',
  V:        'bg-teal-500/20 text-teal-300 border-teal-500/30',
  Jungkook: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
  Group:    'bg-white/10 text-white/80 border-white/20',
  Feature:  'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
}

function useCountdown(targetDate) {
  const [timeLeft, setTimeLeft] = useState({})

  useEffect(() => {
    function calc() {
      const diff = new Date(targetDate) - new Date()
      if (diff <= 0) return setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, dropped: true })
      setTimeLeft({
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
        seconds: Math.floor((diff % 60000) / 1000),
        dropped: false,
      })
    }
    calc()
    const id = setInterval(calc, 1000)
    return () => clearInterval(id)
  }, [targetDate])

  return timeLeft
}

function CountdownUnit({ value, label }) {
  return (
    <div className="flex flex-col items-center">
      <div
        className="w-20 h-20 md:w-24 md:h-24 rounded-2xl flex items-center justify-center mb-2 border border-purple-500/30"
        style={{ background: 'rgba(139,92,246,0.1)' }}
      >
        <span className="text-3xl md:text-4xl font-bold text-white tabular-nums">
          {String(value ?? 0).padStart(2, '0')}
        </span>
      </div>
      <span className="text-purple-400/70 text-xs font-bold tracking-widest uppercase">{label}</span>
    </div>
  )
}

function formatEventDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

const EVENT_ICONS = {
  release: '🎵',
  media: '🎬',
  live: '📡',
  announcement: '📢',
}

const EVENT_BADGE = {
  release: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
  media: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  live: 'bg-green-500/20 text-green-300 border-green-500/30',
  announcement: 'bg-orange-500/20 text-orange-300 border-orange-500/30',
}

const bg = 'linear-gradient(160deg, #050010 0%, #0d0118 50%, #1a0533 100%)'

export default function ARIRANGPage() {
  const countdown = useCountdown('2026-03-20T00:00:00+09:00')
  const arirangPredictions = MOCK_PREDICTIONS
    .filter((p) => p.status === 'active' && (p.member === 'Group' || p.id <= '5'))
    .slice(0, 6)
  const featuredArticle = NEWS_ARTICLES.find((a) => a.featured)
  const upcomingEvents = EVENTS.sort((a, b) => new Date(a.date) - new Date(b.date))

  return (
    <div style={{ background: bg, minHeight: '100vh' }}>
      {/* Hero */}
      <section className="max-w-7xl mx-auto px-6 pt-16 pb-12 text-center">
        <div className="inline-flex items-center gap-2 bg-purple-500/20 border border-purple-500/30 text-purple-300 text-xs font-bold px-4 py-2 rounded-full mb-6 tracking-widest uppercase">
          💜 BTS · ARIRANG · March 20, 2026
        </div>
        <h1
          className="text-5xl md:text-7xl font-bold text-white mb-4 leading-tight"
          style={{ fontFamily: 'Playfair Display, Georgia, serif' }}
        >
          아리랑
        </h1>
        <p className="text-purple-200/60 text-lg mb-2">방탄소년단</p>
        <p className="text-purple-300/50 text-sm max-w-xl mx-auto mb-12">
          The full group comeback. All 7 members back. The most anticipated BTS album since Map of the Soul: 7.
        </p>

        {/* Countdown */}
        {!countdown.dropped ? (
          <div>
            <p className="text-purple-400/60 text-xs font-bold tracking-widest uppercase mb-6">Dropping in</p>
            <div className="flex items-center justify-center gap-3 md:gap-6">
              <CountdownUnit value={countdown.days} label="Days" />
              <span className="text-purple-400/50 text-3xl font-thin mb-6">:</span>
              <CountdownUnit value={countdown.hours} label="Hours" />
              <span className="text-purple-400/50 text-3xl font-thin mb-6">:</span>
              <CountdownUnit value={countdown.minutes} label="Mins" />
              <span className="text-purple-400/50 text-3xl font-thin mb-6">:</span>
              <CountdownUnit value={countdown.seconds} label="Secs" />
            </div>
          </div>
        ) : (
          <div className="inline-flex items-center gap-3 bg-purple-500/20 border border-purple-400/40 rounded-2xl px-8 py-4">
            <span className="text-3xl">💜</span>
            <span className="text-white text-2xl font-bold" style={{ fontFamily: 'Playfair Display, Georgia, serif' }}>
              ARIRANG Is Out Now
            </span>
          </div>
        )}
      </section>

      <div className="max-w-7xl mx-auto px-6 pb-24 space-y-20">

        {/* GQ Interview Feature */}
        {featuredArticle?.youtube_id && (
          <section>
            <div className="flex items-center gap-2 mb-6">
              <span className="text-purple-400">🎬</span>
              <span className="text-xs font-bold tracking-widest uppercase text-purple-400">Featured — GQ Interview</span>
            </div>
            <div className="rounded-3xl overflow-hidden border border-purple-500/20" style={{ background: 'rgba(255,255,255,0.03)' }}>
              <div className="aspect-video w-full">
                <iframe
                  className="w-full h-full"
                  src={`https://www.youtube.com/embed/${featuredArticle.youtube_id}`}
                  title={featuredArticle.title}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
              <div className="p-6 md:p-8">
                <span className="text-xs font-bold text-purple-400/60 tracking-widest uppercase">GQ · Mar 2026</span>
                <h2 className="text-white text-xl font-bold mt-2 mb-2" style={{ fontFamily: 'Playfair Display, Georgia, serif' }}>
                  {featuredArticle.title}
                </h2>
                <p className="text-purple-200/60 text-sm leading-relaxed max-w-3xl">{featuredArticle.excerpt}</p>
              </div>
            </div>
          </section>
        )}

        {/* Tracklist Speculation */}
        <section>
          <div className="flex items-center gap-2 mb-2">
            <Music size={16} className="text-purple-400" />
            <span className="text-xs font-bold tracking-widest uppercase text-purple-400">Tracklist Speculation</span>
          </div>
          <p className="text-purple-300/40 text-xs mb-6">Community analysis based on teasers, interviews, and pattern data. Confidence is ARMY consensus.</p>
          <div className="space-y-2">
            {TRACKLIST_SPECULATION.map((track) => {
              const tagStyle = MEMBER_TAG_STYLES[track.member] || MEMBER_TAG_STYLES.Group
              return (
                <div
                  key={track.track}
                  className="flex items-start gap-4 p-5 rounded-2xl border border-purple-500/15 hover:border-purple-500/30 transition-all group"
                  style={{ background: 'rgba(255,255,255,0.025)' }}
                >
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 bg-purple-900/40 border border-purple-500/20">
                    <span className="text-xs font-bold text-purple-400">{track.track}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="text-white font-semibold text-sm">{track.title}</span>
                      {track.confirmed && (
                        <CheckCircle size={13} className="text-green-400" />
                      )}
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-lg border ${tagStyle}`}>
                        {track.member}
                      </span>
                      <span className="text-purple-400/40 text-xs">{track.type}</span>
                    </div>
                    <p className="text-purple-200/50 text-xs leading-relaxed">{track.notes}</p>
                  </div>
                  <div className="flex-shrink-0 text-right">
                    <div className="text-white font-bold text-sm">{track.confidence}%</div>
                    <div className="text-purple-400/40 text-xs">confidence</div>
                    <div className="w-20 h-1 bg-purple-900/60 rounded-full mt-1.5 overflow-hidden">
                      <div
                        className="h-full bg-purple-500 rounded-full"
                        style={{ width: `${track.confidence}%` }}
                      />
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        {/* Top ARIRANG Predictions */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Flame size={16} className="text-purple-400" />
              <span className="text-xs font-bold tracking-widest uppercase text-purple-400">ARIRANG Predictions</span>
            </div>
            <Link
              to="/predictions"
              className="flex items-center gap-1.5 text-purple-400 hover:text-purple-300 text-xs font-semibold no-underline transition-colors"
            >
              All predictions <ArrowRight size={13} />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {arirangPredictions.map((p) => (
              <div
                key={p.id}
                className="p-5 rounded-2xl border border-purple-500/15 hover:border-purple-500/30 transition-all"
                style={{ background: 'rgba(255,255,255,0.025)' }}
              >
                <div className="flex items-center gap-2 mb-3 flex-wrap">
                  {p.member && (
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-lg border ${MEMBER_TAG_STYLES[p.member] || MEMBER_TAG_STYLES.Group}`}>
                      💜 {p.member}
                    </span>
                  )}
                  <span className="text-purple-400/40 text-xs">{p.category}</span>
                  <span className="flex items-center gap-1 text-xs text-orange-300/70 ml-auto">
                    <Flame size={10} /> {p.vote_count}
                  </span>
                </div>
                <p className="text-white text-sm font-medium leading-snug mb-3">{p.title}</p>
                <div>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-purple-400/50">ARMY confidence</span>
                    <span className="text-white font-bold">{p.confidence_avg}%</span>
                  </div>
                  <div className="h-1.5 bg-purple-900/60 rounded-full overflow-hidden">
                    <div className="h-full bg-purple-500 rounded-full" style={{ width: `${p.confidence_avg}%` }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-6">
            <Link
              to="/predictions"
              className="inline-flex items-center gap-2 px-8 py-3 bg-purple-600 hover:bg-purple-500 text-white rounded-2xl text-sm font-bold transition-all no-underline active:scale-[0.98]"
            >
              File Your Own Prediction <TrendingUp size={16} />
            </Link>
          </div>
        </section>

        {/* Upcoming Events */}
        <section>
          <div className="flex items-center gap-2 mb-6">
            <Clock size={16} className="text-purple-400" />
            <span className="text-xs font-bold tracking-widest uppercase text-purple-400">Timeline</span>
          </div>
          <div className="space-y-3">
            {upcomingEvents.map((event) => (
              <div
                key={event.id}
                className="flex items-start gap-4 p-5 rounded-2xl border border-purple-500/15 hover:border-purple-500/30 transition-all"
                style={{ background: 'rgba(255,255,255,0.025)' }}
              >
                <div className="text-2xl flex-shrink-0 mt-0.5">{EVENT_ICONS[event.type]}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-lg border ${EVENT_BADGE[event.type]}`}>
                      {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                    </span>
                    {!event.confirmed && (
                      <span className="text-xs text-orange-400/70 font-medium">Unconfirmed</span>
                    )}
                    {event.confirmed && (
                      <span className="flex items-center gap-1 text-xs text-green-400/70 font-medium">
                        <CheckCircle size={11} /> Confirmed
                      </span>
                    )}
                  </div>
                  <p className="text-white text-sm font-semibold mb-1">{event.title}</p>
                  <p className="text-purple-200/50 text-xs leading-relaxed">{event.description}</p>
                </div>
                <div className="flex-shrink-0 text-right">
                  <div className="text-purple-300 text-xs font-bold">{formatEventDate(event.date)}</div>
                  <div className="text-purple-400/40 text-xs">{event.time}</div>
                  {event.url && (
                    <a
                      href={event.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 mt-2 text-xs text-purple-400 hover:text-purple-300 no-underline transition-colors"
                    >
                      Watch <ExternalLink size={10} />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  )
}
