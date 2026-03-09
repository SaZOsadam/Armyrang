import { useState } from 'react'
import { Navigate } from 'react-router-dom'
import { Eye, EyeOff } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { isConfigured } from '../lib/supabase'
import { usePageTitle } from '../hooks/usePageTitle'

export default function AuthPage() {
  const [tab, setTab] = useState('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')
  const [role, setRole] = useState('observer')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  usePageTitle('Join the Society')
  const { user, signIn, signUp } = useAuth()

  if (user) return <Navigate to="/" replace />

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!isConfigured) {
      setError('Supabase is not configured. Please set up your .env file with valid credentials.')
      return
    }

    setLoading(true)
    if (tab === 'login') {
      const { error } = await signIn(email, password)
      if (error) setError(error.message)
    } else {
      if (!username.trim()) {
        setError('Username is required')
        setLoading(false)
        return
      }
      const { error } = await signUp(email, password, username, role)
      if (error) setError(error.message)
      else setSuccess('Check your email to confirm your account.')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="text-5xl mb-4">🔭</div>
          <h1
            className="text-2xl font-bold text-gray-900"
            style={{ fontFamily: 'Playfair Display, Georgia, serif' }}
          >
            The Armyrang Society
          </h1>
          <p className="text-gray-500 text-sm mt-1">Cultural intelligence platform</p>
        </div>

        <div className="bg-white rounded-3xl border border-gray-200 p-8 shadow-sm">
          {/* Tabs */}
          <div className="flex bg-gray-100 rounded-2xl p-1 mb-6">
            {[
              { key: 'login', label: 'Sign In' },
              { key: 'signup', label: 'Join Society' },
            ].map(({ key, label }) => (
              <button
                key={key}
                onClick={() => { setTab(key); setError(''); setSuccess('') }}
                className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  tab === key
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {tab === 'signup' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Username</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="analyst_name"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="analyst@society.com"
                required
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full px-4 py-3 pr-12 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {tab === 'signup' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Join as</label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { value: 'observer', label: 'Observer', desc: 'Browse & follow predictions', emoji: '👁️' },
                    { value: 'analyst', label: 'Analyst', desc: 'Predict, vote & rank', emoji: '🔭' },
                  ].map(({ value, label, desc, emoji }) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setRole(value)}
                      className={`p-4 rounded-2xl border-2 text-left transition-all ${
                        role === value
                          ? 'border-red-500 bg-red-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="text-xl mb-1">{emoji}</div>
                      <div className="font-semibold text-sm text-gray-900">{label}</div>
                      <div className="text-xs text-gray-500 mt-0.5">{desc}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {!isConfigured && (
              <div className="text-amber-700 text-sm bg-amber-50 border border-amber-100 rounded-xl px-4 py-3">
                ⚠️ Demo mode — configure Supabase in{' '}
                <code className="font-mono text-xs bg-amber-100 px-1 rounded">.env</code> to enable authentication.
              </div>
            )}

            {error && (
              <div className="text-red-600 text-sm bg-red-50 border border-red-100 rounded-xl px-4 py-3">
                {error}
              </div>
            )}

            {success && (
              <div className="text-green-700 text-sm bg-green-50 border border-green-100 rounded-xl px-4 py-3">
                {success}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-red-600 text-white rounded-2xl font-semibold hover:bg-red-700 hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
            >
              {loading ? 'Please wait...' : tab === 'login' ? 'Sign In' : 'Join the Society'}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-gray-400 mt-6">
          Analytical discourse. Collective intelligence. Refined aesthetics.
        </p>
      </div>
    </div>
  )
}
