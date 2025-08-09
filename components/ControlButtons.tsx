"use client"

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
}) => {
  return (
    <div className="flex flex-wrap justify-center gap-4 sm:gap-8">
      <button
        onClick={onDecrement}
        disabled={isRunning}
        className="p-4 sm:p-6 rounded-lg border-2 border-white/20 hover:border-white/40 hover:bg-white/10 transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Minus size={24} sm:size={32} />
      </button>
      <button
        onClick={onIncrement}
        disabled={isRunning}
        className="p-4 sm:p-6 rounded-lg border-2 border-white/20 hover:border-white/40 hover:bg-white/10 transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Plus size={24} sm:size={32} />
      </button>
      {!isRunning ? (
        <button
          aria-label="Start timer"
          onClick={() => {
            if (isPomodoroMode && timeLeft === 0) {
              onPomodoroStart()
            } else {
              onStart()
            }
          }}
          disabled={timeLeft === 0 && !isPomodoroMode}
          className="p-4 sm:p-6 rounded-lg bg-green-500 hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 transition-all duration-300"
        >
          <Play size={24} sm:size={32} />
        </button>
      ) : (
        <button
          onClick={onPause}
          className="p-4 sm:p-6 rounded-lg bg-red-500 hover:bg-red-600 transform hover:scale-105 transition-all duration-300"
        >
          <Pause size={24} sm:size={32} />
        </button>
      )}
      <button
        onClick={onReset}
        className="p-4 sm:p-6 rounded-lg border-2 border-white/20 hover:border-white/40 hover:bg-white/10 transform hover:scale-105 transition-all duration-300"
      >
        <RotateCcw size={24} sm:size={32} />
      </button>
    </div>
  )
}

export default ControlButtons
