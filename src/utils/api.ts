// import axios from 'axios';
// import { mockApi, useMockApi } from './mockApi';

// // API base URL - should be configured via environment variables
// const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.golive.com';

// // Check if we should use mock API
// const USE_MOCK_API = useMockApi();

// // Create axios instance with default config
// const apiClient = axios.create({
//   baseURL: API_BASE_URL,
//   headers: {
//     'Content-Type': 'application/json',
//   },
// });

// // Request interceptor to add auth token
// apiClient.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem('authToken');
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

// // Response interceptor for error handling
// apiClient.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response?.status === 401) {
//       // Handle unauthorized - clear token and redirect to login
//       localStorage.removeItem('authToken');
//       window.location.href = '/admin/login';
//     }
//     return Promise.reject(error);
//   }
// );

// // Event API
// export const eventApi = {
//   // Get event metadata by ID
//   getEvent: async (eventId: string) => {
//     if (USE_MOCK_API) {
//       return await mockApi.eventApi.getEvent(eventId);
//     }
//     const response = await apiClient.get(`/api/events/${eventId}`);
//     return response.data;
//   },

//   // Create new event (admin only)
//   createEvent: async (eventData: {
//     name: string;
//     description?: string;
//     startTime: string;
//     endTime?: string;
//     accessMode: 'open' | 'email' | 'password' | 'payment';
//     password?: string;
//     paymentAmount?: number;
//     streamUrl?: string;
//   }) => {
//     if (USE_MOCK_API) {
//       return await mockApi.eventApi.createEvent(eventData);
//     }
//     const response = await apiClient.post('/api/events/create', eventData);
//     return response.data;
//   },

//   // Update event (admin only)
//   updateEvent: async (eventId: string, eventData: Partial<{
//     name: string;
//     description?: string;
//     startTime: string;
//     endTime?: string;
//     accessMode: 'open' | 'email' | 'password' | 'payment';
//     password?: string;
//     paymentAmount?: number;
//     streamUrl?: string;
//   }>) => {
//     if (USE_MOCK_API) {
//       return await mockApi.eventApi.updateEvent(eventId, eventData);
//     }
//     const response = await apiClient.put(`/api/events/${eventId}`, eventData);
//     return response.data;
//   },

//   // Delete event (admin only)
//   deleteEvent: async (eventId: string) => {
//     if (USE_MOCK_API) {
//       return await mockApi.eventApi.deleteEvent(eventId);
//     }
//     const response = await apiClient.delete(`/api/events/${eventId}`);
//     return response.data;
//   },

//   // List all events (admin only)
//   listEvents: async () => {
//     if (USE_MOCK_API) {
//       return await mockApi.eventApi.listEvents();
//     }
//     const response = await apiClient.get('/api/events');
//     return response.data;
//   },
// };

// // User/Access API
// export const userApi = {
//   // Login/validate access
//   login: async (credentials: {
//     eventId: string;
//     email?: string;
//     password?: string;
//   }) => {
//     if (USE_MOCK_API) {
//       return await mockApi.userApi.login(credentials);
//     }
//     const response = await apiClient.post('/api/users/login', credentials);
//     return response.data;
//   },

//   // Register for event (with payment if required)
//   register: async (registrationData: {
//     eventId: string;
//     name: string;
//     email: string;
//     organization?: string;
//     paymentToken?: string; // Stripe payment token
//   }) => {
//     if (USE_MOCK_API) {
//       return await mockApi.userApi.register(registrationData);
//     }
//     const response = await apiClient.post('/api/users/register', registrationData);
//     return response.data;
//   },

//   // Get user access status
//   getAccessStatus: async (eventId: string) => {
//     if (USE_MOCK_API) {
//       return await mockApi.userApi.getAccessStatus(eventId);
//     }
//     const response = await apiClient.get(`/api/users/access/${eventId}`);
//     return response.data;
//   },
// };

// // Analytics API
// export const analyticsApi = {
//   // Track viewer activity
//   trackEvent: async (analyticsData: {
//     eventId: string;
//     userId?: string;
//     action: string;
//     timestamp: number;
//     duration?: number;
//     deviceType?: string;
//     browser?: string;
//     metadata?: Record<string, any>;
//   }) => {
//     if (USE_MOCK_API) {
//       return await mockApi.analyticsApi.trackEvent(analyticsData);
//     }
//     const response = await apiClient.post('/api/analytics', analyticsData);
//     return response.data;
//   },

//   // Get analytics for event (admin only)
//   getEventAnalytics: async (eventId: string) => {
//     if (USE_MOCK_API) {
//       return await mockApi.analyticsApi.getEventAnalytics(eventId);
//     }
//     const response = await apiClient.get(`/api/analytics/event/${eventId}`);
//     return response.data;
//   },

//   // Get dashboard analytics (admin only)
//   getDashboardAnalytics: async (filters?: {
//     startDate?: string;
//     endDate?: string;
//     eventIds?: string[];
//   }) => {
//     if (USE_MOCK_API) {
//       return await mockApi.analyticsApi.getDashboardAnalytics(filters);
//     }
//     const response = await apiClient.get('/api/analytics/dashboard', {
//       params: filters,
//     });
//     return response.data;
//   },
// };

// // Admin API
// export const adminApi = {
//   // Admin login
//   login: async (email: string, password: string) => {
//     if (USE_MOCK_API) {
//       return await mockApi.adminApi.login(email, password);
//     }
//     const response = await apiClient.post('/api/admin/login', {
//       email,
//       password,
//     });
//     return response.data;
//   },

