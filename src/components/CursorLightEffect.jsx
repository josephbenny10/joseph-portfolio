import { useEffect, useRef } from 'react'

/**
 * Context-Aware Cursor Lighting System
 *
 * Automatically adapts the monochromatic light colour based on the actual
 * visual surface or element currently underneath the cursor:
 * - Deep navy backgrounds (#0F1432) -> #FFAA00 (Amber)
 * - Red-accented interactive elements -> #FF001E (Soft Red)
 * - Video thumbnails and dark media areas -> #F2F0E9 (Warm White)
 * - Light-coloured sections -> #0F1432 (Deep Navy)
 *
 * Transitions smoothly between colours across consecutive frames without
 * ever blending contrasting hues in the same gradient, avoiding flashing.
 */

// Target color definitions (RGB)
const COLOR_AMBER = { r: 255, g: 170, b: 0, name: '#FFAA00 (Amber)' }
const COLOR_RED = { r: 255, g: 0, b: 30, name: '#FF001E (Soft Red)' }
const COLOR_WARM_WHITE = { r: 242, g: 240, b: 233, name: '#F2F0E9 (Warm White)' }
const COLOR_DEEP_NAVY = { r: 15, g: 20, b: 50, name: '#0F1432 (Deep Navy)' }

export default function CursorLightEffect() {
  const canvasRef = useRef(null)

  useEffect(() => {
    // 1. Disable on touch / coarse pointer devices
    if (typeof window === 'undefined') return
    const isCoarse = window.matchMedia('(pointer: coarse)').matches
    const isFine = window.matchMedia('(pointer: fine)').matches
    if (isCoarse || !isFine) return

    // 2. Respect prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) return

    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationFrameId = null
    let points = []
    let lastPos = null
    let isRunning = false

    // Color morphing state
    let targetColor = COLOR_AMBER
    const currentColor = { r: COLOR_AMBER.r, g: COLOR_AMBER.g, b: COLOR_AMBER.b }

    // Timing parameters
    const TRAIL_LIFETIME = 230 // ms (within 200–250ms range)
    const BASE_RADIUS = 150 // px (large feathered atmospheric spread)
    const LERP_FACTOR = 0.09 // Smooth ~160ms color transition rate

    // Helper 1: Check if element is a video thumbnail or dark media surface
    const isMediaElement = (el) => {
      if (!el || el === document.body || el === document.documentElement) return false

      // Direct media tags
      if (el.tagName === 'VIDEO' || el.tagName === 'IMG') return true

      // Media containers / project thumbnails
      const mediaContainer = el.closest(
        '[data-cursor="VIEW"], [class*="aspect-"], [class*="bg-[#0A0E26]"], [class*="bg-[#050716]"], [class*="bg-black"]'
      )
      if (mediaContainer && mediaContainer !== document.body && mediaContainer.id !== 'root') {
        return true
      }

      return false
    }

    // Helper 2: Check if element is an interactive element with red styling/accent
    const isRedInteractiveElement = (el) => {
      if (!el || el === document.body || el === document.documentElement) return false

      let cur = el
      while (cur && cur !== document.body && cur !== document.documentElement) {
        // Prevent matching app root container or general wrapper
        if (cur.id === 'root' || (cur.classList && cur.classList.contains('min-h-screen'))) {
          break
        }

        const rawClass = typeof cur.className === 'string'
          ? cur.className
          : (cur.getAttribute ? (cur.getAttribute('class') || '') : '')

        if (rawClass) {
          const tokens = rawClass.split(/\s+/)
          for (const token of tokens) {
            // Exclude pseudo-element selection classes (e.g. selection:bg-[#FF001E])
            if (token.startsWith('selection:')) continue

            const lower = token.toLowerCase()
            if (
              lower.includes('bg-[#ff001e]') ||
              lower.includes('hover:bg-[#ff001e]') ||
              lower.includes('text-[#ff001e]') ||
              lower.includes('hover:text-[#ff001e]') ||
              lower.includes('d9001a')
            ) {
              return true
            }
          }
        }

        cur = cur.parentElement
      }

      return false
    }

    // Helper 3: Check if element is within a light-coloured section (luminance > 175)
    const isLightSectionElement = (el) => {
      if (!el || el === document.documentElement) return false

      let cur = el
      while (cur && cur !== document.documentElement) {
        const style = window.getComputedStyle(cur)
        const bg = style.backgroundColor
        if (bg && bg !== 'rgba(0, 0, 0, 0)' && bg !== 'transparent') {
          const nums = bg.match(/\d+(\.\d+)?/g)
          if (nums && nums.length >= 3) {
            const r = parseFloat(nums[0])
            const g = parseFloat(nums[1])
            const b = parseFloat(nums[2])
            const a = nums[3] !== undefined ? parseFloat(nums[3]) : 1
            if (a > 0.4) {
              const lum = r * 0.299 + g * 0.587 + b * 0.114
              if (lum > 175) {
                return true
              }
              return false
            }
          }
        }
        cur = cur.parentElement
      }

      return false
    }

    // Lightweight contextual surface detection
    const detectContextColor = (x, y) => {
      const el = document.elementFromPoint(x, y)
      if (!el) return COLOR_AMBER

      const inMedia = isMediaElement(el)
      const inRed = isRedInteractiveElement(el)

      let detected = COLOR_AMBER

      // Rule 1: Red-accented interactive elements (#FF001E)
      if (inRed) {
        if (!inMedia || el.closest('button, [role="button"], a, input')) {
          detected = COLOR_RED
        }
      }

      // Rule 2: Video thumbnails and dark media areas (#F2F0E9)
      if (detected === COLOR_AMBER && inMedia) {
        detected = COLOR_WARM_WHITE
      }

      // Rule 3: Light-coloured sections (#0F1432)
      if (detected === COLOR_AMBER && isLightSectionElement(el)) {
        detected = COLOR_DEEP_NAVY
      }

      // Rule 4: Fallback to deep navy background (#FFAA00)
      return detected
    }

    // Set canvas dimensions with devicePixelRatio handling
    const handleResize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = window.innerWidth * dpr
      canvas.height = window.innerHeight * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    handleResize()
    window.addEventListener('resize', handleResize)

    // Render loop using requestAnimationFrame
    const render = () => {
      const now = performance.now()

      // Smooth color morphing toward the context target
      currentColor.r += (targetColor.r - currentColor.r) * LERP_FACTOR
      currentColor.g += (targetColor.g - currentColor.g) * LERP_FACTOR
      currentColor.b += (targetColor.b - currentColor.b) * LERP_FACTOR

      // Clear the canvas
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight)

      // Prune points that have exceeded lifetime
      points = points.filter((p) => now - p.time < TRAIL_LIFETIME)

      // Idle when stationary and trail has dissolved
      if (points.length === 0) {
        isRunning = false
        lastPos = null
        return
      }

      const cr = Math.round(currentColor.r)
      const cg = Math.round(currentColor.g)
      const cb = Math.round(currentColor.b)

      // Use standard source-over compositing for consistent alpha blending across all surfaces
      ctx.globalCompositeOperation = 'source-over'

      for (let i = 0; i < points.length; i++) {
        const p = points[i]
        const age = (now - p.time) / TRAIL_LIFETIME // 0 -> 1
        const decay = Math.max(0, 1 - Math.pow(age, 1.4))
        const radius = BASE_RADIUS * (0.9 + age * 0.15)

        // Monochromatic radial gradient with a large feathered transparent edge
        // Opacity restrained to ~0.07 at peak
        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, radius)
        grad.addColorStop(0, `rgba(${cr}, ${cg}, ${cb}, ${decay * 0.07})`)
        grad.addColorStop(0.3, `rgba(${cr}, ${cg}, ${cb}, ${decay * 0.04})`)
        grad.addColorStop(0.6, `rgba(${cr}, ${cg}, ${cb}, ${decay * 0.015})`)
        grad.addColorStop(0.85, `rgba(${cr}, ${cg}, ${cb}, ${decay * 0.004})`)
        grad.addColorStop(1, `rgba(${cr}, ${cg}, ${cb}, 0)`)

        ctx.fillStyle = grad
        ctx.beginPath()
        ctx.arc(p.x, p.y, radius, 0, Math.PI * 2)
        ctx.fill()
      }

      ctx.globalCompositeOperation = 'source-over'
      animationFrameId = requestAnimationFrame(render)
    }

    const startLoop = () => {
      if (!isRunning) {
        isRunning = true
        animationFrameId = requestAnimationFrame(render)
      }
    }

    // Capture cursor movement, detect context and interpolate points
    const handleMouseMove = (e) => {
      const now = performance.now()
      const currentX = e.clientX
      const currentY = e.clientY

      // Context-aware color detection based on element beneath cursor
      targetColor = detectContextColor(currentX, currentY)

      if (lastPos) {
        const dx = currentX - lastPos.x
        const dy = currentY - lastPos.y
        const dist = Math.hypot(dx, dy)

        // Ensure smooth unbroken trail during rapid mouse sweeps
        if (dist > 18) {
          const steps = Math.min(Math.floor(dist / 14), 5)
          for (let s = 1; s <= steps; s++) {
            points.push({
              x: lastPos.x + dx * (s / steps),
              y: lastPos.y + dy * (s / steps),
              time: now,
            })
          }
        }
      }

      points.push({ x: currentX, y: currentY, time: now })
      lastPos = { x: currentX, y: currentY }

      startLoop()
    }

    const handleMouseLeave = () => {
      lastPos = null
      targetColor = COLOR_AMBER
    }

    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    document.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseleave', handleMouseLeave)
      if (animationFrameId) cancelAnimationFrame(animationFrameId)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-30 w-full h-full select-none"
      aria-hidden="true"
    />
  )
}
