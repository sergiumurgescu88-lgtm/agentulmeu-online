import Navbar from '@/sections/Navbar'
import Hero from '@/sections/Hero'
import Features from '@/sections/Features'
import HowItWorks from '@/sections/HowItWorks'
import InstallSection from '@/sections/InstallSection'
import AgentsSection from '@/sections/AgentsSection'
import FlowSection from '@/sections/FlowSection'
import SecuritySection from '@/sections/SecuritySection'
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
      <InstallSection />
      <AgentsSection />
      <FlowSection />
      <SecuritySection />
      <Footer />
    </main>
  )
}
