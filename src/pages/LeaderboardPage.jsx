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
      <div className="text-center mb-2">
        <p className="text-xs font-bold tracking-[0.15em] uppercase text-red-400 mb-2">Hall of Records</p>
        <h1 className="font-serif text-2xl font-bold text-gray-900 mb-2">The Leaderboard</h1>
        <p className="text-sm text-gray-400">Ranked by correct predictions. The most accurate analysts, recognised.</p>
      </div>

      {/* Title Legend */}
      <div className="bg-white rounded-2xl border border-purple-100/50 p-5">
        <p className="text-[10px] font-black tracking-[0.2em] uppercase text-purple-400 mb-3">Analyst Titles</p>
        <div className="flex flex-wrap gap-2">
          {titleThresholds.map(t => {
            const Icon = t.icon
            return (
              <div key={t.title} className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-50/60 rounded-full border border-purple-100/60 text-xs">
                <Icon size={12} className={t.color} />
                <span className="text-gray-700 font-medium">{t.title}</span>
                <span className="text-gray-300 text-[10px]">{t.min}+</span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Leaderboard Table */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="bg-white/50 rounded-2xl border border-purple-100/30 p-4 animate-pulse">
              <div className="h-5 bg-purple-100 rounded w-48" />
            </div>
          ))}
        </div>
      ) : analysts.length > 0 ? (
        <div className="space-y-2">
          {analysts.map((analyst, index) => {
            const titleInfo = getTitle(analyst.correct_predictions || 0)
            const TitleIcon = titleInfo.icon
            const accuracy = getAccuracy(analyst.correct_predictions, analyst.total_predictions)
            const isTop3 = index < 3

            return (
              <div
                key={analyst.id}
                className={`flex items-center gap-4 p-4 rounded-2xl border transition-all ${
                  isTop3
                    ? 'bg-white border-purple-200/60 shadow-sm'
                    : 'bg-white/60 border-purple-100/40'
                }`}
              >
                {/* Rank */}
                <div className="w-10 text-center">
                  {index < 3
                    ? <span className="text-xl">{['\ud83e\udd47','\ud83e\udd48','\ud83e\udd49'][index]}</span>
                    : <span className="text-sm font-bold text-gray-400">#{index + 1}</span>
                  }
                </div>

                {/* Avatar */}
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm flex-shrink-0 ${
                  isTop3 ? 'bg-gradient-to-br from-purple-100 to-rose-200 text-red-600' : 'bg-purple-50 text-red-400'
                }`}>
                  {(analyst.display_name || '?').charAt(0).toUpperCase()}
                </div>

                {/* Profile info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-gray-900 truncate">{analyst.display_name}</span>
                    <span className="text-xs text-gray-400">@{analyst.username}</span>
                  </div>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <TitleIcon size={11} className={titleInfo.color} />
                    <span className={`text-xs font-medium ${titleInfo.color}`}>{titleInfo.title}</span>
                  </div>
                </div>

                {/* Stats */}
                <div className="flex items-center gap-4 sm:gap-6 text-center">
                  <div>
                    <div className="text-base font-bold text-emerald-600">{analyst.correct_predictions || 0}</div>
                    <div className="text-[10px] text-gray-400">Correct</div>
                  </div>
                  <div className="hidden sm:block">
                    <div className="text-base font-bold text-gray-600">{analyst.total_predictions || 0}</div>
                    <div className="text-[10px] text-gray-400">Total</div>
                  </div>
                  <div>
                    <div className="text-base font-bold text-red-600">{accuracy}%</div>
                    <div className="text-[10px] text-gray-400">Accuracy</div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-3xl border border-purple-100/40">
          <div className="text-4xl mb-3">🌙</div>
          <p className="font-serif text-base font-semibold text-gray-600 mb-1">No analysts ranked yet.</p>
          <p className="text-gray-400 text-sm">Armyrang awaits its first prophets.</p>
        </div>
      )}
    </div>
  )
}
