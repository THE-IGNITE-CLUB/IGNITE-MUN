import { Link } from 'react-router-dom'
import PageWrapper from '../components/PageWrapper'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { useCountdown } from '../hooks/useCountdown'

// Conference date: Dec 1, 2026 07:00 AM IST
const CONFERENCE_DATE = '2026-12-01T07:00:00+05:30'

function CountdownUnit({ value, label }) {
  return (
    <div className="flex flex-col items-center">
      <span className="font-headline-xl text-4xl md:text-6xl text-primary-container">{String(value).padStart(2,'0')}</span>
      <span className="font-label-sm text-label-sm text-outline mt-2">{label}</span>
    </div>
  )
}

export default function Home() {
  const { days, hours, minutes, seconds } = useCountdown(CONFERENCE_DATE)
  const now = new Date()
  const dateStr = now.toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
  const timeStr = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Kolkata' })

  return (
    <PageWrapper>
      <Navbar />
      <main className="flex-grow pt-20">
        {/* Hero Section */}
        <section className="relative w-full min-h-[819px] flex flex-col items-center justify-center text-center overflow-hidden">
          <div className="absolute inset-0 z-0">
            <img className="w-full h-full object-cover object-center opacity-40"
              src="https://lh3.googleusercontent.com/aida/AP1WRLt6UCF_nmMOf65MN7rHCMRylWau4wAolYqU0OrHaI2r7U-3va2Bnw0K2eDaCH3LOF_ebqhO9c1DP9ehhz69kcq-FFCogSZc1DZWk3NQKevBFpRmpoqvrBjjtjRw4HClcZiP_yI7nm0cvfVe5RUghEnkdJxh8zHYxsTdtm75U_nOYJmPWtUhRnj8LbgHkMTupbXINp-bfC5aXQ90SlfSxgPrEVlZ0F5g9yyhp_nVDVCbKcpB74Nr1DMUqs0"
              alt="Assembly Hall" />
            <div className="absolute inset-0 bg-gradient-to-b from-surface-bright/80 via-surface-bright/60 to-surface-bright/95" />
          </div>
          <div className="relative z-10 flex flex-col items-center px-[16px] md:px-[48px] max-w-[1280px] mx-auto py-16">
            <img className="w-32 h-32 md:w-48 md:h-48 mb-8 object-contain drop-shadow-md"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBVLn5oMAjZxmlSXiPd0b5EEsWW1WqVqe_GOQNwZBhK0d1zj3s_oFiWRt2NYtDIJ58Fzd4WC5_xgP2Ga17HungCXd5I1u4LYF_zbNo8vI6aYaGD03-dK70viei4k6E_76J5F_QZGVirSvYI77l37S2iXGaIZ0C3eXViy_RAxCK1JqmE7vqUwIyeNdgjBI1-bPCUjHvx1Iq2NMy0L9VnGF7AU2uzSfUMZdTCt44HUmfU2_kio7EQv6ODH7Tp8Dj6Um6-0A"
              alt="IGNITE MUN 2026 Logo" />
            <h1 className="font-headline-xl-mobile text-headline-xl-mobile md:font-headline-xl md:text-headline-xl text-primary-container mb-4 max-w-4xl">IGNITE MUN 2026</h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant mb-4 max-w-2xl tracking-wide uppercase font-semibold">Fueling Global Dialogue</p>

            {/* Live Date & Time */}
            <div className="flex items-center gap-3 mb-6 text-on-surface-variant font-label-md text-label-md">
              <span className="material-symbols-outlined text-secondary text-base">schedule</span>
              <span>{dateStr} · {timeStr} IST</span>
            </div>

            {/* Countdown */}
            <div className="bg-surface-container-lowest/90 border border-outline-variant/50 rounded-xl px-8 py-5 mb-10 backdrop-blur-sm institutional-shadow">
              <p className="font-label-sm text-label-sm text-secondary uppercase tracking-widest mb-4 text-center">Countdown to Conference — Dec 1, 2026 · 7:00 AM IST</p>
              <div className="flex gap-4 md:gap-8 justify-center">
                <CountdownUnit value={days} label="DAYS" />
                <span className="font-headline-xl text-4xl md:text-6xl text-outline-variant self-start mt-1">:</span>
                <CountdownUnit value={hours} label="HOURS" />
                <span className="font-headline-xl text-4xl md:text-6xl text-outline-variant self-start mt-1">:</span>
                <CountdownUnit value={minutes} label="MINUTES" />
                <span className="font-headline-xl text-4xl md:text-6xl text-outline-variant self-start mt-1">:</span>
                <CountdownUnit value={seconds} label="SECONDS" />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <Link to="/register" className="px-8 py-4 bg-primary-container text-on-primary rounded font-label-md text-label-md hover:bg-tertiary-container transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2">
                Register Now <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </Link>
              <Link to="/hybrid-diplomacy" className="px-8 py-4 border-2 border-secondary text-secondary rounded font-label-md text-label-md hover:bg-secondary/5 transition-all flex items-center justify-center">
                Explore Committees
              </Link>
            </div>
          </div>
        </section>

        {/* Introduction Section */}
        <section className="py-24 px-[16px] md:px-[48px] bg-surface-container-lowest">
          <div className="max-w-[1280px] mx-auto grid grid-cols-1 md:grid-cols-12 gap-[24px] items-center">
            <div className="md:col-span-5 mb-10 md:mb-0 relative">
              <div className="w-full h-80 rounded-lg overflow-hidden border border-outline-variant/30 institutional-shadow">
                <img className="w-full h-full object-cover"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDLVnVPymgIVNNOlJjMDEFBn2TFzkTCpLhrSK-kb4Awow-8Xw3K-rCXc0_UcQBP9lK5NrP7vYJmJuGzbZeoNN4koKXEYJamlcRem1UYZUBVyxlZli7cL7O6JP96vsi2lhIgP5g9YoRc7FbD6iQbiDNBZyOO2KpeD648mGFrBERbPWyJeLzbFF6qxmI-gbuKm-91a5TclzaftUyO7FVPffrxTAROrG2tqYhN5VH2CBStteG0cyx9K-sh"
                  alt="Delegates in debate" />
              </div>
              <div className="absolute -bottom-4 -right-4 w-24 h-24 border border-secondary/20 bg-surface z-[-1] rounded-lg" />
            </div>
            <div className="md:col-span-6 md:col-start-7 flex flex-col justify-center">
              <span className="font-label-sm text-label-sm text-secondary uppercase tracking-widest mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-base">public</span>The Conference
              </span>
              <h2 className="font-headline-lg text-headline-lg text-primary-container mb-6">Dialogue and Diplomacy</h2>
              <div className="h-1 w-16 bg-secondary mb-6" />
              <p className="font-body-md text-body-md text-on-surface-variant mb-6">
                Welcome to IGNITE MUN 2026, where the leaders of tomorrow converge to address the most pressing global challenges. Grounded in a commitment to substantive debate and rigorous negotiation, this year's conference emphasizes the critical role of diplomatic dialogue.
              </p>
              <p className="font-body-md text-body-md text-on-surface-variant">
                In proud partnership with Sri Venkateswara University, we provide an unparalleled platform for delegates to refine their rhetorical skills, deepen their understanding of international relations, and cultivate a lasting network of peers dedicated to global progress.
              </p>
            </div>
          </div>
        </section>

        {/* Conference Pillars */}
        <section className="py-24 px-[16px] md:px-[48px] bg-surface">
          <div className="max-w-[1280px] mx-auto">
            <div className="text-center mb-16">
              <h2 className="font-headline-lg text-headline-lg text-primary-container mb-4">Conference Pillars</h2>
              <p className="font-body-md text-body-md text-on-surface-variant max-w-2xl mx-auto">The foundational principles that guide our academic framework and shape the delegate experience.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { icon: 'language', title: 'Global Perspectives', desc: 'Engage with multifaceted geopolitical issues through the lens of diverse nations, fostering a nuanced understanding of global interdependence and cultural diplomacy.', dark: false },
                { icon: 'gavel', title: 'Academic Rigor', desc: 'Experience meticulously researched background guides and highly trained dais members ensuring debate remains focused, realistic, and intellectually demanding.', dark: true },
                { icon: 'account_balance', title: 'Institutional Legacy', desc: "Join a tradition of excellence. SVU's commitment to academic leadership provides the perfect backdrop for shaping policies that reflect historical precedent.", dark: false },
              ].map((card, i) => (
                <div key={i} className={`group relative overflow-hidden flex flex-col h-full rounded-xl p-8 hover:institutional-shadow transition-all duration-300 ${card.dark ? 'bg-primary-container border border-primary-container md:-translate-y-4' : 'bg-surface-container-lowest border border-outline-variant/50'}`}>
                  {card.dark && <div className="absolute inset-0 bg-gradient-to-br from-primary-container to-black/40 z-0" />}
                  <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                    <span className={`material-symbols-outlined text-8xl ${card.dark ? 'text-white' : 'text-primary-container'}`}>{card.icon}</span>
                  </div>
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-6 relative z-10 ${card.dark ? 'bg-secondary/20 border border-secondary/30' : 'bg-secondary/10'}`}>
                    <span className={`material-symbols-outlined ${card.dark ? 'text-secondary-fixed' : 'text-secondary'}`}>{card.icon}</span>
                  </div>
                  <h3 className={`font-headline-md text-headline-md mb-3 relative z-10 ${card.dark ? 'text-on-primary' : 'text-primary-container'}`}>{card.title}</h3>
                  <p className={`font-body-md text-body-md relative z-10 flex-grow ${card.dark ? 'text-on-primary-container' : 'text-on-surface-variant'}`}>{card.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SVU Section */}
        <section className="py-24 px-[16px] md:px-[48px] bg-surface-container-lowest border-t border-surface-variant" id="university">
          <div className="max-w-[1280px] mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="order-2 lg:order-1">
                <div className="w-full h-[400px] bg-surface-container rounded-xl overflow-hidden border border-outline-variant/30 institutional-shadow relative">
                  <div className="absolute inset-0 bg-surface-container flex flex-col items-center justify-center text-on-surface-variant">
                    <span className="material-symbols-outlined text-4xl mb-2 opacity-50">map</span>
                    <span className="font-label-md text-label-md">Interactive Campus Map</span>
                    <span className="font-body-md text-body-md text-sm mt-1">Sri Venkateswara University, Tirupati</span>
                  </div>
                  <img className="w-full h-full object-cover opacity-30 mix-blend-multiply"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDqceUxymJ6olXbk_CuLgzmBoMD3KZ-LKjV2UpDHGd1Nq6xhR_FZMr-7AOAMADKw7PIJJZ6_ad4lR0fs_piOLYIHXXevMyVjFDePKUkjqY3qYhl4WOoXZxq6fjBJ86vfU6zgIYDxWMXXFlklJm9g_dv040RH_P27Q1H9uscfb0RCqFtKgEOMuAaFuPqsmbY6SympRCCw2HBGwp8xQXf7Q_rjgG02bZfyeyky78Uvpd56QliPETHe-JI"
                    alt="SVU Campus Map" />
                </div>
              </div>
              <div className="order-1 lg:order-2">
                <span className="font-label-sm text-label-sm text-secondary uppercase tracking-widest mb-4 flex items-center gap-2">
                  <span className="material-symbols-outlined text-base">location_on</span>The Venue
                </span>
                <h2 className="font-headline-lg text-headline-lg text-primary-container mb-6">Sri Venkateswara University</h2>
                <p className="font-body-md text-body-md text-on-surface-variant mb-6">
                  Established in 1954 and nestled in the foothills of Tirumala, Sri Venkateswara University (SVU) is one of the most prestigious universities in Andhra Pradesh. With its sprawling 1,100-acre campus and state-of-the-art academic facilities, SVU provides an inspiring environment conducive to high-level diplomatic discourse.
                </p>
                <div className="flex flex-col gap-4 mb-6">
                  {[
                    { icon: 'meeting_room', title: 'Premium Committee Rooms', desc: 'Equipped with modern audio-visual technology for seamless sessions.' },
                    { icon: 'apartment', title: 'Senate Hall', desc: 'The grand venue for our Opening and Closing Ceremonies.' },
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-4">
                      <div className="mt-1 w-8 h-8 rounded bg-surface-container flex items-center justify-center border border-outline-variant/30">
                        <span className="material-symbols-outlined text-primary-container text-sm">{item.icon}</span>
                      </div>
                      <div>
                        <h4 className="font-label-md text-label-md text-primary-container">{item.title}</h4>
                        <p className="font-body-md text-body-md text-sm text-on-surface-variant">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <a href="https://svuniversity.edu.in" target="_blank" rel="noreferrer"
                  className="inline-flex items-center gap-2 font-label-md text-label-md text-secondary hover:underline">
                  Visit svuniversity.edu.in <span className="material-symbols-outlined text-sm">open_in_new</span>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Registration CTA Banner */}
        <section className="py-20 px-[16px] md:px-[48px] bg-primary-container">
          <div className="max-w-[1280px] mx-auto text-center">
            <span className="font-label-sm text-label-sm text-secondary-fixed uppercase tracking-widest mb-4 block">December 1, 2026 · Sri Venkateswara University</span>
            <h2 className="font-headline-lg text-headline-lg text-on-primary mb-6">Ready to Make History?</h2>
            <p className="font-body-lg text-body-lg text-on-primary-container mb-8 max-w-xl mx-auto">
              First 10 registrations are FREE. Secure your place in the most impactful MUN of the year.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register" className="px-10 py-4 bg-secondary-fixed text-on-secondary-fixed rounded font-label-md text-label-md hover:bg-secondary-fixed-dim transition-all shadow-lg hover:shadow-xl hover:scale-105 duration-200 flex items-center justify-center gap-2">
                Register as Delegate <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </Link>
              <Link to="/organizer/register" className="px-10 py-4 border-2 border-secondary-fixed text-secondary-fixed rounded font-label-md text-label-md hover:bg-secondary-fixed/10 transition-all flex items-center justify-center gap-2">
                Apply as Staff / EB
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </PageWrapper>
  )
}
