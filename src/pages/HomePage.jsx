import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { supabase, isConfigured } from '../lib/supabase'
import PredictionCard from '../components/PredictionCard'
import { Eye, TrendingUp, Trophy, ArrowRight, Sparkles, Zap, Target, Plus } from 'lucide-react'

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
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="relative text-center py-16 sm:py-20 overflow-hidden">
        {/* Decorative background */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-10 left-[10%] w-64 h-64 bg-red-100/40 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-[10%] w-48 h-48 bg-red-200/30 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-red-50/50 rounded-full blur-3xl" />
        </div>

        {/* Floating decorative elements */}
        <div className="absolute top-8 left-[15%] text-red-200/50 animate-float" style={{ animationDelay: '0s' }}>
          <Sparkles size={20} />
        </div>
        <div className="absolute top-16 right-[20%] text-red-200/40 animate-float" style={{ animationDelay: '1s' }}>
          <Target size={16} />
        </div>
        <div className="absolute bottom-12 left-[25%] text-red-200/40 animate-float" style={{ animationDelay: '2s' }}>
          <Zap size={14} />
        </div>

        <div className="animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-red-50 border border-red-100 rounded-full text-sm text-red-600 font-medium mb-6">
            <Sparkles size={14} />
            Cultural analysis, softly
          </div>
          <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 mb-5 leading-[1.1] tracking-tight">
            Army<span className="text-red-600">rang</span>
          </h1>
          <p className="text-lg sm:text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed mb-10">
            A refined space for cultural prediction and pop culture analysis.
            Submit observations, vote confidence, track who sees the future clearest.
          </p>
          {!user && (
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 animate-fade-in-up stagger-2">
              <Link
                to="/auth"
                className="px-7 py-3.5 bg-red-600 text-white rounded-2xl font-semibold hover:bg-red-700 transition-all duration-200 no-underline shadow-lg shadow-red-200/50 hover:shadow-xl hover:shadow-red-200/60 active:scale-[0.97] text-sm"
              >
                Join as Analyst
              </Link>
              <Link
                to="/predictions"
                className="px-7 py-3.5 bg-white text-red-600 rounded-2xl font-semibold hover:bg-red-50 transition-all duration-200 no-underline border border-red-200 shadow-sm hover:shadow-md text-sm"
              >
                Browse Predictions
              </Link>
            </div>
          )}
          {user && profile && (
            <div className="inline-flex items-center gap-3 px-5 py-2.5 bg-white rounded-2xl text-sm text-gray-600 border border-red-100 shadow-sm animate-fade-in-up stagger-2">
              Welcome back,
              <span className="text-red-600 font-semibold">{profile.display_name}</span>
              <span className="text-xs px-2.5 py-0.5 bg-red-50 text-red-600 rounded-full font-medium border border-red-100">{profile.role}</span>
            </div>
          )}
        </div>
      </section>

      {/* Stats */}
      <section className="grid grid-cols-3 gap-3 sm:gap-4 max-w-xl mx-auto">
        {[
          { icon: Eye, label: 'Predictions', value: stats.predictions, color: 'text-red-500', bg: 'bg-red-50' },
          { icon: TrendingUp, label: 'Analysts', value: stats.analysts, color: 'text-emerald-500', bg: 'bg-emerald-50' },
          { icon: Trophy, label: 'Votes Cast', value: stats.votes, color: 'text-amber-500', bg: 'bg-amber-50' },
        ].map(({ icon: Icon, label, value, color, bg }, i) => (
          <div key={label} className={`glass-card p-4 sm:p-5 text-center animate-fade-in-up stagger-${i + 1}`}>
            <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center mx-auto mb-2`}>
              <Icon size={18} className={color} />
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-gray-900">{value}</div>
            <div className="text-xs text-gray-400 mt-0.5">{label}</div>
          </div>
        ))}
      </section>

      {/* Recent Predictions */}
      <section>
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="font-serif text-xl font-bold text-gray-900">Recent Observations</h2>
            <p className="text-sm text-gray-400 mt-0.5">Latest predictions from the community</p>
          </div>
          <Link
            to="/predictions"
            className="flex items-center gap-1.5 text-sm text-red-600 hover:text-red-700 transition-colors no-underline font-medium bg-red-50 px-4 py-2 rounded-xl hover:bg-red-100"
          >
            View all <ArrowRight size={14} />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="glass-card p-5">
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
          <div className="text-center py-16 glass-card">
            <div className="w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center mx-auto mb-4">
              <Eye size={24} className="text-red-300" />
            </div>
            <p className="text-gray-500 font-medium mb-1">No predictions yet</p>
            <p className="text-gray-400 text-sm mb-4">The stage is set for the first observation.</p>
            {user && (
              <Link
                to="/predictions/new"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-red-600 text-white rounded-xl text-sm font-medium no-underline hover:bg-red-700 transition-colors shadow-md shadow-red-200/40"
              >
                <Plus size={16} />
                Be the first to predict
              </Link>
            )}
          </div>
        )}
      </section>

      {/* How it works */}
      <section className="glass-card p-8 sm:p-10">
        <div className="text-center mb-8">
          <h2 className="font-serif text-2xl font-bold text-gray-900">How It Works</h2>
          <p className="text-sm text-gray-400 mt-1">Three steps to cultural prophecy</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              step: '01',
              title: 'Observe & Predict',
              desc: 'Analysts submit cultural predictions with their confidence level and supporting observations.',
              icon: Eye,
              color: 'text-red-500',
              bg: 'bg-red-50',
            },
            {
              step: '02',
              title: 'Vote Confidence',
              desc: 'The community votes their own confidence levels. The collective signal emerges.',
              icon: TrendingUp,
              color: 'text-amber-500',
              bg: 'bg-amber-50',
            },
            {
              step: '03',
              title: 'Track & Rise',
              desc: 'Predictions get resolved. Accurate analysts earn titles and climb the leaderboard.',
              icon: Trophy,
              color: 'text-emerald-500',
              bg: 'bg-emerald-50',
            },
          ].map(({ step, title, desc, icon: Icon, color, bg }, i) => (
            <div key={step} className={`text-center animate-fade-in-up stagger-${i + 1}`}>
              <div className={`w-14 h-14 rounded-2xl ${bg} flex items-center justify-center mx-auto mb-4`}>
                <Icon size={24} className={color} />
              </div>
              <div className="text-xs text-red-400 font-bold tracking-wider mb-2">{step}</div>
              <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
              <p className="text-sm text-gray-400 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
