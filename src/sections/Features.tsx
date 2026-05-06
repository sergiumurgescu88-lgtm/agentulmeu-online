import { useEffect, useRef } from 'react'
import {
  Brain,
  MessageSquare,
  Zap,
  Shield,
  Globe,
  Cpu,
  Workflow,
  BarChart3,
} from 'lucide-react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const features = [
  {
    icon: Brain,
    title: 'Inteligență Avansată',
    description: 'Agenți antrenați pe modele LLM de ultimă generație, capabili să înțeleagă context complex.',
    color: 'from-cyan-400 to-blue-500',
    glow: 'glow-cyan',
  },
  {
    icon: MessageSquare,
    title: 'Conversații Naturale',
    description: 'Comunică cu agenții tăi în română sau orice limbă. Răspunsuri fluide și contextuale.',
    color: 'from-purple-400 to-pink-500',
    glow: 'glow-purple',
  },
  {
    icon: Zap,
    title: 'Automatizare Rapidă',
    description: 'Configurează fluxuri de lucru automatizate care rulează fără intervenție umană.',
    color: 'from-amber-400 to-orange-500',
    glow: 'glow-pink',
  },
  {
    icon: Shield,
    title: 'Securitate Maximă',
    description: 'Datele tale sunt criptate end-to-end. Control total asupra informațiilor și agenților.',
    color: 'from-emerald-400 to-teal-500',
    glow: 'glow-cyan',
  },
  {
    icon: Globe,
    title: 'Integrări Multiple',
    description: 'Conectează agenții cu Slack, Discord, Email, WhatsApp și alte platforme.',
    color: 'from-indigo-400 to-violet-500',
    glow: 'glow-purple',
  },
  {
    icon: Cpu,
    title: 'Procesare Real-Time',
    description: 'Răspunsuri instantanee și procesare paralelă a multiplelor sarcini simultan.',
    color: 'from-rose-400 to-red-500',
    glow: 'glow-pink',
  },
  {
    icon: Workflow,
    title: 'Fluxuri Customizabile',
    description: 'Construiește fluxuri de lucru vizuale prin drag-and-drop, fără cod necesar.',
    color: 'from-sky-400 to-cyan-500',
    glow: 'glow-cyan',
  },
  {
    icon: BarChart3,
    title: 'Analize Detaliate',
    description: 'Dashboard complet cu metrici, performanță și îmbunătățiri continue ale agenților.',
    color: 'from-fuchsia-400 to-purple-500',
    glow: 'glow-purple',
  },
]

export default function Features() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const cardsRef = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    const ctx = gsap.context(() => {
      cardsRef.current.forEach((card, index) => {
        if (!card) return
        gsap.fromTo(
          card,
          { opacity: 0, y: 60, rotateX: 15 },
          {
            opacity: 1,
            y: 0,
            rotateX: 0,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: card,
              start: 'top 85%',
              toggleActions: 'play none none none',
            },
            delay: (index % 4) * 0.1,
          }
        )
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      id="features"
      ref={sectionRef}
      className="relative py-32 overflow-hidden"
    >
      {/* Background elements */}
      <div className="absolute top-0 left-1/4 w-72 h-72 bg-cyan-500/10 rounded-full blur-[100px]" />
      <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-purple-500/10 rounded-full blur-[100px]" />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-6">
            <Zap className="w-4 h-4 text-cyan-400" />
            <span className="text-xs text-white/80 tracking-wide uppercase">Superputeri AI</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="text-white">Funcționalități </span>
            <span className="text-gradient">Antigravitaționale</span>
          </h2>
          <p className="text-lg text-white/50 max-w-2xl mx-auto">
            Tot ce ai nevoie pentru a crea agenți AI puternici, într-o platformă intuitivă și elegantă.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <div
                key={feature.title}
                ref={(el) => { cardsRef.current[index] = el }}
                className={`group relative glass rounded-2xl p-6 hover:bg-white/10 transition-all duration-500 cursor-pointer ${feature.glow} hover:scale-105`}
                style={{ perspective: '1000px' }}
              >
                <div
                  className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}
                >
                  <Icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-sm text-white/50 leading-relaxed">{feature.description}</p>

                {/* Hover gradient overlay */}
                <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
