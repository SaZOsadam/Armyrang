import { useState, useEffect } from 'react'

const levels = [
  { min: 0, label: 'Speculative', color: '#ef4444', bg: 'bg-red-50', text: 'text-red-600' },
  { min: 30, label: 'Low Confidence', color: '#f97316', bg: 'bg-orange-50', text: 'text-orange-600' },
  { min: 50, label: 'Moderate', color: '#eab308', bg: 'bg-amber-50', text: 'text-amber-600' },
  { min: 70, label: 'High Confidence', color: '#22c55e', bg: 'bg-emerald-50', text: 'text-emerald-600' },
  { min: 90, label: 'Near Certain', color: '#10b981', bg: 'bg-emerald-50', text: 'text-emerald-700' },
]

function getLevel(value) {
  let result = levels[0]
  for (const l of levels) {
    if (value >= l.min) result = l
  }
  return result
}

export default function ConfidenceSlider({ value, onChange, disabled = false }) {
  const [localValue, setLocalValue] = useState(value || 50)
  const level = getLevel(localValue)

  useEffect(() => {
    if (value !== undefined && value !== localValue) {
      setLocalValue(value)
    }
  }, [value])

  const handleChange = (e) => {
    const val = parseInt(e.target.value)
    setLocalValue(val)
    if (onChange) onChange(val)
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-700">Confidence Level</span>
        <div className="flex items-center gap-2">
          <span className={`text-xs font-medium px-2.5 py-1 rounded-lg ${level.bg} ${level.text}`}>
            {level.label}
          </span>
          <span className="text-lg font-bold tabular-nums" style={{ color: level.color }}>
            {localValue}%
          </span>
        </div>
      </div>

      <div className="relative pt-1 pb-2">
        <input
          type="range"
          min="1"
          max="100"
          value={localValue}
          onChange={handleChange}
          disabled={disabled}
          className="w-full h-2 rounded-full cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
          style={{
            background: `linear-gradient(to right, ${level.color} 0%, ${level.color} ${localValue}%, #f3f4f6 ${localValue}%, #f3f4f6 100%)`,
          }}
        />
        {/* Scale markers */}
        <div className="flex justify-between mt-2 px-0.5">
          {[1, 25, 50, 75, 100].map(mark => (
            <span key={mark} className="text-[10px] text-gray-300 font-medium">{mark}</span>
          ))}
        </div>
      </div>
    </div>
  )
}
