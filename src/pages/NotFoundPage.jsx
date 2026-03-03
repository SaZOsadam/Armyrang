import { Link } from 'react-router-dom'
import { Eye, ArrowLeft } from 'lucide-react'

export default function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center animate-fade-in-up">
      <div className="w-20 h-20 rounded-3xl bg-lavender-100 flex items-center justify-center mx-auto mb-6">
        <Eye size={32} className="text-red-400" />
      </div>
      <p className="text-xs font-bold tracking-[0.2em] uppercase text-red-400 mb-3">404</p>
      <h1 className="font-serif text-3xl font-bold text-gray-900 mb-3">Signal Lost</h1>
      <p className="text-gray-400 text-sm max-w-xs leading-relaxed mb-8">
        This page doesn't exist — or was quietly retired. Even the best analysts miss sometimes. 🌙
      </p>
      <Link
        to="/"
        className="inline-flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-2xl text-sm font-medium hover:bg-red-700 transition-all duration-200 no-underline shadow-lg shadow-red-200/40"
      >
        <ArrowLeft size={15} />
        Back to The Observatory
      </Link>
    </div>
  )
}
