import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { Eye, TrendingUp, Trophy, User, LogOut, Plus, Home, Menu, X } from 'lucide-react'

export default function Layout({ children }) {
  const { user, profile, signOut, isAnalyst } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleSignOut = async () => {
    await signOut()
    setMobileOpen(false)
    navigate('/')
  }

  const navItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/predictions', icon: Eye, label: 'Predictions' },
    { path: '/leaderboard', icon: Trophy, label: 'Leaderboard' },
  ]

  const isActive = (path) => location.pathname === path

  return (
    <div className="min-h-screen flex flex-col bg-[#fdfcfb]">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-xl border-b border-lavender-100/60 sticky top-0 z-50 shadow-sm shadow-lavender-50/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 no-underline group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center shadow-md shadow-red-200/50 group-hover:shadow-lg group-hover:shadow-red-200 transition-shadow">
              <span className="text-white text-sm font-bold">AR</span>
            </div>
            <h1 className="font-serif text-xl font-bold text-gray-900 tracking-tight hidden sm:block">
              Armyrang
            </h1>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map(({ path, icon: Icon, label }) => (
              <Link
                key={path}
                to={path}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 no-underline ${
                  isActive(path)
                    ? 'bg-red-50 text-red-700 shadow-sm'
                    : 'text-gray-500 hover:text-red-600 hover:bg-red-50/50'
                }`}
              >
                <Icon size={16} />
                {label}
              </Link>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-2">
            {user ? (
              <>
                {isAnalyst && (
                  <Link
                    to="/predictions/new"
                    className="flex items-center gap-1.5 px-4 py-2 bg-red-600 text-white rounded-xl text-sm font-medium hover:bg-red-700 transition-all duration-200 no-underline shadow-md shadow-red-200/40 hover:shadow-lg hover:shadow-red-200/60 active:scale-[0.97]"
                  >
                    <Plus size={16} />
                    Predict
                  </Link>
                )}
                <Link
                  to="/profile"
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 no-underline ${
                    isActive('/profile')
                      ? 'bg-red-50 text-red-700'
                      : 'text-gray-500 hover:text-red-600 hover:bg-red-50/50'
                  }`}
                >
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-red-100 to-red-200 flex items-center justify-center">
                    <User size={12} className="text-red-600" />
                  </div>
                  <span className="max-w-[100px] truncate">{profile?.display_name || 'Profile'}</span>
                </Link>
                <button
                  onClick={handleSignOut}
                  className="p-2 text-gray-400 hover:text-red-500 transition-all duration-200 rounded-lg hover:bg-red-50 active:scale-95"
                  title="Sign out"
                >
                  <LogOut size={16} />
                </button>
              </>
            ) : (
              <Link
                to="/auth"
                className="px-5 py-2 bg-red-600 text-white rounded-xl text-sm font-medium hover:bg-red-700 transition-all duration-200 no-underline shadow-md shadow-red-200/40 hover:shadow-lg hover:shadow-red-200/60 active:scale-[0.97]"
              >
                Join
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Mobile Nav Drawer */}
        {mobileOpen && (
          <div className="md:hidden animate-slide-down border-t border-red-100/40 bg-white/95 backdrop-blur-xl">
            <div className="px-4 py-3 space-y-1">
              {navItems.map(({ path, icon: Icon, label }) => (
                <Link
                  key={path}
                  to={path}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all no-underline ${
                    isActive(path)
                      ? 'bg-red-50 text-red-700'
                      : 'text-gray-600 hover:bg-red-50/50 hover:text-red-600'
                  }`}
                >
                  <Icon size={18} />
                  {label}
                </Link>
              ))}

              {user ? (
                <>
                  <Link
                    to="/profile"
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all no-underline ${
                      isActive('/profile') ? 'bg-red-50 text-red-700' : 'text-gray-600 hover:bg-red-50/50'
                    }`}
                  >
                    <User size={18} />
                    {profile?.display_name || 'Profile'}
                  </Link>
                  {isAnalyst && (
                    <Link
                      to="/predictions/new"
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 bg-red-600 text-white rounded-xl text-sm font-medium no-underline shadow-md shadow-red-200/40"
                    >
                      <Plus size={18} />
                      New Prediction
                    </Link>
                  )}
                  <div className="pt-2 border-t border-gray-100">
                    <button
                      onClick={handleSignOut}
                      className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-red-500 text-sm w-full rounded-xl hover:bg-red-50/50 transition-colors bg-transparent border-none cursor-pointer"
                    >
                      <LogOut size={18} />
                      Sign Out
                    </button>
                  </div>
                </>
              ) : (
                <Link
                  to="/auth"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-center gap-2 px-4 py-3 bg-red-600 text-white rounded-xl text-sm font-medium no-underline shadow-md shadow-red-200/40"
                >
                  Join Armyrang
                </Link>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 py-8">
        <div className="animate-fade-in">
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-lavender-100/40 py-6 mt-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center">
              <span className="text-white text-[9px] font-bold">AR</span>
            </div>
            <span className="text-sm font-medium text-gray-500">Armyrang</span>
          </div>
          <p className="text-xs text-gray-400">Cultural analysis, softly. All opinions are analytical observations.</p>
        </div>
      </footer>
    </div>
  )
}
