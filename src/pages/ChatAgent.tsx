import { useState, useRef, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router'
import {
  ArrowLeft, Send, Bot, User, Zap, Activity, RefreshCw, Settings, Copy
} from 'lucide-react'
import { Button } from '@/components/ui/button'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

const AGENT_CONFIGS: Record<string, { name: string; color: string }> = {
  hunter: { name: 'Hunter', color: 'from-cyan-400 to-blue-500' },
  writer: { name: 'Writer', color: 'from-purple-400 to-pink-500' },
  closer: { name: 'Closer', color: 'from-amber-400 to-orange-500' },
  support: { name: 'Support', color: 'from-emerald-400 to-teal-500' },
  analyst: { name: 'Analyst', color: 'from-fuchsia-400 to-purple-500' },
  scout: { name: 'Scout', color: 'from-sky-400 to-cyan-500' },
}

export default function ChatAgent() {
  const { agentId } = useParams<{ agentId: string }>()
  const navigate = useNavigate()
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [typing, setTyping] = useState(false)

  // Parse agent ID (format: businessId_agentType)
  const parts = agentId?.split('_') || []
  const agentType = parts.length > 1 ? parts[parts.length - 1] : 'hunter'
  const businessId = parts.length > 1 ? parts.slice(0, -1).join('_') : 'default'

  const config = AGENT_CONFIGS[agentType] || AGENT_CONFIGS.hunter

  // Load saved messages
  useEffect(() => {
    try {
      const saved = localStorage.getItem(`chat_${agentId}`)
      if (saved) {
        const parsed = JSON.parse(saved)
        setMessages(parsed.map((m: Message) => ({
          ...m,
          timestamp: new Date(m.timestamp),
        })))
      }
    } catch { /* ignore */ }
  }, [agentId])

  // Auto-save messages
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem(`chat_${agentId}`, JSON.stringify(messages))
    }
  }, [messages, agentId])

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = async () => {
    if (!input.trim() || loading) return

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    }

    setMessages(prev => [...prev, userMsg])
    setInput('')
    setLoading(true)
    setTyping(true)

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          agent_id: agentId,
          agent_type: agentType,
          business_id: businessId,
          message: userMsg.content,
          history: messages.slice(-10).map(m => ({ role: m.role, content: m.content })),
        }),
      })

      if (!res.ok) throw new Error(`HTTP ${res.status}`)

      const data = await res.json()

      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.response || data.error || 'Eroare la procesare.',
        timestamp: new Date(),
      }

      setMessages(prev => [...prev, botMsg])
    } catch (e) {
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `⚠️ ${(e as Error).message}.\n\nAsigură-te că:\n1. Flask server rulează (systemctl status agentulmeu-flask)\n2. Ollama este pornit (ollama serve)\n3. Modelul llama3.2:1b este descărcat (ollama list)`,
        timestamp: new Date(),
      }
      setMessages(prev => [...prev, errorMsg])
    } finally {
      setLoading(false)
      setTyping(false)
      inputRef.current?.focus()
    }
  }

  const clearChat = () => {
    if (confirm('Sigur vrei să ștergi toate mesajele?')) {
      setMessages([])
      localStorage.removeItem(`chat_${agentId}`)
    }
  }

  const copyMessage = (content: string) => {
    navigator.clipboard.writeText(content)
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Background orbs */}
      <div className="fixed top-20 left-10 w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="fixed bottom-20 right-10 w-80 h-80 bg-purple-500/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 glass-strong border-b border-white/5">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/agents')}
              className="text-white/60 hover:text-white transition-colors p-2 rounded-lg hover:bg-white/5"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${config.color} flex items-center justify-center`}>
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-sm font-semibold text-white">{config.name}</h1>
              <p className="text-xs text-white/40 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Online — Ollama local
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={clearChat}
              className="p-2 rounded-lg text-white/40 hover:text-white hover:bg-white/5 transition-colors"
              title="Șterge conversația"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button
              onClick={() => navigate('/dashboard')}
              className="p-2 rounded-lg text-white/40 hover:text-white hover:bg-white/5 transition-colors"
              title="Dashboard"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Messages */}
      <main className="flex-1 overflow-y-auto pt-20 pb-24 px-4">
        <div className="max-w-4xl mx-auto space-y-4">
          {messages.length === 0 && (
            <div className="text-center py-16">
              <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${config.color} flex items-center justify-center mx-auto mb-6`}>
                <Bot className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-xl font-bold text-white mb-2">
                {config.name} — Agent AI
              </h2>
              <p className="text-white/50 max-w-md mx-auto mb-8">
                Scrie un mesaj pentru a începe conversația. Agentul folosește Ollama local
                cu modelul llama3.2:1b și răspunde în limba română.
              </p>
              <div className="flex flex-wrap gap-2 justify-center">
                {[
                  'Salut! Cine ești și ce poți face?',
                  'Găsește 3 prospecți în Craiova',
                  'Scrie un email de follow-up pentru un client',
                  'Analizează trendurile din piața de izolații',
                ].map(suggestion => (
                  <button
                    key={suggestion}
                    onClick={() => { setInput(suggestion) }}
                    className="glass px-4 py-2 rounded-full text-sm text-white/60 hover:text-white hover:bg-white/10 transition-all"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map(msg => (
            <div
              key={msg.id}
              className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
            >
              {/* Avatar */}
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                msg.role === 'user'
                  ? 'bg-gradient-to-br from-purple-400 to-pink-500'
                  : `bg-gradient-to-br ${config.color}`
              }`}>
                {msg.role === 'user'
                  ? <User className="w-4 h-4 text-white" />
                  : <Bot className="w-4 h-4 text-white" />
                }
              </div>

              {/* Message bubble */}
              <div className={`relative max-w-[80%] group ${
                msg.role === 'user' ? 'items-end' : 'items-start'
              }`}>
                <div className={`glass rounded-2xl px-5 py-3 ${
                  msg.role === 'user'
                    ? 'bg-gradient-to-r from-purple-500/20 to-cyan-500/20 border border-cyan-400/20'
                    : ''
                }`}>
                  <p className="text-sm text-white whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-[10px] text-white/30">
                      {msg.timestamp.toLocaleTimeString('ro-RO', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    {msg.role === 'assistant' && (
                      <button
                        onClick={() => copyMessage(msg.content)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity text-white/30 hover:text-white/60 ml-3"
                        title="Copiază"
                      >
                        <Copy className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Typing indicator */}
          {typing && (
            <div className="flex gap-3">
              <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${config.color} flex items-center justify-center`}>
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div className="glass rounded-2xl px-5 py-3">
                <div className="flex gap-1">
                  <span className="w-2 h-2 rounded-full bg-white/40 animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 rounded-full bg-white/40 animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 rounded-full bg-white/40 animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </main>

      {/* Input */}
      <footer className="fixed bottom-0 left-0 right-0 glass-strong border-t border-white/5 px-4 py-3">
        <div className="max-w-4xl mx-auto flex gap-3">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && sendMessage()}
            placeholder="Scrie un mesaj..."
            disabled={loading}
            className="flex-1 bg-white/5 border border-white/10 rounded-xl px-5 py-3 text-white placeholder:text-white/30 focus:border-cyan-400 focus:outline-none disabled:opacity-50"
          />
          <Button
            onClick={sendMessage}
            disabled={!input.trim() || loading}
            className="bg-gradient-to-r from-cyan-400 to-purple-500 text-white rounded-xl px-5 glow-cyan disabled:opacity-50"
          >
            <Send className="w-5 h-5" />
          </Button>
        </div>
        <div className="max-w-4xl mx-auto flex items-center justify-center gap-4 mt-2">
          <span className="text-[10px] text-white/30 flex items-center gap-1">
            <Zap className="w-3 h-3" />
            Ollama llama3.2:1b — Self-hosted
          </span>
          <span className="text-[10px] text-white/30 flex items-center gap-1">
            <Activity className="w-3 h-3" />
            {messages.length} mesaje
          </span>
        </div>
      </footer>
    </div>
  )
}
