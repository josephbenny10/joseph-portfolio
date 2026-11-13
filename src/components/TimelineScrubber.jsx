import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { Film } from 'lucide-react'

/**
 * TimelineScrubber
 * Compact, editorial timeline interaction inspired by professional editing workstations.
 * - Represents the 3 existing projects as 3 sequential timeline segments.
 * - Interactive playhead that glides smoothly and supports scrubbing (mouse + touch).
 * - Synchronized with scroll position and highlighted project card.
 * - Full keyboard accessibility (ArrowLeft, ArrowRight, Home, End, Enter, Space).
 * - Restrained, clean editorial design (80% portfolio, 15% cinema, 5% tech details).
 */
export default function TimelineScrubber({
  projects = [],
  activeIndex = 0,
  onSelectProjectIndex,
  className = '',
}) {
  const shouldReduceMotion = useReducedMotion()
  const trackRef = useRef(null)
  const isDragging = useRef(false)
  const [dragProgress, setDragProgress] = useState(null) // null when not dragging, 0..1 when dragging

  const totalClips = projects.length || 3
  const activeClip = projects[activeIndex] || projects[0]

  // Calculate target playhead percentage based on activeIndex when not dragging
  // Centers the playhead within the active segment: (index + 0.5) / totalClips * 100
  const computedPercent = ((activeIndex + 0.5) / totalClips) * 100
  const currentPlayheadPercent = dragProgress !== null ? dragProgress * 100 : computedPercent

  const getIndexFromPosition = useCallback(
    (clientX) => {
      if (!trackRef.current) return activeIndex
      const rect = trackRef.current.getBoundingClientRect()
      if (!rect.width) return activeIndex
      const rawX = clientX - rect.left
      const progress = Math.max(0, Math.min(1, rawX / rect.width))
      const targetIndex = Math.min(totalClips - 1, Math.floor(progress * totalClips))
      return { targetIndex, progress }
    },
    [activeIndex, totalClips]
  )

  // Mouse scrubbing handlers
  const handleMouseDown = (e) => {
    isDragging.current = true
    const { targetIndex, progress } = getIndexFromPosition(e.clientX)
    setDragProgress(progress)
    if (targetIndex !== activeIndex && onSelectProjectIndex) {
      onSelectProjectIndex(targetIndex)
    }

    const handleMouseMove = (moveEvent) => {
      if (!isDragging.current) return
      const { targetIndex: newIndex, progress: newProg } = getIndexFromPosition(moveEvent.clientX)
      setDragProgress(newProg)
      if (newIndex !== activeIndex && onSelectProjectIndex) {
        onSelectProjectIndex(newIndex)
      }
    }

    const handleMouseUp = () => {
      isDragging.current = false
      setDragProgress(null)
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleMouseUp)
  }

  // Touch scrubbing handlers
  const handleTouchStart = (e) => {
    if (!e.touches || !e.touches[0]) return
    isDragging.current = true
    const { targetIndex, progress } = getIndexFromPosition(e.touches[0].clientX)
    setDragProgress(progress)
    if (targetIndex !== activeIndex && onSelectProjectIndex) {
      onSelectProjectIndex(targetIndex)
    }
  }

  const handleTouchMove = (e) => {
    if (!isDragging.current || !e.touches || !e.touches[0]) return
    const { targetIndex, progress } = getIndexFromPosition(e.touches[0].clientX)
    setDragProgress(progress)
    if (targetIndex !== activeIndex && onSelectProjectIndex) {
      onSelectProjectIndex(targetIndex)
    }
  }

  const handleTouchEnd = () => {
    isDragging.current = false
    setDragProgress(null)
  }

  // Keyboard navigation
  const handleKeyDown = (e) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault()
      const next = (activeIndex + 1) % totalClips
      onSelectProjectIndex && onSelectProjectIndex(next)
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault()
      const prev = (activeIndex - 1 + totalClips) % totalClips
      onSelectProjectIndex && onSelectProjectIndex(prev)
    } else if (e.key === 'Home') {
      e.preventDefault()
      onSelectProjectIndex && onSelectProjectIndex(0)
    } else if (e.key === 'End') {
      e.preventDefault()
      onSelectProjectIndex && onSelectProjectIndex(totalClips - 1)
    }
  }

  return (
    <div
      role="region"
      aria-label="Video editing sequence timeline"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      className={`group/timeline relative bg-[#070A1C]/90 border border-[#F2F0E9]/15 rounded-[2px] p-2.5 sm:p-3 transition-colors focus:border-[#FFAA00]/80 focus:outline-none select-none ${className}`}
    >
      {/* ── TIMELINE HEADER & TIMECODE BAR ── */}
      <div className="flex items-center justify-between text-[10px] sm:text-[11px] font-mono mb-2 px-1">
        <div className="flex items-center gap-2 text-[#F2F0E9]/60">
          <span className="w-1.5 h-1.5 rounded-full bg-[#FFAA00] animate-pulse" />
          <span className="uppercase tracking-widest font-semibold text-[#F2F0E9]/75">
            Sequence 01
          </span>
          <span className="text-[#F2F0E9]/30">•</span>
          <span className="hidden xs:inline tracking-wider text-[#F2F0E9]/50">
            {totalClips} Cuts
          </span>
        </div>

        {activeClip && (
          <div className="flex items-center gap-2">
            <span className="text-[#FFAA00] font-semibold tracking-wider uppercase truncate max-w-[190px] sm:max-w-xs">
              0{activeIndex + 1} // {activeClip.title}
            </span>
            <span className="text-[#F2F0E9]/40 hidden sm:inline">[{activeClip.category}]</span>
          </div>
        )}
      </div>

      {/* ── TIMELINE TRACK & SEGMENTS ── */}
      <div
        ref={trackRef}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className="relative h-9 sm:h-10 w-full bg-[#0A0E26] rounded-[1px] border border-[#F2F0E9]/10 flex overflow-hidden cursor-ew-resize touch-none"
        title="Scrub timeline or click segment to navigate"
      >
        {projects.map((project, idx) => {
          const isCurrent = idx === activeIndex
          return (
            <button
              key={project.id}
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                onSelectProjectIndex && onSelectProjectIndex(idx)
              }}
              className={`relative flex-1 h-full flex items-center justify-between px-2.5 sm:px-4 text-left transition-colors border-r border-[#F2F0E9]/10 last:border-r-0 focus:outline-none ${
                isCurrent
                  ? 'bg-[#FFAA00]/12 text-[#FFAA00]'
                  : 'bg-transparent text-[#F2F0E9]/50 hover:bg-[#F2F0E9]/5 hover:text-[#F2F0E9]/80'
              }`}
              aria-label={`Jump to clip 0${idx + 1}: ${project.title}`}
            >
              <div className="flex items-center gap-2 truncate pr-1">
                <span className="font-mono text-[9px] sm:text-[10px] font-bold tracking-wider">
                  0{idx + 1}
                </span>
                <span className="font-display font-semibold text-[11px] sm:text-xs tracking-tight uppercase truncate">
                  {project.title}
                </span>
              </div>

              {/* Segment category tag */}
              <span className="hidden md:inline-block font-mono text-[8px] uppercase tracking-wider opacity-60">
                {project.category}
              </span>

              {/* Active segment bottom highlight bar */}
              {isCurrent && (
                <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#FFAA00]" />
              )}
            </button>
          )
        })}

        {/* ── PLAYHEAD NEEDLE & CAP ── */}
        <motion.div
          animate={
            shouldReduceMotion || dragProgress !== null
              ? { left: `${currentPlayheadPercent}%` }
              : {
                  left: `${currentPlayheadPercent}%`,
                  transition: { type: 'spring', stiffness: 350, damping: 30 },
                }
          }
          className="absolute top-0 bottom-0 pointer-events-none z-20 -translate-x-1/2 will-change-transform"
        >
          {/* Playhead Needle Head (Top Indicator) */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2.5 h-2 bg-[#FFAA00] [clip-path:polygon(0%_0%,100%_0%,50%_100%)] shadow-[0_0_8px_rgba(255,170,0,0.9)]" />

          {/* Playhead Vertical Line */}
          <div className="w-[1.5px] h-full bg-[#FFAA00] shadow-[0_0_6px_rgba(255,170,0,0.6)]" />
        </motion.div>
      </div>

      {/* Scrub Hint */}
      <div className="flex items-center justify-between text-[9px] font-mono text-[#F2F0E9]/40 mt-1.5 px-1">
        <span>SCRUB TIMELINE OR USE ARROWS</span>
        <span>24.00 FPS · 1080P PRORES</span>
      </div>
    </div>
  )
}
