import { useState } from 'react'
import { Plus, Pencil, Trash2, CheckCircle, XCircle, Loader2, X, Shield } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { useNews } from '../hooks/useNews'
import { useEvents } from '../hooks/useEvents'
import { usePredictions } from '../hooks/usePredictions'
import { usePageTitle } from '../hooks/usePageTitle'
import { Navigate } from 'react-router-dom'

const TABS = ['News', 'Events', 'Predictions']

const BLANK_ARTICLE = {
  source: '', source_url: '', title: '', excerpt: '',
  url: '', youtube_id: '', category: 'News', featured: false,
  published_at: new Date().toISOString().slice(0, 16),
}

const BLANK_EVENT = {
  title: '', description: '', date: '', time: 'TBC',
  type: 'announcement', url: '', confirmed: false,
}

function StatusBadge({ status }) {
  const styles = {
    active: 'bg-green-100 text-green-700 border-green-200',
    resolved_correct: 'bg-blue-100 text-blue-700 border-blue-200',
    resolved_incorrect: 'bg-red-100 text-red-700 border-red-200',
    pending: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  }
  return (
    <span className={`text-xs font-bold px-2.5 py-1 rounded-lg border ${styles[status] || styles.pending}`}>
      {status.replace('_', ' ')}
    </span>
  )
}

function ConfirmDelete({ label, onConfirm, onCancel }) {
  return (
    <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl p-3">
      <p className="text-xs text-red-700 font-medium flex-1">Delete "{label}"?</p>
      <button onClick={onConfirm} className="text-xs font-bold text-white bg-red-600 px-3 py-1.5 rounded-lg hover:bg-red-700 transition-all">
        Delete
      </button>
      <button onClick={onCancel} className="text-xs font-medium text-gray-500 px-3 py-1.5 rounded-lg hover:bg-gray-100 transition-all">
        Cancel
      </button>
    </div>
  )
}

