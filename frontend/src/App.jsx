import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'

// Pages
import Home from './pages/Home'
import Register from './pages/Register'
import Login from './pages/Login'
import DelegateDashboard from './pages/DelegateDashboard'
import PaymentPage from './pages/PaymentPage'
import PaymentSuccess from './pages/PaymentSuccess'
import OrganizerRegister from './pages/OrganizerRegister'
import AdminPanel from './pages/AdminPanel'
import EBCommandCenter from './pages/EBCommandCenter'
import CampusExplore from './pages/CampusExplore'
import HybridDiplomacy from './pages/HybridDiplomacy'
import NotFound from './pages/NotFound'

export default function App() {
  const location = useLocation()
  return (
    <AuthProvider>
      <Toaster position="top-right" toastOptions={{ duration: 4000 }} />
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={
            <ProtectedRoute allowedRoles={['delegate']}>
              <DelegateDashboard />
            </ProtectedRoute>
          } />
          <Route path="/payment" element={<PaymentPage />} />
          <Route path="/payment/success" element={<PaymentSuccess />} />
          <Route path="/organizer/register" element={<OrganizerRegister />} />
          <Route path="/admin" element={
            <ProtectedRoute allowedRoles={['super_admin', 'eb', 'oc', 'admin']}>
              <AdminPanel />
            </ProtectedRoute>
          } />
          <Route path="/admin/eb" element={
            <ProtectedRoute allowedRoles={['super_admin', 'eb', 'admin']}>
              <EBCommandCenter />
            </ProtectedRoute>
          } />
          <Route path="/campus" element={<CampusExplore />} />
          <Route path="/hybrid-diplomacy" element={<HybridDiplomacy />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AnimatePresence>
    </AuthProvider>
  )
}
