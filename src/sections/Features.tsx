import { useEffect, useRef } from 'react'
import {
  Server,
  MessageSquare,
  Brain,
  Shield,
  Globe,
  Cpu,
  Workflow,
  Zap,
} from 'lucide-react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const features = [
  {
    icon: Server,
    title: 'Rulează pe WSL2',
    description: 'Hermes Agent se instalează pe Ubuntu în WSL2 (Windows). Self-hosted, datele rămân la tine.',
    color: 'from-cyan-400 to-blue-500',
    glow: 'glow-cyan',
  },
  {
    icon: Globe,
    title: 'Multi-Platform Gateway',
    description: 'Conectează-te prin Telegram, WhatsApp, Discord, Slack sau Signal. Controlezi totul de pe telefon.',
    color: 'from-purple-400 to-pink-500',
    glow: 'glow-purple',
  },
  {
    icon: Brain,
    title: 'Memorie Persistentă',
    description: 'Hermes învață și nu uită. Memorie pe termen lung pentru conversații, skill-uri și preferințe.',
    color: 'from-amber-400 to-orange-500',
    glow: 'glow-pink',
  },
  {
    icon: Workflow,
    title: 'Skill-uri Auto',
    description: 'Creează skill-uri automat din documente. Fiecare skill devine un modul reutilizabil pentru agenți.',
    color: 'from-emerald-400 to-teal-500',
    glow: 'glow-cyan',
  },
  {
    icon: Cpu,
    title: 'Sub-Agenți Izolați',
    description: 'Spawnează sub-agenți specializați pentru fiecare business/rol, cu reguli și memorie proprii.',
    color: 'from-indigo-400 to-violet-500',
    glow: 'glow-purple',
  },
  {
    icon: Zap,
    title: 'Setup în 2 Minute',
    description: 'Un singur script de instalare. Wizard interactiv pentru configurare. Gata de utilizare instant.',
    color: 'from-rose-400 to-red-500',
    glow: 'glow-pink',
  },
  {
    icon: MessageSquare,
    title: 'Comenzi prin Chat',
    description: 'Trimite comenzi direct din Telegram/WhatsApp: /build_agents, /run_agent, /memory_search.',
    color: 'from-sky-400 to-cyan-500',
    glow: 'glow-cyan',
  },
  {
    icon: Shield,
    title: 'Zero Telemetry',
    description: 'MIT License. Nu trimite date la Nous Research. Sandbox complet. Tu controlezi totul.',
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
            <span className="text-xs text-white/80 tracking-wide uppercase">Hermes Agent Platform</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="text-white">Superputeri </span>
            <span className="text-gradient">Reale</span>
          </h2>
          <p className="text-lg text-white/50 max-w-2xl mx-auto">
            Tot ce ai nevoie pentru a rula agenți AI pe serverul tău și a-i controla de pe telefon.
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
