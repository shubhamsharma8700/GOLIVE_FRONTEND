import { baseApi } from "./baseApi";

export const paymentsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    // =========================================================
    // 1️⃣ Create Stripe Checkout Session (Viewer)
    // =========================================================
    createPaymentSession: builder.mutation<
      {
        success: boolean;
        sessionId: string;
        url: string;
      },
      {
        eventId: string;
        viewerToken: string;
      }
    >({
      query: ({ eventId, viewerToken }) => ({
        url: `/payments/${eventId}/create-session`,
        method: "POST",
        headers: {
          Authorization: `Bearer ${viewerToken}`,
        },
      }),
    }),

    // =========================================================
    // 2️⃣ Check Viewer Payment Status
    // =========================================================
    checkPaymentStatus: builder.query<
      {
        success: boolean;
        payment: {
          paymentId: string;
          status: string;
          amount: number;
          currency: string;
          receiptUrl?: string | null;
          createdAt: string;
        } | null;
      },
      {
        eventId: string;
        viewerToken: string;
      }
    >({
      query: ({ eventId, viewerToken }) => ({
        url: `/payments/${eventId}/verify`,
        headers: {
          Authorization: `Bearer ${viewerToken}`,
        },
      }),
      providesTags: ["Payments"],
    }),

    // =========================================================
    // 3️⃣ Admin — List Payments for Event
    // =========================================================
    listPaymentsForEvent: builder.query<
      {
        success: boolean;
        payments: any[];
      },
      {
        eventId: string;
      }
    >({
      query: ({ eventId }) => ({
        url: `/payments/${eventId}/list`,
      }),
      providesTags: ["Payments"],
    }),

    // =========================================================
    // 4️⃣ Admin — Get Single Payment
    // =========================================================
    getPaymentDetail: builder.query<
      {
        success: boolean;
        payment: any;
      },
      {
        paymentId: string;
      }
    >({
      query: ({ paymentId }) => ({
        url: `/payments/detail/${paymentId}`,
      }),
    }),
  }),
});

export const {
  useCreatePaymentSessionMutation,
  useCheckPaymentStatusQuery,
  useListPaymentsForEventQuery,
  useGetPaymentDetailQuery,
} = paymentsApi;
