import type React from "react"
import { useEffect, useRef } from "react"

const AnimatedGrid: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    // Create noise texture
    const noiseCanvas = document.createElement("canvas")
    const noiseCtx = noiseCanvas.getContext("2d")
    if (!noiseCtx) return

    noiseCanvas.width = 512
    noiseCanvas.height = 512

    const regenerateNoise = () => {
      const noiseData = noiseCtx.createImageData(512, 512)
      for (let i = 0; i < noiseData.data.length; i += 4) {
        noiseData.data[i] = noiseData.data[i + 1] = noiseData.data[i + 2] = Math.floor(Math.random() * 255)
        noiseData.data[i + 3] = 25 // Intensity of the grain
      }
      noiseCtx.putImageData(noiseData, 0, 0)
    }

    regenerateNoise()
    setInterval(regenerateNoise, 5000)

    const cellSize = 200 // Increased cell size for larger squares
    const rows = Math.ceil(canvas.height / cellSize)
    const cols = Math.ceil(canvas.width / cellSize)

    const cells: {
      opacity: number
      targetOpacity: number
      transitionProgress: number
      borderProgress: number
      borderDirection: 1 | -1
    }[][] = []

    for (let i = 0; i < rows; i++) {
      cells[i] = []
      for (let j = 0; j < cols; j++) {
        cells[i][j] = {
          opacity: Math.random() * 0.02,
          targetOpacity: Math.random() * 0.02,
          transitionProgress: 0,
          borderProgress: Math.random(),
          borderDirection: Math.random() > 0.5 ? 1 : -1,
        }
      }
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Apply noise texture with random opacity
      for (let y = 0; y < canvas.height; y += 512) {
        for (let x = 0; x < canvas.width; x += 512) {
          ctx.globalAlpha = Math.random() * 0.1 // Random opacity between 0 and 0.1
          ctx.drawImage(noiseCanvas, x, y)
        }
      }
      ctx.globalAlpha = 1

      for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
          const cell = cells[i][j]

          cell.transitionProgress += 1 / (60 * 10)

          if (cell.transitionProgress >= 1) {
            cell.opacity = cell.targetOpacity
            cell.targetOpacity = Math.random() * 0.02
            cell.transitionProgress = 0
          } else {
            cell.opacity = cell.opacity + (cell.targetOpacity - cell.opacity) * cell.transitionProgress
          }

          // Update border animation
          cell.borderProgress += 0.005 * cell.borderDirection
          if (cell.borderProgress > 1 || cell.borderProgress < 0) {
            cell.borderDirection *= -1
          }

          ctx.fillStyle = `rgba(255, 255, 255, ${cell.opacity})`
          ctx.fillRect(j * cellSize, i * cellSize, cellSize, cellSize)

          // Draw animated border
          ctx.strokeStyle = `rgba(255, 255, 255, 0.02)`
          ctx.lineWidth = 2
          ctx.beginPath()
          ctx.moveTo(j * cellSize, i * cellSize)
          ctx.lineTo(j * cellSize + cellSize * cell.borderProgress, i * cellSize)
          ctx.moveTo(j * cellSize + cellSize, i * cellSize)
          ctx.lineTo(j * cellSize + cellSize, i * cellSize + cellSize * cell.borderProgress)
          ctx.moveTo(j * cellSize + cellSize, i * cellSize + cellSize)
          ctx.lineTo(j * cellSize + cellSize - cellSize * cell.borderProgress, i * cellSize + cellSize)
          ctx.moveTo(j * cellSize, i * cellSize + cellSize)
          ctx.lineTo(j * cellSize, i * cellSize + cellSize - cellSize * cell.borderProgress)
          ctx.stroke()
        }
      }

      requestAnimationFrame(animate)
    }

    requestAnimationFrame(animate)

    return () => {
      window.removeEventListener("resize", resizeCanvas)
    }
  }, [])

  return <canvas ref={canvasRef} className="fixed inset-0 z-0" />
}

export default AnimatedGrid
