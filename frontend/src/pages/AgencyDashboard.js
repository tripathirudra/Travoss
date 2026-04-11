import { Routes, Route, Link, useLocation } from "react-router-dom"
import { useState } from "react"
import { 
  LayoutDashboard, FileText, CheckSquare, Car, Users as UsersIcon, 
  DollarSign, Bell, User, MessageCircle, LogOut, Menu, X 
} from "lucide-react"
import { agencyAuthService } from "../services/agencyAuthService"

// Import Agency Pages
import AgencyDashboardHome from "./agency/AgencyDashboardHome"
import AgencyRideRequests from "./agency/AgencyRideRequests"
import AgencyAcceptedRides from "./agency/AgencyAcceptedRides"
import AgencyVehicles from "./agency/AgencyVehicles"
import AgencyDrivers from "./agency/AgencyDrivers"
import AgencyEarnings from "./agency/AgencyEarnings"
import AgencyNotifications from "./agency/AgencyNotifications"
import AgencyProfile from "./agency/AgencyProfile"
import AgencySupport from "./agency/AgencySupport"

export default function AgencyDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const location = useLocation()
  const agency = agencyAuthService.getCurrentUser()

  const navigation = [
    { name: "Dashboard", href: "/agency/dashboard", icon: LayoutDashboard },
    { name: "Ride Requests", href: "/agency/dashboard/ride-requests", icon: FileText },
    { name: "Accepted Rides", href: "/agency/dashboard/accepted-rides", icon: CheckSquare },
    { name: "Vehicles", href: "/agency/dashboard/vehicles", icon: Car },
    { name: "Drivers", href: "/agency/dashboard/drivers", icon: UsersIcon },
    { name: "Earnings", href: "/agency/dashboard/earnings", icon: DollarSign },
    { name: "Notifications", href: "/agency/dashboard/notifications", icon: Bell },
    { name: "Profile", href: "/agency/dashboard/profile", icon: User },
    { name: "Support", href: "/agency/dashboard/support", icon: MessageCircle },
  ]

  const handleLogout = () => {
    agencyAuthService.logout()
    window.location.href = "/"
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 bg-white rounded-lg shadow-lg border border-border"
        >
          {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 z-40 w-64 h-screen transition-transform bg-white border-r border-border
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="h-full px-3 py-4 overflow-y-auto flex flex-col">
          {/* Logo */}
          <div className="flex items-center gap-2 px-3 mb-8">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">T</span>
            </div>
            <div>
              <div className="font-bold text-lg">Travoss</div>
              <div className="text-xs text-foreground/60">Agency Panel</div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="space-y-2 flex-1">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`
                    flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all
                    ${isActive 
                      ? 'bg-primary text-white font-medium' 
                      : 'text-foreground/70 hover:bg-primary/5 hover:text-primary'
                    }
                  `}
                >
                  <item.icon size={20} />
                  <span>{item.name}</span>
                </Link>
              )
            })}
          </nav>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-red-600 hover:bg-red-500/10 transition-all w-full mt-4"
          >
            <LogOut size={20} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="lg:ml-64">
        {/* Top Bar */}
        <header className="bg-white border-b border-border px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                {navigation.find(n => n.href === location.pathname)?.name || 'Dashboard'}
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-sm font-medium">{agency?.agencyName}</div>
                <div className="text-xs text-foreground/60">{agency?.email}</div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">
          <Routes>
            <Route path="/" element={<AgencyDashboardHome />} />
            <Route path="/ride-requests" element={<AgencyRideRequests />} />
            <Route path="/accepted-rides" element={<AgencyAcceptedRides />} />
            <Route path="/vehicles" element={<AgencyVehicles />} />
            <Route path="/drivers" element={<AgencyDrivers />} />
            <Route path="/earnings" element={<AgencyEarnings />} />
            <Route path="/notifications" element={<AgencyNotifications />} />
            <Route path="/profile" element={<AgencyProfile />} />
            <Route path="/support" element={<AgencySupport />} />
          </Routes>
        </main>
      </div>

      {/* Backdrop for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  )
}

