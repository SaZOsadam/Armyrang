import { Link } from 'react-router-dom'
import { TrendingUp, Users, Award, ArrowRight, Eye, Star } from 'lucide-react'
import PredictionCard from '../components/PredictionCard'
import { MOCK_PREDICTIONS, MOCK_STATS } from '../lib/mockData'
import { useAuth } from '../contexts/AuthContext'

export default function HomePage() {
  const { user } = useAuth()
  const featured = MOCK_PREDICTIONS.slice(0, 3)

  return (
    <div>
      {/* Hero */}
      <section className="max-w-7xl mx-auto px-6 py-24 md:py-32 text-center">
        <div className="inline-flex items-center gap-2 bg-red-50 text-red-700 text-xs font-semibold px-4 py-2 rounded-full mb-8 border border-red-100">
          🔭 Cultural Intelligence Platform
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
              <p className="text-gray-500 text-sm">Recent observations from the Society</p>
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
