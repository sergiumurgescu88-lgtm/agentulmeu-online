import { useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { ArrowRight, Bot, Brain, Zap, MessageSquare, Phone, Server, BookOpen, ExternalLink } from 'lucide-react'
import gsap from 'gsap'

export default function Hero() {
  const heroRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const subtitleRef = useRef<HTMLParagraphElement>(null)
  const buttonsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })

      tl.fromTo(
        titleRef.current,
        { opacity: 0, y: 60 },
        { opacity: 1, y: 0, duration: 1.2 }
      )
      .fromTo(
        subtitleRef.current,
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 1 },
        '-=0.7'
      )
      .fromTo(
        buttonsRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8 },
        '-=0.5'
      )
      .fromTo(
        '.hero-card',
        { opacity: 0, y: 50, scale: 0.9 },
        { opacity: 1, y: 0, scale: 1, duration: 0.8, stagger: 0.15 },
        '-=0.4'
      )
    }, heroRef)

    return () => ctx.revert()
  }, [])

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  const floatingCards = [
    { icon: Phone, label: 'Telefon', sub: 'Telegram / WhatsApp', color: 'from-cyan-400/20 to-blue-500/20', delay: '0s' },
    { icon: Server, label: 'WSL2 Server', sub: 'Self-hosted', color: 'from-purple-400/20 to-pink-500/20', delay: '1.5s' },
    { icon: Brain, label: 'Memorie', sub: 'Persistentă', color: 'from-amber-400/20 to-orange-500/20', delay: '3s' },
    { icon: Bot, label: 'Sub-Agenți', sub: 'Izolați & Specializați', color: 'from-emerald-400/20 to-teal-500/20', delay: '4.5s' },
  ]

  return (
    <section
      id="hero"
      ref={heroRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20"
    >
      {/* Background gradient orbs */}
      <div className="absolute top-20 left-10 w-96 h-96 bg-cyan-500/20 rounded-full blur-[120px] animate-float-slow" />
      <div className="absolute bottom-20 right-10 w-80 h-80 bg-purple-500/20 rounded-full blur-[100px] animate-float-slow" style={{ animationDelay: '2s' }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-pink-500/10 rounded-full blur-[150px] animate-pulse-glow" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-20 grid lg:grid-cols-2 gap-12 items-center">
        <div className="text-center lg:text-left">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-6">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-xs text-white/80 tracking-wide uppercase">Hermes Agent by Nous Research</span>
          </div>

          <h1
            ref={titleRef}
            className="text-5xl md:text-7xl font-bold leading-tight mb-6"
          >
            <span className="text-white">Un Singur Agent.</span>
            <br />
            <span className="text-gradient">Toate Business-urile.</span>
          </h1>

          <p
            ref={subtitleRef}
            className="text-lg md:text-xl text-white/60 mb-8 max-w-xl mx-auto lg:mx-0 leading-relaxed"
          >
            Hermes Agent rulează pe serverul tău (WSL2), se conectează la Telegram, WhatsApp, 
            Discord și Slack. Controlezi totul de pe telefon. Memorie persistentă, skill-uri automate, 
            sub-agenți izolați pentru fiecare business.
          </p>

          <div ref={buttonsRef} className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            {/* Primary CTA — scroll to Install section */}
            <Button
              size="lg"
              onClick={() => scrollToSection('install')}
              className="relative bg-gradient-to-r from-cyan-400 to-purple-500 text-white border-0 hover:opacity-90 text-lg px-8 py-6 glow-cyan group overflow-hidden"
            >
              <span className="relative z-10 flex items-center">
                <ArrowRight className="mr-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
                Instalează Hermes
              </span>
            </Button>

            {/* Secondary CTA — scroll to Flow section */}
            <Button
              size="lg"
              variant="outline"
              onClick={() => scrollToSection('flow')}
              className="border-white/20 text-white hover:bg-white/10 hover:border-white/40 text-lg px-8 py-6 group"
            >
              <BookOpen className="mr-2 w-5 h-5 text-cyan-400 group-hover:text-cyan-300 transition-colors" />
              Vezi Fluxul Complet
            </Button>
          </div>

          {/* Quick links row */}
          <div className="mt-6 flex flex-wrap gap-3 justify-center lg:justify-start">
            <button
              onClick={() => scrollToSection('features')}
              className="text-xs text-white/40 hover:text-cyan-400 transition-colors flex items-center gap-1"
            >
              <Zap className="w-3 h-3" />
              Funcționalități
            </button>
            <span className="text-white/20">|</span>
            <button
              onClick={() => scrollToSection('agents')}
              className="text-xs text-white/40 hover:text-purple-400 transition-colors flex items-center gap-1"
            >
              <Brain className="w-3 h-3" />
              Sub-Agenți
            </button>
            <span className="text-white/20">|</span>
            <a
              href="https://github.com/NousResearch"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-white/40 hover:text-pink-400 transition-colors flex items-center gap-1"
            >
              <ExternalLink className="w-3 h-3" />
              GitHub Nous Research
            </a>
          </div>

          <div className="mt-10 flex items-center gap-6 justify-center lg:justify-start text-white/40 text-sm">
            <div className="flex -space-x-2">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-400/30 to-purple-500/30 border-2 border-background flex items-center justify-center text-xs text-white/80"
                >
                  {String.fromCharCode(64 + i)}
                </div>
              ))}
            </div>
            <span>MIT License • Zero Telemetry • Self-Hosted</span>
          </div>
        </div>

        <div className="relative h-[500px] hidden lg:block">
          {floatingCards.map((card, index) => {
            const Icon = card.icon
            const positions = [
              { top: '5%', left: '10%' },
              { top: '15%', right: '5%' },
              { bottom: '20%', left: '5%' },
              { bottom: '10%', right: '15%' },
            ]
            return (
              <div
                key={card.label}
                className={`hero-card absolute glass rounded-2xl p-5 w-48 animate-levitate glow-cyan`}
                style={{
                  ...positions[index],
                  animationDelay: card.delay,
                  transformStyle: 'preserve-3d',
                }}
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center mb-3`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <p className="text-white font-medium text-sm">{card.label}</p>
                <p className="text-white/40 text-xs mt-1">{card.sub}</p>
              </div>
            )
          })}

          {/* Center floating element */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64">
            <div className="w-full h-full rounded-full bg-gradient-to-br from-cyan-500/20 via-purple-500/20 to-pink-500/20 blur-xl animate-pulse-glow" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-32 h-32 rounded-2xl glass flex items-center justify-center animate-float">
                <MessageSquare className="w-16 h-16 text-cyan-400" />
              </div>
            </div>
          </div>

          {/* Orbiting dots */}
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="absolute top-1/2 left-1/2 w-[200px] h-[200px]"
              style={{
                animation: `orbit ${15 + i * 5}s linear infinite`,
                animationDelay: `${i * 2}s`,
              }}
            >
              <div className="w-3 h-3 rounded-full bg-gradient-to-r from-cyan-400 to-purple-400" />
            </div>
          ))}
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  )
}
