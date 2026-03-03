import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { supabase, isConfigured } from '../lib/supabase'
import ConfidenceSlider from '../components/ConfidenceSlider'
import { ArrowLeft, AlertCircle } from 'lucide-react'

const categories = [
  { value: 'prediction', label: 'Prediction', emoji: '🔮', desc: 'A specific cultural forecast' },
  { value: 'market_analysis', label: 'Market Analysis', emoji: '📊', desc: 'Brand deals, sales, PR shifts' },
  { value: 'body_language', label: 'Body Language Brief', emoji: '🪞', desc: 'Red carpet & appearance reads' },
  { value: 'soft_conspiracy', label: 'Soft Conspiracy', emoji: '🌙', desc: 'Strategic timing, PR patterns' },
  { value: 'general', label: 'General', emoji: '🕊️', desc: 'Other cultural observations' },
]

export default function NewPredictionPage() {
  const navigate = useNavigate()
  const { user, isAnalyst } = useAuth()

  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [category, setCategory] = useState('prediction')
  const [confidence, setConfidence] = useState(50)
  const [evidenceUrl, setEvidenceUrl] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  if (!user || !isAnalyst) {
    return (
      <div className="max-w-lg mx-auto text-center py-16">
        <p className="text-gray-400 text-sm">Only analysts can submit predictions. 🌿</p>
      </div>
    )
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')

    if (!title.trim() || !body.trim()) {
      setError('Please fill in both title and observation body.')
      return
    }

    setLoading(true)
    try {
      const { data, error: insertError } = await supabase
        .from('predictions')
        .insert({
          author_id: user.id,
          title: title.trim(),
          body: body.trim(),
          category,
          confidence_level: confidence,
          evidence_url: evidenceUrl.trim() || null,
        })
        .select()
        .single()

      if (insertError) throw insertError
      navigate(`/predictions/${data.id}`)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-red-600 transition-colors bg-transparent border-none cursor-pointer"
      >
        <ArrowLeft size={16} />
        Back
      </button>

      <div className="bg-white rounded-3xl border border-lavender-100/50 p-6 sm:p-8">
        <p className="text-[10px] font-black tracking-[0.2em] uppercase text-red-400 mb-1">Submit a Signal</p>
        <h1 className="font-serif text-2xl font-bold text-gray-900 mb-1">New Prediction</h1>
        <p className="text-sm text-gray-400 mb-6">Frame it analytically. Submit your cultural observation for the community to assess.</p>

        {error && (
          <div className="flex items-center gap-2 p-3 mb-4 bg-rose-50 border border-rose-100 rounded-xl text-sm text-rose-600">
            <AlertCircle size={16} />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Category Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {categories.map(cat => (
                <button
                  key={cat.value}
                  type="button"
                  onClick={() => setCategory(cat.value)}
                  className={`p-3 rounded-xl border-2 text-left transition-all duration-200 ${
                    category === cat.value
                      ? 'border-red-400 bg-lavender-50 shadow-sm'
                      : 'border-lavender-100/50 bg-white hover:border-lavender-200 hover:bg-lavender-50/30'
                  }`}
                >
                  <span className="text-lg">{cat.emoji}</span>
                  <div className="text-xs font-medium text-gray-700 mt-1">{cat.label}</div>
                  <div className="text-[10px] text-gray-400 mt-0.5">{cat.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2.5 bg-white border border-lavender-100/60 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-200 transition-all shadow-sm"
              placeholder="e.g., Coordinated PR rollout suggests strategic alliance..."
              required
            />
          </div>

          {/* Body */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Observation</label>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={6}
              className="w-full px-4 py-3 bg-white border border-lavender-100/60 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-200 transition-all resize-none leading-relaxed shadow-sm"
              placeholder="Observational note:
The synchronized timing of recent appearances + coordinated media rollout suggest...

Key signals:
- Signal 1
- Signal 2

Conclusion: ..."
              required
            />
            <p className="text-xs text-gray-300 mt-1">
              Tip: Write in analytical tone. Frame as observation, not gossip. 🌸
            </p>
          </div>

          {/* Confidence */}
          <ConfidenceSlider value={confidence} onChange={setConfidence} />

          {/* Evidence URL */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Evidence Link (optional)</label>
            <input
              type="url"
              value={evidenceUrl}
              onChange={(e) => setEvidenceUrl(e.target.value)}
              className="w-full px-4 py-2.5 bg-white border border-lavender-100/60 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-200 transition-all shadow-sm"
              placeholder="https://..."
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-red-600 text-white rounded-2xl font-medium hover:bg-red-700 transition-colors disabled:opacity-50 shadow-lg shadow-red-200"
          >
            {loading ? 'Submitting...' : 'Publish Prediction ✨'}
          </button>
        </form>
      </div>
    </div>
  )
}
