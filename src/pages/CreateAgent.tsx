import { useState } from 'react'
import { useNavigate } from 'react-router'
import { Button } from '@/components/ui/button'
import {
  ArrowLeft, Sparkles, Bot, Zap, Brain, MessageSquare, Target, Shield,
  Check, ChevronRight, Globe, PenTool, Handshake, HeadphonesIcon, BarChart3
} from 'lucide-react'

const AGENT_TYPES = [
  { id: 'hunter', name: 'Hunter', role: 'Lead Generator', icon: Target, color: 'from-cyan-400 to-blue-500', desc: 'Găsește și califică prospecți' },
  { id: 'writer', name: 'Writer', role: 'Content Creator', icon: PenTool, color: 'from-purple-400 to-pink-500', desc: 'Generează conținut marketing' },
  { id: 'closer', name: 'Closer', role: 'Sales Closer', icon: Handshake, color: 'from-amber-400 to-orange-500', desc: 'Convertește lead-uri în vânzări' },
  { id: 'support', name: 'Support', role: 'Customer Support', icon: HeadphonesIcon, color: 'from-emerald-400 to-teal-500', desc: 'Răspunde la întrebări clienți' },
  { id: 'analyst', name: 'Analyst', role: 'Data Analyst', icon: BarChart3, color: 'from-fuchsia-400 to-purple-500', desc: 'Analizează metrici și trenduri' },
  { id: 'scout', name: 'Scout', role: 'Market Intel', icon: Globe, color: 'from-sky-400 to-cyan-500', desc: 'Monitorizează competitori' },
]

const AUTONOMY_LEVELS = [
  { id: 'approve-only', label: '🛡️ Aprobare Manuală', desc: 'Fiecare acțiune necesită confirmare umană' },
  { id: 'semi-autonom', label: '⚡ Semi-Autonom', desc: 'Acțiuni standard automate, escaladare la uman' },
  { id: 'full-autonom', label: '🤖 Full Autonom', desc: 'Rulează independent cu verificare periodică' },
]

