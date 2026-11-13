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
import Magnetic from '../components/Magnetic'
import { ViewfinderMarks } from '../components/CinematicElements'

export default function Hero({ onSelectProject }) {
  const [activeHover, setActiveHover] = useState(null)
  const heroRef = useRef(null)
  const isFinePointer = useRef(true)
  const shouldReduceMotion = useReducedMotion()
  const revealFinished = true

  useEffect(() => {
    isFinePointer.current = window.matchMedia('(hover: hover) and (pointer: fine)').matches
  }, [])

  // ── PART 3: Scroll Behaviour ──
  // Gradually shifts the SEPH lettering slightly upward as visitor scrolls away
  const { scrollY } = useScroll()
  const sephScrollY = useTransform(scrollY, [0, 600], [0, shouldReduceMotion ? 0 : -45])
  const sephScrollX = useTransform(scrollY, [0, 600], [0, shouldReduceMotion ? 0 : -15])
  const introX = useTransform(scrollY, [0, 600], [0, shouldReduceMotion ? 0 : 15])

  // Cohesive layered scroll parallax for the project collage
  const visualY1 = useTransform(scrollY, [0, 700], [0, shouldReduceMotion ? 0 : 20])
  const visualY2 = useTransform(scrollY, [0, 700], [0, shouldReduceMotion ? 0 : -18])
  const visualY3 = useTransform(scrollY, [0, 700], [0, shouldReduceMotion ? 0 : 25])
  const rotate2 = useTransform(scrollY, [0, 700], [-1.2, shouldReduceMotion ? 0 : 0.6])
  const rotate3 = useTransform(scrollY, [0, 700], [1.0, shouldReduceMotion ? 0 : -0.8])

  // ── PART 2: Interactive Motion (Cursor Parallax & 3D Depth) ──
  // MotionValues normalized to [-1, 1] relative to hero center
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  // Fluid spring physics for silky-smooth, non-jitter cursor response
  const springConfig = { damping: 24, stiffness: 200, mass: 0.5 }
  const smoothMouseX = useSpring(mouseX, springConfig)
  const smoothMouseY = useSpring(mouseY, springConfig)

  // 3D Perspective Wordmark Tilt
  const wordmarkRotateX = useTransform(smoothMouseY, [-1, 1], shouldReduceMotion ? 0 : [3.5, -3.5])
  const wordmarkRotateY = useTransform(smoothMouseX, [-1, 1], shouldReduceMotion ? 0 : [-4, 4])

  // Column Depth Separation (Typography vs Project Collage)
  const typoColX = useTransform(smoothMouseX, [-1, 1], shouldReduceMotion ? 0 : [-6, 6])
  const typoColY = useTransform(smoothMouseY, [-1, 1], shouldReduceMotion ? 0 : [-5, 5])
  const cardsColX = useTransform(smoothMouseX, [-1, 1], shouldReduceMotion ? 0 : [8, -8])
  const cardsColY = useTransform(smoothMouseY, [-1, 1], shouldReduceMotion ? 0 : [7, -7])

  // Subtle per-letter 3D parallax displacement with staggered Z-depth
  // Letter 0: 'S' (Z: 16px)
  const sX = useTransform(smoothMouseX, [-1, 1], shouldReduceMotion ? 0 : [-8, 8])
  const sY = useTransform(smoothMouseY, [-1, 1], shouldReduceMotion ? 0 : [-9, 9])
  const sRot = useTransform(smoothMouseX, [-1, 1], shouldReduceMotion ? 0 : [-1.5, 1.5])

  // Letter 1: 'E' (Z: 28px)
  const eX = useTransform(smoothMouseX, [-1, 1], shouldReduceMotion ? 0 : [-11, 11])
  const eY = useTransform(smoothMouseY, [-1, 1], shouldReduceMotion ? 0 : [-7, 7])
  const eRot = useTransform(smoothMouseX, [-1, 1], shouldReduceMotion ? 0 : [1.2, -1.2])

  // Letter 2: 'P' (Z: 20px)
  const pX = useTransform(smoothMouseX, [-1, 1], shouldReduceMotion ? 0 : [-7, 7])
  const pY = useTransform(smoothMouseY, [-1, 1], shouldReduceMotion ? 0 : [-10, 10])
  const pRot = useTransform(smoothMouseX, [-1, 1], shouldReduceMotion ? 0 : [-1.0, 1.0])

  // Letter 3: 'H' (Z: 34px)
  const hX = useTransform(smoothMouseX, [-1, 1], shouldReduceMotion ? 0 : [-12, 12])
  const hY = useTransform(smoothMouseY, [-1, 1], shouldReduceMotion ? 0 : [-8, 8])
  const hRot = useTransform(smoothMouseX, [-1, 1], shouldReduceMotion ? 0 : [1.6, -1.6])

  const letterParallax = [
    { x: sX, y: sY, rotate: sRot, z: 16 },
    { x: eX, y: eY, rotate: eRot, z: 28 },
    { x: pX, y: pY, rotate: pRot, z: 20 },
    { x: hX, y: hY, rotate: hRot, z: 34 },
  ]

  // Multi-plane mouse parallax on floating project cards (independent speeds & 3D tilt)
  // Panel 1 (Top-Right): Faster, leading layer
  const p1MouseX = useTransform(smoothMouseX, [-1, 1], shouldReduceMotion ? 0 : [-14, 14])
  const p1MouseY = useTransform(smoothMouseY, [-1, 1], shouldReduceMotion ? 0 : [-12, 12])
  const p1RotateX = useTransform(smoothMouseY, [-1, 1], shouldReduceMotion ? 0 : [4, -4])
  const p1RotateY = useTransform(smoothMouseX, [-1, 1], shouldReduceMotion ? 0 : [-4, 4])

  // Panel 2 (Mid-Left): Inverse depth layer
  const p2MouseX = useTransform(smoothMouseX, [-1, 1], shouldReduceMotion ? 0 : [18, -18])
  const p2MouseY = useTransform(smoothMouseY, [-1, 1], shouldReduceMotion ? 0 : [15, -15])
  const p2RotateX = useTransform(smoothMouseY, [-1, 1], shouldReduceMotion ? 0 : [-5, 5])
  const p2RotateY = useTransform(smoothMouseX, [-1, 1], shouldReduceMotion ? 0 : [5, -5])

  // Panel 3 (Bottom): Deep grounding layer
  const p3MouseX = useTransform(smoothMouseX, [-1, 1], shouldReduceMotion ? 0 : [-9, 9])
  const p3MouseY = useTransform(smoothMouseY, [-1, 1], shouldReduceMotion ? 0 : [-8, 8])
  const p3RotateX = useTransform(smoothMouseY, [-1, 1], shouldReduceMotion ? 0 : [3, -3])
  const p3RotateY = useTransform(smoothMouseX, [-1, 1], shouldReduceMotion ? 0 : [-3, 3])

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
      className="relative min-h-[88vh] flex flex-col justify-between pt-24 sm:pt-28 pb-8 sm:pb-12 px-5 sm:px-8 md:px-10 lg:px-14 xl:px-16 w-full max-w-[1720px] 2xl:max-w-[1880px] mx-auto select-none overflow-hidden"
    >
      {/* ── Editorial Split Composition (Wide Layout) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 xl:gap-20 2xl:gap-28 items-center py-6 sm:py-10 flex-1">
        {/* ── LEFT COLUMN: Dominant SEPH Wordmark & Expanded Editorial Flow ── */}
        <motion.div
          style={{ x: typoColX, y: typoColY }}
          className="lg:col-span-6 flex flex-col justify-center space-y-6 sm:space-y-8 z-20 will-change-transform"
        >
          {/* Subtle Role Kicker */}
          <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-[#F2F0E9]/70 font-semibold">
            <span>Video Editor</span>
            <span className="text-[#F2F0E9]/30">•</span>
            <span className="text-[#FFAA00] font-bold">Film &amp; Cinematic Reels</span>
          </div>

          {/* ── Interactive 3D Perspective SEPH Wordmark ── */}
          <div
            style={{ perspective: 1000 }}
            className="relative overflow-visible py-1"
            role="heading"
            aria-level={1}
            aria-label="SEPH"
          >
            {/* Cinematic Title Sequence Anamorphic Light Sweep (Z-Depth Layer) */}
            <motion.div
              aria-hidden="true"
              animate={
                shouldReduceMotion
                  ? {}
                  : {
                      x: ['-15%', '15%', '-15%'],
                      opacity: [0.18, 0.32, 0.18],
                    }
              }
              transition={{
                repeat: Infinity,
                duration: 10,
                ease: 'easeInOut',
              }}
              className="absolute -top-16 -left-10 -right-10 h-64 -z-10 pointer-events-none select-none blur-3xl bg-[radial-gradient(ellipse_at_center,rgba(255,170,0,0.22)_0%,rgba(255,0,30,0.08)_45%,transparent_70%)]"
            />

            <motion.div
              style={{
                y: sephScrollY,
                x: sephScrollX,
                rotateX: wordmarkRotateX,
                rotateY: wordmarkRotateY,
                transformStyle: 'preserve-3d',
              }}
              className="flex items-baseline will-change-transform"
            >
              {sephLetters.map((letter, idx) => (
                <span
                  key={idx}
                  style={{
                    transformStyle: 'preserve-3d',
                    transform: `translateZ(${shouldReduceMotion ? 0 : letterParallax[idx].z}px)`,
                  }}
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
                          filter: 'drop-shadow(0 4px 0 rgba(19, 25, 61, 0.95)) drop-shadow(0 14px 28px rgba(0, 0, 0, 0.85)) drop-shadow(0 0 42px rgba(255, 170, 0, 0.2))',
                        }
                        : {
                          filter: 'drop-shadow(0 4px 0 rgba(19, 25, 61, 0.95)) drop-shadow(0 12px 24px rgba(0, 0, 0, 0.8))',
                        }
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
              Crafting cinematic film edits, scene studies, and short-form reels with a focus on rhythm, atmosphere, and emotional pacing.
            </p>
          </motion.div>

          {/* Studio CTAs with Magnetic Precision */}
          <div className="flex flex-wrap items-center gap-4 pt-1">
            <Magnetic strength={0.28} maxDistance={10}>
              <a
                href={profile.instagramUrl}
                target="_blank"
                rel="noreferrer"
                className="group inline-flex items-center gap-2.5 px-5 sm:px-6 py-3 rounded-[2px] bg-[#FF001E] text-[#F2F0E9] font-bold text-sm tracking-wide uppercase font-mono hover:bg-[#d9001a] shadow-sm hover:shadow-lg transition-all duration-200"
              >
                <Instagram className="w-4 h-4 text-[#F2F0E9]" />
                <span>Follow on Instagram</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-[#F2F0E9] group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-200 ease-out motion-reduce:transform-none" />
              </a>
            </Magnetic>

            <Magnetic strength={0.28} maxDistance={10}>
              <a
                href="#work"
                className="group inline-flex items-center gap-2.5 px-5 sm:px-6 py-3 rounded-[2px] bg-[#13193D] hover:bg-[#13193D]/80 border border-[#F2F0E9]/20 hover:border-[#FF001E] text-[#F2F0E9] transition-all duration-200 font-bold text-sm tracking-wide uppercase font-mono shadow-sm hover:shadow-lg"
              >
                <Play className="w-3.5 h-3.5 fill-current text-[#FFAA00] group-hover:scale-110 transition-transform duration-200" />
                <span>Selected Work</span>
              </a>
            </Magnetic>
          </div>
        </motion.div>

        {/* ── RIGHT COLUMN: Multi-Plane 35mm Film Frame Composition ── */}
        <motion.div
          style={{ x: cardsColX, y: cardsColY, perspective: 1000 }}
          className="lg:col-span-6 relative w-full flex flex-col justify-center will-change-transform"
        >
          <div className="relative w-full h-[290px] min-[400px]:h-[320px] min-[480px]:h-[370px] sm:h-[460px] md:h-[500px] lg:h-[520px] xl:h-[560px]">
            {/* ── PANEL 1 (Brand New Day — 35mm Frame 01) ── */}
            {p1 && (
              <motion.div
                style={{
                  y: visualY1,
                  x: p1MouseX,
                  translateY: p1MouseY,
                  rotateX: p1RotateX,
                  rotateY: p1RotateY,
                  transformStyle: 'preserve-3d',
                }}
                onMouseEnter={() => setActiveHover('p1')}
                onMouseLeave={() => setActiveHover(null)}
                onClick={() => onSelectProject && onSelectProject(p1)}
                data-cursor="VIEW"
                className={`absolute right-0 top-0 w-[66%] sm:w-[64%] aspect-[16/10] cursor-pointer group transition-all duration-300 will-change-transform ${
                  activeHover === 'p1' ? 'z-40 scale-[1.03]' : 'z-20'
                }`}
              >
                {/* 35mm Film Gate Border & Corner Viewfinder Lines */}
                <div className="relative w-full h-full bg-[#070A1C] p-1 sm:p-1.5 rounded-[2px] border border-[#F2F0E9]/20 group-hover:border-[#FFAA00]/80 shadow-[0_24px_50px_rgba(0,0,0,0.85)] transition-[border-color,box-shadow] duration-500 overflow-hidden">
                  <ViewfinderMarks size={10} color="#FFAA00" strokeWidth={1.2} />

                  <div className="relative w-full h-full overflow-hidden rounded-[1px]">
                    <img
                      src={p1.thumbnail}
                      alt={p1.title}
                      className="w-full h-full object-cover grayscale-[10%] group-hover:grayscale-0 group-hover:scale-[1.04] transition-all duration-500 ease-out select-none"
                      loading="eager"
                    />

                    {/* Cinematic Vignette */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent pointer-events-none" />

                    {/* Film Stock Edge Indicator */}
                    <div className="absolute top-2 left-2.5 pointer-events-none font-mono text-[8px] uppercase tracking-widest text-[#FFAA00]/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      35MM · FRAME 01
                    </div>

                    {/* Editorial Identification */}
                    <div className="absolute bottom-3 left-3.5 right-3.5 flex items-end justify-between pointer-events-none text-[#F2F0E9]">
                      <div>
                        <span className="block font-mono text-[9px] uppercase tracking-wider text-[#FFAA00] font-semibold">
                          {p1.category}
                        </span>
                        <span className="font-display font-black text-lg sm:text-xl uppercase tracking-tight text-[#F2F0E9] leading-tight group-hover:translate-x-1.5 transition-transform duration-200 ease-out inline-block motion-reduce:transform-none">
                          {p1.title}
                        </span>
                      </div>

                      <span className="font-mono text-[10px] text-[#F2F0E9]/90 bg-[#0A0E26]/90 px-1.5 py-0.5 rounded-[1px] border border-[#F2F0E9]/15 shrink-0">
                        00:26
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ── PANEL 2 (Breaking Bad — 35mm Frame 02) ── */}
            {p2 && (
              <motion.div
                style={{
                  y: visualY2,
                  x: p2MouseX,
                  translateY: p2MouseY,
                  rotateX: p2RotateX,
                  rotateY: p2RotateY,
                  rotate: activeHover === 'p2' ? 0 : rotate2,
                  transformStyle: 'preserve-3d',
                }}
                onMouseEnter={() => setActiveHover('p2')}
                onMouseLeave={() => setActiveHover(null)}
                onClick={() => onSelectProject && onSelectProject(p2)}
                data-cursor="VIEW"
                className={`absolute left-0 top-[14%] sm:top-[16%] w-[52%] sm:w-[49%] aspect-[4/3] cursor-pointer group transition-all duration-300 will-change-transform ${
                  activeHover === 'p2' ? 'z-40 scale-[1.035]' : 'z-30'
                }`}
              >
                {/* 35mm Film Gate Border & Corner Viewfinder Lines */}
                <div className="relative w-full h-full bg-[#070A1C] p-1 sm:p-1.5 rounded-[2px] border border-[#F2F0E9]/20 group-hover:border-[#FFAA00]/80 shadow-[0_24px_50px_rgba(0,0,0,0.85)] transition-[border-color,box-shadow] duration-500 overflow-hidden">
                  <ViewfinderMarks size={10} color="#FFAA00" strokeWidth={1.2} />

                  <div className="relative w-full h-full overflow-hidden rounded-[1px]">
                    <img
                      src={p2.thumbnail}
                      alt={p2.title}
                      className="w-full h-full object-cover grayscale-[12%] group-hover:grayscale-0 group-hover:scale-[1.04] transition-all duration-500 ease-out select-none"
                      loading="eager"
                    />

                    {/* Cinematic Vignette */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent pointer-events-none" />

                    {/* Film Stock Edge Indicator */}
                    <div className="absolute top-2 left-2.5 pointer-events-none font-mono text-[8px] uppercase tracking-widest text-[#FFAA00]/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      35MM · FRAME 02
                    </div>

                    {/* Editorial Identification */}
                    <div className="absolute bottom-3 left-3.5 pointer-events-none text-[#F2F0E9]">
                      <span className="block font-mono text-[9px] uppercase tracking-wider text-[#FFAA00] font-semibold">
                        {p2.category}
                      </span>
                      <span className="font-display font-black text-base sm:text-lg uppercase tracking-tight text-[#F2F0E9] leading-tight group-hover:translate-x-1.5 transition-transform duration-200 ease-out inline-block motion-reduce:transform-none">
                        {p2.title}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ── PANEL 3 (Kingdom of Heaven — 35mm Frame 03) ── */}
            {p3 && (
              <motion.div
                style={{
                  y: visualY3,
                  x: p3MouseX,
                  translateY: p3MouseY,
                  rotateX: p3RotateX,
                  rotateY: p3RotateY,
                  rotate: activeHover === 'p3' ? 0 : rotate3,
                  transformStyle: 'preserve-3d',
                }}
                onMouseEnter={() => setActiveHover('p3')}
                onMouseLeave={() => setActiveHover(null)}
                onClick={() => onSelectProject && onSelectProject(p3)}
                data-cursor="VIEW"
                className={`absolute right-2 sm:right-4 bottom-0 lg:bottom-10 w-[62%] sm:w-[58%] aspect-[16/9] cursor-pointer group transition-all duration-300 will-change-transform ${
                  activeHover === 'p3' ? 'z-40 scale-[1.03]' : 'z-10'
                }`}
              >
                {/* 35mm Film Gate Border & Corner Viewfinder Lines */}
                <div className="relative w-full h-full bg-[#070A1C] p-1 sm:p-1.5 rounded-[2px] border border-[#F2F0E9]/20 group-hover:border-[#FFAA00]/80 shadow-[0_24px_50px_rgba(0,0,0,0.85)] transition-[border-color,box-shadow] duration-500 overflow-hidden">
                  <ViewfinderMarks size={10} color="#FFAA00" strokeWidth={1.2} />

                  <div className="relative w-full h-full overflow-hidden rounded-[1px]">
                    <img
                      src={p3.thumbnail}
                      alt={p3.title}
                      className="w-full h-full object-cover grayscale-[12%] group-hover:grayscale-0 group-hover:scale-[1.04] transition-all duration-500 ease-out select-none"
                      loading="lazy"
                    />

                    {/* Cinematic Vignette */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent pointer-events-none" />

                    {/* Film Stock Edge Indicator */}
                    <div className="absolute top-2 left-2.5 pointer-events-none font-mono text-[8px] uppercase tracking-widest text-[#FFAA00]/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      35MM · FRAME 03
                    </div>

                    {/* Editorial Identification */}
                    <div className="absolute bottom-3 left-3.5 pointer-events-none text-[#F2F0E9]">
                      <span className="block font-mono text-[9px] uppercase tracking-wider text-[#FFAA00] font-semibold">
                        {p3.category}
                      </span>
                      <span className="font-display font-black text-base sm:text-lg uppercase tracking-tight text-[#F2F0E9] leading-tight group-hover:translate-x-1.5 transition-transform duration-200 ease-out inline-block motion-reduce:transform-none">
                        {p3.title}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
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
