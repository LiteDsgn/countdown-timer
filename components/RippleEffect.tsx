import type React from "react"
import { motion, AnimatePresence } from "framer-motion"

interface RippleEffectProps {
  isVisible: boolean
  onAnimationComplete: () => void
}

const RippleEffect: React.FC<RippleEffectProps> = ({ isVisible, onAnimationComplete }) => {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ scale: 0, opacity: 1 }}
          animate={{ scale: 100, opacity: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1, ease: "easeInOut" }}
          onAnimationComplete={onAnimationComplete}
          style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            width: "20px",
            height: "20px",
            borderRadius: "50%",
            backgroundColor: "rgba(255, 255, 255, 0.3)",
            zIndex: 1000,
          }}
        />
      )}
    </AnimatePresence>
  )
}

export default RippleEffect
