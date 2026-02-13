import { adminBaseApi } from "./adminBaseApi";

export interface ViewersQueryParams {
  limit?: number;
  lastKey?: string | null | Record<string, unknown>;
  q?: string;
}

/** Viewer item as returned by list and getById APIs */
export interface ApiViewer {
  eventId: string;
  clientViewerId: string;
  name?: string | null;
  email?: string | null;
  formData?: {
    firstName?: string;
    lastName?: string;
    email?: string;
    [key: string]: unknown;
  } | null;
  device?: {
    deviceType?: string | null;
    screen?: { width?: number; height?: number; pixelRatio?: number } | null;
    userAgent?: string | null;
    os?: string | null;
    timezone?: string | null;
    browser?: string | null;
  } | null;
  network?: {
    geo?: {
      country?: string | null;
      region?: string | null;
      city?: string | null;
      latitude?: string | null;
      longitude?: string | null;
    } | null;
    ip?: string | null;
  } | null;
  totalSessions?: number;
  totalWatchTime?: number;
  lastActiveAt?: string | null;
  lastJoinAt?: string | null;
  firstJoinAt?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
  isPaidViewer?: boolean;
  paymentStatus?: string;
  accessVerified?: boolean;
  event?: {
    eventId?: string;
    title?: string;
    eventType?: string;
    accessMode?: string;
    status?: string;
    startTime?: string | null;
    endTime?: string | null;
  } | null;
}

export const viewersApi = adminBaseApi.injectEndpoints({
  endpoints: (builder) => ({

    /* =====================================================
       1. LIST ALL VIEWERS (ADMIN)
       GET /api/viewers
    ===================================================== */
    getViewers: builder.query<
      {
        items: any[];
        pagination: {
          limit: number;
          nextKey: string | null;
          hasMore: boolean;
        };
      },
      ViewersQueryParams | void
    >({
      query: (params) => ({
        url: "/viewers",
        ...(params && { params }),
      }),
      providesTags: ["Viewers"],
    }),

    /* =====================================================
       2. LIST VIEWERS BY EVENT
       GET /api/viewers/event/:eventId
    ===================================================== */
    getViewersByEvent: builder.query<
      {
        items: any[];
        pagination: {
          limit: number;
          nextKey: string | null;
          hasMore: boolean;
        };
      },
      {
        eventId: string;
        limit?: number;
        lastKey?: string | null;
      }
    >({
      query: ({ eventId, ...params }) => ({
        url: `/viewers/event/${eventId}`,
        params,
      }),
      providesTags: ["Viewers"],
    }),

    /* =====================================================
       3. GET VIEWER BY ID
       GET /api/viewers/:clientViewerId
    ===================================================== */
    /** GET /api/viewers/:viewerID — returns array of viewer records (sessions) for that viewer */
    getViewerById: builder.query<ApiViewer[], string>({
      query: (viewerId) => `/viewers/${encodeURIComponent(viewerId)}`,
      providesTags: (_result, _err, viewerId) => [{ type: "Viewers", id: viewerId }],
    }),

    /* =====================================================
       4. DELETE VIEWER
       DELETE /api/viewers/:eventId/:clientViewerId
    ===================================================== */
    deleteViewer: builder.mutation<
      { message: string },
      { eventId: string; clientViewerId: string }
    >({
      query: ({ eventId, clientViewerId }) => ({
        url: `/viewers/${eventId}/${clientViewerId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Viewers"],
    }),
  }),
});

/* -------------------------------------------------------
   EXPORT HOOKS
------------------------------------------------------- */
export const {
  useGetViewersQuery,
  useGetViewersByEventQuery,
  useGetViewerByIdQuery,
  useDeleteViewerMutation,
} = viewersApi;
