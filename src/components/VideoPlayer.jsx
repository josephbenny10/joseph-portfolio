import { useState, useRef, useEffect, useCallback } from 'react'
import { Play, Pause, Volume2, VolumeX, Maximize, Minimize } from 'lucide-react'

export default function VideoPlayer({
  src,
  poster,
  title,
  aspectRatio = "16:9",
  autoPlay = false,
  loop = false,
  className = "",
  onDurationChange,
}) {
  const videoRef = useRef(null)
  const containerRef = useRef(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showControls, setShowControls] = useState(true)
  const controlsTimeoutRef = useRef(null)

  // Clean URI with spaces encoded
  const encodedSrc = src ? encodeURI(decodeURI(src)) : ''
  const encodedPoster = poster ? encodeURI(decodeURI(poster)) : ''

  // Sync duration safely
  const updateDuration = useCallback(() => {
    const video = videoRef.current
    if (video && video.duration && !isNaN(video.duration) && isFinite(video.duration) && video.duration > 0) {
      setDuration(video.duration)
      if (onDurationChange) {
        onDurationChange(video.duration)
      }
    }
  }, [onDurationChange])

  useEffect(() => {
    const video = videoRef.current
    if (!video || !encodedSrc) return

    const handleTimeUpdate = () => setCurrentTime(video.currentTime)
    const handleMetadata = () => updateDuration()
    const handleEnded = () => {
      setIsPlaying(false)
      setCurrentTime(0)
    }
    const handlePlay = () => setIsPlaying(true)
    const handlePause = () => setIsPlaying(false)

    video.addEventListener('timeupdate', handleTimeUpdate)
    video.addEventListener('loadedmetadata', handleMetadata)
    video.addEventListener('durationchange', handleMetadata)
    video.addEventListener('loadeddata', handleMetadata)
    video.addEventListener('canplay', handleMetadata)
    video.addEventListener('play', handlePlay)
    video.addEventListener('pause', handlePause)
    video.addEventListener('ended', handleEnded)

    // Check if metadata is already available
    if (video.readyState >= 1) {
      updateDuration()
    }

    // Force media load for local files
    video.load()

    // Handle initial autoplay attempt
    if (autoPlay) {
      const playPromise = video.play()
      if (playPromise !== undefined) {
        playPromise
          .then(() => setIsPlaying(true))
          .catch(() => {
            // Autoplay blocked by browser policy (e.g. unmuted); show play button
            setIsPlaying(false)
          })
      }
    }

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate)
      video.removeEventListener('loadedmetadata', handleMetadata)
      video.removeEventListener('durationchange', handleMetadata)
      video.removeEventListener('loadeddata', handleMetadata)
      video.removeEventListener('canplay', handleMetadata)
      video.removeEventListener('play', handlePlay)
      video.removeEventListener('pause', handlePause)
      video.removeEventListener('ended', handleEnded)

      // Pause and release video element on unmount
      try {
        video.pause()
      } catch {
        // ignore
      }
    }
  }, [encodedSrc, autoPlay, updateDuration])

  const togglePlay = (e) => {
    if (e) {
      e.stopPropagation()
    }
    const video = videoRef.current
    if (!video) return

    if (video.paused || video.ended) {
      const playPromise = video.play()
      if (playPromise !== undefined) {
        playPromise
          .then(() => setIsPlaying(true))
          .catch((err) => {
            console.warn("Video playback was prevented:", err)
            setIsPlaying(false)
          })
      }
    } else {
      video.pause()
      setIsPlaying(false)
    }
  }

  const toggleMute = (e) => {
    if (e) e.stopPropagation()
    const video = videoRef.current
    if (!video) return
    video.muted = !isMuted
    setIsMuted(!isMuted)
  }

  const toggleFullscreen = (e) => {
    if (e) e.stopPropagation()
    const container = containerRef.current
    if (!container) return
    if (!document.fullscreenElement) {
      container.requestFullscreen().catch(() => {})
      setIsFullscreen(true)
    } else {
      document.exitFullscreen().catch(() => {})
      setIsFullscreen(false)
    }
  }

  const handleSeek = (e) => {
    e.stopPropagation()
    const video = videoRef.current
    if (!video || !duration) return
    const rect = e.currentTarget.getBoundingClientRect()
    const pos = Math.max(0, Math.min(e.clientX - rect.left, rect.width))
    const newTime = (pos / rect.width) * duration
    video.currentTime = newTime
    setCurrentTime(newTime)
  }

  const handleMouseMove = () => {
    setShowControls(true)
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current)
    if (isPlaying) {
      controlsTimeoutRef.current = setTimeout(() => {
        setShowControls(false)
      }, 2500)
    }
  }

  const formatTime = (seconds) => {
    if (isNaN(seconds) || !isFinite(seconds) || seconds <= 0) return "00:00"
    const m = Math.floor(seconds / 60)
    const s = Math.floor(seconds % 60)
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
  }

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => isPlaying && setShowControls(false)}
      className={`relative group bg-[#0a0a0a] overflow-hidden select-none ${className}`}
      style={{ aspectRatio: aspectRatio.replace(':', '/') }}
    >
      {/* Video Element */}
      <video
        ref={videoRef}
        poster={encodedPoster}
        loop={loop}
        playsInline
        preload="auto"
        onClick={togglePlay}
        className="w-full h-full object-cover cursor-pointer"
      >
        {encodedSrc && <source src={encodedSrc} type="video/mp4" />}
      </video>

      {/* Large Center Play Overlay (visible when paused) */}
      {!isPlaying && (
        <div
          onClick={togglePlay}
          className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[2px] cursor-pointer transition-opacity z-10"
        >
          <button
            type="button"
            onClick={togglePlay}
            aria-label="Play Video"
            className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white/10 hover:bg-white/20 border border-white/30 flex items-center justify-center transition-all duration-300 hover:scale-105"
          >
            <Play className="w-6 h-6 sm:w-7 sm:h-7 text-white fill-white ml-1" />
          </button>
        </div>
      )}

      {/* Title watermark on hover */}
      {title && (
        <div
          className={`absolute top-4 left-6 z-20 transition-opacity duration-300 pointer-events-none ${
            showControls ? "opacity-100" : "opacity-0"
          }`}
        >
          <span className="font-sans text-xs tracking-wider text-white/80 font-medium drop-shadow-md">
            {title}
          </span>
        </div>
      )}

      {/* Bottom Minimal Controls Bar */}
      <div
        className={`absolute bottom-0 left-0 right-0 z-20 px-4 sm:px-6 py-4 bg-gradient-to-t from-black/95 via-black/60 to-transparent transition-opacity duration-300 ${
          showControls || !isPlaying ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        {/* Scrubber Bar */}
        <div
          onClick={handleSeek}
          className="relative w-full h-3 group/scrub flex items-center cursor-pointer mb-2"
        >
          {/* Track background */}
          <div className="w-full h-[2px] group-hover/scrub:h-[4px] bg-white/20 rounded-full transition-all">
            {/* Active red fill */}
            <div
              style={{ width: `${progressPercent}%` }}
              className="h-full bg-[#dc2626] rounded-full relative"
            >
              {/* Playhead dot */}
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-white opacity-0 group-hover/scrub:opacity-100 transition-opacity" />
            </div>
          </div>
        </div>

        {/* Controls row */}
        <div className="flex items-center justify-between text-xs text-zinc-300">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={togglePlay}
              className="p-1 hover:text-white transition-colors"
              aria-label={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
            </button>

            <span className="font-mono text-[11px] text-zinc-400">
              {formatTime(currentTime)} <span className="text-zinc-600">/</span> {formatTime(duration)}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={toggleMute}
              className="p-1 hover:text-white transition-colors"
              aria-label={isMuted ? "Unmute" : "Mute"}
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>

            <button
              type="button"
              onClick={toggleFullscreen}
              className="p-1 hover:text-white transition-colors"
              aria-label="Toggle Fullscreen"
            >
              {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
