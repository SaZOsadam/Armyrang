import { useState, useEffect, useCallback } from 'react'
import { supabase, isConfigured } from '../lib/supabase'
import { MOCK_PREDICTIONS } from '../lib/mockData'

function normalisePrediction(row) {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    category: row.category,
    member: row.member || 'Group',
    status: row.status,
    confidence_avg: Math.round(Number(row.confidence_avg) || 0),
    vote_count: row.vote_count || 0,
    created_at: row.created_at,
    profiles: row.profiles || { display_name: 'Analyst', username: 'analyst' },
  }
}

export function usePredictions() {
  const [predictions, setPredictions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchPredictions = useCallback(async () => {
    if (!isConfigured) {
      setPredictions(MOCK_PREDICTIONS)
      setLoading(false)
      return
    }

    const { data, error: err } = await supabase
      .from('predictions')
      .select('*, profiles(display_name, username)')
      .order('created_at', { ascending: false })

    if (err) {
      console.error('usePredictions fetch error:', err)
      setPredictions(MOCK_PREDICTIONS)
      setError(err.message)
    } else {
      setPredictions(
        data.length > 0 ? data.map(normalisePrediction) : MOCK_PREDICTIONS
      )
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    fetchPredictions()

    if (!isConfigured) return
    const channel = supabase
      .channel('predictions-live')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'predictions' }, fetchPredictions)
      .subscribe()

    return () => supabase.removeChannel(channel)
  }, [fetchPredictions])

  async function createPrediction({ title, description, category, member = 'Group' }, userId) {
    if (!isConfigured) return { error: 'Supabase not configured' }

    const { data, error: err } = await supabase
      .from('predictions')
      .insert({ title, description, category, member, author_id: userId })
      .select('*, profiles(display_name, username)')
      .single()

    if (err) return { error: err.message }
    setPredictions((prev) => [normalisePrediction(data), ...prev])
    return { data }
  }

  async function castVote(predictionId, confidence, userId) {
    if (!isConfigured) return { error: 'Supabase not configured' }

    const { error: err } = await supabase
      .from('votes')
      .upsert({ prediction_id: predictionId, voter_id: userId, confidence }, { onConflict: 'prediction_id,voter_id' })

    if (err) return { error: err.message }
    await fetchPredictions()
    return { success: true }
  }

  async function getUserVote(predictionId, userId) {
    if (!isConfigured) return null
    const { data } = await supabase
      .from('votes')
      .select('confidence')
      .eq('prediction_id', predictionId)
      .eq('voter_id', userId)
      .single()
    return data?.confidence ?? null
  }

  async function resolvePrediction(id, status) {
    if (!isConfigured) return { error: 'Supabase not configured' }
    const { error: err } = await supabase
      .from('predictions')
      .update({ status, resolved_at: new Date().toISOString() })
      .eq('id', id)
    if (err) return { error: err.message }
    await fetchPredictions()
    return { success: true }
  }

  async function deletePrediction(id) {
    if (!isConfigured) return { error: 'Supabase not configured' }
    const { error: err } = await supabase.from('predictions').delete().eq('id', id)
    if (err) return { error: err.message }
    setPredictions((prev) => prev.filter((p) => p.id !== id))
    return { success: true }
  }

  return { predictions, loading, error, createPrediction, castVote, getUserVote, resolvePrediction, deletePrediction, refetch: fetchPredictions }
}
