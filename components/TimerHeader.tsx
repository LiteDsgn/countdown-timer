"use client"

import type React from "react"
import { Volume2, VolumeX } from "lucide-react"

interface TimerHeaderProps {
  soundEnabled: boolean
  onToggleSound: () => void
}

const TimerHeader: React.FC<TimerHeaderProps> = ({ soundEnabled, onToggleSound }) => {
  return (
    <div className="absolute top-8 left-8 right-8 flex justify-between items-center">
      <svg width="55" height="24" viewBox="0 0 55 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M30.6002 20.5278V14.6359L25.1957 4.80127H29.8915L32.7931 10.4717L35.6504 4.80127H40.3464L34.9638 14.6359V20.5278H30.6002Z"
          fill="white"
        />

        <path
          d="M38.577 20.5278L44.2475 4.80127H49.1871L54.8573 20.5278H50.4274L49.5413 17.9363H43.8711L42.985 20.5278H38.577ZM45.0229 14.5695H48.4117L46.7284 9.58569L45.0229 14.5695Z"
          fill="white"
        />

        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M12.9209 1.84779H19.3813C20.9104 1.84779 22.1501 3.0874 22.1501 4.61654V21.2291C22.1501 22.7582 20.9104 23.9978 19.3813 23.9978H2.76876C1.23962 23.9978 0 22.7582 0 21.2291V4.61654C0 3.0874 1.23962 1.84779 2.76876 1.84779H9.22918V0.00195312H12.9209V1.84779ZM3.69168 5.53945V20.3062H18.4584V5.53945H3.69168ZM9.22918 7.38531H12.9209V12.1582L16.0719 15.3093L13.4615 17.9197L9.22918 13.6874V7.38531Z"
          fill="white"
        />
      </svg>
      <button onClick={onToggleSound} className="p-4 hover:bg-white/10 transition-colors rounded-[4px]">
        {soundEnabled ? <Volume2 size={24} /> : <VolumeX size={24} />}
      </button>
    </div>
  )
}

export default TimerHeader
