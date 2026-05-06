import { useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { ArrowRight, Bot, Brain, Zap, MessageSquare } from 'lucide-react'
import gsap from 'gsap'

export default function Hero() {
  const heroRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const subtitleRef = useRef<HTMLParagraphElement>(null)
  const buttonsRef = useRef<HTMLDivElement>(null)
  const cardsRef = useRef<HTMLDivElement>(null)

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

  const floatingCards = [
    { icon: Brain, label: 'Învață', color: 'from-cyan-400/20 to-blue-500/20', delay: '0s' },
    { icon: MessageSquare, label: 'Conversează', color: 'from-purple-400/20 to-pink-500/20', delay: '1.5s' },
    { icon: Zap, label: 'Automatizează', color: 'from-amber-400/20 to-orange-500/20', delay: '3s' },
    { icon: Bot, label: 'Creează', color: 'from-emerald-400/20 to-teal-500/20', delay: '4.5s' },
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
            <span className="text-xs text-white/80 tracking-wide uppercase">AI Românesc Avansat</span>
          </div>

          <h1
            ref={titleRef}
            className="text-5xl md:text-7xl font-bold leading-tight mb-6"
          >
            <span className="text-white">Agentul Tău</span>
            <br />
            <span className="text-gradient">Antigravitațional</span>
          </h1>

          <p
            ref={subtitleRef}
            className="text-lg md:text-xl text-white/60 mb-8 max-w-xl mx-auto lg:mx-0 leading-relaxed"
          >
            Creează, antrenează și lansează agenți AI inteligenți care lucrează pentru tine
            24/7. Fără cod. Fără limite. Doar rezultate.
          </p>

          <div ref={buttonsRef} className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <Button
              size="lg"
              className="bg-gradient-to-r from-cyan-400 to-purple-500 text-white border-0 hover:opacity-90 text-lg px-8 py-6 glow-cyan group"
            >
              Începe Gratuit
              <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white/20 text-white hover:bg-white/10 text-lg px-8 py-6"
            >
              Vezi Demo
            </Button>
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
            <span>+2,500 utilizatori activi</span>
          </div>
        </div>

        <div ref={cardsRef} className="relative h-[500px] hidden lg:block">
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
                className={`hero-card absolute glass rounded-2xl p-5 w-44 animate-levitate glow-cyan`}
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
                <p className="text-white/40 text-xs mt-1">Agent AI activ</p>
              </div>
            )
          })}

          {/* Center floating element */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64">
            <div className="w-full h-full rounded-full bg-gradient-to-br from-cyan-500/20 via-purple-500/20 to-pink-500/20 blur-xl animate-pulse-glow" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-32 h-32 rounded-2xl glass flex items-center justify-center animate-float">
                <Bot className="w-16 h-16 text-cyan-400" />
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
