import { Navigate } from "react-router-dom"
import useAuth from "../hooks/useAuth"

export default function PrivateRoute({ children }) {
  const { isAuthenticated, loading } = useAuth()

  if (loading) {
    return <div className="pt-20 text-center py-12">Loading...</div>
  }

  return isAuthenticated ? children : <Navigate to="/" replace />
}
