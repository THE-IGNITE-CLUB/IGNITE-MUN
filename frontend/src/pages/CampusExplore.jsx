import PageWrapper from '../components/PageWrapper'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { Link } from 'react-router-dom'

export default function CampusExplore() {
  const gmapsLink = "https://www.google.com/maps/place/Sri+Venkateshwara+University+College+of+Engineering/@13.6269984,79.0921969,11z/data=!4m10!1m2!2m1!1sSV+Engineering+College+for+Women,+Tirupathi,+Andhra+Pradesh,+India!3m6!1s0x3a4d4b6b271b4ffd:0x30859fdc6c661028!8m2!3d13.6269984!4d79.3970675!15sCkJTViBFbmdpbmVlcmluZyBDb2xsZWdlIGZvciBXb21lbiwgVGlydXBhdGhpLCBBbmRocmEgUHJhZGVzaCwgSW5kaWEiL1ItL2dlby90eXBlL2VzdGFibGlzaG1lbnRfcG9pL2lzX293bmVkX2J5X3dvbWVuZkEiP3N2IGVuZ2luZWVyaW5nIGNvbGxlZ2UgZm9yIHdvbWVuIHRpcnVwYXRoaSBhbmRocmEgcHJhZGVzaCBpbmRpYZIBB2NvbGxlZ2WaASRDaGREU1VoTk1HOW5TMFZKUTBGblNVTmFiVFpYZUcxQlJSQULgAQD6AQQIABAn!16s%2Fm%2F026pb7y?entry=ttu&g_ep=EgoyMDI2MDgwOS4wIKXMDSoASAFQAw%3D%3D"

  return (
    <PageWrapper>
      <Navbar />
      <main className="flex-grow pt-20">
        {/* Hero */}
        <section className="relative py-24 px-[16px] md:px-[48px] bg-surface-container-lowest overflow-hidden">
          <div className="max-w-[1280px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="font-label-sm text-label-sm text-secondary uppercase tracking-widest mb-4 flex items-center gap-2 font-bold">
                <span className="material-symbols-outlined text-base">location_on</span>Conference Venue
              </span>
              <h1 className="font-headline-xl text-headline-xl text-primary font-bold mb-6">Sri Venkateswara University College of Engineering</h1>
              <div className="h-1 w-16 bg-secondary mb-6" />
              <p className="font-body-lg text-body-lg text-on-surface-variant mb-6">
                Established in 1954, Sri Venkateswara University (SVU) is a premier institution nestled in the scenic foothills of Tirumala, Tirupati. Its sprawling 1,100-acre campus is home to world-class academic infrastructure and a rich tradition of intellectual achievement.
              </p>
              <p className="font-body-md text-body-md text-on-surface-variant mb-8">
                The IGNITE Club at SVU College of Engineering (SVUCE) has been at the forefront of fostering leadership and innovation among students. IGNITE MUN 2026 is proudly hosted at this prestigious venue, embodying the spirit of dialogue and diplomacy that defines SVU's legacy.
              </p>
              <div className="grid grid-cols-2 gap-4">
                {[{ label: 'Established', value: '1954' }, { label: 'Campus Area', value: '1,100 acres' }, { label: 'Departments', value: '60+' }, { label: 'Students', value: '15,000+' }].map((s, i) => (
                  <div key={i} className="bg-surface-container-low rounded-lg p-4 border border-outline-variant">
                    <p className="font-headline-lg text-2xl text-primary font-bold">{s.value}</p>
                    <p className="font-label-sm text-label-sm text-on-surface-variant uppercase mt-1">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="h-96 rounded-xl overflow-hidden border border-outline-variant shadow-md relative">
              <iframe
                title="Sri Venkateswara University College of Engineering Google Map"
                src="https://maps.google.com/maps?q=Sri%20Venkateshwara%20University%20College%20of%20Engineering%20Tirupati&t=&z=15&ie=UTF8&iwloc=&output=embed"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
              />
              <div className="absolute bottom-4 left-4 bg-primary/95 backdrop-blur-md text-on-primary px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 shadow">
                <span className="material-symbols-outlined text-secondary text-sm">map</span> SVU College of Engineering Google Maps Location
              </div>
            </div>
          </div>
        </section>

        {/* Interactive Google Maps Location Section */}
        <section className="py-16 px-[16px] md:px-[48px] bg-surface-container-low border-y border-outline-variant">
          <div className="max-w-[1280px] mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
              <div>
                <h2 className="font-headline-lg text-headline-lg text-primary font-bold">Interactive Campus Map &amp; Navigation</h2>
                <p className="text-on-surface-variant text-sm mt-1">Sri Venkateswara University College of Engineering, Tirupati, Andhra Pradesh, India</p>
              </div>
              <a href={gmapsLink} target="_blank" rel="noreferrer"
                className="px-6 py-3 bg-secondary text-on-secondary rounded font-label-md hover:bg-primary transition-colors flex items-center gap-2 shadow-sm font-bold">
                <span className="material-symbols-outlined text-sm">open_in_new</span>
                Open in Google Maps
              </a>
            </div>

            <div className="w-full h-[450px] rounded-2xl overflow-hidden border border-outline-variant shadow-md">
              <iframe
                title="Sri Venkateswara University College of Engineering Google Map"
                src="https://maps.google.com/maps?q=Sri%20Venkateshwara%20University%20College%20of%20Engineering%20Tirupati&t=&z=15&ie=UTF8&iwloc=&output=embed"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </section>

        {/* Facilities */}
        <section className="py-20 px-[16px] md:px-[48px] bg-surface">
          <div className="max-w-[1280px] mx-auto">
            <h2 className="font-headline-lg text-headline-lg text-primary mb-10 text-center font-bold">Conference Facilities</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { icon: 'meeting_room', title: 'Committee Rooms', desc: 'Fully equipped rooms with modern AV technology for UNSC and Lok Sabha sessions.' },
                { icon: 'apartment', title: 'Senate Hall', desc: 'The grand venue for Opening and Closing Ceremonies, accommodating 1,000+ attendees.' },
                { icon: 'restaurant', title: 'Cafeteria & Dining', desc: 'On-campus dining facilities providing refreshments and meals throughout the conference.' },
                { icon: 'local_parking', title: 'Parking', desc: 'Ample parking space for delegates and guests on the SVU campus.' },
                { icon: 'wifi', title: 'High-Speed WiFi', desc: 'Campus-wide internet connectivity ensuring seamless digital participation.' },
                { icon: 'directions_bus', title: 'Transport Links', desc: 'Well-connected to Tirupati city via APSRTC bus routes and auto services.' },
              ].map((f, i) => (
                <div key={i} className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 shadow-sm hover:-translate-y-1 transition-all">
                  <div className="w-10 h-10 rounded bg-secondary/10 flex items-center justify-center mb-4">
                    <span className="material-symbols-outlined text-secondary">{f.icon}</span>
                  </div>
                  <h3 className="font-label-md text-label-md text-primary font-bold mb-2">{f.title}</h3>
                  <p className="font-body-md text-body-md text-sm text-on-surface-variant">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* IGNITE Club */}
        <section className="py-20 px-[16px] md:px-[48px] bg-primary-container">
          <div className="max-w-[1280px] mx-auto text-center">
            <h2 className="font-headline-lg text-headline-lg text-on-primary mb-6 font-bold">About IGNITE Club</h2>
            <p className="font-body-lg text-body-lg text-on-primary-container max-w-3xl mx-auto mb-8">
              IGNITE is the premier student leadership and innovation club at SVUCE, Tirupati. Founded with the mission of fostering creative thinking, leadership, and civic engagement, IGNITE has been organising impactful events including MUNs, hackathons, and workshops since its inception.
            </p>
            <Link to="/register" className="inline-flex items-center gap-2 px-8 py-4 bg-secondary text-on-secondary rounded font-label-md text-label-md hover:bg-primary transition-all shadow-lg font-bold">
              Register for IGNITE MUN 2026 <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </PageWrapper>
  )
}
