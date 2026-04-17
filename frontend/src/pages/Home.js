import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { ArrowRight } from "lucide-react"

export default function Home() {
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <main className="pt-20">
      {/* Hero Section */}
      <section className="hero-container">
          {/* The Video Background */}
          <video autoPlay muted loop playsInline poster="/assets/video-thumbnail.jpg" className="hero-video">
              <source src="/assets/travoss-promo.mp4" type="video/mp4" />
              Your browser does not support the video tag.
          </video>

          {/* Dark Overlay to make text readable */}
          <div className="hero-overlay"></div>

          {/* Hero Content */}
          <div className="hero-content">
              <h1 className="hero-title">Empowering Travel Businesses.</h1>
              <p className="hero-subtitle">India’s smartest B2B travel platform connecting agencies through AI and collaboration.</p>
              <div className="hero-btns">
                  <Link to="/agencies" className="btn-primary">Join Travoss Today</Link>
                  <Link to="/services" className="btn-secondary">Watch Demo</Link>
              </div>
          </div>
      </section>

      {/* Premium CTA Gradient Section */}
      <section className="py-28 bg-gradient-cta relative overflow-hidden">
        {/* Premium Background Pattern */}
        <div className="absolute inset-0 opacity-20 dark:opacity-10" style={{ 
            backgroundImage: 'radial-gradient(circle at 80% 50%, rgba(255,255,255,0.1) 1px, transparent 1px)',
            backgroundSize: '40px 40px'
          }} />

        {/* Decorative Gradients */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
          <div className="absolute -top-20 -left-20 w-96 h-96 bg-white/5 rounded-full filter blur-3xl"></div>
          <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-indigo-300/10 rounded-full filter blur-3xl"></div>
        </div>

        {/* Content */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-4xl md:text-6xl font-black text-white mb-8 text-balance leading-tight tracking-tighter">
            Ready to Start Your Journey?
          </h2>
          <p className="text-lg md:text-xl text-white/90 mb-12 text-balance max-w-2xl mx-auto leading-relaxed">
            Join millions of travelers who trust Travoss for their travel needs. Your next adventure is just a click away.
          </p>
          <Link
            to="/agencies"
            className="inline-flex items-center gap-3 px-10 py-5 bg-white text-indigo-600 font-bold rounded-xl btn-lift shadow-soft-lg hover:shadow-soft-xl transition-all duration-300 text-xl glow-on-hover group relative overflow-hidden dark:text-indigo-400"
          >
            {/* Shimmer effect */}
            <span className="absolute inset-0 bg-gradient-to-r from-transparent via-indigo-200/30 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-700"></span>
            <span className="relative flex items-center gap-3">
              Find Your Agency Now
              <ArrowRight size={26} className="group-hover:translate-x-1.5 transition-transform duration-300" />
            </span>
          </Link>
        </div>
      </section>
    </main>
  )
}

