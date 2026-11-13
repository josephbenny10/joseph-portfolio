import { useState, useRef, useCallback, useEffect } from 'react'
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useReducedMotion,
} from 'framer-motion'
import { Instagram, Mail, Copy, Check, ArrowUpRight, ArrowUp } from 'lucide-react'
import { profile } from '../data/portfolioData'
import Magnetic from '../components/Magnetic'

function ContactCard({ children, className = '', href, onClick, as = 'div', ...props }) {
  const cardRef = useRef(null)
  const isFinePointer = useRef(true)
  const shouldReduceMotion = useReducedMotion()

  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const springConfig = { damping: 22, stiffness: 220, mass: 0.35 }
  const smoothX = useSpring(mouseX, springConfig)
  const smoothY = useSpring(mouseY, springConfig)

  const rotateX = useTransform(smoothY, [-0.5, 0.5], shouldReduceMotion ? 0 : [3, -3])
  const rotateY = useTransform(smoothX, [-0.5, 0.5], shouldReduceMotion ? 0 : [-3, 3])

  useEffect(() => {
    isFinePointer.current = window.matchMedia('(hover: hover) and (pointer: fine)').matches
  }, [])

  const handleMouseMove = useCallback((e) => {
    if (shouldReduceMotion || !isFinePointer.current || !cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    if (!rect.width || !rect.height) return
    const normX = (e.clientX - rect.left) / rect.width - 0.5
    const normY = (e.clientY - rect.top) / rect.height - 0.5
    mouseX.set(Math.max(-0.5, Math.min(0.5, normX)))
    mouseY.set(Math.max(-0.5, Math.min(0.5, normY)))
  }, [shouldReduceMotion, mouseX, mouseY])

  const handleMouseLeave = () => {
    mouseX.set(0)
    mouseY.set(0)
  }

  const Component = as === 'a' ? motion.a : motion.div

  return (
    <div style={{ perspective: 1000 }} className="w-full relative">
      <Component
        ref={cardRef}
        href={href}
        onClick={onClick}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={
          shouldReduceMotion
            ? {}
            : {
                rotateX,
                rotateY,
                transformStyle: 'preserve-3d',
              }
        }
        className={`group p-6 sm:p-7 rounded-sm bg-[#13193D] hover:bg-[#13193D]/90 border border-[#F2F0E9]/15 hover:border-[#FFAA00]/80 transition-[border-color,box-shadow,background-color] duration-300 flex flex-col justify-between space-y-6 shadow-md hover:shadow-[0_20px_42px_rgba(0,0,0,0.55),0_0_24px_rgba(255,170,0,0.1)] will-change-transform relative overflow-hidden ${className}`}
        {...props}
      >
        {/* Subtle Top-Edge Specular Bevel Line */}
        <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-[#F2F0E9]/25 to-transparent pointer-events-none" />
        {children}
      </Component>
    </div>
  )
}

export default function Contact() {
  const [copied, setCopied] = useState(false)
  const shouldReduceMotion = useReducedMotion()

  const handleCopyEmail = (e) => {
    e.stopPropagation()
    navigator.clipboard.writeText(profile.email)
    setCopied(true)
    setTimeout(() => setCopied(false), 2200)
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
        staggerChildren: 0.12,
      },
    },
  }

  const cardVariants = {
    hidden: shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 },
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
    <section id="contact" className="relative py-24 sm:py-36 px-5 sm:px-8 md:px-10 lg:px-14 xl:px-16 w-full max-w-[1720px] 2xl:max-w-[1880px] mx-auto border-t border-[#F2F0E9]/12 select-none overflow-hidden">
      {/* Subtle Film-Burn / Light-Leak Transition into Section */}
      <div
        aria-hidden="true"
        className="absolute -top-24 left-1/4 w-[500px] h-48 bg-[radial-gradient(ellipse_at_top,rgba(255,170,0,0.18)_0%,rgba(255,0,30,0.06)_50%,transparent_75%)] blur-3xl pointer-events-none -z-10"
      />

      <div className="space-y-12 sm:space-y-16">
        {/* Section Header with Closing Title Card Feel */}
        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.2 }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          className="space-y-4 relative"
        >
          {/* Subtle Ambient Glow Behind Headline */}
          <div
            aria-hidden="true"
            className="absolute -top-12 -left-10 w-96 h-96 rounded-full bg-gradient-to-br from-[#FFAA00]/10 via-[#FF001E]/05 to-transparent blur-3xl pointer-events-none -z-10"
          />

          {/* Subtle Live Availability Status Pill */}
          <div className="flex items-center gap-2.5 text-xs font-mono uppercase tracking-widest text-[#F2F0E9]/60 font-medium">
            <span>04 / Contact</span>
            <span>•</span>
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FFAA00] opacity-75 motion-reduce:hidden" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#FFAA00]" />
            </span>
            <span className="text-[#F2F0E9] font-semibold">{profile.availability}</span>
          </div>

          <h2 className="font-display text-4xl sm:text-6xl lg:text-7xl xl:text-8xl font-black tracking-tight text-[#F2F0E9] max-w-4xl lg:max-w-5xl leading-[1.05] drop-shadow-[0_12px_28px_rgba(0,0,0,0.7)]">
            Have an editing project in mind? Let's connect.
          </h2>

          <p className="text-[#F2F0E9]/80 text-base sm:text-lg lg:text-xl max-w-3xl leading-relaxed">
            Open for custom film edits, narrative scene studies, and short-form reel projects. Feel free to reach out via Instagram DM or send an email.
          </p>
        </motion.div>

        {/* Primary Contact Channels: Instagram + Email */}
        <motion.div
          variants={cardsContainerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.15 }}
          className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 max-w-3xl pt-2"
        >
          {/* Instagram Card with 3D Tilt & Magnetic Arrow */}
          <motion.div variants={cardVariants}>
            <ContactCard
              as="a"
              href={profile.instagramUrl}
              target="_blank"
              rel="noreferrer"
            >
              <div className="flex items-center justify-between">
                <span className="p-2.5 rounded-[2px] bg-[#FF001E]/15 text-[#FF001E] group-hover:scale-110 group-hover:bg-[#FF001E] group-hover:text-[#F2F0E9] transition-all duration-300">
                  <Instagram className="w-5 h-5" />
                </span>
                <ArrowUpRight className="w-4 h-4 text-[#F2F0E9]/50 group-hover:text-[#FFAA00] group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-200 ease-out motion-reduce:transform-none" />
              </div>

              <div>
                <span className="text-xs font-mono uppercase tracking-wider text-[#F2F0E9]/60 block mb-1">
                  Instagram Direct Message
                </span>
                <span className="text-[#F2F0E9] group-hover:text-[#FFAA00] group-hover:translate-x-1 inline-block transition-all duration-200 font-semibold text-lg sm:text-xl font-sans tracking-tight motion-reduce:transform-none">
                  {profile.instagramHandle}
                </span>
                <p className="text-xs text-[#F2F0E9]/70 mt-1.5 leading-relaxed">
                  Best way to reach me directly for quick replies and project inquiries.
                </p>
              </div>
            </ContactCard>
          </motion.div>

          {/* Email Card with 3D Tilt & Tactile Copy Interaction */}
          <motion.div variants={cardVariants}>
            <ContactCard as="div">
              <div className="flex items-center justify-between">
                <span className="p-2.5 rounded-[2px] bg-[#FF001E]/15 text-[#FF001E] group-hover:scale-110 group-hover:bg-[#FF001E] group-hover:text-[#F2F0E9] transition-all duration-300">
                  <Mail className="w-5 h-5" />
                </span>

                <Magnetic strength={0.35} maxDistance={6}>
                  <button
                    type="button"
                    onClick={handleCopyEmail}
                    className={`text-xs flex items-center gap-1.5 font-mono transition-all duration-200 px-2.5 py-1 rounded-[2px] cursor-pointer ${
                      copied
                        ? 'text-[#FFAA00] bg-[#FFAA00]/15 font-semibold scale-[1.04]'
                        : 'text-[#F2F0E9]/60 hover:text-[#FFAA00] hover:bg-[#FFAA00]/10'
                    }`}
                    title="Copy email address"
                    aria-label={copied ? "Email address copied to clipboard" : "Copy email address"}
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-[#FFAA00]" />
                        <span className="font-semibold tracking-wider text-[11px] text-[#FFAA00]">COPIED</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span className="tracking-wider text-[11px]">Copy</span>
                      </>
                    )}
                  </button>
                </Magnetic>
              </div>

              <div>
                <span className="text-xs font-mono uppercase tracking-wider text-[#F2F0E9]/60 block mb-1">
                  Direct Email
                </span>
                <a
                  href={`mailto:${profile.email}`}
                  className="text-[#F2F0E9] hover:text-[#FFAA00] group-hover:translate-x-1 inline-block transition-all duration-200 font-semibold text-base sm:text-lg break-all font-sans tracking-tight motion-reduce:transform-none"
                >
                  {profile.email}
                </a>
                <p className="text-xs text-[#F2F0E9]/70 mt-1.5 leading-relaxed">
                  For detailed briefs, collaboration proposals, or timeline discussions.
                </p>
              </div>
            </ContactCard>
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
          {/* Top row: Left: SEPH wordmark | Right: Instagram ↗ and Email ↗ links with Magnetic Hover */}
          <div className="flex items-center justify-between">
            <span className="font-wosker text-[#FFAA00] text-xl sm:text-2xl tracking-tight uppercase leading-none select-none">
              SEPH
            </span>

            <div className="flex items-center gap-4 sm:gap-6 text-xs sm:text-[13px]">
              <Magnetic strength={0.3} maxDistance={6}>
                <a
                  href={profile.instagramUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="group inline-flex items-center gap-1 text-[#F2F0E9]/70 hover:text-[#FFAA00] transition-colors font-medium py-1"
                >
                  <span>Instagram</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-[#F2F0E9]/50 group-hover:text-[#FFAA00] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-200 ease-out motion-reduce:transform-none" />
                </a>
              </Magnetic>

              <Magnetic strength={0.3} maxDistance={6}>
                <a
                  href={`mailto:${profile.email}`}
                  className="group inline-flex items-center gap-1 text-[#F2F0E9]/70 hover:text-[#FFAA00] transition-colors font-medium py-1"
                >
                  <span>Email</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-[#F2F0E9]/50 group-hover:text-[#FFAA00] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-200 ease-out motion-reduce:transform-none" />
                </a>
              </Magnetic>
            </div>
          </div>

          {/* Thin horizontal divider */}
          <div className="border-t border-[#F2F0E9]/10" />

          {/* Bottom row: Left: © 2026 SEPH. | Right: Back to top ↑ button */}
          <div className="flex items-center justify-between text-xs sm:text-[13px] text-[#F2F0E9]/50">
            <span>© 2026 SEPH.</span>

            <Magnetic strength={0.3} maxDistance={6}>
              <button
                type="button"
                onClick={scrollToTop}
                className="group inline-flex items-center gap-1 text-[#F2F0E9]/60 hover:text-[#FFAA00] transition-colors cursor-pointer font-medium py-1"
                aria-label="Scroll back to top"
              >
                <span>Back to top</span>
                <ArrowUp className="w-3 h-3 text-[#F2F0E9]/50 group-hover:text-[#FFAA00] group-hover:-translate-y-0.5 transition-all duration-200 ease-out motion-reduce:transform-none" />
              </button>
            </Magnetic>
          </div>
        </motion.footer>
      </div>
    </section>
  )
}
