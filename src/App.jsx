import { useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import CinematicBackground from './components/CinematicBackground'
import CinematicEntrance from './components/CinematicEntrance'
import CustomCursor from './components/CustomCursor'
import Navbar from './components/Navbar'
import BackToTop from './components/BackToTop'
import Hero from './sections/Hero'
import MarqueeTicker from './components/MarqueeTicker'
import SelectedWork from './sections/SelectedWork'
import About from './sections/About'
import Services from './sections/Services'
import Contact from './sections/Contact'
import ProjectModal from './components/ProjectModal'

export default function App() {
  const [activeProject, setActiveProject] = useState(null)

  return (
    <div className="min-h-screen bg-[#0F1432] text-[#F2F0E9] selection:bg-[#FF001E] selection:text-[#F2F0E9] relative">
      {/* Unified Multi-Layered 3D Cinematic Background Environment */}
      <CinematicBackground />

      {/* Full-Screen Cinematic SEPH Title Sequence */}
      <CinematicEntrance />

      {/* Minimal Custom Cursor */}
      <CustomCursor />

      {/* Back to Top Floating Button */}
      <BackToTop />

      {/* Editorial Navigation */}
      <Navbar />

      {/* Main Content Flow — fully ready and rendered underneath */}
      <main className="relative z-10 overflow-x-hidden">
        <Hero onSelectProject={(project) => setActiveProject(project)} />
        <MarqueeTicker />
        <SelectedWork onSelectProject={(project) => setActiveProject(project)} />
        <About />
        <Services />
        <Contact />
      </main>

      {/* Project Detail Modal Overlay */}
      <AnimatePresence>
        {activeProject && (
          <ProjectModal
            project={activeProject}
            onClose={() => setActiveProject(null)}
            onSelectProject={setActiveProject}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
