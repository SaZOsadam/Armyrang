import { Link } from 'react-router-dom'
import { Clock, TrendingUp, CheckCircle, XCircle, MessageCircle, ArrowUpRight } from 'lucide-react'

const categoryColors = {
  market_analysis: { bg: 'bg-blue-50', text: 'text-blue-500', border: 'border-blue-100', label: '📊 Market', emoji: '📊' },
  body_language: { bg: 'bg-rose-50', text: 'text-rose-500', border: 'border-rose-100', label: '🪞 Body Language', emoji: '🪞' },
  soft_conspiracy: { bg: 'bg-purple-50', text: 'text-purple-500', border: 'border-purple-100', label: '🌙 Conspiracy', emoji: '🌙' },
  prediction: { bg: 'bg-amber-50', text: 'text-amber-600', border: 'border-amber-100', label: '🔮 Prediction', emoji: '🔮' },
  general: { bg: 'bg-green-50', text: 'text-emerald-600', border: 'border-green-100', label: '🕊️ General', emoji: '🕊️' },
}

const statusConfig = {
  open: { icon: Clock, color: 'text-amber-500', bg: 'bg-amber-50', label: 'Open' },
  resolved_correct: { icon: CheckCircle, color: 'text-emerald-500', bg: 'bg-emerald-50', label: 'Correct' },
  resolved_incorrect: { icon: XCircle, color: 'text-rose-400', bg: 'bg-rose-50', label: 'Incorrect' },
  expired: { icon: Clock, color: 'text-gray-400', bg: 'bg-gray-50', label: 'Expired' },
}

export default function PredictionCard({ prediction, showAuthor = true }) {
  const cat = categoryColors[prediction.category] || categoryColors.general
  const status = statusConfig[prediction.status] || statusConfig.open
  const StatusIcon = status.icon
  const avgConfidence = prediction.avg_confidence || prediction.confidence_level
  const voteCount = prediction.vote_count || 0
  const commentCount = prediction.comment_count || 0

  const timeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000)
    if (seconds < 60) return 'just now'
    const minutes = Math.floor(seconds / 60)
    if (minutes < 60) return `${minutes}m`
    const hours = Math.floor(minutes / 60)
    if (hours < 24) return `${hours}h`
    const days = Math.floor(hours / 24)
    if (days < 7) return `${days}d`
    return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  const confidenceColor = avgConfidence > 70 ? '#22c55e' : avgConfidence > 40 ? '#eab308' : '#ef4444'

  return (
    <Link
      to={`/predictions/${prediction.id}`}
      className="block no-underline group"
    >
      <div className="relative bg-white rounded-2xl border border-purple-100/50 p-5 transition-all duration-300 hover:shadow-lg hover:shadow-purple-200/30 hover:-translate-y-0.5 hover:border-purple-200/60 overflow-hidden">
        {/* Hover gradient accent */}
        <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-red-400 via-purple-400 to-rose-300 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Top row: category + status */}
        <div className="flex items-center justify-between mb-3">
          <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-lg ${cat.bg} ${cat.text} border ${cat.border}`}>
            {cat.label}
          </span>
          <div className={`flex items-center gap-1.5 text-[11px] font-medium px-2 py-1 rounded-lg ${status.bg} ${status.color}`}>
            <StatusIcon size={12} />
            <span>{status.label}</span>
          </div>
        </div>

        {/* Title */}
        <h3 className="font-serif text-[17px] font-bold text-gray-900 mb-2 group-hover:text-red-600 transition-colors duration-200 leading-snug pr-6">
          {prediction.title}
        </h3>

        {/* Arrow indicator on hover */}
        <div className="absolute top-5 right-5 opacity-0 group-hover:opacity-100 transition-all duration-200 translate-x-1 group-hover:translate-x-0">
          <ArrowUpRight size={16} className="text-red-400" />
        </div>

        {/* Body preview */}
        <p className="text-sm text-gray-400 mb-4 line-clamp-2 leading-relaxed">
          {prediction.body}
        </p>

        {/* Confidence bar */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] text-gray-400 font-medium">Confidence</span>
            <span className="text-[11px] font-bold" style={{ color: confidenceColor }}>{Math.round(avgConfidence)}%</span>
          </div>
          <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${avgConfidence}%`,
                backgroundColor: confidenceColor,
              }}
            />
          </div>
        </div>

        {/* Bottom row */}
        <div className="flex items-center justify-between pt-3 border-t border-purple-100/40">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 text-[11px] text-gray-400">
              <TrendingUp size={12} />
              <span>{voteCount} votes</span>
            </div>
            <div className="flex items-center gap-1 text-[11px] text-gray-400">
              <MessageCircle size={12} />
              <span>{commentCount}</span>
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-gray-400">
            {showAuthor && prediction.profiles?.display_name && (
              <>
                <div className="w-4 h-4 rounded-full bg-gradient-to-br from-purple-100 to-rose-200 flex items-center justify-center">
                  <span className="text-[7px] font-bold text-red-500">{prediction.profiles.display_name.charAt(0).toUpperCase()}</span>
                </div>
                <span className="font-medium text-gray-500">{prediction.profiles.display_name}</span>
                <span className="text-gray-300">·</span>
              </>
            )}
            <span>{timeAgo(prediction.created_at)}</span>
          </div>
        </div>
      </div>
    </Link>
  )
}
