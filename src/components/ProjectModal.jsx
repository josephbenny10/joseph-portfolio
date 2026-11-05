import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Film } from 'lucide-react'
import VideoPlayer from './VideoPlayer'
import { formatDuration } from '../utils/formatTime'

export default function ProjectModal({ project, onClose }) {
  const [duration, setDuration] = useState(null)

  useEffect(() => {
    setDuration(null)
  }, [project?.id, project?.videoUrl])

  useEffect(() => {
    if (!project) return

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKeyDown)
    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = originalOverflow || ''
    }
  }, [project, onClose])

  if (!project) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/90 backdrop-blur-md"
        />

        {/* Modal Content */}
        <motion.div
          initial={{ opacity: 0, scale: 0.97, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.97, y: 12 }}
          transition={{ duration: 0.22, ease: 'easeOut' }}
          className="relative z-10 w-full max-w-5xl bg-[#101013] border border-white/10 rounded-sm overflow-hidden shadow-2xl flex flex-col max-h-[92vh]"
        >
          {/* Top Bar with Title and Close Button */}
          <div className="px-6 py-4 border-b border-white/[0.08] flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-3">
              <span className="font-display font-medium text-white text-base sm:text-lg">
                {project.title}
              </span>
              <span className="text-zinc-600">/</span>
              <span className="text-xs text-zinc-400">
                {project.category}
                {project.year ? ` (${project.year})` : ''}
              </span>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 text-zinc-400 hover:text-white rounded-full hover:bg-white/10 transition-colors"
              aria-label="Close Project Detail"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Modal Body */}
          <div className="overflow-y-auto p-6 sm:p-8 space-y-6">
            {/* Video Player or Empty Placeholder Notice */}
            <div className="w-full rounded-[2px] overflow-hidden border border-white/[0.06] bg-[#0a0a0c]">
              {project.videoUrl ? (
                <VideoPlayer
                  key={project.id || project.videoUrl}
                  src={project.videoUrl}
                  poster={project.thumbnail}
                  title={project.title}
                  aspectRatio={project.aspectRatio || "16:9"}
                  autoPlay={true}
                  onDurationChange={setDuration}
                />
              ) : (
                <div className="aspect-[16/9] w-full flex flex-col items-center justify-center p-8 text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-white/[0.03] border border-white/10 flex items-center justify-center text-zinc-500">
                    <Film className="w-6 h-6 stroke-[1.5]" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-display text-base font-medium text-white">
                      Video file not yet assigned
                    </h3>
                    <p className="text-xs text-zinc-400 max-w-md font-mono leading-relaxed pt-1">
                      Place your video in <span className="text-zinc-200">public/assets/videos/</span> and set <span className="text-zinc-200">videoUrl: "/assets/videos/your-file.mp4"</span> in <span className="text-zinc-200">portfolioData.js</span>
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Project Details */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
              <div className="md:col-span-2 space-y-2">
                <h4 className="text-xs uppercase tracking-wider text-zinc-500 font-mono">
                  Overview
                </h4>
                <p className="text-zinc-300 text-sm sm:text-base leading-relaxed">
                  {project.description}
                </p>
              </div>

              <div className="space-y-4 border-l border-white/[0.08] md:pl-6 text-xs">
                <div>
                  <span className="text-zinc-500 block font-mono uppercase text-[10px] tracking-wider mb-1">
                    Editing Software
                  </span>
                  <span className="text-zinc-200 font-medium">
                    {project.software || "DaVinci Resolve"}
                  </span>
                </div>

                <div>
                  <span className="text-zinc-500 block font-mono uppercase text-[10px] tracking-wider mb-1">
                    Category
                  </span>
                  <span className="text-zinc-200 font-medium">
                    {project.category}
                  </span>
                </div>

                {duration && formatDuration(duration) ? (
                  <div>
                    <span className="text-zinc-500 block font-mono uppercase text-[10px] tracking-wider mb-1">
                      Duration
                    </span>
                    <span className="text-zinc-200 font-medium">
                      {formatDuration(duration)}
                    </span>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
