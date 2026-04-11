import { Link } from "react-router-dom"
import { Car, Home, Mountain, ArrowRight } from "lucide-react"

export default function Services() {
  const services = [
    {
      title: "Need a Ride",
      description: "Book rides from verified travel agencies across India. Safe, comfortable, and affordable transportation for all your travel needs.",
      icon: Car,
      color: "from-blue-500 to-blue-600",
      features: ["Verified Agencies", "Real-time Booking", "Safe & Reliable"],
      status: "active",
      link: "/user/book-ride",
    },
    {
      title: "Need a Hotel",
      description: "Book from thousands of hotels worldwide with best price guarantees and instant confirmation. Coming Soon!",
      icon: Home,
      color: "from-rose-500 to-pink-600",
      features: ["Best Rates", "Instant Booking", "24/7 Support"],
      status: "coming-soon",
      link: "#",
    },
    {
      title: "Tourism Package",
      description: "Complete travel packages including transport, stay, and sightseeing. All-inclusive experiences. Coming Soon!",
      icon: Mountain,
      color: "from-green-500 to-emerald-600",
      features: ["All-Inclusive", "Custom Itineraries", "Local Guides"],
      status: "coming-soon",
      link: "#",
    },
  ]

  const whyChooseUs = [
    {
      title: "Best Price Guarantee",
      description: "We ensure you get the best deals with our price match guarantee.",
      emoji: "💰",
    },
    {
      title: "24/7 Customer Support",
      description: "Our dedicated team is always available to assist you.",
      emoji: "🎧",
    },
    {
      title: "Secure Payments",
      description: "Your transactions are safe with our encrypted payment gateway.",
      emoji: "🔒",
    },
    {
      title: "Verified Agencies",
      description: "All our partner agencies are thoroughly verified and certified.",
      emoji: "✅",
    },
  ]

  return (
    <main className="pt-20 pb-20">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary via-blue-600 to-purple-600 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{ 
            backgroundImage: 'radial-gradient(circle at 20% 50%, white 1px, transparent 1px)',
            backgroundSize: '40px 40px'
          }} />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Our Services</h1>
            <p className="text-lg md:text-xl text-white/90 max-w-3xl mx-auto">
              Comprehensive travel solutions tailored to your unique needs and preferences
            </p>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, idx) => (
            <div
              key={idx}
              className="bg-white p-6 border border-border rounded-2xl hover:shadow-2xl hover:border-primary transition-all duration-300 group relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 opacity-5 transform translate-x-8 -translate-y-8">
                <service.icon size={128} />
              </div>
              <div className={`w-16 h-16 bg-gradient-to-br ${service.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform relative z-10`}>
                <service.icon className="text-white" size={32} />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
                {service.title}
              </h3>
              <p className="text-sm text-foreground/70 mb-6 leading-relaxed">{service.description}</p>
              <ul className="space-y-2 mb-6">
                {service.features.map((feature, fIdx) => (
                  <li key={fIdx} className="flex items-center gap-2 text-sm text-foreground/80">
                    <span className="w-1.5 h-1.5 bg-primary rounded-full"></span>
                    {feature}
                  </li>
                ))}
              </ul>
              
              {service.status === "active" ? (
                <>
                  <div className="mb-4">
                    <span className="inline-block px-3 py-1 bg-green-500/10 border border-green-500/30 text-green-600 text-xs font-semibold rounded-lg">
                      ✓ ACTIVE
                    </span>
                  </div>
                  <Link
                    to={service.link}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-white font-semibold rounded-xl hover:opacity-90 transition-all text-sm"
                  >
                    Get Started
                    <ArrowRight size={18} />
                  </Link>
                </>
              ) : (
                <>
                  <div className="mb-4">
                    <span className="inline-block px-3 py-1 bg-foreground/10 text-foreground/60 text-xs font-semibold rounded-lg">
                      COMING SOON
                    </span>
                  </div>
                  <span className="inline-flex items-center gap-2 text-foreground/40 font-semibold cursor-not-allowed">
                    Coming Soon
                  </span>
                </>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-16 bg-gradient-to-b from-blue-50/30 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">Why Choose Travoss</h2>
            <p className="text-lg text-foreground/70">We go the extra mile to ensure your satisfaction</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {whyChooseUs.map((item, idx) => (
              <div
                key={idx}
                className="bg-white p-6 rounded-2xl border border-border hover:shadow-xl transition-all duration-300 text-center group"
              >
                <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">{item.emoji}</div>
                <h3 className="text-lg font-bold text-foreground mb-2">{item.title}</h3>
                <p className="text-sm text-foreground/70">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-primary to-purple-600 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{ 
            backgroundImage: 'radial-gradient(circle at 30% 50%, white 2px, transparent 2px)',
            backgroundSize: '60px 60px'
          }} />
        </div>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Start Your Journey?
          </h2>
          <p className="text-lg text-white/90 mb-8">
            Connect with verified travel agencies and book your dream vacation today
          </p>
          <Link
            to="/user/book-ride"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-primary font-bold rounded-xl hover:shadow-2xl hover:scale-105 transition-all duration-300"
          >
            Book a Ride Now
            <ArrowRight size={24} />
          </Link>
        </div>
      </section>
    </main>
  )
}
