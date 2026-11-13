import { useState, useEffect } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { ArrowUp } from 'lucide-react'
import Magnetic from './Magnetic'

export default function BackToTop() {
  const [visible, setVisible] = useState(false)
  const shouldReduceMotion = useReducedMotion()

  useEffect(() => {
    const handleScroll = () => {
      // Show button after scrolling past hero section (~400px)
      const scrollY = window.scrollY || document.documentElement.scrollTop || 0
      setVisible(scrollY > 400)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: shouldReduceMotion ? 'auto' : 'smooth',
    })
  }

  return (
    <AnimatePresence>
      {visible && (
        <div className="fixed bottom-6 right-6 sm:bottom-8 sm:right-8 z-40">
          <Magnetic strength={0.32} maxDistance={8}>
            <motion.button
              type="button"
              onClick={scrollToTop}
              initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.8, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.8, y: 12 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              aria-label="Scroll back to top"
              title="Back to top"
              className="p-3 sm:p-3.5 rounded-full bg-[#13193D]/90 backdrop-blur-md border border-[#F2F0E9]/15 hover:border-[#FFAA00] text-[#F2F0E9]/80 hover:text-[#FFAA00] shadow-lg hover:shadow-[0_8px_24px_rgba(255,170,0,0.18)] transition-colors duration-200 group cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FFAA00]"
            >
              <ArrowUp className="w-4 h-4 transition-transform duration-200 ease-out group-hover:-translate-y-1 motion-reduce:transform-none" />
            </motion.button>
          </Magnetic>
        </div>
      )}
    </AnimatePresence>
  )
}

