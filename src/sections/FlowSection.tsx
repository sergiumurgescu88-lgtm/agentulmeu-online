import { useEffect, useRef } from 'react'
import { ClipboardList, Server, MessageSquare, Brain, Users, Rocket, FileCode, ChevronRight } from 'lucide-react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const flowSteps = [
  {
    icon: ClipboardList,
    title: 'Formular 9 Pași',
    desc: 'Utilizatorul completează profilul business: nume, tip, clienți ideali, regiune, produse, voice.',
    color: 'bg-cyan-400/20 text-cyan-400',
    arrow: true,
  },
  {
    icon: FileCode,
    title: 'Profile JSON',
    desc: 'Sistemul generează un fișier business_profile.json cu toate datele structurate.',
    color: 'bg-purple-400/20 text-purple-400',
    arrow: true,
  },
  {
    icon: MessageSquare,
    title: 'Comandă Telegram',
    desc: 'Utilizatorul trimite: /activate_agents business=neoterm_oltenia',
    color: 'bg-pink-400/20 text-pink-400',
    arrow: true,
  },
  {
    icon: Server,
    title: 'Hermes Procesează',
    desc: 'Rulează skill-ul build_business_agents și citește profile.json',
    color: 'bg-amber-400/20 text-amber-400',
    arrow: true,
  },
  {
    icon: FileCode,
    title: 'Generează .AGENT.md',
    desc: 'Creează fișierele de configurare pentru fiecare sub-agent (hunter, writer, closer...)',
    color: 'bg-emerald-400/20 text-emerald-400',
    arrow: true,
  },
  {
    icon: Brain,
    title: 'Memorie & Reguli',
    desc: 'Fiecare agent primește memorie persistentă, reguli de escaladare și exemple de interacțiuni.',
    color: 'bg-sky-400/20 text-sky-400',
    arrow: true,
  },
  {
    icon: Users,
    title: 'Sub-Agenți Activi',
    desc: 'Echipa completă: Hunter, Writer, Closer, Support, Analyst — gata de acțiune.',
    color: 'bg-indigo-400/20 text-indigo-400',
    arrow: true,
  },
  {
    icon: Rocket,
    title: 'Rezultate pe Telefon',
    desc: 'Rezultatele ajung înapoi în Telegram/WhatsApp. Monitorizezi totul de pe telefon.',
    color: 'bg-rose-400/20 text-rose-400',
    arrow: false,
  },
]

export default function FlowSection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const stepsRef = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    const ctx = gsap.context(() => {
      stepsRef.current.forEach((step, index) => {
        if (!step) return
        gsap.fromTo(
          step,
          { opacity: 0, y: 30, scale: 0.95 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.6,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: step,
              start: 'top 90%',
              toggleActions: 'play none none none',
            },
            delay: index * 0.08,
          }
        )
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      id="flow"
      ref={sectionRef}
      className="relative py-32 overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-500/5 to-transparent" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-cyan-500/5 rounded-full blur-[150px]" />

      <div className="relative z-10 max-w-5xl mx-auto px-6">
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-6">
            <Rocket className="w-4 h-4 text-cyan-400" />
            <span className="text-xs text-white/80 tracking-wide uppercase">Flux Complet</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="text-white">De la Idee la </span>
            <span className="text-gradient">Echipă AI</span>
          </h2>
          <p className="text-lg text-white/50 max-w-2xl mx-auto">
            8 pași. Zero cod. Doar un formular și o comandă pe Telegram.
          </p>
        </div>

        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-8 md:left-12 top-0 bottom-0 w-0.5 bg-gradient-to-b from-cyan-400/50 via-purple-400/50 to-pink-400/50 hidden md:block" />

          <div className="space-y-6">
            {flowSteps.map((step, index) => {
              const Icon = step.icon
              return (
                <div
                  key={step.title}
                  ref={(el) => { stepsRef.current[index] = el }}
                  className="relative flex items-start gap-4 md:gap-6 group"
                >
                  {/* Timeline dot */}
                  <div className="relative z-10 shrink-0 hidden md:block">
                    <div className={`w-12 h-12 rounded-xl ${step.color} flex items-center justify-center border border-white/10 group-hover:scale-110 transition-transform`}>
                      <Icon className="w-6 h-6" />
                    </div>
                  </div>

                  {/* Card */}
                  <div className="flex-1 glass rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 group-hover:-translate-y-0.5">
                    <div className="flex items-center gap-3 mb-2">
                      <div className={`w-8 h-8 rounded-lg ${step.color} flex items-center justify-center md:hidden`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <h3 className="text-lg font-semibold text-white">{step.title}</h3>
                      {step.arrow && (
                        <ChevronRight className="w-5 h-5 text-white/20 hidden md:block group-hover:text-cyan-400/60 transition-colors" />
                      )}
                    </div>
                    <p className="text-sm text-white/50 leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
