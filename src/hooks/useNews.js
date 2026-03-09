import { useState, useEffect } from 'react'
import { supabase, isConfigured } from '../lib/supabase'
import { NEWS_ARTICLES } from '../lib/newsData'

function normaliseArticle(row) {
  return {
    id: row.id,
    source: row.source,
    source_url: row.source_url,
    title: row.title,
    excerpt: row.excerpt,
    url: row.url,
    youtube_id: row.youtube_id,
    category: row.category,
    featured: row.featured,
    published_at: row.published_at,
    tags: row.tags || [],
  }
}

export function useNews() {
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function fetchNews() {
      if (!isConfigured) {
        setArticles(NEWS_ARTICLES)
        setLoading(false)
        return
      }

      const { data, error: err } = await supabase
        .from('news')
        .select('*')
        .order('published_at', { ascending: false })

      if (err) {
        console.error('useNews fetch error:', err)
        setArticles(NEWS_ARTICLES)
        setError(err.message)
      } else {
        setArticles(data.length > 0 ? data.map(normaliseArticle) : NEWS_ARTICLES)
      }
      setLoading(false)
    }

    fetchNews()
  }, [])

  const featuredArticle = articles.find((a) => a.featured) || articles[0] || null

  async function addArticle(data) {
    if (!isConfigured) return { error: 'Supabase not configured' }
    const { data: row, error: err } = await supabase.from('news').insert(data).select().single()
    if (err) return { error: err.message }
    setArticles((prev) => [normaliseArticle(row), ...prev])
    return { data: row }
  }

  async function updateArticle(id, data) {
    if (!isConfigured) return { error: 'Supabase not configured' }
    const { data: row, error: err } = await supabase.from('news').update(data).eq('id', id).select().single()
    if (err) return { error: err.message }
    setArticles((prev) => prev.map((a) => (a.id === id ? normaliseArticle(row) : a)))
    return { data: row }
  }

  async function deleteArticle(id) {
    if (!isConfigured) return { error: 'Supabase not configured' }
    const { error: err } = await supabase.from('news').delete().eq('id', id)
    if (err) return { error: err.message }
    setArticles((prev) => prev.filter((a) => a.id !== id))
    return { success: true }
  }

  return { articles, featuredArticle, loading, error, addArticle, updateArticle, deleteArticle }
}
