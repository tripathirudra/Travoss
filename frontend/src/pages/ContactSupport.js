import { useState } from "react"
import { Mail, Phone, MessageCircle, Send, HelpCircle } from "lucide-react"

export default function ContactSupport() {
  const [formData, setFormData] = useState({
    subject: "",
    message: "",
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => {
      setSuccess(true)
      setLoading(false)
      setFormData({ subject: "", message: "" })
      setTimeout(() => setSuccess(false), 3000)
    }, 1000)
  }

  const faqs = [
    { q: "How do I track my ride?", a: "You can track your ride in real-time from your bookings section." },
    { q: "What if I need to cancel?", a: "Cancellation is free up to 2 hours before the ride. Contact support for urgent cancellations." },
    { q: "How are payments handled?", a: "Payments are processed securely. You can pay via UPI, cards, or net banking." },
  ]

  return (
    <main className="pt-20 pb-20 min-h-screen bg-gradient-to-b from-white to-blue-50/30">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Contact Cards */}
          <div className="bg-white rounded-2xl border border-border shadow-lg p-6 text-center">
            <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="text-white" size={28} />
            </div>
            <h3 className="font-bold text-foreground mb-2">Email Us</h3>
            <p className="text-sm text-foreground/70 mb-2">support@travoss.com</p>
            <p className="text-xs text-foreground/60">Response within 24h</p>
          </div>

          <div className="bg-white rounded-2xl border border-border shadow-lg p-6 text-center">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Phone className="text-white" size={28} />
            </div>
            <h3 className="font-bold text-foreground mb-2">Call Us</h3>
            <p className="text-sm text-foreground/70 mb-2">+91 (555) 123-4567</p>
            <p className="text-xs text-foreground/60">Mon-Sat, 9 AM - 6 PM</p>
          </div>

          <div className="bg-white rounded-2xl border border-border shadow-lg p-6 text-center">
            <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageCircle className="text-white" size={28} />
            </div>
            <h3 className="font-bold text-foreground mb-2">Live Chat</h3>
            <p className="text-sm text-foreground/70 mb-2">Chat with our team</p>
            <p className="text-xs text-foreground/60">Available 24/7</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Support Form */}
          <div className="bg-white rounded-3xl border border-border shadow-lg p-8">
            <h2 className="text-2xl font-bold text-foreground mb-6">Send us a message</h2>

            {success && (
              <div className="mb-4 p-4 bg-green-500/10 border border-green-500/30 rounded-xl text-green-600">
                ✓ Message sent successfully! We'll get back to you soon.
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">Subject *</label>
                <input
                  type="text"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  placeholder="What do you need help with?"
                  className="w-full px-4 py-3 border border-border rounded-xl bg-background text-foreground placeholder-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">Message *</label>
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Describe your issue..."
                  rows="5"
                  className="w-full px-4 py-3 border border-border rounded-xl bg-background text-foreground placeholder-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all resize-none"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full px-6 py-4 bg-primary text-white font-bold rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? "Sending..." : (
                  <>
                    <Send size={20} />
                    Send Message
                  </>
                )}
              </button>
            </form>
          </div>

          {/* FAQ */}
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-6">
              <HelpCircle className="inline mr-2" size={28} />
              Quick FAQ
            </h2>
            <div className="space-y-4">
              {faqs.map((faq, idx) => (
                <details
                  key={idx}
                  className="bg-white border border-border rounded-xl p-5 cursor-pointer hover:border-primary transition-all"
                >
                  <summary className="font-semibold text-foreground list-none flex items-center justify-between">
                    <span>{faq.q}</span>
                    <span className="text-primary text-xl">+</span>
                  </summary>
                  <p className="text-foreground/70 mt-4 leading-relaxed">{faq.a}</p>
                </details>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

