import { adminBaseApi } from "./adminBaseApi";

export const authApi = adminBaseApi.injectEndpoints({
  endpoints: (builder) => ({

    // REGISTER ADMIN
    registerAdmin: builder.mutation({
      query: (data) => ({
        url: "/admin/register",
        method: "POST",
        body: data,
      }),
    }),

    // LOGIN
    login: builder.mutation({
      query: (data) => ({
        url: "/admin/login",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Admin"],
    }),

    // REQUEST OTP
    requestOtp: builder.mutation({
      query: (data) => ({
        url: "/admin/forgot-password/request-otp",
        method: "POST",
        body: data,
      }),
    }),

    // VERIFY OTP + RESET PASSWORD
    verifyOtpAndReset: builder.mutation({
      query: (data) => ({
        url: "/admin/forgot-password/verify-reset",
        method: "POST",
        body: data,
      }),
    }),

    // ⭐ GET LOGGED-IN ADMIN PROFILE
    getProfile: builder.query({
      query: () => "/admin/profile",
      providesTags: ["Admin"],
    }),

    // Logout admin
    logout: builder.mutation({
      query: () => ({
        url: "/admin/logout",
        method: "POST",
      }),
      invalidatesTags: ["Admin"],
    }),

  }),
});

export const {
  useRegisterAdminMutation,
  useLoginMutation,
  useRequestOtpMutation,
  useVerifyOtpAndResetMutation,
  useGetProfileQuery,
  useLogoutMutation,
} = authApi;
