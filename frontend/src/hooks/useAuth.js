import { useState, useEffect, useCallback } from "react"
import authService from "../services/authService"

export const useAuth = () => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    const currentUser = authService.getCurrentUser()
    setUser(currentUser)
    setIsAuthenticated(authService.isAuthenticated())
    setLoading(false)
  }, [])

  const login = useCallback(async (email, password) => {
    setLoading(true)
    try {
      const data = await authService.login(email, password)
      setUser(data.user)
      setIsAuthenticated(true)
      return data
    } catch (error) {
      throw error
    } finally {
      setLoading(false)
    }
  }, [])

  const register = useCallback(async (firstName, lastName, email, password) => {
    setLoading(true)
    try {
      const data = await authService.register(firstName, lastName, email, password)
      setUser(data.user)
      setIsAuthenticated(true)
      return data
    } catch (error) {
      throw error
    } finally {
      setLoading(false)
    }
  }, [])

  const logout = useCallback(() => {
    authService.logout()
    setUser(null)
    setIsAuthenticated(false)
  }, [])

  const updateProfile = useCallback(async (firstName, lastName) => {
    try {
      const data = await authService.updateProfile(firstName, lastName)
      setUser(data)
      return data
    } catch (error) {
      throw error
    }
  }, [])

  return {
    user,
    loading,
    isAuthenticated,
    login,
    register,
    logout,
    updateProfile,
  }
}

export default useAuth
