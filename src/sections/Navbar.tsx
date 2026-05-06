import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useAuth } from '@/hooks/useAuth'
import { Menu, X, Sparkles, LogOut, LayoutDashboard, User } from 'lucide-react'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const { user, isAuthenticated, logout } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const links = [
    { label: 'Acasă', href: '#hero' },
    { label: 'Funcționalități', href: '#features' },
    { label: 'Cum Funcționează', href: '#how-it-works' },
    { label: 'Contact', href: '#footer' },
  ]

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
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm text-white/70 hover:text-white transition-colors relative group"
            >
              {link.label}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-cyan-400 to-purple-500 transition-all group-hover:w-full" />
            </a>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          {isAuthenticated && user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-white/10 transition-colors">
                  <Avatar className="h-8 w-8 border border-white/20">
                    <AvatarFallback className="text-xs font-medium bg-gradient-to-br from-cyan-400/30 to-purple-500/30 text-white">
                      {user.name?.charAt(0).toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm text-white/80">{user.name || 'User'}</span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 glass border-white/10 bg-[hsl(220,25%,8%)]">
                <DropdownMenuItem
                  onClick={() => navigate('/dashboard')}
                  className="cursor-pointer text-white/70 hover:text-white focus:text-white"
                >
                  <LayoutDashboard className="mr-2 h-4 w-4" />
                  <span>Dashboard</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={logout}
                  className="cursor-pointer text-red-400 focus:text-red-400"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Deconectare</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Link to="/login">
                <Button variant="ghost" className="text-white/80 hover:text-white hover:bg-white/10">
                  <User className="w-4 h-4 mr-2" />
                  Log In
                </Button>
              </Link>
              <Link to="/login">
                <Button className="bg-gradient-to-r from-cyan-400 to-purple-500 text-white border-0 hover:opacity-90 glow-cyan">
                  Începe Gratuit
                </Button>
              </Link>
            </>
          )}
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
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="block text-white/80 hover:text-white py-2 transition-colors"
            >
              {link.label}
            </a>
          ))}
          <div className="pt-3 border-t border-white/10 flex flex-col gap-2">
            {isAuthenticated && user ? (
              <>
                <Button variant="ghost" className="w-full justify-start text-white/80" onClick={() => { navigate('/dashboard'); setMobileOpen(false) }}>
                  <LayoutDashboard className="w-4 h-4 mr-2" />
                  Dashboard
                </Button>
                <Button variant="ghost" className="w-full justify-start text-red-400" onClick={() => { logout(); setMobileOpen(false) }}>
                  <LogOut className="w-4 h-4 mr-2" />
                  Deconectare
                </Button>
              </>
            ) : (
              <div className="flex gap-3">
                <Link to="/login" className="flex-1" onClick={() => setMobileOpen(false)}>
                  <Button variant="ghost" className="w-full text-white/80">Log In</Button>
                </Link>
                <Link to="/login" className="flex-1" onClick={() => setMobileOpen(false)}>
                  <Button className="w-full bg-gradient-to-r from-cyan-400 to-purple-500 text-white border-0">
                    Începe Gratuit
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}
