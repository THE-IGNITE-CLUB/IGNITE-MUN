import PageWrapper from '../components/PageWrapper'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { Link } from 'react-router-dom'

export default function CampusExplore() {
  return (
    <PageWrapper>
      <Navbar />
      <main className="flex-grow pt-20">
        {/* Hero */}
        <section className="relative py-24 px-[16px] md:px-[48px] bg-surface-container-lowest overflow-hidden">
          <div className="max-w-[1280px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="font-label-sm text-label-sm text-secondary uppercase tracking-widest mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-base">location_on</span>Conference Venue
              </span>
              <h1 className="font-headline-xl text-headline-xl text-primary-container mb-6">Sri Venkateswara University</h1>
              <div className="h-1 w-16 bg-secondary mb-6" />
              <p className="font-body-lg text-body-lg text-on-surface-variant mb-6">
                Established in 1954, Sri Venkateswara University (SVU) is a premier institution nestled in the scenic foothills of Tirumala, Tirupati. Its sprawling 1,100-acre campus is home to world-class academic infrastructure and a rich tradition of intellectual achievement.
              </p>
              <p className="font-body-md text-body-md text-on-surface-variant mb-8">
                The IGNITE Club at SVU College of Engineering (SVUCE) has been at the forefront of fostering leadership and innovation among students. IGNITE MUN 2026 is proudly hosted at this prestigious venue, embodying the spirit of dialogue and diplomacy that defines SVU's legacy.
              </p>
              <div className="grid grid-cols-2 gap-4">
                {[{ label: 'Established', value: '1954' }, { label: 'Campus Area', value: '1,100 acres' }, { label: 'Departments', value: '60+' }, { label: 'Students', value: '15,000+' }].map((s, i) => (
                  <div key={i} className="bg-surface-container rounded-lg p-4 border border-outline-variant/50">
                    <p className="font-headline-lg text-2xl text-primary-container font-bold">{s.value}</p>
                    <p className="font-label-sm text-label-sm text-on-surface-variant uppercase mt-1">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="h-96 rounded-xl overflow-hidden border border-outline-variant/30 institutional-shadow">
              <img className="w-full h-full object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDqceUxymJ6olXbk_CuLgzmBoMD3KZ-LKjV2UpDHGd1Nq6xhR_FZMr-7AOAMADKw7PIJJZ6_ad4lR0fs_piOLYIHXXevMyVjFDePKUkjqY3qYhl4WOoXZxq6fjBJ86vfU6zgIYDxWMXXFlklJm9g_dv040RH_P27Q1H9uscfb0RCqFtKgEOMuAaFuPqsmbY6SympRCCw2HBGwp8xQXf7Q_rjgG02bZfyeyky78Uvpd56QliPETHe-JI"
                alt="SVU Campus" />
            </div>
          </div>
        </section>

        {/* Facilities */}
        <section className="py-20 px-[16px] md:px-[48px] bg-surface">
          <div className="max-w-[1280px] mx-auto">
            <h2 className="font-headline-lg text-headline-lg text-primary-container mb-10 text-center">Conference Facilities</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { icon: 'meeting_room', title: 'Committee Rooms', desc: 'Fully equipped rooms with modern AV technology for UNSC and Lok Sabha sessions.' },
                { icon: 'apartment', title: 'Senate Hall', desc: 'The grand venue for Opening and Closing Ceremonies, accommodating 1,000+ attendees.' },
                { icon: 'restaurant', title: 'Cafeteria & Dining', desc: 'On-campus dining facilities providing refreshments and meals throughout the conference.' },
                { icon: 'local_parking', title: 'Parking', desc: 'Ample parking space for delegates and guests on the SVU campus.' },
                { icon: 'wifi', title: 'High-Speed WiFi', desc: 'Campus-wide internet connectivity ensuring seamless digital participation.' },
                { icon: 'directions_bus', title: 'Transport Links', desc: 'Well-connected to Tirupati city via APSRTC bus routes and auto services.' },
              ].map((f, i) => (
                <div key={i} className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 institutional-shadow hover:-translate-y-1 transition-all">
                  <div className="w-10 h-10 rounded bg-secondary/10 flex items-center justify-center mb-4">
                    <span className="material-symbols-outlined text-secondary">{f.icon}</span>
                  </div>
                  <h3 className="font-label-md text-label-md text-primary-container mb-2">{f.title}</h3>
                  <p className="font-body-md text-body-md text-sm text-on-surface-variant">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* IGNITE Club */}
        <section className="py-20 px-[16px] md:px-[48px] bg-primary-container">
          <div className="max-w-[1280px] mx-auto text-center">
            <h2 className="font-headline-lg text-headline-lg text-on-primary mb-6">About IGNITE Club</h2>
            <p className="font-body-lg text-body-lg text-on-primary-container max-w-3xl mx-auto mb-8">
              IGNITE is the premier student leadership and innovation club at SVUCE, Tirupati. Founded with the mission of fostering creative thinking, leadership, and civic engagement, IGNITE has been organising impactful events including MUNs, hackathons, and workshops since its inception.
            </p>
            <Link to="/register" className="inline-flex items-center gap-2 px-8 py-4 bg-secondary-fixed text-on-secondary-fixed rounded font-label-md text-label-md hover:bg-secondary-fixed-dim transition-all shadow-lg">
              Register for IGNITE MUN 2026 <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </PageWrapper>
  )
}
