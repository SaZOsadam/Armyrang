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

  return { articles, featuredArticle, loading, error }
}
