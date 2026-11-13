import { useState, useEffect } from 'react'
import { motion, AnimatePresence, useScroll, useReducedMotion } from 'framer-motion'
import { Menu, X, Instagram } from 'lucide-react'
import { profile } from '../data/portfolioData'
import Magnetic from './Magnetic'

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('')
  const { scrollYProgress } = useScroll()
  const shouldReduceMotion = useReducedMotion()

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY || document.documentElement.scrollTop || 0
      setIsScrolled(scrollY > 25)

      // Near top of page (hero area), no section active
      if (scrollY < 180) {
        setActiveSection('')
        return
      }

      // If scrolled near bottom of page (within 100px), activate contact
      const windowHeight = window.innerHeight
      const docHeight = document.documentElement.scrollHeight
      if (windowHeight + scrollY >= docHeight - 100) {
        setActiveSection('contact')
        return
      }

      // Physical order of sections down the page
      const sectionOrder = ['work', 'about', 'services', 'contact']
      const focalLine = windowHeight * 0.38

      let current = ''
      for (const id of sectionOrder) {
        const el = document.getElementById(id)
        if (el) {
          const rect = el.getBoundingClientRect()
          // Section spans across the focal line in viewport
          if (rect.top <= focalLine && rect.bottom > focalLine) {
            current = id
            break
          }
        }
      }

      // Fallback if between sections during quick scrolling
      if (!current) {
        for (let i = sectionOrder.length - 1; i >= 0; i--) {
          const id = sectionOrder[i]
          const el = document.getElementById(id)
          if (el) {
            const rect = el.getBoundingClientRect()
            if (rect.top <= focalLine) {
              current = id
              break
            }
          }
        }
      }

      setActiveSection(current)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navLinks = [
    { label: 'Work', href: '#work' },
    { label: 'About', href: '#about' },
    { label: 'Services', href: '#services' },
    { label: 'Contact', href: '#contact' },
  ]

  return (
    <>
      {/* ── 3. SCROLL PROGRESS BAR ── */}
      <motion.div
        style={{ scaleX: scrollYProgress }}
        className="fixed top-0 left-0 right-0 h-[2px] bg-[#FFAA00] origin-left z-40 pointer-events-none"
        aria-hidden="true"
      />

      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-colors duration-300 ${
          isScrolled
            ? 'bg-[#0F1432]/92 backdrop-blur-md border-b border-[#F2F0E9]/12 py-3 sm:py-3.5 shadow-xs'
            : 'bg-transparent py-4 sm:py-5'
        }`}
      >
        <div className="w-full max-w-[1720px] 2xl:max-w-[1880px] mx-auto px-5 sm:px-8 md:px-10 lg:px-14 xl:px-16 flex items-center justify-between">
          {/* Left: Brand / Name */}
          <a
            href="#"
            className="flex items-center gap-2.5 group focus:outline-none"
          >
            <span className="font-display font-bold text-base sm:text-lg tracking-tight text-[#F2F0E9] group-hover:text-[#FFAA00] transition-colors">
              {profile.name}
            </span>
            <span className="text-[#F2F0E9]/30 font-light text-xs hidden sm:inline">/</span>
            <span className="text-[#F2F0E9]/70 text-xs tracking-wide hidden sm:inline font-mono">
              {profile.role}
            </span>
          </a>

          {/* Far-Right: Desktop Navigation & Instagram */}
          <nav className="hidden md:flex items-center gap-6 lg:gap-8 text-sm">
            {navLinks.map((link) => {
              const isActive = activeSection === link.href.slice(1)
              return (
                <a
                  key={link.label}
                  href={link.href}
                  className={`group relative py-1 transition-colors duration-200 text-xs sm:text-[13px] font-semibold tracking-wide uppercase font-mono ${
                    isActive ? 'text-[#FFAA00]' : 'text-[#F2F0E9]/80 hover:text-[#FFAA00]'
                  }`}
                >
                  <span>{link.label}</span>
                  <span
                    className={`absolute bottom-0 left-0 w-full h-[1.5px] bg-[#FFAA00] origin-left transition-transform duration-200 ease-out pointer-events-none motion-reduce:transition-none ${
                      isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                    }`}
                  />
                </a>
              )
            })}

            {/* Instagram Link with Magnetic Precision */}
            <Magnetic strength={0.28} maxDistance={6}>
              <a
                href={profile.instagramUrl}
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram Profile"
                className="group inline-flex items-center gap-1.5 px-3 py-1 text-xs text-[#F2F0E9] hover:bg-[#FF001E] hover:text-[#F2F0E9] hover:border-[#FF001E] bg-[#13193D] border border-[#F2F0E9]/15 rounded-[2px] font-medium transition-all ml-1 font-mono shadow-xs hover:shadow-md"
              >
                <Instagram className="w-3.5 h-3.5 text-[#F2F0E9]/80 group-hover:text-[#F2F0E9] transition-colors" />
                <span>Instagram</span>
              </a>
            </Magnetic>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-[#F2F0E9] hover:text-[#FFAA00] focus:outline-none transition-colors"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Drawer */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="md:hidden bg-[#0F1432]/98 backdrop-blur-xl border-b border-[#F2F0E9]/12 px-6 py-5 space-y-4 overflow-hidden"
            >
              <div className="flex items-center justify-between text-xs text-[#F2F0E9]/70 pb-3 border-b border-[#F2F0E9]/12 font-mono">
                <span className="font-semibold text-[#F2F0E9]">{profile.name}</span>
                <span className="text-[#F2F0E9]/60 text-[11px]">{profile.role}</span>
              </div>

              <div className="space-y-1">
                {navLinks.map((link) => {
                  const isActive = activeSection === link.href.slice(1)
                  return (
                    <a
                      key={link.label}
                      href={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`group relative inline-block text-base py-1.5 font-semibold transition-colors ${
                        isActive ? 'text-[#FFAA00]' : 'text-[#F2F0E9] hover:text-[#FFAA00]'
                      }`}
                    >
                      <span>{link.label}</span>
                      <span
                        className={`absolute bottom-0.5 left-0 w-full h-[1.5px] bg-[#FFAA00] origin-left transition-transform duration-200 ease-out pointer-events-none motion-reduce:transition-none ${
                          isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                        }`}
                      />
                    </a>
                  )
                })}
              </div>

              <a
                href={profile.instagramUrl}
                target="_blank"
                rel="noreferrer"
                onClick={() => setMobileMenuOpen(false)}
                className="inline-flex items-center gap-2 text-sm text-[#F2F0E9] hover:text-[#FF001E] pt-2 font-semibold font-mono transition-colors"
              >
                <Instagram className="w-4 h-4 text-[#FF001E]" />
                <span>Follow on Instagram</span>
              </a>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  )
}
