import { useState, useRef } from 'react'
import { Film } from 'lucide-react'
import { projects } from '../data/portfolioData'
import { formatDuration } from '../utils/formatTime'

function ProjectItem({ project, onSelect }) {
  const [isHovered, setIsHovered] = useState(false)
  const [duration, setDuration] = useState(null)
  const videoRef = useRef(null)

  const cleanThumbnail = project.thumbnail ? encodeURI(decodeURI(project.thumbnail)) : ''
  const cleanVideoUrl = project.videoUrl ? encodeURI(decodeURI(project.videoUrl)) : ''
  const hasMedia = Boolean(cleanThumbnail || cleanVideoUrl)
  const formattedDuration = formatDuration(duration)

  const handleMetadata = (e) => {
    if (e.target && e.target.duration && isFinite(e.target.duration) && e.target.duration > 0) {
      setDuration(e.target.duration)
    }
  }

  const handleMouseEnter = () => {
    setIsHovered(true)
    if (cleanVideoUrl && videoRef.current) {
      videoRef.current.play().catch(() => {})
    }
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
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
      className="group cursor-pointer space-y-4"
    >
      {/* Large Cinematic Thumbnail Container */}
      <div className="relative aspect-[16/9] w-full bg-[#101013] rounded-[2px] overflow-hidden border border-white/[0.06] group-hover:border-white/20 transition-all duration-500">
        {hasMedia ? (
          <>
            {/* Thumbnail Image */}
            {cleanThumbnail && (
              <img
                src={cleanThumbnail}
                alt={project.title}
                className={`w-full h-full object-cover transition-all duration-700 ease-out ${
                  isHovered && cleanVideoUrl ? "opacity-0 scale-[1.02]" : "opacity-100 scale-100"
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
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
                  isHovered || !cleanThumbnail ? "opacity-100 scale-[1.02]" : "opacity-0 scale-100"
                }`}
              />
            )}
          </>
        ) : (
          /* Clearly Marked Empty Placeholder */
          <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-[#0d0d10] border border-dashed border-white/[0.08] group-hover:border-white/20 transition-colors">
            <Film className="w-7 h-7 text-zinc-600 group-hover:text-zinc-400 transition-colors mb-3 stroke-[1.5]" />
            <span className="font-display text-sm text-zinc-400 group-hover:text-zinc-200 transition-colors">
              {project.title}
            </span>
            <span className="text-[11px] text-zinc-600 mt-1 font-mono tracking-wider">
              Add video in public/assets/videos/
            </span>
          </div>
        )}
      </div>

      {/* Clean Project Title and Minimal Metadata */}
      <div className="pt-1">
        <h3 className="font-display font-medium text-lg sm:text-xl text-white group-hover:text-zinc-300 transition-colors tracking-tight">
          {project.title}
        </h3>
        <p className="text-xs text-zinc-500 mt-0.5 tracking-wide">
          {project.category}
          {formattedDuration ? ` · ${formattedDuration}` : ''}
        </p>
      </div>
    </article>
  )
}

export default function SelectedWork({ onSelectProject }) {
  return (
    <section id="work" className="py-28 sm:py-36 px-6 sm:px-8 max-w-7xl mx-auto border-t border-white/[0.06]">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-16 sm:mb-20">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-zinc-500 block mb-2">
            Portfolio
          </span>
          <h2 className="font-display text-3xl sm:text-5xl font-bold tracking-tight text-white">
            Selected Work
          </h2>
        </div>

        <p className="text-zinc-400 text-sm max-w-md">
          A visual collection of film edits, cinematic reels, and video cuts. Select any piece to view the full video.
        </p>
      </div>

      {/* Generously Spaced 2-Column Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 sm:gap-16 lg:gap-20">
        {projects.map((project) => (
          <ProjectItem
            key={project.id}
            project={project}
            onSelect={onSelectProject}
          />
        ))}
      </div>
    </section>
  )
}
