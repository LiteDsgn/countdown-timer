"use client"

import type React from "react"
import { useState, useEffect } from "react"

const KeyboardLayout: React.FC = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [hoveredKey, setHoveredKey] = useState<string | null>(null)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener("mousemove", handleMouseMove)
    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
    }
  }, [])

  const keys = [
    { key: "1", label: "Preset 1" },
    { key: "2", label: "Preset 2" },
    { key: "3", label: "Preset 3" },
    { key: "←", label: "-5 Sec" },
    { key: "→", label: "+5 Sec" },
    { key: "SPACE", label: "Start/Pause" },
    // Removed the 'P' key from here
  ]

  return (
    <div className="max-w-3xl mx-auto">
      <h3 className="text-2xl font-bold text-center mb-6">Keyboard Hotkeys</h3>
      <div className="grid grid-cols-3 gap-4 relative animate-[pulse_4s_ease-in-out_infinite]">
        {keys.map(({ key, label, color }) => (
          <div
            key={key}
            className="relative"
            onMouseEnter={() => setHoveredKey(key)}
            onMouseLeave={() => setHoveredKey(null)}
          >
            <div
              className={`bg-white/5 border-2 border-white/10 rounded-xl p-4 aspect-square flex flex-col items-center justify-center transition-all duration-300 ${hoveredKey === key ? "bg-white/20" : ""}`}
              style={{
                transform: hoveredKey === key ? "scale(1.05)" : "scale(1)",
                boxShadow: hoveredKey === key ? "0 0 15px rgba(255,255,255,0.2)" : "none",
                background:
                  hoveredKey === key
                    ? `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0.05) 100%)`
                    : undefined,
              }}
            >
              <span className={`text-3xl font-bold mb-2 ${color || ""}`}>{key}</span>
              <span className="text-sm text-gray-300 text-center">{label}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default KeyboardLayout
