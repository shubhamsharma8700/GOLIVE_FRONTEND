import { baseApi } from "./baseApi";

export const eventsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    // ------------------------------------------------------
    // LIST EVENTS (with search, type, limit)
    // ------------------------------------------------------
    listEvents: builder.query({
      query: ({
        limit,
        lastKey,
        q,
        type,
      }: {
        limit?: number;
        lastKey?: string;
        q?: string;
        type?: "live" | "vod";
      } = {}) => {
        const params = new URLSearchParams();

        if (limit) params.append("limit", String(limit));
        if (lastKey) params.append("lastKey", lastKey);
        if (q) params.append("q", q);
        if (type) params.append("type", type);

        const qs = params.toString();
        return `/events${qs ? `?${qs}` : ""}`;
      },
      providesTags: ["Events"],
    }),

    // ------------------------------------------------------
    // GET EVENT BY ID
    // ------------------------------------------------------
    getEventById: builder.query({
      query: (eventId: string) => `/events/${eventId}`,
      providesTags: ["Events"],
    }),

    // ------------------------------------------------------
    // GET PRESIGN URL FOR VOD UPLOAD
    // ------------------------------------------------------
    getPresignedVodUrl: builder.mutation({
      query: ({
        filename,
        contentType,
      }: {
        filename: string;
        contentType?: string;
      }) => ({
        url: `/events/vod/presign?filename=${encodeURIComponent(
          filename
        )}&contentType=${contentType || "video/mp4"}`,
        method: "GET",
      }),
    }),

    // ------------------------------------------------------
    // CREATE EVENT
    // ------------------------------------------------------
    createEvent: builder.mutation({
      query: (body: any) => ({
        url: `/events`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Events"],
    }),

    // ------------------------------------------------------
    // UPDATE EVENT
    // ------------------------------------------------------
    updateEvent: builder.mutation({
      query: ({ eventId, ...body }: { eventId: string;[key: string]: any }) => ({
        url: `/events/${eventId}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Events"],
    }),

    // ------------------------------------------------------
    // DELETE EVENT
    // ------------------------------------------------------
    deleteEvent: builder.mutation({
      query: (eventId: string) => ({
        url: `/events/${eventId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Events"],
    }),

  }),
});

export const {
  useListEventsQuery,
  useGetEventByIdQuery,
  useGetPresignedVodUrlMutation,
  useCreateEventMutation,
  useUpdateEventMutation,
  useDeleteEventMutation,
} = eventsApi;
