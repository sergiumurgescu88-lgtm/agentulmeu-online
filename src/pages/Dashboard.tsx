import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router'
import {
  ArrowLeft, ArrowRight, Sparkles, Building2, Users, Target,
  MessageSquare, Mail, Phone, Globe, FileText, Bot, Brain,
  Download, Check, RefreshCw, ChevronRight, Zap, Shield,
  Copy, Save, Rocket, BarChart3, Search, PenTool, Handshake,
  HeadphonesIcon, Activity, ToggleLeft, ToggleRight
} from 'lucide-react'
import { Button } from '@/components/ui/button'

interface FormData {
  businessTypes: string[]
  teamSize: string
  maturity: string
  name: string
  description: string
  website: string
  region: string
  idealClient: string
  primaryGoals: string[]
  topProblem: string
  repetitiveTasks: string
  priority90days: string
  selectedAgents: string[]
  communicationChannels: string[]
  brandVoice: string
  autonomyLevel: string
  redLines: string
  usp: string
  crm: string
  integrations: string[]
  modelType: string
  budget: string
  timeline: string
  filesToGenerate: string[]
  [key: string]: unknown
}

const INITIAL_DATA: FormData = {
  businessTypes: [],
  teamSize: '',
  maturity: '',
  name: '',
  description: '',
  website: '',
  region: '',
  idealClient: '',
  primaryGoals: [],
  topProblem: '',
  repetitiveTasks: '',
  priority90days: '',
  selectedAgents: ['hunter', 'writer', 'support'],
  communicationChannels: ['email'],
  brandVoice: '',
  autonomyLevel: 'semi-autonom',
  redLines: '',
  usp: '',
  crm: '',
  integrations: [],
  modelType: 'ollama',
  budget: '',
  timeline: '',
  filesToGenerate: [],
}

const BUSINESS_TYPES = [
  { id: 'b2c', label: 'B2C Local', emoji: '🏪' },
  { id: 'b2b', label: 'B2B', emoji: '🏢' },
  { id: 'ecommerce', label: 'E-commerce', emoji: '🌐' },
  { id: 'education', label: 'Educație', emoji: '🎓' },
  { id: 'saas', label: 'SaaS / Tech', emoji: '💻' },
  { id: 'rnd', label: 'R&D / Inovație', emoji: '🔬' },
  { id: 'construction', label: 'Construcții', emoji: '🏗️' },
  { id: 'medical', label: 'Medical', emoji: '🏥' },
  { id: 'horeca', label: 'HoReCa', emoji: '🍽️' },
  { id: 'realestate', label: 'Imobiliare', emoji: '🏠' },
  { id: 'consulting', label: 'Consultanță', emoji: '⚖️' },
  { id: 'creative', label: 'Creativ / Agenție', emoji: '🎨' },
]

const AGENT_TYPES = [
  { id: 'hunter', label: 'Hunter', role: 'Lead Generator', icon: Search, color: 'from-cyan-400 to-blue-500' },
  { id: 'writer', label: 'Writer', role: 'Content Creator', icon: PenTool, color: 'from-purple-400 to-pink-500' },
  { id: 'closer', label: 'Closer', role: 'Sales Closer', icon: Handshake, color: 'from-amber-400 to-orange-500' },
  { id: 'support', label: 'Support', role: 'Customer Support', icon: HeadphonesIcon, color: 'from-emerald-400 to-teal-500' },
  { id: 'analyst', label: 'Analyst', role: 'Data Analyst', icon: BarChart3, color: 'from-fuchsia-400 to-purple-500' },
  { id: 'scout', label: 'Scout', role: 'Market Intel', icon: Globe, color: 'from-sky-400 to-cyan-500' },
]

const FILE_TEMPLATES = [
  { id: 'SOUL.md', label: 'SOUL.md', desc: 'Identitate și personalitate', icon: Brain },
  { id: 'IDENTITY.md', label: 'IDENTITY.md', desc: 'Profil business complet', icon: FileText },
  { id: 'GOALS.md', label: 'GOALS.md', desc: 'Obiective și strategie', icon: Target },
  { id: 'EXECUTION.md', label: 'EXECUTION.md', desc: 'Plan de execuție', icon: Rocket },
  { id: 'COMMUNICATION.md', label: 'COMMUNICATION.md', desc: 'Tone of voice și canale', icon: MessageSquare },
  { id: 'AGENTS.md', label: 'AGENTS.md', desc: 'Configurare sub-agenți', icon: Bot },
  { id: 'KNOWLEDGE.md', label: 'KNOWLEDGE.md', desc: 'Bază de cunoștințe', icon: Shield },
  { id: 'RULES.md', label: 'RULES.md', desc: 'Reguli și constrângeri', icon: Activity },
  { id: 'INTEGRATIONS.md', label: 'INTEGRATIONS.md', desc: 'Integrări externe', icon: Zap },
]

