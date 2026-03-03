import { useEffect, useState } from 'react'
import { supabase, isConfigured } from '../lib/supabase'
import { Trophy, TrendingUp, Target, Star, Crown, Award } from 'lucide-react'

const titleThresholds = [
  { min: 0, title: 'Emerging Theorist', icon: Star, color: 'text-gray-400' },
  { min: 3, title: 'Signal Spotter', icon: TrendingUp, color: 'text-blue-400' },
  { min: 7, title: 'Cultural Prophet', icon: Target, color: 'text-red-500' },
  { min: 15, title: 'High Accuracy Analyst', icon: Award, color: 'text-amber-500' },
  { min: 30, title: 'Timeline Architect', icon: Crown, color: 'text-rose-500' },
]

function getTitle(correctPredictions) {
  let result = titleThresholds[0]
  for (const t of titleThresholds) {
    if (correctPredictions >= t.min) result = t
  }
  return result
}

export default function LeaderboardPage() {
  const [analysts, setAnalysts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchLeaderboard()
  }, [])

  async function fetchLeaderboard() {
    if (!isConfigured || !supabase) {
      setLoading(false)
      return
    }
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .in('role', ['analyst', 'admin'])
        .order('correct_predictions', { ascending: false })
        .limit(50)

      if (error) throw error
      setAnalysts(data || [])
    } catch (err) {
      console.error('Leaderboard error:', err)
    } finally {
      setLoading(false)
    }
  }

  const getRankEmoji = (index) => {
    if (index === 0) return '🥇'
    if (index === 1) return '🥈'
    if (index === 2) return '🥉'
    return `#${index + 1}`
  }

  const getAccuracy = (correct, total) => {
    if (!total || total === 0) return 0
    return Math.round((correct / total) * 100)
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h1 className="font-serif text-2xl font-bold text-gray-900 mb-2">Leaderboard 🏆</h1>
        <p className="text-sm text-gray-400">The most accurate cultural analysts, ranked by correct predictions.</p>
      </div>

      {/* Title Legend */}
      <div className="bg-white/60 backdrop-blur-sm rounded-2xl border border-lavender-100/50 p-4 mb-6">
        <h3 className="text-xs font-medium text-gray-500 mb-3 uppercase tracking-wider">Analyst Titles</h3>
        <div className="flex flex-wrap gap-3">
          {titleThresholds.map(t => {
            const Icon = t.icon
            return (
              <div key={t.title} className="flex items-center gap-1.5 text-xs">
                <Icon size={14} className={t.color} />
                <span className="text-gray-600 font-medium">{t.title}</span>
                <span className="text-gray-300">({t.min}+)</span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Leaderboard Table */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="bg-white/50 rounded-2xl border border-lavender-100/30 p-4 animate-pulse">
              <div className="h-5 bg-lavender-100 rounded w-48" />
            </div>
          ))}
        </div>
      ) : analysts.length > 0 ? (
        <div className="space-y-2">
          {analysts.map((analyst, index) => {
            const titleInfo = getTitle(analyst.correct_predictions || 0)
            const TitleIcon = titleInfo.icon
            const accuracy = getAccuracy(analyst.correct_predictions, analyst.total_predictions)

            return (
              <div
                key={analyst.id}
                className={`flex items-center gap-4 p-4 rounded-2xl border transition-all ${
                  index < 3
                    ? 'bg-white/80 border-lavender-200/60 shadow-sm'
                    : 'bg-white/50 border-lavender-100/40'
                }`}
              >
                {/* Rank */}
                <div className="w-10 text-center text-lg font-bold">
                  {getRankEmoji(index)}
                </div>

                {/* Profile info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-900 truncate">{analyst.display_name}</span>
                    <span className="text-xs text-gray-400">@{analyst.username}</span>
                  </div>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <TitleIcon size={12} className={titleInfo.color} />
                    <span className={`text-xs font-medium ${titleInfo.color}`}>{titleInfo.title}</span>
                  </div>
                </div>

                {/* Stats */}
                <div className="flex items-center gap-6 text-center">
                  <div>
                    <div className="text-lg font-bold text-emerald-600">{analyst.correct_predictions || 0}</div>
                    <div className="text-[10px] text-gray-400">Correct</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-gray-700">{analyst.total_predictions || 0}</div>
                    <div className="text-[10px] text-gray-400">Total</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-red-600">{accuracy}%</div>
                    <div className="text-[10px] text-gray-400">Accuracy</div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="text-center py-16 bg-white/40 rounded-3xl border border-lavender-100/30">
          <Trophy size={32} className="mx-auto text-gray-200 mb-3" />
          <p className="text-gray-400 text-sm">No analysts yet. Armyrang awaits its first prophets. 🌙</p>
        </div>
      )}
    </div>
  )
}
