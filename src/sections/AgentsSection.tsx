import { useEffect, useRef } from 'react'
import { Brain, Target, PenTool, Handshake, HeadphonesIcon, BarChart3, ArrowRight } from 'lucide-react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const agents = [
  {
    icon: Target,
    name: 'Hunter',
    role: 'Lead Hunter Specialist',
    desc: 'Identifică și califică prospecți pentru business-ul tău. Caută grupuri, răspunde la postări, colectează contacte.',
    color: 'from-cyan-400 to-blue-500',
    tasks: ['Caută grupuri relevante', 'Răspunde cu valoare', 'Califică lead-uri', 'Trimite către Closer'],
  },
  {
    icon: PenTool,
    name: 'Writer',
    role: 'Content Creator',
    desc: 'Generează conținut pentru blog, social media, email-uri. Adaptat la vocea brandului tău.',
    color: 'from-purple-400 to-pink-500',
    tasks: ['Articole blog', 'Postări social', 'Email copy', 'Descrieri produse'],
  },
  {
    icon: Handshake,
    name: 'Closer',
    role: 'Sales Closer',
    desc: 'Preia lead-urile calificate de Hunter și le convertește în clienți. Gestionează obiecțiile și închide vânzări.',
    color: 'from-amber-400 to-orange-500',
    tasks: ['Preia lead-uri calificate', 'Gestionează obiecții', 'Trimite oferte', 'Urmărește conversia'],
  },
  {
    icon: HeadphonesIcon,
    name: 'Support',
    role: 'Customer Support',
    desc: 'Răspunde la întrebări clienți, rezolvă probleme și escaladează cazurile complexe către uman.',
    color: 'from-emerald-400 to-teal-500',
    tasks: ['Răspunde FAQ', 'Rezolvă probleme', 'Escaladează complexe', 'Colectează feedback'],
  },
  {
    icon: BarChart3,
    name: 'Analyst',
    role: 'Data Analyst',
    desc: 'Analizează metrici, generează rapoarte și oferă insight-uri pentru îmbunătățirea performanței.',
    color: 'from-fuchsia-400 to-purple-500',
    tasks: ['Rapoarte săptămânale', 'Analiză competiție', 'Trenduri piață', 'Recomandări acțiuni'],
  },
]

export default function AgentsSection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const cardsRef = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    const ctx = gsap.context(() => {
      cardsRef.current.forEach((card, index) => {
        if (!card) return
        gsap.fromTo(
          card,
          { opacity: 0, x: index % 2 === 0 ? -40 : 40 },
          {
            opacity: 1,
            x: 0,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: card,
              start: 'top 85%',
              toggleActions: 'play none none none',
            },
          }
        )
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      id="agents"
      ref={sectionRef}
      className="relative py-32 overflow-hidden"
    >
      <div className="absolute top-0 left-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-[120px]" />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-6">
            <Brain className="w-4 h-4 text-purple-400" />
            <span className="text-xs text-white/80 tracking-wide uppercase">Echipa Ta de Sub-Agenți</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="text-white">Un Agent. </span>
            <span className="text-gradient">O Echipă.</span>
          </h2>
          <p className="text-lg text-white/50 max-w-2xl mx-auto">
            Hermes spawnează sub-agenți izolați pentru fiecare rol. Fiecare cu instrucțiuni, memorie și reguli proprii.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {agents.map((agent, index) => {
            const Icon = agent.icon
            return (
              <div
                key={agent.name}
                ref={(el) => { cardsRef.current[index] = el }}
                className="group relative glass rounded-2xl p-6 hover:bg-white/10 transition-all duration-500 hover:-translate-y-1"
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${agent.color} flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform`}>
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">{agent.name}</h3>
                    <p className="text-xs text-white/40 uppercase tracking-wider">{agent.role}</p>
                  </div>
                </div>
                <p className="text-sm text-white/50 mb-4 leading-relaxed">{agent.desc}</p>
                <ul className="space-y-2">
                  {agent.tasks.map((task) => (
                    <li key={task} className="flex items-center gap-2 text-xs text-white/40">
                      <ArrowRight className="w-3 h-3 text-cyan-400/60" />
                      {task}
                    </li>
                  ))}
                </ul>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
