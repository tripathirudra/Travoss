import { useState } from "react"
import { Link, useLocation } from "react-router-dom"
import { Menu, X, User, Building2, ChevronDown, MapPin, Sun, Moon } from "lucide-react"
import LoginModal from "./LoginModal"
import RegisterModal from "./RegisterModal"
import AgencyLoginModal from "./AgencyLoginModal"
import AgencyRegisterModal from "./AgencyRegisterModal"
import Sidebar from "./Sidebar"
import useAuth from "../hooks/useAuth"
import { useTheme } from "../context/ThemeContext"

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [showRegisterModal, setShowRegisterModal] = useState(false)
  const [showAgencyLoginModal, setShowAgencyLoginModal] = useState(false)
  const [showAgencyRegisterModal, setShowAgencyRegisterModal] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [agencyMenuOpen, setAgencyMenuOpen] = useState(false)
  const location = useLocation()
  const { isAuthenticated, user, logout } = useAuth()
  const { theme, toggleTheme } = useTheme()

  const links = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/services", label: "Services" },
    { href: "/contact", label: "Contact Us" },
  ]

  const isActive = (href) => location.pathname === href

  return (
    <>
      <nav className="fixed top-0 w-full glass-navbar z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20"> {/* Increased height */}
            <Link
              to="/"
              className="flex items-center gap-3 hover:opacity-90 transition-opacity duration-200 group"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center shadow-soft group-hover:shadow-soft-lg transition-shadow duration-300">
                <span className="text-white font-black text-lg">T</span>
              </div>
              <span className="font-bold text-xl hidden sm:inline bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent dark:text-white">Travoss</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-2">
              {links.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-300 ease-out relative group ${
                    isActive(link.href)
                      ? "text-blue-600 dark:text-blue-400"
                      : "text-foreground/60 hover:text-blue-600 dark:text-gray-300 dark:hover:text-white"
                  }`}
                >
                  {link.label}
                  <span className={`absolute bottom-1 left-1/2 -translate-x-1/2 h-0.5 bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-300 ${
                    isActive(link.href) ? "w-4" : "w-0 group-hover:w-4"
                  }`}></span>
                </Link>
              ))}
              {isAuthenticated && (
                <>
                <Link
                  to="/user/profile"
                  className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-300 ease-out relative group ${
                    isActive("/user/profile")
                      ? "text-blue-600 dark:text-blue-400"
                      : "text-foreground/60 hover:text-blue-600 dark:text-gray-300 dark:hover:text-white"
                  }`}
                >
                  <User size={18} />
                  Profile
                  <span className={`absolute bottom-1 left-1/2 -translate-x-1/2 h-0.5 bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-300 ${
                    isActive("/user/profile") ? "w-4" : "w-0 group-hover:w-4"
                  }`}></span>
                </Link>
                <Link
                  to="/user/agencies-near-you"
                  className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-300 ease-out relative group ${
                    isActive("/user/agencies-near-you")
                      ? "text-blue-600 dark:text-blue-400"
                      : "text-foreground/60 hover:text-blue-600 dark:text-gray-300 dark:hover:text-white"
                  }`}
                >
                  <MapPin size={18} />
                  Agencies Near You
                  <span className={`absolute bottom-1 left-1/2 -translate-x-1/2 h-0.5 bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-300 ${
                    isActive("/user/agencies-near-you") ? "w-4" : "w-0 group-hover:w-4"
                  }`}></span>
                </Link>
                </>
              )}
            </div>

            {/* Right Side Menu */}
            <div className="hidden md:flex gap-2 items-center">
            <button
                onClick={toggleTheme}
                className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
              >
                {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
              </button>
              {!isAuthenticated ? (
                <>
                  {/* User Dropdown */}
                  <div className="relative">
                    <button
                      onClick={() => {
                        setUserMenuOpen(!userMenuOpen)
                        setAgencyMenuOpen(false)
                      }}
                      className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-foreground/70 rounded-lg hover:text-blue-600 hover:bg-blue-50/50 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-700 transition-all duration-300 group"
                    >
                      <User size={18} />
                      User
                      <ChevronDown size={16} className={`transition-transform duration-300 ${userMenuOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {userMenuOpen && (
                      <div className="absolute right-0 top-12 glass-navbar rounded-lg shadow-soft-lg p-2 w-44 animate-in fade-in slide-in-from-top-2 duration-200 z-50">
                        <button
                          onClick={() => {
                            setUserMenuOpen(false)
                            setShowLoginModal(true)
                          }}
                          className="w-full text-left px-4 py-2 text-sm font-medium text-foreground/70 rounded hover:text-blue-600 hover:bg-blue-50 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-700 transition-all duration-200"
                        >
                          Login
                        </button>
                        <button
                          onClick={() => {
                            setUserMenuOpen(false)
                            setShowRegisterModal(true)
                          }}
                          className="w-full text-left px-4 py-2 text-sm font-medium text-foreground/70 rounded hover:text-blue-600 hover:bg-blue-50 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-700 transition-all duration-200 mt-2"
                        >
                          Register
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Agency Dropdown */}
                  <div className="relative">
                    <button
                      onClick={() => {
                        setAgencyMenuOpen(!agencyMenuOpen)
                        setUserMenuOpen(false)
                      }}
                      className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-foreground/70 rounded-lg hover:text-blue-600 hover:bg-blue-50/50 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-700 transition-all duration-300 group"
                      
                    >
                      <Building2 size={18} />
                      Agency
                      <ChevronDown size={16} className={`transition-transform duration-300 ${agencyMenuOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {agencyMenuOpen && (
                      <div className="absolute right-0 top-12 glass-navbar rounded-lg shadow-soft-lg p-2 w-44 animate-in fade-in slide-in-from-top-2 duration-200 z-50">
                        <button
                          onClick={() => {
                            setAgencyMenuOpen(false)
                            setShowAgencyLoginModal(true)
                          }}
                          className="w-full text-left px-4 py-2 text-sm font-medium text-foreground/70 rounded hover:text-blue-600 hover:bg-blue-50 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-700 transition-all duration-200"
                        >
                          Login
                        </button>
                        <button
                          onClick={() => {
                            setAgencyMenuOpen(false)
                            setShowAgencyRegisterModal(true)
                          }}
                          className="w-full text-left px-4 py-2 text-sm font-medium text-foreground/70 rounded hover:text-blue-600 hover:bg-blue-50 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-700 transition-all duration-200 mt-2"
                        >
                          Register
                        </button>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div className="flex items-center gap-3">
                  <span className="text-sm text-foreground/70 dark:text-gray-300">
                    {user?.firstName} {user?.lastName}
                  </span>
                  <button
                    onClick={logout}
                    className="px-4 py-2 text-sm font-medium text-red-600 border border-red-500/30 rounded-lg hover:bg-red-500/5 transition-all"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Mobile Navigation */}
          {isOpen && (
            <div className="md:hidden pb-4 space-y-2">
              {links.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className={`block px-4 py-2 text-sm rounded-lg transition-all duration-300 ease-out ${
                    isActive(link.href)
                      ? "border border-primary text-primary bg-primary/5"
                      : "text-foreground/70 border border-border hover:border-primary hover:text-primary hover:bg-primary/5"
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              
              {isAuthenticated && (
                <button
                  onClick={() => {
                    setIsOpen(false)
                    setSidebarOpen(true)
                  }}
                  className="w-full text-left px-4 py-2 text-sm font-medium text-foreground/70 border border-border rounded-lg hover:border-primary hover:text-primary hover:bg-primary/5 transition-all"
                >
                  Open Menu
                </button>
              )}

              {!isAuthenticated ? (
                <div className="space-y-2 pt-2 border-t border-border mt-2">
                  <div className="font-semibold text-sm text-foreground/60 px-4 py-2">User</div>
                  <button
                    onClick={() => {
                      setIsOpen(false)
                      setShowLoginModal(true)
                    }}
                    className="w-full text-left px-4 py-2 text-sm font-medium text-foreground/70 border border-border rounded-lg hover:border-primary hover:text-primary hover:bg-primary/5 transition-all"
                  >
                    User Login
                  </button>
                  <button
                    onClick={() => {
                      setIsOpen(false)
                      setShowRegisterModal(true)
                    }}
                    className="w-full text-left px-4 py-2 text-sm font-medium text-foreground/70 border border-border rounded-lg hover:border-primary hover:text-primary hover:bg-primary/5 transition-all"
                  >
                    User Register
                  </button>

                  <div className="font-semibold text-sm text-foreground/60 px-4 py-2 mt-4">Agency</div>
                  <button
                    onClick={() => {
                      setIsOpen(false)
                      setShowAgencyLoginModal(true)
                    }}
                    className="w-full text-left px-4 py-2 text-sm font-medium text-foreground/70 border border-border rounded-lg hover:border-primary hover:text-primary hover:bg-primary/5 transition-all"
                  >
                    Agency Login
                  </button>
                  <button
                    onClick={() => {
                      setIsOpen(false)
                      setShowAgencyRegisterModal(true)
                    }}
                    className="w-full text-left px-4 py-2 text-sm font-medium text-foreground/70 border border-border rounded-lg hover:border-primary hover:text-primary hover:bg-primary/5 transition-all"
                  >
                    Agency Register
                  </button>
                </div>
              ) : (
                <div className="space-y-2 pt-2 border-t border-border mt-2">
                  <div className="px-4 py-2 text-sm text-foreground/70">
                    {user?.firstName} {user?.lastName}
                  </div>
                  <button
                    onClick={() => {
                      setIsOpen(false)
                      logout()
                    }}
                    className="w-full text-left px-4 py-2 text-sm font-medium text-red-600 border border-red-500/30 rounded-lg hover:bg-red-500/5 transition-all"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </nav>

      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Modals */}
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onSwitchToRegister={() => {
          setShowLoginModal(false)
          setShowRegisterModal(true)
        }}
      />

      <RegisterModal
        isOpen={showRegisterModal}
        onClose={() => setShowRegisterModal(false)}
        onSwitchToLogin={() => {
          setShowRegisterModal(false)
          setShowLoginModal(true)
        }}
      />

      <AgencyLoginModal
        isOpen={showAgencyLoginModal}
        onClose={() => setShowAgencyLoginModal(false)}
        onSwitchToRegister={() => {
          setShowAgencyLoginModal(false)
          setShowAgencyRegisterModal(true)
        }}
      />

      <AgencyRegisterModal
        isOpen={showAgencyRegisterModal}
        onClose={() => setShowAgencyRegisterModal(false)}
        onSwitchToLogin={() => {
          setShowAgencyRegisterModal(false)
          setShowAgencyLoginModal(true)
        }}
      />
    </>
  )
}
