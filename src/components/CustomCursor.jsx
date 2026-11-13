import { useEffect, useState, useRef } from 'react'
import { motion, useMotionValue, useSpring, useReducedMotion } from 'framer-motion'

/**
 * Refined Custom Cursor:
 * - Default: Minimal 8px amber (#FFAA00) dot following the pointer with zero noticeable lag.
 * - Project Cards (Selected Work & Hero): Transforms into a 62px amber circle with "VIEW ↗" text.
 * - Interactive (Buttons/Links): Expands into a 24px subtle amber ring indicator (no VIEW label).
 * - Only active on desktop (pointer: fine); normal native cursor is preserved on touch/mobile.
 * - Hide native cursor only where custom cursor is active.
 * - Click feedback (tactile scale-down).
 */
export default function CustomCursor() {
  const [cursorMode, setCursorMode] = useState('default') // 'default' | 'view' | 'interactive'
  const [isPressed, setIsPressed] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const shouldReduceMotion = useReducedMotion()

  const isFinePointer = useRef(false)
  const lastMousePos = useRef({ x: -100, y: -100 })

  // Direct compositor motion values for zero-lag tracking
  const rawX = useMotionValue(-100)
  const rawY = useMotionValue(-100)

  // Near-instantaneous spring (low mass, high stiffness) for razor-sharp responsiveness without sluggish trailing
  const springConfig = { damping: 28, stiffness: 700, mass: 0.05 }
  const smoothX = useSpring(rawX, springConfig)
  const smoothY = useSpring(rawY, springConfig)

  useEffect(() => {
    // Only activate on devices with fine pointer and hover support (desktop mouse)
    const media = window.matchMedia('(hover: hover) and (pointer: fine)')
    isFinePointer.current = media.matches

    if (!isFinePointer.current) {
      document.body.classList.remove('has-custom-cursor')
      return
    }

    const handleMediaChange = (e) => {
      isFinePointer.current = e.matches
      if (!e.matches) {
        document.body.classList.remove('has-custom-cursor')
        setIsVisible(false)
      }
    }
    media.addEventListener('change', handleMediaChange)

    const updateCursorTarget = (target) => {
      if (!target) {
        setCursorMode('default')
        return
      }

      // 1. Project cards (Selected Work cards or Hero project panels)
      const projectCard = target.closest('[data-cursor="VIEW"], [data-cursor]')
      if (projectCard) {
        setCursorMode('view')
        return
      }

      // 2. Interactive elements (buttons, links, inputs, controls)
      const interactiveEl = target.closest('a, button, [role="button"], input, textarea, select, label')
      if (interactiveEl) {
        setCursorMode('interactive')
        return
      }

      // 3. Normal surface
      setCursorMode('default')
    }

    const handleMouseMove = (e) => {
      lastMousePos.current = { x: e.clientX, y: e.clientY }
      rawX.set(e.clientX)
      rawY.set(e.clientY)

      if (!isVisible) {
        setIsVisible(true)
        document.body.classList.add('has-custom-cursor')
      }

      updateCursorTarget(e.target)
    }

    const handleMouseDown = () => setIsPressed(true)
    const handleMouseUp = () => setIsPressed(false)

    const handleMouseLeave = () => {
      setIsVisible(false)
      document.body.classList.remove('has-custom-cursor')
    }

    const handleMouseEnter = () => {
      setIsVisible(true)
      document.body.classList.add('has-custom-cursor')
    }

    const handleScroll = () => {
      if (lastMousePos.current.x >= 0 && lastMousePos.current.y >= 0) {
        const el = document.elementFromPoint(lastMousePos.current.x, lastMousePos.current.y)
        updateCursorTarget(el)
      }
    }

    const handleWindowBlur = () => {
      setIsVisible(false)
      document.body.classList.remove('has-custom-cursor')
    }

    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    window.addEventListener('mousedown', handleMouseDown)
    window.addEventListener('mouseup', handleMouseUp)
    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('blur', handleWindowBlur)
    document.addEventListener('mouseleave', handleMouseLeave)
    document.addEventListener('mouseenter', handleMouseEnter)

    return () => {
      media.removeEventListener('change', handleMediaChange)
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mousedown', handleMouseDown)
      window.removeEventListener('mouseup', handleMouseUp)
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('blur', handleWindowBlur)
      document.removeEventListener('mouseleave', handleMouseLeave)
      document.removeEventListener('mouseenter', handleMouseEnter)
      document.body.classList.remove('has-custom-cursor')
    }
  }, [rawX, rawY, isVisible])

  if (!isVisible) return null

  const isView = cursorMode === 'view'
  const isInteractive = cursorMode === 'interactive'

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none fixed top-0 left-0 z-[9999] flex items-center justify-center select-none"
      style={{
        x: smoothX,
        y: smoothY,
        translateX: '-50%',
        translateY: '-50%',
      }}
      animate={{
        width: isView ? 64 : isInteractive ? 24 : 8,
        height: isView ? 64 : isInteractive ? 24 : 8,
        borderRadius: 9999,
        backgroundColor: isView
          ? '#FFAA00'
          : isInteractive
          ? 'rgba(255, 170, 0, 0.18)'
          : '#FFAA00',
        borderWidth: isInteractive ? 1.5 : 0,
        borderColor: isInteractive ? '#FFAA00' : 'transparent',
        scale: isPressed ? 0.85 : 1,
      }}
      transition={
        shouldReduceMotion
          ? { duration: 0 }
          : {
              type: 'spring',
              damping: 24,
              stiffness: 380,
              mass: 0.22,
            }
      }
    >
      {/* ── "VIEW ↗" Badge Content (Only for Project Cards) ── */}
      {isView && (
        <motion.span
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.6 }}
          transition={{ duration: 0.16, ease: 'easeOut' }}
          className="font-mono text-[10px] font-black tracking-widest text-[#0F1432] uppercase flex items-center justify-center gap-0.5 whitespace-nowrap leading-none select-none"
        >
          <span>VIEW</span>
          <span className="text-xs font-bold leading-none">↗</span>
        </motion.span>
      )}

      {/* ── Interactive Element Center Dot (Buttons & Links) ── */}
      {isInteractive && (
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="w-1 h-1 rounded-full bg-[#FFAA00] block"
        />
      )}
    </motion.div>
  )
}
