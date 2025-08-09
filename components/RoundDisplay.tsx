"use client"

import type React from "react"
import { motion } from "framer-motion"

interface RoundDisplayProps {
  isPomodoroMode: boolean
  pomodoroCycle: number
  pomodoroPhase: "work" | "shortBreak" | "longBreak"
  round: number
}

const RoundDisplay: React.FC<RoundDisplayProps> = ({ isPomodoroMode, pomodoroCycle, pomodoroPhase, round }) => {
  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.5, duration: 0.5 }}
      className="text-xl font-mono mb-4 mt-4 flex items-center"
    >
      <span className="text-white/50">
        {isPomodoroMode
          ? (() => {
              const cyclePosition = (pomodoroCycle - 1) % 8
              const roundNumber = Math.floor((pomodoroCycle - 1) / 8) + 1
              return `ROUND ${roundNumber}`
            })()
          : `ROUND ${round}`}
      </span>
      {isPomodoroMode && (
        <>
          <span className="text-white/50 mx-4">/</span>
          <span className="text-white">
            {(() => {
              const cyclePosition = (pomodoroCycle - 1) % 8
              const phaseNumber = Math.floor(cyclePosition / 2) + 1
              if (pomodoroPhase === "longBreak") {
                return "LONG BREAK"
              } else if (pomodoroPhase === "work") {
                return `WORK ${phaseNumber}`
              } else {
                return `SHORT BREAK ${phaseNumber}`
              }
            })()}
          </span>
        </>
      )}
    </motion.div>
  )
}

export default RoundDisplay
