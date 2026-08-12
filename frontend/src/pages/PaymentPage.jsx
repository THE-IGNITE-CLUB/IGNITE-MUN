import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import axios from 'axios'
import toast from 'react-hot-toast'
import PageWrapper from '../components/PageWrapper'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

/* UTR verification states */
const UTR_STATE = {
  IDLE: 'idle',         // user hasn't verified yet
  CHECKING: 'checking', // API call in progress
  VALID: 'valid',       // passed → show green, unlock Submit
  INVALID: 'invalid',   // failed → show red, keep Submit locked
}

export default function PaymentPage() {
  const { state } = useLocation()
  const navigate = useNavigate()

  const [utr, setUtr] = useState('')
  const [utrState, setUtrState] = useState(UTR_STATE.IDLE)
  const [utrMessage, setUtrMessage] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [copied, setCopied] = useState(false)

  const upiId = '9985966627@ybl'

  if (!state?.delegate_id) {
    navigate('/register')
    return null
  }

  /* ── UPI ID copy ── */
  const copyUPI = () => {
    navigator.clipboard.writeText(upiId)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  /* ── Step 1: Verify UTR via API ── */
  const verifyUTR = async () => {
    const trimmed = utr.trim()
    if (!trimmed) {
      toast.error('Please enter your transaction reference number first.')
      return
    }
    setUtrState(UTR_STATE.CHECKING)
    setUtrMessage('')
    try {
      const res = await axios.post('/api/payment/validate-utr', { utr_number: trimmed })
      if (res.data.valid) {
        setUtrState(UTR_STATE.VALID)
        setUtrMessage(res.data.message)
      } else {
        setUtrState(UTR_STATE.INVALID)
        setUtrMessage(res.data.message)
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Verification failed. Please try again.'
      setUtrState(UTR_STATE.INVALID)
      setUtrMessage(msg)
    }
  }

  /* Reset verification whenever UTR input changes */
  const handleUtrChange = (e) => {
    setUtr(e.target.value)
    if (utrState !== UTR_STATE.IDLE) {
      setUtrState(UTR_STATE.IDLE)
      setUtrMessage('')
    }
  }

  /* ── Step 2: Submit only if VALID ── */
  const submitPayment = async () => {
    if (utrState !== UTR_STATE.VALID) {
      toast.error('Please verify your transaction reference before submitting.')
      return
    }
    setSubmitting(true)
    try {
      await axios.post('/api/payment/confirm', {
        delegate_id: state.delegate_id,
        utr_number: utr.trim(),
      })
      navigate('/payment/success', {
        state: { name: state.name, paid: true, utr: utr.trim() },
      })
    } catch (err) {
      toast.error(err.response?.data?.message || 'Submission failed. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  /* ── UI helpers ── */
  const borderColor = {
    [UTR_STATE.IDLE]: 'border-outline-variant',
    [UTR_STATE.CHECKING]: 'border-outline',
    [UTR_STATE.VALID]: 'border-secondary',
    [UTR_STATE.INVALID]: 'border-error',
  }[utrState]

  const feedbackColor = utrState === UTR_STATE.VALID ? 'text-secondary' : 'text-error'
  const feedbackIcon = utrState === UTR_STATE.VALID ? 'check_circle' : 'cancel'
  const submitLocked = utrState !== UTR_STATE.VALID || submitting

  return (
    <PageWrapper>
      <Navbar />
      <main className="flex-grow flex items-center justify-center py-20 px-[16px] md:px-[48px] bg-surface-bright pt-28">
        <div className="w-full max-w-2xl">

          {/* Header */}
          <div className="text-center mb-8">
            <span className="font-label-sm text-label-sm text-secondary uppercase tracking-widest mb-2 block">
              Step 2 of 2 — Payment
            </span>
            <h1 className="font-headline-xl-mobile text-headline-xl-mobile md:font-headline-xl md:text-headline-xl text-primary mb-2">
              Complete Payment
            </h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant">
              Hi <strong>{state.name}</strong>! Scan &amp; pay ₹50 to secure your seat.
            </p>
          </div>

          <div className="bg-surface-container-lowest border border-outline-variant/50 rounded-xl institutional-shadow overflow-hidden">
            {/* Decorative top bar */}
            <div className="h-1 w-full bg-primary" />

            <div className="p-8 md:p-10">

              {/* ── QR Code ── */}
              <div className="flex flex-col items-center mb-8">
                <div className="bg-white border border-outline-variant/40 rounded-2xl p-5 shadow-sm mb-4">
                  <img
                    src="/phonepe_qr.png"
                    alt="PhonePe QR Code — MALLA MANAS"
                    className="w-64 h-auto"
                  />
                </div>
                <p className="font-label-sm text-label-sm text-secondary uppercase tracking-widest">PhonePe — MALLA MANAS</p>
                <p className="font-body-md text-body-md text-on-surface-variant text-sm mt-1">
                  Scan using PhonePe, GPay, Paytm, or BHIM
                </p>
              </div>

              {/* ── Amount + UPI ID ── */}
              <div className="bg-surface-container rounded-xl p-5 mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <p className="font-label-sm text-label-sm text-on-surface-variant uppercase mb-1">Amount</p>
                  <p className="font-headline-lg text-headline-lg text-primary">₹50.00</p>
                  <p className="font-body-md text-body-md text-xs text-on-surface-variant mt-1">
                    IGNITE MUN 2026 · Delegate Registration
                  </p>
                </div>
                <div className="text-left sm:text-right">
                  <p className="font-label-sm text-label-sm text-on-surface-variant uppercase mb-1">UPI ID</p>
                  <div className="flex items-center gap-2">
                    <span className="font-body-md text-body-md font-mono text-primary">{upiId}</span>
                    <button
                      onClick={copyUPI}
                      className="p-1.5 rounded hover:bg-surface-container-high transition-colors"
                      title="Copy UPI ID"
                    >
                      <span className="material-symbols-outlined text-sm text-secondary">
                        {copied ? 'check' : 'content_copy'}
                      </span>
                    </button>
                  </div>
                </div>
              </div>

              {/* ── Steps ── */}
              <div className="mb-8">
                <p className="font-label-sm text-label-sm text-on-surface-variant uppercase mb-4 tracking-wider">How to Pay</p>
                <ol className="space-y-3">
                  {[
                    'Open PhonePe, GPay, Paytm, or BHIM',
                    'Scan the QR code above OR enter UPI ID: 9985966627@ybl',
                    'Enter amount ₹50 and complete the payment',
                    'Find the 12-digit UTR / Transaction Reference in your payment confirmation',
                    'Enter the UTR below → click Verify → then Submit',
                  ].map((step, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 font-label-sm text-label-sm mt-0.5 ${i === 3 || i === 4 ? 'bg-secondary text-on-secondary' : 'bg-primary-container text-on-primary'}`}>
                        {i + 1}
                      </div>
                      <p className="font-body-md text-body-md text-on-surface-variant">{step}</p>
                    </li>
                  ))}
                </ol>
              </div>

              {/* ── UTR Input + Verify ── */}
              <div className="space-y-3">
                <label className="block font-label-md text-label-md text-primary-container">
                  UTR / Transaction Reference Number *
                </label>
                <p className="text-sm text-on-surface-variant font-body-md -mt-1">
                  12-digit number from your payment confirmation (e.g. 426781234567)
                </p>

                {/* Input row */}
                <div className="flex gap-3">
                  <div className="relative flex-1">
                    <input
                      value={utr}
                      onChange={handleUtrChange}
                      placeholder="e.g. 426781234567"
                      maxLength={20}
                      className={`w-full bg-surface-container-lowest border-2 ${borderColor} rounded px-4 py-3 font-body-md text-body-md font-mono focus:outline-none transition-colors`}
                    />
                    {/* Inline state icon */}
                    {(utrState === UTR_STATE.VALID || utrState === UTR_STATE.INVALID) && (
                      <span className={`material-symbols-outlined icon-filled absolute right-3 top-1/2 -translate-y-1/2 ${feedbackColor}`}>
                        {feedbackIcon}
                      </span>
                    )}
                  </div>

                  {/* Verify button */}
                  <button
                    onClick={verifyUTR}
                    disabled={utrState === UTR_STATE.CHECKING || !utr.trim()}
                    className="px-5 py-3 bg-surface-container border-2 border-outline-variant text-primary font-label-md text-label-md rounded hover:bg-surface-container-high hover:border-secondary transition-all disabled:opacity-50 flex items-center gap-2 flex-shrink-0"
                  >
                    {utrState === UTR_STATE.CHECKING ? (
                      <>
                        <span className="material-symbols-outlined text-sm animate-spin">progress_activity</span>
                        Checking…
                      </>
                    ) : (
                      <>
                        <span className="material-symbols-outlined text-sm">verified</span>
                        Verify
                      </>
                    )}
                  </button>
                </div>

                {/* Feedback message */}
                {utrMessage && (
                  <div className={`flex items-start gap-2 px-4 py-3 rounded-lg border text-sm font-body-md ${
                    utrState === UTR_STATE.VALID
                      ? 'bg-secondary/5 border-secondary/30 text-secondary'
                      : 'bg-error/5 border-error/30 text-error'
                  }`}>
                    <span className={`material-symbols-outlined text-base flex-shrink-0 mt-0.5 icon-filled ${feedbackColor}`}>
                      {feedbackIcon}
                    </span>
                    <span>{utrMessage}</span>
                  </div>
                )}

                {/* Submit button — locked until verified */}
                <button
                  onClick={submitPayment}
                  disabled={submitLocked}
                  className={`w-full py-4 rounded font-label-md text-label-md flex items-center justify-center gap-2 shadow-sm transition-all mt-2 ${
                    submitLocked
                      ? 'bg-surface-container border border-outline-variant text-on-surface-variant cursor-not-allowed opacity-60'
                      : 'bg-primary-container text-on-primary hover:bg-tertiary-container cursor-pointer'
                  }`}
                >
                  {submitting ? (
                    <span className="material-symbols-outlined animate-spin">progress_activity</span>
                  ) : (
                    <span className={`material-symbols-outlined icon-filled ${submitLocked ? '' : ''}`}>
                      {submitLocked ? 'lock' : 'check_circle'}
                    </span>
                  )}
                  {submitting
                    ? 'Submitting…'
                    : submitLocked
                      ? 'Verify UTR first to unlock'
                      : 'Submit Payment Reference'}
                </button>

                {/* Helper note */}
                <p className="text-center text-xs text-on-surface-variant font-body-md">
                  Admin will verify your payment within 2–6 hours. Credentials sent to your registered email.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </PageWrapper>
  )
}
