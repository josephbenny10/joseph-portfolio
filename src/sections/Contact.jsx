import { useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { Instagram, Mail, Copy, ArrowUpRight, ArrowUp } from 'lucide-react'
import { profile } from '../data/portfolioData'

export default function Contact() {
  const [copied, setCopied] = useState(false)
  const shouldReduceMotion = useReducedMotion()

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(profile.email)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: shouldReduceMotion ? 'auto' : 'smooth',
    })
  }

  const cardsContainerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const cardVariants = {
    hidden: shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.55,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  }

  return (
    <section id="contact" className="py-24 sm:py-36 px-5 sm:px-8 md:px-10 lg:px-14 xl:px-16 w-full max-w-[1720px] 2xl:max-w-[1880px] mx-auto border-t border-[#F2F0E9]/12">
      <div className="space-y-12 sm:space-y-16">
        {/* Section Header */}
        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.2 }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          className="space-y-4"
        >
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#F2F0E9]/60 font-medium">
            <span>04 / Contact</span>
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
        </motion.div>

        {/* Primary Contact Channels: Instagram + Email */}
        <motion.div
          variants={cardsContainerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.15 }}
          className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-3xl pt-2"
        >
          {/* Instagram Card */}
          <motion.a
            variants={cardVariants}
            href={profile.instagramUrl}
            target="_blank"
            rel="noreferrer"
            className="group p-6 rounded-sm bg-[#13193D] hover:bg-[#13193D]/80 border border-[#F2F0E9]/15 hover:border-[#FF001E] transition-all flex flex-col justify-between space-y-6 shadow-md"
          >
            <div className="flex items-center justify-between">
              <span className="p-2.5 rounded-[2px] bg-[#FF001E]/15 text-[#FF001E] group-hover:scale-110 transition-transform">
                <Instagram className="w-5 h-5" />
              </span>
              <ArrowUpRight className="w-4 h-4 text-[#F2F0E9]/50 group-hover:text-[#FFAA00] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-200 ease-out motion-reduce:transform-none" />
            </div>

            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-[#F2F0E9]/60 block mb-1">
                Instagram Direct Message
              </span>
              <span className="text-[#F2F0E9] group-hover:text-[#FFAA00] transition-colors font-semibold text-lg sm:text-xl font-sans tracking-tight">
                {profile.instagramHandle}
              </span>
              <p className="text-xs text-[#F2F0E9]/70 mt-1 leading-relaxed">
                Best way to reach me directly for quick replies and project inquiries.
              </p>
            </div>
          </motion.a>

          {/* Email Card */}
          <motion.div
            variants={cardVariants}
            className="p-6 rounded-sm bg-[#13193D] border border-[#F2F0E9]/15 hover:border-[#FF001E] transition-all flex flex-col justify-between space-y-6 shadow-md"
          >
            <div className="flex items-center justify-between">
              <span className="p-2.5 rounded-[2px] bg-[#FF001E]/15 text-[#FF001E]">
                <Mail className="w-5 h-5" />
              </span>
              <button
                type="button"
                onClick={handleCopyEmail}
                className={`text-xs flex items-center gap-1.5 font-mono transition-all duration-200 px-2 py-1 rounded-[2px] cursor-pointer ${
                  copied
                    ? 'text-[#FFAA00] bg-[#FFAA00]/12 font-semibold scale-[1.02]'
                    : 'text-[#F2F0E9]/60 hover:text-[#FFAA00] hover:bg-[#FFAA00]/5'
                }`}
                title="Copy email address"
                aria-label={copied ? "Email address copied to clipboard" : "Copy email address"}
              >
                {copied ? (
                  <span className="font-semibold tracking-wider text-[11px] text-[#FFAA00]">COPIED ✓</span>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span className="tracking-wider text-[11px]">Copy</span>
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
                className="text-[#F2F0E9] hover:text-[#FFAA00] transition-colors font-semibold text-base sm:text-lg break-all font-sans tracking-tight"
              >
                {profile.email}
              </a>
              <p className="text-xs text-[#F2F0E9]/70 mt-1 leading-relaxed">
                For detailed briefs, collaboration proposals, or timeline discussions.
              </p>
            </div>
          </motion.div>
        </motion.div>

        {/* Minimal Editorial Footer */}
        <motion.footer
          initial={shouldReduceMotion ? false : { opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: false, amount: 0.2 }}
          transition={{ duration: 0.5 }}
          className="pt-10 sm:pt-14 border-t border-[#F2F0E9]/12 space-y-4 font-sans"
        >
          {/* Top row: Left: SEPH wordmark | Right: Instagram ↗ and Email ↗ links */}
          <div className="flex items-center justify-between">
            <span className="font-wosker text-[#FFAA00] text-xl sm:text-2xl tracking-tight uppercase leading-none select-none">
              SEPH
            </span>

            <div className="flex items-center gap-4 sm:gap-6 text-xs sm:text-[13px]">
              <a
                href={profile.instagramUrl}
                target="_blank"
                rel="noreferrer"
                className="group inline-flex items-center gap-1 text-[#F2F0E9]/70 hover:text-[#FFAA00] transition-colors font-medium"
              >
                <span>Instagram</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-[#F2F0E9]/50 group-hover:text-[#FFAA00] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-200 ease-out motion-reduce:transform-none" />
              </a>

              <a
                href={`mailto:${profile.email}`}
                className="group inline-flex items-center gap-1 text-[#F2F0E9]/70 hover:text-[#FFAA00] transition-colors font-medium"
              >
                <span>Email</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-[#F2F0E9]/50 group-hover:text-[#FFAA00] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-200 ease-out motion-reduce:transform-none" />
              </a>
            </div>
          </div>

          {/* Thin horizontal divider */}
          <div className="border-t border-[#F2F0E9]/10" />

          {/* Bottom row: Left: © 2026 SEPH. | Right: Back to top ↑ button */}
          <div className="flex items-center justify-between text-xs sm:text-[13px] text-[#F2F0E9]/50">
            <span>© 2026 SEPH.</span>

            <button
              type="button"
              onClick={scrollToTop}
              className="group inline-flex items-center gap-1 text-[#F2F0E9]/60 hover:text-[#FFAA00] transition-colors cursor-pointer font-medium"
              aria-label="Scroll back to top"
            >
              <span>Back to top</span>
              <ArrowUp className="w-3 h-3 text-[#F2F0E9]/50 group-hover:text-[#FFAA00] group-hover:-translate-y-0.5 transition-all duration-200 ease-out motion-reduce:transform-none" />
            </button>
          </div>
        </motion.footer>
      </div>
    </section>
  )
}
