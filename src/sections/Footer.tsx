import { Bot, Github, Twitter, Mail, Heart } from 'lucide-react'

export default function Footer() {
  return (
    <footer id="footer" className="relative py-20 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-cyan-500/10 rounded-full blur-[150px]" />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-12 mb-16">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-cyan-400 to-purple-500 flex items-center justify-center">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gradient">AgentulMeu</span>
            </div>
            <p className="text-white/50 max-w-sm mb-6 leading-relaxed">
              Platformă românească bazată pe Hermes Agent (Nous Research). 
              Agenți AI self-hosted, controlați de pe telefon prin Telegram și WhatsApp.
            </p>
            <div className="flex gap-4">
              <a
                href="https://twitter.com/nousresearch"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-lg glass flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-all"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="https://github.com/NousResearch"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-lg glass flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-all"
              >
                <Github className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-lg glass flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-all"
              >
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Platforma</h4>
            <ul className="space-y-3">
              {[
                { label: 'Funcționalități', href: '#features' },
                { label: 'Instalare', href: '#install' },
                { label: 'Flux Complet', href: '#flow' },
                { label: 'Securitate', href: '#security' },
              ].map((item) => (
                <li key={item.label}>
                  <a href={item.href} className="text-white/50 hover:text-white transition-colors text-sm">
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Resurse</h4>
            <ul className="space-y-3">
              {[
                { label: 'Hermes Agent GitHub', href: 'https://github.com/NousResearch' },
                { label: 'Nous Research', href: 'https://nousresearch.com' },
                { label: 'Documentație', href: '#' },
                { label: 'OpenRouter', href: 'https://openrouter.ai' },
              ].map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    target={item.href.startsWith('http') ? '_blank' : undefined}
                    rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                    className="text-white/50 hover:text-white transition-colors text-sm"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-white/40 text-sm">
            © 2025 AgentulMeu.online • Basat pe Hermes Agent (Nous Research) • MIT License
          </p>
          <p className="text-white/40 text-sm flex items-center gap-1">
            Făcut cu <Heart className="w-4 h-4 text-pink-400 fill-pink-400" /> în România
          </p>
        </div>
      </div>
    </footer>
  )
}
