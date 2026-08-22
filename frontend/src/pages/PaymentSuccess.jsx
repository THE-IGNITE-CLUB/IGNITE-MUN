import { useLocation, Link } from 'react-router-dom'
import { useState } from 'react'
import PageWrapper from '../components/PageWrapper'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

export default function PaymentSuccess() {
  const { state } = useLocation()
  const isFree = state?.free
  const name = state?.name || 'Delegate'
  const email = state?.email || ''
  const utr = state?.utr
  const userId = state?.user_id
  const [copied, setCopied] = useState(false)

  const copyId = () => {
    if (userId) {
      navigator.clipboard.writeText(userId)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <PageWrapper>
      <Navbar />
      <main className="flex-grow flex items-center justify-center py-20 px-[16px] md:px-[48px] bg-surface-bright pt-28">
        <div className="w-full max-w-lg text-center">
          {/* Success Icon */}
          <div className={`w-24 h-24 rounded-full mx-auto flex items-center justify-center mb-8 shadow-lg ${isFree ? 'bg-secondary' : 'bg-secondary/20 border-2 border-secondary'}`}>
            <span className={`material-symbols-outlined text-5xl icon-filled ${isFree ? 'text-on-secondary' : 'text-secondary'}`}>check_circle</span>
          </div>

          <h1 className="font-headline-lg text-headline-lg text-primary-container mb-3">
            {isFree ? 'Registration Confirmed!' : 'Payment Reference Submitted!'}
          </h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant mb-8">
            {isFree
              ? `Welcome ${name}! Your registration is confirmed. Credentials sent to ${email}.`
              : `Thank you ${name}! Your UTR has been submitted for verification. Credentials will be emailed within 2–6 hours once verified.`}
          </p>

          {/* Transaction detail box */}
          <div className="bg-surface-container-lowest border border-outline-variant/50 rounded-xl p-6 mb-8 institutional-shadow text-left">
            {isFree ? (
              <>
                <div className="flex items-center justify-between mb-4 pb-4 border-b border-outline-variant/50">
                  <span className="font-label-sm text-label-sm text-on-surface-variant uppercase">Status</span>
                  <span className="inline-flex items-center gap-1 bg-secondary/10 text-secondary px-3 py-1 rounded-full font-label-sm text-label-sm">
                    <span className="material-symbols-outlined text-sm icon-filled">check_circle</span> Free Slot Secured
                  </span>
                </div>
                <div className="flex justify-between text-sm mb-3">
                  <span className="text-on-surface-variant font-label-md text-label-md">Amount</span>
                  <span className="font-bold text-secondary">₹0 (Free)</span>
                </div>
                {/* Show User ID on screen as fallback for email */}
                {userId && (
                  <div className="mt-4 pt-4 border-t border-outline-variant/50">
                    <p className="text-xs text-on-surface-variant uppercase font-label-sm mb-2">Your Delegate ID (save this!)</p>
                    <div className="flex items-center justify-between bg-primary-container/10 border border-primary-container/30 rounded-lg px-4 py-3">
                      <span className="font-mono font-bold text-primary-container text-lg tracking-widest">{userId}</span>
                      <button onClick={copyId} className="ml-3 text-primary-container hover:text-primary transition-colors" title="Copy">
                        <span className="material-symbols-outlined text-base">{copied ? 'check' : 'content_copy'}</span>
                      </button>
                    </div>
                    <p className="text-xs text-on-surface-variant mt-2">
                      ⚠️ Your password was sent to <strong>{email}</strong>. Check spam if not received. Use this ID + password to login.
                    </p>
                  </div>
                )}
              </>
            ) : (
              <>
                <div className="flex items-center justify-between mb-4 pb-4 border-b border-outline-variant/50">
                  <span className="font-label-sm text-label-sm text-on-surface-variant uppercase">Status</span>
                  <span className="inline-flex items-center gap-1 bg-on-tertiary-container/10 text-on-tertiary-container px-3 py-1 rounded-full font-label-sm text-label-sm">
                    <span className="material-symbols-outlined text-sm">hourglass_top</span> Pending Verification
                  </span>
                </div>
                <div className="flex justify-between text-sm mb-3">
                  <span className="text-on-surface-variant font-label-md text-label-md">Amount Paid</span>
                  <span className="font-bold text-primary">₹50</span>
                </div>
                {utr && (
                  <div className="flex justify-between text-sm">
                    <span className="text-on-surface-variant font-label-md text-label-md">UTR Reference</span>
                    <span className="font-mono text-primary text-sm">{utr}</span>
                  </div>
                )}
              </>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/login" className="px-8 py-3 bg-primary-container text-on-primary rounded font-label-md text-label-md hover:bg-tertiary-container transition-colors shadow-sm">
              Go to Login
            </Link>
            <Link to="/" className="px-8 py-3 border border-outline-variant rounded font-label-md text-label-md text-on-surface-variant hover:bg-surface-container transition-colors">
              Back to Home
            </Link>
          </div>

          <p className="mt-8 text-xs text-on-surface-variant font-body-md">
            For support, contact <a href="mailto:manas.malla13@gmail.com" className="text-secondary hover:underline">manas.malla13@gmail.com</a>
          </p>
        </div>
      </main>
      <Footer />
    </PageWrapper>
  )
}

