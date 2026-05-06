import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router'
import {
  Bot, Search, PenTool, Handshake, HeadphonesIcon, BarChart3, Globe, Sparkles,
  ChevronRight, Zap, ArrowRight, MessageSquare, Brain, Terminal, Shield, Activity
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const agents = [
  {
    id: 'hunter',
    name: 'Hunter',
    role: 'Lead Generator',
    icon: Search,
    description: 'Identifică și califică prospecți relevanți pentru business-ul tău. Caută în grupuri, forumuri și rețele sociale.',
    color: 'from-cyan-400 to-blue-500',
    features: ['Grupuri & Forumuri', 'Calificare Lead-uri', 'Colectare Contacte', 'Scor Autoritate'],
    skills: ['web_search', 'data_extraction', 'message_composition'],
  },
  {
    id: 'writer',
    name: 'Writer',
    role: 'Content Creator',
    icon: PenTool,
    description: 'Generează conținut persuasiv adaptat brandului tău. Blog, social media, email copy și landing pages.',
    color: 'from-purple-400 to-pink-500',
    features: ['Blog Posts', 'Social Media', 'Email Copy', 'SEO Optimized'],
    skills: ['text_generation', 'style_adaptation', 'ab_testing'],
  },
  {
    id: 'closer',
    name: 'Closer',
    role: 'Sales Closer',
    icon: Handshake,
    description: 'Transformă lead-urile calificate în clienți plătitori. Gestionare obiecții, oferte personalizate, follow-up.',
    color: 'from-amber-400 to-orange-500',
    features: ['Feel-Felt-Found', 'Oferte Personalizate', 'CRM Integration', 'Pipeline Tracking'],
    skills: ['negotiation', 'objection_handling', 'proposal_generation'],
  },
  {
    id: 'support',
    name: 'Support',
    role: 'Customer Support',
    icon: HeadphonesIcon,
    description: 'Răspunde rapid și empatic la întrebări clienți. FAQ auto, escaladare inteligentă, feedback collection.',
    color: 'from-emerald-400 to-teal-500',
    features: ['<5min Response', 'FAQ Auto', 'Escaladare Inteligentă', 'Feedback Loop'],
    skills: ['intent_recognition', 'knowledge_base', 'sentiment_analysis'],
  },
  {
    id: 'analyst',
    name: 'Analyst',
    role: 'Data Analyst',
    icon: BarChart3,
    description: 'Oferă insights acționabile din datele business-ului. Trenduri, anomalii, experimente A/B.',
    color: 'from-fuchsia-400 to-purple-500',
    features: ['Rapoarte Săptămânale', 'Trend Detection', 'A/B Testing', 'Recomandări Acționabile'],
    skills: ['data_aggregation', 'anomaly_detection', 'experiment_design'],
  },
  {
    id: 'scout',
    name: 'Scout',
    role: 'Market Intel',
    icon: Globe,
    description: 'Monitorizează competitorii și oportunitățile de piață. Prețuri, promoții, lansări, parteneriate.',
    color: 'from-sky-400 to-cyan-500',
    features: ['Track Competitori', 'Alerte Preț', 'Oportunități Parteneriate', 'Poziționare Piață'],
    skills: ['market_research', 'price_tracking', 'opportunity_identification'],
  },
]

export default function AgentsList() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const cardsRef = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    const ctx = gsap.context(() => {
      cardsRef.current.forEach((card, index) => {
        if (!card) return
        gsap.fromTo(
          card,
          { opacity: 0, y: 50 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: card,
              start: 'top 85%',
            },
            delay: (index % 3) * 0.1,
          }
        )
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <div className="min-h-screen bg-background text-foreground pt-24 pb-12">
      {/* Background */}
      <div className="fixed top-20 left-10 w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="fixed bottom-20 right-10 w-80 h-80 bg-purple-500/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-6">
            <Bot className="w-4 h-4 text-cyan-400" />
            <span className="text-xs text-white/80 tracking-wide uppercase">Hermes Agent Ecosystem</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="text-white">Agenții </span>
            <span className="text-gradient">Hermes</span>
          </h1>
          <p className="text-lg text-white/50 max-w-2xl mx-auto">
            6 sub-agenți specializați, fiecare cu rol, memorie și capabilități proprii.
            Combină-i pentru a-ți construi echipa AI perfectă.
          </p>
          <div className="mt-8 flex gap-4 justify-center">
            <Link to="/create-agent">
              <Button className="bg-gradient-to-r from-cyan-400 to-purple-500 text-white border-0 hover:opacity-90 glow-cyan">
                <Sparkles className="w-4 h-4 mr-2" />
                Crează Agent Nou
              </Button>
            </Link>
            <Link to="/dashboard">
              <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
                <BarChart3 className="w-4 h-4 mr-2" />
                Dashboard Complet
              </Button>
            </Link>
          </div>
        </div>

        {/* Agent Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {agents.map((agent, index) => {
            const Icon = agent.icon
            return (
              <div
                key={agent.id}
                ref={(el) => { cardsRef.current[index] = el }}
                className="group relative glass rounded-2xl p-6 hover:bg-white/10 transition-all duration-500 hover:-translate-y-1"
              >
                {/* Icon */}
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${agent.color} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform`}>
                  <Icon className="w-7 h-7 text-white" />
                </div>

                {/* Name & Role */}
                <h3 className="text-xl font-bold text-white mb-1">{agent.name}</h3>
                <p className="text-xs text-white/40 uppercase tracking-wider mb-4">{agent.role}</p>
                <p className="text-sm text-white/50 mb-5 leading-relaxed">{agent.description}</p>

                {/* Features */}
                <div className="flex flex-wrap gap-2 mb-5">
                  {agent.features.map(f => (
                    <span key={f} className="text-xs glass px-2 py-1 rounded text-white/60">{f}</span>
                  ))}
                </div>

                {/* Skills */}
                <div className="border-t border-white/10 pt-4">
                  <p className="text-xs text-white/30 mb-2 uppercase tracking-wider">Skills</p>
                  <div className="flex flex-wrap gap-2">
                    {agent.skills.map(skill => (
                      <span key={skill} className="text-xs bg-white/5 px-2 py-1 rounded text-cyan-400/80">{skill}</span>
                    ))}
                  </div>
                </div>

                {/* Hover glow */}
                <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${agent.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
              </div>
            )
          })}
        </div>

        {/* Capabilities Grid */}
        <div className="glass rounded-2xl p-8 mb-12">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">
            <span className="text-gradient">Capabilități Comune</span> pentru Toți Agenții
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: MessageSquare, title: 'Multi-Platform', desc: 'Telegram, Discord, Slack, WhatsApp, Email' },
              { icon: Brain, title: 'Memorie Persistentă', desc: 'Nu uită niciodată ce a învățat despre proiectele tale' },
              { icon: Terminal, title: 'Sandboxing Real', desc: 'Docker, SSH, local — izolare completă' },
              { icon: Shield, title: 'Zero Telemetry', desc: 'Datele tale rămân pe serverul tău' },
              { icon: Zap, title: 'Auto-Skills', desc: 'Generează automat skill-uri din experiență' },
              { icon: Activity, title: 'Sub-Agenți Izolați', desc: 'Fiecare agent are propria conversație și memorie' },
              { icon: Sparkles, title: 'Web & Browser', desc: 'Web search, automation, vision, image generation' },
              { icon: ChevronRight, title: 'Delegare Paralelă', desc: 'Task-uri distribuite simultan' },
            ].map(cap => {
              const Icon = cap.icon
              return (
                <div key={cap.title} className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center shrink-0">
                    <Icon className="w-5 h-5 text-cyan-400" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-white">{cap.title}</h4>
                    <p className="text-xs text-white/40">{cap.desc}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Gata să începi?</h2>
          <p className="text-white/50 mb-6 max-w-lg mx-auto">
            Creează primul tău agent în 9 pași simpli sau configurează unul existent.
          </p>
          <div className="flex gap-4 justify-center">
            <Link to="/create-agent">
              <Button size="lg" className="bg-gradient-to-r from-cyan-400 to-purple-500 text-white border-0 glow-cyan">
                <Sparkles className="w-5 h-5 mr-2" />
                Crează Agent Nou
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
