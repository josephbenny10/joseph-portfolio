import { useState } from 'react'
import CursorLightEffect from './components/CursorLightEffect'
import CustomCursor from './components/CustomCursor'
import Navbar from './components/Navbar'
import Hero from './sections/Hero'
import MarqueeTicker from './components/MarqueeTicker'
import Showreel from './sections/Showreel'
import SelectedWork from './sections/SelectedWork'
import About from './sections/About'
import Services from './sections/Services'
import Contact from './sections/Contact'
import ProjectModal from './components/ProjectModal'

export default function App() {
  const [activeProject, setActiveProject] = useState(null)

  return (
    <div className="min-h-screen bg-[#0F1432] text-[#F2F0E9] selection:bg-[#FF001E] selection:text-[#F2F0E9]">
      {/* Subtle Cursor Light Atmospheric Effect */}
      <CursorLightEffect />

      {/* Minimal Custom Cursor */}
      <CustomCursor />

      {/* Editorial Navigation */}
      <Navbar />

      {/* Main Content Flow */}
      <main>
        <Hero onSelectProject={(project) => setActiveProject(project)} />
        <MarqueeTicker />
        <Showreel />
        <SelectedWork onSelectProject={(project) => setActiveProject(project)} />
        <About />
        <Services />
        <Contact />
      </main>

      {/* Project Detail Modal Overlay */}
      {activeProject && (
        <ProjectModal
          project={activeProject}
          onClose={() => setActiveProject(null)}
          onSelectProject={setActiveProject}
        />
      )}
    </div>
  )
}
