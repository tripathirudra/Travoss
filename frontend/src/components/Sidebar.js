import { X, User, MapPin, MessageCircle, LogOut } from "lucide-react"
import { Link } from "react-router-dom"
import useAuth from "../hooks/useAuth"

export default function Sidebar({ isOpen, onClose }) {
  const { isAuthenticated, logout } = useAuth()
  const userType = localStorage.getItem("userType")

  if (!isOpen) return null

  const handleLogout = () => {
    logout()
    onClose()
    window.location.href = "/"
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 z-40 animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Sidebar */}
      <div className="fixed left-0 top-0 h-full w-80 bg-background border-r border-border z-50 shadow-xl animate-in slide-in-from-left duration-300 overflow-y-auto">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-border">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">T</span>
              </div>
              <span className="font-bold text-lg text-foreground">Travoss</span>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-foreground/60 hover:text-foreground transition-colors"
              aria-label="Close sidebar"
            >
              <X size={24} />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 p-6">
            {isAuthenticated && userType === "user" ? (
              <>
                {/* User Dashboard Navigation */}
                <div className="space-y-2">
                  <h3 className="text-sm font-semibold text-foreground/60 mb-3">DASHBOARD</h3>
                  
                  <Link
                    to="/user/profile"
                    onClick={onClose}
                    className="flex items-center gap-3 px-4 py-3 text-foreground/70 border border-border rounded-lg hover:border-primary hover:text-primary hover:bg-primary/5 transition-all"
                  >
                    <User size={20} />
                    <span className="font-medium">Profile</span>
                  </Link>
                  <Link
                    to="/user/agencies-near-you"
                    onClick={onClose}
                    className="flex items-center gap-3 px-4 py-3 text-foreground/70 border border-border rounded-lg hover:border-primary hover:text-primary hover:bg-primary/5 transition-all"
                  >
                    <MapPin size={20} />
                    <span className="font-medium">Agencies Near You</span>
                  </Link>

                  <Link
                    to="/user/contact-support"
                    onClick={onClose}
                    className="flex items-center gap-3 px-4 py-3 text-foreground/70 border border-border rounded-lg hover:border-primary hover:text-primary hover:bg-primary/5 transition-all"
                  >
                    <MessageCircle size={20} />
                    <span className="font-medium">Contact Support</span>
                  </Link>
                </div>
              </>
            ) : isAuthenticated && userType === "agency" ? (
              <>
                {/* Agency Dashboard Link */}
                <div className="space-y-2">
                  <h3 className="text-sm font-semibold text-foreground/60 mb-3">AGENCY PANEL</h3>
                  <Link
                    to="/agency/dashboard"
                    onClick={onClose}
                    className="flex items-center gap-3 px-4 py-3 text-primary border border-primary rounded-lg bg-primary/5 font-medium"
                  >
                    Go to Agency Dashboard
                  </Link>
                </div>
              </>
            ) : (
              <>
                {/* Public Sidebar Content */}
                <div className="space-y-6">
                  <div>
                    <h3 className="text-sm font-semibold text-foreground/60 mb-3">ABOUT US</h3>
                    <p className="text-foreground/70 text-sm leading-relaxed">
                      Travoss is your one-stop platform for connecting with verified travel agencies
                      across India. We make travel planning simple, accessible, and hassle-free.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold text-foreground/60 mb-3">QUICK STATS</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center p-3 bg-primary/5 border border-border rounded-lg">
                        <span className="text-foreground/70 text-sm">States & UTs</span>
                        <span className="text-primary font-bold">28+</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-primary/5 border border-border rounded-lg">
                        <span className="text-foreground/70 text-sm">Travel Agencies</span>
                        <span className="text-primary font-bold">500+</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-primary/5 border border-border rounded-lg">
                        <span className="text-foreground/70 text-sm">Happy Travelers</span>
                        <span className="text-primary font-bold">10M+</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold text-foreground/60 mb-3">CONTACT</h3>
                    <div className="space-y-2 text-sm text-foreground/70">
                      <p>
                        <span className="font-medium">Email:</span>
                        <br />
                        travoss.support@gmail.com
                      </p>
                      <p>
                        <span className="font-medium">Phone:</span>
                        <br />
                        +91 (555) 123-4567
                      </p>
                      <p>
                        <span className="font-medium">Address:</span>
                        <br />
                        UCER Naini, Prayagraj
                      </p>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-border">
            {isAuthenticated ? (
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-500/10 text-red-600 border border-red-500/30 font-medium rounded-lg hover:bg-red-500/20 transition-all"
              >
                <LogOut size={20} />
                Sign Out
              </button>
            ) : (
              <Link
                to="/contact"
                onClick={onClose}
                className="w-full block text-center px-4 py-3 bg-primary text-primary-foreground font-medium rounded-lg hover:opacity-90 transition-opacity"
              >
                Get in Touch
              </Link>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

