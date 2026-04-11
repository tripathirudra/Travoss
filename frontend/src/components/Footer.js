import { Link } from "react-router-dom"
import { Facebook, Twitter, Instagram, Mail } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-background relative border-t border-gray-100 dark:bg-gray-900 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-10">
          {/* Brand Section */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center shadow-soft hover:shadow-soft-lg transition-shadow duration-300">
                <span className="text-white font-black text-lg">T</span>
              </div>
              <span className="font-bold text-xl bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent dark:text-white">Travoss</span>
            </div>
            <p className="text-foreground/65 mb-8 leading-relaxed max-w-sm text-sm dark:text-gray-400">
              Connect with verified travel agencies across India and plan your perfect journey with confidence and ease.
            </p>
            <div className="flex gap-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-full border border-gray-200 text-foreground/60 hover:text-white hover:bg-blue-600 hover:border-blue-600 transition-all duration-300 transform hover:scale-110 dark:border-gray-700 dark:text-gray-400 dark:hover:text-white dark:hover:bg-blue-600"
                aria-label="Facebook"
              >
                <Facebook size={20} />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-full border border-gray-200 text-foreground/60 hover:text-white hover:bg-sky-500 hover:border-sky-500 transition-all duration-300 transform hover:scale-110 dark:border-gray-700 dark:text-gray-400 dark:hover:text-white dark:hover:bg-sky-500"
                aria-label="Twitter"
              >
                <Twitter size={20} />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-full border border-gray-200 text-foreground/60 hover:text-white hover:bg-pink-600 hover:border-pink-600 transition-all duration-300 transform hover:scale-110 dark:border-gray-700 dark:text-gray-400 dark:hover:text-white dark:hover:bg-pink-600"
                aria-label="Instagram"
              >
                <Instagram size={20} />
              </a>
              <a
                href="mailto:travoss.support@gmail.com"
                className="p-2.5 rounded-full border border-gray-200 text-foreground/60 hover:text-white hover:bg-indigo-600 hover:border-indigo-600 transition-all duration-300 transform hover:scale-110 dark:border-gray-700 dark:text-gray-400 dark:hover:text-white dark:hover:bg-indigo-600"
                aria-label="Email"
              >
                <Mail size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-base text-foreground mb-6 dark:text-white">Quick Links</h3>
            <ul className="space-y-4">
              <li>
                <Link to="/" className="text-foreground/65 hover:text-blue-600 transition-colors duration-200 font-medium text-sm dark:text-gray-400 dark:hover:text-white">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-foreground/65 hover:text-blue-600 transition-colors duration-200 font-medium text-sm dark:text-gray-400 dark:hover:text-white">
                  About
                </Link>
              </li>
              <li>
                <Link to="/services" className="text-foreground/65 hover:text-blue-600 transition-colors duration-200 font-medium text-sm dark:text-gray-400 dark:hover:text-white">
                  Services
                </Link>
              </li>
              <li>
                <Link to="/agencies" className="text-foreground/65 hover:text-blue-600 transition-colors duration-200 font-medium text-sm dark:text-gray-400 dark:hover:text-white">
                  Agencies
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-foreground/65 hover:text-blue-600 transition-colors duration-200 font-medium text-sm dark:text-gray-400 dark:hover:text-white">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-semibold text-base text-foreground mb-6 dark:text-white">Support</h3>
            <ul className="space-y-4">
              <li>
                <button onClick={() => {}} className="text-foreground/65 hover:text-blue-600 transition-colors duration-200 font-medium text-sm dark:text-gray-400 dark:hover:text-white">
                  Help Center
                </button>
              </li>
              <li>
                <button onClick={() => {}} className="text-foreground/65 hover:text-blue-600 transition-colors duration-200 font-medium text-sm dark:text-gray-400 dark:hover:text-white">
                  Privacy Policy
                </button>
              </li>
              <li>
                <button onClick={() => {}} className="text-foreground/65 hover:text-blue-600 transition-colors duration-200 font-medium text-sm dark:text-gray-400 dark:hover:text-white">
                  Terms of Service
                </button>
              </li>
              <li>
                <button onClick={() => {}} className="text-foreground/65 hover:text-blue-600 transition-colors duration-200 font-medium text-sm dark:text-gray-400 dark:hover:text-white">
                  FAQ
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-100 mt-16 pt-8 text-center dark:border-gray-800">
          <p className="text-foreground/50 text-sm font-medium dark:text-gray-500">
            &copy; {new Date().getFullYear()} Travoss. All rights reserved. Designed with ❤️.
          </p>
        </div>
      </div>
    </footer>
  )
}

