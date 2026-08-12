import { useState, useEffect } from 'react'

export function useCountdown(targetDate) {
  const calculate = () => {
    const now = new Date().getTime()
    const target = new Date(targetDate).getTime()
    const diff = target - now
    if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 }
    return {
      days: Math.floor(diff / (1000 * 60 * 60 * 24)),
      hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
      minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
      seconds: Math.floor((diff % (1000 * 60)) / 1000),
    }
  }

  const [timeLeft, setTimeLeft] = useState(calculate())

  useEffect(() => {
    const interval = setInterval(() => setTimeLeft(calculate()), 1000)
    return () => clearInterval(interval)
  }, [targetDate])

  return timeLeft
}
