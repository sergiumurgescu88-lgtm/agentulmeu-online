import { useState, useEffect } from 'react'
import { Link } from 'react-router'
import { Button } from '@/components/ui/button'
import { Menu, X, Sparkles, Github } from 'lucide-react'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const links = [
    { label: 'Acasă', href: '#hero' },
    { label: 'Funcționalități', href: '#features' },
    { label: 'Instalare', href: '#install' },
    { label: 'Flux', href: '#flow' },
    { label: 'Dashboard', href: '/dashboard', isRoute: true },
    { label: 'Contact', href: '#footer' },
  ]

  const scrollTo = (id: string) => {
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? 'glass-strong py-3' : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-cyan-400 to-purple-500 flex items-center justify-center animate-pulse-glow">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold text-gradient">AgentulMeu</span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {links.map((link) =>
            link.isRoute ? (
              <Link
                key={link.href}
                to={link.href}
                className="text-sm text-white/70 hover:text-white transition-colors relative group"
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-cyan-400 to-purple-500 transition-all group-hover:w-full" />
              </Link>
            ) : (
              <a
                key={link.href}
                href={link.href}
                className="text-sm text-white/70 hover:text-white transition-colors relative group"
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-cyan-400 to-purple-500 transition-all group-hover:w-full" />
              </a>
            )
          )}
        </div>

        <div className="hidden md:flex items-center gap-3">
          <a href="https://github.com/NousResearch" target="_blank" rel="noopener noreferrer">
            <Button variant="ghost" className="text-white/80 hover:text-white hover:bg-white/10">
              <Github className="w-4 h-4 mr-2" />
              GitHub
            </Button>
          </a>
          <Button 
            onClick={() => scrollTo('install')}
            className="bg-gradient-to-r from-cyan-400 to-purple-500 text-white border-0 hover:opacity-90 glow-cyan"
          >
            Începe Gratuit
          </Button>
        </div>

        <button
          className="md:hidden text-white p-2"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="md:hidden glass-strong mt-3 mx-6 rounded-xl p-4 space-y-3">
          {links.map((link) =>
            link.isRoute ? (
              <Link
                key={link.href}
                to={link.href}
                onClick={() => setMobileOpen(false)}
                className="block text-white/80 hover:text-white py-2 transition-colors"
              >
                {link.label}
              </Link>
            ) : (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="block text-white/80 hover:text-white py-2 transition-colors"
              >
                {link.label}
              </a>
            )
          )}
          <div className="pt-3 border-t border-white/10 flex gap-3">
            <a href="https://github.com/NousResearch" target="_blank" rel="noopener noreferrer" className="flex-1">
              <Button variant="ghost" className="w-full text-white/80">GitHub</Button>
            </a>
            <Button 
              onClick={() => {
                setMobileOpen(false)
                scrollTo('install')
              }}
              className="flex-1 bg-gradient-to-r from-cyan-400 to-purple-500 text-white border-0"
            >
              Începe Gratuit
            </Button>
          </div>
        </div>
      )}
    </nav>
  )
}
