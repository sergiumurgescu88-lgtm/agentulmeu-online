import { useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { ArrowRight, Download, Settings, MessageSquare, Rocket, Terminal } from 'lucide-react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const steps = [
  {
    number: '01',
    icon: Download,
    title: 'Instalează pe WSL2',
    description: 'Un singur curl script pe Ubuntu. Hermes Agent este gata în 60 de secunde.',
    color: 'cyan',
  },
  {
    number: '02',
    icon: Settings,
    title: 'Configurează Modelul',
    description: 'Alege Nous Portal (gratuit), OpenRouter sau rulează local cu vLLM.',
    color: 'purple',
  },
  {
    number: '03',
    icon: MessageSquare,
    title: 'Conectează Telefonul',
    description: 'Setup gateway pentru Telegram/WhatsApp. Primești token-ul și gata.',
    color: 'pink',
  },
  {
    number: '04',
    icon: Rocket,
    title: 'Lansează Sub-Agenți',
    description: 'Trimite comanda /build_agents din chat și echipa AI e gata de lucru.',
    color: 'cyan',
  },
]

export default function HowItWorks() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const stepsRef = useRef<(HTMLDivElement | null)[]>([])
  const lineRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (lineRef.current) {
        gsap.fromTo(
          lineRef.current,
          { scaleX: 0 },
          {
            scaleX: 1,
            duration: 1.5,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 60%',
              toggleActions: 'play none none none',
            },
          }
        )
      }

      stepsRef.current.forEach((step, index) => {
        if (!step) return
        gsap.fromTo(
          step,
          { opacity: 0, y: 50 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: step,
              start: 'top 80%',
              toggleActions: 'play none none none',
            },
            delay: index * 0.15,
          }
        )
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      id="how-it-works"
      ref={sectionRef}
      className="relative py-32 overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-500/5 to-transparent" />
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px] -translate-y-1/2" />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-6">
            <Rocket className="w-4 h-4 text-purple-400" />
            <span className="text-xs text-white/80 tracking-wide uppercase">Start în 4 Pași</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="text-white">Cât de </span>
            <span className="text-gradient">Ușor?</span>
          </h2>
          <p className="text-lg text-white/50 max-w-2xl mx-auto">
            Fără cod. Fără complicații. Patru pași simpli și ai o echipă AI pe serverul tău.
          </p>
        </div>

        <div className="relative">
          <div
            ref={lineRef}
            className="hidden lg:block absolute top-24 left-[12.5%] right-[12.5%] h-0.5 bg-gradient-to-r from-cyan-400/50 via-purple-400/50 to-pink-400/50 origin-left"
          />

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => {
              const Icon = step.icon
              const isCyan = step.color === 'cyan'
              const isPurple = step.color === 'purple'
              const colorClass = isCyan
                ? 'bg-cyan-400/20 text-cyan-400'
                : isPurple
                ? 'bg-purple-400/20 text-purple-400'
                : 'bg-pink-400/20 text-pink-400'

              const iconBgClass = isCyan
                ? 'bg-gradient-to-br from-cyan-400/30 to-blue-500/30'
                : isPurple
                ? 'bg-gradient-to-br from-purple-400/30 to-violet-500/30'
                : 'bg-gradient-to-br from-pink-400/30 to-rose-500/30'

              const orbColor = isCyan ? 'bg-cyan-400' : isPurple ? 'bg-purple-400' : 'bg-pink-400'

              return (
                <div
                  key={step.number}
                  ref={(el) => { stepsRef.current[index] = el }}
                  className="relative group"
                >
                  <div className="glass rounded-2xl p-8 text-center hover:bg-white/10 transition-all duration-500 hover:-translate-y-2">
                    <div
                      className={`inline-flex items-center justify-center w-12 h-12 rounded-xl mb-6 ${colorClass}`}
                    >
                      <span className="text-lg font-bold">{step.number}</span>
                    </div>

                    <div
                      className={`w-16 h-16 rounded-2xl mx-auto mb-5 flex items-center justify-center ${iconBgClass}`}
                    >
                      <Icon className="w-8 h-8 text-white" />
                    </div>

                    <h3 className="text-xl font-semibold text-white mb-3">{step.title}</h3>
                    <p className="text-sm text-white/50 leading-relaxed">{step.description}</p>
                  </div>

                  <div
                    className={`absolute -top-3 -right-3 w-6 h-6 rounded-full ${orbColor} opacity-60 animate-pulse-glow hidden lg:block`}
                    style={{ animationDelay: `${index * 0.5}s` }}
                  />
                </div>
              )
            })}
          </div>
        </div>

        <div className="mt-20 text-center">
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              size="lg"
              onClick={() => {
                const el = document.getElementById('install')
                if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
              }}
              className="bg-gradient-to-r from-cyan-400 to-purple-500 text-white border-0 hover:opacity-90 text-lg px-10 py-6 glow-cyan group"
            >
              <ArrowRight className="mr-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
              Instalează Hermes Acum
            </Button>
            <Button
              size="lg"
              variant="ghost"
              onClick={() => {
                const el = document.getElementById('install')
                if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
              }}
              className="text-white/60 hover:text-white hover:bg-white/10 text-lg px-8 py-6"
            >
              <Terminal className="mr-2 w-5 h-5" />
              Vezi Codul de Instalare
            </Button>
          </div>
          <p className="mt-4 text-sm text-white/40">MIT License • Self-hosted • Gratuit pentru totdeauna</p>
        </div>
      </div>
    </section>
  )
}
