import { useState, useRef, useEffect, useCallback } from 'react'
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useReducedMotion,
} from 'framer-motion'
import { Film } from 'lucide-react'
import { projects } from '../data/portfolioData'
import { formatDuration } from '../utils/formatTime'
import { ViewfinderMarks } from '../components/CinematicElements'
import TimelineScrubber from '../components/TimelineScrubber'

function ProjectItem({ project, index, isActive = false, onSelect }) {
  const [isHovered, setIsHovered] = useState(false)
  const [duration, setDuration] = useState(null)
  const cardRef = useRef(null)
  const isFinePointer = useRef(true)

  const shouldReduceMotion = useReducedMotion()

  useEffect(() => {
    const mq = window.matchMedia('(hover: hover) and (pointer: fine)')
    isFinePointer.current = mq.matches
    const handler = (e) => {
      isFinePointer.current = e.matches
    }
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  const cleanThumbnail = project.thumbnail ? encodeURI(decodeURI(project.thumbnail)) : ''
  const cleanVideoUrl = project.videoUrl ? encodeURI(decodeURI(project.videoUrl)) : ''
  const hasMedia = Boolean(cleanThumbnail || cleanVideoUrl)
  const formattedDuration = formatDuration(duration)

  // Mouse tracking normalized coordinates [-0.5, 0.5] from card center
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  // Overdamped spring: fluid continuous tracking with zero bounce and smooth reset
  const springConfig = { damping: 26, stiffness: 220, mass: 0.5 }
  const smoothX = useSpring(mouseX, springConfig)
  const smoothY = useSpring(mouseY, springConfig)

  // Subtle 3D perspective card tilt: tilts in direction of cursor (~5.5deg max)
  const rotateX = useTransform(smoothY, [-0.5, 0.5], shouldReduceMotion ? [0, 0] : [5.5, -5.5])
  const rotateY = useTransform(smoothX, [-0.5, 0.5], shouldReduceMotion ? [0, 0] : [-5.5, 5.5])

  // Opposite parallax on project image (~9px max) creating physical cinematic depth
  const imgX = useTransform(smoothX, [-0.5, 0.5], shouldReduceMotion ? [0, 0] : [9, -9])
  const imgY = useTransform(smoothY, [-0.5, 0.5], shouldReduceMotion ? [0, 0] : [7, -7])

  const handleMetadata = (e) => {
    if (e.target && e.target.duration && isFinite(e.target.duration) && e.target.duration > 0) {
      setDuration(e.target.duration)
    }
  }

  const handleMouseMove = useCallback((e) => {
    if (shouldReduceMotion || !isFinePointer.current || !cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    if (!rect.width || !rect.height) return

    // Calculate normalized offset from center: -0.5 (left/top) to +0.5 (right/bottom)
    const normX = (e.clientX - rect.left) / rect.width - 0.5
    const normY = (e.clientY - rect.top) / rect.height - 0.5

    mouseX.set(Math.max(-0.5, Math.min(0.5, normX)))
    mouseY.set(Math.max(-0.5, Math.min(0.5, normY)))
  }, [shouldReduceMotion, mouseX, mouseY])

  const handleMouseEnter = () => {
    setIsHovered(true)
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
    mouseX.set(0)
    mouseY.set(0)
  }

  const handleClick = () => {
    onSelect(project)
  }

  return (
    <article
      data-cursor="VIEW"
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
      className="group cursor-pointer space-y-4"
    >
      {/* Hidden audio/video element strictly for duration metadata extraction (no hover autoplay) */}
      {cleanVideoUrl && (
        <video
          src={cleanVideoUrl}
          preload="metadata"
          onLoadedMetadata={handleMetadata}
          className="hidden"
          aria-hidden="true"
        />
      )}

      {/* 3D Perspective Card Container with 35mm Celluloid Frame */}
      <div style={{ perspective: 1000 }} className="w-full relative">
        {/* 35mm Celluloid Frame Border & Viewfinder Marks */}
        <div
          className={`absolute -inset-1.5 sm:-inset-2 rounded-[3px] border pointer-events-none transition-all duration-500 ease-out select-none ${
            isHovered || isActive
              ? 'border-[#FFAA00]/70 bg-[#070A1C]/60 shadow-[0_0_35px_rgba(255,170,0,0.15)]'
              : 'border-[#F2F0E9]/12 bg-transparent'
          }`}
        >
          {/* Corner Viewfinder Marks contract slightly on hover (optical focus lock) */}
          <ViewfinderMarks
            size={isHovered ? 8 : 10}
            color={isHovered || isActive ? '#FFAA00' : 'rgba(242,240,233,0.3)'}
            strokeWidth={isHovered ? 1.5 : 1.2}
          />
        </div>

        <motion.div
          ref={cardRef}
          style={
            shouldReduceMotion
              ? {}
              : {
                  rotateX,
                  rotateY,
                  transformStyle: 'preserve-3d',
                }
          }
          className={`relative aspect-[16/9] w-full bg-[#070A1C] rounded-[2px] overflow-hidden border shadow-[0_20px_45px_rgba(0,0,0,0.8)] transition-[border-color,box-shadow] duration-500 will-change-transform z-10 ${
            isHovered || isActive
              ? 'border-[#FFAA00]/80 shadow-[0_26px_56px_rgba(0,0,0,0.85),0_0_28px_rgba(255,170,0,0.16)]'
              : 'border-[#F2F0E9]/15'
          }`}
        >
          {/* Subtle Frame Rate & Recording Status Indicator */}
          <div className="absolute top-2.5 right-2.5 z-20 flex items-center gap-1.5 px-2 py-0.5 rounded-[1px] bg-black/60 backdrop-blur-sm border border-[#F2F0E9]/15 pointer-events-none select-none">
            <span
              className={`w-1.5 h-1.5 rounded-full transition-colors duration-300 ${
                isHovered || isActive ? 'bg-[#FFAA00] shadow-[0_0_6px_#FFAA00]' : 'bg-[#F2F0E9]/30'
              }`}
            />
            <span className="font-mono text-[9px] uppercase tracking-wider text-[#F2F0E9]/75 font-semibold">
              24 FPS
            </span>
          </div>

          {/* Film Stock Edge Frame ID (Left) */}
          <div className="absolute top-2.5 left-2.5 z-20 pointer-events-none font-mono text-[8px] uppercase tracking-widest text-[#FFAA00]/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            FRAME 0{index + 1}
          </div>

          {/* Soft Anamorphic Light Flare on Frame Hover */}
          <div
            className={`absolute inset-0 bg-gradient-to-tr from-transparent via-[#FFAA00]/15 to-[#FF001E]/10 pointer-events-none transition-opacity duration-700 ease-out z-20 ${
              isHovered ? 'opacity-100' : 'opacity-0'
            }`}
          />

          {/* Cinematic Frame Vignette */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent pointer-events-none z-10" />

          {hasMedia ? (
            <motion.div
              style={
                shouldReduceMotion
                  ? {}
                  : {
                      x: imgX,
                      y: imgY,
                    }
              }
              animate={
                shouldReduceMotion
                  ? {}
                  : {
                      scale: isHovered ? 1.06 : 1.02,
                      // Subtle 1-frame mechanical film advance step on hover start
                      y: isHovered ? [0, -2, 0] : 0,
                    }
              }
              transition={{
                scale: { duration: 0.45, ease: [0.16, 1, 0.3, 1] },
                y: { duration: 0.16, ease: 'easeOut' },
              }}
              className="w-full h-full relative will-change-transform"
            >
              {/* High-Fidelity Thumbnail Image (Zero Autoplay On Hover) */}
              {cleanThumbnail && (
                <img
                  src={cleanThumbnail}
                  alt={project.title}
                  draggable={false}
                  className="w-full h-full object-cover grayscale-[10%] group-hover:grayscale-0 transition-all duration-500 ease-out select-none pointer-events-none"
                  loading="lazy"
                />
              )}
            </motion.div>
          ) : (
            /* Clearly Marked Empty Placeholder */
            <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-[#13193D]/60 border border-dashed border-[#F2F0E9]/20 group-hover:border-[#FFAA00]/60 transition-colors">
              <Film className="w-7 h-7 text-[#F2F0E9]/60 group-hover:text-[#FFAA00] transition-colors mb-3 stroke-[1.5]" />
              <span className="font-display text-sm text-[#F2F0E9] transition-colors font-bold">
                {project.title}
              </span>
              <span className="text-[11px] text-[#F2F0E9]/50 mt-1 font-mono tracking-wider">
                Add video in public/assets/videos/
              </span>
            </div>
          )}
        </motion.div>
      </div>

      {/* Clean Project Title and Minimal Metadata */}
      <div className="pt-1">
        <h3 className="font-display font-bold text-xl sm:text-2xl text-[#F2F0E9] group-hover:text-[#FFAA00] group-hover:translate-x-1.5 transition-all duration-200 ease-out tracking-tight motion-reduce:transform-none">
          {project.title}
        </h3>
        <p className="text-xs text-[#F2F0E9]/65 mt-0.5 tracking-wide font-mono">
          {project.category}
          {formattedDuration ? ` · ${formattedDuration}` : ''}
        </p>
      </div>
    </article>
  )
}

export default function SelectedWork({ onSelectProject }) {
  const shouldReduceMotion = useReducedMotion()
  const [activeTimelineIndex, setActiveTimelineIndex] = useState(0)

  // IntersectionObserver to synchronize timeline playhead with scrolling
  useEffect(() => {
    const cardElements = projects
      .map((p) => document.getElementById(`project-card-${p.id}`))
      .filter(Boolean)

    if (cardElements.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.id.replace('project-card-', '')
            const idx = projects.findIndex((p) => p.id === id)
            if (idx !== -1) {
              setActiveTimelineIndex(idx)
            }
          }
        })
      },
      {
        threshold: 0.35,
        rootMargin: '-10% 0px -10% 0px',
      }
    )

    cardElements.forEach((el) => observer.observe(el))

    return () => {
      cardElements.forEach((el) => observer.unobserve(el))
    }
  }, [])

  const handleTimelineSelect = (index) => {
    setActiveTimelineIndex(index)
    const targetProject = projects[index]
    if (targetProject) {
      const el = document.getElementById(`project-card-${targetProject.id}`)
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
    }
  }

  const cardVariants = {
    hidden: shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.55,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  }

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  return (
    <section
      id="work"
      className="relative py-24 sm:py-32 px-5 sm:px-8 md:px-10 lg:px-14 xl:px-16 w-full max-w-[1720px] 2xl:max-w-[1880px] mx-auto border-t border-[#F2F0E9]/12 overflow-hidden"
    >
      {/* Section Header */}
      <motion.div
        initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.2 }}
        transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
        className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-10 sm:mb-12"
      >
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-[#F2F0E9]/60 block mb-2 font-medium">
            01 / Portfolio
          </span>
          <h2 className="font-display text-4xl sm:text-6xl font-black tracking-tight text-[#F2F0E9] uppercase">
            Selected Work
          </h2>
        </div>

        <p className="text-[#F2F0E9]/80 text-sm sm:text-base max-w-lg leading-relaxed">
          A visual collection of film edits, cinematic reels, and video cuts. Select any piece to view the full video.
        </p>
      </motion.div>

      {/* Interactive Editing Sequence Timeline */}
      <motion.div
        initial={shouldReduceMotion ? false : { opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.2 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="mb-12 sm:mb-16"
      >
        <TimelineScrubber
          projects={projects}
          activeIndex={activeTimelineIndex}
          onSelectProjectIndex={handleTimelineSelect}
        />
      </motion.div>

      {/* Spacious 3-Column Editorial Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, amount: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-10 xl:gap-12"
      >
        {projects.map((project, index) => (
          <motion.div
            key={project.id}
            id={`project-card-${project.id}`}
            variants={cardVariants}
            className="scroll-mt-28"
          >
            <ProjectItem
              project={project}
              index={index}
              isActive={activeTimelineIndex === index}
              onSelect={onSelectProject}
            />
          </motion.div>
        ))}
      </motion.div>
    </section>
  )
}
