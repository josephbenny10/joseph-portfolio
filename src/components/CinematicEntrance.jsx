import { useState, useEffect } from 'react'
import { motion, useReducedMotion } from 'framer-motion'

/**
 * BRUTALIST TYPOGRAPHY COLLISION × SWISS GRID DESIGN (FULLY RESPONSIVE)
 *
 * Sequence:
 * 1. Typography Collision (0.00s - 0.42s):
 *    Full-screen deep navy (#0F1432). Letters S, E, P, H enter from alternating directions
 *    (top-left, bottom-left, top-right, bottom-right) moving rapidly towards the centre,
 *    colliding and snapping into exact alignment with subtle mechanical overshoot (no bouncing).
 * 2. Swiss Grid Composition (0.28s - 0.50s):
 *    Hairline grid rules and registration crosses (+) draw in across asymmetric coordinates,
 *    framing the dominant typography in an architectural Swiss modular grid.
 * 3. Amber Graphic Interruption (0.45s - 0.85s):
 *    A hard-edged solid amber rectangle (#FFAA00) with a red accent (#FF001E)
 *    sweeps horizontally across the wordmark, momentarily masking the midsection.
 * 4. Composition Breakup Transition (1.05s - 1.58s):
 *    The Swiss grid splits into 4 large geometric panels moving in 4 cardinal directions
 *    (North, East, West, South) with sharp brutalist easing ([0.85, 0, 0.15, 1]),
 *    disassembling the composition and revealing the ready portfolio underneath.
 * 5. Completion (< 1.65s):
 *    Body scroll unlocks at 1.05s, pointer events clear immediately, and the component
 *    unmounts cleanly by 1.65s without touching the hero underneath.
 */
