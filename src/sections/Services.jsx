import { useState, useRef, useCallback, useEffect } from 'react'
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useReducedMotion,
} from 'framer-motion'
import { services } from '../data/portfolioData'
import { ArrowUpRight } from 'lucide-react'
import Magnetic from '../components/Magnetic'

function ServiceRow({ service, index, rowVariants }) {
  const rowRef = useRef(null)
  const isFinePointer = useRef(true)
  const shouldReduceMotion = useReducedMotion()
  const [isHovered, setIsHovered] = useState(false)

  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const springConfig = { damping: 24, stiffness: 220, mass: 0.4 }
  const smoothX = useSpring(mouseX, springConfig)
  const smoothY = useSpring(mouseY, springConfig)

  // Restrained 3D tilt on hover (~2.5deg max)
  const rotateX = useTransform(smoothY, [-0.5, 0.5], shouldReduceMotion ? 0 : [2.5, -2.5])
  const rotateY = useTransform(smoothX, [-0.5, 0.5], shouldReduceMotion ? 0 : [-2.5, 2.5])

  useEffect(() => {
    isFinePointer.current = window.matchMedia('(hover: hover) and (pointer: fine)').matches
  }, [])

  const handleMouseMove = useCallback((e) => {
    if (shouldReduceMotion || !isFinePointer.current || !rowRef.current) return
    const rect = rowRef.current.getBoundingClientRect()
    if (!rect.width || !rect.height) return
    const normX = (e.clientX - rect.left) / rect.width - 0.5
    const normY = (e.clientY - rect.top) / rect.height - 0.5
    mouseX.set(Math.max(-0.5, Math.min(0.5, normX)))
    mouseY.set(Math.max(-0.5, Math.min(0.5, normY)))
  }, [shouldReduceMotion, mouseX, mouseY])

  const handleMouseEnter = () => setIsHovered(true)
  const handleMouseLeave = () => {
    setIsHovered(false)
    mouseX.set(0)
    mouseY.set(0)
  }

  return (
    <div style={{ perspective: 1000 }} className="w-full relative">
      <motion.div
        ref={rowRef}
        variants={rowVariants}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
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
        className={`py-10 sm:py-12 grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-8 xl:gap-12 items-start group px-5 sm:px-8 -mx-5 sm:-mx-8 rounded-sm transition-all duration-300 will-change-transform relative ${
          isHovered
            ? 'bg-[#0E1333] border-l-2 border-[#FFAA00] shadow-[0_16px_36px_rgba(0,0,0,0.55),0_0_24px_rgba(255,170,0,0.12)]'
            : 'border-l-2 border-transparent'
        }`}
      >
        {/* Timeline Razor Cut Splice Highlight on Hover */}
        {isHovered && (
          <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-[#FFAA00]/60 via-[#F2F0E9]/20 to-transparent pointer-events-none" />
        )}

        {/* Timeline Cut / Track Marker */}
        <div className="md:col-span-2 font-mono text-xs sm:text-sm text-[#F2F0E9]/50 pt-1 group-hover:text-[#FFAA00] transition-colors duration-200 flex items-center gap-2">
          <span className="font-semibold">{service.number}</span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#FFAA00] opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
        </div>

        {/* Service Title & Animated Directional Indicator */}
        <div className="md:col-span-4 flex items-center justify-between gap-4">
          <h3 className="font-display font-bold text-2xl sm:text-3xl text-[#F2F0E9] group-hover:text-[#FFAA00] group-hover:translate-x-1.5 transition-all duration-200 tracking-tight motion-reduce:transform-none">
            {service.title}
          </h3>
          <ArrowUpRight className="w-5 h-5 text-[#FFAA00] opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 ease-out shrink-0 motion-reduce:transform-none hidden sm:block" />
        </div>

        {/* Service Description */}
        <div className="md:col-span-6">
          <p className="text-[#F2F0E9]/80 text-base sm:text-lg leading-relaxed max-w-2xl group-hover:text-[#F2F0E9]/95 transition-colors duration-200">
            {service.description}
          </p>
        </div>
      </motion.div>
    </div>
  )
}

export default function Services() {
  const shouldReduceMotion = useReducedMotion()

  const listContainerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const rowVariants = {
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
    <section id="services" className="relative py-24 sm:py-32 px-5 sm:px-8 md:px-10 lg:px-14 xl:px-16 w-full max-w-[1720px] 2xl:max-w-[1880px] mx-auto border-t border-[#F2F0E9]/12 overflow-hidden">
      {/* Section Header */}
      <motion.div
        initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.2 }}
        transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
        className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-16"
      >
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-[#F2F0E9]/60 block mb-2 font-medium">
            03 / What I Offer
          </span>
          <h2 className="font-display text-4xl sm:text-6xl font-black tracking-tight text-[#F2F0E9] uppercase">
            Editing Services
          </h2>
        </div>

        <p className="text-[#F2F0E9]/80 text-sm sm:text-base max-w-lg leading-relaxed">
          Focused video editing and post-production for creators, channels, and independent film projects.
        </p>
      </motion.div>

      {/* Tactile 3D Services List with Hairline Dividers */}
      <motion.div
        variants={listContainerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, amount: 0.1 }}
        className="divide-y divide-[#F2F0E9]/12 border-y border-[#F2F0E9]/12"
      >
        {services.map((service, index) => (
          <ServiceRow
            key={service.number}
            service={service}
            index={index}
            rowVariants={rowVariants}
          />
        ))}
      </motion.div>

      {/* Tactile Contact CTA Banner */}
      <motion.div
        initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.2 }}
        transition={{ duration: 0.55, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        className="mt-14 p-8 sm:p-10 rounded-sm bg-[#13193D] border border-[#F2F0E9]/15 flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-md"
      >
        <div className="max-w-2xl">
          <h4 className="text-base sm:text-lg font-bold text-[#F2F0E9]">
            Have a project in mind?
          </h4>
          <p className="text-sm text-[#F2F0E9]/80 mt-1 leading-relaxed">
            Let's make something worth watching.
          </p>
        </div>

        <Magnetic strength={0.28} maxDistance={10}>
          <a
            href="#contact"
            className="group/btn inline-flex items-center gap-2 px-6 py-3 rounded-[2px] bg-[#FF001E] text-[#F2F0E9] font-bold text-xs uppercase tracking-wider font-mono hover:bg-[#d9001a] transition-all duration-200 shrink-0 shadow-sm hover:shadow-lg"
          >
            <span>GET IN TOUCH</span>
            <ArrowUpRight className="w-4 h-4 text-[#F2F0E9] group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform duration-200 ease-out motion-reduce:transform-none" />
          </a>
        </Magnetic>
      </motion.div>
    </section>
  )
}
