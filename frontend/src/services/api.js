import axios from "axios"

export const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api"
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
})

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token")
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token")
      localStorage.removeItem("user")
      window.location.href = "/"
    }
    return Promise.reject(error)
  },
)

export const agencyService = {
  getAll: () => api.get("/agencies"),
  getNearby: (latitude, longitude) =>
    api.get("/agencies/nearby", {
      params: { latitude, longitude },
    }),
  getById: (id) => api.get(`/agencies/${id}`),
  create: (data) => api.post("/agencies", data),
}

export const bookingService = {
  create: (bookingData) => api.post("/bookings", bookingData),
  getUserBookings: (userId) => api.get(`/bookings/${userId}`),
  update: (id, data) => api.put(`/bookings/${id}`, data),
  delete: (id) => api.delete(`/bookings/${id}`),
}

export default api