export default function CinematicEntrance() {
  const shouldReduceMotion = useReducedMotion()
  const [gridActive, setGridActive] = useState(false)
  const [amberSweepActive, setAmberSweepActive] = useState(false)
  const [isExiting, setIsExiting] = useState(false)
  const [entranceDone, setEntranceDone] = useState(false)

  // Track exact viewport dimensions dynamically (handles mobile address bars and orientation flips)
  const [dimensions, setDimensions] = useState(() => ({
    width: typeof window !== 'undefined' ? window.innerWidth : 1200,
    height: typeof window !== 'undefined' ? window.innerHeight : 800,
  }))

  useEffect(() => {
    const updateDimensions = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      })
    }
    updateDimensions()
    window.addEventListener('resize', updateDimensions)
    window.addEventListener('orientationchange', updateDimensions)
    return () => {
      window.removeEventListener('resize', updateDimensions)
      window.removeEventListener('orientationchange', updateDimensions)
    }
  }, [])

  const letters = ['S', 'E', 'P', 'H']

  // Alternating entry collision vectors with sharp overshoot
  const letterMotions = [
    {
      initial: { y: '-60%', x: '-12%', opacity: 0 },
      animate: {
        y: ['-60%', '2%', '0%'],
        x: ['-12%', '-0.5%', '0%'],
        opacity: [0, 1, 1],
      },
      times: [0, 0.82, 1],
      duration: 0.38,
      delay: 0.05,
    },
    {
      initial: { y: '60%', x: '-5%', opacity: 0 },
      animate: {
        y: ['60%', '-2%', '0%'],
        x: ['-5%', '0.5%', '0%'],
        opacity: [0, 1, 1],
      },
      times: [0, 0.82, 1],
      duration: 0.38,
      delay: 0.08,
    },
    {
      initial: { y: '-60%', x: '5%', opacity: 0 },
      animate: {
        y: ['-60%', '2%', '0%'],
        x: ['5%', '-0.5%', '0%'],
        opacity: [0, 1, 1],
      },
      times: [0, 0.82, 1],
      duration: 0.38,
      delay: 0.11,
    },
    {
      initial: { y: '60%', x: '12%', opacity: 0 },
      animate: {
        y: ['60%', '-2%', '0%'],
        x: ['12%', '0.5%', '0%'],
        opacity: [0, 1, 1],
      },
      times: [0, 0.82, 1],
      duration: 0.38,
      delay: 0.14,
    },
  ]

  useEffect(() => {
    if (shouldReduceMotion) {
      setEntranceDone(true)
      return
    }

    // Lock scrolling during intro presentation
    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    // Phase 2: Swiss grid lines draw in as typography collides (0.28s)
    const gridTimer = setTimeout(() => {
      setGridActive(true)
    }, 280)

    // Phase 3: Amber graphic rectangle sweeps across (0.45s - 0.85s)
    const amberTimer = setTimeout(() => {
      setAmberSweepActive(true)
    }, 450)

    // Phase 4: Composition breakup exit transition (1.05s - 1.58s)
    // Unlock body scroll immediately as panels disassemble
    const exitTimer = setTimeout(() => {
      setIsExiting(true)
      document.body.style.overflow = originalOverflow
    }, 1050)

    // Phase 5: Final unmount
    const doneTimer = setTimeout(() => {
      setEntranceDone(true)
      document.body.style.overflow = originalOverflow
    }, 1650)

    return () => {
      clearTimeout(gridTimer)
      clearTimeout(amberTimer)
      clearTimeout(exitTimer)
      clearTimeout(doneTimer)
      document.body.style.overflow = originalOverflow
    }
  }, [shouldReduceMotion])

  if (entranceDone || shouldReduceMotion) {
    return null
  }

  // Reusable typography quadrant block:
  // - No individual letter overflow-hidden (avoids clipping letterforms during collision)
  // - Font size responsive to BOTH width and height: min(26vw, 17vh) on mobile, scaling to 18-26rem on desktop
  const renderWordmark = () => (
    <div className="flex items-center justify-center select-none whitespace-nowrap">
      {letters.map((char, idx) => (
        <span key={idx} className="inline-block mx-[0.015em] sm:mx-[0.025em]">
          <motion.span
            initial={letterMotions[idx].initial}
            animate={letterMotions[idx].animate}
            transition={{
              duration: letterMotions[idx].duration,
              delay: letterMotions[idx].delay,
              times: letterMotions[idx].times,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="inline-block font-wosker text-[min(26vw,17vh)] sm:text-[min(25vw,20vh)] md:text-[min(22vw,24vh)] lg:text-[18rem] xl:text-[22rem] 2xl:text-[26rem] leading-[0.72] tracking-[-0.04em] text-[#FFAA00] uppercase will-change-transform"
          >
            {char}
          </motion.span>
        </span>
      ))}
    </div>
  )

  return (
    <div
      className={`fixed inset-0 z-50 overflow-hidden bg-[#0F1432] ${
        isExiting ? 'pointer-events-none' : 'pointer-events-auto'
      }`}
      style={{
        width: '100vw',
        height: dimensions.height ? `${dimensions.height}px` : '100dvh',
      }}
      aria-label="SEPH brutalist grid collision reveal"
    >
      {/* ── 1. SWISS MODULAR GRID GUIDELINES & COORDINATE MARKS ── */}
      <motion.div
        animate={{ opacity: isExiting ? 0 : gridActive ? 1 : 0 }}
        transition={{ duration: isExiting ? 0.2 : 0.25 }}
        className="fixed inset-0 z-50 pointer-events-none overflow-hidden"
        style={{
          width: `${dimensions.width}px`,
          height: `${dimensions.height}px`,
        }}
        aria-hidden="true"
      >
        {/* Primary Vertical Guideline (Center Seam 50%) */}
        <div className="absolute top-0 bottom-0 left-1/2 w-[1px] -translate-x-1/2 bg-[#F2F0E9]/15" />

        {/* Primary Horizontal Guideline (Center Seam 50%) */}
        <div className="absolute left-0 right-0 top-1/2 h-[1px] -translate-y-1/2 bg-[#F2F0E9]/15" />

        {/* Asymmetric Swiss Modular Columns (18% & 82% mobile, 26% & 74% desktop) */}
        <div className="absolute top-0 bottom-0 left-[18%] sm:left-[26%] w-[1px] bg-[#F2F0E9]/10" />
        <div className="absolute top-0 bottom-0 left-[82%] sm:left-[74%] w-[1px] bg-[#F2F0E9]/10" />

        {/* Asymmetric Swiss Modular Rows (32% & 68%) */}
        <div className="absolute left-0 right-0 top-[32%] h-[1px] bg-[#F2F0E9]/10" />
        <div className="absolute left-0 right-0 top-[68%] h-[1px] bg-[#F2F0E9]/10" />

        {/* Swiss Coordinate Registration Crosses (+) */}
        <span className="absolute top-[32%] left-[18%] sm:left-[26%] -translate-x-1/2 -translate-y-1/2 font-mono text-[9px] sm:text-[10px] text-[#FFAA00]/50 select-none">
          +
        </span>
        <span className="absolute top-[32%] left-[82%] sm:left-[74%] -translate-x-1/2 -translate-y-1/2 font-mono text-[9px] sm:text-[10px] text-[#FFAA00]/50 select-none">
          +
        </span>
        <span className="absolute top-[68%] left-[18%] sm:left-[26%] -translate-x-1/2 -translate-y-1/2 font-mono text-[9px] sm:text-[10px] text-[#FFAA00]/50 select-none">
          +
        </span>
        <span className="absolute top-[68%] left-[82%] sm:left-[74%] -translate-x-1/2 -translate-y-1/2 font-mono text-[9px] sm:text-[10px] text-[#FFAA00]/50 select-none">
          +
        </span>
        <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-mono text-[10px] sm:text-[11px] text-[#FFAA00]/70 select-none">
          +
        </span>
      </motion.div>

      {/* ── 2. THE 4 DISASSEMBLING GEOMETRIC PANELS (CARDINAL DIRECTIONS) ── */}

      {/* PANEL 1: Top-Left Quadrant (Slides UP) */}
      <motion.div
        initial={{ y: '0%' }}
        animate={{ y: isExiting ? '-100%' : '0%' }}
        transition={{
          duration: 0.52,
          ease: [0.85, 0, 0.15, 1],
        }}
        style={{ width: 'calc(50% + 1px)', height: 'calc(50% + 1px)' }}
        className="fixed top-0 left-0 bg-[#0F1432] z-40 overflow-hidden will-change-transform border-r border-b border-[#FFAA00]/25"
      >
        <div
          style={{ width: `${dimensions.width}px`, height: `${dimensions.height}px` }}
          className="absolute top-0 left-0 flex items-center justify-center pointer-events-none select-none"
        >
          {renderWordmark()}
        </div>
      </motion.div>

      {/* PANEL 2: Top-Right Quadrant (Slides RIGHT) */}
      <motion.div
        initial={{ x: '0%' }}
        animate={{ x: isExiting ? '100%' : '0%' }}
        transition={{
          duration: 0.52,
          delay: 0.02,
          ease: [0.85, 0, 0.15, 1],
        }}
        style={{ width: 'calc(50% + 1px)', height: 'calc(50% + 1px)' }}
        className="fixed top-0 right-0 bg-[#0F1432] z-40 overflow-hidden will-change-transform border-b border-[#FFAA00]/25"
      >
        <div
          style={{ width: `${dimensions.width}px`, height: `${dimensions.height}px` }}
          className="absolute top-0 right-0 flex items-center justify-center pointer-events-none select-none"
        >
          {renderWordmark()}
        </div>
      </motion.div>

      {/* PANEL 3: Bottom-Left Quadrant (Slides LEFT) */}
      <motion.div
        initial={{ x: '0%' }}
        animate={{ x: isExiting ? '-100%' : '0%' }}
        transition={{
          duration: 0.52,
          delay: 0.02,
          ease: [0.85, 0, 0.15, 1],
        }}
        style={{ width: 'calc(50% + 1px)', height: 'calc(50% + 1px)' }}
        className="fixed bottom-0 left-0 bg-[#0F1432] z-40 overflow-hidden will-change-transform border-r border-[#FFAA00]/25"
      >
        <div
          style={{ width: `${dimensions.width}px`, height: `${dimensions.height}px` }}
          className="absolute bottom-0 left-0 flex items-center justify-center pointer-events-none select-none"
        >
          {renderWordmark()}
        </div>
      </motion.div>

      {/* PANEL 4: Bottom-Right Quadrant (Slides DOWN) */}
      <motion.div
        initial={{ y: '0%' }}
        animate={{ y: isExiting ? '100%' : '0%' }}
        transition={{
          duration: 0.52,
          ease: [0.85, 0, 0.15, 1],
        }}
        style={{ width: 'calc(50% + 1px)', height: 'calc(50% + 1px)' }}
        className="fixed bottom-0 right-0 bg-[#0F1432] z-40 overflow-hidden will-change-transform"
      >
        <div
          style={{ width: `${dimensions.width}px`, height: `${dimensions.height}px` }}
          className="absolute bottom-0 right-0 flex items-center justify-center pointer-events-none select-none"
        >
          {renderWordmark()}
        </div>
      </motion.div>

      {/* ── 3. SOLID AMBER GRAPHIC INTERRUPTION (0.45s - 0.85s) ── */}
      {amberSweepActive && !isExiting && (
        <motion.div
          initial={{ x: '-110%' }}
          animate={{ x: `${dimensions.width + 50}px` }}
          transition={{
            duration: 0.42,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="fixed top-1/2 -translate-y-1/2 z-[55] pointer-events-none flex items-center"
          aria-hidden="true"
        >
          <div className="relative w-[48vw] sm:w-[36vw] md:w-[360px] lg:w-[440px] h-[75px] sm:h-[110px] md:h-[180px] lg:h-[240px] bg-[#FFAA00] flex items-center justify-between rounded-none shadow-none">
            {/* Sparing, razor-sharp red datum accent on leading vertical edge */}
            <div className="absolute right-0 top-0 bottom-0 w-[3px] sm:w-[4px] bg-[#FF001E]" />
          </div>
        </motion.div>
      )}
    </div>
  )
}
