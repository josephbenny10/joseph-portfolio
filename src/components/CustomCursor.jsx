import { useEffect, useState, useRef } from 'react'
import { motion } from 'framer-motion'

export default function CustomCursor() {
  const [mousePosition, setMousePosition] = useState({ x: -100, y: -100 })
  const [cursorText, setCursorText] = useState('')
  const [isHovered, setIsHovered] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const lastPos = useRef({ x: -100, y: -100 })

  useEffect(() => {
    // Only run on desktop with fine pointer
    if (window.matchMedia('(pointer: coarse)').matches) return

    const updateTargetUnderCursor = (x, y) => {
      const el = document.elementFromPoint(x, y)
      const target = el?.closest('[data-cursor]')
      if (target) {
        setCursorText(target.getAttribute('data-cursor') || '')
        setIsHovered(true)
      } else {
        setCursorText('')
        setIsHovered(false)
      }
    }

    const handleMouseMove = (e) => {
      lastPos.current = { x: e.clientX, y: e.clientY }
      setMousePosition({ x: e.clientX, y: e.clientY })
      setIsVisible(true)

      const target = e.target.closest('[data-cursor]')
      if (target) {
        setCursorText(target.getAttribute('data-cursor') || '')
        setIsHovered(true)
      } else {
        setCursorText('')
        setIsHovered(false)
      }
    }

    const handleScroll = () => {
      if (lastPos.current.x >= 0 && lastPos.current.y >= 0) {
        updateTargetUnderCursor(lastPos.current.x, lastPos.current.y)
      }
    }

    const handleMouseLeave = () => setIsVisible(false)
    const handleMouseEnter = () => setIsVisible(true)

    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    window.addEventListener('scroll', handleScroll, { passive: true })
    document.addEventListener('mouseleave', handleMouseLeave)
    document.addEventListener('mouseenter', handleMouseEnter)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('scroll', handleScroll)
      document.removeEventListener('mouseleave', handleMouseLeave)
      document.removeEventListener('mouseenter', handleMouseEnter)
    }
  }, [])

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
        backgroundColor: isHovered ? '#FF001E' : 'rgba(242, 240, 233, 0.75)',
      }}
      transition={{ type: 'spring', damping: 26, stiffness: 350, mass: 0.5 }}
    >
      {isHovered && cursorText && (
        <span className="font-mono text-[10px] tracking-widest font-bold text-[#F2F0E9] uppercase select-none">
          {cursorText}
        </span>
      )}
    </motion.div>
  )
}
