import { useState, useRef, useEffect, useCallback } from 'react'
import {
  motion,
  useScroll,
  useTransform,
  useMotionValue,
  useSpring,
  useReducedMotion,
} from 'framer-motion'
import { ArrowDown, Play, Instagram, ArrowUpRight } from 'lucide-react'
import { profile, projects } from '../data/portfolioData'

export default function Hero({ onSelectProject }) {
  const [activeHover, setActiveHover] = useState(null)
  const heroRef = useRef(null)
  const isFinePointer = useRef(true)
  const shouldReduceMotion = useReducedMotion()
  const revealFinished = true

  useEffect(() => {
    isFinePointer.current = window.matchMedia('(pointer: fine)').matches
  }, [])

  // ── PART 3: Scroll Behaviour ──
  // Gradually shifts the SEPH lettering slightly upward as visitor scrolls away
  const { scrollY } = useScroll()
  const sephScrollY = useTransform(scrollY, [0, 600], [0, shouldReduceMotion ? 0 : -45])
  const sephScrollX = useTransform(scrollY, [0, 600], [0, shouldReduceMotion ? 0 : -15])
  const introX = useTransform(scrollY, [0, 600], [0, shouldReduceMotion ? 0 : 15])

  // Cohesive layered parallax for the project collage
  const visualY1 = useTransform(scrollY, [0, 700], [0, shouldReduceMotion ? 0 : 20])
  const visualY2 = useTransform(scrollY, [0, 700], [0, shouldReduceMotion ? 0 : -18])
  const visualY3 = useTransform(scrollY, [0, 700], [0, shouldReduceMotion ? 0 : 25])
  const rotate2 = useTransform(scrollY, [0, 700], [-1.2, shouldReduceMotion ? 0 : 0.6])
  const rotate3 = useTransform(scrollY, [0, 700], [1.0, shouldReduceMotion ? 0 : -0.8])

  // ── PART 2: Interactive Motion (Cursor Parallax) ──
  // MotionValues normalized to [-1, 1] relative to hero center
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  // Spring physics for smooth, non-jitter cursor response
  const springConfig = { damping: 25, stiffness: 180, mass: 0.55 }
  const smoothMouseX = useSpring(mouseX, springConfig)
  const smoothMouseY = useSpring(mouseY, springConfig)

  // Subtle per-letter parallax displacement (restrained max 6–10px) with micro-rotational depth
  // Letter 0: 'S'
  const sX = useTransform(smoothMouseX, [-1, 1], shouldReduceMotion ? [0, 0] : [-7, 7])
  const sY = useTransform(smoothMouseY, [-1, 1], shouldReduceMotion ? [0, 0] : [-8, 8])
  const sRot = useTransform(smoothMouseX, [-1, 1], shouldReduceMotion ? [0, 0] : [-1.2, 1.2])

  // Letter 1: 'E'
  const eX = useTransform(smoothMouseX, [-1, 1], shouldReduceMotion ? [0, 0] : [-9, 9])
  const eY = useTransform(smoothMouseY, [-1, 1], shouldReduceMotion ? [0, 0] : [-6, 6])
  const eRot = useTransform(smoothMouseX, [-1, 1], shouldReduceMotion ? [0, 0] : [1.0, -1.0])

  // Letter 2: 'P'
  const pX = useTransform(smoothMouseX, [-1, 1], shouldReduceMotion ? [0, 0] : [-6, 6])
  const pY = useTransform(smoothMouseY, [-1, 1], shouldReduceMotion ? [0, 0] : [-9, 9])
  const pRot = useTransform(smoothMouseX, [-1, 1], shouldReduceMotion ? [0, 0] : [-0.9, 0.9])

  // Letter 3: 'H'
  const hX = useTransform(smoothMouseX, [-1, 1], shouldReduceMotion ? [0, 0] : [-10, 10])
  const hY = useTransform(smoothMouseY, [-1, 1], shouldReduceMotion ? [0, 0] : [-7, 7])
  const hRot = useTransform(smoothMouseX, [-1, 1], shouldReduceMotion ? [0, 0] : [1.4, -1.4])

  const letterParallax = [
    { x: sX, y: sY, rotate: sRot },
    { x: eX, y: eY, rotate: eRot },
    { x: pX, y: pY, rotate: pRot },
    { x: hX, y: hY, rotate: hRot },
  ]

  const handleMouseMove = useCallback(
    (e) => {
      if (shouldReduceMotion || !revealFinished || !isFinePointer.current) return
      if (!heroRef.current) return
      const rect = heroRef.current.getBoundingClientRect()
      // Normalized between -1 and +1 relative to hero center
      const normX = ((e.clientX - rect.left) / rect.width - 0.5) * 2
      const normY = ((e.clientY - rect.top) / rect.height - 0.5) * 2
      mouseX.set(Math.max(-1, Math.min(1, normX)))
      mouseY.set(Math.max(-1, Math.min(1, normY)))
    },
    [shouldReduceMotion, revealFinished, mouseX, mouseY]
  )

  const handleMouseLeave = useCallback(() => {
    mouseX.set(0)
    mouseY.set(0)
  }, [mouseX, mouseY])

  // Reset smoothly when cursor exits browser window
  useEffect(() => {
    const onWindowLeave = () => {
      mouseX.set(0)
      mouseY.set(0)
    }
    document.addEventListener('mouseleave', onWindowLeave)
    return () => document.removeEventListener('mouseleave', onWindowLeave)
  }, [mouseX, mouseY])

  // Project assets
  const p1 = projects[0] // Brand New Day
  const p2 = projects[1] // Breaking Bad
  const p3 = projects[2] // Kingdom of Heaven

  const sephLetters = ['S', 'E', 'P', 'H']

  return (
    <section
      ref={heroRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative min-h-[92vh] flex flex-col justify-between pt-24 sm:pt-28 pb-8 sm:pb-12 px-5 sm:px-8 md:px-10 lg:px-14 xl:px-16 w-full max-w-[1720px] 2xl:max-w-[1880px] mx-auto select-none overflow-hidden"
    >
      {/* ── Secondary Information Strip ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#F2F0E9]/12 text-xs text-[#F2F0E9]">
        <div className="flex items-center gap-2.5 font-mono text-[11px] uppercase tracking-wider text-[#F2F0E9]/80">
          <span>{profile.location}</span>
        </div>

        <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-wider text-[#F2F0E9]/65">
          <span>DaVinci Resolve</span>
          <span className="text-[#FFAA00] font-bold">•</span>
          <span>Video Editor</span>
        </div>
      </div>

      {/* ── Editorial Split Composition (Wide Layout) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 xl:gap-20 2xl:gap-28 items-center py-6 sm:py-10 flex-1">
        {/* ── LEFT COLUMN: Dominant SEPH Wordmark & Expanded Editorial Flow ── */}
        <div className="lg:col-span-6 flex flex-col justify-center space-y-6 sm:space-y-8 z-20">
          {/* Subtle Role Kicker */}
          <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-[#F2F0E9]/70 font-semibold">
            <span>Video Editor</span>
            <span className="text-[#F2F0E9]/30">•</span>
            <span className="text-[#FFAA00] font-bold">Film &amp; Cinematic Reels</span>
          </div>

          {/* ── Interactive Parallax SEPH Wordmark ── */}
          <div
            className="relative overflow-visible py-1"
            role="heading"
            aria-level={1}
            aria-label="SEPH"
          >
            <motion.div
              style={{
                y: sephScrollY,
                x: sephScrollX,
              }}
              className="flex items-baseline will-change-transform"
            >
              {sephLetters.map((letter, idx) => (
                <span
                  key={idx}
                  className="overflow-hidden inline-block leading-[0.72] select-none"
                  aria-hidden="true"
                >
                  <motion.span
                    style={
                      !shouldReduceMotion
                        ? {
                            x: letterParallax[idx].x,
                            y: letterParallax[idx].y,
                            rotate: letterParallax[idx].rotate,
                          }
                        : {}
                    }
                    className="inline-block font-wosker text-[24vw] sm:text-[22vw] md:text-[19vw] lg:text-[12rem] xl:text-[14.5rem] 2xl:text-[17rem] text-[#FFAA00] uppercase tracking-tighter will-change-transform"
                  >
                    {letter}
                  </motion.span>
                </span>
              ))}
            </motion.div>
          </div>

          {/* Clean Introduction & Description (Warm White) */}
          <motion.div
            style={{ x: introX }}
            className="max-w-2xl xl:max-w-3xl"
          >
            <p className="text-base sm:text-lg md:text-xl lg:text-[1.25rem] text-[#F2F0E9]/85 font-normal leading-relaxed">
              Video editor based in Kerala, India — available worldwide. Crafting film edits, scene studies, and short-form cinematic reels with a focus on rhythm, atmosphere, and musical synchronicity in DaVinci Resolve.
            </p>
          </motion.div>

          {/* Studio CTAs */}
          <div className="flex flex-wrap items-center gap-4 pt-1">
            <a
              href={profile.instagramUrl}
              target="_blank"
              rel="noreferrer"
              className="group inline-flex items-center gap-2.5 px-5 sm:px-6 py-3 rounded-[2px] bg-[#FF001E] text-[#F2F0E9] font-bold text-sm tracking-wide uppercase font-mono hover:bg-[#d9001a] shadow-sm hover:shadow-md transition-all duration-200"
            >
              <Instagram className="w-4 h-4 text-[#F2F0E9]" />
              <span>Follow on Instagram</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-[#F2F0E9] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200 ease-out motion-reduce:transform-none" />
            </a>

            <a
              href="#work"
              className="group inline-flex items-center gap-2.5 px-5 sm:px-6 py-3 rounded-[2px] bg-[#13193D] hover:bg-[#13193D]/80 border border-[#F2F0E9]/20 hover:border-[#FF001E] text-[#F2F0E9] transition-all duration-200 font-bold text-sm tracking-wide uppercase font-mono"
            >
              <Play className="w-3.5 h-3.5 fill-current text-[#FFAA00]" />
              <span>Selected Work</span>
            </a>
          </div>

          {/* Technical Specs: Software & Availability */}
          <div className="pt-6 grid grid-cols-2 gap-8 border-t border-[#F2F0E9]/12 max-w-2xl font-mono">
            <div>
              <span className="block text-[10px] uppercase tracking-wider text-[#F2F0E9]/50 font-medium">Software</span>
              <span className="font-bold text-xs sm:text-sm text-[#F2F0E9]">DaVinci Resolve</span>
            </div>
            <div>
              <span className="block text-[10px] uppercase tracking-wider text-[#F2F0E9]/50 font-medium">Availability</span>
              <span className="font-bold text-xs sm:text-sm text-[#F2F0E9] flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#FFAA00] inline-block" />
                <span>Worldwide</span>
              </span>
            </div>
          </div>
        </div>

        {/* ── RIGHT COLUMN: Expanded Multi-Plane Project Composition ── */}
        <div className="lg:col-span-6 relative w-full flex flex-col justify-center">
          <div className="relative w-full h-[290px] min-[400px]:h-[320px] min-[480px]:h-[370px] sm:h-[460px] md:h-[500px] lg:h-[520px] xl:h-[560px]">
            {/* ── PANEL 1 (Brand New Day — Top-Right Anchor) ── */}
            {p1 && (
              <motion.div
                style={{ y: visualY1 }}
                onMouseEnter={() => setActiveHover('p1')}
                onMouseLeave={() => setActiveHover(null)}
                onClick={() => onSelectProject && onSelectProject(p1)}
                data-cursor="VIEW"
                className={`absolute right-0 top-0 w-[66%] sm:w-[64%] aspect-[16/10] cursor-pointer group transition-all duration-300 ${
                  activeHover === 'p1' ? 'z-40 scale-[1.025]' : 'z-20'
                }`}
              >
                <div className="relative w-full h-full bg-[#0A0E26] rounded-[2px] overflow-hidden border border-[#F2F0E9]/15 group-hover:border-[#FFAA00]/80 shadow-2xl transition-all duration-500">
                  <img
                    src={p1.thumbnail}
                    alt={p1.title}
                    className="w-full h-full object-cover grayscale-[10%] group-hover:grayscale-0 group-hover:scale-[1.035] transition-all duration-500 ease-out"
                    loading="eager"
                  />

                  {/* Cinematic Vignette */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent pointer-events-none" />

                  {/* Clean Editorial Identification */}
                  <div className="absolute bottom-3 left-3.5 right-3.5 flex items-end justify-between pointer-events-none text-[#F2F0E9]">
                    <div>
                      <span className="block font-mono text-[9px] uppercase tracking-wider text-[#FFAA00] font-semibold">
                        {p1.category}
                      </span>
                      <span className="font-display font-black text-lg sm:text-xl uppercase tracking-tight text-[#F2F0E9] leading-tight group-hover:translate-x-1 transition-transform duration-200 ease-out inline-block motion-reduce:transform-none">
                        {p1.title}
                      </span>
                    </div>

                    <span className="font-mono text-[10px] text-[#F2F0E9]/90 bg-[#0A0E26]/90 px-1.5 py-0.5 rounded-[1px] border border-[#F2F0E9]/15 shrink-0">
                      00:26
                    </span>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ── PANEL 2 (Breaking Bad — Mid-Left Stagger) ── */}
            {p2 && (
              <motion.div
                style={{
                  y: visualY2,
                  rotate: activeHover === 'p2' ? 0 : rotate2,
                }}
                onMouseEnter={() => setActiveHover('p2')}
                onMouseLeave={() => setActiveHover(null)}
                onClick={() => onSelectProject && onSelectProject(p2)}
                data-cursor="VIEW"
                className={`absolute left-0 top-[14%] sm:top-[16%] w-[52%] sm:w-[49%] aspect-[4/3] cursor-pointer group transition-all duration-300 ${
                  activeHover === 'p2' ? 'z-40 scale-[1.03]' : 'z-30'
                }`}
              >
                <div className="relative w-full h-full bg-[#0A0E26] rounded-[2px] overflow-hidden border border-[#F2F0E9]/15 group-hover:border-[#FFAA00]/80 shadow-2xl transition-all duration-500">
                  <img
                    src={p2.thumbnail}
                    alt={p2.title}
                    className="w-full h-full object-cover grayscale-[12%] group-hover:grayscale-0 group-hover:scale-[1.035] transition-all duration-500 ease-out"
                    loading="eager"
                  />

                  {/* Cinematic Vignette */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent pointer-events-none" />

                  {/* Clean Editorial Identification */}
                  <div className="absolute bottom-3 left-3.5 pointer-events-none text-[#F2F0E9]">
                    <span className="block font-mono text-[9px] uppercase tracking-wider text-[#FFAA00] font-semibold">
                      {p2.category}
                    </span>
                    <span className="font-display font-black text-base sm:text-lg uppercase tracking-tight text-[#F2F0E9] leading-tight group-hover:translate-x-1 transition-transform duration-200 ease-out inline-block motion-reduce:transform-none">
                      {p2.title}
                    </span>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ── PANEL 3 (Kingdom of Heaven — Grounding Bottom Panel) ── */}
            {p3 && (
              <motion.div
                style={{
                  y: visualY3,
                  rotate: activeHover === 'p3' ? 0 : rotate3,
                }}
                onMouseEnter={() => setActiveHover('p3')}
                onMouseLeave={() => setActiveHover(null)}
                onClick={() => onSelectProject && onSelectProject(p3)}
                data-cursor="VIEW"
                className={`absolute right-2 sm:right-4 bottom-0 lg:bottom-10 w-[62%] sm:w-[58%] aspect-[16/9] cursor-pointer group transition-all duration-300 ${
                  activeHover === 'p3' ? 'z-40 scale-[1.03]' : 'z-10'
                }`}
              >
                <div className="relative w-full h-full bg-[#0A0E26] rounded-[2px] overflow-hidden border border-[#F2F0E9]/15 group-hover:border-[#FFAA00]/80 shadow-2xl transition-all duration-500">
                  <img
                    src={p3.thumbnail}
                    alt={p3.title}
                    className="w-full h-full object-cover grayscale-[12%] group-hover:grayscale-0 group-hover:scale-[1.035] transition-all duration-500 ease-out"
                    loading="lazy"
                  />

                  {/* Cinematic Vignette */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent pointer-events-none" />

                  {/* Clean Editorial Identification */}
                  <div className="absolute bottom-3 left-3.5 pointer-events-none text-[#F2F0E9]">
                    <span className="block font-mono text-[9px] uppercase tracking-wider text-[#FFAA00] font-semibold">
                      {p3.category}
                    </span>
                    <span className="font-display font-black text-base sm:text-lg uppercase tracking-tight text-[#F2F0E9] leading-tight group-hover:translate-x-1 transition-transform duration-200 ease-out inline-block motion-reduce:transform-none">
                      {p3.title}
                    </span>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* ── Centered Scroll Indicator ── */}
      <div className="pt-6 border-t border-[#F2F0E9]/12 flex items-center justify-center">
        <a
          href="#work"
          aria-label="Scroll to explore"
          className="group inline-flex items-center gap-2 text-[#F2F0E9]/70 hover:text-[#FFAA00] transition-colors py-1 focus:outline-none"
        >
          <span className="font-mono text-[11px] sm:text-xs uppercase tracking-widest font-semibold">
            Scroll to Explore
          </span>
          <motion.span
            animate={
              shouldReduceMotion
                ? {}
                : {
                    y: [0, 3.5, 0],
                  }
            }
            transition={{
              repeat: Infinity,
              duration: 1.8,
              ease: "easeInOut",
            }}
            className="inline-flex text-[#FFAA00]"
          >
            <ArrowDown className="w-3.5 h-3.5 stroke-[2]" />
          </motion.span>
        </a>
      </div>
    </section>
  )
}
