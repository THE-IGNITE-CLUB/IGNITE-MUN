import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'
import { useEffect } from 'react'

export default function ProtectedRoute({ children, allowedRoles = [] }) {
  const { user, role, loading } = useAuth()

  useEffect(() => {
    if (!loading && (!user || (allowedRoles.length > 0 && !allowedRoles.includes(role)))) {
      toast.error('Access Denied: Only authorized staff with approved credentials can access this section.')
    }
  }, [user, role, loading, allowedRoles])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-primary">
        <span className="material-symbols-outlined text-4xl animate-spin">progress_activity</span>
      </div>
    )
  }

  if (!user || (allowedRoles.length > 0 && !allowedRoles.includes(role))) {
    // Redirect to super admin login if target role is super_admin, else general login
    return <Navigate to={allowedRoles.includes('super_admin') ? "/admin/login" : "/login"} replace />
  }

  return children
}
