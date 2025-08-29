"use client"

import type React from "react"
import { motion } from "framer-motion"

interface TimerFooterProps {
  isSmallScreen: boolean
  onOpenInstructions: () => void
}

const TimerFooter: React.FC<TimerFooterProps> = ({ isSmallScreen, onOpenInstructions }) => {
  return (
    <motion.footer
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.8, duration: 0.5 }}
      className="p-4 border-t border-white/10 text-center font-mono text-white/50 relative z-10"
    >
      <p className="text-sm text-gray-400">&copy; 2025 <a href="https://x.com/ennri_" target="_blank" rel="noopener noreferrer">@ENNRI_</a> & v0 ❤️</p>
      <div className="text-xs mt-2">
        {isSmallScreen ? (
          <button onClick={onOpenInstructions} className="underline text-white/70 hover:text-white transition-colors">
            Show Hotkeys & Instructions
          </button>
        ) : (
          "Press 1, 2, 3 for presets • ← → for ±5s • Space to start/pause • R to reset • Double-click preset to edit • P to toggle Pomodoro mode"
        )}
      </div>
    </motion.footer>
  )
}

export default TimerFooter
