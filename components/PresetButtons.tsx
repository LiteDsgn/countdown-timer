import type React from "react"

interface PresetButtonsProps {
  presets: number[]
  editingPreset: number | null
  isRunning: boolean
  onPresetClick: (value: number) => void
  onPresetEdit: (index: number, value: number) => void
  onPresetEditStart: (index: number) => void
  updateTimer: (seconds: number) => void
  timeFormat: string
  isPomodoroMode: boolean
  togglePomodoroMode: () => void
  setHotkeysActive: (active: boolean) => void
}

const PresetButtons: React.FC<PresetButtonsProps> = ({
  presets,
  editingPreset,
  isRunning,
  onPresetClick,
  onPresetEdit,
  onPresetEditStart,
  updateTimer,
  timeFormat,
  isPomodoroMode,
  togglePomodoroMode,
  setHotkeysActive,
}) => {
  const handlePresetEdit = (index: number, value: string) => {
    const newValue = Number.parseInt(value, 10)
    if (!isNaN(newValue) && newValue > 0) {
      onPresetEdit(index, newValue)
      const multiplier = timeFormat === "SS" ? 1 : timeFormat === "MM:SS" ? 60 : 3600
      updateTimer(newValue * multiplier)
    }
    setHotkeysActive(true)
  }

  const getUnitLabel = () => {
    switch (timeFormat) {
      case "SS":
        return "s"
      case "MM:SS":
        return "m"
      case "HH:MM:SS":
        return "h"
      default:
        return "m"
    }
  }

  return (
    <div className="flex items-center space-x-2">
      <span className="text-xs font-mono text-white/50">PRESETS:</span>
      {presets.map((value, index) => (
        <div key={index} className="relative">
          {editingPreset === index ? (
            <input
              type="number"
              defaultValue={value}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handlePresetEdit(index, e.currentTarget.value)
                }
              }}
              onBlur={(e) => {
                handlePresetEdit(index, e.target.value)
              }}
              onFocus={() => setHotkeysActive(false)}
              className="w-12 px-2 py-1 rounded bg-white/20 text-white text-center focus:outline-none"
              autoFocus
            />
          ) : (
            <button
              onDoubleClick={() => {
                onPresetEditStart(index)
                setHotkeysActive(false)
              }}
              onClick={() => onPresetClick(value)}
              disabled={isRunning}
              className="px-2 py-1 bg-white/5 hover:bg-white/30 disabled:opacity-50 disabled:cursor-not-allowed transition-colors rounded-md"
            >
              {`${value}${getUnitLabel()}`}
            </button>
          )}
        </div>
      ))}
      <div className="relative">
        <button
          onClick={togglePomodoroMode}
          className={`px-2 py-1 rounded-md ${
            isPomodoroMode ? "bg-red-500 hover:bg-red-600" : "bg-white/5 hover:bg-white/30"
          } transition-colors`}
        >
          {`POMODORO`}
        </button>
      </div>
    </div>
  )
}

export default PresetButtons
