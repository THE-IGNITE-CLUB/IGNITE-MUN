import axios from 'axios'

// In production (GitHub Pages), VITE_API_URL points to the Render backend.
// In development, it's empty so Vite proxy handles /api/ → localhost:5000
const API_BASE = import.meta.env.VITE_API_URL || ''

const api = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
})

export default api
