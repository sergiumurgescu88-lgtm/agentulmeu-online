import { useEffect, useRef } from 'react'
import { Shield, Lock, EyeOff, Database, FileCheck, Terminal } from 'lucide-react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const securityFeatures = [
  {
    icon: Database,
    title: 'Date Locale',
    desc: 'Totul în ~/.hermes/ — niciun cloud obligatoriu. Tu controlezi stocarea.',
  },
  {
    icon: EyeOff,
    title: 'Zero Telemetry',
    desc: 'Nu trimite date la Nous Research fără acordul tău explicit. 100% transparent.',
  },
  {
    icon: Lock,
    title: 'Sandboxing',
    desc: 'Rulează cod în Docker/SSH cu izolare completă. Fiecare agent în propriul container.',
  },
  {
    icon: Shield,
    title: 'Control Acces',
    desc: 'Fiecare platformă (Telegram, WhatsApp etc.) are token separat și permisiuni.',
  },
  {
    icon: FileCheck,
    title: 'Backup Ușor',
    desc: 'Copiază folderul ~/.hermes/ pe un drive extern. Recovery instant în câteva secunde.',
  },
  {
    icon: Terminal,
    title: 'MIT License',
    desc: 'Open source complet. Codul disponibil pe GitHub. Poți modifica totul.',
  },
]

export default function SecuritySection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const cardsRef = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    const ctx = gsap.context(() => {
      cardsRef.current.forEach((card, index) => {
        if (!card) return
        gsap.fromTo(
          card,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: card,
              start: 'top 85%',
              toggleActions: 'play none none none',
            },
            delay: index * 0.1,
          }
        )
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      id="security"
      ref={sectionRef}
      className="relative py-32 overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px]" />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-6">
            <Shield className="w-4 h-4 text-emerald-400" />
            <span className="text-xs text-white/80 tracking-wide uppercase">Securitate & Privacy</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="text-white">Datele Tale. </span>
            <span className="text-gradient">Serverul Tău.</span>
          </h2>
          <p className="text-lg text-white/50 max-w-2xl mx-auto">
            Zero compromisuri. Zero telemetry. Open source. Tu ești stăpânul datelor tale.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {securityFeatures.map((feature, index) => {
            const Icon = feature.icon
            return (
              <div
                key={feature.title}
                ref={(el) => { cardsRef.current[index] = el }}
                className="glass rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 group"
              >
                <div className="w-12 h-12 rounded-xl bg-emerald-400/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Icon className="w-6 h-6 text-emerald-400" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-sm text-white/50 leading-relaxed">{feature.desc}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
