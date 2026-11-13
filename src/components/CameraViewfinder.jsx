import { useState, useEffect, useRef } from 'react'
import { motion, useTransform, useReducedMotion } from 'framer-motion'

/**
 * CameraViewfinder
 * Minimal cinema-camera viewfinder framing & optical focus reticle.
 * - 4 subtle framing marks around the hero composition bounds.
 * - Responsive focal reticle tracking cursor movement on desktop with spring damping.
 * - Initial focus-pull rack animation on entrance (soft optical blur resolving to razor sharp).
 * - Focus-lock reaction when hovering project imagery.
 * - Strictly pointer-events-none, non-obtrusive, and disabled on touch devices.
 */
export default function CameraViewfinder({
  smoothMouseX,
  smoothMouseY,
  isFocusLocked = false,
  className = '',
}) {
  const shouldReduceMotion = useReducedMotion()
  const [isFinePointer, setIsFinePointer] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
    const mq = window.matchMedia('(hover: hover) and (pointer: fine)')
    setIsFinePointer(mq.matches)
    const handler = (e) => setIsFinePointer(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  // Restrained focal reticle parallax (stays anchored near focal center)
  const reticleX = useTransform(
    smoothMouseX || { get: () => 0 },
    [-1, 1],
    shouldReduceMotion || !isFinePointer ? [0, 0] : [-32, 32]
  )
  const reticleY = useTransform(
    smoothMouseY || { get: () => 0 },
    [-1, 1],
    shouldReduceMotion || !isFinePointer ? [0, 0] : [-24, 24]
  )

  const bracketColor = isFocusLocked ? '#FFAA00' : 'rgba(255, 170, 0, 0.35)'
  const bracketBorderWidth = isFocusLocked ? 1.5 : 1

  return (
    <div
      aria-hidden="true"
      className={`absolute inset-0 pointer-events-none select-none overflow-hidden z-10 ${className}`}
    >
      {/* ── 1. FOUR CORNER FRAMING MARKS ── */}
      {/* Top-Left Corner */}
      <motion.div
        initial={shouldReduceMotion ? { opacity: 0.3 } : { opacity: 0, scale: 0.94 }}
        animate={{
          opacity: isFocusLocked ? 0.75 : 0.35,
          scale: 1,
        }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        style={{
          borderColor: bracketColor,
          borderTopWidth: bracketBorderWidth,
          borderLeftWidth: bracketBorderWidth,
        }}
        className="absolute top-4 left-4 sm:top-6 sm:left-6 w-4 h-4 sm:w-5 sm:h-5 transition-colors duration-300"
      />

      {/* Top-Right Corner */}
      <motion.div
        initial={shouldReduceMotion ? { opacity: 0.3 } : { opacity: 0, scale: 0.94 }}
        animate={{
          opacity: isFocusLocked ? 0.75 : 0.35,
          scale: 1,
        }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        style={{
          borderColor: bracketColor,
          borderTopWidth: bracketBorderWidth,
          borderRightWidth: bracketBorderWidth,
        }}
        className="absolute top-4 right-4 sm:top-6 sm:right-6 w-4 h-4 sm:w-5 sm:h-5 transition-colors duration-300"
      />

      {/* Bottom-Left Corner */}
      <motion.div
        initial={shouldReduceMotion ? { opacity: 0.3 } : { opacity: 0, scale: 0.94 }}
        animate={{
          opacity: isFocusLocked ? 0.75 : 0.35,
          scale: 1,
        }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        style={{
          borderColor: bracketColor,
          borderBottomWidth: bracketBorderWidth,
          borderLeftWidth: bracketBorderWidth,
        }}
        className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6 w-4 h-4 sm:w-5 sm:h-5 transition-colors duration-300"
      />

      {/* Bottom-Right Corner */}
      <motion.div
        initial={shouldReduceMotion ? { opacity: 0.3 } : { opacity: 0, scale: 0.94 }}
        animate={{
          opacity: isFocusLocked ? 0.75 : 0.35,
          scale: 1,
        }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        style={{
          borderColor: bracketColor,
          borderBottomWidth: bracketBorderWidth,
          borderRightWidth: bracketBorderWidth,
        }}
        className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6 w-4 h-4 sm:w-5 sm:h-5 transition-colors duration-300"
      />

      {/* ── 2. DESKTOP OPTICAL FOCUS RETICLE ── */}
      {isFinePointer && (
        <motion.div
          style={{
            x: reticleX,
            y: reticleY,
          }}
          initial={
            shouldReduceMotion
              ? { opacity: 0.3 }
              : { opacity: 0, scale: 1.25, filter: 'blur(3px)' }
          }
          animate={{
            opacity: isFocusLocked ? 0.85 : 0.3,
            scale: isFocusLocked ? 0.9 : 1,
            filter: 'blur(0px)',
          }}
          transition={{
            opacity: { duration: 0.25 },
            scale: { duration: 0.3, ease: [0.16, 1, 0.3, 1] },
            filter: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
          }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center will-change-transform"
        >
          {/* Center Optical Crosshair */}
          <div className="relative w-full h-full flex items-center justify-center">
            {/* Hairline Brackets */}
            <div
              style={{
                borderColor: bracketColor,
                borderTopWidth: bracketBorderWidth,
                borderLeftWidth: bracketBorderWidth,
              }}
              className="absolute top-0 left-0 w-2 h-2 transition-all duration-300"
            />
            <div
              style={{
                borderColor: bracketColor,
                borderTopWidth: bracketBorderWidth,
                borderRightWidth: bracketBorderWidth,
              }}
              className="absolute top-0 right-0 w-2 h-2 transition-all duration-300"
            />
            <div
              style={{
                borderColor: bracketColor,
                borderBottomWidth: bracketBorderWidth,
                borderLeftWidth: bracketBorderWidth,
              }}
              className="absolute bottom-0 left-0 w-2 h-2 transition-all duration-300"
            />
            <div
              style={{
                borderColor: bracketColor,
                borderBottomWidth: bracketBorderWidth,
                borderRightWidth: bracketBorderWidth,
              }}
              className="absolute bottom-0 right-0 w-2 h-2 transition-all duration-300"
            />

            {/* Center Focal Point */}
            <div
              style={{ backgroundColor: bracketColor }}
              className={`w-1 h-1 rounded-full transition-all duration-300 ${
                isFocusLocked ? 'scale-125' : 'scale-75'
              }`}
            />
          </div>
        </motion.div>
      )}
    </div>
  )
}
