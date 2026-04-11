import { useState, useRef } from "react"
import { Mail, Phone, MapPin, Send, Globe } from "lucide-react"
import Map, { Marker } from "react-map-gl/mapbox"
import "mapbox-gl/dist/mapbox-gl.css"

const MAPBOX_TOKEN = process.env.REACT_APP_MAPBOX_API_KEY || ""

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState("")
  const [error, setError] = useState("")
  
  const mapRef = useRef()
  
  // Office location - UCER Naini, Prayagraj (dummy coordinates)
  const officeLocation = {
    latitude: 25.3960,
    longitude: 81.8463,
    address: "UCER, Naini, Prayagraj, Uttar Pradesh 211010"
  }
  
  const [viewport, setViewport] = useState({
    latitude: officeLocation.latitude,
    longitude: officeLocation.longitude,
    zoom: 15,
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setTimeout(() => {
      setSuccess("Message sent successfully! We'll get back to you within 24 hours.")
      setFormData({ name: "", email: "", subject: "", message: "" })
      setLoading(false)
      setTimeout(() => setSuccess(""), 5000)
    }, 1000)
  }

  const contactInfo = [
    {
      icon: Mail,
      title: "Email Us",
      details: "support@travoss.com",
      subdetails: "We'll respond within 24 hours",
      color: "from-blue-500 to-blue-600",
    },
    {
      icon: Phone,
      title: "Call Us",
      details: "+91 1234567890",
      subdetails: "Mon-Sat, 9 AM - 6 PM IST",
      color: "from-green-500 to-green-600",
    },
    {
      icon: MapPin,
      title: "Visit Us",
      details: "UCER, Naini",
      subdetails: "Prayagraj, Uttar Pradesh",
      color: "from-purple-500 to-purple-600",
    },
    {
      icon: Globe,
      title: "Social Media",
      details: "@travoss",
      subdetails: "Follow us on all platforms",
      color: "from-pink-500 to-rose-600",
    },
  ]

  const faqs = [
    {
      q: "How do I book a travel package?",
      ans: "Browse our verified agencies, select your preferred one, and contact them directly through our platform. You can also use our booking form to get quotes from multiple agencies.",
    },
    {
      q: "Are all agencies verified?",
      ans: "Yes, absolutely! Every agency on our platform undergoes a thorough verification process including document verification, background checks, and quality assessments.",
    },
    {
      q: "What payment methods do you accept?",
      ans: "We accept all major credit cards, debit cards, UPI, net banking, and popular digital wallets. All transactions are secured with 256-bit encryption.",
    },
    {
      q: "Can I cancel my booking?",
      ans: "Cancellation policies vary by agency and package. Please review the specific terms before booking. Most agencies offer flexible cancellation with partial refunds.",
    },
    {
      q: "Do you provide travel insurance?",
      ans: "Yes! Many of our partner agencies offer comprehensive travel insurance. You can add it during the booking process or contact support for assistance.",
    },
    {
      q: "How can I track my booking?",
      ans: "Once you create an account and make a booking, you can track all your bookings in your dashboard. You'll also receive email and SMS updates.",
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
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Get in Touch</h1>
            <p className="text-lg md:text-xl text-white/90 max-w-3xl mx-auto">
              Have questions? We're here to help 24/7
            </p>
          </div>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-16 bg-gradient-to-b from-white to-blue-50/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {contactInfo.map((info, idx) => (
              <div
                key={idx}
                className="bg-white p-8 rounded-2xl border border-border hover:shadow-2xl transition-all duration-300 text-center group"
              >
                <div className={`w-16 h-16 bg-gradient-to-br ${info.color} rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform`}>
                  <info.icon className="text-white" size={28} />
                </div>
                <h3 className="font-bold text-foreground mb-2">{info.title}</h3>
                <p className="text-foreground font-semibold mb-1 text-sm">{info.details}</p>
                <p className="text-sm text-foreground/60">{info.subdetails}</p>
              </div>
            ))}
          </div>

        

          {/* Contact Form and FAQ */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="bg-white p-8 rounded-3xl border border-border shadow-lg">
              <h2 className="text-2xl font-bold text-foreground mb-4">Send us a Message</h2>
              <p className="text-sm text-foreground/70 mb-6">
                Fill out the form below and our team will get back to you as soon as possible.
              </p>

              {success && (
                <div className="mb-6 p-4 bg-green-500/10 border border-green-500/30 rounded-xl text-green-600 flex items-center gap-2">
                  <span>✓</span>
                  {success}
                </div>
              )}

              {error && (
                <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-600 flex items-center gap-2">
                  <span>⚠️</span>
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">Full Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder=""
                    className="w-full px-4 py-3 border border-border rounded-xl bg-background text-foreground placeholder-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder=""
                    className="w-full px-4 py-3 border border-border rounded-xl bg-background text-foreground placeholder-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">Subject *</label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="How can we help you?"
                    className="w-full px-4 py-3 border border-border rounded-xl bg-background text-foreground placeholder-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">Message *</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Tell us more about your query..."
                    rows="5"
                    className="w-full px-4 py-3 border border-border rounded-xl bg-background text-foreground placeholder-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all resize-none"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full px-6 py-4 gradient-primary text-white font-bold rounded-xl hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send size={20} />
                      Send Message
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* FAQ Section */}
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-4">Frequently Asked Questions</h2>
              <p className="text-sm text-foreground/70 mb-6">
                Quick answers to common questions. Can't find what you're looking for? Contact us!
              </p>
              <div className="space-y-4">
                {faqs.map((faq, idx) => (
                  <details
                    key={idx}
                    className="bg-white border border-border rounded-xl p-5 hover:border-primary transition-all group cursor-pointer"
                  >
                    <summary className="font-semibold text-foreground group-hover:text-primary transition-colors cursor-pointer list-none flex items-center justify-between">
                      <span>{faq.q}</span>
                      <span className="text-primary text-xl">+</span>
                    </summary>
                    <p className="text-sm text-foreground/70 mt-3 leading-relaxed">{faq.ans}</p>
                  </details>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-3">Visit Our Office</h2>
            <p className="text-lg text-foreground/70">We'd love to meet you in person</p>
          </div>
          
          {MAPBOX_TOKEN && MAPBOX_TOKEN !== "MAPBOX_API_KEY" ? (
            <div className="bg-white rounded-3xl overflow-hidden border border-border shadow-xl">
              <div style={{ height: "500px", width: "100%" }}>
                <Map
                  ref={mapRef}
                  {...viewport}
                  onMove={(evt) => setViewport(evt.viewState)}
                  mapStyle="mapbox://styles/mapbox/streets-v12"
                  mapboxAccessToken={MAPBOX_TOKEN}
                >
                  {/* Office Location Marker */}
                  <Marker
                    latitude={officeLocation.latitude}
                    longitude={officeLocation.longitude}
                    anchor="bottom"
                  >
                    <div className="relative">
                      <div className="absolute -top-2 left-1/2 -translate-x-1/2 -translate-y-full mb-2 bg-white px-4 py-2 rounded-lg shadow-lg whitespace-nowrap">
                        <p className="font-bold text-foreground text-sm">Travoss Office</p>
                        <p className="text-xs text-foreground/70">UCER, Naini, Prayagraj</p>
                      </div>
                      <div className="w-12 h-12 bg-primary rounded-full border-4 border-white shadow-lg flex items-center justify-center animate-bounce">
                        <MapPin className="text-white" size={24} />
                      </div>
                    </div>
                  </Marker>
                </Map>
              </div>
            </div>
          ) : (
            <div className="bg-gradient-to-br from-blue-100 to-purple-100 rounded-3xl overflow-hidden border border-border shadow-xl">
              <div className="aspect-[21/9] flex items-center justify-center text-6xl">
                🗺️ <span className="ml-4 text-2xl text-foreground/70">Interactive Map Coming Soon</span>
              </div>
            </div>
          )}
          
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-border text-center hover:shadow-lg transition-all">
              <div className="text-3xl mb-3">🏢</div>
              <h3 className="font-bold text-foreground mb-2">Office Hours</h3>
              <p className="text-sm text-foreground/70">Monday - Saturday<br/>9:00 AM - 6:00 PM</p>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-border text-center hover:shadow-lg transition-all">
              <div className="text-3xl mb-3">🅿️</div>
              <h3 className="font-bold text-foreground mb-2">Parking</h3>
              <p className="text-sm text-foreground/70">Free parking available<br/>for visitors</p>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-border text-center hover:shadow-lg transition-all">
              <div className="text-3xl mb-3">🏠</div>
              <h3 className="font-bold text-foreground mb-2">Amenities</h3>
              <p className="text-sm text-foreground/70">WiFi, refreshments,<br/>and comfortable seating</p>
            </div>
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
            Need Immediate Assistance?
          </h2>
          <p className="text-lg text-white/90 mb-8">
            Our support team is available 24/7 to help with urgent queries
          </p>
          <a
            href="tel:+91 (555) 123-4567"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-primary font-bold rounded-xl hover:shadow-2xl hover:scale-105 transition-all duration-300"
          >
            <Phone size={24} />
            Call Now: +91 1234567890
          </a>
        </div>
      </section>
    </main>
  )
}
