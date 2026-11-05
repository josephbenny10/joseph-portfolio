import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

export default function CustomCursor() {
  const [mousePosition, setMousePosition] = useState({ x: -100, y: -100 })
  const [cursorText, setCursorText] = useState('')
  const [isHovered, setIsHovered] = useState(false)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Only run on desktop with fine pointer
    if (window.matchMedia('(pointer: coarse)').matches) return

    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
      if (!isVisible) setIsVisible(true)

      // Check if hovering an element with data-cursor attribute
      const target = e.target.closest('[data-cursor]')
      if (target) {
        setCursorText(target.getAttribute('data-cursor') || '')
        setIsHovered(true)
      } else {
        setCursorText('')
        setIsHovered(false)
      }
    }

    const handleMouseLeave = () => setIsVisible(false)
    const handleMouseEnter = () => setIsVisible(true)

    window.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseleave', handleMouseLeave)
    document.addEventListener('mouseenter', handleMouseEnter)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseleave', handleMouseLeave)
      document.removeEventListener('mouseenter', handleMouseEnter)
    }
  }, [isVisible])

  if (!isVisible) return null

  return (
    <motion.div
      className="pointer-events-none fixed top-0 left-0 z-50 hidden md:flex items-center justify-center rounded-full transition-colors"
      style={{
        x: mousePosition.x,
        y: mousePosition.y,
        translateX: '-50%',
        translateY: '-50%',
      }}
      animate={{
        width: isHovered ? 72 : 10,
        height: isHovered ? 72 : 10,
        backgroundColor: isHovered ? 'rgba(244, 244, 245, 0.95)' : '#dc2626',
        mixBlendMode: isHovered ? 'difference' : 'normal',
      }}
      transition={{ type: 'spring', damping: 26, stiffness: 350, mass: 0.5 }}
    >
      {isHovered && cursorText && (
        <span className="font-mono text-[10px] tracking-widest font-bold text-black uppercase select-none">
          {cursorText}
        </span>
      )}
    </motion.div>
  )
}

