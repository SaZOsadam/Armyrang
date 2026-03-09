import { useState } from 'react'
import { Plus, X, Loader2 } from 'lucide-react'
import PredictionCard from '../components/PredictionCard'
import ConfidenceSlider from '../components/ConfidenceSlider'
import { CATEGORIES, BTS_MEMBERS } from '../lib/mockData'
import { useAuth } from '../contexts/AuthContext'
import { Link } from 'react-router-dom'
import { usePageTitle } from '../hooks/usePageTitle'
import { usePredictions } from '../hooks/usePredictions'

export default function PredictionsPage() {
  usePageTitle('Predictions')
  const { user, profile, isAnalyst } = useAuth()
  const { predictions, loading, createPrediction, castVote } = usePredictions()
  const [activeCategory, setActiveCategory] = useState('All')
  const [activeMember, setActiveMember] = useState('all')
  const [votingPrediction, setVotingPrediction] = useState(null)
  const [confidence, setConfidence] = useState(50)
  const [voteLoading, setVoteLoading] = useState(false)
  const [showCreate, setShowCreate] = useState(false)
  const [createLoading, setCreateLoading] = useState(false)
  const [newPrediction, setNewPrediction] = useState({
    title: '',
    description: '',
    category: 'Market Analysis',
    member: 'Group',
  })

  const filtered = predictions.filter((p) => {
    const catMatch = activeCategory === 'All' || p.category === activeCategory
    const memberMatch = activeMember === 'all' || p.member === activeMember
    return catMatch && memberMatch
  })

  async function handleVote() {
    if (!user) return
    setVoteLoading(true)
    await castVote(votingPrediction.id, confidence, user.id)
    setVoteLoading(false)
    setVotingPrediction(null)
    setConfidence(50)
  }

  async function handleCreate(e) {
    e.preventDefault()
    if (!user) return
    setCreateLoading(true)
    await createPrediction(newPrediction, user.id)
    setCreateLoading(false)
    setShowCreate(false)
    setNewPrediction({ title: '', description: '', category: 'Market Analysis', member: 'Group' })
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      {/* Header */}
      <div className="flex items-start justify-between mb-10">
        <div>
          <h1
            className="text-4xl font-bold text-gray-900 mb-2"
            style={{ fontFamily: 'Playfair Display, Georgia, serif' }}
          >
            Prediction Ledger
          </h1>
          <p className="text-gray-500">Community cultural predictions and confidence signals</p>
        </div>
        {isAnalyst ? (
          <button
            onClick={() => setShowCreate(true)}
            className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-2xl font-semibold hover:bg-red-700 hover:shadow-lg transition-all text-sm active:scale-[0.98]"
          >
            <Plus size={17} /> New Prediction
          </button>
        ) : !user ? (
          <Link
            to="/auth"
            className="flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-2xl font-semibold hover:bg-gray-800 transition-all text-sm no-underline"
          >
            Join to Predict
          </Link>
        ) : null}
      </div>

      {/* Member filter */}
      <div className="mb-4">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">Filter by Member</p>
        <div className="flex gap-2 flex-wrap">
          {BTS_MEMBERS.map((m) => (
            <button
              key={m.id}
              onClick={() => setActiveMember(m.id)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all border ${
                activeMember === m.id
                  ? 'bg-purple-600 text-white border-purple-600 shadow-sm'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-purple-300 hover:text-purple-700'
              }`}
            >
              <span>{m.emoji}</span> {m.label}
            </button>
          ))}
        </div>
      </div>

      {/* Category filter */}
      <div className="flex gap-2 flex-wrap mb-8">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all border ${
              activeCategory === cat
                ? 'bg-gray-900 text-white border-gray-900'
                : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300 hover:text-gray-900'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Cards grid */}
      {loading ? (
        <div className="flex items-center justify-center py-24 gap-3 text-gray-400">
          <Loader2 size={22} className="animate-spin" />
          <span className="text-sm">Loading predictions...</span>
        </div>
      ) : filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filtered.map((prediction) => (
            <PredictionCard
              key={prediction.id}
              prediction={prediction}
              onVote={
                isAnalyst
                  ? () => {
                      setVotingPrediction(prediction)
                      setConfidence(50)
                    }
                  : undefined
              }
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-24 text-gray-400">
          <div className="text-5xl mb-4">🔭</div>
          <p className="font-medium text-lg text-gray-500">No predictions in this category yet</p>
          <p className="text-sm mt-1">Recent observations will appear here</p>
        </div>
      )}

      {/* Vote Modal */}
      {votingPrediction && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: 'rgba(0,0,0,0.3)', backdropFilter: 'blur(4px)' }}
        >
          <div className="bg-white rounded-3xl border border-gray-200 p-8 w-full max-w-md shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <h2
                className="font-bold text-gray-900 text-lg"
                style={{ fontFamily: 'Playfair Display, Georgia, serif' }}
              >
                Cast Your Signal
              </h2>
              <button
                onClick={() => setVotingPrediction(null)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-all"
              >
                <X size={18} />
              </button>
            </div>
            <p className="text-sm text-gray-600 mb-6 leading-relaxed italic">
              "{votingPrediction.title}"
            </p>
            <ConfidenceSlider
              value={confidence}
              onChange={setConfidence}
              onSubmit={handleVote}
              loading={voteLoading}
            />
          </div>
        </div>
      )}

      {/* Create Prediction Modal */}
      {showCreate && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: 'rgba(0,0,0,0.3)', backdropFilter: 'blur(4px)' }}
        >
          <div className="bg-white rounded-3xl border border-gray-200 p-8 w-full max-w-md shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <h2
                className="font-bold text-gray-900 text-lg"
                style={{ fontFamily: 'Playfair Display, Georgia, serif' }}
              >
                File a Prediction
              </h2>
              <button
                onClick={() => setShowCreate(false)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-all"
              >
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Prediction
                </label>
                <input
                  type="text"
                  value={newPrediction.title}
                  onChange={(e) => setNewPrediction({ ...newPrediction, title: e.target.value })}
                  placeholder="Your cultural prediction..."
                  required
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Analysis
                </label>
                <textarea
                  value={newPrediction.description}
                  onChange={(e) =>
                    setNewPrediction({ ...newPrediction, description: e.target.value })
                  }
                  placeholder="Analytical observations supporting this prediction..."
                  rows={3}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Category
                </label>
                <select
                  value={newPrediction.category}
                  onChange={(e) =>
                    setNewPrediction({ ...newPrediction, category: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                >
                  {CATEGORIES.filter((c) => c !== 'All').map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Member</label>
                <select
                  value={newPrediction.member}
                  onChange={(e) => setNewPrediction({ ...newPrediction, member: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                >
                  {['Group','RM','Jin','Suga','J-Hope','Jimin','V','Jungkook'].map((m) => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              </div>
              <button
                type="submit"
                disabled={createLoading}
                className="w-full py-4 bg-red-600 text-white rounded-2xl font-semibold hover:bg-red-700 hover:shadow-lg transition-all active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {createLoading && <Loader2 size={16} className="animate-spin" />}
                {createLoading ? 'Filing...' : 'File Prediction'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
