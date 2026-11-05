import { useState } from 'react'
import VideoPlayer from '../components/VideoPlayer'
import { showreel } from '../data/portfolioData'
import { formatDuration } from '../utils/formatTime'

export default function Showreel() {
  const [duration, setDuration] = useState(null)
  const formattedDuration = formatDuration(duration)

  return (
    <section id="showreel" className="py-24 sm:py-32 px-6 sm:px-8 max-w-7xl mx-auto border-t border-white/[0.06]">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-zinc-500 block mb-2">
            01 / Presentation
          </span>
          <h2 className="font-display text-3xl sm:text-5xl font-bold tracking-tight text-white">
            Featured Edits Reel
          </h2>
        </div>

        <p className="text-zinc-400 text-sm max-w-md">
          A compilation of film edits, cinematic reels, and visual scene studies edited in DaVinci Resolve.
        </p>
      </div>

      {/* Large Video Presentation */}
      <div className="w-full rounded-sm overflow-hidden border border-white/[0.08] shadow-2xl bg-[#0d0d0f]">
        <VideoPlayer
          src={showreel.videoUrl}
          poster={showreel.posterUrl}
          title={`${showreel.title} — ${showreel.year}`}
          aspectRatio="16:9"
          onDurationChange={setDuration}
        />
      </div>

      {/* Minimal footer notes */}
      <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between text-xs text-zinc-500 gap-2">
        <span>Software: DaVinci Resolve</span>
        {formattedDuration ? (
          <span>Duration: {formattedDuration}</span>
        ) : null}
      </div>
    </section>
  )
}
