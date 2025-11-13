// Mock API service for development/testing without backend
// This simulates backend responses and can be easily replaced when real backend is ready

// Mock delay to simulate network latency
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Mock data storage
let mockEvents: any[] = [
  {
    id: 'event-1',
    name: 'Tech Conference 2024',
    description: 'Annual technology conference featuring industry leaders',
    startTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    endTime: new Date(Date.now() + 26 * 60 * 60 * 1000).toISOString(),
    accessMode: 'payment',
    paymentAmount: 29.99,
    status: 'scheduled',
    channelId: 'channel-1',
    viewerCount: 0,
    streamUrl: 'https://d3auz81dzbm02y.cloudfront.net/out/v1/ep-42cff54a-fd13-4fb4-a821-e445a7c613ad/index.m3u8',
  },
  {
    id: 'event-2',
    name: 'Free Webinar: Introduction to React',
    description: 'Learn the basics of React in this free webinar',
    startTime: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    endTime: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
    accessMode: 'open',
    status: 'live',
    channelId: 'channel-2',
    viewerCount: 45,
    streamUrl: 'https://d3auz81dzbm02y.cloudfront.net/out/v1/ep-42cff54a-fd13-4fb4-a821-e445a7c613ad/index.m3u8',
  },
  {
    id: 'event-3',
    name: 'Private Training Session',
    description: 'Exclusive training for members only',
    startTime: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    endTime: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    accessMode: 'password',
    password: 'training123',
    status: 'ended',
    channelId: 'channel-3',
    viewerCount: 12,
    streamUrl: 'https://d3duh532qzenq4.cloudfront.net/vod/testing-poc/file_example_MP4_640_3MG.mp4',
  },
];

let mockUsers: any[] = [];
let mockAnalytics: any[] = [];
let mockVods: any[] = [
  {
    id: 'vod-1',
    eventId: 'event-3',
    eventName: 'Private Training Session',
    vodUrl: 'https://d3duh532qzenq4.cloudfront.net/vod/testing-poc/file_example_MP4_640_3MG.mp4',
    thumbnailUrl: '',
    duration: 888,
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    embedCode: '<iframe src="https://player.golive.com/event/event-3"></iframe>',
  },
];

// Mock admin user
const mockAdminUser = {
  id: 'admin-1',
  email: 'admin@golive.com',
  password: 'Jaighai5244',
  name: 'Admin User',
  role: 'admin',
};

