import { useEffect } from "react"
import { Target, Eye, Heart, Award, Users, TrendingUp, Shield, Zap } from "lucide-react"

export default function About() {
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // Entry is visible
        }
      })
    })

    document.querySelectorAll(".animate-on-scroll").forEach((el) => {
      observer.observe(el)
    })

    return () => observer.disconnect()
  }, [])

  const teamMembers = [
    {
      name: "Ayush Tripathi",
      role: "Founder & CEO",
      image: "👨‍💼",
      description: "Visionary leader with 15+ years in travel industry",
    },
    {
      name: "Ayansh Yadav",
      role: "Head of Operations",
      image: "👨‍💼",
      description: "Expert in streamlining travel operations",
    },
    {
      name: "Ansh Sristava",
      role: "Technology Lead",
      image: "👨‍💻",
      description: "Tech innovator building seamless experiences",
    },
    {
      name: "Anand Upadhyay",
      role: "Customer Success",
      image: "👨‍💼",
      description: "Dedicated to ensuring customer satisfaction",
    },
  ]

  const achievements = [
    { icon: Users, label: "Active Users", value: "10M+" },
    { icon: Award, label: "Awards Won", value: "25+" },
    { icon: TrendingUp, label: "Growth Rate", value: "150%" },
    { icon: Shield, label: "Trust Score", value: "4.9/5" },
  ]

  const values = [
    {
      icon: Heart,
      title: "Customer First",
      description: "Every decision we make is centered around delivering the best experience for our customers.",
      color: "from-red-500 to-pink-600",
    },
    {
      icon: Shield,
      title: "Trust & Security",
      description: "We verify every agency thoroughly to ensure your safety and provide secure transactions.",
      color: "from-blue-500 to-blue-600",
    },
    {
      icon: Zap,
      title: "Innovation",
      description: "We continuously evolve our platform with cutting-edge technology for better service.",
      color: "from-yellow-500 to-orange-600",
    },
    {
      icon: Users,
      title: "Accessibility",
      description: "Making quality travel services accessible to everyone, everywhere across India.",
      color: "from-green-500 to-emerald-600",
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
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">About Travoss</h1>
            <p className="text-lg md:text-xl text-white/90 max-w-3xl mx-auto leading-relaxed">
              India's most trusted platform connecting travelers with verified travel agencies
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="py-16 bg-gradient-to-b from-white to-blue-50/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="bg-white p-8 rounded-3xl border border-border hover:shadow-2xl transition-all duration-300 group">
              <div className="w-16 h-16 bg-gradient-to-br from-primary to-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Target className="text-white" size={32} />
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-4">Our Mission</h2>
              <p className="text-base text-foreground/70 leading-relaxed mb-4">
                To democratize travel by connecting every traveler in India with verified, trustworthy travel agencies,
                making travel planning accessible, affordable, and hassle-free.
              </p>
              <p className="text-base text-foreground/70 leading-relaxed">
                We believe travel should be an experience to cherish, not a challenge to overcome.
              </p>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-border hover:shadow-2xl transition-all duration-300 group">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Eye className="text-white" size={32} />
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-4">Our Vision</h2>
              <p className="text-base text-foreground/70 leading-relaxed mb-4">
                To become India's leading travel ecosystem, empowering millions of travelers and thousands of agencies
                with technology-driven solutions.
              </p>
              <p className="text-base text-foreground/70 leading-relaxed">
                We envision a future where every journey begins with Travoss.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Achievements */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">Our Achievements</h2>
            <p className="text-lg text-foreground/70">Milestones that make us proud</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {achievements.map((achievement, idx) => (
              <div
                key={idx}
                className="text-center p-8 bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl hover:shadow-xl transition-all duration-300 group"
              >
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-primary to-purple-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <achievement.icon className="text-white" size={28} />
                </div>
                <p className="text-3xl font-bold gradient-primary bg-clip-text text-transparent mb-1">
                  {achievement.value}
                </p>
                <p className="text-sm text-foreground/70 font-medium">{achievement.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-gradient-to-b from-blue-50/30 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">Our Core Values</h2>
            <p className="text-lg text-foreground/70">The principles that guide everything we do</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, idx) => (
              <div
                key={idx}
                className="bg-white p-6 rounded-2xl border border-border hover:shadow-2xl hover:border-primary transition-all duration-300 group"
              >
                <div className={`w-14 h-14 bg-gradient-to-br ${value.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  <value.icon className="text-white" size={28} />
                </div>
                <h3 className="text-lg font-bold text-foreground mb-2">{value.title}</h3>
                <p className="text-sm text-foreground/70 leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">Meet Our Team</h2>
            <p className="text-lg text-foreground/70">Passionate individuals driving innovation</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, idx) => (
              <div
                key={idx}
                className="bg-gradient-to-br from-blue-50 to-purple-50 p-8 rounded-2xl border border-border hover:shadow-2xl transition-all duration-300 text-center group"
              >
                <div className="text-6xl mb-4 group-hover:scale-110 transition-transform">{member.image}</div>
                <h3 className="text-lg font-bold text-foreground mb-1">{member.name}</h3>
                <p className="text-primary font-semibold mb-2">{member.role}</p>
                <p className="text-sm text-foreground/70">{member.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Our Story</h2>
          </div>
          <div className="prose max-w-none">
            <p className="text-base text-foreground/70 leading-relaxed mb-6">
              Travoss was born from a simple observation: finding reliable travel agencies in India was unnecessarily
              complicated. In 2020, our founder Adarsh Singh, a passionate traveler himself, experienced firsthand the
              challenges of connecting with trustworthy travel agencies.
            </p>
            <p className="text-base text-foreground/70 leading-relaxed mb-6">
              What started as a small directory of verified agencies has grown into India's largest travel ecosystem,
              serving over 10 million travelers annually. Today, we're proud to partner with 500+ verified agencies
              across all 28 states and 8 union territories.
            </p>
            <p className="text-base text-foreground/70 leading-relaxed mb-6">
              Our journey has just begun. We're committed to revolutionizing how India travels, one journey at a time.
            </p>
          </div>
        </div>
      </section>
    </main>
  )
}
