import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { Eye, TrendingUp, AlertCircle, CheckCircle, Loader2, Mail, Lock, UserIcon } from 'lucide-react'

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')
  const [role, setRole] = useState('observer')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState('')

  const { signIn, signUp } = useAuth()
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)

    try {
      if (isLogin) {
        await signIn(email, password)
        navigate('/')
      } else {
        if (!username.trim()) {
          setError('Please choose a username')
          setLoading(false)
          return
        }
        await signUp(email, password, username.trim(), role)
        setSuccess('Account created! Check your email to confirm, then sign in.')
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto py-12 animate-fade-in-up">
      {/* Logo + header */}
      <div className="text-center mb-8">
        <div className="text-5xl mb-4">{isLogin ? '🔮' : '🌸'}</div>
        <h1 className="font-serif text-3xl font-bold text-gray-900 mb-2">
          {isLogin ? 'Welcome Back' : 'Join the Society'}
        </h1>
        <p className="text-sm text-gray-400 leading-relaxed">
          {isLogin
            ? 'The Observatory missed you. Continue your analysis.'
            : 'Soft aesthetic. Smart gossip. Data-driven delusion.'}
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-lavender-100/60 p-6 sm:p-8 shadow-sm">
        {error && (
          <div className="flex items-start gap-2.5 p-3.5 mb-5 bg-red-50 border border-red-100 rounded-xl text-sm text-red-600 animate-slide-down">
            <AlertCircle size={16} className="mt-0.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="flex items-start gap-2.5 p-3.5 mb-5 bg-emerald-50 border border-emerald-100 rounded-xl text-sm text-emerald-700 animate-slide-down">
            <CheckCircle size={16} className="mt-0.5 shrink-0" />
            <span>{success}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {!isLogin && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Username</label>
                <div className="relative">
                  <UserIcon size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-300" />
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-lavender-50/40 border border-lavender-100/60 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-200 focus:border-red-300 focus:bg-white transition-all"
                    placeholder="Your analyst name..."
                    required
                  />
                </div>
              </div>

              {/* Role Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Choose your role</label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { key: 'analyst', emoji: '🌿', title: 'Analyst', desc: 'Predict, vote & analyse' },
                    { key: 'observer', emoji: '🕊️', title: 'Observer', desc: 'Browse & follow along' },
                  ].map(r => (
                    <button
                      key={r.key}
                      type="button"
                      onClick={() => setRole(r.key)}
                      className={`relative p-4 rounded-2xl border-2 text-left transition-all duration-200 ${
                        role === r.key
                          ? 'border-red-400 bg-lavender-50 shadow-sm'
                          : 'border-lavender-100/60 bg-white hover:border-lavender-200 hover:bg-lavender-50/40'
                      }`}
                    >
                      {role === r.key && (
                        <div className="absolute top-2.5 right-2.5 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                          <CheckCircle size={12} className="text-white" />
                        </div>
                      )}
                      <span className="text-2xl">{r.emoji}</span>
                      <div className="font-semibold text-sm mt-2 text-gray-800">{r.title}</div>
                      <div className="text-xs text-gray-400 mt-0.5">{r.desc}</div>
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
            <div className="relative">
              <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-300" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-lavender-50/40 border border-lavender-100/60 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-200 focus:border-red-300 focus:bg-white transition-all"
                placeholder="you@example.com"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
            <div className="relative">
              <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-300" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-lavender-50/40 border border-lavender-100/60 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-200 focus:border-red-300 focus:bg-white transition-all"
                placeholder="Min 6 characters"
                minLength={6}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-red-200/40 hover:shadow-lg hover:shadow-red-200/60 active:scale-[0.98] flex items-center justify-center gap-2"
          >
            {loading ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              isLogin ? 'Sign In' : 'Create Account'
            )}
          </button>
        </form>

        <div className="mt-5 pt-5 border-t border-lavender-100/60 text-center">
          <button
            onClick={() => { setIsLogin(!isLogin); setError(''); setSuccess('') }}
            className="text-sm text-gray-500 hover:text-red-600 transition-colors bg-transparent border-none cursor-pointer"
          >
            {isLogin ? (
              <>Not a member yet? <span className="text-red-600 font-medium">Join the Society</span></>
            ) : (
              <>Already observing? <span className="text-red-600 font-medium">Sign in</span></>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
