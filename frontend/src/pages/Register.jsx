import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../utils/api'
import toast from 'react-hot-toast'
import PageWrapper from '../components/PageWrapper'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const LOK_SABHA_POSITIONS = [
  'Prime Minister', 'Speaker of Lok Sabha', 'Leader of Opposition', 'Home Minister',
  'Finance Minister', 'Education Minister', 'Health Minister', 'Defence Minister',
  'Foreign Minister', 'Railway Minister', 'Agriculture Minister', 'Commerce Minister',
]
const UNSC_COUNTRIES = [
  'United States', 'United Kingdom', 'France', 'China', 'Russia',
  'India', 'Germany', 'Japan', 'Brazil', 'South Africa',
  'Saudi Arabia', 'Israel', 'Iran', 'Turkey', 'Australia',
]
const IP_POSITIONS = [
  'International Press Reporter', 'Investigative Journalist', 'Political Photojournalist',
  'Caricaturist / Satirist', 'Chief Editor', 'Head of Photography'
]

export default function Register() {
  const navigate = useNavigate()
  const [stats, setStats] = useState({ remaining_free_slots: 10, free_slots_exhausted: false })
  const [form, setForm] = useState({
    name: '', class_: '', college: '', email: '', phone: '',
    committee: 'UNSC', position_1: '', position_2: '', position_3: '',
    position_4: '', position_5: '', mun_experience: '',
  })
  const [loading, setLoading] = useState(false)
  const positions = form.committee === 'UNSC' ? UNSC_COUNTRIES : form.committee === 'INTERNATIONAL_PRESS' ? IP_POSITIONS : LOK_SABHA_POSITIONS

  useEffect(() => {
    api.get('/api/stats').then(r => setStats(r.data)).catch(() => {})
  }, [])

  const handle = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))

  const submit = async (e) => {
    e.preventDefault()
    if (!form.position_1) return toast.error('Please select at least one position preference.')
    setLoading(true)
    try {
      const res = await api.post('/api/register', form)
      const data = res.data
      if (data.payment_required) {
        navigate('/payment', { state: { delegate_id: data.delegate_id, user_id: data.user_id, name: form.name } })
      } else {
        if (!data.email_sent) {
          toast('Email delivery failed — save your Delegate ID from the next screen!', { icon: '⚠️', duration: 6000 })
        }
        navigate('/payment/success', { state: { free: true, name: form.name, email: form.email, user_id: data.user_id } })
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <PageWrapper>
      <Navbar />
      <main className="flex-grow relative pt-20">
        {/* Left Panel */}
        <div className="hidden lg:block fixed left-0 top-0 bottom-0 w-5/12 z-0">
          <div className="absolute inset-0 bg-cover bg-center h-full"
            style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBRR3NTrAfi-Q1mnZsHzgDxLOUwt02DRUvwMPixH0Qy2lCvSGnzu33Cr5U1IaFgFINhv9gYj_wv-CUVWmdQG0mwKnmb1OJagp1Rri1HartEnU-GPOnjo5S07p04Afz2gxS9abeuFt_17eobFGvAmsjGy1RKIy8NEtzmFhwlBW4WBAMUUb2G6k_UJgKTTnrtZe4Uy385-vwS2hz9Rh2knSeHnDGigRmhUmsGfaz8hxENgsMScD2R51gr')" }} />
          <div className="absolute inset-0 bg-gradient-to-r from-primary-container/85 to-transparent" />
          <div className="absolute bottom-[48px] left-[48px] pr-12 text-surface-container-lowest">
            <h1 className="font-headline-xl text-headline-xl mb-4 text-on-primary">Delegate Registration</h1>
            <p className="font-body-lg text-body-lg text-inverse-primary/90">Join the most prestigious diplomatic simulation at Sri Venkateswara University.</p>
            <div className="mt-6 flex flex-col gap-2">
              <div className={`inline-flex items-center gap-2 px-3 py-2 rounded text-sm backdrop-blur-sm ${stats.free_slots_exhausted ? 'bg-error/20 border border-error/30 text-white' : 'bg-secondary/20 border border-secondary-fixed/30 text-secondary-fixed'}`}>
                <span className="material-symbols-outlined text-sm icon-filled">{stats.free_slots_exhausted ? 'block' : 'local_offer'}</span>
                {stats.free_slots_exhausted ? 'Free slots exhausted — ₹50 registration fee applies' : `🎁 ${stats.remaining_free_slots} free slots remaining!`}
              </div>
              <div className="inline-flex items-center gap-2 border border-outline-variant/30 px-3 py-1 rounded bg-surface/10 backdrop-blur-sm text-sm">
                <span className="material-symbols-outlined text-sm icon-filled">calendar_month</span>
                <span>Conference: December 1, 2026</span>
              </div>
            </div>
          </div>
        </div>

        {/* Form Panel */}
        <div className="w-full lg:ml-[41.67%] lg:w-7/12 bg-surface-container-lowest min-h-screen flex flex-col justify-center py-12 px-6 sm:px-12 lg:px-16">
          <div className="max-w-xl mx-auto w-full">
            {/* Mobile header */}
            <div className="lg:hidden mb-8">
              <h1 className="font-headline-xl-mobile text-headline-xl-mobile text-primary-container mb-2">Delegate Registration</h1>
              <p className="font-body-md text-body-md text-on-surface-variant">IGNITE MUN 2026 · December 1, 2026</p>
              {!stats.free_slots_exhausted && (
                <div className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 bg-secondary/10 text-secondary border border-secondary/20 rounded text-sm font-semibold">
                  🎁 {stats.remaining_free_slots} free slots remaining!
                </div>
              )}
            </div>

            <div className="mb-8 pb-6 border-b border-outline/10">
              <h2 className="font-headline-lg text-headline-lg text-primary-container mb-2">Registration Portal</h2>
              <p className="font-body-md text-body-md text-on-surface-variant">Fill in your details to register. First 10 registrations are <strong>FREE</strong>; ₹50 fee applies thereafter.</p>
            </div>

            <form onSubmit={submit} className="space-y-8">
              {/* Personal Info */}
              <div className="space-y-5">
                <h3 className="font-headline-md text-headline-md text-primary-container text-xl border-b border-outline/10 pb-2">Personal Information</h3>
                <div>
                  <label className="block font-label-md text-label-md text-primary-container mb-1" htmlFor="name">Full Name *</label>
                  <input id="name" name="name" required value={form.name} onChange={handle} placeholder="e.g. Arjun Mehta"
                    className="w-full bg-surface-container-lowest border border-outline-variant rounded px-4 py-3 font-body-md text-body-md focus:ring-1 focus:ring-on-tertiary-container focus:border-on-tertiary-container transition-all outline-none" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block font-label-md text-label-md text-primary-container mb-1" htmlFor="class_">Class / Year</label>
                    <input id="class_" name="class_" value={form.class_} onChange={handle} placeholder="e.g. B.Tech 3rd Year"
                      className="w-full bg-surface-container-lowest border border-outline-variant rounded px-4 py-3 font-body-md text-body-md focus:ring-1 focus:ring-on-tertiary-container focus:border-on-tertiary-container transition-all outline-none" />
                  </div>
                  <div>
                    <label className="block font-label-md text-label-md text-primary-container mb-1" htmlFor="college">College / Institution *</label>
                    <input id="college" name="college" required value={form.college} onChange={handle} placeholder="e.g. SVUCE"
                      className="w-full bg-surface-container-lowest border border-outline-variant rounded px-4 py-3 font-body-md text-body-md focus:ring-1 focus:ring-on-tertiary-container focus:border-on-tertiary-container transition-all outline-none" />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block font-label-md text-label-md text-primary-container mb-1" htmlFor="email">Email *</label>
                    <input id="email" name="email" type="email" required value={form.email} onChange={handle} placeholder="you@example.com"
                      className="w-full bg-surface-container-lowest border border-outline-variant rounded px-4 py-3 font-body-md text-body-md focus:ring-1 focus:ring-on-tertiary-container focus:border-on-tertiary-container transition-all outline-none" />
                  </div>
                  <div>
                    <label className="block font-label-md text-label-md text-primary-container mb-1" htmlFor="phone">Phone Number</label>
                    <input id="phone" name="phone" type="tel" value={form.phone} onChange={handle} placeholder="+91 9999999999"
                      className="w-full bg-surface-container-lowest border border-outline-variant rounded px-4 py-3 font-body-md text-body-md focus:ring-1 focus:ring-on-tertiary-container focus:border-on-tertiary-container transition-all outline-none" />
                  </div>
                </div>
              </div>

              {/* Committee Preference */}
              <div className="space-y-5">
                <h3 className="font-headline-md text-headline-md text-primary-container text-xl border-b border-outline/10 pb-2">Committee Preference</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {[
                    { val: 'UNSC', label: 'UNSC', sub: 'United Nations Security Council' },
                    { val: 'LOK_SABHA', label: 'Lok Sabha', sub: 'Parliamentary Proceedings' },
                    { val: 'INTERNATIONAL_PRESS', label: 'International Press (IP)', sub: 'Journalists, Photographers & Caricaturists' }
                  ].map(opt => (
                    <label key={opt.val} className={`relative flex cursor-pointer rounded-lg border p-4 shadow-sm transition-colors duration-200 ${form.committee === opt.val ? 'border-primary-container bg-surface font-bold' : 'border-outline-variant bg-surface-container-lowest hover:bg-surface'}`}>
                      <input type="radio" name="committee" value={opt.val} checked={form.committee === opt.val} onChange={handle} className="sr-only" />
                      <span className="flex flex-1 flex-col">
                        <span className="block font-label-md text-label-md text-primary-container">{opt.label}</span>
                        <span className="mt-1 text-xs text-on-surface-variant font-body-md">{opt.sub}</span>
                      </span>
                      <span className={`material-symbols-outlined ${form.committee === opt.val ? 'text-primary-container icon-filled' : 'text-outline'}`}>
                        {form.committee === opt.val ? 'radio_button_checked' : 'radio_button_unchecked'}
                      </span>
                    </label>
                  ))}
                </div>

                {/* 5 Position Preferences */}
                <div>
                  <label className="block font-label-md text-label-md text-primary-container mb-1">
                    Position Preferences (select up to 5, in order of preference) *
                  </label>
                  <p className="text-sm text-on-surface-variant font-body-md mb-3">
                    {form.committee === 'UNSC' ? 'Select country portfolios for UNSC.' : form.committee === 'INTERNATIONAL_PRESS' ? 'Select press media roles for International Press.' : 'Select parliamentary portfolios for Lok Sabha Parliamentary Proceedings.'}
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[1,2,3,4,5].map(n => (
                      <div key={n}>
                        <label className="block text-xs text-on-surface-variant mb-1 uppercase font-label-sm text-label-sm">Preference {n}{n===1?' *':''}</label>
                        <div className="relative">
                          <select name={`position_${n}`} value={form[`position_${n}`]} onChange={handle} required={n===1}
                            className="w-full appearance-none bg-surface-container-lowest border border-outline-variant rounded px-4 py-2.5 font-body-md text-body-md focus:ring-1 focus:ring-on-tertiary-container focus:border-on-tertiary-container transition-all outline-none cursor-pointer">
                            <option value="">-- Select {n===1?'(required)':'(optional)'} --</option>
                            {positions.map(p => <option key={p} value={p}>{p}</option>)}
                          </select>
                          <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-on-surface-variant text-sm">expand_more</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* MUN Experience */}
              <div className="space-y-4">
                <h3 className="font-headline-md text-headline-md text-primary-container text-xl border-b border-outline/10 pb-2">MUN Experience</h3>
                <div>
                  <label className="block font-label-md text-label-md text-primary-container mb-1">Previous MUN Experience</label>
                  <textarea name="mun_experience" value={form.mun_experience} onChange={handle} rows={3} placeholder="List any previous MUN conferences you've attended, committees you've represented, and awards won..."
                    className="w-full bg-surface-container-lowest border border-outline-variant rounded px-4 py-3 font-body-md text-body-md focus:ring-1 focus:ring-on-tertiary-container focus:border-on-tertiary-container transition-all outline-none resize-none" />
                </div>
              </div>

              {/* Submit */}
              <div className="pt-4">
                <button type="submit" disabled={loading}
                  className="w-full bg-primary-container text-on-primary font-label-md text-label-md py-4 rounded shadow-sm hover:bg-primary transition-colors flex justify-center items-center gap-2 disabled:opacity-60">
                  {loading ? <span className="material-symbols-outlined animate-spin">progress_activity</span> : null}
                  {loading ? 'Submitting...' : (stats.free_slots_exhausted ? 'Register & Proceed to Pay ₹50' : 'Complete Registration')}
                  {!loading && <span className="material-symbols-outlined text-lg icon-filled">send</span>}
                </button>
                <p className="text-center text-xs text-on-surface-variant mt-3 font-body-md">
                  Your credentials will be sent to your email after registration/payment confirmation.
                </p>
              </div>
            </form>
          </div>
        </div>
      </main>
      <Footer />
    </PageWrapper>
  )
}
