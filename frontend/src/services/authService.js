import api from "./api"

export const authService = {
  login: async (email, password) => {
    const response = await api.post("/auth/login", { email, password })
    if (response.data.token) {
      localStorage.setItem("token", response.data.token)
      localStorage.setItem("user", JSON.stringify(response.data.user))
      localStorage.setItem("userType", "user")
    }
    return response.data
  },

  register: async (firstName, lastName, email, phone, password) => {
    const response = await api.post("/auth/register", {
      firstName,
      lastName,
      email,
      phone,
      password,
    })
    if (response.data.token) {
      localStorage.setItem("token", response.data.token)
      localStorage.setItem("user", JSON.stringify(response.data.user))
      localStorage.setItem("userType", "user")
    }
    return response.data
  },

  logout: () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    localStorage.removeItem("userType")
  },

  getCurrentUser: () => {
    return JSON.parse(localStorage.getItem("user") || "null")
  },

  isAuthenticated: () => {
    return !!localStorage.getItem("token")
  },

  getToken: () => {
    return localStorage.getItem("token")
  },

  updateProfile: async (firstName, lastName) => {
    const response = await api.put("/auth/profile", { firstName, lastName })
    localStorage.setItem("user", JSON.stringify(response.data))
    return response.data
  },
}

export default authService
