import { profile } from '../data/portfolioData'

export default function About() {
  return (
    <section id="about" className="py-24 sm:py-32 px-5 sm:px-8 md:px-10 lg:px-14 xl:px-16 w-full max-w-[1720px] 2xl:max-w-[1880px] mx-auto border-t border-[#F2F0E9]/12">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 xl:gap-20">
        {/* Left Column */}
        <div className="lg:col-span-4 space-y-3">
          <span className="text-xs font-mono uppercase tracking-widest text-[#F2F0E9]/60 block font-medium">
            03 / About Me
          </span>
          <h2 className="font-display text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-[#F2F0E9] leading-tight uppercase">
            Video editor.
          </h2>
        </div>

        {/* Right Column: Wide Editorial Introduction */}
        <div className="lg:col-span-8 space-y-6 text-[#F2F0E9] leading-relaxed font-normal">
          <p className="text-lg sm:text-xl lg:text-2xl text-[#F2F0E9]/90 font-normal leading-relaxed max-w-4xl">
            I am Joseph Benny, a video editor based in Kerala, India, available for projects worldwide. I am deeply passionate about film editing, cinema, and the art of visual storytelling.
          </p>

          <p className="text-base sm:text-lg text-[#F2F0E9]/80 leading-relaxed max-w-4xl">
            I primarily create and publish film edits and short-form cinematic reels on Instagram. For me, editing is about finding the rhythm between cuts, syncing musical beats with evocative character moments, and creating a distinct mood in every sequence.
          </p>

          <p className="text-base sm:text-lg text-[#F2F0E9]/80 leading-relaxed max-w-4xl">
            <span className="text-[#FFAA00] font-semibold">DaVinci Resolve</span> is my primary editing software, where I work on cutting, audio synchronization, and color grading. I am continuously refining my craft and am open to freelance collaborations.
          </p>

          {/* Quick Details Strip */}
          <div className="pt-8 border-t border-[#F2F0E9]/12 grid grid-cols-1 sm:grid-cols-3 gap-8 text-xs max-w-4xl">
            <div className="space-y-1">
              <span className="text-[#F2F0E9]/50 font-mono uppercase text-[10px] tracking-wider block">
                Location
              </span>
              <span className="text-[#F2F0E9] font-semibold block text-sm">
                {profile.location}
              </span>
            </div>

            <div className="space-y-1">
              <span className="text-[#F2F0E9]/50 font-mono uppercase text-[10px] tracking-wider block">
                Availability
              </span>
              <span className="text-[#F2F0E9] font-semibold block text-sm">
                {profile.availability}
              </span>
            </div>

            <div className="space-y-1">
              <span className="text-[#F2F0E9]/50 font-mono uppercase text-[10px] tracking-wider block">
                Primary Software
              </span>
              <span className="text-[#F2F0E9] font-semibold block text-sm">
                {profile.primarySoftware}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
