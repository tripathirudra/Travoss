import { useState } from "react"
import { Send, HelpCircle, Mail, Phone } from "lucide-react"

export default function AgencySupport() {
  const [formData, setFormData] = useState({ subject: "", message: "" })
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
    { q: "How do I accept a ride request?", a: "Go to 'Ride Requests' and click the 'Accept' button on any request." },
    { q: "How are payments processed?", a: "Payments are processed directly after ride completion. Earnings reflect in your dashboard." },
    { q: "Can I add multiple vehicles?", a: "Yes! Go to the 'Vehicles' section and click 'Add Vehicle' to add as many as you need." },
  ]

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-border shadow-lg p-6">
          <h3 className="text-xl font-bold text-foreground mb-6">Contact Support</h3>

          {success && (
            <div className="mb-4 p-4 bg-green-500/10 border border-green-500/30 rounded-xl text-green-600">
              ✓ Message sent! We'll respond soon.
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">Subject</label>
              <input
                type="text"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                className="w-full px-4 py-3 border border-border rounded-xl bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">Message</label>
              <textarea
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                rows="4"
                className="w-full px-4 py-3 border border-border rounded-xl bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full px-6 py-3 bg-primary text-white font-medium rounded-xl hover:opacity-90 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? "Sending..." : (
                <>
                  <Send size={20} />
                  Send Message
                </>
              )}
            </button>
          </form>

          <div className="mt-6 space-y-3">
            <div className="flex items-center gap-3 text-foreground/70">
              <Mail size={20} />
              <span>support@travoss.com</span>
            </div>
            <div className="flex items-center gap-3 text-foreground/70">
              <Phone size={20} />
              <span>+91 (555) 123-4567</span>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-xl font-bold text-foreground mb-6">
            <HelpCircle className="inline mr-2" size={24} />
            FAQ
          </h3>
          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <details
                key={idx}
                className="bg-white border border-border rounded-xl p-5 cursor-pointer hover:border-primary transition-all"
              >
                <summary className="font-semibold text-foreground list-none">
                  {faq.q}
                </summary>
                <p className="text-foreground/70 mt-3">{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

