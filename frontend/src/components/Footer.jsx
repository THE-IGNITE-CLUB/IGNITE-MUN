import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="bg-primary-container text-on-primary w-full py-16 px-[48px]">
      <div className="max-w-[1280px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-[24px] font-body-md text-body-md">
        {/* Brand */}
        <div className="col-span-1">
          <h2 className="font-headline-lg text-headline-lg font-bold text-on-primary mb-6">IGNITE MUN</h2>
          <p className="text-surface-variant opacity-80 text-sm mb-2">Empowering the next generation of global leaders through diplomacy and dialogue.</p>
          <p className="text-surface-variant opacity-80 text-sm">Sri Venkateswara University, Tirupati</p>
        </div>

        {/* Quick Links */}
        <div className="col-span-1 md:col-span-2 flex flex-wrap gap-x-12 gap-y-4 content-start">
          <Link to="/" className="text-surface-variant opacity-80 hover:text-white transition-all">Home</Link>
          <Link to="/campus" className="text-surface-variant opacity-80 hover:text-white transition-all">About SVU</Link>
          <Link to="/hybrid-diplomacy" className="text-surface-variant opacity-80 hover:text-white transition-all">Committees</Link>
          <Link to="/register" className="text-surface-variant opacity-80 hover:text-white transition-all">Register</Link>
          <Link to="/organizer/register" className="text-surface-variant opacity-80 hover:text-white transition-all">Staff Apply</Link>
          <Link to="/login" className="text-surface-variant opacity-80 hover:text-white transition-all">Delegate Login</Link>
          <Link to="/admin/login" className="text-surface-variant opacity-80 hover:text-white transition-all">Admin</Link>
        </div>

        {/* Contact + Copyright */}
        <div className="col-span-1 flex flex-col items-start md:items-end justify-between">
          <div className="flex gap-4 mb-8">
            <a href="mailto:manas.malla13@gmail.com" className="w-10 h-10 rounded-full border border-surface-variant/30 flex items-center justify-center hover:bg-surface-variant/10 transition-colors">
              <span className="material-symbols-outlined text-on-primary">mail</span>
            </a>
            <a href="#" className="w-10 h-10 rounded-full border border-surface-variant/30 flex items-center justify-center hover:bg-surface-variant/10 transition-colors">
              <span className="material-symbols-outlined text-on-primary">share</span>
            </a>
          </div>
          <div className="text-left md:text-right">
            <p className="text-surface-variant opacity-60 text-xs mb-1">© 2026 Ignite Club, Sri Venkateswara University. All Rights Reserved.</p>
            <p className="text-secondary-fixed text-xs font-semibold">
              Made with ❤️ by Malla Manas &amp; Devarakonda Charan
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
