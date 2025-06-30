import type React from "react"

interface FormatSelectorProps {
  timeFormat: string
  onFormatChange: (format: string) => void
  formatPresets: Record<string, number[]>
}

const FormatSelector: React.FC<FormatSelectorProps> = ({ timeFormat, onFormatChange, formatPresets }) => {
  return (
    <div className="flex items-center space-x-2">
      <span className="text-xs font-mono text-white/50">FORMAT:</span>
      <div className="flex space-x-1">
        {["HH:MM:SS", "MM:SS"].map((format) => (
          <button
            key={format}
            onClick={() => onFormatChange(format)}
            className={`px-2 py-1 rounded-md ${
              timeFormat === format ? "bg-white/30 text-white" : "bg-white/10 text-white hover:bg-white/20"
            } transition-colors font-mono`}
          >
            {format === "HH:MM:SS" ? "HH" : "MM"}
          </button>
        ))}
      </div>
    </div>
  )
}

export default FormatSelector
