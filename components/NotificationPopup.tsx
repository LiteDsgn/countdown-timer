"use client"

import type React from "react"
import { motion, AnimatePresence } from "framer-motion"

interface NotificationPopupProps {
  message: string
}

const NotificationPopup: React.FC<NotificationPopupProps> = ({ message }) => {
  return (
    <AnimatePresence>
      {message && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="absolute -top-20 left-1/2 transform -translate-x-1/2 -ml-3 md:-ml-4 z-50 bg-white/10 backdrop-blur-lg px-8 py-4 rounded-full"
        >
          <span className="text-2xl font-mono">{message}</span>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default NotificationPopup
