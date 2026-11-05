import { profile } from '../data/portfolioData'

export default function About() {
  return (
    <section id="about" className="py-24 sm:py-32 px-6 sm:px-8 max-w-7xl mx-auto border-t border-white/[0.06]">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
        {/* Left Column */}
        <div className="lg:col-span-5 space-y-4">
          <span className="text-xs font-mono uppercase tracking-widest text-zinc-500 block">
            03 / About Me
          </span>
          <h2 className="font-display text-3xl sm:text-5xl font-bold tracking-tight text-white leading-tight">
            Video editor.
          </h2>
        </div>

        {/* Right Column: Short, Natural Introduction */}
        <div className="lg:col-span-7 space-y-6 text-zinc-300 text-base sm:text-lg leading-relaxed font-normal">
          <p>
            I am Joseph Benny, a video editor based in Kerala, India, available for projects worldwide. I am deeply passionate about film editing, cinema, and the art of visual storytelling.
          </p>

          <p className="text-zinc-400 text-sm sm:text-base leading-relaxed">
            I primarily create and publish film edits and short-form cinematic reels on Instagram. For me, editing is about finding the rhythm between cuts, syncing musical beats with evocative character moments, and creating a distinct mood in every sequence.
          </p>

          <p className="text-zinc-400 text-sm sm:text-base leading-relaxed">
            <span className="text-zinc-200 font-medium">DaVinci Resolve</span> is my primary editing software, where I work on cutting, audio synchronization, and color grading. I am continuously refining my craft and am open to freelance collaborations.
          </p>

          {/* Quick Details */}
          <div className="pt-6 border-t border-white/[0.08] grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs">
            <div className="space-y-1">
              <span className="text-zinc-500 font-mono uppercase text-[10px] tracking-wider block">
                Location
              </span>
              <span className="text-zinc-200 font-medium block">
                {profile.location}
              </span>
            </div>

            <div className="space-y-1">
              <span className="text-zinc-500 font-mono uppercase text-[10px] tracking-wider block">
                Availability
              </span>
              <span className="text-zinc-200 font-medium block">
                {profile.availability}
              </span>
            </div>

            <div className="space-y-1">
              <span className="text-zinc-500 font-mono uppercase text-[10px] tracking-wider block">
                Primary Software
              </span>
              <span className="text-zinc-200 font-medium block">
                {profile.primarySoftware}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
