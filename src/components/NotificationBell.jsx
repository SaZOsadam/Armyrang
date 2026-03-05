import { useState, useRef, useEffect } from 'react'
import { Bell, X, TrendingUp, CheckCircle, XCircle } from 'lucide-react'
import { useNotifications } from '../hooks/useNotifications'
import { useAuth } from '../contexts/AuthContext'

const TYPE_CONFIG = {
  vote_received: { icon: TrendingUp, color: 'text-blue-500', bg: 'bg-blue-50' },
  prediction_resolved: { icon: CheckCircle, color: 'text-green-500', bg: 'bg-green-50' },
  new_comment: { icon: XCircle, color: 'text-purple-500', bg: 'bg-purple-50' },
}

function timeAgo(dateStr) {
  const seconds = Math.floor((Date.now() - new Date(dateStr)) / 1000)
  if (seconds < 60) return 'just now'
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  return `${Math.floor(hours / 24)}d ago`
}

export default function NotificationBell() {
  const { user } = useAuth()
  const { notifications, unreadCount, markRead, markAllRead } = useNotifications()
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  if (!user) return null

  function handleOpen() {
    setOpen((prev) => !prev)
  }

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={handleOpen}
        className="relative p-3 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-all"
        title="Notifications"
      >
        <Bell size={18} />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center leading-none">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-2xl border border-gray-200 shadow-xl z-50 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-sm text-gray-900">Notifications</span>
              {unreadCount > 0 && (
                <span className="text-xs bg-red-100 text-red-600 font-semibold px-2 py-0.5 rounded-full">
                  {unreadCount} new
                </span>
              )}
            </div>
            <div className="flex items-center gap-1">
              {unreadCount > 0 && (
                <button
                  onClick={markAllRead}
                  className="text-xs text-gray-400 hover:text-red-600 font-medium px-2 py-1 rounded-lg hover:bg-red-50 transition-all"
                >
                  Mark all read
                </button>
              )}
              <button
                onClick={() => setOpen(false)}
                className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all"
              >
                <X size={14} />
              </button>
            </div>
          </div>

          <div className="max-h-80 overflow-y-auto divide-y divide-gray-50">
            {notifications.length === 0 ? (
              <div className="py-12 text-center text-gray-400">
                <Bell size={28} className="mx-auto mb-3 opacity-30" />
                <p className="text-sm font-medium text-gray-500">No notifications yet</p>
                <p className="text-xs mt-1">Activity on your predictions will appear here</p>
              </div>
            ) : (
              notifications.map((notif) => {
                const config = TYPE_CONFIG[notif.type] || TYPE_CONFIG.vote_received
                const Icon = config.icon
                return (
                  <div
                    key={notif.id}
                    onClick={() => !notif.is_read && markRead(notif.id)}
                    className={`flex gap-3 px-4 py-3 transition-colors cursor-pointer hover:bg-gray-50 ${
                      !notif.is_read ? 'bg-blue-50/40' : ''
                    }`}
                  >
                    <div
                      className={`w-8 h-8 ${config.bg} rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5`}
                    >
                      <Icon size={14} className={config.color} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 leading-snug">
                        {notif.title}
                      </p>
                      {notif.body && (
                        <p className="text-xs text-gray-500 mt-0.5 leading-relaxed line-clamp-2">
                          {notif.body}
                        </p>
                      )}
                      <p className="text-xs text-gray-400 mt-1">{timeAgo(notif.created_at)}</p>
                    </div>
                    {!notif.is_read && (
                      <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0" />
                    )}
                  </div>
                )
              })
            )}
          </div>
        </div>
      )}
    </div>
  )
}
