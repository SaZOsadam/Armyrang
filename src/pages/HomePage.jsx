import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { supabase, isConfigured } from '../lib/supabase'
import PredictionCard from '../components/PredictionCard'
import { Eye, TrendingUp, Trophy, ArrowRight, Plus } from 'lucide-react'

export default function HomePage() {
  const { user, profile } = useAuth()
  const [recentPredictions, setRecentPredictions] = useState([])
  const [stats, setStats] = useState({ predictions: 0, analysts: 0, votes: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  async function fetchData() {
    if (!isConfigured || !supabase) {
      setLoading(false)
      return
    }
    try {
      const [predsRes, statsRes] = await Promise.all([
        supabase
          .from('predictions')
          .select('*, profiles(display_name, username)')
          .order('created_at', { ascending: false })
          .limit(6),
        supabase.from('profiles').select('id', { count: 'exact' }),
      ])

      if (predsRes.data) setRecentPredictions(predsRes.data)

      const predCountRes = await supabase.from('predictions').select('id', { count: 'exact' })
      const voteCountRes = await supabase.from('votes').select('id', { count: 'exact' })

      setStats({
        predictions: predCountRes.count || 0,
        analysts: statsRes.count || 0,
        votes: voteCountRes.count || 0,
      })
    } catch (err) {
      console.error('Error fetching data:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-16">

      {/* ── Hero ── */}
      <section className="relative text-center pt-12 pb-4 sm:pt-20 sm:pb-8">
        {/* Soft glow blobs */}
        <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-red-100/30 rounded-full blur-3xl" />
          <div className="absolute top-32 right-[5%] w-48 h-48 bg-purple-200/20 rounded-full blur-3xl" />
          <div className="absolute top-20 left-[5%] w-40 h-40 bg-rose-200/20 rounded-full blur-3xl" />
        </div>

        <div className="animate-fade-in-up max-w-3xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white border border-purple-200/60 rounded-full text-xs text-red-500 font-semibold tracking-widest uppercase shadow-sm mb-8">
            <span>🔮</span> Soft Analysts Society
          </div>

          {/* Title */}
          <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-[1.05] tracking-tight">
            Army<span className="text-red-600">rang</span>
          </h1>

          {/* Tagline trio */}
          <div className="flex items-center justify-center gap-3 sm:gap-5 text-sm sm:text-base text-gray-400 font-light mb-3">
            <span>Soft aesthetic.</span>
            <span className="text-purple-300">✦</span>
            <span>Smart gossip.</span>
            <span className="text-purple-300">✦</span>
            <span>Data-driven delusion.</span>
          </div>
          <p className="text-sm text-gray-400 italic mb-10">We are not shouting. We are observing. 👀</p>

          {/* CTAs */}
          {!user && (
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 animate-fade-in-up stagger-2">
              <Link
                to="/auth"
                className="px-8 py-3.5 bg-red-600 text-white rounded-2xl font-semibold hover:bg-red-700 transition-all duration-200 no-underline shadow-lg shadow-red-200/50 hover:shadow-xl hover:shadow-red-200/60 active:scale-[0.98] text-sm"
              >
                Join the Society
              </Link>
              <Link
                to="/predictions"
                className="px-8 py-3.5 bg-white text-gray-700 rounded-2xl font-semibold hover:bg-purple-50 transition-all duration-200 no-underline border border-purple-200/60 shadow-sm hover:shadow-md text-sm"
              >
                Browse the Ledger →
              </Link>
            </div>
          )}
          {user && profile && (
            <div className="inline-flex items-center gap-3 px-5 py-2.5 bg-white rounded-2xl text-sm text-gray-600 border border-purple-200/60 shadow-sm animate-fade-in-up stagger-2">
              <span>🌿</span>
              Welcome back, <span className="text-red-600 font-semibold">{profile.display_name}</span>
              <span className="text-xs px-2.5 py-0.5 bg-purple-50 text-red-500 rounded-full font-medium border border-purple-100">{profile.role}</span>
            </div>
          )}
        </div>
      </section>

      {/* ── Stats row ── */}
      <section className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8">
        {[
          { emoji: '🔮', label: 'Predictions', value: stats.predictions },
          { emoji: '🌿', label: 'Analysts', value: stats.analysts },
          { emoji: '🗳️', label: 'Votes Cast', value: stats.votes },
        ].map(({ emoji, label, value }, i) => (
          <div key={label} className={`flex items-center gap-4 px-6 py-4 bg-white rounded-2xl border border-purple-100/60 shadow-sm min-w-[160px] animate-fade-in-up stagger-${i + 1}`}>
            <span className="text-2xl">{emoji}</span>
            <div>
              <div className="text-2xl font-bold text-gray-900 leading-none">{value}</div>
              <div className="text-xs text-gray-400 mt-0.5 font-medium">{label}</div>
            </div>
          </div>
        ))}
      </section>

      {/* ── Recent Observations ── */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-xs font-bold tracking-[0.15em] uppercase text-red-400 mb-1">Latest Signals</p>
            <h2 className="font-serif text-2xl font-bold text-gray-900">Recent Observations</h2>
          </div>
          <Link
            to="/predictions"
            className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-red-600 transition-colors no-underline font-medium group"
          >
            View all <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="bg-white rounded-2xl border border-purple-100/40 p-5">
                <div className="skeleton h-5 w-24 mb-4" />
                <div className="skeleton h-6 w-3/4 mb-3" />
                <div className="skeleton h-4 w-full mb-2" />
                <div className="skeleton h-4 w-2/3" />
              </div>
            ))}
          </div>
        ) : recentPredictions.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recentPredictions.map((pred, i) => (
              <div key={pred.id} className={`animate-fade-in-up stagger-${Math.min(i + 1, 6)}`}>
                <PredictionCard prediction={pred} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-3xl border border-purple-100/40">
            <div className="text-5xl mb-4">🌙</div>
            <p className="font-serif text-lg font-semibold text-gray-700 mb-2">The ledger is empty.</p>
            <p className="text-gray-400 text-sm mb-6">The stage is set for the first observation.</p>
            {user && (
              <Link
                to="/predictions/new"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-red-600 text-white rounded-xl text-sm font-medium no-underline hover:bg-red-700 transition-colors shadow-md shadow-red-200/40"
              >
                <Plus size={15} />
                Submit First Prediction
              </Link>
            )}
          </div>
        )}
      </section>

      {/* ── How it works ── */}
      <section className="bg-white rounded-3xl border border-purple-100/40 p-8 sm:p-12">
        <div className="text-center mb-10">
          <p className="text-xs font-bold tracking-[0.15em] uppercase text-red-400 mb-2">The Method</p>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-gray-900">How The Observatory Works</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-6">
          {[
            {
              step: '01',
              emoji: '🕊️',
              title: 'Observe & Predict',
              desc: 'Analysts submit cultural predictions with supporting observations, framed analytically — not emotionally.',
            },
            {
              step: '02',
              emoji: '📊',
              title: 'Vote Confidence',
              desc: 'The community assigns confidence levels 1–100%. Collective signal emerges from the data.',
            },
            {
              step: '03',
              emoji: '🏆',
              title: 'Track & Rise',
              desc: 'Predictions resolve. Accurate analysts earn titles and climb the leaderboard. Elegantly.',
            },
          ].map(({ step, emoji, title, desc }, i) => (
            <div key={step} className={`relative text-center animate-fade-in-up stagger-${i + 1}`}>
              {i < 2 && (
                <div className="hidden md:block absolute top-8 right-0 w-px h-16 bg-purple-100 translate-x-3" />
              )}
              <div className="w-16 h-16 rounded-2xl bg-purple-50 flex items-center justify-center mx-auto mb-5 text-3xl">
                {emoji}
              </div>
              <div className="text-[10px] font-black tracking-[0.25em] text-purple-400 mb-2 uppercase">{step}</div>
              <h3 className="font-serif font-bold text-gray-900 mb-2 text-lg">{title}</h3>
              <p className="text-sm text-gray-400 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Aesthetic rules ── */}
      <section className="bg-gradient-to-br from-purple-50 to-rose-50 rounded-3xl border border-purple-100/60 p-8 sm:p-10">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-3xl mb-4">🌸</p>
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-gray-900 mb-4">The Aesthetic Rules</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm text-gray-500 mb-6">
            {['Soft pastels only', 'No aggressive caps', 'No dragging', 'Analytical tone'].map(r => (
              <div key={r} className="px-3 py-2.5 bg-white/80 rounded-xl border border-purple-100/60 text-xs font-medium">{r}</div>
            ))}
          </div>
          <div className="bg-white/80 rounded-2xl border border-purple-100/60 p-5 text-left">
            <p className="text-xs font-bold text-red-400 tracking-widest uppercase mb-3">Example Post Style</p>
            <p className="text-sm text-gray-500 italic leading-relaxed">
              "Observational note: The coordinated outfits + synchronized PR rollout suggest possible strategic alignment.
              <span className="text-red-500 font-semibold"> Confidence level: 72%.</span>"
            </p>
          </div>
        </div>
      </section>

    </div>
  )
}
