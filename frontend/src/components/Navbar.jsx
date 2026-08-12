import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()
  const isActive = (path) => location.pathname === path

  return (
    <nav className="fixed top-0 w-full z-50 flex justify-between items-center px-[16px] md:px-[48px] h-20 bg-surface-container-lowest/95 backdrop-blur-md border-b border-outline-variant">
      <Link to="/" className="flex items-center gap-2">
        <span className="font-headline-md text-headline-md font-bold text-primary">IGNITE MUN 2026</span>
      </Link>

      {/* Desktop Nav */}
      <div className="hidden md:flex items-center gap-6">
        <Link to="/" className={`text-label-md font-label-md transition-colors ${isActive('/') ? 'text-secondary font-bold border-b-2 border-secondary pb-1' : 'text-on-surface-variant hover:text-secondary'}`}>Home</Link>
        <Link to="/campus" className={`text-label-md font-label-md transition-colors ${isActive('/campus') ? 'text-secondary font-bold border-b-2 border-secondary pb-1' : 'text-on-surface-variant hover:text-secondary'}`}>University</Link>
        <Link to="/hybrid-diplomacy" className={`text-label-md font-label-md transition-colors ${isActive('/hybrid-diplomacy') ? 'text-secondary font-bold border-b-2 border-secondary pb-1' : 'text-on-surface-variant hover:text-secondary'}`}>Committees</Link>
        <Link to="/organizer/register" className={`text-label-md font-label-md transition-colors ${isActive('/organizer/register') ? 'text-secondary font-bold border-b-2 border-secondary pb-1' : 'text-on-surface-variant hover:text-secondary'}`}>Staff Apply</Link>
        <Link to="/login" className={`text-label-md font-label-md transition-colors ${isActive('/login') ? 'text-secondary font-bold border-b-2 border-secondary pb-1' : 'text-on-surface-variant hover:text-secondary'}`}>Login</Link>
        <Link to="/register" className="ml-4 px-6 py-2 bg-primary-container text-on-primary rounded font-label-md text-label-md hover:bg-tertiary-container transition-colors shadow-sm">
          Register Now
        </Link>
      </div>

      {/* Mobile Menu Button */}
      <button className="md:hidden text-primary" onClick={() => setMenuOpen(!menuOpen)}>
        <span className="material-symbols-outlined text-2xl">{menuOpen ? 'close' : 'menu'}</span>
      </button>

      {/* Mobile Menu Dropdown */}
      {menuOpen && (
        <div className="absolute top-20 left-0 right-0 bg-surface-container-lowest border-b border-outline-variant shadow-lg flex flex-col gap-0 z-50 md:hidden">
          {[
            { to: '/', label: 'Home' },
            { to: '/campus', label: 'University' },
            { to: '/hybrid-diplomacy', label: 'Committees' },
            { to: '/organizer/register', label: 'Staff Apply' },
            { to: '/login', label: 'Login' },
          ].map(({ to, label }) => (
            <Link key={to} to={to} onClick={() => setMenuOpen(false)}
              className="px-[48px] py-4 text-on-surface-variant hover:text-primary hover:bg-surface-container-low transition-colors font-label-md text-label-md border-b border-outline-variant/30">
              {label}
            </Link>
          ))}
          <Link to="/register" onClick={() => setMenuOpen(false)}
            className="mx-[48px] my-4 px-6 py-3 bg-primary-container text-on-primary rounded font-label-md text-label-md text-center hover:bg-tertiary-container transition-colors">
            Register Now
          </Link>
        </div>
      )}
    </nav>
  )
}