const CHANNELS = [
  { id: 'email', label: 'Email', icon: Mail },
  { id: 'telegram', label: 'Telegram', icon: MessageSquare },
  { id: 'whatsapp', label: 'WhatsApp', icon: Phone },
  { id: 'discord', label: 'Discord', icon: Users },
  { id: 'slack', label: 'Slack', icon: MessageSquare },
  { id: 'web', label: 'Website Chat', icon: Globe },
]

const API_BASE = window.location.origin

export default function Dashboard() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState<FormData>(INITIAL_DATA)
  const [generatedFiles, setGeneratedFiles] = useState<string[]>([])
  const [apiAvailable, setApiAvailable] = useState(false)
  const [hermesStatus, setHermesStatus] = useState({ hermes: false, ollama: false })
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'warning' | 'info' } | null>(null)
  const [testResults, setTestResults] = useState<Record<string, unknown> | null>(null)
  const [testing, setTesting] = useState(false)

  const totalSteps = 9
  const progress = Math.round((step / totalSteps) * 100)

  // Load saved progress
  useEffect(() => {
    try {
      const saved = localStorage.getItem('agentulmeu_form')
      if (saved) {
        const parsed = JSON.parse(saved)
        setFormData(prev => ({ ...prev, ...parsed }))
      }
    } catch { /* ignore */ }
  }, [])

  // Auto-save
  useEffect(() => {
    localStorage.setItem('agentulmeu_form', JSON.stringify(formData))
  }, [formData])

  // Check API status
  useEffect(() => {
    checkApiStatus()
    const interval = setInterval(checkApiStatus, 30000)
    return () => clearInterval(interval)
  }, [])

  const checkApiStatus = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/hermes/status`, { method: 'GET' })
      if (!res.ok) throw new Error('Server offline')
      const data = await res.json()
      setApiAvailable(true)
      setHermesStatus({
        hermes: data.hermes_available,
        ollama: data.ollama_status === 'connected',
      })
    } catch {
      setApiAvailable(false)
    }
  }

  const runTestGenerate = async () => {
    setTesting(true)
    setTestResults(null)
    try {
      const res = await fetch(`${API_BASE}/api/test-generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      })
      const data = await res.json()
      if (data.success) {
        setTestResults(data)
        showToast(`✅ ${(data as Record<string, unknown>).message as string}`, 'success')
      } else {
        showToast(`❌ ${(data as Record<string, unknown>).error as string || 'Test eșuat'}`, 'error')
      }
    } catch (e) {
      showToast(`❌ Eroare: ${(e as Error).message}`, 'error')
    } finally {
      setTesting(false)
    }
  }

  const showToast = useCallback((message: string, type: 'success' | 'error' | 'warning' | 'info' = 'info') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 4000)
  }, [])

  const updateField = <K extends keyof FormData>(field: K, value: FormData[K]) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const toggleArray = (field: keyof FormData, value: string) => {
    setFormData(prev => {
      const arr = (prev[field] as string[]) || []
      const exists = arr.includes(value)
      return {
        ...prev,
        [field]: exists ? arr.filter(v => v !== value) : [...arr, value],
      }
    })
  }

  const apiRequest = async (endpoint: string, method = 'GET', body: Record<string, unknown> | null = null) => {
    const options: RequestInit = {
      method,
      headers: { 'Content-Type': 'application/json' },
    }
    if (body) options.body = JSON.stringify(body)
    const res = await fetch(`${API_BASE}${endpoint}`, options)
    const text = await res.text()
    let data: Record<string, unknown>
    try { data = JSON.parse(text) } catch { throw new Error('Invalid JSON response') }
    if (!res.ok) throw new Error((data.error as string) || 'Request failed')
    return data
  }

  const saveProfile = async () => {
    setSaving(true)
    try {
      if (apiAvailable) {
        const result = await apiRequest('/api/profile', 'POST', formData as Record<string, unknown>)
        showToast(`✅ Profil salvat pe server: ${result.filename}`, 'success')
        return result
      }
      localStorage.setItem('agentulmeu_profile', JSON.stringify(formData))
      showToast('💾 Profil salvat local (server offline)', 'warning')
      return { success: true, filename: 'local_profile.json' }
    } catch (e) {
      showToast(`❌ Eroare salvare: ${(e as Error).message}`, 'error')
      return null
    } finally {
      setSaving(false)
    }
  }

  const generateFile = async (filename: string) => {
    if (generatedFiles.includes(filename)) return

    try {
      const profile = await saveProfile()
      if (!profile) return

      if (apiAvailable) {
        await apiRequest('/api/generate', 'POST', {
          profile_filename: profile.filename,
          files: [filename],
        })
      }

      setGeneratedFiles(prev => [...prev, filename])
      showToast(`✅ ${filename} generat!`, 'success')
    } catch (e) {
      showToast(`❌ Eroare: ${(e as Error).message}`, 'error')
    }
  }

  const downloadProfile = () => {
    const blob = new Blob([JSON.stringify(formData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `profile_${(formData.name || 'business').toLowerCase().replace(/\s+/g, '_')}.json`
    a.click()
    URL.revokeObjectURL(url)
    showToast('📥 Profil descărcat!', 'success')
  }

  const copyHermesCommand = async () => {
    const cmd = `hermes run skill=build_business_agents --arg profile_path="${formData.name || 'profile'}.json"`
    await navigator.clipboard.writeText(cmd)
    showToast('📋 Comandă copiată!', 'success')
  }

  const resetForm = () => {
    if (confirm('Sigur vrei să resetezi formularul?')) {
      setFormData(INITIAL_DATA)
      setGeneratedFiles([])
      setStep(1)
      localStorage.removeItem('agentulmeu_form')
      showToast('🔄 Formular resetat', 'info')
    }
  }

  const steps = [
    'Profil',
    'Identitate',
    'Obiective',
    'Agenți',
    'Canale',
    'Personalitate',
    'Tehnic',
    'Generare',
    'Export',
  ]

  // ===== RENDER STEPS =====

  const renderStep1 = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-white mb-3">
          Modelul de business <span className="text-red-400">*</span>
        </label>
        <p className="text-xs text-white/50 mb-3">Selectează toate variantele care se aplică</p>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {BUSINESS_TYPES.map(type => {
            const selected = formData.businessTypes.includes(type.id)
            return (
              <button
                key={type.id}
                onClick={() => toggleArray('businessTypes', type.id)}
                className={`glass rounded-xl p-4 text-center transition-all hover:scale-105 ${
                  selected
                    ? 'bg-gradient-to-br from-cyan-400/20 to-purple-500/20 border border-cyan-400/40 glow-cyan'
                    : 'hover:bg-white/5'
                }`}
              >
                <span className="text-2xl mb-2 block">{type.emoji}</span>
                <span className={`text-sm ${selected ? 'text-white font-medium' : 'text-white/70'}`}>
                  {type.label}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-white mb-2">Dimensiunea echipei</label>
          <select
            value={formData.teamSize}
            onChange={e => updateField('teamSize', e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-cyan-400 focus:outline-none"
          >
            <option value="">Selectează...</option>
            <option value="solo">Solo / Freelancer</option>
            <option value="small">2-10 persoane</option>
            <option value="medium">11-50 persoane</option>
            <option value="large">50+ persoane</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-white mb-2">Stadiul de maturitate</label>
          <select
            value={formData.maturity}
            onChange={e => updateField('maturity', e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-cyan-400 focus:outline-none"
          >
            <option value="">Selectează...</option>
            <option value="idea">Idee / Pre-launch</option>
            <option value="startup">Startup timpuriu</option>
            <option value="growth">Creștere / Scaling</option>
            <option value="established">Stabilit / Enterprise</option>
          </select>
        </div>
      </div>
    </div>
  )

  const renderStep2 = () => (
    <div className="space-y-5">
      <div>
        <label className="block text-sm font-medium text-white mb-2">
          Numele business-ului <span className="text-red-400">*</span>
        </label>
        <input
          type="text"
          value={formData.name}
          onChange={e => updateField('name', e.target.value)}
          placeholder="ex: NeoTerm.ro"
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:border-cyan-400 focus:outline-none"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-white mb-2">Descriere scurtă</label>
        <textarea
          value={formData.description}
          onChange={e => updateField('description', e.target.value)}
          placeholder="Cu ce se ocupă business-ul tău?"
          rows={3}
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:border-cyan-400 focus:outline-none resize-none"
        />
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-white mb-2">Website</label>
          <input
            type="url"
            value={formData.website}
            onChange={e => updateField('website', e.target.value)}
            placeholder="https://..."
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:border-cyan-400 focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-white mb-2">Regiune / Zonă</label>
          <input
            type="text"
            value={formData.region}
            onChange={e => updateField('region', e.target.value)}
            placeholder="ex: Oltenia, Dolj, Olt, Gorj"
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:border-cyan-400 focus:outline-none"
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-white mb-2">Client ideal</label>
        <input
          type="text"
          value={formData.idealClient}
          onChange={e => updateField('idealClient', e.target.value)}
          placeholder="ex: Proprietari case noi, 35-55 ani, rural/semi-urban"
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:border-cyan-400 focus:outline-none"
        />
      </div>
    </div>
  )

  const renderStep3 = () => (
    <div className="space-y-5">
      <div>
        <label className="block text-sm font-medium text-white mb-3">Obiective principale</label>
        <p className="text-xs text-white/50 mb-3">Selectează toate variantele care se aplică</p>
        <div className="flex flex-wrap gap-2">
          {['Lead generation', 'Vânzări', 'Customer support', 'Brand awareness', 'Automatizare', 'Analiză date', 'Content marketing', 'Retenție clienți'].map(goal => {
            const selected = formData.primaryGoals.includes(goal)
            return (
              <button
                key={goal}
                onClick={() => toggleArray('primaryGoals', goal)}
                className={`px-4 py-2 rounded-full text-sm transition-all ${
                  selected
                    ? 'bg-gradient-to-r from-cyan-400 to-purple-500 text-white'
                    : 'glass text-white/60 hover:text-white'
                }`}
              >
                {selected && <Check className="w-3 h-3 inline mr-1" />}
                {goal}
              </button>
            )
          })}
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-white mb-2">Cea mai mare problemă acum</label>
        <textarea
          value={formData.topProblem}
          onChange={e => updateField('topProblem', e.target.value)}
          placeholder="Ce te ține treaz noaptea?"
          rows={3}
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:border-cyan-400 focus:outline-none resize-none"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-white mb-2">Task-uri repetitive care te consumă</label>
        <textarea
          value={formData.repetitiveTasks}
          onChange={e => updateField('repetitiveTasks', e.target.value)}
          placeholder="ex: Răspuns la email-uri, follow-up, generare conținut..."
          rows={2}
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:border-cyan-400 focus:outline-none resize-none"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-white mb-2">Prioritate #1 în următoarele 90 zile</label>
        <input
          type="text"
          value={formData.priority90days}
          onChange={e => updateField('priority90days', e.target.value)}
          placeholder="ex: Creștere vânzări cu 30% în Oltenia"
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:border-cyan-400 focus:outline-none"
        />
      </div>
    </div>
  )

  const renderStep4 = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-white mb-3">Selectează agenții AI de care ai nevoie</label>
        <p className="text-xs text-white/50 mb-3">Click pe card pentru a selecta/deselecta</p>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {AGENT_TYPES.map(agent => {
            const selected = formData.selectedAgents.includes(agent.id)
            const Icon = agent.icon
            return (
              <button
                key={agent.id}
                onClick={() => toggleArray('selectedAgents', agent.id)}
                className={`relative glass rounded-2xl p-5 text-left transition-all hover:scale-105 ${
                  selected
                    ? 'border border-cyan-400/40 glow-cyan'
                    : 'border border-transparent hover:border-white/10'
                }`}
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${agent.color} flex items-center justify-center mb-3`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-white font-semibold">{agent.label}</h3>
                <p className="text-xs text-white/50">{agent.role}</p>
                {selected && (
                  <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-cyan-400 flex items-center justify-center">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                )}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )

  const renderStep5 = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-white mb-3">Canale de comunicare preferate</label>
        <div className="flex flex-wrap gap-3">
          {CHANNELS.map(ch => {
            const Icon = ch.icon
            const selected = formData.communicationChannels.includes(ch.id)
            return (
              <button
                key={ch.id}
                onClick={() => toggleArray('communicationChannels', ch.id)}
                className={`flex items-center gap-2 px-4 py-3 rounded-xl transition-all ${
                  selected
                    ? 'bg-gradient-to-r from-cyan-400/20 to-purple-500/20 border border-cyan-400/40 text-white'
                    : 'glass text-white/60 hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4" />
                {ch.label}
                {selected ? <ToggleRight className="w-5 h-5 text-cyan-400" /> : <ToggleLeft className="w-5 h-5" />}
              </button>
            )
          })}
        </div>
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-white mb-2">CRM folosit</label>
          <select
            value={formData.crm}
            onChange={e => updateField('crm', e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-cyan-400 focus:outline-none"
          >
            <option value="">Selectează...</option>
            <option value="hubspot">HubSpot</option>
            <option value="salesforce">Salesforce</option>
            <option value="pipedrive">Pipedrive</option>
            <option value="zoho">Zoho CRM</option>
            <option value="custom">Custom / Propriu</option>
            <option value="none">Niciunul încă</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-white mb-2">Integrări dorite</label>
          <input
            type="text"
            value={formData.integrations.join(', ')}
            onChange={e => updateField('integrations', e.target.value.split(', ').filter(Boolean))}
            placeholder="ex: Slack, Google Sheets, Notion"
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:border-cyan-400 focus:outline-none"
          />
        </div>
      </div>
    </div>
  )

  const renderStep6 = () => (
    <div className="space-y-5">
      <div>
        <label className="block text-sm font-medium text-white mb-2">Tonul de voce al brandului</label>
        <textarea
          value={formData.brandVoice}
          onChange={e => updateField('brandVoice', e.target.value)}
          placeholder="ex: Profesional dar prietenos, cu exemple concrete din construcții"
          rows={3}
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:border-cyan-400 focus:outline-none resize-none"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-white mb-2">Nivel de autonomie dorit</label>
        <div className="flex gap-3">
          {['approve-only', 'semi-autonom', 'full-autonom'].map(level => {
            const labels: Record<string, string> = {
              'approve-only': '🛡️ Aprobare manuală',
              'semi-autonom': '⚡ Semi-autonom',
              'full-autonom': '🤖 Full autonom',
            }
            const selected = formData.autonomyLevel === level
            return (
              <button
                key={level}
                onClick={() => updateField('autonomyLevel', level)}
                className={`flex-1 glass rounded-xl p-4 text-center transition-all ${
                  selected
                    ? 'bg-gradient-to-r from-cyan-400/20 to-purple-500/20 border border-cyan-400/40'
                    : 'hover:bg-white/5'
                }`}
              >
                <span className="text-lg mb-1 block">{labels[level].split(' ')[0]}</span>
                <span className={`text-sm ${selected ? 'text-white font-medium' : 'text-white/60'}`}>
                  {labels[level].split(' ').slice(1).join(' ')}
                </span>
              </button>
            )
          })}
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-white mb-2">Reguli absolute (red lines)</label>
        <textarea
          value={formData.redLines}
          onChange={e => updateField('redLines', e.target.value)}
          placeholder="ex: Nu oferi discount mai mare de 10%. Nu promite termene nerealiste."
          rows={3}
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:border-cyan-400 focus:outline-none resize-none"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-white mb-2">Unique Selling Proposition (USP)</label>
        <input
          type="text"
          value={formData.usp}
          onChange={e => updateField('usp', e.target.value)}
          placeholder="Ce te diferențiază de competiție?"
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:border-cyan-400 focus:outline-none"
        />
      </div>
    </div>
  )

  const renderStep7 = () => (
    <div className="space-y-5">
      <div>
        <label className="block text-sm font-medium text-white mb-2">Model AI preferat</label>
        <div className="grid md:grid-cols-3 gap-3">
          {[
            { id: 'ollama', label: '🦙 Ollama (Local)', desc: 'Self-hosted, gratuit' },
            { id: 'openrouter', label: '🔌 OpenRouter', desc: '200+ modele, API key' },
            { id: 'nous', label: '🔮 Nous Portal', desc: 'OAuth, gratuit' },
          ].map(model => {
            const selected = formData.modelType === model.id
            return (
              <button
                key={model.id}
                onClick={() => updateField('modelType', model.id)}
                className={`glass rounded-xl p-4 text-left transition-all ${
                  selected ? 'border border-cyan-400/40 glow-cyan' : 'hover:bg-white/5'
                }`}
              >
                <span className="text-lg block mb-1">{model.label.split(' ')[0]}</span>
                <span className="text-sm text-white/70">{model.label.split(' ').slice(1).join(' ')}</span>
                <span className="text-xs text-white/40 block mt-1">{model.desc}</span>
              </button>
            )
          })}
        </div>
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-white mb-2">Buget estimat (€/lună)</label>
          <select
            value={formData.budget}
            onChange={e => updateField('budget', e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-cyan-400 focus:outline-none"
          >
            <option value="">Selectează...</option>
            <option value="0-500">0 - 500€</option>
            <option value="500-2000">500 - 2,000€</option>
            <option value="2000-10000">2,000 - 10,000€</option>
            <option value="10000+">10,000€+</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-white mb-2">Timeline de implementare</label>
          <select
            value={formData.timeline}
            onChange={e => updateField('timeline', e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-cyan-400 focus:outline-none"
          >
            <option value="">Selectează...</option>
            <option value="immediate">Imediat (acum)</option>
            <option value="1week">În 1 săptămână</option>
            <option value="1month">În 1 lună</option>
            <option value="3months">În 3 luni</option>
          </select>
        </div>
      </div>
    </div>
  )

  const renderStep8 = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-white mb-3">Fișiere de configurare</label>
        <p className="text-xs text-white/50 mb-3">Click pe Generate pentru a crea fiecare fișier</p>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
          {FILE_TEMPLATES.map(file => {
            const Icon = file.icon
            const isGenerated = generatedFiles.includes(file.id)
            return (
              <div
                key={file.id}
                className={`glass rounded-xl p-4 flex items-center justify-between ${
                  isGenerated ? 'border border-emerald-400/30' : ''
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    isGenerated ? 'bg-emerald-400/20' : 'bg-white/5'
                  }`}>
                    <Icon className={`w-5 h-5 ${isGenerated ? 'text-emerald-400' : 'text-white/60'}`} />
                  </div>
                  <div>
                    <p className={`text-sm font-medium ${isGenerated ? 'text-emerald-400' : 'text-white'}`}>
                      {file.label}
                    </p>
                    <p className="text-xs text-white/40">{file.desc}</p>
                  </div>
                </div>
                <button
                  onClick={() => generateFile(file.id)}
                  disabled={isGenerated || saving}
                  className={`px-3 py-2 rounded-lg text-sm transition-all ${
                    isGenerated
                      ? 'bg-emerald-400/20 text-emerald-400 cursor-default'
                      : 'bg-gradient-to-r from-cyan-400 to-purple-500 text-white hover:opacity-90'
                  }`}
                >
                  {isGenerated ? '✓' : saving ? '...' : 'Generează'}
                </button>
              </div>
            )
          })}
        </div>
      </div>

      {generatedFiles.length > 0 && (
        <div className="glass rounded-xl p-4 border border-emerald-400/20">
          <div className="flex items-center gap-2 mb-2">
            <Check className="w-5 h-5 text-emerald-400" />
            <span className="text-emerald-400 font-medium">{generatedFiles.length} fișiere generate</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {generatedFiles.map(f => (
              <span key={f} className="text-xs glass px-2 py-1 rounded text-white/70">{f}</span>
            ))}
          </div>
        </div>
      )}
    </div>
  )

  const renderStep9 = () => (
    <div className="space-y-6">
      <div className="glass rounded-xl p-6 text-center">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-cyan-400 to-purple-500 flex items-center justify-center mx-auto mb-4">
          <Rocket className="w-8 h-8 text-white" />
        </div>
        <h3 className="text-xl font-bold text-white mb-2">Agenții tăi sunt gata de lansare!</h3>
        <p className="text-white/50 mb-6">{generatedFiles.length} fișiere generate pentru {formData.name || 'business-ul tău'}</p>

        <div className="flex flex-wrap gap-3 justify-center">
          <Button
            onClick={downloadProfile}
            className="bg-gradient-to-r from-cyan-400 to-purple-500 text-white"
          >
            <Download className="w-4 h-4 mr-2" />
            Descarcă Profile.json
          </Button>
          <Button
            onClick={copyHermesCommand}
            variant="outline"
            className="border-white/20 text-white hover:bg-white/10"
          >
            <Copy className="w-4 h-4 mr-2" />
            Copiază Comanda Hermes
          </Button>
          <Button
            onClick={() => navigate('/')}
            variant="ghost"
            className="text-white/60 hover:text-white"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Înapoi la Site
          </Button>
        </div>
      </div>

      <div className="glass rounded-xl p-4">
        <h4 className="text-sm font-medium text-white mb-3">Sumar configurare</h4>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between"><span className="text-white/50">Business:</span> <span className="text-white">{formData.name || '-'}</span></div>
          <div className="flex justify-between"><span className="text-white/50">Tip:</span> <span className="text-white">{formData.businessTypes.join(', ') || '-'}</span></div>
          <div className="flex justify-between"><span className="text-white/50">Agenți:</span> <span className="text-white">{formData.selectedAgents.join(', ') || '-'}</span></div>
          <div className="flex justify-between"><span className="text-white/50">Canale:</span> <span className="text-white">{formData.communicationChannels.join(', ') || '-'}</span></div>
          <div className="flex justify-between"><span className="text-white/50">Autonomie:</span> <span className="text-white">{formData.autonomyLevel}</span></div>
        </div>
      </div>
    </div>
  )

  const stepRenderers: Record<number, () => JSX.Element> = {
    1: renderStep1,
    2: renderStep2,
    3: renderStep3,
    4: renderStep4,
    5: renderStep5,
    6: renderStep6,
    7: renderStep7,
    8: renderStep8,
    9: renderStep9,
  }

  return (
    <div className="min-h-screen bg-background text-foreground pt-24 pb-12">
      {/* Floating Orbs Background */}
      <div className="fixed top-20 left-10 w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px] animate-float-slow pointer-events-none" />
      <div className="fixed bottom-20 right-10 w-80 h-80 bg-purple-500/10 rounded-full blur-[100px] animate-float-slow pointer-events-none" style={{ animationDelay: '2s' }} />

      <div className="relative z-10 max-w-4xl mx-auto px-6">
        {/* Header */}
        <div className="glass rounded-2xl p-8 mb-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-purple-500 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gradient">AgentulMeu.online</h1>
          </div>
          <p className="text-white/50">Configurează-ți echipa de agenți AI în 9 pași simpli</p>
        </div>

        {/* Progress Bar */}
        <div className="glass rounded-xl p-5 mb-6">
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm text-white/70">Progres configurare</span>
            <span className="text-sm font-mono text-cyan-400">{progress}%</span>
          </div>
          <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full transition-all duration-500 relative"
              style={{ width: `${progress}%` }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-[shimmer_2s_infinite]" />
            </div>
          </div>
        </div>

        {/* Step Indicators */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
          {steps.map((label, idx) => {
            const num = idx + 1
            const isActive = step === num
            const isCompleted = step > num
            return (
              <button
                key={num}
                onClick={() => setStep(num)}
                className={`flex-shrink-0 px-4 py-2 rounded-xl text-sm transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-cyan-400 to-purple-500 text-white font-medium glow-cyan'
                    : isCompleted
                    ? 'bg-emerald-400/10 border border-emerald-400/30 text-emerald-400'
                    : 'glass text-white/50 hover:text-white'
                }`}
              >
                {isCompleted && <Check className="w-3 h-3 inline mr-1" />}
                {label}
              </button>
            )
          })}
        </div>

        {/* Form Card */}
        <div className="glass rounded-2xl p-6 md:p-8 mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-400 to-purple-500 flex items-center justify-center text-white text-sm font-bold">
              {step}
            </div>
            <h2 className="text-xl font-semibold text-white">{steps[step - 1]}</h2>
          </div>
          <p className="text-white/50 text-sm mb-6">Completează informațiile pentru a configura agenții AI</p>

          {stepRenderers[step]()}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between items-center mb-8">
          <Button
            onClick={() => setStep(Math.max(1, step - 1))}
            disabled={step === 1}
            variant="ghost"
            className="text-white/60 hover:text-white disabled:opacity-30"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Înapoi
          </Button>

          {step < totalSteps ? (
            <Button
              onClick={() => setStep(step + 1)}
              className="bg-gradient-to-r from-cyan-400 to-purple-500 text-white"
            >
              Continuă
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button
              onClick={() => {
                saveProfile()
                showToast('🎉 Configurare finalizată!', 'success')
              }}
              className="bg-gradient-to-r from-cyan-400 to-purple-500 text-white"
            >
              <Save className="w-4 h-4 mr-2" />
              Salvează Tot
            </Button>
          )}
        </div>

        {/* Status Panel */}
        <div className="glass rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-cyan-400" />
              <span className="text-sm font-medium text-white">Activitate Live</span>
            </div>
            <Button
              size="sm"
              onClick={runTestGenerate}
              disabled={testing}
              className="bg-gradient-to-r from-cyan-400/20 to-purple-500/20 text-cyan-400 border border-cyan-400/30 hover:bg-cyan-400/10 text-xs px-3 py-1"
            >
              {testing ? '⏳ Se testează...' : <><Zap className="w-3 h-3 mr-1" /> Testare Rapidă</>}
            </Button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="flex items-center justify-between glass rounded-lg px-3 py-2">
              <span className="text-xs text-white/50">Sistem</span>
              <span className="text-xs text-emerald-400">● Operațional</span>
            </div>
            <div className="flex items-center justify-between glass rounded-lg px-3 py-2">
              <span className="text-xs text-white/50">API Health</span>
              <span className={`text-xs ${apiAvailable ? 'text-emerald-400' : 'text-amber-400'}`}>
                ● {apiAvailable ? 'Online' : 'Offline (local)'}
              </span>
            </div>
            <div className="flex items-center justify-between glass rounded-lg px-3 py-2">
              <span className="text-xs text-white/50">Hermes</span>
              <span className={`text-xs ${hermesStatus.hermes ? 'text-emerald-400' : 'text-white/40'}`}>
                ● {hermesStatus.hermes ? 'Online' : 'Necunoscut'}
              </span>
            </div>
            <div className="flex items-center justify-between glass rounded-lg px-3 py-2">
              <span className="text-xs text-white/50">Fișiere</span>
              <span className="text-xs text-white/70">{generatedFiles.length}/9</span>
            </div>
          </div>
        </div>

        {/* Test Results */}
        {testResults && testResults.files && (
          <div className="glass rounded-2xl p-6 mb-6 border border-emerald-400/20">
            <div className="flex items-center gap-2 mb-4">
              <Check className="w-5 h-5 text-emerald-400" />
              <span className="text-emerald-400 font-medium">Rezultate Test</span>
              <span className="text-xs text-white/40 ml-auto">{(testResults.files as Array<Record<string, unknown>>).length} fișiere generate</span>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
              {(testResults.files as Array<Record<string, unknown>>).map((f: Record<string, unknown>, idx: number) => (
                <div key={idx} className="glass rounded-lg p-3 flex items-center gap-3">
                  <FileText className="w-4 h-4 text-cyan-400" />
                  <div>
                    <p className="text-sm text-white">{f.name as string}</p>
                    <p className="text-xs text-white/40">{f.size as number} bytes</p>
                  </div>
                </div>
              ))}
            </div>
            {testResults.output_dir && (
              <p className="text-xs text-white/40 mt-3">Output: {testResults.output_dir as string}</p>
            )}
          </div>
        )}

        {/* Reset */}
        <div className="text-center mt-6">
          <button
            onClick={resetForm}
            className="text-xs text-white/30 hover:text-white/60 transition-colors flex items-center gap-1 mx-auto"
          >
            <RefreshCw className="w-3 h-3" />
            Resetează formularul
          </button>
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div className={`fixed bottom-6 right-6 px-5 py-3 rounded-xl glass shadow-lg z-50 flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2 ${
          toast.type === 'success' ? 'border-l-4 border-emerald-400' :
          toast.type === 'error' ? 'border-l-4 border-red-400' :
          toast.type === 'warning' ? 'border-l-4 border-amber-400' :
          'border-l-4 border-cyan-400'
        }`}>
          <span className="text-sm text-white">{toast.message}</span>
          <button onClick={() => setToast(null)} className="text-white/40 hover:text-white">×</button>
        </div>
      )}
    </div>
  )
}
