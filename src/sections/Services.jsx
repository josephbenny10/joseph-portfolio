import { services, profile } from '../data/portfolioData'
import { ArrowUpRight } from 'lucide-react'

export default function Services() {
  return (
    <section id="services" className="py-24 sm:py-32 px-5 sm:px-8 md:px-10 lg:px-14 xl:px-16 w-full max-w-[1720px] 2xl:max-w-[1880px] mx-auto border-t border-[#F2F0E9]/12">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-16">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-[#F2F0E9]/60 block mb-2 font-medium">
            04 / What I Offer
          </span>
          <h2 className="font-display text-4xl sm:text-6xl font-black tracking-tight text-[#F2F0E9] uppercase">
            Editing Services
          </h2>
        </div>

        <p className="text-[#F2F0E9]/80 text-sm sm:text-base max-w-lg leading-relaxed">
          Simple, honest editing services for creators, channels, and independent film projects. {profile.availability}.
        </p>
      </div>

      {/* Services List with Spacious Hairline Dividers */}
      <div className="divide-y divide-[#F2F0E9]/12 border-y border-[#F2F0E9]/12">
        {services.map((service) => (
          <div
            key={service.number}
            className="py-10 sm:py-12 grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-8 xl:gap-12 items-start group hover:bg-[#13193D]/60 px-4 sm:px-6 -mx-4 sm:-mx-6 transition-colors rounded-sm"
          >
            <div className="md:col-span-2 font-mono text-xs sm:text-sm text-[#F2F0E9]/50 pt-1 group-hover:text-[#FFAA00] transition-colors">
              {service.number}
            </div>

            <div className="md:col-span-4">
              <h3 className="font-display font-bold text-2xl sm:text-3xl text-[#F2F0E9] group-hover:text-[#FFAA00] transition-colors tracking-tight">
                {service.title}
              </h3>
            </div>

            <div className="md:col-span-6">
              <p className="text-[#F2F0E9]/80 text-base sm:text-lg leading-relaxed max-w-2xl">
                {service.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Contact CTA Banner */}
      <div className="mt-14 p-8 sm:p-10 rounded-sm bg-[#13193D] border border-[#F2F0E9]/15 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="max-w-2xl">
          <h4 className="text-base sm:text-lg font-bold text-[#F2F0E9]">
            Have a project in mind?
          </h4>
          <p className="text-sm text-[#F2F0E9]/80 mt-1 leading-relaxed">
            Let's make something worth watching.
          </p>
        </div>

        <a
          href="#contact"
          className="group/btn inline-flex items-center gap-2 px-6 py-3 rounded-[2px] bg-[#FF001E] text-[#F2F0E9] font-bold text-xs uppercase tracking-wider font-mono hover:bg-[#d9001a] transition-colors shrink-0 shadow-sm"
        >
          <span>GET IN TOUCH</span>
          <ArrowUpRight className="w-4 h-4 text-[#F2F0E9] group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
        </a>
      </div>
    </section>
  )
}
