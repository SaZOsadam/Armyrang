import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { supabase, isConfigured } from '../lib/supabase'
import ConfidenceSlider from '../components/ConfidenceSlider'
import { ArrowLeft, Clock, CheckCircle, XCircle, TrendingUp, MessageCircle, Send, Shield } from 'lucide-react'

const categoryLabels = {
  market_analysis: '📊 Market Analysis',
  body_language: '🪞 Body Language Brief',
  soft_conspiracy: '🌙 Soft Conspiracy',
  prediction: '🔮 Prediction',
  general: '🕊️ General',
}

export default function PredictionDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user, profile, isAnalyst, isAdmin } = useAuth()

  const [prediction, setPrediction] = useState(null)
  const [votes, setVotes] = useState([])
  const [comments, setComments] = useState([])
  const [myVote, setMyVote] = useState(null)
  const [voteValue, setVoteValue] = useState(50)
  const [commentText, setCommentText] = useState('')
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (id) fetchAll()
  }, [id])

  async function fetchAll() {
    if (!isConfigured || !supabase) {
      setLoading(false)
      return
    }
    setLoading(true)
    try {
      const [predRes, votesRes, commentsRes] = await Promise.all([
        supabase
          .from('predictions')
          .select('*, profiles(display_name, username, title)')
          .eq('id', id)
          .single(),
        supabase
          .from('votes')
          .select('*, profiles(display_name)')
          .eq('prediction_id', id)
          .order('created_at', { ascending: false }),
        supabase
          .from('comments')
          .select('*, profiles(display_name, title)')
          .eq('prediction_id', id)
          .order('created_at', { ascending: true }),
      ])

      if (predRes.error) throw predRes.error
      setPrediction(predRes.data)
      setVotes(votesRes.data || [])
      setComments(commentsRes.data || [])

      if (user) {
        const existing = (votesRes.data || []).find(v => v.voter_id === user.id)
        if (existing) {
          setMyVote(existing)
          setVoteValue(existing.confidence_vote)
        }
      }
    } catch (err) {
      console.error('Error:', err)
    } finally {
      setLoading(false)
    }
  }

  async function handleVote() {
    if (!user || !isAnalyst) return
    setSubmitting(true)
    try {
      if (myVote) {
        const { error } = await supabase
          .from('votes')
          .update({ confidence_vote: voteValue })
          .eq('id', myVote.id)
        if (error) throw error
      } else {
        const { error } = await supabase
          .from('votes')
          .insert({ prediction_id: id, voter_id: user.id, confidence_vote: voteValue })
        if (error) throw error
      }
      await fetchAll()
    } catch (err) {
      console.error('Vote error:', err)
    } finally {
      setSubmitting(false)
    }
  }

  async function handleComment(e) {
    e.preventDefault()
    if (!user || !commentText.trim()) return
    setSubmitting(true)
    try {
      const { error } = await supabase
        .from('comments')
        .insert({ prediction_id: id, author_id: user.id, body: commentText.trim() })
      if (error) throw error
      setCommentText('')
      await fetchAll()
    } catch (err) {
      console.error('Comment error:', err)
    } finally {
      setSubmitting(false)
    }
  }

  async function handleResolve(status) {
    if (!isAdmin && prediction?.author_id !== user?.id) return
    try {
      const { error } = await supabase
        .from('predictions')
        .update({ status, resolved_at: new Date().toISOString() })
        .eq('id', id)
      if (error) throw error
      await fetchAll()
    } catch (err) {
      console.error('Resolve error:', err)
    }
  }

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto py-8">
        <div className="bg-white/50 rounded-3xl border border-purple-100/30 p-8 animate-pulse">
          <div className="h-6 bg-purple-100 rounded w-32 mb-4" />
          <div className="h-8 bg-purple-100 rounded w-3/4 mb-3" />
          <div className="h-4 bg-purple-50 rounded w-full mb-2" />
          <div className="h-4 bg-purple-50 rounded w-2/3" />
        </div>
      </div>
    )
  }

  if (!prediction) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-400">Prediction not found. 🌙</p>
        <Link to="/predictions" className="text-red-500 text-sm mt-2 inline-block no-underline">← Back to ledger</Link>
      </div>
    )
  }

  const avgConfidence = votes.length > 0
    ? Math.round(votes.reduce((sum, v) => sum + v.confidence_vote, 0) / votes.length)
    : prediction.confidence_level

  const timeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000)
    if (seconds < 60) return 'just now'
    const minutes = Math.floor(seconds / 60)
    if (minutes < 60) return `${minutes}m ago`
    const hours = Math.floor(minutes / 60)
    if (hours < 24) return `${hours}h ago`
    const days = Math.floor(hours / 24)
    return `${days}d ago`
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-red-600 transition-colors bg-transparent border-none cursor-pointer"
      >
        <ArrowLeft size={16} />
        Back
      </button>

      {/* Main Prediction Card */}
      <div className="bg-white rounded-3xl border border-purple-100/50 p-6 sm:p-8">
        {/* Category + Status */}
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-medium text-red-500 bg-purple-50 px-3 py-1.5 rounded-full border border-purple-100/60">
            {categoryLabels[prediction.category] || '🕊️ General'}
          </span>
          <div className={`flex items-center gap-1.5 text-sm font-medium ${
            prediction.status === 'open' ? 'text-amber-500' :
            prediction.status === 'resolved_correct' ? 'text-emerald-500' :
            prediction.status === 'resolved_incorrect' ? 'text-rose-400' : 'text-gray-400'
          }`}>
            {prediction.status === 'open' && <Clock size={16} />}
            {prediction.status === 'resolved_correct' && <CheckCircle size={16} />}
            {prediction.status === 'resolved_incorrect' && <XCircle size={16} />}
            {prediction.status === 'open' ? 'Open' :
             prediction.status === 'resolved_correct' ? 'Correct ✨' :
             prediction.status === 'resolved_incorrect' ? 'Incorrect' : 'Expired'}
          </div>
        </div>

        {/* Title */}
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-gray-900 mb-3 leading-tight">
          {prediction.title}
        </h1>

        {/* Author */}
        <div className="flex items-center gap-2 mb-6">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-purple-100 to-rose-200 flex items-center justify-center text-xs font-bold text-red-600">
            {(prediction.profiles?.display_name || '?').charAt(0).toUpperCase()}
          </div>
          <span className="text-sm font-medium text-gray-700">{prediction.profiles?.display_name}</span>
          {prediction.profiles?.title && (
            <span className="px-2 py-0.5 bg-purple-50 text-red-400 rounded-full text-xs border border-purple-100/60">
              {prediction.profiles.title}
            </span>
          )}
          <span className="text-gray-300">·</span>
          <span className="text-sm text-gray-400">{timeAgo(prediction.created_at)}</span>
        </div>

        {/* Body */}
        <div className="text-gray-600 leading-relaxed whitespace-pre-wrap mb-6">
          {prediction.body}
        </div>

        {/* Evidence */}
        {prediction.evidence_url && (
          <div className="mb-6 p-3 bg-amber-50 border border-amber-200 rounded-xl">
            <p className="text-xs text-amber-600 font-medium mb-1">📎 Supporting Evidence</p>
            <a href={prediction.evidence_url} target="_blank" rel="noopener noreferrer" className="text-sm text-red-600 hover:underline break-all">
              {prediction.evidence_url}
            </a>
          </div>
        )}

        {/* Confidence Stats */}
        <div className="bg-gradient-to-br from-purple-50/60 to-rose-50/40 rounded-2xl p-5 mb-6 border border-purple-100/40">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-[10px] font-black tracking-[0.2em] uppercase text-purple-400 mb-0.5">Community Signal</p>
              <span className="text-sm font-medium text-gray-700">Confidence Level</span>
            </div>
            <span className="text-3xl font-bold text-red-600">{avgConfidence}%</span>
          </div>
          <div className="w-full h-2.5 bg-white/80 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{
                width: `${avgConfidence}%`,
                backgroundColor: avgConfidence > 70 ? '#86efac' : avgConfidence > 40 ? '#fde68a' : '#fda4af'
              }}
            />
          </div>
          <div className="flex items-center justify-between mt-2 text-xs text-gray-400">
            <span>{votes.length} vote{votes.length !== 1 ? 's' : ''}</span>
            <span>Author baseline: {prediction.confidence_level}%</span>
          </div>
        </div>

        {/* Resolve Buttons (admin or author) */}
        {prediction.status === 'open' && (isAdmin || prediction.author_id === user?.id) && (
          <div className="flex items-center gap-3 p-4 bg-green-50/50 rounded-2xl border border-green-200/50 mb-6">
            <Shield size={16} className="text-emerald-500" />
            <span className="text-sm text-gray-600 flex-1">Resolve this prediction:</span>
            <button
              onClick={() => handleResolve('resolved_correct')}
              className="px-3 py-1.5 bg-emerald-500 text-white text-xs font-medium rounded-xl hover:bg-emerald-600 transition-colors"
            >
              ✓ Correct
            </button>
            <button
              onClick={() => handleResolve('resolved_incorrect')}
              className="px-3 py-1.5 bg-rose-400 text-white text-xs font-medium rounded-xl hover:bg-rose-500 transition-colors"
            >
              ✗ Incorrect
            </button>
          </div>
        )}

        {/* Vote Section */}
        {prediction.status === 'open' && user && isAnalyst && (
          <div className="p-4 bg-white/80 rounded-2xl border border-purple-100/50">
            <h3 className="text-sm font-medium text-gray-700 mb-3">
              {myVote ? 'Update Your Confidence Vote' : 'Cast Your Confidence Vote'} 🌿
            </h3>
            <ConfidenceSlider value={voteValue} onChange={setVoteValue} />
            <button
              onClick={handleVote}
              disabled={submitting}
              className="mt-3 w-full py-2.5 bg-red-600 text-white rounded-xl text-sm font-medium hover:bg-red-700 transition-colors disabled:opacity-50"
            >
              {submitting ? '...' : myVote ? 'Update Vote' : 'Submit Vote'}
            </button>
          </div>
        )}

        {prediction.status === 'open' && user && !isAnalyst && (
          <div className="p-4 bg-purple-50/50 rounded-2xl text-center text-sm text-gray-400">
            Only analysts can vote. <Link to="/profile" className="text-red-500 no-underline">Upgrade your role →</Link>
          </div>
        )}

        {!user && prediction.status === 'open' && (
          <div className="p-4 bg-purple-50/50 rounded-2xl text-center text-sm text-gray-400">
            <Link to="/auth" className="text-red-500 no-underline">Sign in</Link> to vote on this prediction.
          </div>
        )}
      </div>

      {/* Vote Distribution */}
      {votes.length > 0 && (
        <div className="bg-white rounded-3xl border border-purple-100/50 p-6">
          <p className="text-[10px] font-black tracking-[0.2em] uppercase text-purple-400 mb-1">Analyst Votes</p>
          <h2 className="font-serif text-lg font-semibold text-gray-900 mb-4">Vote Distribution</h2>
          <div className="space-y-2">
            {votes.map(vote => (
              <div key={vote.id} className="flex items-center gap-3">
                <span className="text-xs text-red-500 font-medium w-24 truncate">
                  {vote.profiles?.display_name || 'Analyst'}
                </span>
                <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${vote.confidence_vote}%`,
                      backgroundColor: vote.confidence_vote > 70 ? '#86efac' : vote.confidence_vote > 40 ? '#fde68a' : '#fecdd3'
                    }}
                  />
                </div>
                <span className="text-xs text-gray-500 font-medium w-10 text-right">{vote.confidence_vote}%</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Comments Section */}
      <div className="bg-white rounded-3xl border border-purple-100/50 p-6">
        <p className="text-[10px] font-black tracking-[0.2em] uppercase text-purple-400 mb-1">Discussion</p>
        <h2 className="font-serif text-lg font-semibold text-gray-900 mb-4">
          {comments.length > 0 ? `${comments.length} Observation${comments.length !== 1 ? 's' : ''}` : 'Add an Observation'}
        </h2>

        {comments.length > 0 ? (
          <div className="space-y-3 mb-6">
            {comments.map(comment => (
              <div key={comment.id} className="p-4 bg-purple-50/40 rounded-2xl border border-purple-100/40">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-sm font-medium text-red-600">{comment.profiles?.display_name}</span>
                  {comment.profiles?.title && (
                    <span className="text-xs text-gray-400">{comment.profiles.title}</span>
                  )}
                  <span className="text-xs text-gray-300">{timeAgo(comment.created_at)}</span>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">{comment.body}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-300 mb-4">No discussion yet. Be the first to share an observation. 🌸</p>
        )}

        {user ? (
          <form onSubmit={handleComment} className="flex gap-2">
            <input
              type="text"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Add an observation..."
              className="flex-1 px-4 py-2.5 bg-white/60 border border-purple-100/60 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-300 transition-all"
            />
            <button
              type="submit"
              disabled={submitting || !commentText.trim()}
              className="px-4 py-2.5 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors disabled:opacity-50"
            >
              <Send size={16} />
            </button>
          </form>
        ) : (
          <p className="text-sm text-gray-400 text-center">
            <Link to="/auth" className="text-red-500 no-underline">Sign in</Link> to join the discussion.
          </p>
        )}
      </div>
    </div>
  )
}
