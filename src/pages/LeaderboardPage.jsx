import { Trophy } from 'lucide-react'
import { MOCK_LEADERBOARD } from '../lib/mockData'
import { usePageTitle } from '../hooks/usePageTitle'

const TITLE_COLORS = {
  'Timeline Architect': 'bg-yellow-50 text-yellow-700 border-yellow-200',
  'High Accuracy Analyst': 'bg-purple-50 text-purple-700 border-purple-200',
  'Cultural Prophet': 'bg-blue-50 text-blue-700 border-blue-200',
  'Signal Spotter': 'bg-green-50 text-green-700 border-green-200',
  'Emerging Theorist': 'bg-gray-50 text-gray-600 border-gray-200',
}

const RANK_BG = ['bg-yellow-400', 'bg-gray-300', 'bg-amber-600']

function getWinRate(correct, total) {
  if (!total) return 0
  return Math.round((correct / total) * 100)
}

function TitleBadge({ title }) {
  const style = TITLE_COLORS[title] || TITLE_COLORS['Emerging Theorist']
  return (
    <span className={`text-xs px-2 py-0.5 rounded-lg border font-medium ${style}`}>{title}</span>
  )
}

export default function LeaderboardPage() {
  usePageTitle('Leaderboard')
  const top3 = MOCK_LEADERBOARD.slice(0, 3)
  const rest = MOCK_LEADERBOARD.slice(3)

  const podiumOrder = [top3[1], top3[0], top3[2]]
  const podiumRanks = [2, 1, 3]

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Trophy size={24} className="text-red-500" />
        </div>
        <h1
          className="text-4xl font-bold text-gray-900 mb-2"
          style={{ fontFamily: 'Playfair Display, Georgia, serif' }}
        >
          Society Rankings
        </h1>
        <p className="text-gray-500">Analysts ranked by prediction accuracy</p>
      </div>

      {/* Top 3 Podium */}
      <div className="grid grid-cols-3 gap-4 mb-10">
        {podiumOrder.map((analyst, i) => {
          const rank = podiumRanks[i]
          if (!analyst) return <div key={i} />
          const titleStyle = TITLE_COLORS[analyst.title] || TITLE_COLORS['Emerging Theorist']
          const winRate = getWinRate(analyst.correct_predictions, analyst.total_predictions)

          return (
            <div
              key={analyst.id}
              className={`flex flex-col items-center text-center p-6 bg-white rounded-3xl border transition-all ${
                rank === 1
                  ? 'border-red-200 shadow-lg ring-2 ring-red-500/20'
                  : 'border-gray-200'
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold mb-3 ${RANK_BG[rank - 1]}`}
              >
                {rank}
              </div>
              <div
                className={`w-14 h-14 rounded-full flex items-center justify-center mb-3 ${
                  rank === 1 ? 'bg-red-100' : 'bg-gray-100'
                }`}
              >
                <span
                  className={`text-xl font-bold ${rank === 1 ? 'text-red-600' : 'text-gray-600'}`}
                >
                  {analyst.display_name[0]}
                </span>
              </div>
              <div className="font-semibold text-gray-900 text-sm mb-2">
                {analyst.display_name}
              </div>
              <span className={`text-xs px-2 py-1 rounded-lg border mb-3 font-medium ${titleStyle}`}>
                {analyst.title}
              </span>
              <div className="text-2xl font-bold text-gray-900">
                {analyst.correct_predictions}
              </div>
              <div className="text-xs text-gray-400 mb-1">correct</div>
              <div className={`text-sm font-semibold ${winRate >= 70 ? 'text-green-600' : winRate >= 50 ? 'text-amber-600' : 'text-red-500'}`}>
                {winRate}% win rate
              </div>
            </div>
          )
        })}
      </div>

      {/* Full Rankings Table */}
      <div className="bg-white rounded-3xl border border-gray-200 overflow-hidden mb-8">
        <div className="px-6 py-4 border-b border-gray-100 grid grid-cols-12 gap-4">
          <div className="col-span-1 text-xs text-gray-400 font-semibold uppercase tracking-wide">#</div>
          <div className="col-span-5 text-xs text-gray-400 font-semibold uppercase tracking-wide">Analyst</div>
          <div className="col-span-3 text-xs text-gray-400 font-semibold uppercase tracking-wide text-center">Correct</div>
          <div className="col-span-3 text-xs text-gray-400 font-semibold uppercase tracking-wide text-center">Win Rate</div>
        </div>
        {rest.map((analyst, i) => {
          const rank = i + 4
          const winRate = getWinRate(analyst.correct_predictions, analyst.total_predictions)
          return (
            <div
              key={analyst.id}
              className="px-6 py-4 border-b border-gray-50 last:border-b-0 grid grid-cols-12 gap-4 items-center hover:bg-gray-50 transition-colors"
            >
              <div className="col-span-1 text-sm text-gray-500 font-medium">{rank}</div>
              <div className="col-span-5 flex items-center gap-3">
                <div className="w-9 h-9 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-semibold text-gray-600">
                    {analyst.display_name[0]}
                  </span>
                </div>
                <div>
                  <div className="font-semibold text-sm text-gray-900">{analyst.display_name}</div>
                  <TitleBadge title={analyst.title} />
                </div>
              </div>
              <div className="col-span-3 text-center">
                <span className="text-sm font-bold text-gray-900">{analyst.correct_predictions}</span>
                <span className="text-xs text-gray-400 ml-1">/ {analyst.total_predictions}</span>
              </div>
              <div className="col-span-3 text-center">
                <span
                  className={`text-sm font-bold ${
                    winRate >= 70
                      ? 'text-green-600'
                      : winRate >= 50
                      ? 'text-amber-600'
                      : 'text-red-500'
                  }`}
                >
                  {winRate}%
                </span>
              </div>
            </div>
          )
        })}
      </div>

      {/* Title progression legend */}
      <div className="bg-white rounded-3xl border border-gray-200 p-6">
        <h3
          className="font-bold text-gray-900 mb-5 text-base"
          style={{ fontFamily: 'Playfair Display, Georgia, serif' }}
        >
          Analyst Title Progression
        </h3>
        <div className="space-y-3">
          {[
            { title: 'Emerging Theorist', min: 0, desc: 'Starting rank' },
            { title: 'Signal Spotter', min: 3, desc: '3+ correct predictions' },
            { title: 'Cultural Prophet', min: 7, desc: '7+ correct predictions' },
            { title: 'High Accuracy Analyst', min: 15, desc: '15+ correct predictions' },
            { title: 'Timeline Architect', min: 30, desc: '30+ correct predictions' },
          ].map(({ title, desc }) => {
            const style = TITLE_COLORS[title] || TITLE_COLORS['Emerging Theorist']
            return (
              <div key={title} className="flex items-center justify-between gap-4">
                <span className={`text-xs px-3 py-1.5 rounded-xl border font-medium ${style}`}>
                  {title}
                </span>
                <span className="text-xs text-gray-400">{desc}</span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
