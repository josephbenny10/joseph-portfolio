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
      <div className="relative aspect-[16/9] w-full bg-[#0A0E26] rounded-[2px] overflow-hidden border border-[#F2F0E9]/15 group-hover:border-[#FF001E] shadow-md group-hover:shadow-2xl transition-all duration-500">
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
          <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-[#13193D]/60 border border-dashed border-[#F2F0E9]/20 group-hover:border-[#FF001E]/60 transition-colors">
            <Film className="w-7 h-7 text-[#F2F0E9]/60 group-hover:text-[#FFAA00] transition-colors mb-3 stroke-[1.5]" />
            <span className="font-display text-sm text-[#F2F0E9] transition-colors font-bold">
              {project.title}
            </span>
            <span className="text-[11px] text-[#F2F0E9]/50 mt-1 font-mono tracking-wider">
              Add video in public/assets/videos/
            </span>
          </div>
        )}
      </div>

      {/* Clean Project Title and Minimal Metadata */}
      <div className="pt-1">
        <h3 className="font-display font-bold text-xl sm:text-2xl text-[#F2F0E9] group-hover:text-[#FFAA00] transition-colors tracking-tight">
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
  return (
    <section id="work" className="py-24 sm:py-32 px-5 sm:px-8 md:px-10 lg:px-14 xl:px-16 w-full max-w-[1720px] 2xl:max-w-[1880px] mx-auto border-t border-[#F2F0E9]/12">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-14 sm:mb-16">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-[#F2F0E9]/60 block mb-2 font-medium">
            02 / Portfolio
          </span>
          <h2 className="font-display text-4xl sm:text-6xl font-black tracking-tight text-[#F2F0E9] uppercase">
            Selected Work
          </h2>
        </div>

        <p className="text-[#F2F0E9]/80 text-sm sm:text-base max-w-lg leading-relaxed">
          A visual collection of film edits, cinematic reels, and video cuts. Select any piece to view the full video.
        </p>
      </div>

      {/* Spacious 3-Column Editorial Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10 xl:gap-12">
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
