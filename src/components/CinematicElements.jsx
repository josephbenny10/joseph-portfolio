import { motion, useReducedMotion } from 'framer-motion'

/**
 * FilmSprockets
 * Authentic 35mm celluloid film perforation / sprocket-hole strip.
 * Can be rendered vertically along page margins or horizontally on film frames.
 */
export function FilmSprockets({
  orientation = 'vertical',
  count = 14,
  className = '',
  opacity = 0.25,
}) {
  const holes = Array.from({ length: count }, (_, i) => i)

  if (orientation === 'horizontal') {
    return (
      <div
        aria-hidden="true"
        style={{ opacity }}
        className={`flex items-center justify-between gap-3 pointer-events-none select-none ${className}`}
      >
        {holes.map((i) => (
          <div
            key={i}
            className="w-3.5 h-2 rounded-[1.5px] bg-[#0A0E26] border border-[#F2F0E9]/20 shrink-0"
          />
        ))}
      </div>
    )
  }

  return (
    <div
      aria-hidden="true"
      style={{ opacity }}
      className={`flex flex-col items-center justify-between gap-4 pointer-events-none select-none ${className}`}
    >
      {holes.map((i) => (
        <div
          key={i}
          className="w-2.5 h-4 rounded-[1.5px] bg-[#0A0E26] border border-[#F2F0E9]/20 shrink-0"
        />
      ))}
    </div>
  )
}

/**
 * ViewfinderMarks
 * Clean optical camera / director viewfinder frame-corner crop lines.
 */
export function ViewfinderMarks({
  className = '',
  color = '#FFAA00',
  size = 12,
  strokeWidth = 1.5,
  showCrosshair = false,
}) {
  return (
    <div
      aria-hidden="true"
      className={`absolute inset-0 pointer-events-none select-none ${className}`}
    >
      {/* Top Left Corner */}
      <div
        style={{
          width: size,
          height: size,
          borderColor: color,
          borderTopWidth: strokeWidth,
          borderLeftWidth: strokeWidth,
        }}
        className="absolute top-2 left-2"
      />
      {/* Top Right Corner */}
      <div
        style={{
          width: size,
          height: size,
          borderColor: color,
          borderTopWidth: strokeWidth,
          borderRightWidth: strokeWidth,
        }}
        className="absolute top-2 right-2"
      />
      {/* Bottom Left Corner */}
      <div
        style={{
          width: size,
          height: size,
          borderColor: color,
          borderBottomWidth: strokeWidth,
          borderLeftWidth: strokeWidth,
        }}
        className="absolute bottom-2 left-2"
      />
      {/* Bottom Right Corner */}
      <div
        style={{
          width: size,
          height: size,
          borderColor: color,
          borderBottomWidth: strokeWidth,
          borderRightWidth: strokeWidth,
        }}
        className="absolute bottom-2 right-2"
      />

      {/* Center Framing Crosshair */}
      {showCrosshair && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center opacity-30">
          <div style={{ width: 10, height: strokeWidth, backgroundColor: color }} />
          <div
            style={{
              width: strokeWidth,
              height: 10,
              backgroundColor: color,
              position: 'absolute',
            }}
          />
        </div>
      )}
    </div>
  )
}

/**
 * AnamorphicLightLeak
 * Organic warm amber / film-red optical flare that drifts across atmospheric cinema scenes.
 */
export function AnamorphicLightLeak({
  className = '',
  position = 'top-right',
  intensity = 0.5,
}) {
  const shouldReduceMotion = useReducedMotion()

  const positionStyles = {
    'top-right': 'top-[-10%] right-[-10%] w-[550px] h-[550px]',
    'top-left': 'top-[-10%] left-[-10%] w-[550px] h-[550px]',
    'bottom-left': 'bottom-[-15%] left-[-10%] w-[600px] h-[600px]',
    'bottom-right': 'bottom-[-15%] right-[-10%] w-[600px] h-[600px]',
    center: 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px]',
  }

  return (
    <motion.div
      aria-hidden="true"
      style={{ opacity: intensity }}
      animate={
        shouldReduceMotion
          ? {}
          : {
              scale: [1, 1.08, 0.96, 1],
              opacity: [intensity, intensity * 1.25, intensity * 0.85, intensity],
            }
      }
      transition={{
        repeat: Infinity,
        duration: 14,
        ease: 'easeInOut',
      }}
      className={`absolute pointer-events-none select-none rounded-full blur-[110px] bg-[radial-gradient(ellipse_at_center,rgba(255,170,0,0.18)_0%,rgba(255,0,30,0.08)_40%,transparent_70%)] will-change-transform ${
        positionStyles[position] || positionStyles['top-right']
      } ${className}`}
    />
  )
}

/**
 * ProjectorLightCone
 * Atmospheric volumetric light beam descending from the cinema projector ceiling.
 */
export function ProjectorLightCone({ className = '' }) {
  const shouldReduceMotion = useReducedMotion()

  return (
    <motion.div
      aria-hidden="true"
      animate={
        shouldReduceMotion
          ? {}
          : {
              opacity: [0.07, 0.12, 0.08, 0.11, 0.07],
            }
      }
      transition={{
        repeat: Infinity,
        duration: 6,
        ease: 'easeInOut',
      }}
      className={`absolute top-0 left-1/2 -translate-x-1/2 w-[90vw] max-w-[1400px] h-[75vh] pointer-events-none select-none -z-10 bg-[radial-gradient(ellipse_at_top,rgba(255,170,0,0.1)_0%,rgba(242,240,233,0.03)_35%,transparent_70%)] blur-2xl ${className}`}
    />
  )
}
