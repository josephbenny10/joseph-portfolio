import { services, profile } from '../data/portfolioData'
import { ArrowUpRight } from 'lucide-react'

export default function Services() {
  return (
    <section id="services" className="py-24 sm:py-32 px-6 sm:px-8 max-w-7xl mx-auto border-t border-white/[0.06]">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-16">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-zinc-500 block mb-2">
            04 / What I Offer
          </span>
          <h2 className="font-display text-3xl sm:text-5xl font-bold tracking-tight text-white">
            Editing Services
          </h2>
        </div>

        <p className="text-zinc-400 text-sm max-w-md">
          Simple, honest editing services for creators, channels, and independent film projects. {profile.availability}.
        </p>
      </div>

      {/* Services List with Subtle Hairline Dividers */}
      <div className="divide-y divide-white/[0.08] border-y border-white/[0.08]">
        {services.map((service) => (
          <div
            key={service.number}
            className="py-8 sm:py-10 grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-8 items-start group hover:bg-white/[0.015] px-2 sm:px-4 -mx-2 sm:-mx-4 transition-colors rounded-sm"
          >
            <div className="md:col-span-2 font-mono text-xs text-zinc-500 pt-1 group-hover:text-[#dc2626] transition-colors">
              {service.number}
            </div>

            <div className="md:col-span-5">
              <h3 className="font-display font-semibold text-xl sm:text-2xl text-white group-hover:text-zinc-200 transition-colors">
                {service.title}
              </h3>
            </div>

            <div className="md:col-span-5">
              <p className="text-zinc-400 text-sm sm:text-base leading-relaxed">
                {service.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Availability Banner */}
      <div className="mt-12 p-6 rounded-sm bg-white/[0.02] border border-white/[0.08] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h4 className="text-sm font-semibold text-white">
            {profile.availability}
          </h4>
          <p className="text-xs text-zinc-400 mt-1">
            Need an edit for your film scene, an Instagram reel, or a video project? Let's discuss your timeline.
          </p>
        </div>

        <a
          href="#contact"
          className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-white hover:text-[#dc2626] transition-colors self-start sm:self-center"
        >
          <span>Get in touch</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </a>
      </div>
    </section>
  )
}
