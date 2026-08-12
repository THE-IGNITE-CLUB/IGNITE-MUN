import { Link } from 'react-router-dom'
import PageWrapper from '../components/PageWrapper'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const committees = [
  {
    id: 'UNSC',
    name: 'United Nations Security Council',
    abbr: 'UNSC',
    icon: 'public',
    color: 'bg-tertiary-container',
    agenda: 'Iran–Israel Escalation & Regional Stability in the Middle East',
    description: 'The UNSC bears the primary responsibility for international peace and security. Comprising five permanent members (P5) and ten rotating elected members, the Council addresses threats to global stability through resolutions, sanctions, and peacekeeping mandates.',
    chairs: ['Chairperson', 'Vice-Chairperson', 'Rapporteur'],
    countries: ['United States', 'United Kingdom', 'France', 'China', 'Russia', 'India', 'Germany', 'Japan', 'Brazil', 'South Africa', 'Saudi Arabia', 'Israel', 'Iran', 'Turkey', 'Australia'],
    background: ['Iran\'s nuclear enrichment exceeding JCPOA limits', 'Israeli military operations against Iranian proxies', 'Houthi attacks on Red Sea shipping', 'Risk of regional war and P5 veto paralysis'],
  },
  {
    id: 'LOK_SABHA',
    name: 'Lok Sabha',
    abbr: 'Lok Sabha',
    icon: 'account_balance',
    color: 'bg-secondary-container',
    agenda: 'NEET-UG 2024 Paper Leak & Reforms in Higher Education',
    description: 'The lower house of the Indian Parliament, the Lok Sabha is the supreme legislative body for domestic affairs. Delegates represent political parties, ministers, and MPs to debate, legislate, and form coalitions on pressing national issues.',
    chairs: ['Speaker', 'Deputy Speaker', 'Rapporteur'],
    countries: ['Prime Minister', 'Home Minister', 'Finance Minister', 'Education Minister', 'Health Minister', 'Leader of Opposition', 'Defence Minister', 'Railway Minister', 'Agriculture Minister', 'Commerce Minister'],
    background: ['Systemic failures in NTA examination security', 'Impact on 2.3 million aspirants nationwide', 'Demand for scrapping NTA and creating an independent body', 'Criminal prosecution of paper leak networks'],
  },
]

export default function HybridDiplomacy() {
  return (
    <PageWrapper>
      <Navbar />
      <main className="flex-grow pt-20">
        {/* Hero */}
        <section className="py-20 px-[16px] md:px-[48px] bg-surface-container-lowest border-b border-outline-variant">
          <div className="max-w-[1280px] mx-auto text-center">
            <span className="font-label-sm text-label-sm text-secondary uppercase tracking-widest mb-4 block">IGNITE MUN 2026</span>
            <h1 className="font-headline-xl text-headline-xl text-primary-container mb-4">Committees &amp; Agendas</h1>
            <div className="h-1 w-16 bg-secondary mx-auto mb-6" />
            <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mx-auto">
              IGNITE MUN 2026 features two flagship committees, each simulating real-world legislative and diplomatic bodies. Delegates will engage in rigorous debate, coalition-building, and resolution drafting.
            </p>
          </div>
        </section>

        {/* Committees */}
        {committees.map((c, idx) => (
          <section key={c.id} className={`py-20 px-[16px] md:px-[48px] ${idx % 2 === 0 ? 'bg-surface' : 'bg-surface-container-lowest'}`}>
            <div className="max-w-[1280px] mx-auto">
              <div className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-start ${idx % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}>
                {/* Info */}
                <div>
                  <div className="flex items-center gap-3 mb-6">
                    <div className={`w-12 h-12 rounded-full ${c.color} flex items-center justify-center`}>
                      <span className="material-symbols-outlined text-primary-container">{c.icon}</span>
                    </div>
                    <div>
                      <h2 className="font-headline-lg text-headline-lg text-primary-container">{c.abbr}</h2>
                      <p className="font-body-md text-body-md text-on-surface-variant text-sm">{c.name}</p>
                    </div>
                  </div>

                  <div className="bg-surface-container border-l-4 border-secondary rounded-lg p-4 mb-6">
                    <p className="font-label-sm text-label-sm text-secondary uppercase tracking-wider mb-1">Agenda</p>
                    <p className="font-headline-md text-headline-md text-primary-container">{c.agenda}</p>
                  </div>

                  <p className="font-body-md text-body-md text-on-surface-variant mb-6">{c.description}</p>

                  <div className="mb-6">
                    <p className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider mb-3">Key Dais Positions</p>
                    <div className="flex flex-wrap gap-2">
                      {c.chairs.map(ch => (
                        <span key={ch} className="px-3 py-1.5 bg-surface-container border border-outline-variant rounded text-xs font-label-md text-label-md text-on-surface-variant">{ch}</span>
                      ))}
                    </div>
                  </div>

                  <Link to="/register" className="inline-flex items-center gap-2 px-6 py-3 bg-primary-container text-on-primary rounded font-label-md text-label-md hover:bg-tertiary-container transition-colors">
                    Register for {c.abbr} <span className="material-symbols-outlined text-sm">arrow_forward</span>
                  </Link>
                </div>

                {/* Background + portfolios */}
                <div className="space-y-6">
                  <div className={`${c.color} rounded-xl p-6 border border-outline-variant/30`}>
                    <h3 className="font-label-md text-label-md text-primary-container uppercase tracking-wider mb-4 flex items-center gap-2">
                      <span className="material-symbols-outlined text-sm">article</span>Background Overview
                    </h3>
                    <ul className="space-y-3">
                      {c.background.map((b, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="material-symbols-outlined text-secondary text-sm mt-0.5 flex-shrink-0">chevron_right</span>
                          <p className="font-body-md text-body-md text-on-surface-variant text-sm">{b}</p>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6">
                    <h3 className="font-label-md text-label-md text-primary-container uppercase tracking-wider mb-4 flex items-center gap-2">
                      <span className="material-symbols-outlined text-sm">how_to_vote</span>Available Portfolios
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {c.countries.map(country => (
                        <span key={country} className="px-2 py-1 bg-surface-container border border-outline-variant rounded text-xs text-on-surface-variant font-body-md">{country}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        ))}

        {/* CTA */}
        <section className="py-16 px-[16px] md:px-[48px] bg-primary-container text-center">
          <h2 className="font-headline-lg text-headline-lg text-on-primary mb-4">Choose Your Committee</h2>
          <p className="font-body-lg text-body-lg text-on-primary-container mb-8 max-w-xl mx-auto">Register now and select your preferred committee and portfolio. First 10 registrations are FREE.</p>
          <Link to="/register" className="inline-flex items-center gap-2 px-10 py-4 bg-secondary-fixed text-on-secondary-fixed rounded font-label-md text-label-md hover:bg-secondary-fixed-dim transition-all shadow-lg">
            Register Now — It's FREE! <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </Link>
        </section>
      </main>
      <Footer />
    </PageWrapper>
  )
}
