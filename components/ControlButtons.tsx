import type React from "react"
import { Play, Pause, RotateCcw, Plus, Minus } from "lucide-react"

interface ControlButtonsProps {
  isRunning: boolean
  timeLeft: number
  isPomodoroMode: boolean
  onStart: () => void
  onPomodoroStart: () => void
  onPause: () => void
  onReset: () => void
  onIncrement: () => void
  onDecrement: () => void
  onStartClick: () => void // New prop for triggering the ripple effect
}

const ControlButtons: React.FC<ControlButtonsProps> = ({
  isRunning,
  timeLeft,
  isPomodoroMode,
  onStart,
  onPomodoroStart,
  onPause,
  onReset,
  onIncrement,
  onDecrement,
  onStartClick, // New prop
}) => {
  return (
    <div className="flex justify-center gap-8">
      <button
        onClick={onDecrement}
        disabled={isRunning}
        className="p-6 rounded-lg border-2 border-white/20 hover:border-white/40 hover:bg-white/10 transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Minus size={32} />
      </button>
      <button
        onClick={onIncrement}
        disabled={isRunning}
        className="p-6 rounded-lg border-2 border-white/20 hover:border-white/40 hover:bg-white/10 transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Plus size={32} />
      </button>
      {!isRunning ? (
        <button
          onClick={() => {
            onStartClick() // Trigger the ripple effect
            if (isPomodoroMode && timeLeft === 0) {
              onPomodoroStart()
            } else {
              onStart()
            }
          }}
          disabled={timeLeft === 0 && !isPomodoroMode}
          className="p-6 rounded-lg bg-green-500 hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 transition-all duration-300"
        >
          <Play size={32} />
        </button>
      ) : (
        <button
          onClick={onPause}
          className="p-6 rounded-lg bg-red-500 hover:bg-red-600 transform hover:scale-105 transition-all duration-300"
        >
          <Pause size={32} />
        </button>
      )}
      <button
        onClick={onReset}
        className="p-6 rounded-lg border-2 border-white/20 hover:border-white/40 hover:bg-white/10 transform hover:scale-105 transition-all duration-300"
      >
        <RotateCcw size={32} />
      </button>
    </div>
  )
}

export default ControlButtons
