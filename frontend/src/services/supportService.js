import axios from "axios";
import { API_URL } from "./api"; // Ensure we get the standard backend url

export const supportService = {
  createTicket: async (customerName, initialMessage) => {
    const response = await axios.post(`${API_URL}/support/tickets`, { customerName, initialMessage });
    return response.data;
  },

  getAllTickets: async () => {
    const response = await axios.get(`${API_URL}/support/tickets`);
    return response.data;
  },

  getTicket: async (id) => {
    const response = await axios.get(`${API_URL}/support/tickets/${id}`);
    return response.data;
  },

  sendMessage: async (id, sender, text) => {
    const response = await axios.post(`${API_URL}/support/tickets/${id}/message`, { sender, text });
    return response.data;
  },

  closeTicket: async (id) => {
    const response = await axios.put(`${API_URL}/support/tickets/${id}/close`);
    return response.data;
  }
};
