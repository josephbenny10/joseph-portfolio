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
    <section id="contact" className="py-24 sm:py-36 px-6 sm:px-8 max-w-7xl mx-auto border-t border-white/[0.06]">
      <div className="space-y-12">
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-zinc-500">
            <span>05 / Contact</span>
            <span>•</span>
            <span className="text-zinc-300 font-medium">{profile.availability}</span>
          </div>

          <h2 className="font-display text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white max-w-3xl leading-[1.05]">
            Have an editing project in mind? Let's connect.
          </h2>

          <p className="text-zinc-400 text-base sm:text-lg max-w-2xl leading-relaxed">
            I am currently {profile.availability.toLowerCase()}, film edits, and Instagram reel projects. Feel free to reach out via Instagram DM or send an email.
          </p>
        </div>

        {/* Primary Contact Channels: Instagram + Email */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl pt-2">
          {/* Instagram Card */}
          <a
            href={profile.instagramUrl}
            target="_blank"
            rel="noreferrer"
            className="group p-5 rounded-sm bg-white/[0.03] hover:bg-white/[0.06] border border-white/10 hover:border-white/20 transition-all flex flex-col justify-between space-y-4"
          >
            <div className="flex items-center justify-between">
              <span className="p-2 rounded-[2px] bg-white/[0.05] text-[#dc2626] group-hover:scale-110 transition-transform">
                <Instagram className="w-5 h-5" />
              </span>
              <ArrowUpRight className="w-4 h-4 text-zinc-500 group-hover:text-white transition-colors" />
            </div>

            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-zinc-400 block mb-1">
                Instagram Direct Message
              </span>
              <span className="text-white font-medium text-base sm:text-lg">
                {profile.instagramHandle}
              </span>
              <p className="text-xs text-zinc-500 mt-1">
                Best way to reach me directly for quick replies and project inquiries.
              </p>
            </div>
          </a>

          {/* Email Card */}
          <div className="p-5 rounded-sm bg-white/[0.03] border border-white/10 flex flex-col justify-between space-y-4">
            <div className="flex items-center justify-between">
              <span className="p-2 rounded-[2px] bg-white/[0.05] text-zinc-300">
                <Mail className="w-5 h-5" />
              </span>
              <button
                onClick={handleCopyEmail}
                className="inline-flex items-center gap-1 text-[11px] font-mono text-zinc-400 hover:text-white px-2 py-1 rounded-[2px] bg-white/[0.04] hover:bg-white/[0.08] transition-colors"
                title="Copy email address"
              >
                {copied ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-400" />
                    <span className="text-emerald-400">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>

            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-zinc-400 block mb-1">
                Email
              </span>
              <a
                href={`mailto:${profile.email}`}
                className="text-white font-medium text-base sm:text-lg hover:underline decoration-white/30"
              >
                {profile.email}
              </a>
              <p className="text-xs text-zinc-500 mt-1">
                For detailed briefs, collaboration proposals, and project timelines.
              </p>
            </div>
          </div>
        </div>

        {/* Minimal Footer */}
        <div className="pt-12 border-t border-white/[0.08] flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs text-zinc-500">
          <div className="flex flex-wrap items-center gap-2">
            <span>{profile.identity}</span>
            <span className="text-zinc-700">•</span>
            <span>{profile.location}</span>
            <span className="text-zinc-700">•</span>
            <a
              href={profile.instagramUrl}
              target="_blank"
              rel="noreferrer"
              className="text-zinc-400 hover:text-white transition-colors"
            >
              {profile.instagramHandle}
            </a>
          </div>

          <div className="font-mono text-[11px]">
            Edited in DaVinci Resolve • © {new Date().getFullYear()}
          </div>
        </div>
      </div>
    </section>
  )
}
