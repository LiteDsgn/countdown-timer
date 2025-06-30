"use client"

import type React from "react"
import { useState, useEffect, useCallback, useRef } from "react"
import { Volume2, VolumeX } from "lucide-react"
import AnimatedGrid from "./AnimatedGrid"
import TimerDisplay from "./TimerDisplay"
import ControlButtons from "./ControlButtons"
import FormatSelector from "./FormatSelector"
import PresetButtons from "./PresetButtons"
import NotificationPopup from "./NotificationPopup"
import InstructionsScreen from "./InstructionsScreen"
import RippleEffect from "./RippleEffect"
import { motion, AnimatePresence } from "framer-motion"

const CompetitiveTimer = () => {
  const [timeLeft, setTimeLeft] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const [round, setRound] = useState(1)
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [notification, setNotification] = useState("")
  const [initialTime, setInitialTime] = useState(0)
  const [timeFormat, setTimeFormat] = useState("MM:SS")
  const [editingPreset, setEditingPreset] = useState<number | null>(null)
  const [formatPresets, setFormatPresets] = useState({
    "HH:MM:SS": [1, 2, 5],
    "MM:SS": [1, 2, 5],
    SS: [15, 30, 45],
  })
  const [presets, setPresets] = useState(formatPresets[timeFormat])
  const [originalPresets, setOriginalPresets] = useState(formatPresets[timeFormat])
  const [showTimeUp, setShowTimeUp] = useState(false)
  const [isTimeUp, setIsTimeUp] = useState(false)
  const [showInstructions, setShowInstructions] = useState(true)
  const [isInputFocused, setIsInputFocused] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const audioContext = useRef<AudioContext | null>(null)
  const [isPomodoroMode, setIsPomodoroMode] = useState(false)
  const [pomodoroPhase, setPomodoroPhase] = useState<"work" | "shortBreak" | "longBreak">("work")
  const [pomodoroCycle, setPomodoroCycle] = useState(1)
  const [pomodoroTimes, setPomodoroTimes] = useState({ work: 0, shortBreak: 0, longBreak: 0 })
  const [hasUserEditedPresets, setHasUserEditedPresets] = useState(false)
  const [areHotkeysActive, setAreHotkeysActive] = useState(true)
  const [showRipple, setShowRipple] = useState(false)

  const POMODORO_WORK_TIME = 25 * 60
  const POMODORO_SHORT_BREAK_TIME = 5 * 60
  const POMODORO_LONG_BREAK_TIME = 15 * 60
  const POMODORO_CYCLES_BEFORE_LONG_BREAK = 4

  const togglePomodoroMode = () => {
    setIsPomodoroMode((prev) => !prev)
    if (!isPomodoroMode) {
      // Switching to Pomodoro mode
      setOriginalPresets([...presets]) // Save current presets
      if (hasUserEditedPresets) {
        setPomodoroTimes({
          work: presets[0] * 60,
          shortBreak: presets[1] * 60,
          longBreak: presets[2] * 60,
        })
      } else {
        // Use standard Pomodoro values
        setPomodoroTimes({
          work: 25 * 60,
          shortBreak: 5 * 60,
          longBreak: 15 * 60,
        })
        setPresets([25, 5, 15])
      }
      setPomodoroPhase("work")
      setPomodoroCycle(1)
      setRound(1)
      setTimeLeft(hasUserEditedPresets ? presets[0] * 60 : 25 * 60) // Set to work time
      setInitialTime(hasUserEditedPresets ? presets[0] * 60 : 25 * 60)
      showNotification("Pomodoro Mode Activated")
    } else {
      // Exiting Pomodoro mode
      setIsRunning(false)
      setTimeLeft(0)
      setInitialTime(0)
      setRound(1)
      // Restore original presets
      setPresets(originalPresets)
      setFormatPresets((prev) => ({
        ...prev,
        [timeFormat]: originalPresets,
      }))
      showNotification("Pomodoro Mode Deactivated")
    }
  }

  const resetCurrentPhase = () => {
    setIsRunning(false)
    if (isPomodoroMode) {
      const currentPhaseTime = pomodoroTimes[pomodoroPhase]
      setTimeLeft(currentPhaseTime)
      setInitialTime(currentPhaseTime)
      showNotification(`${pomodoroPhase.charAt(0).toUpperCase() + pomodoroPhase.slice(1)} phase reset`)
    } else {
      setTimeLeft(initialTime)
      showNotification("Timer reset to initial value")
    }
  }

  const showNotification = (message: string, duration = 2000) => {
    const importantMessages = ["1 MINUTE REMAINING", "30 SECONDS REMAINING", "TIME UP", "NEXT ROUND"]
    if (
      importantMessages.includes(message) ||
      message.includes("Set to") ||
      message.includes("Added") ||
      message.includes("Removed")
    ) {
      setNotification(message)
      setTimeout(() => setNotification(""), duration)
    }
  }

  const handleKeyPress = useCallback(
    (e: KeyboardEvent) => {
      if (!areHotkeysActive || isInputFocused || isEditing) return

      if (e.key === " ") {
        e.preventDefault()
        if (timeLeft > 0) {
          setIsRunning((prev) => !prev)
        }
      } else if (!isRunning) {
        const presetIndex = ["1", "2", "3"].indexOf(e.key)
        if (presetIndex !== -1) {
          const presetValue = presets[presetIndex]
          const multiplier = timeFormat === "SS" ? 1 : timeFormat === "MM:SS" ? 60 : 3600
          setTimeLeft(presetValue * multiplier)
          setInitialTime(presetValue * multiplier)
          showNotification(
            `Set to ${presetValue} ${timeFormat === "SS" ? "seconds" : timeFormat === "MM:SS" ? "minutes" : "hours"}`,
          )
        } else if (e.key === "ArrowRight") {
          setTimeLeft((t) => {
            const newTime = t + 5
            setInitialTime(newTime)
            showNotification("Added 5 seconds")
            return newTime
          })
        } else if (e.key === "ArrowLeft") {
          setTimeLeft((t) => {
            const newTime = Math.max(0, t - 5)
            setInitialTime(newTime)
            showNotification("Removed 5 seconds")
            return newTime
          })
        } else if (e.key.toLowerCase() === "p") {
          // Handle 'p' key for Pomodoro toggle
          e.preventDefault()
          togglePomodoroMode()
        }
      }
    },
    [isRunning, timeLeft, presets, timeFormat, isInputFocused, isEditing, areHotkeysActive], // Removed togglePomodoroMode and showNotification from dependencies
  )

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === " ") {
        e.preventDefault()
      }
      if (e.key.toLowerCase() === "r") {
        resetCurrentPhase()
      }
      handleKeyPress(e)
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => {
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [handleKeyPress]) // Removed resetCurrentPhase from dependencies

  useEffect(() => {
    let timer
    if (isRunning && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((time) => {
          if (time === 60) showNotification("1 MINUTE REMAINING")
          if (time === 30) showNotification("30 SECONDS REMAINING")

          if (soundEnabled && (time === 60 || time === 30 || time === 10 || time <= 5)) {
            playBeep(time <= 5 ? "high" : "low")
          }
          return time - 1
        })
      }, 1000)
    } else if (timeLeft === 0 && isRunning) {
      setIsRunning(false)
      if (soundEnabled) playBeep("end")
      setShowTimeUp(true)
      setIsTimeUp(true)
      showNotification("TIME UP")

      if (isPomodoroMode) {
        handlePomodoroPhaseEnd()
      } else {
        setTimeout(() => {
          setShowTimeUp(false)
          setIsTimeUp(false)
          setRound((r) => r + 1)
          setTimeLeft(initialTime)
          showNotification("NEXT ROUND")
        }, 3000)
      }
    }
    return () => clearInterval(timer)
  }, [isRunning, timeLeft, soundEnabled, initialTime, isPomodoroMode]) // Removed showNotification from dependencies

  const playBeep = (type: "high" | "low" | "end") => {
    if (!audioContext.current) {
      audioContext.current = new (window.AudioContext || window.webkitAudioContext)()
    }
    const context = audioContext.current
    const oscillator = context.createOscillator()
    const gain = context.createGain()
    oscillator.connect(gain)
    gain.connect(context.destination)

    if (type === "end") {
      oscillator.type = "sine"
      oscillator.frequency.setValueAtTime(1800, context.currentTime)
      gain.gain.setValueAtTime(0.1, context.currentTime)

      const ringDuration = 0.1
      const pauseDuration = 0.1
      const totalDuration = 3

      for (let i = 0; i < totalDuration; i += ringDuration + pauseDuration) {
        gain.gain.setValueAtTime(0.1, context.currentTime + i)
        gain.gain.exponentialRampToValueAtTime(0.00001, context.currentTime + i + ringDuration)
      }

      oscillator.start()
      oscillator.stop(context.currentTime + totalDuration)
    } else {
      oscillator.frequency.value = type === "high" ? 880 : 440
      gain.gain.value = 0.1
      oscillator.start()
      gain.gain.exponentialRampToValueAtTime(0.00001, context.currentTime + 0.2)
      setTimeout(() => oscillator.stop(), 200)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    if (!isEditing) {
      const parts = value.split(":").map((part) => Number.parseInt(part, 10) || 0)
      let totalSeconds = 0

      if (timeFormat === "SS") {
        totalSeconds = parts[0]
      } else if (timeFormat === "MM:SS") {
        totalSeconds = parts[0] * 60 + (parts[1] || 0)
      } else {
        totalSeconds = parts[0] * 3600 + (parts[1] || 0) * 60 + (parts[2] || 0)
      }

      setTimeLeft(totalSeconds)
      setInitialTime(totalSeconds)
    }
  }

  const formatTime = (seconds: number): string => {
    if (showTimeUp) return "TIME UP"
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const getTimerColor = () => {
    if (showTimeUp) return "text-white"
    if (!isRunning) return "text-white"
    const progress = timeLeft / (initialTime || 1)
    if (progress > 0.5) return "text-green-500"
    if (progress > 0.25) return "text-yellow-500"
    return "text-red-500"
  }

  const handlePresetEdit = (index: number, value: number) => {
    setHasUserEditedPresets(true)
    const newPresets = [...presets]
    newPresets[index] = value
    setPresets(newPresets)
    setFormatPresets((prev) => ({
      ...prev,
      [timeFormat]: newPresets,
    }))
    if (!isPomodoroMode) {
      setOriginalPresets(newPresets)
    } else {
      // Update Pomodoro times when presets are changed in Pomodoro mode
      setPomodoroTimes((prevTimes) => ({
        ...prevTimes,
        [index === 0 ? "work" : index === 1 ? "shortBreak" : "longBreak"]: value * 60,
      }))
    }
    showNotification(
      `Preset updated to ${value} ${timeFormat === "SS" ? "seconds" : timeFormat === "MM:SS" ? "minutes" : "hours"}`,
    )
    setEditingPreset(null)
  }

  const updateTimer = (seconds: number) => {
    setTimeLeft(seconds)
    setInitialTime(seconds)
  }

  const handleInputFocus = () => setIsInputFocused(true)
  const handleInputBlur = () => setIsInputFocused(false)

  const handlePomodoroPhaseEnd = () => {
    setTimeout(() => {
      setShowTimeUp(false)
      setIsTimeUp(false)

      if (pomodoroPhase === "work") {
        setPomodoroPhase("shortBreak")
        setTimeLeft(pomodoroTimes.shortBreak)
        showNotification("Short Break Started")
      } else if (pomodoroPhase === "shortBreak") {
        if (pomodoroCycle % 8 === 0) {
          setPomodoroPhase("longBreak")
          setTimeLeft(pomodoroTimes.longBreak)
          showNotification("Long Break Started")
        } else {
          setPomodoroPhase("work")
          setTimeLeft(pomodoroTimes.work)
          showNotification("Work Session Started")
        }
      } else {
        // longBreak
        setPomodoroPhase("work")
        setTimeLeft(pomodoroTimes.work)
        showNotification("New Round Started")
        setRound((round) => round + 1)
      }
      setPomodoroCycle((cycle) => cycle + 1)
      setIsRunning(true)
    }, 3000)
  }

  const startTimer = () => {
    if (timeLeft > 0) {
      setIsRunning(true)
      setIsEditing(false)
      if (isPomodoroMode) {
        // Start Pomodoro cycle
        setPomodoroPhase("work")
        setPomodoroCycle(1)
        setTimeLeft(pomodoroTimes.work)
        showNotification("Pomodoro Work Session Started")
      }
    }
  }

  const onPomodoroStart = () => {
    const workTime = pomodoroTimes.work
    setTimeLeft(workTime)
    setInitialTime(workTime)
    setPomodoroPhase("work")
    setPomodoroCycle(1)
    setIsRunning(true)
    showNotification("Pomodoro Work Session Started")
  }

  const handleStartClick = () => {
    setShowRipple(true)
  }

  const handleRippleComplete = () => {
    setShowRipple(false)
  }

  useEffect(() => {
    // For onboarding/demonstration, we'll always show instructions initially.
    // To revert to showing only once per session, uncomment the original logic below.
    setShowInstructions(true)

    // Original logic to show instructions only once:
    // const hasSeenInstructions = localStorage.getItem("hasSeenInstructions")
    // if (hasSeenInstructions) {
    //   setShowInstructions(false)
    // }
  }, [])

  const handleCloseInstructions = () => {
    setShowInstructions(false)
    localStorage.setItem("hasSeenInstructions", "true")
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className={`min-h-screen ${isTimeUp ? "bg-red-600" : "bg-black"} text-white flex flex-col relative overflow-hidden transition-colors duration-300`}
    >
      <AnimatePresence>
        {showInstructions && <InstructionsScreen onContinue={handleCloseInstructions} />}
      </AnimatePresence>
      <RippleEffect isVisible={showRipple} onAnimationComplete={handleRippleComplete} />
      <motion.main
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className={`flex-1 flex flex-col items-center justify-center p-8 relative z-10`}
      >
        <AnimatedGrid />
        <div className="absolute top-8 left-8 right-8 flex justify-between items-center">
          <svg width="54.9" height="24" viewBox="0 0 183 80" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M102.018 68.4308V48.7877L84 16H99.6554L109.329 34.9046L118.855 16H134.511L116.566 48.7877V68.4308H102.018Z"
              fill="white"
            />
            <path
              d="M128.612 68.4308L147.517 16H163.985L182.889 68.4308H168.12L165.166 59.7908H146.262L143.308 68.4308H128.612ZM150.102 48.5662H161.4L155.788 31.9508L150.102 48.5662Z"
              fill="white"
            />
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M43.0769 6.15385H64.6154C69.7134 6.15385 73.8462 10.2866 73.8462 15.3846V70.7692C73.8462 75.8672 69.7134 80 64.6154 80H9.23077C4.13276 80 0 75.8672 0 70.7692V15.3846C0 10.2866 4.13276 6.15385 9.23077 6.15385H30.7692V0H43.0769V6.15385ZM12.3077 18.4615V67.6923H61.5385V18.4615H12.3077ZM30.7692 24.6154H43.0769V40.5279L53.5822 51.0332L44.8793 59.736L30.7692 45.6259V24.6154Z"
              fill="white"
            />
          </svg>
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="p-4 hover:bg-white/10 transition-colors rounded-[4px]"
          >
            {soundEnabled ? <Volume2 size={24} /> : <VolumeX size={24} />}
          </button>
        </div>

        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="w-full max-w-6xl flex flex-col items-center justify-center gap-12 mb-12 relative"
        >
          <NotificationPopup message={notification} />
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
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            <TimerDisplay
              time={formatTime(timeLeft)
                .split(":")
                .slice(timeFormat === "SS" ? 2 : timeFormat === "MM:SS" ? 1 : 0)
                .join(":")}
              showTimeUp={showTimeUp}
              timerColor={getTimerColor()}
              timeFormat={timeFormat}
              handleInputChange={handleInputChange}
              onInputFocus={handleInputFocus}
              onInputBlur={handleInputBlur}
              isEditing={isEditing}
              setIsEditing={setIsEditing}
              isPomodoroMode={isPomodoroMode}
              pomodoroPhase={pomodoroPhase}
            />
          </motion.div>
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.5 }}
          >
            <ControlButtons
              isRunning={isRunning}
              timeLeft={timeLeft}
              isPomodoroMode={isPomodoroMode}
              onStart={startTimer}
              onPomodoroStart={onPomodoroStart}
              onPause={() => setIsRunning(false)}
              onReset={
                isPomodoroMode
                  ? resetCurrentPhase
                  : () => {
                      setIsRunning(false)
                      setTimeLeft(0)
                      setInitialTime(0)
                    }
              }
              onIncrement={() => {
                if (!isRunning) {
                  const newTime = timeLeft + 5
                  setTimeLeft(newTime)
                  setInitialTime(newTime)
                }
              }}
              onDecrement={() => {
                if (!isRunning) {
                  const newTime = Math.max(0, timeLeft - 5)
                  setTimeLeft(newTime)
                  setInitialTime(newTime)
                }
              }}
              onStartClick={handleStartClick}
            />
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="w-full flex justify-center items-center space-x-8 absolute bottom-12 mb-0"
        >
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.9, duration: 0.5 }}
          >
            <FormatSelector
              timeFormat={timeFormat}
              onFormatChange={(format) => {
                setTimeFormat(format)
                const newPresets = formatPresets[format]
                setPresets(newPresets)
                if (!isPomodoroMode) {
                  setOriginalPresets(newPresets)
                }
              }}
              formatPresets={formatPresets}
            />
          </motion.div>
          <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 1, duration: 0.5 }}
          >
            <PresetButtons
              presets={presets}
              originalPresets={originalPresets}
              editingPreset={editingPreset}
              isRunning={isRunning}
              onPresetClick={(value) => {
                if (!isRunning) {
                  const multiplier = timeFormat === "SS" ? 1 : timeFormat === "MM:SS" ? 60 : 3600
                  setTimeLeft(value * multiplier)
                  setInitialTime(value * multiplier)
                }
              }}
              onPresetEdit={handlePresetEdit}
              onPresetEditStart={(index) => setEditingPreset(index)}
              updateTimer={updateTimer}
              timeFormat={timeFormat}
              isPomodoroMode={isPomodoroMode}
              togglePomodoroMode={togglePomodoroMode}
              setHotkeysActive={setAreHotkeysActive}
            />
          </motion.div>
        </motion.div>
      </motion.main>
      <motion.footer
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.5 }}
        className="p-4 border-t border-white/10 text-center font-mono text-white/50 relative z-10"
      >
        © 2025 LITEDSGNSTUDIO
        <div className="text-xs mt-2">
          Press 1, 2, 3 for presets • ← → for ±5s • Space to start/pause • R to reset • Double-click preset to edit
        </div>
      </motion.footer>
      <style jsx global>{`
        input[type="number"]::-webkit-inner-spin-button,
        input[type="number"]::-webkit-outer-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
        input[type="number"] {
          -moz-appearance: textfield;
        }
      `}</style>
    </motion.div>
  )
}

export default CompetitiveTimer
