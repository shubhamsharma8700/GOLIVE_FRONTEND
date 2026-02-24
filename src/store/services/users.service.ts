import { adminBaseApi } from "./adminBaseApi";

export interface AdminItem {
  adminID: string;
  name: string;
  email: string;
  status: string;
  createdAt?: string;
  updatedAt?: string;
  lastLoginAt?: string;
}

export interface AdminListPagination {
  totalItems?: number;
  limit?: number;
  nextKey?: string | null;
  hasMore?: boolean;
}

export interface AdminListResponse {
  items: AdminItem[];
  pagination?: AdminListPagination;
}

export interface ListAdminsQueryParams {
  limit?: number;
  lastKey?: string;
  q?: string;
}

export const adminApi = adminBaseApi.injectEndpoints({
    endpoints: (builder) => ({
        listAdmins: builder.query<AdminListResponse, ListAdminsQueryParams | void>({
            query: ({ limit, lastKey, q }: ListAdminsQueryParams = {}) => {
                const params = new URLSearchParams();
                if (limit) params.append("limit", String(limit));
                if (lastKey) params.append("lastKey", lastKey);
                if (q) params.append("q", q);

                return `/admin?${params.toString()}`;
            },
            providesTags: ["Admin"],
        }),
        createAdmin: builder.mutation({
            query: (body) => ({
                url: "/admin/register",
                method: "POST",
                body,
            }),
            invalidatesTags: ["Admin"],
        }),
        getAdminById: builder.query({
            query: (adminID) => `/admin/${adminID}`,
            providesTags: ["Admin"],
        }),
        updateAdmin: builder.mutation({
            query: ({ adminID, ...body }) => ({
                url: `/admin/${adminID}`,
                method: "PUT",
                body,
            }),
            invalidatesTags: ["Admin"],
        }),
        deleteAdmin: builder.mutation({
            query: (adminID) => ({
                url: `/admin/${adminID}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Admin"],
        }),
    }),
});

export const {
    useCreateAdminMutation,
  useListAdminsQuery,
  useGetAdminByIdQuery,
  useUpdateAdminMutation,
  useDeleteAdminMutation,
} = adminApi;
