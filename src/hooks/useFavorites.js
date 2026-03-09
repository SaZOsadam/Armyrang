import { useLocalStorage } from './useLocalStorage'

const LS_KEY = 'armyrang_favorites'

export function useFavorites() {
  const [favorites, setFavorites] = useLocalStorage(LS_KEY, [])

  function isFavorite(predictionId) {
    return favorites.includes(predictionId)
  }

  function toggleFavorite(predictionId) {
    setFavorites((prev) =>
      prev.includes(predictionId)
        ? prev.filter((id) => id !== predictionId)
        : [...prev, predictionId]
    )
  }

  function clearFavorites() {
    setFavorites([])
  }

  return { favorites, isFavorite, toggleFavorite, clearFavorites }
}
