import { useState, useEffect } from 'react'
import { supabase, isConfigured } from '../lib/supabase'
import { EVENTS } from '../lib/newsData'

function normaliseEvent(row) {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    date: row.event_date,
    time: row.event_time || 'TBC',
    type: row.type,
    url: row.url,
    confirmed: row.confirmed,
  }
}

export function useEvents() {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function fetchEvents() {
      if (!isConfigured) {
        setEvents(EVENTS)
        setLoading(false)
        return
      }

      const { data, error: err } = await supabase
        .from('events')
        .select('*')
        .order('event_date', { ascending: true })

      if (err) {
        console.error('useEvents fetch error:', err)
        setEvents(EVENTS)
        setError(err.message)
      } else {
        setEvents(data.length > 0 ? data.map(normaliseEvent) : EVENTS)
      }
      setLoading(false)
    }

    fetchEvents()
  }, [])

  const upcoming = events.filter((e) => new Date(e.date) >= new Date())
  const past = events.filter((e) => new Date(e.date) < new Date())

  return { events, upcoming, past, loading, error }
}
