import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import axios from 'axios'
import toast from 'react-hot-toast'
import PageWrapper from '../components/PageWrapper'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const ROLES = [
  { val: 'oc', label: 'Organising Committee (OC)', desc: 'Logistics, hospitality & event management' },
  { val: 'eb', label: 'Executive Board (EB)', desc: 'Dais member — Chair, Vice-Chair, Rapporteur' },
]

export default function OrganizerRegister() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    name: '', email: '', phone: '', designation: '', role: 'oc',
    department: '', committee: '', ignite_role: '', ignite_batch: '',
    experience: '', statement: '',
  })
  const [loading, setLoading] = useState(false)
  const handle = (e) => setForm(p => ({ ...p, [e.target.name]: e.target.value }))

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await axios.post('/api/organizer/register', form)
      toast.success('Application submitted! You will receive credentials once approved.')
      navigate('/')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Submission failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <PageWrapper>
      <Navbar />
      <main className="flex-grow relative pt-20">
        {/* Left panel */}
        <div className="hidden lg:block fixed left-0 top-0 bottom-0 w-5/12 z-0">
          <div className="absolute inset-0 bg-cover bg-center h-full"
            style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDLVnVPymgIVNNOlJjMDEFBn2TFzkTCpLhrSK-kb4Awow-8Xw3K-rCXc0_UcQBP9lK5NrP7vYJmJuGzbZeoNN4koKXEYJamlcRem1UYZUBVyxlZli7cL7O6JP96vsi2lhIgP5g9YoRc7FbD6iQbiDNBZyOO2KpeD648mGFrBERbPWyJeLzbFF6qxmI-gbuKm-91a5TclzaftUyO7FVPffrxTAROrG2tqYhN5VH2CBStteG0cyx9K-sh')" }} />
          <div className="absolute inset-0 bg-primary-container/85" />
          <div className="absolute bottom-[48px] left-[48px] pr-12 text-on-primary">
            <h1 className="font-headline-xl text-headline-xl mb-4">Join the Team</h1>
            <p className="font-body-lg text-body-lg text-inverse-primary/90 mb-6">Become part of the secretariat powering IGNITE MUN 2026.</p>
            <div className="space-y-3">
              {['Shape the future of diplomacy education', 'Build leadership and event management skills', 'Work alongside passionate peers at SVU', 'Receive recognition and certification'].map((p, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
                    <span className="material-symbols-outlined text-on-secondary text-xs icon-filled">check</span>
                  </div>
                  <p className="font-body-md text-body-md text-inverse-primary/90 text-sm">{p}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Form panel */}
        <div className="w-full lg:ml-[41.67%] lg:w-7/12 bg-surface-container-lowest min-h-screen flex flex-col justify-center py-12 px-6 sm:px-12 lg:px-16">
          <div className="max-w-xl mx-auto w-full">
            <div className="mb-8 pb-6 border-b border-outline/10">
              <h2 className="font-headline-lg text-headline-lg text-primary-container mb-2">Staff / EB Application</h2>
              <p className="font-body-md text-body-md text-on-surface-variant">Applications are reviewed by the Secretariat. You'll receive credentials upon approval.</p>
            </div>

            <form onSubmit={submit} className="space-y-8">
              {/* Personal */}
              <div className="space-y-5">
                <h3 className="text-xl font-headline-md text-headline-md text-primary-container border-b border-outline/10 pb-2">Personal Details</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { name: 'name', label: 'Full Name *', placeholder: 'Priya Sharma', required: true },
                    { name: 'email', label: 'Email *', placeholder: 'you@example.com', type: 'email', required: true },
                    { name: 'phone', label: 'Phone', placeholder: '+91 9999999999' },
                    { name: 'department', label: 'Department', placeholder: 'B.Tech CSE' },
                  ].map(f => (
                    <div key={f.name}>
                      <label className="block font-label-md text-label-md text-primary-container mb-1" htmlFor={f.name}>{f.label}</label>
                      <input id={f.name} name={f.name} type={f.type || 'text'} required={f.required} value={form[f.name]} onChange={handle} placeholder={f.placeholder}
                        className="w-full border border-outline-variant rounded px-4 py-3 font-body-md text-body-md focus:ring-1 focus:ring-on-tertiary-container focus:border-on-tertiary-container outline-none transition-all bg-surface-container-lowest" />
                    </div>
                  ))}
                </div>
                <div>
                  <label className="block font-label-md text-label-md text-primary-container mb-1">Designation / Year</label>
                  <input name="designation" value={form.designation} onChange={handle} placeholder="e.g. 2nd Year B.Tech / Secretary General"
                    className="w-full border border-outline-variant rounded px-4 py-3 font-body-md text-body-md focus:ring-1 focus:ring-on-tertiary-container outline-none transition-all bg-surface-container-lowest" />
                </div>
              </div>

              {/* Role */}
              <div className="space-y-4">
                <h3 className="text-xl font-headline-md text-headline-md text-primary-container border-b border-outline/10 pb-2">Role Applied For *</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {ROLES.map(r => (
                    <label key={r.val} className={`relative flex cursor-pointer rounded-lg border p-4 transition-colors ${form.role === r.val ? 'border-primary-container bg-surface' : 'border-outline-variant bg-surface-container-lowest hover:bg-surface'}`}>
                      <input type="radio" name="role" value={r.val} checked={form.role === r.val} onChange={handle} className="sr-only" />
                      <div className="flex-1">
                        <p className="font-label-md text-label-md text-primary-container">{r.label}</p>
                        <p className="text-sm text-on-surface-variant mt-1 font-body-md">{r.desc}</p>
                      </div>
                      <span className={`material-symbols-outlined self-start ml-2 ${form.role === r.val ? 'text-primary-container icon-filled' : 'text-outline'}`}>
                        {form.role === r.val ? 'radio_button_checked' : 'radio_button_unchecked'}
                      </span>
                    </label>
                  ))}
                </div>

                {form.role === 'eb' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                    <div>
                      <label className="block font-label-md text-label-md text-primary-container mb-1">Preferred Committee</label>
                      <select name="committee" value={form.committee} onChange={handle}
                        className="w-full border border-outline-variant rounded px-4 py-3 font-body-md text-body-md focus:ring-1 focus:ring-on-tertiary-container outline-none bg-surface-container-lowest">
                        <option value="">Select Committee</option>
                        <option>UNSC</option>
                        <option>Lok Sabha</option>
                        <option>International Press</option>
                      </select>
                    </div>
                    <div>
                      <label className="block font-label-md text-label-md text-primary-container mb-1">Preferred EB Position</label>
                      <select name="ignite_role" value={form.ignite_role} onChange={handle}
                        className="w-full border border-outline-variant rounded px-4 py-3 font-body-md text-body-md focus:ring-1 focus:ring-on-tertiary-container outline-none bg-surface-container-lowest">
                        <option value="">Select Position</option>
                        <option>Chairperson</option>
                        <option>Vice-Chairperson</option>
                        <option>Rapporteur</option>
                      </select>
                    </div>
                  </div>
                )}
              </div>

              {/* IGNITE Club */}
              <div className="space-y-4">
                <h3 className="text-xl font-headline-md text-headline-md text-primary-container border-b border-outline/10 pb-2">IGNITE Club</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-label-md text-label-md text-primary-container mb-1">IGNITE Batch</label>
                    <input name="ignite_batch" value={form.ignite_batch} onChange={handle} placeholder="e.g. Batch 2024"
                      className="w-full border border-outline-variant rounded px-4 py-3 font-body-md text-body-md focus:ring-1 focus:ring-on-tertiary-container outline-none bg-surface-container-lowest" />
                  </div>
                </div>
                <div>
                  <label className="block font-label-md text-label-md text-primary-container mb-1">MUN / Leadership Experience</label>
                  <textarea name="experience" value={form.experience} onChange={handle} rows={3} placeholder="Describe your past MUN experience, leadership roles..."
                    className="w-full border border-outline-variant rounded px-4 py-3 font-body-md text-body-md focus:ring-1 focus:ring-on-tertiary-container outline-none resize-none bg-surface-container-lowest" />
                </div>
                <div>
                  <label className="block font-label-md text-label-md text-primary-container mb-1">Statement of Purpose *</label>
                  <textarea name="statement" required value={form.statement} onChange={handle} rows={4} placeholder="Why do you want to be part of IGNITE MUN 2026's secretariat?"
                    className="w-full border border-outline-variant rounded px-4 py-3 font-body-md text-body-md focus:ring-1 focus:ring-on-tertiary-container outline-none resize-none bg-surface-container-lowest" />
                </div>
              </div>

              <button type="submit" disabled={loading}
                className="w-full bg-primary-container text-on-primary font-label-md text-label-md py-4 rounded hover:bg-primary transition-colors flex justify-center items-center gap-2 shadow-sm disabled:opacity-60">
                {loading ? <span className="material-symbols-outlined animate-spin">progress_activity</span> : <span className="material-symbols-outlined icon-filled">send</span>}
                {loading ? 'Submitting Application…' : 'Submit Application'}
              </button>
              <p className="text-xs text-on-surface-variant text-center font-body-md">Your application will be reviewed by the secretariat. You will be notified once approved.</p>
            </form>
          </div>
        </div>
      </main>
      <Footer />
    </PageWrapper>
  )
}
