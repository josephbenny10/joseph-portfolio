import { useState, useEffect, useRef, useCallback } from 'react'
import { X, Play, Pause, Volume2, VolumeX, Maximize, Minimize, ArrowLeft, ArrowRight, Film } from 'lucide-react'
import { projects } from '../data/portfolioData'
import { formatDuration } from '../utils/formatTime'

export default function ProjectModal({ project, onClose, onSelectProject }) {
  const [currentProject, setCurrentProject] = useState(project)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [volume, setVolume] = useState(1)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [isFullscreen, setIsFullscreen] = useState(false)

  const videoRef = useRef(null)
  const playerContainerRef = useRef(null)
  const scrubRef = useRef(null)

  // Sync internal project state if parent updates `project`
  useEffect(() => {
    if (project) {
      setCurrentProject(project)
    }
  }, [project])

  // Sequential project index and navigation
  const currentIndex = projects.findIndex((p) => p.id === currentProject?.id)
  const safeIndex = currentIndex !== -1 ? currentIndex : 0
  const prevProject = projects[(safeIndex - 1 + projects.length) % projects.length]
  const nextProject = projects[(safeIndex + 1) % projects.length]

  // Safe encoded URI for local files with spaces
  const cleanVideoUrl = currentProject?.videoUrl
    ? encodeURI(decodeURI(currentProject.videoUrl))
    : ''
  const cleanThumbnail = currentProject?.thumbnail
    ? encodeURI(decodeURI(currentProject.thumbnail))
    : ''

  const handleSelectProject = useCallback(
    (targetProject) => {
      setCurrentProject(targetProject)
      setCurrentTime(0)
      setDuration(0)
      setIsPlaying(false)
      if (onSelectProject) {
        onSelectProject(targetProject)
      }
    },
    [onSelectProject]
  )

  const handlePrev = useCallback(() => {
    handleSelectProject(prevProject)
  }, [handleSelectProject, prevProject])

  const handleNext = useCallback(() => {
    handleSelectProject(nextProject)
  }, [handleSelectProject, nextProject])

  // Play / Pause toggle
  const togglePlay = useCallback(() => {
    const video = videoRef.current
    if (!video) return

    if (video.paused || video.ended) {
      const playPromise = video.play()
      if (playPromise !== undefined) {
        playPromise
          .then(() => setIsPlaying(true))
          .catch((err) => {
            console.warn('Playback prevented:', err)
            setIsPlaying(false)
          })
      }
    } else {
      video.pause()
      setIsPlaying(false)
    }
  }, [])

  // Volume & Mute controls
  const toggleMute = useCallback((e) => {
    if (e) e.stopPropagation()
    const video = videoRef.current
    if (!video) return

    if (isMuted) {
      video.muted = false
      setIsMuted(false)
      video.volume = volume || 0.8
    } else {
      video.muted = true
      setIsMuted(true)
    }
  }, [isMuted, volume])

  const handleVolumeChange = (e) => {
    e.stopPropagation()
    const newVol = parseFloat(e.target.value)
    setVolume(newVol)
    const video = videoRef.current
    if (video) {
      video.volume = newVol
      if (newVol === 0) {
        video.muted = true
        setIsMuted(true)
      } else if (isMuted) {
        video.muted = false
        setIsMuted(false)
      }
    }
  }

  // Fullscreen control
  const toggleFullscreen = useCallback((e) => {
    if (e) e.stopPropagation()
    const container = playerContainerRef.current
    if (!container) return

    if (!document.fullscreenElement) {
      container.requestFullscreen().catch(() => {})
    } else {
      document.exitFullscreen().catch(() => {})
    }
  }, [])

  // Scrubber / Seek
  const handleSeek = (e) => {
    e.stopPropagation()
    const video = videoRef.current
    const scrub = scrubRef.current
    if (!video || !duration || !scrub) return

    const rect = scrub.getBoundingClientRect()
    const pos = Math.max(0, Math.min(e.clientX - rect.left, rect.width))
    const targetTime = (pos / rect.width) * duration
    video.currentTime = targetTime
    setCurrentTime(targetTime)
  }

  // Keyboard Shortcuts: Escape, Space, ArrowLeft, ArrowRight
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (['INPUT', 'TEXTAREA'].includes(e.target?.tagName)) return

      if (e.key === 'Escape') {
        e.preventDefault()
        onClose()
      } else if (e.code === 'Space') {
        e.preventDefault()
        togglePlay()
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault()
        handlePrev()
      } else if (e.key === 'ArrowRight') {
        e.preventDefault()
        handleNext()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose, togglePlay, handlePrev, handleNext])

  // Prevent background scrolling while open
  useEffect(() => {
    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = originalOverflow || ''
    }
  }, [])

  // Fullscreen state listener
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement))
    }
    document.addEventListener('fullscreenchange', handleFullscreenChange)
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange)
  }, [])

  // Video element event listeners and source loading
  useEffect(() => {
    const video = videoRef.current
    if (!video || !cleanVideoUrl) return

    const handleTimeUpdate = () => setCurrentTime(video.currentTime)
    const handleMetadata = () => {
      if (video.duration && !isNaN(video.duration) && isFinite(video.duration)) {
        setDuration(video.duration)
      }
    }
    const handleEnded = () => {
      setIsPlaying(false)
      setCurrentTime(0)
    }
    const handlePlay = () => setIsPlaying(true)
    const handlePause = () => setIsPlaying(false)

    video.addEventListener('timeupdate', handleTimeUpdate)
    video.addEventListener('loadedmetadata', handleMetadata)
    video.addEventListener('durationchange', handleMetadata)
    video.addEventListener('ended', handleEnded)
    video.addEventListener('play', handlePlay)
    video.addEventListener('pause', handlePause)

    // Attempt video playback
    video.load()
    const playPromise = video.play()
    if (playPromise !== undefined) {
      playPromise
        .then(() => setIsPlaying(true))
        .catch(() => {
          setIsPlaying(false)
        })
    }

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate)
      video.removeEventListener('loadedmetadata', handleMetadata)
      video.removeEventListener('durationchange', handleMetadata)
      video.removeEventListener('ended', handleEnded)
      video.removeEventListener('play', handlePlay)
      video.removeEventListener('pause', handlePause)
      try {
        video.pause()
      } catch {
        // ignore
      }
    }
  }, [cleanVideoUrl])

  if (!currentProject) return null

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0
  const formattedCurrentTime = formatDuration(currentTime) || '00:00'
  const formattedTotalDuration = formatDuration(duration) || '00:00'

  return (
    <div
      onClick={(e) => {
        // Close when clicking directly on the outer backdrop
        if (e.target === e.currentTarget) {
          onClose()
        }
      }}
      className="fixed inset-0 z-50 bg-[#0F1432] text-[#F2F0E9] flex flex-col justify-between p-5 sm:p-8 md:p-10 select-none overflow-y-auto"
    >
      {/* ── 2. HEADER ── */}
      <header className="w-full flex items-center justify-between shrink-0">
        {/* Project Title (Top-Left) */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          <span className="font-display font-semibold text-sm sm:text-base tracking-wide uppercase text-[#F2F0E9]">
            {currentProject.title}
          </span>
          <span className="text-[#F2F0E9]/30 text-xs font-mono">•</span>
          <span className="text-xs font-mono uppercase tracking-wider text-[#F2F0E9]/50">
            {currentProject.category}
          </span>
        </div>

        {/* Close Button (Top-Right) */}
        <button
          onClick={onClose}
          className="group flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-[#F2F0E9]/70 hover:text-[#FF001E] transition-colors p-1 cursor-pointer"
          aria-label="Close project preview"
        >
          <span>Close</span>
          <X className="w-3.5 h-3.5" />
        </button>
      </header>

      {/* ── 3. VIDEO & 4. CONTROLS (Center) ── */}
      <main className="flex-1 my-auto py-4 flex flex-col items-center justify-center w-full">
        {/* Large Video Player in the Centre */}
        <div
          ref={playerContainerRef}
          style={{ width: 'min(88vw, calc(72vh * 16 / 9))', aspectRatio: '16 / 9' }}
          className="relative bg-black rounded-[2px] overflow-hidden flex items-center justify-center shrink-0 shadow-2xl"
        >
          {cleanVideoUrl ? (
            <video
              ref={videoRef}
              src={cleanVideoUrl}
              poster={cleanThumbnail}
              playsInline
              preload="auto"
              onClick={togglePlay}
              className="w-full h-full object-cover cursor-pointer bg-black"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center text-[#F2F0E9]/60">
              <Film className="w-8 h-8 stroke-[1.5] text-[#FFAA00] mb-2" />
              <p className="font-mono text-xs text-[#F2F0E9]/70">No video source assigned</p>
            </div>
          )}
        </div>

        {/* Controls: Thin timeline & horizontal controls directly underneath */}
        <div
          style={{ width: 'min(88vw, calc(72vh * 16 / 9))' }}
          className="w-full mt-3 sm:mt-4 space-y-2.5"
        >
          {/* Thin Timeline */}
          <div
            ref={scrubRef}
            onClick={handleSeek}
            className="group/timeline relative w-full h-3 flex items-center cursor-pointer"
            title="Seek timeline"
          >
            <div className="w-full h-[2px] bg-[#F2F0E9]/20 rounded-full overflow-hidden transition-all group-hover/timeline:h-[3px]">
              <div
                style={{ width: `${progressPercent}%` }}
                className="h-full bg-[#FFAA00] transition-all"
              />
            </div>
          </div>

          {/* Controls in One Clean Horizontal Row */}
          <div className="flex items-center justify-between text-xs font-mono text-[#F2F0E9]">
            {/* Play/Pause & Time */}
            <div className="flex items-center gap-3 sm:gap-4">
              <button
                type="button"
                onClick={togglePlay}
                className="text-[#F2F0E9] hover:text-[#FF001E] transition-colors p-1 cursor-pointer"
                aria-label={isPlaying ? 'Pause' : 'Play'}
              >
                {isPlaying ? (
                  <Pause className="w-3.5 h-3.5 fill-current" />
                ) : (
                  <Play className="w-3.5 h-3.5 fill-current" />
                )}
              </button>

              <span className="text-[#F2F0E9]/75 text-[11px] sm:text-xs tracking-wider">
                {formattedCurrentTime} / {formattedTotalDuration}
              </span>
            </div>

            {/* Volume & Fullscreen */}
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={toggleMute}
                  className="text-[#F2F0E9] hover:text-[#FF001E] transition-colors p-1 cursor-pointer"
                  aria-label={isMuted ? 'Unmute' : 'Mute'}
                >
                  {isMuted || volume === 0 ? (
                    <VolumeX className="w-3.5 h-3.5 text-[#FF001E]" />
                  ) : (
                    <Volume2 className="w-3.5 h-3.5" />
                  )}
                </button>

                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={isMuted ? 0 : volume}
                  onChange={handleVolumeChange}
                  className="w-14 sm:w-16 h-1 bg-[#F2F0E9]/20 accent-[#FFAA00] rounded-lg appearance-none cursor-pointer"
                  aria-label="Volume slider"
                />
              </div>

              <button
                type="button"
                onClick={toggleFullscreen}
                className="text-[#F2F0E9] hover:text-[#FF001E] transition-colors p-1 cursor-pointer"
                aria-label="Toggle Fullscreen"
              >
                {isFullscreen ? <Minimize className="w-3.5 h-3.5" /> : <Maximize className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* ── 5. NAVIGATION (Bottom) ── */}
      <footer className="w-full flex items-center justify-between shrink-0 pt-4">
        {/* Previous Project (Bottom-Left) */}
        <button
          onClick={handlePrev}
          className="group flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#F2F0E9]/70 hover:text-[#FF001E] transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" />
          <span>Previous project</span>
        </button>

        {/* Next Project (Bottom-Right) */}
        <button
          onClick={handleNext}
          className="group flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#F2F0E9]/70 hover:text-[#FF001E] transition-colors cursor-pointer"
        >
          <span>Next project</span>
          <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
        </button>
      </footer>
    </div>
  )
}
