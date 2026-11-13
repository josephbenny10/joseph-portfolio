import { useEffect, useRef } from 'react'
import { useMotionValue, useSpring, useReducedMotion } from 'framer-motion'

/**
 * useWindowMouse
 * High-performance, normalized [-1, 1] cursor tracking across the window.
 * - Only listens on devices with fine pointer and hover capabilities.
 * - Uses passive event listeners to avoid blocking scrolling.
 * - Drives Framer Motion springs directly without triggering React re-renders.
 * - Gracefully respects prefers-reduced-motion.
 */
export function useWindowMouse(customSpringConfig) {
  const shouldReduceMotion = useReducedMotion()
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const defaultConfig = { damping: 26, stiffness: 180, mass: 0.5 }
  const springConfig = customSpringConfig || defaultConfig

  const smoothX = useSpring(mouseX, springConfig)
  const smoothY = useSpring(mouseY, springConfig)

  const isFinePointer = useRef(true)

  useEffect(() => {
    if (shouldReduceMotion) return

    const mq = window.matchMedia('(hover: hover) and (pointer: fine)')
    isFinePointer.current = mq.matches

    const handleMediaChange = (e) => {
      isFinePointer.current = e.matches
      if (!e.matches) {
        mouseX.set(0)
        mouseY.set(0)
      }
    }

    mq.addEventListener('change', handleMediaChange)

    const handleMouseMove = (e) => {
      if (!isFinePointer.current) return
      const w = window.innerWidth || 1
      const h = window.innerHeight || 1
      const normX = ((e.clientX / w) - 0.5) * 2
      const normY = ((e.clientY / h) - 0.5) * 2
      mouseX.set(Math.max(-1, Math.min(1, normX)))
      mouseY.set(Math.max(-1, Math.min(1, normY)))
    }

    const handleMouseLeave = () => {
      mouseX.set(0)
      mouseY.set(0)
    }

    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    document.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      mq.removeEventListener('change', handleMediaChange)
      window.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [shouldReduceMotion, mouseX, mouseY])

  return { mouseX, mouseY, smoothX, smoothY }
}
