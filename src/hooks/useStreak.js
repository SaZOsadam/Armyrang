import { useEffect, useState } from 'react'

const LS_STREAK = 'armyrang_streak'
const LS_LAST_VISIT = 'armyrang_last_visit'

export function useStreak() {
  const [streak, setStreak] = useState(0)
  const [isNewDay, setIsNewDay] = useState(false)

  useEffect(() => {
    const today = new Date().toDateString()
    const lastVisit = localStorage.getItem(LS_LAST_VISIT)
    const savedStreak = parseInt(localStorage.getItem(LS_STREAK) || '0')

    if (!lastVisit) {
      localStorage.setItem(LS_LAST_VISIT, today)
      localStorage.setItem(LS_STREAK, '1')
      setStreak(1)
      setIsNewDay(true)
      return
    }

    if (lastVisit === today) {
      setStreak(savedStreak)
      return
    }

    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    const wasYesterday = lastVisit === yesterday.toDateString()

    const newStreak = wasYesterday ? savedStreak + 1 : 1
    localStorage.setItem(LS_LAST_VISIT, today)
    localStorage.setItem(LS_STREAK, newStreak.toString())
    setStreak(newStreak)
    setIsNewDay(true)
  }, [])

  return { streak, isNewDay }
}
