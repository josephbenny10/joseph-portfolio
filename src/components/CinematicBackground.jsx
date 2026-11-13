import { motion, useReducedMotion } from 'framer-motion'
import { useWindowMouse } from '../hooks/useWindowMouse'
import { FilmSprockets, AnamorphicLightLeak, ProjectorLightCone } from './CinematicElements'

/**
 * CinematicBackground
 * Immersive screening-room visual environment:
 * - Deep 35mm cinema navy palette (#0F1432 / #0A0E26)
 * - Volumetric overhead projector light cone
 * - Organic anamorphic optical light leaks (amber & film red)
 * - 35mm celluloid sprocket-hole margins
 * - Cinema theater perimeter vignette
 * - Authentic 35mm celluloid film grain
 */
export default function CinematicBackground() {
  const shouldReduceMotion = useReducedMotion()
  const { smoothX, smoothY } = useWindowMouse()

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none select-none z-0 overflow-hidden"
    >
      {/* ── LAYER 1: Deep Cinema Navy Base Atmosphere ── */}
      <div className="absolute inset-0 bg-[#0F1432]" />

      {/* ── LAYER 2: Volumetric Projector Light Cone ── */}
      <ProjectorLightCone />

      {/* ── LAYER 3: Organic Anamorphic Light Leaks ── */}
      {/* Upper-Right Warm Amber Light Leak */}
      <AnamorphicLightLeak
        position="top-right"
        intensity={0.45}
      />

      {/* Mid/Lower-Left Film Red Light Leak */}
      <AnamorphicLightLeak
        position="bottom-left"
        intensity={0.35}
      />

      {/* ── LAYER 4: 35mm Celluloid Sprocket Margin Strips ── */}
      {/* Left Margin 35mm Perforations */}
      <div className="hidden xl:block absolute left-3 top-8 bottom-8 w-4 overflow-hidden">
        <FilmSprockets orientation="vertical" count={28} opacity={0.16} />
      </div>

      {/* Right Margin 35mm Perforations */}
      <div className="hidden xl:block absolute right-3 top-8 bottom-8 w-4 overflow-hidden">
        <FilmSprockets orientation="vertical" count={28} opacity={0.16} />
      </div>

      {/* ── LAYER 5: Cinema Screen Perimeter Vignette ── */}
      <div
        style={{
          background:
            'radial-gradient(circle at center, transparent 45%, rgba(10, 14, 38, 0.55) 85%, rgba(10, 14, 38, 0.85) 100%)',
        }}
        className="absolute inset-0"
      />

      {/* ── LAYER 6: 35mm Celluloid Film Grain Texture ── */}
      <div
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.045'/%3E%3C/svg%3E")`,
        }}
        className="absolute inset-0 opacity-85 mix-blend-screen pointer-events-none"
      />
    </div>
  )
}
