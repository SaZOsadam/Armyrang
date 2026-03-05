function getSliderColor(value) {
  if (value >= 70) return '#22c55e'
  if (value >= 45) return '#f59e0b'
  return '#ef4444'
}

function getLabel(value) {
  if (value >= 80) return 'Strong signal 🔥'
  if (value >= 60) return 'Probable signal ✨'
  if (value >= 40) return 'Mixed signals 🌿'
  if (value >= 20) return 'Weak signal 🌫️'
  return 'Noise 🕊️'
}

export default function ConfidenceSlider({ value, onChange, onSubmit, loading }) {
  const color = getSliderColor(value)
  const label = getLabel(value)

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-600">Your confidence level</span>
        <span className="text-2xl font-bold" style={{ color }}>{value}%</span>
      </div>

      <div className="space-y-2">
        <input
          type="range"
          min="1"
          max="100"
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full"
          style={{
            background: `linear-gradient(to right, ${color} ${value}%, #e5e7eb ${value}%)`,
          }}
        />
        <div className="flex justify-between text-xs text-gray-400">
          <span>1%</span>
          <span className="font-medium text-gray-600">{label}</span>
          <span>100%</span>
        </div>
      </div>

      {onSubmit && (
        <button
          onClick={onSubmit}
          disabled={loading}
          className="w-full py-4 bg-red-600 text-white rounded-2xl font-semibold hover:bg-red-700 hover:shadow-lg transition-all text-sm disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
        >
          {loading ? 'Submitting...' : 'Submit Signal'}
        </button>
      )}
    </div>
  )
}
