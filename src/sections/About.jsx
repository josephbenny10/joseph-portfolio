import { motion, useReducedMotion } from 'framer-motion'
import { profile } from '../data/portfolioData'

export default function About() {
  const shouldReduceMotion = useReducedMotion()

  const itemVariants = {
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

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.08,
      },
    },
  }

  return (
    <section id="about" className="py-24 sm:py-32 px-5 sm:px-8 md:px-10 lg:px-14 xl:px-16 w-full max-w-[1720px] 2xl:max-w-[1880px] mx-auto border-t border-[#F2F0E9]/12">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 xl:gap-20">
        {/* Left Column */}
        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.2 }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          className="lg:col-span-4 space-y-3"
        >
          <span className="text-xs font-mono uppercase tracking-widest text-[#F2F0E9]/60 block font-medium">
            02 / About Me
          </span>
          <h2 className="font-display text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-[#F2F0E9] leading-tight uppercase">
            Video editor.
          </h2>
        </motion.div>

        {/* Right Column: Wide Editorial Introduction */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.15 }}
          className="lg:col-span-8 space-y-6 text-[#F2F0E9] leading-relaxed font-normal"
        >
          <motion.p
            variants={itemVariants}
            className="text-lg sm:text-xl lg:text-2xl text-[#F2F0E9]/90 font-normal leading-relaxed max-w-4xl"
          >
            I am Joseph Benny, a video editor based in Kerala, India, available for projects worldwide. I am deeply passionate about film editing, cinema, and the art of visual storytelling.
          </motion.p>

          <motion.p
            variants={itemVariants}
            className="text-base sm:text-lg text-[#F2F0E9]/80 leading-relaxed max-w-4xl"
          >
            I primarily create and publish film edits and short-form cinematic reels on Instagram. For me, editing is about finding the rhythm between cuts, syncing musical beats with evocative character moments, and creating a distinct mood in every sequence.
          </motion.p>

          <motion.p
            variants={itemVariants}
            className="text-base sm:text-lg text-[#F2F0E9]/80 leading-relaxed max-w-4xl"
          >
            <span className="text-[#FFAA00] font-semibold">DaVinci Resolve</span> is my primary editing software, where I work on cutting, audio synchronization, and color grading. I am continuously refining my craft and am open to freelance collaborations.
          </motion.p>

          {/* Quick Details Strip */}
          <motion.div
            variants={itemVariants}
            className="pt-8 border-t border-[#F2F0E9]/12 grid grid-cols-1 sm:grid-cols-3 gap-8 text-xs max-w-4xl"
          >
            <div className="space-y-1">
              <span className="text-[#F2F0E9]/50 font-mono uppercase text-[10px] tracking-wider block">
                Location
              </span>
              <span className="text-[#F2F0E9] font-semibold block text-sm">
                {profile.location}
              </span>
            </div>

            <div className="space-y-1">
              <span className="text-[#F2F0E9]/50 font-mono uppercase text-[10px] tracking-wider block">
                Availability
              </span>
              <span className="text-[#F2F0E9] font-semibold block text-sm">
                {profile.availability}
              </span>
            </div>

            <div className="space-y-1">
              <span className="text-[#F2F0E9]/50 font-mono uppercase text-[10px] tracking-wider block">
                Primary Software
              </span>
              <span className="text-[#F2F0E9] font-semibold block text-sm">
                {profile.primarySoftware}
              </span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
