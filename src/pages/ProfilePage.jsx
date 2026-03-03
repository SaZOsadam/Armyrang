import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { supabase, isConfigured } from '../lib/supabase'
import PredictionCard from '../components/PredictionCard'
import { User, Edit3, Save, TrendingUp, Eye, Trophy, Target } from 'lucide-react'

export default function ProfilePage() {
  const { user, profile, updateProfile, isAnalyst } = useAuth()
  const [myPredictions, setMyPredictions] = useState([])
  const [editing, setEditing] = useState(false)
  const [displayName, setDisplayName] = useState('')
  const [wantRole, setWantRole] = useState('')
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (profile) {
      setDisplayName(profile.display_name || '')
      setWantRole(profile.role)
    }
    if (user) fetchMyPredictions()
  }, [user, profile])

  async function fetchMyPredictions() {
    if (!isConfigured || !supabase) {
      setLoading(false)
      return
    }
    try {
      const { data } = await supabase
        .from('predictions')
        .select('*, profiles(display_name, username)')
        .eq('author_id', user.id)
        .order('created_at', { ascending: false })
      setMyPredictions(data || [])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  async function handleSave() {
    setSaving(true)
    try {
      await updateProfile({
        display_name: displayName.trim(),
        role: wantRole,
      })
      setEditing(false)
    } catch (err) {
      console.error(err)
    } finally {
      setSaving(false)
    }
  }

  if (!user) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-400 text-sm">Please <Link to="/auth" className="text-red-500 no-underline">sign in</Link> to view your profile.</p>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="text-center py-16">
        <div className="animate-pulse text-gray-300">Loading profile...</div>
      </div>
    )
  }

  const accuracy = profile.total_predictions > 0
    ? Math.round((profile.correct_predictions / profile.total_predictions) * 100)
    : 0

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Profile Card */}
      <div className="bg-white rounded-3xl border border-lavender-100/50 p-6 sm:p-8">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-lavender-100 to-rose-200 flex items-center justify-center text-2xl font-bold text-red-600 font-serif">
              {(profile.display_name || '?').charAt(0).toUpperCase()}
            </div>
            <div>
              {editing ? (
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="text-xl font-serif font-bold text-gray-900 bg-lavender-50 border border-lavender-200 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-red-300"
                />
              ) : (
                <h1 className="font-serif text-xl font-bold text-gray-900">{profile.display_name}</h1>
              )}
              <p className="text-sm text-gray-400">@{profile.username}</p>
              <div className="flex items-center gap-2 mt-1">
                {editing ? (
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setWantRole('analyst')}
                      className={`px-3 py-1 rounded-full text-xs font-medium border transition-all ${
                        wantRole === 'analyst'
                          ? 'bg-red-100 text-red-700 border-red-300'
                          : 'bg-white text-gray-400 border-gray-200 hover:border-red-200'
                      }`}
                    >
                      <TrendingUp size={10} className="inline mr-1" />Analyst
                    </button>
                    <button
                      type="button"
                      onClick={() => setWantRole('observer')}
                      className={`px-3 py-1 rounded-full text-xs font-medium border transition-all ${
                        wantRole === 'observer'
                          ? 'bg-red-100 text-red-700 border-red-300'
                          : 'bg-white text-gray-400 border-gray-200 hover:border-red-200'
                      }`}
                    >
                      <Eye size={10} className="inline mr-1" />Observer
                    </button>
                  </div>
                ) : (
                  <>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      profile.role === 'admin' ? 'bg-rose-100 text-rose-600' :
                      profile.role === 'analyst' ? 'bg-red-100 text-red-600' :
                      'bg-gray-100 text-gray-500'
                    }`}>
                      {profile.role === 'analyst' && <TrendingUp size={10} className="inline mr-1" />}
                      {profile.role === 'observer' && <Eye size={10} className="inline mr-1" />}
                      {profile.role}
                    </span>
                    <span className="px-2 py-0.5 bg-lavender-50 text-red-400 rounded-full text-xs">
                      {profile.title || 'Emerging Theorist'}
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>

          {editing ? (
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-1.5 px-4 py-2 bg-red-600 text-white rounded-xl text-sm font-medium hover:bg-red-700 transition-colors disabled:opacity-50 shadow-sm shadow-red-200/40"
            >
              <Save size={13} />
              {saving ? 'Saving...' : 'Save'}
            </button>
          ) : (
            <button
              onClick={() => setEditing(true)}
              className="flex items-center gap-1.5 px-4 py-2 bg-lavender-50 text-red-500 rounded-xl text-sm font-medium hover:bg-lavender-100 transition-colors border border-lavender-100"
            >
              <Edit3 size={13} />
              Edit
            </button>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { emoji: '🔮', label: 'Predictions', value: profile.total_predictions || 0, color: 'text-gray-900' },
            { emoji: '✨', label: 'Correct', value: profile.correct_predictions || 0, color: 'text-emerald-600' },
            { emoji: '📊', label: 'Accuracy', value: `${accuracy}%`, color: 'text-red-600' },
          ].map(({ emoji, label, value, color }) => (
            <div key={label} className="bg-lavender-50/60 rounded-2xl p-4 text-center border border-lavender-100/40">
              <div className="text-xl mb-1">{emoji}</div>
              <div className={`text-xl font-bold ${color}`}>{value}</div>
              <div className="text-xs text-gray-400 mt-0.5">{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* My Predictions */}
      {isAnalyst && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-serif text-lg font-semibold text-gray-900">My Predictions 🔮</h2>
            <Link
              to="/predictions/new"
              className="text-sm text-red-600 hover:text-red-800 font-medium no-underline"
            >
              + New
            </Link>
          </div>

          {loading ? (
            <div className="space-y-3">
              {[1, 2].map(i => (
                <div key={i} className="bg-white rounded-2xl border border-lavender-100/40 p-5">
                  <div className="skeleton h-5 w-3/4" />
                </div>
              ))}
            </div>
          ) : myPredictions.length > 0 ? (
            <div className="grid grid-cols-1 gap-4">
              {myPredictions.map(pred => (
                <PredictionCard key={pred.id} prediction={pred} showAuthor={false} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-2xl border border-lavender-100/40">
              <div className="text-3xl mb-3">🌸</div>
              <p className="font-serif text-sm font-semibold text-gray-600 mb-1">No predictions yet.</p>
              <p className="text-gray-400 text-xs">Ready to make your first observation?</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
