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

function ProjectItem({ project, onSelect }) {
  const [isHovered, setIsHovered] = useState(false)
  const [duration, setDuration] = useState(null)
  const videoRef = useRef(null)
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
    if (cleanVideoUrl && videoRef.current) {
      videoRef.current.play().catch(() => {})
    }
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
    mouseX.set(0)
    mouseY.set(0)
    if (cleanVideoUrl && videoRef.current) {
      videoRef.current.pause()
      videoRef.current.currentTime = 0
    }
  }

  const handleClick = () => {
    if (videoRef.current) {
      videoRef.current.pause()
    }
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
      {/* 3D Perspective Card Container with Subtle Tilt */}
      <div style={{ perspective: 1000 }} className="w-full">
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
          className="relative aspect-[16/9] w-full bg-[#0A0E26] rounded-[2px] overflow-hidden border border-[#F2F0E9]/15 group-hover:border-[#FFAA00]/80 shadow-md group-hover:shadow-[0_10px_35px_rgba(0,0,0,0.5)] transition-[border-color,box-shadow] duration-500 will-change-transform"
        >
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
              animate={{
                scale: isHovered ? 1.06 : 1.02,
              }}
              transition={{
                scale: { duration: 0.45, ease: [0.16, 1, 0.3, 1] },
              }}
              className="w-full h-full relative will-change-transform"
            >
              {/* Thumbnail Image */}
              {cleanThumbnail && (
                <img
                  src={cleanThumbnail}
                  alt={project.title}
                  draggable={false}
                  className={`w-full h-full object-cover transition-opacity duration-500 ease-out select-none pointer-events-none ${
                    isHovered && cleanVideoUrl ? "opacity-0" : "opacity-100"
                  }`}
                  loading="lazy"
                />
              )}

              {/* Video Preview on Hover (if videoUrl is present) */}
              {cleanVideoUrl && (
                <video
                  ref={videoRef}
                  src={cleanVideoUrl}
                  muted
                  loop
                  playsInline
                  preload="metadata"
                  onLoadedMetadata={handleMetadata}
                  onDurationChange={handleMetadata}
                  className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ease-out select-none pointer-events-none ${
                    isHovered || !cleanThumbnail ? "opacity-100" : "opacity-0"
                  }`}
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
    <section id="work" className="py-24 sm:py-32 px-5 sm:px-8 md:px-10 lg:px-14 xl:px-16 w-full max-w-[1720px] 2xl:max-w-[1880px] mx-auto border-t border-[#F2F0E9]/12">
      {/* Section Header */}
      <motion.div
        initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.2 }}
        transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
        className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-14 sm:mb-16"
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

      {/* Spacious 3-Column Editorial Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, amount: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-10 xl:gap-12"
      >
        {projects.map((project) => (
          <motion.div key={project.id} variants={cardVariants}>
            <ProjectItem
              project={project}
              onSelect={onSelectProject}
            />
          </motion.div>
        ))}
      </motion.div>
    </section>
  )
}