export default function CreateAgent() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [saving, setSaving] = useState(false)

  // Form state
  const [agentType, setAgentType] = useState('')
  const [name, setName] = useState('')
  const [businessName, setBusinessName] = useState('')
  const [description, setDescription] = useState('')
  const [region, setRegion] = useState('')
  const [idealClient, setIdealClient] = useState('')
  const [usp, setUsp] = useState('')
  const [voice, setVoice] = useState('')
  const [autonomy, setAutonomy] = useState('semi-autonom')
  const [redLines, setRedLines] = useState('')
  const [channels, setChannels] = useState<string[]>([])

  const toggleChannel = (ch: string) => {
    setChannels(prev => prev.includes(ch) ? prev.filter(c => c !== ch) : [...prev, ch])
  }

  const saveAgent = async () => {
    setSaving(true)
    try {
      const profile = {
        business: {
          business_id: businessName.toLowerCase().replace(/\s+/g, '_'),
          name: businessName,
          type: [agentType],
          description,
          products: '',
          ideal_client: idealClient,
          region,
          website: '',
        },
        agents_needed: [agentType],
        personality: {
          voice: voice || 'Profesional și clar',
          autonomy,
          red_lines: redLines.split('\n').filter(Boolean),
          usp,
        },
        channels: {
          communication: channels,
          crm: '',
          integrations: [],
        },
      }

      // Save to localStorage
      const existing = JSON.parse(localStorage.getItem('agentulmeu_agents') || '[]')
      existing.push({
        id: `${profile.business.business_id}_${agentType}`,
        type: agentType,
        name: `${businessName} — ${AGENT_TYPES.find(a => a.id === agentType)?.name}`,
        profile,
        created: new Date().toISOString(),
      })
      localStorage.setItem('agentulmeu_agents', JSON.stringify(existing))

      // Try API if available
      try {
        await fetch('/api/profile', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(profile),
        })
      } catch { /* offline mode */ }

      alert('🎉 Agent creat cu succes!')
      navigate('/agents')
    } catch (e) {
      alert('❌ Eroare: ' + (e as Error).message)
    } finally {
      setSaving(false)
    }
  }

  const steps = [
    { num: 1, label: 'Tip Agent' },
    { num: 2, label: 'Identitate' },
    { num: 3, label: 'Context' },
    { num: 4, label: 'Reguli' },
    { num: 5, label: 'Confirmare' },
  ]

  const renderStep1 = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-white">Alege tipul de agent</h2>
      <p className="text-sm text-white/50">Fiecare agent are rol și capabilități specifice</p>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {AGENT_TYPES.map(agent => {
          const Icon = agent.icon
          const selected = agentType === agent.id
          return (
            <button
              key={agent.id}
              onClick={() => { setAgentType(agent.id); setName(agent.name) }}
              className={`glass rounded-2xl p-5 text-left transition-all hover:scale-105 ${
                selected ? 'border-2 border-cyan-400/60 glow-cyan' : 'border border-transparent hover:border-white/10'
              }`}
            >
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${agent.color} flex items-center justify-center mb-3`}>
                <Icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-white font-semibold">{agent.name}</h3>
              <p className="text-xs text-white/40">{agent.role}</p>
              <p className="text-sm text-white/50 mt-2">{agent.desc}</p>
              {selected && (
                <div className="mt-3 inline-flex items-center text-cyan-400 text-sm">
                  <Check className="w-4 h-4 mr-1" /> Selectat
                </div>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )

  const renderStep2 = () => (
    <div className="space-y-5">
      <h2 className="text-xl font-semibold text-white">Identitatea agentului</h2>
      <div>
        <label className="block text-sm text-white/70 mb-2">Numele agentului</label>
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="ex: NeoTerm Hunter"
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:border-cyan-400 focus:outline-none"
        />
      </div>
      <div>
        <label className="block text-sm text-white/70 mb-2">Numele business-ului</label>
        <input
          type="text"
          value={businessName}
          onChange={e => setBusinessName(e.target.value)}
          placeholder="ex: NeoTerm.ro"
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:border-cyan-400 focus:outline-none"
        />
      </div>
      <div>
        <label className="block text-sm text-white/70 mb-2">Descriere scurtă</label>
        <textarea
          value={description}
          onChange={e => setDescription(e.target.value)}
          placeholder="Cu ce se ocupă business-ul?"
          rows={3}
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:border-cyan-400 focus:outline-none resize-none"
        />
      </div>
    </div>
  )

  const renderStep3 = () => (
    <div className="space-y-5">
      <h2 className="text-xl font-semibold text-white">Context business</h2>
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-white/70 mb-2">Regiune / Zonă</label>
          <input
            type="text"
            value={region}
            onChange={e => setRegion(e.target.value)}
            placeholder="ex: Oltenia, Dolj, Olt"
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:border-cyan-400 focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-sm text-white/70 mb-2">Client ideal</label>
          <input
            type="text"
            value={idealClient}
            onChange={e => setIdealClient(e.target.value)}
            placeholder="ex: Proprietari case noi, 35-55 ani"
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:border-cyan-400 focus:outline-none"
          />
        </div>
      </div>
      <div>
        <label className="block text-sm text-white/70 mb-2">USP (Unique Selling Proposition)</label>
        <input
          type="text"
          value={usp}
          onChange={e => setUsp(e.target.value)}
          placeholder="Ce te diferențiază de competiție?"
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:border-cyan-400 focus:outline-none"
        />
      </div>
      <div>
        <label className="block text-sm text-white/70 mb-2">Ton de voce al brandului</label>
        <textarea
          value={voice}
          onChange={e => setVoice(e.target.value)}
          placeholder="ex: Prietenos și clar, cu exemple concrete"
          rows={2}
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:border-cyan-400 focus:outline-none resize-none"
        />
      </div>
      <div>
        <label className="block text-sm text-white/70 mb-3">Canale de comunicare</label>
        <div className="flex flex-wrap gap-3">
          {['Email', 'Telegram', 'WhatsApp', 'Discord', 'Slack'].map(ch => (
            <button
              key={ch}
              onClick={() => toggleChannel(ch)}
              className={`px-4 py-2 rounded-xl text-sm transition-all ${
                channels.includes(ch)
                  ? 'bg-gradient-to-r from-cyan-400 to-purple-500 text-white'
                  : 'glass text-white/60 hover:text-white'
              }`}
            >
              {channels.includes(ch) && <Check className="w-3 h-3 inline mr-1" />}
              {ch}
            </button>
          ))}
        </div>
      </div>
    </div>
  )

  const renderStep4 = () => (
    <div className="space-y-5">
      <h2 className="text-xl font-semibold text-white">Reguli și autonomie</h2>
      <div>
        <label className="block text-sm text-white/70 mb-3">Nivel de autonomie</label>
        <div className="space-y-3">
          {AUTONOMY_LEVELS.map(level => {
            const selected = autonomy === level.id
            return (
              <button
                key={level.id}
                onClick={() => setAutonomy(level.id)}
                className={`w-full glass rounded-xl p-4 text-left transition-all flex items-center gap-4 ${
                  selected ? 'border border-cyan-400/40' : 'hover:bg-white/5'
                }`}
              >
                <span className="text-2xl">{level.label.split(' ')[0]}</span>
                <div>
                  <p className={`font-medium ${selected ? 'text-white' : 'text-white/70'}`}>
                    {level.label.split(' ').slice(1).join(' ')}
                  </p>
                  <p className="text-xs text-white/40">{level.desc}</p>
                </div>
                {selected && <Check className="w-5 h-5 text-cyan-400 ml-auto" />}
              </button>
            )
          })}
        </div>
      </div>
      <div>
        <label className="block text-sm text-white/70 mb-2">Reguli absolute (red lines)</label>
        <textarea
          value={redLines}
          onChange={e => setRedLines(e.target.value)}
          placeholder="ex: Nu oferi discount mai mare de 10%\nNu promite termene nerealiste"
          rows={4}
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:border-cyan-400 focus:outline-none resize-none"
        />
        <p className="text-xs text-white/30 mt-1">Fiecare regulă pe linie nouă</p>
      </div>
    </div>
  )

  const renderStep5 = () => {
    const agentInfo = AGENT_TYPES.find(a => a.id === agentType)
    return (
      <div className="space-y-6">
        <h2 className="text-xl font-semibold text-white">Confirmare și lansare</h2>
        <div className="glass rounded-2xl p-6 space-y-4">
          <div className="flex items-center gap-4">
            {agentInfo && (
              <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${agentInfo.color} flex items-center justify-center`}>
                <Bot className="w-7 h-7 text-white" />
              </div>
            )}
            <div>
              <h3 className="text-lg font-bold text-white">{name || 'Agent fără nume'}</h3>
              <p className="text-sm text-white/50">{agentInfo?.role} pentru {businessName || 'business nedefinit'}</p>
            </div>
          </div>
          <div className="border-t border-white/10 pt-4 space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-white/50">Tip:</span> <span className="text-white">{agentInfo?.name || '-'}</span></div>
            <div className="flex justify-between"><span className="text-white/50">Regiune:</span> <span className="text-white">{region || '-'}</span></div>
            <div className="flex justify-between"><span className="text-white/50">Client ideal:</span> <span className="text-white">{idealClient || '-'}</span></div>
            <div className="flex justify-between"><span className="text-white/50">Autonomie:</span> <span className="text-white">{autonomy}</span></div>
            <div className="flex justify-between"><span className="text-white/50">Canale:</span> <span className="text-white">{channels.join(', ') || '-'}</span></div>
            <div className="flex justify-between"><span className="text-white/50">USP:</span> <span className="text-white">{usp || '-'}</span></div>
          </div>
        </div>
        <Button
          onClick={saveAgent}
          disabled={saving || !name || !businessName}
          className="w-full bg-gradient-to-r from-cyan-400 to-purple-500 text-white py-6 text-lg glow-cyan disabled:opacity-50"
        >
          {saving ? '⏳ Se salvează...' : <><Sparkles className="w-5 h-5 mr-2" /> Lansează Agentul</>}
        </Button>
      </div>
    )
  }

  const stepRenderers: Record<number, () => JSX.Element> = {
    1: renderStep1,
    2: renderStep2,
    3: renderStep3,
    4: renderStep4,
    5: renderStep5,
  }

  return (
    <div className="min-h-screen bg-background text-foreground pt-24 pb-12">
      <div className="fixed top-20 left-10 w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="fixed bottom-20 right-10 w-80 h-80 bg-purple-500/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative z-10 max-w-3xl mx-auto px-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button onClick={() => navigate('/agents')} className="text-white/60 hover:text-white transition-colors">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gradient">Crează Agent Nou</h1>
            <p className="text-sm text-white/50">Configurare în 5 pași simpli</p>
          </div>
        </div>

        {/* Progress */}
        <div className="flex gap-2 mb-8">
          {steps.map(s => (
            <button
              key={s.num}
              onClick={() => setStep(s.num)}
              className={`flex-1 py-2 rounded-xl text-xs font-medium transition-all ${
                step === s.num
                  ? 'bg-gradient-to-r from-cyan-400 to-purple-500 text-white'
                  : step > s.num
                  ? 'bg-emerald-400/10 text-emerald-400'
                  : 'glass text-white/40'
              }`}
            >
              {step > s.num ? <Check className="w-3 h-3 inline mr-1" /> : `${s.num}.`}
              {s.label}
            </button>
          ))}
        </div>

        {/* Form Card */}
        <div className="glass rounded-2xl p-6 md:p-8 mb-6">
          {stepRenderers[step]()}
        </div>

        {/* Navigation */}
        <div className="flex justify-between">
          <Button
            onClick={() => setStep(Math.max(1, step - 1))}
            disabled={step === 1}
            variant="ghost"
            className="text-white/60 hover:text-white disabled:opacity-30"
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> Înapoi
          </Button>
          {step < 5 && (
            <Button
              onClick={() => setStep(step + 1)}
              className="bg-gradient-to-r from-cyan-400 to-purple-500 text-white"
            >
              Continuă <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
