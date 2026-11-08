import { useState } from 'react'
import VideoPlayer from '../components/VideoPlayer'
import { showreel } from '../data/portfolioData'
import { formatDuration } from '../utils/formatTime'

export default function Showreel() {
  const [duration, setDuration] = useState(null)
  const formattedDuration = formatDuration(duration)

  return (
    <section id="showreel" className="py-24 sm:py-32 px-5 sm:px-8 md:px-10 lg:px-14 xl:px-16 w-full max-w-[1720px] 2xl:max-w-[1880px] mx-auto border-t border-[#F2F0E9]/12">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-[#F2F0E9]/60 block mb-2 font-medium">
            01 / Presentation
          </span>
          <h2 className="font-display text-4xl sm:text-6xl font-black tracking-tight text-[#F2F0E9] uppercase">
            Featured Edits Reel
          </h2>
        </div>

        <p className="text-[#F2F0E9]/80 text-sm sm:text-base max-w-lg leading-relaxed">
          A compilation of film edits, cinematic reels, and visual scene studies edited in DaVinci Resolve.
        </p>
      </div>

      {/* Large Video Presentation */}
      <div className="w-full rounded-sm overflow-hidden border border-[#F2F0E9]/15 shadow-2xl bg-[#0A0E26]">
        <VideoPlayer
          src={showreel.videoUrl}
          poster={showreel.posterUrl}
          title={`${showreel.title} — ${showreel.year}`}
          aspectRatio="16:9"
          onDurationChange={setDuration}
        />
      </div>

      {/* Minimal footer notes */}
      <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between text-xs text-[#F2F0E9]/70 gap-2 font-mono">
        <span>Software: DaVinci Resolve</span>
        {formattedDuration ? (
          <span>Duration: {formattedDuration}</span>
        ) : null}
      </div>
    </section>
  )
}
