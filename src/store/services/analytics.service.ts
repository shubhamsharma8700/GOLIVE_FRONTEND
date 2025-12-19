// src/store/services/analytics.service.ts
import { baseApi } from "./baseApi";

/**
 * Analytics API
 * Viewer session lifecycle + admin analytics
 */
export const analyticsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    /* ============================================================
       VIEWER — START SESSION
       POST /api/analytics/:eventId/session/start
       ============================================================ */
    startSession: builder.mutation<
      { success: boolean; sessionId: string },
      {
        eventId: string;
        viewerToken: string;
        playbackType?: "live" | "vod";
        deviceInfo?: Record<string, any>;
        location?: Record<string, any>;
      }
    >({
      query: ({ eventId, viewerToken, ...body }) => ({
        url: `/analytics/${eventId}/session/start`,
        method: "POST",
        body,
        headers: {
          Authorization: `Bearer ${viewerToken}`,
        },
      }),
    }),

    /* ============================================================
       VIEWER — HEARTBEAT
       POST /api/analytics/session/heartbeat
       ============================================================ */
    heartbeat: builder.mutation<
      { success: boolean },
      {
        sessionId: string;
        seconds: number;
        viewerToken: string;
      }
    >({
      query: ({ viewerToken, ...body }) => ({
        url: `/analytics/session/heartbeat`,
        method: "POST",
        body,
        headers: {
          Authorization: `Bearer ${viewerToken}`,
        },
      }),
    }),

    /* ============================================================
       VIEWER — END SESSION
       POST /api/analytics/session/end
       ============================================================ */
    endSession: builder.mutation<
      { success: boolean },
      {
        sessionId: string;
        duration: number;
        viewerToken: string;
      }
    >({
      query: ({ viewerToken, ...body }) => ({
        url: `/analytics/session/end`,
        method: "POST",
        body,
        headers: {
          Authorization: `Bearer ${viewerToken}`,
        },
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
