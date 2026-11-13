import { useRef, useState, useEffect } from 'react'
import { motion, useMotionValue, useSpring, useReducedMotion } from 'framer-motion'

/**
 * Reusable Magnetic interaction wrapper.
 * Subtly pulls the child element towards the cursor when hovered.
 * Automatically disabled on touch devices and if reduced motion is requested.
 */
export default function Magnetic({
  children,
  strength = 0.32,
  maxDistance = 12,
  className = '',
}) {
  const ref = useRef(null)
  const isFinePointer = useRef(true)
  const shouldReduceMotion = useReducedMotion()

  const x = useMotionValue(0)
  const y = useMotionValue(0)

  // Fluid, responsive spring physics with zero bounce
  const springConfig = { damping: 20, stiffness: 240, mass: 0.3 }
  const smoothX = useSpring(x, springConfig)
  const smoothY = useSpring(y, springConfig)

  useEffect(() => {
    isFinePointer.current = window.matchMedia('(hover: hover) and (pointer: fine)').matches
  }, [])

  const handleMouseMove = (e) => {
    if (shouldReduceMotion || !isFinePointer.current || !ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2

    const deltaX = (e.clientX - centerX) * strength
    const deltaY = (e.clientY - centerY) * strength

    // Clamp within maxDistance
    const clampedX = Math.max(-maxDistance, Math.min(maxDistance, deltaX))
    const clampedY = Math.max(-maxDistance, Math.min(maxDistance, deltaY))

    x.set(clampedX)
    y.set(clampedY)
  }

  const handleMouseLeave = () => {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={
        shouldReduceMotion
          ? {}
          : {
              x: smoothX,
              y: smoothY,
            }
      }
      className={`inline-block will-change-transform ${className}`}
    >
      {children}
    </motion.div>
  )
}
