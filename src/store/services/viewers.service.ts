import { adminBaseApi } from "./adminBaseApi";

export interface ViewersQueryParams {
  limit?: number;
  lastKey?: string | null;
  q?: string;
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
    getViewerById: builder.query<
      any,
      string
    >({
      query: (clientViewerId) =>
        `/viewers/${clientViewerId}`,
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
