import { useState, useEffect } from 'react'
import { motion, useReducedMotion } from 'framer-motion'

/**
 * BRUTALIST TYPOGRAPHY COLLISION × SWISS GRID DESIGN
 *
 * Sequence:
 * 1. Typography Collision (0.00s - 0.42s):
 *    Full-screen deep navy (#0F1432). Letters S, E, P, H enter from alternating directions
 *    (top-left, bottom, top, bottom-right) moving rapidly towards the centre, colliding and
 *    snapping into exact alignment with subtle mechanical overshoot (no bouncing).
 * 2. Swiss Grid Composition (0.28s - 0.50s):
 *    Hairline grid rules and registration crosses (+) draw in across asymmetric coordinates,
 *    framing the dominant typography in an architectural Swiss modular grid.
 * 3. Amber Graphic Interruption (0.45s - 0.85s):
 *    A large, hard-edged solid amber rectangle (#FFAA00) with a 3px red accent (#FF001E)
 *    sweeps horizontally across the wordmark, momentarily masking the midsection.
 * 4. Composition Breakup Transition (1.05s - 1.58s):
 *    The Swiss grid splits into 4 large geometric panels moving in 4 different directions
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

  const letters = ['S', 'E', 'P', 'H']

  // Alternating entry collision vectors with sharp overshoot
  const letterMotions = [
    {
      initial: { y: '-65%', x: '-15%', opacity: 0 },
      animate: {
        y: ['-65%', '2.5%', '0%'],
        x: ['-15%', '-0.5%', '0%'],
        opacity: [0, 1, 1],
      },
      times: [0, 0.82, 1],
      duration: 0.38,
      delay: 0.05,
    },
    {
      initial: { y: '65%', x: '-6%', opacity: 0 },
      animate: {
        y: ['65%', '-2.5%', '0%'],
        x: ['-6%', '0.5%', '0%'],
        opacity: [0, 1, 1],
      },
      times: [0, 0.82, 1],
      duration: 0.38,
      delay: 0.08,
    },
    {
      initial: { y: '-65%', x: '6%', opacity: 0 },
      animate: {
        y: ['-65%', '2.5%', '0%'],
        x: ['6%', '-0.5%', '0%'],
        opacity: [0, 1, 1],
      },
      times: [0, 0.82, 1],
      duration: 0.38,
      delay: 0.11,
    },
    {
      initial: { y: '65%', x: '15%', opacity: 0 },
      animate: {
        y: ['65%', '-2.5%', '0%'],
        x: ['15%', '0.5%', '0%'],
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

  // Reusable typography quadrant block
  const renderWordmark = () => (
    <div className="flex items-baseline justify-center select-none whitespace-nowrap">
      {letters.map((char, idx) => (
        <span key={idx} className="inline-block overflow-hidden mx-[0.03em]">
          <motion.span
            initial={letterMotions[idx].initial}
            animate={letterMotions[idx].animate}
            transition={{
              duration: letterMotions[idx].duration,
              delay: letterMotions[idx].delay,
              times: letterMotions[idx].times,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="inline-block font-wosker text-[26vw] sm:text-[25vw] md:text-[23vw] lg:text-[19rem] xl:text-[23rem] 2xl:text-[27rem] leading-[0.70] tracking-[-0.04em] text-[#FFAA00] uppercase will-change-transform"
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
      aria-label="SEPH brutalist grid collision reveal"
    >
      {/* ── 1. SWISS MODULAR GRID GUIDELINES & COORDINATE MARKS ── */}
      <motion.div
        animate={{ opacity: isExiting ? 0 : gridActive ? 1 : 0 }}
        transition={{ duration: isExiting ? 0.2 : 0.25 }}
        className="fixed inset-0 z-50 pointer-events-none overflow-hidden"
        aria-hidden="true"
      >
        {/* Primary Vertical Guideline (Center Seam 50%) */}
        <div className="absolute top-0 bottom-0 left-1/2 w-[1px] -translate-x-1/2 bg-[#F2F0E9]/15" />

        {/* Primary Horizontal Guideline (Center Seam 50%) */}
        <div className="absolute left-0 right-0 top-1/2 h-[1px] -translate-y-1/2 bg-[#F2F0E9]/15" />

        {/* Asymmetric Swiss Modular Columns (26% & 74%) */}
        <div className="absolute top-0 bottom-0 left-[26%] w-[1px] bg-[#F2F0E9]/10" />
        <div className="absolute top-0 bottom-0 left-[74%] w-[1px] bg-[#F2F0E9]/10" />

        {/* Asymmetric Swiss Modular Rows (32% & 68%) */}
        <div className="absolute left-0 right-0 top-[32%] h-[1px] bg-[#F2F0E9]/10" />
        <div className="absolute left-0 right-0 top-[68%] h-[1px] bg-[#F2F0E9]/10" />

        {/* Swiss Coordinate Registration Crosses (+) */}
        <span className="absolute top-[32%] left-[26%] -translate-x-1/2 -translate-y-1/2 font-mono text-[10px] text-[#FFAA00]/50 select-none">
          +
        </span>
        <span className="absolute top-[32%] left-[74%] -translate-x-1/2 -translate-y-1/2 font-mono text-[10px] text-[#FFAA00]/50 select-none">
          +
        </span>
        <span className="absolute top-[68%] left-[26%] -translate-x-1/2 -translate-y-1/2 font-mono text-[10px] text-[#FFAA00]/50 select-none">
          +
        </span>
        <span className="absolute top-[68%] left-[74%] -translate-x-1/2 -translate-y-1/2 font-mono text-[10px] text-[#FFAA00]/50 select-none">
          +
        </span>
        <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-mono text-[11px] text-[#FFAA00]/70 select-none">
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
        className="fixed top-0 left-0 bg-[#0F1432] z-40 overflow-hidden will-change-transform border-r border-b border-[#FFAA00]/30"
      >
        <div className="w-screen h-screen absolute top-0 left-0 flex items-center justify-center pointer-events-none">
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
        className="fixed top-0 right-0 bg-[#0F1432] z-40 overflow-hidden will-change-transform border-l border-b border-[#FFAA00]/30"
      >
        <div className="w-screen h-screen absolute top-0 right-0 flex items-center justify-center pointer-events-none">
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
        className="fixed bottom-0 left-0 bg-[#0F1432] z-40 overflow-hidden will-change-transform border-r border-t border-[#FFAA00]/30"
      >
        <div className="w-screen h-screen absolute bottom-0 left-0 flex items-center justify-center pointer-events-none">
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
        className="fixed bottom-0 right-0 bg-[#0F1432] z-40 overflow-hidden will-change-transform border-l border-t border-[#FFAA00]/30"
      >
        <div className="w-screen h-screen absolute bottom-0 right-0 flex items-center justify-center pointer-events-none">
          {renderWordmark()}
        </div>
      </motion.div>

      {/* ── 3. SOLID AMBER GRAPHIC INTERRUPTION (0.45s - 0.85s) ── */}
      {amberSweepActive && !isExiting && (
        <motion.div
          initial={{ x: '-100vw' }}
          animate={{ x: '105vw' }}
          transition={{
            duration: 0.42,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="fixed top-1/2 -translate-y-1/2 z-[55] pointer-events-none flex items-center"
          aria-hidden="true"
        >
          <div className="relative w-[34vw] sm:w-[28vw] md:w-[360px] lg:w-[440px] h-[24vh] sm:h-[28vh] md:h-[210px] lg:h-[260px] bg-[#FFAA00] flex items-center justify-between rounded-none shadow-none">
            {/* Sparing, razor-sharp red datum accent on leading vertical edge */}
            <div className="absolute right-0 top-0 bottom-0 w-[4px] bg-[#FF001E]" />
          </div>
        </motion.div>
      )}
    </div>
  )
}