export const mockApi = {
  // Event API
  eventApi: {
    getEvent: async (eventId: string) => {
      await delay(500);
      const event = mockEvents.find(e => e.id === eventId);
      if (!event) {
        throw new Error('Event not found');
      }
      return { ...event };
    },

    createEvent: async (eventData: any) => {
      await delay(800);
      const newEvent = {
        id: `event-${Date.now()}`,
        ...eventData,
        status: 'scheduled',
        channelId: `channel-${Date.now()}`,
        viewerCount: 0,
        streamUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
        createdAt: new Date().toISOString(),
      };
      mockEvents.push(newEvent);
      return newEvent;
    },

    updateEvent: async (eventId: string, eventData: any) => {
      await delay(600);
      const index = mockEvents.findIndex(e => e.id === eventId);
      if (index === -1) {
        throw new Error('Event not found');
      }
      mockEvents[index] = { ...mockEvents[index], ...eventData };
      return mockEvents[index];
    },

    deleteEvent: async (eventId: string) => {
      await delay(400);
      const index = mockEvents.findIndex(e => e.id === eventId);
      if (index === -1) {
        throw new Error('Event not found');
      }
      mockEvents.splice(index, 1);
      return { success: true };
    },

    listEvents: async () => {
      await delay(500);
      return [...mockEvents];
    },
  },

  // User/Access API
  userApi: {
    login: async (credentials: any) => {
      await delay(600);
      
      // Check if it's an event access request
      if (credentials.eventId) {
        const event = mockEvents.find(e => e.id === credentials.eventId);
        if (!event) {
          throw new Error('Event not found');
        }

        // Email access
        if (credentials.email && event.accessMode === 'email') {
          const user = {
            id: `user-${Date.now()}`,
            email: credentials.email,
            eventId: event.id,
          };
          mockUsers.push(user);
          return {
            accessGranted: true,
            streamUrl: event.streamUrl,
            token: `mock-token-${Date.now()}`,
          };
        }

        // Password access
        if (credentials.password && event.accessMode === 'password') {
          if (credentials.password === event.password) {
            return {
              accessGranted: true,
              streamUrl: event.streamUrl,
              token: `mock-token-${Date.now()}`,
            };
          } else {
            throw new Error('Invalid password');
          }
        }

        // Open access
        if (event.accessMode === 'open') {
          return {
            accessGranted: true,
            streamUrl: event.streamUrl,
            token: `mock-token-${Date.now()}`,
          };
        }
      }

      throw new Error('Invalid credentials');
    },

    register: async (registrationData: any) => {
      await delay(800);
      const user = {
        id: `user-${Date.now()}`,
        ...registrationData,
        registeredAt: new Date().toISOString(),
      };
      mockUsers.push(user);
      return {
        success: true,
        user,
        accessGranted: true,
      };
    },

    getAccessStatus: async (eventId: string) => {
      await delay(300);
      const event = mockEvents.find(e => e.id === eventId);
      return {
        hasAccess: event?.accessMode === 'open',
        eventId: eventId,
      };
    },
  },

  // Analytics API
  analyticsApi: {
    trackEvent: async (analyticsData: any) => {
      await delay(100);
      mockAnalytics.push({
        ...analyticsData,
        id: `analytics-${Date.now()}`,
        timestamp: Date.now(),
      });
      return { success: true };
    },

    getEventAnalytics: async (eventId: string) => {
      await delay(500);
      const eventAnalytics = mockAnalytics.filter(a => a.eventId === eventId);
      
      return {
        eventId,
        totalViewers: eventAnalytics.length,
        totalWatchTime: eventAnalytics.reduce((sum, a) => sum + (a.duration || 0), 0),
        averageWatchTime: eventAnalytics.length > 0 
          ? eventAnalytics.reduce((sum, a) => sum + (a.duration || 0), 0) / eventAnalytics.length 
          : 0,
        actions: eventAnalytics,
      };
    },

    getDashboardAnalytics: async (filters?: any) => {
      await delay(600);
      
      // Filter analytics if eventIds provided
      let filteredAnalytics = [...mockAnalytics];
      if (filters?.eventIds && filters.eventIds.length > 0) {
        filteredAnalytics = filteredAnalytics.filter(a => 
          filters.eventIds.includes(a.eventId)
        );
      }

      // Calculate device breakdown
      const deviceBreakdown = [
        { name: 'Desktop', value: filteredAnalytics.filter(a => a.deviceType === 'desktop').length },
        { name: 'Mobile', value: filteredAnalytics.filter(a => a.deviceType === 'mobile').length },
        { name: 'Tablet', value: filteredAnalytics.filter(a => a.deviceType === 'tablet').length },
      ];

      // Calculate browser breakdown
      const browserBreakdown = [
        { name: 'Chrome', value: filteredAnalytics.filter(a => a.browser === 'Chrome').length },
        { name: 'Firefox', value: filteredAnalytics.filter(a => a.browser === 'Firefox').length },
        { name: 'Safari', value: filteredAnalytics.filter(a => a.browser === 'Safari').length },
        { name: 'Edge', value: filteredAnalytics.filter(a => a.browser === 'Edge').length },
      ];

      // Generate viewership over time (last 24 hours)
      const viewershipOverTime = Array.from({ length: 24 }, (_, i) => {
        const hour = new Date(Date.now() - (23 - i) * 60 * 60 * 1000);
        return {
          time: hour.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
          viewers: Math.floor(Math.random() * 50) + 10,
        };
      });

      const paidCount = mockUsers.filter(u => u.paymentToken).length;
      const freeCount = mockUsers.length - paidCount;

      return {
        totalViewers: filteredAnalytics.length,
        totalWatchTime: filteredAnalytics.reduce((sum, a) => sum + (a.duration || 0), 0),
        averageWatchTime: filteredAnalytics.length > 0 
          ? filteredAnalytics.reduce((sum, a) => sum + (a.duration || 0), 0) / filteredAnalytics.length 
          : 0,
        paidRegistrations: paidCount,
        freeRegistrations: freeCount,
        deviceBreakdown: deviceBreakdown.filter(d => d.value > 0),
        browserBreakdown: browserBreakdown.filter(b => b.value > 0),
        viewershipOverTime,
      };
    },
  },

  // Admin API
  adminApi: {
    login: async (email: string, password: string) => {
      await delay(600);
      if (email === mockAdminUser.email && password === mockAdminUser.password) {
        return {
          token: `mock-admin-token-${Date.now()}`,
          userId: mockAdminUser.id,
          email: mockAdminUser.email,
          name: mockAdminUser.name,
          role: 'admin',
          expiresIn: 3600,
        };
      }
      throw new Error('Invalid email or password');
    },

    getVodLibrary: async () => {
      await delay(500);
      return [...mockVods];
    },

    getUsers: async (eventId?: string) => {
      await delay(400);
      if (eventId) {
        return mockUsers.filter(u => u.eventId === eventId);
      }
      return [...mockUsers];
    },

    controlChannel: async (channelId: string, action: 'start' | 'stop') => {
      await delay(800);
      const event = mockEvents.find(e => e.channelId === channelId);
      if (event) {
        event.status = action === 'start' ? 'live' : 'ended';
        if (action === 'start') {
          event.viewerCount = Math.floor(Math.random() * 100) + 10;
        }
      }
      return { success: true, status: event?.status };
    },
  },

  // Payment API
  paymentApi: {
    createPaymentIntent: async (_eventId: string, amount: number) => {
      await delay(600);
      return {
        clientSecret: `mock_payment_intent_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        paymentIntentId: `pi_${Date.now()}`,
        amount,
      };
    },

    confirmPayment: async (clientSecret: string, paymentMethodId: string) => {
      await delay(1000);
      // Simulate payment success (always succeeds in mock)
      return {
        success: true,
        paymentIntentId: clientSecret.split('_')[2],
        paymentMethodId,
      };
    },
  },
};

// Helper to check if we should use mock API
export const useMockApi = () => {
  // Check if API_BASE_URL is set, if not, use mock
  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  return !apiUrl || apiUrl === 'mock' || apiUrl.includes('localhost');
};

// const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

// export const adminApi = {
//   // --------------------------------------------------
//   // LOGIN
//   // --------------------------------------------------
//   login: async (username: string, password: string) => {
//     const response = await fetch(`${API_BASE_URL}/api/admin/login`, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ username, password }),
//     });

//     return response.json();
//   },
// };

// export const eventApi = {
//   // --------------------------------------------------
//   // CREATE EVENT
//   // --------------------------------------------------
//   createEvent: async (payload: any) => {
//     const response = await fetch(`${API_BASE_URL}/api/admin/event/create`, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(payload),
//     });

//     return response.json();
//   },

//   // --------------------------------------------------
//   // LIST EVENTS
//   // --------------------------------------------------
//   listEvents: async () => {
//     const response = await fetch(`${API_BASE_URL}/api/admin/event/list`);
//     return response.json();
//   },

//   // --------------------------------------------------
//   // UPDATE EVENT
//   // --------------------------------------------------
//   updateEvent: async (eventId: string, payload: any) => {
//     const response = await fetch(`${API_BASE_URL}/api/admin/event/update/${eventId}`, {
//       method: "PUT",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(payload),
//     });

//     return response.json();
//   },

//   // --------------------------------------------------
//   // DELETE EVENT
//   // --------------------------------------------------
//   deleteEvent: async (eventId: string) => {
//     const response = await fetch(`${API_BASE_URL}/api/admin/event/delete/${eventId}`, {
//       method: "DELETE",
//     });

//     return response.json();
//   },
// };
