import { useRef, useCallback, useEffect } from 'react'
import {
  motion,
  useScroll,
  useTransform,
  useMotionValue,
  useSpring,
  useReducedMotion,
} from 'framer-motion'
import { FilmSprockets } from '../components/CinematicElements'

export default function About() {
  const sectionRef = useRef(null)
  const isFinePointer = useRef(true)
  const shouldReduceMotion = useReducedMotion()

  useEffect(() => {
    isFinePointer.current = window.matchMedia('(hover: hover) and (pointer: fine)').matches
  }, [])

  // ── Scroll-based layered depth ──
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  })

  // Subtle opposing scroll drift between heading and narrative column
  const headingY = useTransform(scrollYProgress, [0, 1], shouldReduceMotion ? [0, 0] : [-25, 25])
  const textColY = useTransform(scrollYProgress, [0, 1], shouldReduceMotion ? [0, 0] : [15, -15])

  // ── Cursor-based interactive motion ──
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const springConfig = { damping: 24, stiffness: 220, mass: 0.4 }
  const smoothX = useSpring(mouseX, springConfig)
  const smoothY = useSpring(mouseY, springConfig)

  // Subtle interactive shifts for text block tilt
  const textTiltX = useTransform(smoothY, [-0.5, 0.5], shouldReduceMotion ? 0 : [1.8, -1.8])
  const textTiltY = useTransform(smoothX, [-0.5, 0.5], shouldReduceMotion ? 0 : [-1.8, 1.8])

  const handleMouseMove = useCallback(
    (e) => {
      if (shouldReduceMotion || !isFinePointer.current || !sectionRef.current) return
      const rect = sectionRef.current.getBoundingClientRect()
      if (!rect.width || !rect.height) return
      const normX = (e.clientX - rect.left) / rect.width - 0.5
      const normY = (e.clientY - rect.top) / rect.height - 0.5
      mouseX.set(Math.max(-0.5, Math.min(0.5, normX)))
      mouseY.set(Math.max(-0.5, Math.min(0.5, normY)))
    },
    [shouldReduceMotion, mouseX, mouseY]
  )

  const handleMouseLeave = useCallback(() => {
    mouseX.set(0)
    mouseY.set(0)
  }, [mouseX, mouseY])

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.12,
      },
    },
  }

  const itemVariants = {
    hidden: shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 22 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.65,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  }

  return (
    <section
      id="about"
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative py-24 sm:py-36 px-5 sm:px-8 md:px-10 lg:px-14 xl:px-16 w-full max-w-[1720px] 2xl:max-w-[1880px] mx-auto border-t border-[#F2F0E9]/12 overflow-hidden select-none"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 xl:gap-20 items-start">
        {/* Left Column: Layered Section Title & 35mm Film Detail */}
        <motion.div
          style={{ y: headingY }}
          className="lg:col-span-4 space-y-4 lg:sticky lg:top-28 will-change-transform relative"
        >
          {/* Subtle 35mm Film Perforation Kicker */}
          <div className="w-24 overflow-hidden opacity-30 pb-1">
            <FilmSprockets orientation="horizontal" count={5} />
          </div>

          <span className="text-xs font-mono uppercase tracking-widest text-[#F2F0E9]/60 block font-medium">
            02 / About Me
          </span>

          <h2 className="font-display text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-[#F2F0E9] leading-tight uppercase drop-shadow-[0_8px_20px_rgba(0,0,0,0.6)]">
            Video editor.
          </h2>
        </motion.div>

        {/* Right Column: Wide Editorial Narrative with Layered Depth */}
        <motion.div
          style={{
            y: textColY,
            perspective: 1000,
            rotateX: textTiltX,
            rotateY: textTiltY,
            transformStyle: 'preserve-3d',
          }}
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.15 }}
          className="lg:col-span-8 space-y-6 text-[#F2F0E9] leading-relaxed font-normal will-change-transform"
        >
          <motion.p
            variants={itemVariants}
            className="text-lg sm:text-xl lg:text-2xl text-[#F2F0E9]/90 font-normal leading-relaxed max-w-4xl"
          >
            I am Joseph Benny, a video editor based in Kerala, India. I am deeply passionate about film editing, cinema, and the art of visual storytelling.
          </motion.p>

          <motion.p
            variants={itemVariants}
            className="text-base sm:text-lg text-[#F2F0E9]/80 leading-relaxed max-w-4xl"
          >
            I primarily create and publish film edits and short-form cinematic reels on Instagram. For me, editing is about finding the rhythm between cuts, syncing musical beats with evocative character moments, and creating a distinct mood in every sequence.
          </motion.p>

          <motion.p
            variants={itemVariants}
            className="text-base sm:text-lg text-[#F2F0E9]/80 leading-relaxed max-w-4xl"
          >
            <span className="text-[#FFAA00] font-semibold">DaVinci Resolve</span> is my primary editing software, where I work on cutting, audio synchronization, and color grading. I explore how pacing, musical rhythm, and intentional cut choices reframe an edit's emotional weight.
          </motion.p>
        </motion.div>
      </div>
    </section>
  )
}
