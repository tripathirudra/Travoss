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
      {/* Hero Section with Premium Gradient */}
      <section className="relative min-h-[95vh] flex items-center justify-center overflow-hidden bg-background dark:bg-gray-900">
        {/* Premium Layered Gradients & Pattern */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-blue-50 via-background to-indigo-50 dark:from-blue-900/20 dark:via-gray-900 dark:to-indigo-900/20"></div>
          <div 
            className="absolute inset-0 opacity-50 dark:opacity-30"
            style={{
              backgroundImage: 'radial-gradient(circle at 25% 25%, hsla(220, 85%, 55%, 0.1) 0%, transparent 50%)',
            }}
          />
        </div>

        {/* Parallax Background Image */}
        <div className="absolute inset-0 z-0" style={{ transform: `translateY(${scrollY * 0.4}px)` }}>
          <div className="absolute inset-0 bg-gradient-to-br from-blue-400/5 via-transparent to-purple-500/5" />
          <img
            src="/assets/india-travel-destinations.jpg"
            alt="Travel destination"
            className="w-full h-full object-cover opacity-10 dark:opacity-5"
          />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 text-center px-4 max-w-5xl">
          {/* Main Heading with Smooth Fade Animation */}
          <h1 className="animate-hero-title text-5xl md:text-8xl font-black text-foreground mb-6 text-balance leading-tight tracking-tighter dark:text-white">
            Discover Your Next
            <span className="block gradient-text mt-2">Adventure</span>
          </h1>

          {/* Subtitle with Delayed Animation */}
          <p className="animate-hero-subtitle text-lg md:text-xl text-foreground/70 mb-12 text-balance max-w-3xl mx-auto leading-relaxed dark:text-gray-300">
            Connect with 500+ verified travel agencies across India and plan unforgettable journeys with confidence and ease.
          </p>

          {/* Buttons with Staggered Animation */}
          <div className="animate-hero-buttons flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Link
              to="/agencies"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-bold rounded-xl btn-lift shadow-soft hover:shadow-soft-lg transition-all duration-300 group relative overflow-hidden text-lg"
            >
              {/* Shimmer effect */}
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-700"></span>
              <span className="relative flex items-center gap-2">
                Explore Agencies
                <ArrowRight size={22} className="group-hover:translate-x-1.5 transition-transform duration-300" />
              </span>
            </Link>
            <Link
              to="/services"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-blue-600 border-2 border-blue-500 font-bold rounded-xl hover:bg-blue-50 hover:text-blue-700 transition-all duration-300 shadow-soft group text-lg dark:bg-gray-800 dark:text-white dark:border-blue-400 dark:hover:bg-gray-700"
            >
              View Services
            </Link>
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

