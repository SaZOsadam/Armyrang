import { TrendingUp, Users, CheckCircle, Clock, XCircle } from 'lucide-react'

const CATEGORY_COLORS = {
  'Market Analysis': 'bg-blue-50 text-blue-700',
  'Body Language': 'bg-purple-50 text-purple-700',
  'Soft Conspiracy': 'bg-amber-50 text-amber-700',
  'Cultural Trends': 'bg-green-50 text-green-700',
  'Entertainment': 'bg-pink-50 text-pink-700',
}

const STATUS_CONFIG = {
  active: { label: 'Active', icon: Clock, color: 'text-blue-500' },
  resolved_correct: { label: 'Confirmed', icon: CheckCircle, color: 'text-green-600' },
  resolved_incorrect: { label: 'Refuted', icon: XCircle, color: 'text-red-400' },
  pending: { label: 'Pending', icon: Clock, color: 'text-amber-500' },
}

function getConfidenceColor(confidence) {
  if (confidence >= 70) return 'bg-green-500'
  if (confidence >= 45) return 'bg-amber-500'
  return 'bg-red-400'
}

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export default function PredictionCard({ prediction, onVote }) {
  const { title, description, category, status, confidence_avg, vote_count, created_at, profiles } = prediction
  const categoryColor = CATEGORY_COLORS[category] || 'bg-gray-100 text-gray-700'
  const statusConfig = STATUS_CONFIG[status] || STATUS_CONFIG.active
  const StatusIcon = statusConfig.icon

  return (
    <div className="bg-white rounded-3xl border border-gray-200 p-8 hover:shadow-lg hover:border-gray-300 transition-all duration-300 group flex flex-col gap-5">
      <div className="flex items-center justify-between gap-3">
        <span className={`text-xs font-semibold px-3 py-1.5 rounded-xl ${categoryColor}`}>
          {category}
        </span>
        <div className={`flex items-center gap-1.5 text-xs ${statusConfig.color}`}>
          <StatusIcon size={13} />
          <span className="font-medium">{statusConfig.label}</span>
        </div>
      </div>

      <h3
        className="text-gray-900 font-semibold text-lg leading-snug group-hover:text-gray-700 transition-colors"
        style={{ fontFamily: 'Playfair Display, Georgia, serif' }}
      >
        {title}
      </h3>

      {description && (
        <p className="text-gray-500 text-sm leading-relaxed overflow-hidden" style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
          {description}
        </p>
      )}

      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span className="font-medium">Community confidence</span>
          <span className="font-bold text-gray-700">{Math.round(confidence_avg)}%</span>
        </div>
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${getConfidenceColor(confidence_avg)}`}
            style={{ width: `${confidence_avg}%` }}
          />
        </div>
      </div>

      <div className="flex items-center justify-between pt-1 border-t border-gray-100">
        <div className="flex items-center gap-1.5 text-xs text-gray-400">
          <Users size={13} />
          <span>{vote_count} votes</span>
        </div>
        <div className="text-xs text-gray-400">
          {profiles?.display_name} · {formatDate(created_at)}
        </div>
      </div>

      {onVote && (
        <button
          onClick={() => onVote(prediction)}
          className="w-full flex items-center justify-center gap-2 py-3 bg-gray-50 hover:bg-red-50 hover:text-red-600 text-gray-600 rounded-2xl text-sm font-medium transition-all border border-gray-200 hover:border-red-200 active:scale-[0.98]"
        >
          <TrendingUp size={15} />
          Cast your signal
        </button>
      )}
    </div>
  )
}
