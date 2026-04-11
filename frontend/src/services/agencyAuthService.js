import axios from "axios"
import { API_URL } from "./api"

class AgencyAuthService {
  async register(agencyName, ownerName, email, phone, password, drivingLicense, vehiclePhotos, location) {
    const response = await axios.post(`${API_URL}/agency-auth/register`, {
      agencyName,
      ownerName,
      email,
      phone,
      password,
      drivingLicense,
      vehiclePhotos,
      location,
    })

    if (response.data.token) {
      localStorage.setItem("token", response.data.token)
      localStorage.setItem("user", JSON.stringify(response.data.agency))
      localStorage.setItem("userType", "agency")
    }

    return response.data
  }

  async login(email, password) {
    const response = await axios.post(`${API_URL}/agency-auth/login`, {
      email,
      password,
    })

    if (response.data.token) {
      localStorage.setItem("token", response.data.token)
      localStorage.setItem("user", JSON.stringify(response.data.agency))
      localStorage.setItem("userType", "agency")
    }

    return response.data
  }

  logout() {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    localStorage.removeItem("userType")
  }

  getCurrentUser() {
    return JSON.parse(localStorage.getItem("user"))
  }

  getToken() {
    return localStorage.getItem("token")
  }

  async updateProfile(profileData) {
    const token = this.getToken()
    const response = await axios.put(
      `${API_URL}/agency-auth/profile`,
      profileData,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    )

    if (response.data.success) {
      localStorage.setItem("user", JSON.stringify(response.data.data))
    }

    return response.data
  }
}

export const agencyAuthService = new AgencyAuthService()

