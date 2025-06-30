"use client"

import type React from "react"
import { useEffect } from "react"
import KeyboardLayout from "./KeyboardLayout"
import AnimatedGrid from "./AnimatedGrid"
import { motion } from "framer-motion"

interface InstructionsScreenProps {
  onContinue: () => void
}

const InstructionsScreen: React.FC<InstructionsScreenProps> = ({ onContinue }) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Enter" || event.key === "Escape") {
        onContinue()
      }
    }

    window.addEventListener("keydown", handleKeyDown)

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [onContinue])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 bg-black flex items-center justify-center z-50"
    >
      <AnimatedGrid />
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.3 }}
        className="w-full max-w-4xl p-8 text-white font-mono flex flex-col items-center relative z-10 bg-gradient-radial from-white/30 to-transparent backdrop-blur-md bg-opacity-30 rounded-lg"
      >
        <p className="text-xl mb-8 text-center text-gray-300">Welcome!</p>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.3 }}
        >
          <KeyboardLayout />
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.3 }}
          className="mt-16 text-center text-gray-400 text-sm space-y-2"
        >
          <p>Double-click preset buttons to edit values</p>
          <p>
            Timer changes color: <span className="text-green-500">green</span> {">"}{" "}
            <span className="text-yellow-500">yellow</span> {">"} <span className="text-red-500">red</span>
          </p>
          <p>
            Press <span className="text-orange-400">P</span> to toggle Pomodoro mode
          </p>
          <p>Audio cues play at key intervals and when time is up</p>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.3 }}
          className="mt-12 text-center"
        >
          <button
            onClick={onContinue}
            className="bg-white text-black px-8 py-3 rounded-lg font-mono text-lg border-2 border-white hover:bg-gray-100 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white/50 font-bold tracking-wider"
          >
            <span className="uppercase">Start</span>
          </button>
        </motion.div>
      </motion.div>
    </motion.div>
  )
}

export default InstructionsScreen
