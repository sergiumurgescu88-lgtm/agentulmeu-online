import Navbar from '@/sections/Navbar'
import Hero from '@/sections/Hero'
import Features from '@/sections/Features'
import HowItWorks from '@/sections/HowItWorks'
import FloatingOrbs from '@/sections/FloatingOrbs'
import Footer from '@/sections/Footer'

export default function Home() {
  return (
    <main className="relative min-h-screen bg-background text-foreground overflow-x-hidden">
      <FloatingOrbs />
      <Navbar />
      <Hero />
      <Features />
      <HowItWorks />
      <Footer />
    </main>
  )
}
