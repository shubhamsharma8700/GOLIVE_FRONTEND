// src/store/services/playerApi.ts
import { baseApi } from "./baseApi";

export const playerApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    // 1️⃣ Get event access configuration
    getAccessConfig: builder.query<
      {
        success: boolean;
        accessMode: string;
        requiresForm: boolean;
        requiresPassword: boolean;
        registrationFields: any[];

        // ✅ ADD
        payment?: {
          amount: number;
          currency: string;
        } | null;
      },
      string
    >({
      query: (eventId) => `/playback/event/${eventId}/access`,
    }),


    // 2️⃣ Register viewer (free / email / paid)
    registerViewer: builder.mutation<
      {
        success: boolean;
        viewerToken: string;
        accessVerified: boolean;
      },
      {
        eventId: string;
        clientViewerId: string;
        formData?: any;
        name?: string;
        email?: string;
        deviceInfo?: any;
      }
    >({
      query: ({ eventId, ...body }) => ({
        url: `/playback/event/${eventId}/register`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Player"],
    }),

    // 3️⃣ Verify password (password access only)
    verifyPassword: builder.mutation<
      {
        success: boolean;
        accessVerified: boolean;
      },
      {
        eventId: string;
        clientViewerId: string;
        password: string;
      }
    >({
      query: ({ eventId, ...body }) => ({
        url: `/playback/event/${eventId}/verify-password`,
        method: "POST",
        body,
      }),
    }),

    // 4️⃣ Get stream URL (protected)
    getStream: builder.query<
      {
        success: boolean;
        streamUrl: string;
        playbackType: "live" | "vod";
        eventType: string;
      },
      {
        eventId: string;
        viewerToken: string;
      }
    >({
      query: ({ eventId, viewerToken }) => ({
        url: `/playback/event/${eventId}/stream`,
        headers: {
          Authorization: `Bearer ${viewerToken}`,
        },
      }),
      providesTags: ["Player"],
    }),
  }),
});

export const {
  useGetAccessConfigQuery,
  useRegisterViewerMutation,
  useVerifyPasswordMutation,
  useGetStreamQuery,
} = playerApi;
