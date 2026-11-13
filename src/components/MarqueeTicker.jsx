import { motion, useReducedMotion } from 'framer-motion'

export default function MarqueeTicker({
  speed = 32,
  className = "",
}) {
  const shouldReduceMotion = useReducedMotion()

  const items = [
    "SEPH — VIDEO EDITOR",
    "FILM EDITS",
    "CINEMATIC REELS",
    "SCENE STUDIES",
    "RHYTHM & PACING",
    "VISUAL STORYTELLING",
  ]

  return (
    <div
      className={`relative w-full overflow-hidden border-y border-[#F2F0E9]/12 bg-[#0F1432] py-3.5 select-none ${className}`}
      aria-hidden="true"
    >
      <motion.div
        className="flex w-max items-center"
        animate={
          shouldReduceMotion
            ? {}
            : {
                x: ["0%", "-50%"],
              }
        }
        transition={{
          x: {
            repeat: Infinity,
            repeatType: "loop",
            duration: speed,
            ease: "linear",
          },
        }}
      >
        {[0, 1].map((copyIndex) => (
          <div key={copyIndex} className="flex items-center gap-6 pr-6 shrink-0">
            {items.map((item, idx) => (
              <span
                key={`${copyIndex}-${idx}`}
                className="flex items-center gap-6 text-xs sm:text-sm font-mono tracking-widest uppercase text-[#F2F0E9] font-semibold"
              >
                <span>{item}</span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#FFAA00] shrink-0" />
              </span>
            ))}
          </div>
        ))}
      </motion.div>
    </div>
  )
}
