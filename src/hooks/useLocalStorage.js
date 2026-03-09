import { useState, useEffect } from 'react'

export function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = localStorage.getItem(key)
      return item !== null ? JSON.parse(item) : initialValue
    } catch {
      return initialValue
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(storedValue))
    } catch {
      // ignore write errors
    }
  }, [key, storedValue])

  function setValue(value) {
    setStoredValue((prev) =>
      typeof value === 'function' ? value(prev) : value
    )
  }

  function removeValue() {
    localStorage.removeItem(key)
    setStoredValue(initialValue)
  }

  return [storedValue, setValue, removeValue]
}
