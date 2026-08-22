import axios from 'axios'
import toast from 'react-hot-toast'

// In production (GitHub Pages), VITE_API_URL points to the Render backend.
// In development, it's empty so Vite proxy handles /api/ → localhost:5000
const API_BASE = import.meta.env.VITE_API_URL || ''

const api = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
  timeout: 60000, // 60s — Render free tier can take 30-50s to cold-start
})

// Show a warning toast if a request takes more than 8 seconds (Render waking up)
api.interceptors.request.use(config => {
  config._toastId = null
  config._slowTimer = setTimeout(() => {
    config._toastId = toast.loading('⌛ Server is waking up… please wait (~30s)', { duration: 50000 })
  }, 8000)
  return config
})

api.interceptors.response.use(
  response => {
    clearTimeout(response.config._slowTimer)
    if (response.config._toastId) toast.dismiss(response.config._toastId)
    return response
  },
  error => {
    if (error.config) {
      clearTimeout(error.config._slowTimer)
      if (error.config._toastId) toast.dismiss(error.config._toastId)
    }
    return Promise.reject(error)
  }
)

export default api
