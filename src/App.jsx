import { useState } from 'react'
import CustomCursor from './components/CustomCursor'
import Navbar from './components/Navbar'
import Hero from './sections/Hero'
import Showreel from './sections/Showreel'
import SelectedWork from './sections/SelectedWork'
import About from './sections/About'
import Services from './sections/Services'
import Contact from './sections/Contact'
import ProjectModal from './components/ProjectModal'

export default function App() {
  const [activeProject, setActiveProject] = useState(null)

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#f4f4f5] selection:bg-[#dc2626] selection:text-white">
      {/* Minimal Custom Cursor */}
      <CustomCursor />

      {/* Editorial Navigation */}
      <Navbar />

      {/* Main Content Flow */}
      <main>
        <Hero />
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
        />
      )}
    </div>
  )
}
