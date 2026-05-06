import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Copy, Check, Terminal, Settings, MessageSquare, Smartphone, Wrench, Download } from 'lucide-react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const tabs = [
  { id: 'wsl', label: 'WSL2 Install', icon: Terminal },
  { id: 'config', label: 'Configurare', icon: Settings },
  { id: 'gateway', label: 'Gateway', icon: MessageSquare },
  { id: 'phone', label: 'Telefon', icon: Smartphone },
  { id: 'skills', label: 'Skill Builder', icon: Wrench },
]

const codeBlocks: Record<string, { title: string; code: string }> = {
  wsl: {
    title: 'Instalare Hermes Agent pe WSL2',
    code: `# PowerShell ca Administrator
wsl --install -d Ubuntu-22.04
# Repornește PC-ul

# În terminalul Ubuntu (WSL2)
curl -fsSL https://raw.githubusercontent.com/NousResearch/hermes-agent/main/scripts/install.sh | bash

# Verifică instalarea
hermes --version
# Output: hermes-agent v0.12.0`,
  },
  config: {
    title: 'Wizard de Configurare',
    code: `# Configurează modelul LLM
hermes setup

# Sau configurează manual
hermes model

# Opțiuni suportate:
# • Nous Portal (OAuth, gratuit)
# • OpenRouter (API key, 200+ modele)
# • Custom OpenAI-compatible endpoint
# • Local vLLM (dacă ai GPU puternic)`,
  },
  gateway: {
    title: 'Conectare Multi-Platform',
    code: `# Wizard de configurare gateway
hermes gateway setup

# Alege platformele:
# ✓ Telegram (cel mai ușor)
# ✓ WhatsApp (via Twilio)
# ✓ Discord / Slack / Signal

# Pornește gateway-ul
hermes gateway

# Instalează ca service (background)
hermes gateway install

# Vezi log-uri
hermes gateway logs --follow`,
  },
  phone: {
    title: 'Control de pe Telefon',
    code: `📱 Telegram → @BotFather → /newbot → token

💬 Apoi scrie lui Hermes:
/build_business_agents profile="neoterm_oltenia.json"

⚡ Comenzi disponibile:
/run_agent neoterm_hunter "Găsește 5 firme în Craiova"
/memory_search query="izolație celulozică"
/agents list

📊 Rezultatele vin înapoi în aceeași conversație`,
  },
  skills: {
    title: 'Skill-ul Build Business Agents',
    code: `🛠️ Descarcă skill-ul gata făcut:
  → build_business_agents.SKILL.md

📋 Ce face:
1. Citește profilul JSON din formularul de 9 pași
2. Generează 4-6 sub-agenți: Hunter, Writer, Closer, Support, Analyst
3. Salvează fișiere .AGENT.md în ~/.hermes/agents/{business_id}/
4. Înregistrează agenții în memoria Hermes

⚡ Comandă de utilizare:
/build_business_agents profile="nume_business.json"

🎯 Agenții generați automat:
• Hunter — Găsește și califică lead-uri
• Writer — Generează conținut pentru marketing
• Closer — Convertește lead-uri în clienți
• Support — Răspunde la întrebări clienți
• Analyst — Analizează metrici și oferă insight-uri`,
  },
}

export default function InstallSection() {
  const [activeTab, setActiveTab] = useState('wsl')
  const [copied, setCopied] = useState(false)
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.install-content',
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 70%',
            toggleActions: 'play none none none',
          },
        }
      )
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  const copyCode = () => {
    navigator.clipboard.writeText(codeBlocks[activeTab].code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <section
      id="install"
      ref={sectionRef}
      className="relative py-32 overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-500/5 to-transparent" />
      <div className="absolute top-1/2 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-[120px] -translate-y-1/2" />

      <div className="relative z-10 max-w-6xl mx-auto px-6 install-content">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-6">
            <Terminal className="w-4 h-4 text-cyan-400" />
            <span className="text-xs text-white/80 tracking-wide uppercase">Setup în 3 Minute</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="text-white">De la Zero la </span>
            <span className="text-gradient">Hermes</span>
          </h2>
          <p className="text-lg text-white/50 max-w-2xl mx-auto">
            Un singur script, patru pași, și ai un agent AI self-hosted care răspunde pe Telegram.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-medium transition-all ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-cyan-400/20 to-purple-500/20 text-white border border-cyan-400/30 glow-cyan'
                    : 'glass text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            )
          })}
        </div>

        {/* Code Block */}
        <div className="glass rounded-2xl overflow-hidden glow-cyan">
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-400/80" />
                <div className="w-3 h-3 rounded-full bg-amber-400/80" />
                <div className="w-3 h-3 rounded-full bg-emerald-400/80" />
              </div>
              <span className="text-sm text-white/60 ml-3">{codeBlocks[activeTab].title}</span>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={copyCode}
                className="text-white/60 hover:text-white hover:bg-white/10"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span className="ml-2">{copied ? 'Copiat!' : 'Copiază'}</span>
              </Button>
              {activeTab === 'skills' && (
                <a href="/build_business_agents.SKILL.md" download>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-cyan-400 hover:text-cyan-300 hover:bg-cyan-400/10"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Descarcă .SKILL.md
                  </Button>
                </a>
              )}
            </div>
          </div>
          <div className="p-6 overflow-x-auto">
            <pre className="text-sm text-white/80 font-mono leading-relaxed whitespace-pre">
              {codeBlocks[activeTab].code}
            </pre>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12">
          {[
            { value: '1', label: 'Script de Instalare' },
            { value: '4', label: 'Platforme Suportate' },
            { value: '∞', label: 'Sub-Agenți Posibili' },
            { value: '0', label: 'Telemetry' },
          ].map((stat) => (
            <div key={stat.label} className="glass rounded-xl p-4 text-center">
              <p className="text-2xl font-bold text-gradient">{stat.value}</p>
              <p className="text-xs text-white/50 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
