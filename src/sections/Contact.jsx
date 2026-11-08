import { useState } from 'react'
import { Instagram, Mail, Copy, Check, ArrowUpRight } from 'lucide-react'
import { profile } from '../data/portfolioData'

export default function Contact() {
  const [copied, setCopied] = useState(false)

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(profile.email)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <section id="contact" className="py-24 sm:py-36 px-5 sm:px-8 md:px-10 lg:px-14 xl:px-16 w-full max-w-[1720px] 2xl:max-w-[1880px] mx-auto border-t border-[#F2F0E9]/12">
      <div className="space-y-12 sm:space-y-16">
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#F2F0E9]/60 font-medium">
            <span>05 / Contact</span>
            <span>•</span>
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#FFAA00]" />
            <span className="text-[#F2F0E9] font-semibold">{profile.availability}</span>
          </div>

          <h2 className="font-display text-4xl sm:text-6xl lg:text-7xl xl:text-8xl font-black tracking-tight text-[#F2F0E9] max-w-4xl lg:max-w-5xl leading-[1.05]">
            Have an editing project in mind? Let's connect.
          </h2>

          <p className="text-[#F2F0E9]/80 text-base sm:text-lg lg:text-xl max-w-3xl leading-relaxed">
            I am currently {profile.availability.toLowerCase()}, film edits, and Instagram reel projects. Feel free to reach out via Instagram DM or send an email.
          </p>
        </div>

        {/* Primary Contact Channels: Instagram + Email */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-3xl pt-2">
          {/* Instagram Card */}
          <a
            href={profile.instagramUrl}
            target="_blank"
            rel="noreferrer"
            className="group p-6 rounded-sm bg-[#13193D] hover:bg-[#13193D]/80 border border-[#F2F0E9]/15 hover:border-[#FF001E] transition-all flex flex-col justify-between space-y-6 shadow-md"
          >
            <div className="flex items-center justify-between">
              <span className="p-2.5 rounded-[2px] bg-[#FF001E]/15 text-[#FF001E] group-hover:scale-110 transition-transform">
                <Instagram className="w-5 h-5" />
              </span>
              <ArrowUpRight className="w-4 h-4 text-[#F2F0E9]/50 group-hover:text-[#FFAA00] transition-colors" />
            </div>

            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-[#F2F0E9]/60 block mb-1">
                Instagram Direct Message
              </span>
              <span className="text-[#F2F0E9] group-hover:text-[#FFAA00] transition-colors font-semibold text-lg sm:text-xl font-display">
                {profile.instagramHandle}
              </span>
              <p className="text-xs text-[#F2F0E9]/70 mt-1 leading-relaxed">
                Best way to reach me directly for quick replies and project inquiries.
              </p>
            </div>
          </a>

          {/* Email Card */}
          <div className="p-6 rounded-sm bg-[#13193D] border border-[#F2F0E9]/15 hover:border-[#FF001E] transition-all flex flex-col justify-between space-y-6 shadow-md">
            <div className="flex items-center justify-between">
              <span className="p-2.5 rounded-[2px] bg-[#FF001E]/15 text-[#FF001E]">
                <Mail className="w-5 h-5" />
              </span>
              <button
                onClick={handleCopyEmail}
                className="text-xs text-[#F2F0E9]/60 hover:text-[#FFAA00] flex items-center gap-1 font-mono transition-colors"
                title="Copy email address"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-[#FFAA00]" />
                    <span className="text-[#FFAA00] font-semibold">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>

            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-[#F2F0E9]/60 block mb-1">
                Direct Email
              </span>
              <a
                href={`mailto:${profile.email}`}
                className="text-[#F2F0E9] hover:text-[#FFAA00] transition-colors font-semibold text-base sm:text-lg break-all font-mono"
              >
                {profile.email}
              </a>
              <p className="text-xs text-[#F2F0E9]/70 mt-1 leading-relaxed">
                For detailed briefs, collaboration proposals, or timeline discussions.
              </p>
            </div>
          </div>
        </div>

        {/* Wide Bottom Metadata & Footer Line */}
        <div className="pt-12 sm:pt-16 border-t border-[#F2F0E9]/12 flex flex-col sm:flex-row items-center justify-between text-xs text-[#F2F0E9]/70 gap-4 font-mono">
          <div className="flex items-center gap-2">
            <span className="text-[#FFAA00] font-bold">SEPH</span>
            <span>•</span>
            <span>{profile.name}</span>
            <span>•</span>
            <span>{profile.location}</span>
          </div>

          <div className="flex items-center gap-4">
            <a
              href={profile.instagramUrl}
              target="_blank"
              rel="noreferrer"
              className="hover:text-[#FFAA00] transition-colors"
            >
              Instagram
            </a>
            <span>•</span>
            <a
              href={`mailto:${profile.email}`}
              className="hover:text-[#FFAA00] transition-colors"
            >
              Email
            </a>
            <span>•</span>
            <span>DaVinci Resolve Studio</span>
          </div>
        </div>
      </div>
    </section>
  )
}
