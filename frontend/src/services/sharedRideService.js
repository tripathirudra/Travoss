import axios from "axios";
import { API_URL } from "./api"; // Keep consistency

const getToken = () => localStorage.getItem("token");

export const sharedRideService = {
  offerRide: async (rideData) => {
    const config = {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    };
    const response = await axios.post(`${API_URL}/shared-rides`, rideData, config);
    return response.data;
  },

  searchRides: async ({ origin, destination, date }) => {
    let queryParams = [];
    if (origin) queryParams.push(`origin=${encodeURIComponent(origin)}`);
    if (destination) queryParams.push(`destination=${encodeURIComponent(destination)}`);
    if (date) queryParams.push(`date=${encodeURIComponent(date)}`);
    
    const queryString = queryParams.length > 0 ? `?${queryParams.join("&")}` : "";
    
    const response = await axios.get(`${API_URL}/shared-rides/search${queryString}`);
    return response.data;
  },

  requestRide: async (rideId) => {
    const config = {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    };
    const response = await axios.post(`${API_URL}/shared-rides/${rideId}/request`, {}, config);
    return response.data;
  },

  getMyOfferedRides: async () => {
    const config = {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    };
    const response = await axios.get(`${API_URL}/shared-rides/manage/my-rides`, config);
    return response.data;
  },

  getMyBookings: async () => {
    const config = {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    };
    const response = await axios.get(`${API_URL}/shared-rides/my-bookings`, config);
    return response.data;
  },

  updateRequestStatus: async (rideId, passengerId, status) => {
    const config = {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    };
    const response = await axios.patch(`${API_URL}/shared-rides/${rideId}/requests/${passengerId}`, { status }, config);
    return response.data;
  }
};