function NewsPanel() {
  const { articles, loading, addArticle, updateArticle, deleteArticle } = useNews()
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(BLANK_ARTICLE)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)
  const [confirmDelete, setConfirmDelete] = useState(null)

  function openNew() { setEditing('new'); setForm(BLANK_ARTICLE); setError(null) }
  function openEdit(a) {
    setEditing(a.id)
    setForm({
      source: a.source || '', source_url: a.source_url || '', title: a.title || '',
      excerpt: a.excerpt || '', url: a.url || '', youtube_id: a.youtube_id || '',
      category: a.category || 'News', featured: a.featured || false,
      published_at: a.published_at ? a.published_at.slice(0, 16) : new Date().toISOString().slice(0, 16),
    })
    setError(null)
  }

  async function handleSave(e) {
    e.preventDefault()
    setSaving(true)
    setError(null)
    const payload = { ...form, published_at: new Date(form.published_at).toISOString() }
    const result = editing === 'new' ? await addArticle(payload) : await updateArticle(editing, payload)
    setSaving(false)
    if (result.error) { setError(result.error); return }
    setEditing(null)
  }

  async function handleDelete(id, title) {
    const result = await deleteArticle(id)
    if (result.error) setError(result.error)
    setConfirmDelete(null)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-gray-500">{articles.length} article{articles.length !== 1 ? 's' : ''}</p>
        <button
          onClick={openNew}
          className="flex items-center gap-2 px-5 py-2.5 bg-red-600 text-white rounded-xl text-sm font-semibold hover:bg-red-700 transition-all"
        >
          <Plus size={15} /> Add Article
        </button>
      </div>

      {error && <p className="text-red-600 text-sm mb-4 bg-red-50 border border-red-200 px-4 py-3 rounded-xl">{error}</p>}

      {/* Form */}
      {editing !== null && (
        <div className="mb-6 p-6 bg-gray-50 rounded-2xl border border-gray-200">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-bold text-gray-900">{editing === 'new' ? 'Add Article' : 'Edit Article'}</h3>
            <button onClick={() => setEditing(null)} className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-200 transition-all">
              <X size={16} />
            </button>
          </div>
          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input required placeholder="Title *" value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500 col-span-2" />
              <input placeholder="Source (e.g. GQ)" value={form.source}
                onChange={(e) => setForm({ ...form, source: e.target.value })}
                className="px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500" />
              <input placeholder="Source URL" value={form.source_url}
                onChange={(e) => setForm({ ...form, source_url: e.target.value })}
                className="px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500" />
              <input placeholder="Article URL" value={form.url}
                onChange={(e) => setForm({ ...form, url: e.target.value })}
                className="px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500" />
              <input placeholder="YouTube ID (optional)" value={form.youtube_id}
                onChange={(e) => setForm({ ...form, youtube_id: e.target.value })}
                className="px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500" />
              <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500">
                {['Interview', 'News', 'Market Data', 'Analysis', 'Rumour'].map((c) => <option key={c}>{c}</option>)}
              </select>
              <input type="datetime-local" value={form.published_at}
                onChange={(e) => setForm({ ...form, published_at: e.target.value })}
                className="px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500" />
            </div>
            <textarea placeholder="Excerpt / summary" value={form.excerpt} rows={2}
              onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
              className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500 resize-none" />
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.featured}
                onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                className="rounded accent-red-600" />
              <span className="text-sm font-medium text-gray-700">Mark as featured article</span>
            </label>
            <div className="flex gap-3">
              <button type="submit" disabled={saving}
                className="flex items-center gap-2 px-6 py-2.5 bg-red-600 text-white rounded-xl text-sm font-semibold hover:bg-red-700 disabled:opacity-60 transition-all">
                {saving && <Loader2 size={14} className="animate-spin" />}
                {saving ? 'Saving...' : 'Save Article'}
              </button>
              <button type="button" onClick={() => setEditing(null)}
                className="px-6 py-2.5 border border-gray-200 text-gray-600 rounded-xl text-sm font-medium hover:bg-gray-100 transition-all">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Articles list */}
      {loading ? (
        <div className="flex items-center gap-2 py-8 text-gray-400 text-sm"><Loader2 size={16} className="animate-spin" /> Loading...</div>
      ) : (
        <div className="space-y-3">
          {articles.map((a) => (
            <div key={a.id} className="space-y-2">
              <div className="flex items-start gap-4 p-4 bg-white rounded-2xl border border-gray-200 hover:border-gray-300 transition-all">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">{a.source}</span>
                    <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded-lg">{a.category}</span>
                    {a.featured && <span className="text-xs px-2 py-0.5 bg-red-100 text-red-700 rounded-lg font-semibold">Featured</span>}
                  </div>
                  <p className="text-sm font-semibold text-gray-900 leading-snug line-clamp-1">{a.title}</p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {new Date(a.published_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button onClick={() => openEdit(a)}
                    className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-all">
                    <Pencil size={14} />
                  </button>
                  <button onClick={() => setConfirmDelete(a.id)}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
              {confirmDelete === a.id && (
                <ConfirmDelete label={a.title} onConfirm={() => handleDelete(a.id)} onCancel={() => setConfirmDelete(null)} />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function EventsPanel() {
  const { events, loading, addEvent, updateEvent, deleteEvent } = useEvents()
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(BLANK_EVENT)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)
  const [confirmDelete, setConfirmDelete] = useState(null)

  function openNew() { setEditing('new'); setForm(BLANK_EVENT); setError(null) }
  function openEdit(e) {
    setEditing(e.id)
    setForm({ title: e.title, description: e.description || '', date: e.date, time: e.time || 'TBC', type: e.type, url: e.url || '', confirmed: e.confirmed })
    setError(null)
  }

  async function handleSave(ev) {
    ev.preventDefault()
    setSaving(true)
    setError(null)
    const result = editing === 'new' ? await addEvent(form) : await updateEvent(editing, form)
    setSaving(false)
    if (result.error) { setError(result.error); return }
    setEditing(null)
  }

  async function handleDelete(id) {
    const result = await deleteEvent(id)
    if (result.error) setError(result.error)
    setConfirmDelete(null)
  }

  const EVENT_TYPE_STYLES = {
    release: 'bg-purple-100 text-purple-700', media: 'bg-blue-100 text-blue-700',
    live: 'bg-green-100 text-green-700', announcement: 'bg-orange-100 text-orange-700', tour: 'bg-red-100 text-red-700',
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-gray-500">{events.length} event{events.length !== 1 ? 's' : ''}</p>
        <button onClick={openNew}
          className="flex items-center gap-2 px-5 py-2.5 bg-red-600 text-white rounded-xl text-sm font-semibold hover:bg-red-700 transition-all">
          <Plus size={15} /> Add Event
        </button>
      </div>

      {error && <p className="text-red-600 text-sm mb-4 bg-red-50 border border-red-200 px-4 py-3 rounded-xl">{error}</p>}

      {editing !== null && (
        <div className="mb-6 p-6 bg-gray-50 rounded-2xl border border-gray-200">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-bold text-gray-900">{editing === 'new' ? 'Add Event' : 'Edit Event'}</h3>
            <button onClick={() => setEditing(null)} className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-200 transition-all">
              <X size={16} />
            </button>
          </div>
          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input required placeholder="Event title *" value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500 col-span-2" />
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-gray-500">Date *</label>
                <input required type="date" value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                  className="px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500" />
              </div>
              <input placeholder="Time (e.g. 13:00 KST)" value={form.time}
                onChange={(e) => setForm({ ...form, time: e.target.value })}
                className="px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500" />
              <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}
                className="px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500">
                {['release', 'media', 'live', 'announcement', 'tour'].map((t) => <option key={t}>{t}</option>)}
              </select>
              <input placeholder="Link URL (optional)" value={form.url}
                onChange={(e) => setForm({ ...form, url: e.target.value })}
                className="px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500" />
            </div>
            <textarea placeholder="Description" value={form.description} rows={2}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500 resize-none" />
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.confirmed}
                onChange={(e) => setForm({ ...form, confirmed: e.target.checked })}
                className="rounded accent-red-600" />
              <span className="text-sm font-medium text-gray-700">Mark as confirmed</span>
            </label>
            <div className="flex gap-3">
              <button type="submit" disabled={saving}
                className="flex items-center gap-2 px-6 py-2.5 bg-red-600 text-white rounded-xl text-sm font-semibold hover:bg-red-700 disabled:opacity-60 transition-all">
                {saving && <Loader2 size={14} className="animate-spin" />}
                {saving ? 'Saving...' : 'Save Event'}
              </button>
              <button type="button" onClick={() => setEditing(null)}
                className="px-6 py-2.5 border border-gray-200 text-gray-600 rounded-xl text-sm font-medium hover:bg-gray-100 transition-all">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <div className="flex items-center gap-2 py-8 text-gray-400 text-sm"><Loader2 size={16} className="animate-spin" /> Loading...</div>
      ) : (
        <div className="space-y-3">
          {events.map((ev) => (
            <div key={ev.id} className="space-y-2">
              <div className="flex items-start gap-4 p-4 bg-white rounded-2xl border border-gray-200 hover:border-gray-300 transition-all">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-lg ${EVENT_TYPE_STYLES[ev.type] || 'bg-gray-100 text-gray-600'}`}>
                      {ev.type}
                    </span>
                    {ev.confirmed
                      ? <span className="flex items-center gap-1 text-xs text-green-600 font-medium"><CheckCircle size={11} /> Confirmed</span>
                      : <span className="text-xs text-orange-500 font-medium">Unconfirmed</span>}
                  </div>
                  <p className="text-sm font-semibold text-gray-900 leading-snug">{ev.title}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{ev.date} · {ev.time}</p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button onClick={() => openEdit(ev)}
                    className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-all">
                    <Pencil size={14} />
                  </button>
                  <button onClick={() => setConfirmDelete(ev.id)}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
              {confirmDelete === ev.id && (
                <ConfirmDelete label={ev.title} onConfirm={() => handleDelete(ev.id)} onCancel={() => setConfirmDelete(null)} />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function PredictionsPanel() {
  const { predictions, loading, resolvePrediction, deletePrediction } = usePredictions()
  const [resolving, setResolving] = useState(null)
  const [confirmDelete, setConfirmDelete] = useState(null)
  const [error, setError] = useState(null)
  const [filterStatus, setFilterStatus] = useState('active')

  const filtered = predictions.filter((p) => filterStatus === 'all' || p.status === filterStatus)

  async function handleResolve(id, status) {
    setResolving(id + status)
    const result = await resolvePrediction(id, status)
    setResolving(null)
    if (result.error) setError(result.error)
  }

  async function handleDelete(id) {
    const result = await deletePrediction(id)
    if (result.error) setError(result.error)
    setConfirmDelete(null)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div className="flex gap-2">
          {['active', 'resolved_correct', 'resolved_incorrect', 'all'].map((s) => (
            <button key={s} onClick={() => setFilterStatus(s)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all border ${
                filterStatus === s ? 'bg-gray-900 text-white border-gray-900' : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
              }`}>
              {s === 'all' ? 'All' : s.replace('_', ' ')}
            </button>
          ))}
        </div>
        <p className="text-sm text-gray-500">{filtered.length} prediction{filtered.length !== 1 ? 's' : ''}</p>
      </div>

      {error && <p className="text-red-600 text-sm mb-4 bg-red-50 border border-red-200 px-4 py-3 rounded-xl">{error}</p>}

      {loading ? (
        <div className="flex items-center gap-2 py-8 text-gray-400 text-sm"><Loader2 size={16} className="animate-spin" /> Loading...</div>
      ) : (
        <div className="space-y-3">
          {filtered.map((p) => (
            <div key={p.id} className="space-y-2">
              <div className="p-4 bg-white rounded-2xl border border-gray-200 hover:border-gray-300 transition-all">
                <div className="flex items-start gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                      <StatusBadge status={p.status} />
                      <span className="text-xs text-gray-400">{p.category}</span>
                      <span className="text-xs text-gray-400">by {p.profiles?.display_name}</span>
                    </div>
                    <p className="text-sm font-semibold text-gray-900 leading-snug">{p.title}</p>
                    <p className="text-xs text-gray-400 mt-1">{p.vote_count} votes · {p.confidence_avg}% avg confidence</p>
                  </div>

                  {p.status === 'active' && (
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button
                        onClick={() => handleResolve(p.id, 'resolved_correct')}
                        disabled={resolving === p.id + 'resolved_correct'}
                        title="Mark correct"
                        className="flex items-center gap-1.5 px-3 py-2 bg-green-50 text-green-700 border border-green-200 rounded-xl text-xs font-semibold hover:bg-green-100 disabled:opacity-50 transition-all"
                      >
                        {resolving === p.id + 'resolved_correct' ? <Loader2 size={12} className="animate-spin" /> : <CheckCircle size={13} />}
                        Correct
                      </button>
                      <button
                        onClick={() => handleResolve(p.id, 'resolved_incorrect')}
                        disabled={resolving === p.id + 'resolved_incorrect'}
                        title="Mark incorrect"
                        className="flex items-center gap-1.5 px-3 py-2 bg-red-50 text-red-700 border border-red-200 rounded-xl text-xs font-semibold hover:bg-red-100 disabled:opacity-50 transition-all"
                      >
                        {resolving === p.id + 'resolved_incorrect' ? <Loader2 size={12} className="animate-spin" /> : <XCircle size={13} />}
                        Incorrect
                      </button>
                      <button onClick={() => setConfirmDelete(p.id)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  )}
                </div>
              </div>
              {confirmDelete === p.id && (
                <ConfirmDelete label={p.title} onConfirm={() => handleDelete(p.id)} onCancel={() => setConfirmDelete(null)} />
              )}
            </div>
          ))}
          {filtered.length === 0 && (
            <p className="text-center py-12 text-gray-400 text-sm">No predictions in this state.</p>
          )}
        </div>
      )}
    </div>
  )
}

export default function AdminPage() {
  usePageTitle('Admin Panel')
  const { profile } = useAuth()
  const [activeTab, setActiveTab] = useState('Predictions')

  if (profile && profile.role !== 'admin') {
    return <Navigate to="/" replace />
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <div className="flex items-center gap-3 mb-2">
        <div className="p-2 bg-red-100 rounded-xl">
          <Shield size={20} className="text-red-600" />
        </div>
        <h1
          className="text-3xl font-bold text-gray-900"
          style={{ fontFamily: 'Playfair Display, Georgia, serif' }}
        >
          Admin Panel
        </h1>
      </div>
      <p className="text-gray-500 text-sm mb-8">
        Manage news articles, events, and prediction resolutions. Changes go live instantly.
      </p>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-gray-100 rounded-2xl mb-8 w-fit">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-2.5 rounded-xl text-sm font-semibold transition-all ${
              activeTab === tab
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div>
        {activeTab === 'News' && <NewsPanel />}
        {activeTab === 'Events' && <EventsPanel />}
        {activeTab === 'Predictions' && <PredictionsPanel />}
      </div>
    </div>
  )
}
