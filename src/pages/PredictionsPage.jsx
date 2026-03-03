import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { supabase, isConfigured } from '../lib/supabase'
import PredictionCard from '../components/PredictionCard'
import { Plus, Filter, Search } from 'lucide-react'

const categories = [
  { value: 'all', label: 'All', emoji: '🕊️' },
  { value: 'market_analysis', label: 'Market', emoji: '📊' },
  { value: 'body_language', label: 'Body Language', emoji: '🪞' },
  { value: 'soft_conspiracy', label: 'Conspiracy', emoji: '🌙' },
  { value: 'prediction', label: 'Predictions', emoji: '🔮' },
  { value: 'general', label: 'General', emoji: '✨' },
]

const statuses = [
  { value: 'all', label: 'All Status' },
  { value: 'open', label: 'Open' },
  { value: 'resolved_correct', label: 'Correct ✨' },
  { value: 'resolved_incorrect', label: 'Incorrect' },
]

export default function PredictionsPage() {
  const { isAnalyst } = useAuth()
  const [predictions, setPredictions] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState('all')
  const [activeStatus, setActiveStatus] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    fetchPredictions()
  }, [activeCategory, activeStatus])

  async function fetchPredictions() {
    if (!isConfigured || !supabase) {
      setLoading(false)
      return
    }
    setLoading(true)
    try {
      let query = supabase
        .from('predictions')
        .select('*, profiles(display_name, username)')
        .order('created_at', { ascending: false })

      if (activeCategory !== 'all') {
        query = query.eq('category', activeCategory)
      }
      if (activeStatus !== 'all') {
        query = query.eq('status', activeStatus)
      }

      const { data, error } = await query
      if (error) throw error
      setPredictions(data || [])
    } catch (err) {
      console.error('Error fetching predictions:', err)
    } finally {
      setLoading(false)
    }
  }

  const filteredPredictions = predictions.filter(p =>
    searchQuery === '' ||
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.body.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-bold tracking-[0.15em] uppercase text-red-400 mb-1">The Ledger</p>
          <h1 className="font-serif text-2xl font-bold text-gray-900">Prediction Archive</h1>
          <p className="text-sm text-gray-400 mt-1">Cultural observations and forecasts from the community</p>
        </div>
        {isAnalyst && (
          <Link
            to="/predictions/new"
            className="flex items-center gap-1.5 px-4 py-2.5 bg-red-600 text-white rounded-2xl text-sm font-medium hover:bg-red-700 transition-colors no-underline shadow-lg shadow-red-200/40"
          >
            <Plus size={16} />
            New Prediction
          </Link>
        )}
      </div>

      {/* Search */}
      <div className="relative">
        <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" />
        <input
          type="text"
          placeholder="Search observations..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-11 pr-4 py-3 bg-white border border-lavender-100/60 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-red-200 focus:border-transparent transition-all shadow-sm"
        />
      </div>

      {/* Category Filters */}
      <div className="flex flex-wrap gap-2">
        {categories.map(cat => (
          <button
            key={cat.value}
            onClick={() => setActiveCategory(cat.value)}
            className={`px-4 py-2 rounded-full text-xs font-semibold transition-all duration-200 ${
              activeCategory === cat.value
                ? 'bg-red-600 text-white shadow-md shadow-red-200/40'
                : 'bg-white text-gray-500 border border-lavender-100/60 hover:border-red-300/60 hover:text-red-600 hover:bg-lavender-50'
            }`}
          >
            {cat.emoji} {cat.label}
          </button>
        ))}
      </div>

      {/* Status Filters */}
      <div className="flex flex-wrap gap-2">
        {statuses.map(st => (
          <button
            key={st.value}
            onClick={() => setActiveStatus(st.value)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
              activeStatus === st.value
                ? 'bg-lavender-100 text-red-600 border border-lavender-200'
                : 'bg-white/60 text-gray-400 border border-transparent hover:bg-lavender-50 hover:text-gray-600'
            }`}
          >
            {st.label}
          </button>
        ))}
      </div>

      {/* Predictions Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="bg-white/50 rounded-2xl border border-lavender-100/30 p-5 animate-pulse">
              <div className="h-4 bg-lavender-100 rounded w-24 mb-3" />
              <div className="h-5 bg-lavender-100 rounded w-3/4 mb-2" />
              <div className="h-4 bg-lavender-50 rounded w-full mb-1" />
              <div className="h-4 bg-lavender-50 rounded w-2/3" />
            </div>
          ))}
        </div>
      ) : filteredPredictions.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredPredictions.map(pred => (
            <PredictionCard key={pred.id} prediction={pred} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-3xl border border-lavender-100/40">
          <div className="text-4xl mb-3">🌙</div>
          <p className="font-serif text-base font-semibold text-gray-600 mb-1">No signals detected.</p>
          <p className="text-gray-400 text-sm">Try adjusting your filters or search query.</p>
        </div>
      )}
    </div>
  )
}
