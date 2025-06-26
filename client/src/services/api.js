import axios from "axios";

const API_BASE_URL = "http://localhost:5001";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.reload();
    }
    return Promise.reject(error);
  }
);

export const authService = {
  login: async (username, password) => {
    const response = await api.post("/login", { username, password });
    return response.data;
  },
};

export const dashboardService = {
  getDashboard: async () => {
    const response = await api.get("/dashboard");
    return response.data;
  },
};

export const feedbackService = {
  submitFeedback: async (feedbackData) => {
    const response = await api.post("/feedback", feedbackData);
    return response.data;
  },

  updateFeedback: async (feedbackId, feedbackData) => {
    const response = await api.put(`/feedback/${feedbackId}`, feedbackData);
    return response.data;
  },

  acknowledgeFeedback: async (feedbackId) => {
    const response = await api.put(`/feedback/acknowledge/${feedbackId}`);
    return response.data;
  },
};

export const teamService = {
  getTeam: async () => {
    const response = await api.get("/team");
    return response.data;
  },
};

export default api;
