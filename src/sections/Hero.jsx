import { useState, useRef } from 'react'
import { ArrowDown, Play, Instagram } from 'lucide-react'
import { profile, showreel } from '../data/portfolioData'
import { formatDuration } from '../utils/formatTime'

export default function Hero() {
  const [isHovered, setIsHovered] = useState(false)
  const [duration, setDuration] = useState(null)
  const videoRef = useRef(null)

  const handleMetadata = (e) => {
    if (e.target && e.target.duration && isFinite(e.target.duration) && e.target.duration > 0) {
      setDuration(e.target.duration)
    }
  }

  const handleMouseEnter = () => {
    setIsHovered(true)
    if (videoRef.current) {
      videoRef.current.play().catch(() => {})
    }
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
    if (videoRef.current) {
      videoRef.current.pause()
    }
  }

  return (
    <section className="relative min-h-[90vh] flex flex-col justify-between pt-32 pb-16 px-6 sm:px-8 max-w-7xl mx-auto">
      {/* Intro Editorial Block */}
      <div className="space-y-6 max-w-3xl">
        {/* Location & Availability */}
        <div className="flex flex-wrap items-center gap-2.5 text-xs text-zinc-400 font-sans tracking-wide">
          <span className="text-zinc-300">{profile.location}</span>
          <span className="text-zinc-600">/</span>
          <span className="text-zinc-300 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#dc2626]" />
            <span>{profile.availability}</span>
          </span>
        </div>

        {/* Name / Moniker */}
        <h1 className="font-wosker text-6xl sm:text-8xl md:text-9xl lg:text-[10rem] tracking-normal text-white leading-[0.9] select-none">
          SEPH
        </h1>

        {/* Short, Confident Introduction */}
        <p className="text-lg sm:text-xl text-zinc-300 font-normal leading-relaxed max-w-2xl">
          Video editor crafting film edits and cinematic video cuts with rhythm, pacing, and atmosphere in DaVinci Resolve.
        </p>

        {/* Action Links & Instagram CTA */}
        <div className="flex flex-wrap items-center gap-4 pt-2 text-sm">
          <a
            href={profile.instagramUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-[2px] bg-[#dc2626] text-white font-medium hover:bg-[#b91c1c] transition-colors"
          >
            <Instagram className="w-4 h-4" />
            <span>Follow on Instagram</span>
          </a>

          <a
            href="#showreel"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-[2px] bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-zinc-300 hover:text-white transition-colors"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Watch Reel</span>
          </a>

          <a
            href="#work"
            className="text-zinc-400 hover:text-white transition-colors px-2 py-2 text-xs sm:text-sm"
          >
            View Selected Edits →
          </a>
        </div>
      </div>

      {/* One Strong Visual: Cinematic Widescreen Window */}
      <div className="mt-14 w-full">
        <a
          href="#showreel"
          data-cursor="PLAY"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          className="group block relative w-full aspect-[2.39/1] sm:aspect-[21/9] bg-[#141416] rounded-sm overflow-hidden border border-white/[0.08] hover:border-white/20 transition-all duration-500"
        >
          {/* Background Video preview on hover or fallback poster */}
          <video
            ref={videoRef}
            src={showreel.videoUrl}
            poster={showreel.posterUrl}
            muted
            loop
            playsInline
            preload="metadata"
            onLoadedMetadata={handleMetadata}
            onDurationChange={handleMetadata}
            className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 group-hover:scale-[1.02] transition-all duration-700"
          />

          {/* Minimal vignette overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-black/20 pointer-events-none" />

          {/* Center Play Button indicator */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-black/60 backdrop-blur-md border border-white/20 flex items-center justify-center text-white group-hover:scale-110 group-hover:border-white/40 transition-all duration-300">
              <Play className="w-5 h-5 fill-current ml-0.5" />
            </div>
          </div>

          {/* Subtitle / Caption at bottom corner */}
          <div className="absolute bottom-4 left-6 right-6 flex items-center justify-between text-xs text-zinc-300">
            <span className="font-medium tracking-wide">
              {showreel.title} ({showreel.year}) • Cut in DaVinci Resolve
            </span>
            {formatDuration(duration) ? (
              <span className="font-mono text-[11px] text-zinc-400">
                {formatDuration(duration)}
              </span>
            ) : null}
          </div>
        </a>
      </div>

      {/* Subtle Scroll Down Prompt */}
      <div className="pt-10 flex items-center justify-between text-xs text-zinc-500">
        <span>Film Edits & Cinematic Reels</span>
        <a
          href="#showreel"
          aria-label="Scroll to showreel"
          className="hover:text-zinc-300 transition-colors flex items-center gap-1.5"
        >
          <span>Scroll</span>
          <ArrowDown className="w-3.5 h-3.5" />
        </a>
      </div>
    </section>
  )
}
