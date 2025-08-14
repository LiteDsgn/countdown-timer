import type React from "react"

interface TimerDisplayProps {
  time: string
  showTimeUp: boolean
  timerColor: string
  timeFormat: string
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onInputFocus: () => void
  onInputBlur: () => void
  isEditing: boolean
  setIsEditing: (isEditing: boolean) => void
  isPomodoroMode: boolean
  pomodoroPhase: "work" | "shortBreak" | "longBreak"
}

const TimerDisplay: React.FC<TimerDisplayProps> = ({
  time,
  showTimeUp,
  timerColor,
  timeFormat,
  handleInputChange,
  onInputFocus,
  onInputBlur,
  isEditing,
  setIsEditing,
  isPomodoroMode,
  pomodoroPhase,
}) => {
  return (
    <div className="relative">
      <input
        type="text"
        value={time}
        onChange={handleInputChange}
        onFocus={() => {
          onInputFocus()
          setIsEditing(true)
        }}
        onBlur={() => {
          onInputBlur()
          setIsEditing(false)
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.currentTarget.blur()
            onInputBlur()
            setIsEditing(false)
          }
        }}
        className={`w-full bg-transparent text-center font-mono leading-none font-semibold focus:outline-none placeholder-white/20 ${timerColor} text-[6rem] sm:text-[8rem] md:text-[10rem] lg:text-[14rem]`}
        placeholder={timeFormat === "SS" ? "00" : timeFormat === "MM:SS" ? "00:00" : "00:00:00"}
        readOnly={showTimeUp || isPomodoroMode}
      />
    </div>
  )
}

export default TimerDisplay