//   // Get VOD library
//   getVodLibrary: async () => {
//     if (USE_MOCK_API) {
//       return await mockApi.adminApi.getVodLibrary();
//     }
//     const response = await apiClient.get('/api/admin/vod');
//     return response.data;
//   },

//   // Get user management data
//   getUsers: async (eventId?: string) => {
//     if (USE_MOCK_API) {
//       return await mockApi.adminApi.getUsers(eventId);
//     }
//     const response = await apiClient.get('/api/admin/users', {
//       params: { eventId },
//     });
//     return response.data;
//   },

//   // Control MediaLive channel
//   controlChannel: async (channelId: string, action: 'start' | 'stop') => {
//     if (USE_MOCK_API) {
//       return await mockApi.adminApi.controlChannel(channelId, action);
//     }
//     const response = await apiClient.post('/api/admin/channels/control', {
//       channelId,
//       action,
//     });
//     return response.data;
//   },
// };

// // Payment API (Stripe)
// export const paymentApi = {
//   // Create payment intent
//   createPaymentIntent: async (eventId: string, amount: number) => {
//     if (USE_MOCK_API) {
//       return await mockApi.paymentApi.createPaymentIntent(eventId, amount);
//     }
//     const response = await apiClient.post('/api/payment/create-intent', {
//       eventId,
//       amount,
//     });
//     return response.data;
//   },

//   // Confirm payment
//   confirmPayment: async (paymentIntentId: string, paymentMethodId: string) => {
//     if (USE_MOCK_API) {
//       return await mockApi.paymentApi.confirmPayment(paymentIntentId, paymentMethodId);
//     }
//     const response = await apiClient.post('/api/payment/confirm', {
//       paymentIntentId,
//       paymentMethodId,
//     });
//     return response.data;
//   },
// };

// export default apiClient;


import axios from "axios";

// const API_BASE_URL = "http://localhost:5000";
const API_BASE_URL = "https://d2wmdj5cojtj0q.cloudfront.net/app";

// Axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach token if exists
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("authToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle unauthorized
apiClient.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("authToken");
      localStorage.removeItem("authData");
      window.location.href = "/admin/login";
    }
    return Promise.reject(error);
  }
);

// --------------------------------------------------------
// ADMIN LOGIN (Swagger)
// --------------------------------------------------------
export const adminApi = {
  login: async (username: string, password: string) => {
    const response = await apiClient.post("/api/admin/login", {
      username,
      password,
    });
    return response.data;
  },

  getVodLibrary: async () => {
    const response = await apiClient.get("/api/admin/vod");
    return response.data;
  },
};

// --------------------------------------------------------
// EVENT MANAGEMENT (Swagger)
// --------------------------------------------------------
export const eventApi = {
  createEvent: async (payload: any) => {
    const response = await apiClient.post("/api/admin/event/create", payload);
    return response.data;
  },

  listEvents: async () => {
    const response = await apiClient.get("/api/admin/event/list");
    return response.data;
  },

  updateEvent: async (eventId: string, payload: any) => {
    const response = await apiClient.put(
      `/api/admin/event/update/${eventId}`,
      payload
    );
    return response.data;
  },

  deleteEvent: async (eventId: string) => {
    const response = await apiClient.delete(
      `/api/admin/event/delete/${eventId}`
    );
    return response.data;
  },
  getEvent: async (eventId: string) => {
    const response = await apiClient.get(`/api/admin/event/event/${eventId}`);
    return response.data;
  },

  // Channel control
  startChannel: async (channelId: string) => {
    const response = await apiClient.post("/api/admin/event/channel/start", {
      channelId,
    });
    return response.data;
  },

  stopChannel: async (channelId: string) => {
    const response = await apiClient.post("/api/admin/event/channel/stop", {
      channelId,
    });
    return response.data;
  },
};

// --------------------------------------------------------
// USERS (NOT IN YOUR ADMIN SWAGGER – Optional)
// --------------------------------------------------------
export const userApi = {
  login: async (data: any) => {
    const response = await apiClient.post("/api/users/login", data);
    return response.data;
  },

  register: async (data: any) => {
    const response = await apiClient.post("/api/users/register", data);
    return response.data;
  },

  getAccessStatus: async (eventId: string) => {
    const response = await apiClient.get(`/api/users/access/${eventId}`);
    return response.data;
  },
};

// --------------------------------------------------------
// ANALYTICS (If backend supports it)
// --------------------------------------------------------
export const analyticsApi = {
  getEventAnalytics: async (eventId: string) => {
    const response = await apiClient.get(`/api/analytics/event/${eventId}`);
    return response.data;
  },

  getDashboardAnalytics: async (filters?: {
    startDate?: string;
    endDate?: string;
    eventIds?: string[];
  }) => {
    const response = await apiClient.get(`/api/analytics/dashboard`, {
      params: filters,
    });
    return response.data;
  },

  trackEvent: async (analyticsData: {
    eventId: string;
    userId?: string;
    action: string;
    timestamp: number;
    duration?: number;
    deviceType?: string;
    browser?: string;
    metadata?: Record<string, any>;
  }) => {
    const response = await apiClient.post('/api/analytics', analyticsData);
    return response.data;
  },
};

// --------------------------------------------------------
// PAYMENTS (Optional)
// --------------------------------------------------------
export const paymentApi = {
  createPaymentIntent: async (eventId: string, amount: number) => {
    const response = await apiClient.post(`/api/payment/create-intent`, {
      eventId,
      amount,
    });
    return response.data;
  },

  confirmPayment: async (paymentIntentId: string, paymentMethodId: string) => {
    const response = await apiClient.post(`/api/payment/confirm`, {
      paymentIntentId,
      paymentMethodId,
    });
    return response.data;
  },
};

export default apiClient;

