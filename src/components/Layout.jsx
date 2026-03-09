import { NavLink, Link } from 'react-router-dom'
import { Home, TrendingUp, Trophy, LogIn, LogOut, User, Newspaper, Music2, Map } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import NotificationBell from './NotificationBell'
import { useStreak } from '../hooks/useStreak'

export default function Layout({ children }) {
  const { user, profile, signOut } = useAuth()
  const { streak } = useStreak()

  return (
    <div className="min-h-screen flex flex-col">
      {/* Desktop Nav */}
      <nav className="sticky top-0 z-50 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 no-underline">
            <span className="text-2xl">🔭</span>
            <span
              className="font-semibold text-gray-900 text-lg"
              style={{ fontFamily: 'Playfair Display, Georgia, serif' }}
            >
              Armyrang
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                `flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-medium transition-all duration-150 no-underline ${
                  isActive
                    ? 'bg-gray-100 text-gray-900'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`
              }
            >
              <Home size={16} /> Home
            </NavLink>
            <NavLink
              to="/predictions"
              className={({ isActive }) =>
                `flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-medium transition-all duration-150 no-underline ${
                  isActive
                    ? 'bg-gray-100 text-gray-900'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`
              }
            >
              <TrendingUp size={16} /> Predictions
            </NavLink>
            <NavLink
              to="/leaderboard"
              className={({ isActive }) =>
                `flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-medium transition-all duration-150 no-underline ${
                  isActive
                    ? 'bg-gray-100 text-gray-900'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`
              }
            >
              <Trophy size={16} /> Leaderboard
            </NavLink>
            <NavLink
              to="/arirang"
              className={({ isActive }) =>
                `flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-medium transition-all duration-150 no-underline ${
                  isActive
                    ? 'bg-purple-100 text-purple-700'
                    : 'text-purple-500 hover:bg-purple-50 hover:text-purple-700'
                }`
              }
            >
              <Music2 size={16} /> ARIRANG
            </NavLink>
            <NavLink
              to="/news"
              className={({ isActive }) =>
                `flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-medium transition-all duration-150 no-underline ${
                  isActive
                    ? 'bg-gray-100 text-gray-900'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`
              }
            >
              <Newspaper size={16} /> News
            </NavLink>
            <NavLink
              to="/tour"
              className={({ isActive }) =>
                `flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-medium transition-all duration-150 no-underline ${
                  isActive
                    ? 'bg-red-50 text-red-700'
                    : 'text-red-500 hover:bg-red-50 hover:text-red-700'
                }`
              }
            >
              <Map size={16} /> Tour
            </NavLink>
          </div>

          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-3">
                <NotificationBell />
                {streak > 0 && (
                  <div className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-50 border border-purple-200 rounded-xl" title={`${streak}-day streak`}>
                    <span className="text-sm">💜</span>
                    <span className="text-xs font-bold text-purple-700">{streak}d</span>
                  </div>
                )}
                <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-xl">
                  <div className="w-7 h-7 bg-red-100 rounded-full flex items-center justify-center">
                    <span className="text-red-600 text-xs font-semibold">
                      {(profile?.display_name || profile?.username || 'U')[0].toUpperCase()}
                    </span>
                  </div>
                  <span className="text-sm font-medium text-gray-700">
                    {profile?.display_name || 'Analyst'}
                  </span>
                </div>
                <button
                  onClick={signOut}
                  className="p-3 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                  title="Sign out"
                >
                  <LogOut size={18} />
                </button>
              </div>
            ) : (
              <Link
                to="/auth"
                className="flex items-center gap-2 px-5 py-3 bg-red-600 text-white rounded-2xl text-sm font-semibold hover:bg-red-700 transition-all no-underline active:scale-[0.98]"
              >
                <LogIn size={16} /> Join the Society
              </Link>
            )}
          </div>
        </div>
      </nav>

      <main className="flex-1 pb-20 md:pb-0">
        {children}
      </main>

      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 px-2 py-2">
        <div className="flex items-center justify-around">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 px-4 py-2 rounded-xl no-underline transition-all min-w-[64px] ${
                isActive ? 'text-red-600' : 'text-gray-400'
              }`
            }
          >
            <Home size={20} />
            <span className="text-xs font-medium">Home</span>
          </NavLink>
          <NavLink
            to="/predictions"
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 px-4 py-2 rounded-xl no-underline transition-all min-w-[64px] ${
                isActive ? 'text-red-600' : 'text-gray-400'
              }`
            }
          >
            <TrendingUp size={20} />
            <span className="text-xs font-medium">Signals</span>
          </NavLink>
          <NavLink
            to="/leaderboard"
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 px-4 py-2 rounded-xl no-underline transition-all min-w-[64px] ${
                isActive ? 'text-red-600' : 'text-gray-400'
              }`
            }
          >
            <Trophy size={20} />
            <span className="text-xs font-medium">Rankings</span>
          </NavLink>
          <NavLink
            to="/arirang"
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 px-4 py-2 rounded-xl no-underline transition-all min-w-[64px] ${
                isActive ? 'text-purple-600' : 'text-gray-400'
              }`
            }
          >
            <Music2 size={20} />
            <span className="text-xs font-medium">ARIRANG</span>
          </NavLink>
          <NavLink
            to="/news"
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 px-4 py-2 rounded-xl no-underline transition-all min-w-[64px] ${
                isActive ? 'text-red-600' : 'text-gray-400'
              }`
            }
          >
            <Newspaper size={20} />
            <span className="text-xs font-medium">News</span>
          </NavLink>
          <NavLink
            to="/tour"
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 px-4 py-2 rounded-xl no-underline transition-all min-w-[64px] ${
                isActive ? 'text-red-600' : 'text-gray-400'
              }`
            }
          >
            <Map size={20} />
            <span className="text-xs font-medium">Tour</span>
          </NavLink>
          {user ? (
            <button
              onClick={signOut}
              className="flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all min-w-[64px] text-gray-400"
            >
              <LogOut size={20} />
              <span className="text-xs font-medium">Sign Out</span>
            </button>
          ) : (
            <NavLink
              to="/auth"
              className={({ isActive }) =>
                `flex flex-col items-center gap-1 px-4 py-2 rounded-xl no-underline transition-all min-w-[64px] ${
                  isActive ? 'text-red-600' : 'text-gray-400'
                }`
              }
            >
              <User size={20} />
              <span className="text-xs font-medium">Join</span>
            </NavLink>
          )}
        </div>
      </nav>
    </div>
  )
}
