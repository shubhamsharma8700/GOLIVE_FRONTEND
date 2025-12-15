import { baseApi } from "./baseApi";

/**
 * Analytics API
 * Handles viewer session lifecycle + admin analytics
 */
export const analyticsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    /* ============================================================
       VIEWER — START SESSION
       POST /api/analytics/:eventId/start
       ============================================================ */
    startSession: builder.mutation<
      { success: boolean; sessionId: string },
      {
        eventId: string;
        playbackType?: "live" | "vod";
        deviceInfo?: Record<string, any>;
        location?: Record<string, any>;
      }
    >({
      query: ({ eventId, ...body }) => ({
        url: `/analytics/${eventId}/start`,
        method: "POST",
        body,
      }),
    }),

    /* ============================================================
       VIEWER — HEARTBEAT
       POST /api/analytics/heartbeat
       ============================================================ */
    heartbeat: builder.mutation<
      { success: boolean },
      {
        sessionId: string;
        seconds: number;
      }
    >({
      query: (body) => ({
        url: `/analytics/heartbeat`,
        method: "POST",
        body,
      }),
    }),

    /* ============================================================
       VIEWER — END SESSION
       POST /api/analytics/end
       ============================================================ */
    endSession: builder.mutation<
      { success: boolean },
      {
        sessionId: string;
        duration: number;
      }
    >({
      query: (body) => ({
        url: `/analytics/end`,
        method: "POST",
        body,
      }),
    }),

    /* ============================================================
       ADMIN — EVENT SUMMARY
       GET /api/analytics/:eventId/summary
       ============================================================ */
    getEventSummary: builder.query<
      {
        success: boolean;
        eventId: string;
        summary: {
          totalSessions: number;
          totalWatchTime: number;
          avgWatchTime: number;
        };
      },
      string
    >({
      query: (eventId) => `/analytics/${eventId}/summary`,
      providesTags: (_r, _e, eventId) => [
        { type: "Analytics", id: eventId },
      ],
    }),

    /* ============================================================
       ADMIN — RECENT SESSIONS
       GET /api/analytics/:eventId/sessions
       ============================================================ */
    getRecentSessions: builder.query<
      {
        success: boolean;
        eventId: string;
        sessions: any[];
      },
      string
    >({
      query: (eventId) => `/analytics/${eventId}/sessions`,
      providesTags: (_r, _e, eventId) => [
        { type: "Analytics", id: eventId },
      ],
    }),
  }),
  overrideExisting: false,
});

export const {
  useStartSessionMutation,
  useHeartbeatMutation,
  useEndSessionMutation,
  useGetEventSummaryQuery,
  useGetRecentSessionsQuery,
} = analyticsApi;
