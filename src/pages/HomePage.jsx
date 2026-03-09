import { Link } from 'react-router-dom'
import { TrendingUp, Users, Award, ArrowRight, Eye, Star, Flame, Calendar } from 'lucide-react'
import PredictionCard from '../components/PredictionCard'
import { MOCK_PREDICTIONS, MOCK_STATS } from '../lib/mockData'
import { useAuth } from '../contexts/AuthContext'
import { usePageTitle } from '../hooks/usePageTitle'

function useDaysUntil(targetDate) {
  const now = new Date()
  const target = new Date(targetDate)
  const diff = Math.ceil((target - now) / (1000 * 60 * 60 * 24))
  return diff > 0 ? diff : 0
}

export default function HomePage() {
  const { user } = useAuth()
  const featured = MOCK_PREDICTIONS.filter((p) => p.status === 'active').slice(0, 3)
  const signalOfDay = [...MOCK_PREDICTIONS].filter((p) => p.status === 'active').sort((a, b) => b.vote_count - a.vote_count)[0]
  usePageTitle('Home')
  const daysLeft = useDaysUntil('2026-03-20')

  return (
    <div>
      {/* ARIRANG Countdown Banner */}
      <div
        className="w-full border-b border-purple-900/30"
        style={{ background: 'linear-gradient(90deg, #0d0118 0%, #1e0a3c 50%, #0d0118 100%)' }}
      >
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <span className="text-purple-400 text-sm">💜</span>
            <span className="text-white text-sm font-semibold">
              BTS · <span className="text-purple-300">ARIRANG</span> drops March 20, 2026
            </span>
            <span className="hidden sm:inline text-purple-400/60 text-xs">방탄소년단</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar size={13} className="text-purple-400" />
            <span className="text-purple-300 text-xs font-bold tracking-widest">
              {daysLeft > 0 ? `${daysLeft} DAYS TO GO` : 'OUT NOW'}
            </span>
            <Link
              to="/predictions"
              className="ml-2 text-xs font-bold px-3 py-1 bg-purple-600 hover:bg-purple-500 text-white rounded-lg no-underline transition-all"
            >
              Make Predictions
            </Link>
          </div>
        </div>
      </div>

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-6 py-24 md:py-32 text-center">
        <div className="inline-flex items-center gap-2 bg-red-50 text-red-700 text-xs font-semibold px-4 py-2 rounded-full mb-8 border border-red-100">
          🔭 ARMY Cultural Intelligence Platform
        </div>
        <h1
          className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight"
          style={{ fontFamily: 'Playfair Display, Georgia, serif' }}
        >
          See What<br />
          <span className="text-red-600">Others Miss</span>
        </h1>
        <p className="text-xl text-gray-500 max-w-2xl mx-auto mb-12 leading-relaxed">
          Join a refined community of cultural analysts. Submit predictions, vote on confidence levels,
          and track who sees the patterns before they emerge.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          {!user ? (
            <>
              <Link
                to="/auth"
                className="px-12 py-5 bg-red-600 text-white rounded-2xl font-semibold hover:bg-red-700 hover:shadow-lg transition-all text-lg no-underline active:scale-[0.98]"
              >
                Join the Society
              </Link>
              <Link
                to="/predictions"
                className="px-12 py-5 bg-white text-gray-700 rounded-2xl font-medium hover:bg-gray-50 border border-gray-200 transition-all text-lg no-underline"
              >
                Browse Predictions
              </Link>
            </>
          ) : (
            <Link
              to="/predictions"
              className="px-12 py-5 bg-red-600 text-white rounded-2xl font-semibold hover:bg-red-700 hover:shadow-lg transition-all text-lg no-underline active:scale-[0.98]"
            >
              View Predictions
            </Link>
          )}
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-gray-100 bg-white">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Users size={18} className="text-red-500" />
                <span className="text-4xl font-bold text-gray-900">
                  {MOCK_STATS.total_analysts.toLocaleString()}
                </span>
              </div>
              <p className="text-sm text-gray-500 font-medium">Active Analysts</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <TrendingUp size={18} className="text-red-500" />
                <span className="text-4xl font-bold text-gray-900">
                  {MOCK_STATS.total_predictions.toLocaleString()}
                </span>
              </div>
              <p className="text-sm text-gray-500 font-medium">Predictions Filed</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Award size={18} className="text-red-500" />
                <span className="text-4xl font-bold text-gray-900">
                  {MOCK_STATS.avg_accuracy}%
                </span>
              </div>
              <p className="text-sm text-gray-500 font-medium">Average Accuracy</p>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 py-16 space-y-20">
        {/* Signal of the Day */}
        <div>
          <div className="flex items-center gap-2 mb-6">
            <Flame size={18} className="text-purple-500" />
            <span className="text-xs font-bold tracking-widest uppercase text-purple-600">Signal of the Day</span>
          </div>
          <div
            className="rounded-3xl p-8 md:p-10 border border-purple-200 relative overflow-hidden"
            style={{ background: 'linear-gradient(135deg, #1e0a3c 0%, #3b0764 100%)' }}
          >
            <div className="absolute top-0 right-0 w-64 h-64 opacity-10" style={{ background: 'radial-gradient(circle, #a855f7 0%, transparent 70%)' }} />
            <div className="relative">
              <div className="flex items-center gap-3 mb-5 flex-wrap">
                {signalOfDay.member && (
                  <span className="text-xs font-bold px-3 py-1.5 bg-purple-500/30 text-purple-200 border border-purple-500/40 rounded-xl">
                    💜 {signalOfDay.member}
                  </span>
                )}
                <span className="text-xs font-bold px-3 py-1.5 bg-white/10 text-white/70 border border-white/20 rounded-xl">
                  {signalOfDay.category}
                </span>
                <span className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 bg-orange-500/20 text-orange-300 border border-orange-500/30 rounded-xl">
                  <Flame size={11} /> {signalOfDay.vote_count} votes
                </span>
              </div>
              <h2
                className="text-2xl md:text-3xl font-bold text-white mb-4 leading-snug max-w-2xl"
                style={{ fontFamily: 'Playfair Display, Georgia, serif' }}
              >
                {signalOfDay.title}
              </h2>
              <p className="text-purple-200/70 text-sm leading-relaxed max-w-xl mb-6">
                {signalOfDay.description}
              </p>
              <div className="flex items-center gap-6 flex-wrap">
                <div className="flex-1 min-w-48">
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="text-purple-300/70 font-medium">ARMY confidence</span>
                    <span className="text-white font-bold">{signalOfDay.confidence_avg}%</span>
                  </div>
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-purple-400 rounded-full transition-all duration-700"
                      style={{ width: `${signalOfDay.confidence_avg}%` }}
                    />
                  </div>
                </div>
                <Link
                  to="/predictions"
                  className="flex items-center gap-2 px-6 py-3 bg-purple-500 hover:bg-purple-400 text-white rounded-2xl text-sm font-bold transition-all no-underline active:scale-[0.98]"
                >
                  Vote on this <ArrowRight size={15} />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Latest Signals */}
        <div>
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2
                className="text-3xl font-bold text-gray-900 mb-1"
                style={{ fontFamily: 'Playfair Display, Georgia, serif' }}
              >
                Latest Signals
              </h2>
              <p className="text-gray-500 text-sm">Live ARIRANG era predictions from the Society</p>
            </div>
            <Link
              to="/predictions"
              className="flex items-center gap-2 text-red-600 hover:text-red-700 text-sm font-semibold no-underline transition-colors"
            >
              View all <ArrowRight size={16} />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featured.map((prediction) => (
              <PredictionCard key={prediction.id} prediction={prediction} />
            ))}
          </div>
        </div>

        {/* How it works */}
        <div>
          <div className="text-center mb-12">
            <h2
              className="text-3xl font-bold text-gray-900 mb-3"
              style={{ fontFamily: 'Playfair Display, Georgia, serif' }}
            >
              How the Society Works
            </h2>
            <p className="text-gray-500 max-w-xl mx-auto">
              A refined process for cultural intelligence gathering
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Eye,
                step: '01',
                title: 'Observe',
                description:
                  'File cultural predictions based on your pattern recognition and analytical observations.',
              },
              {
                icon: TrendingUp,
                step: '02',
                title: 'Signal',
                description:
                  'Vote your confidence level (1–100%) on predictions to contribute to collective intelligence.',
              },
              {
                icon: Star,
                step: '03',
                title: 'Ascend',
                description:
                  'Earn titles as your predictions are confirmed. Rise from Emerging Theorist to Timeline Architect.',
              },
            ].map(({ icon: Icon, step, title, description }) => (
              <div
                key={step}
                className="text-center p-8 bg-white rounded-3xl border border-gray-200 hover:shadow-lg hover:border-gray-300 transition-all"
              >
                <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Icon size={24} className="text-red-500" />
                </div>
                <div className="text-xs text-gray-400 font-mono mb-2">{step}</div>
                <h3
                  className="font-bold text-gray-900 text-lg mb-2"
                  style={{ fontFamily: 'Playfair Display, Georgia, serif' }}
                >
                  {title}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed">{description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Banner */}
        {!user && (
          <div className="bg-gray-900 rounded-3xl p-12 text-center">
            <h2
              className="text-3xl font-bold text-white mb-3"
              style={{ fontFamily: 'Playfair Display, Georgia, serif' }}
            >
              Ready to join the Society?
            </h2>
            <p className="text-gray-400 mb-8 max-w-md mx-auto">
              Analytical discourse. Collective intelligence. Refined aesthetics.
            </p>
            <Link
              to="/auth"
              className="inline-flex items-center gap-2 px-10 py-4 bg-red-600 text-white rounded-2xl font-semibold hover:bg-red-700 hover:shadow-lg transition-all no-underline active:scale-[0.98]"
            >
              Join the Society <ArrowRight size={18} />
            </Link>
          </div>
        )}
      </section>
    </div>
  )
}
