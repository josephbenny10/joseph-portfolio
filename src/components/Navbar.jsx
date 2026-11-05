import { useState, useEffect } from 'react'
import { Menu, X, Instagram } from 'lucide-react'
import { profile } from '../data/portfolioData'

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navLinks = [
    { label: "Work", href: "#work" },
    { label: "Showreel", href: "#showreel" },
    { label: "About", href: "#about" },
    { label: "Services", href: "#services" },
    { label: "Contact", href: "#contact" },
  ]

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled
          ? "bg-[#0a0a0a]/90 backdrop-blur-md border-b border-white/[0.06] py-3.5 sm:py-4"
          : "bg-transparent py-5 sm:py-6"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-8 flex items-center justify-between">
        {/* Brand / Name */}
        <a
          href="#"
          className="flex items-center gap-3 group focus:outline-none"
        >
          <span className="font-display font-bold text-base sm:text-lg tracking-tight text-white group-hover:text-zinc-300 transition-colors">
            {profile.name}
          </span>
          <span className="text-zinc-600 font-light text-xs hidden sm:inline">/</span>
          <span className="text-zinc-400 text-xs tracking-wide hidden sm:inline">
            {profile.role}
          </span>
        </a>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-7 text-sm">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-zinc-400 hover:text-white transition-colors duration-200 text-xs sm:text-sm"
            >
              {link.label}
            </a>
          ))}

          {/* Instagram Button */}
          <a
            href={profile.instagramUrl}
            target="_blank"
            rel="noreferrer"
            aria-label="Instagram Profile"
            className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs text-zinc-300 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 rounded-[2px] transition-colors"
          >
            <Instagram className="w-3.5 h-3.5 text-[#dc2626]" />
            <span>Instagram</span>
          </a>

          {/* Availability Status */}
          <div className="flex items-center gap-2 pl-3 border-l border-white/10 text-xs text-zinc-400">
            <span className="w-1.5 h-1.5 rounded-full bg-[#dc2626]" />
            <span className="text-[11px] tracking-wide text-zinc-300">{profile.availability}</span>
          </div>
        </nav>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 text-zinc-400 hover:text-white focus:outline-none"
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0a0a0a]/95 backdrop-blur-xl border-b border-white/10 px-6 py-6 space-y-4">
          <div className="flex flex-col gap-1 text-xs text-zinc-400 pb-2 border-b border-white/[0.08]">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#dc2626]" />
              <span className="text-zinc-200">{profile.availability}</span>
            </div>
            <span className="text-zinc-500 text-[11px]">{profile.location}</span>
          </div>

          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block text-base text-zinc-300 hover:text-white py-1"
            >
              {link.label}
            </a>
          ))}

          <a
            href={profile.instagramUrl}
            target="_blank"
            rel="noreferrer"
            onClick={() => setMobileMenuOpen(false)}
            className="inline-flex items-center gap-2 text-sm text-[#dc2626] pt-2"
          >
            <Instagram className="w-4 h-4" />
            <span>Follow on Instagram</span>
          </a>
        </div>
      )}
    </header>
  )
}
