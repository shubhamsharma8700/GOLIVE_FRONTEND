import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Badge } from "../components/ui/badge";
import {
  Search,
//   Filter,
  Edit2,
  Plus,
  Calendar as CalendarIcon,
  UserX,
  Trash2,
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";

import { toast } from "sonner";

// ⭐ API Hooks
import {
  useListAdminsQuery,
  useDeleteAdminMutation,
  useUpdateAdminMutation,
} from "../store/services/users.service";

import AddAdminModal from "../components/AddAdminModal";

export function UserManagement() {
  const [searchQuery, setSearchQuery] = useState("");
  const [openAddModal, setOpenAddModal] = useState(false);

  const { data, isLoading, isError, refetch } = useListAdminsQuery({
    q: searchQuery || undefined,
    limit: 50,
  });

  const [deleteAdmin] = useDeleteAdminMutation();
  const [updateAdmin] = useUpdateAdminMutation();

  const admins = data?.items || [];

  const getStatusBadgeColor = (status: string) =>
    status === "active"
      ? "bg-green-100 text-green-800"
      : "bg-gray-100 text-gray-800";

  // FORMAT INITIALS
  const getInitials = (name: string) =>
    name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase() || "AD";

  // ⭐ Delete Admin
  const handleDelete = async (adminID: string, name: string) => {
    try {
      await deleteAdmin(adminID).unwrap();
      toast.success(`${name} deleted successfully`);
      refetch();
    } catch {
      toast.error("Failed to delete admin");
    }
  };

  // ⭐ Activate / Deactivate Admin
  const handleStatusToggle = async (
    adminID: string,
    name: string,
    status: string
  ) => {
    try {
      await updateAdmin({
        adminID,
        status: status === "active" ? "inactive" : "active",
      }).unwrap();

      toast.success(
        `${name} has been ${status === "active" ? "deactivated" : "activated"}`
      );

      refetch();
    } catch {
      toast.error("Failed to update admin status");
    }
  };

  if (isLoading) return <div className="p-6 text-center">Loading admins...</div>;

  if (isError)
    return (
      <div className="p-6 text-center text-red-600">
        Failed to load admins.{" "}
        <Button onClick={() => refetch()} className="ml-2">
          Retry
        </Button>
      </div>
    );

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <div className="relative max-w-2xl">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
        <Input
          placeholder="Search admins by name or email"
          className="pl-10 bg-white"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl mb-1">Admin Management</h1>
          <p className="text-[#6B6B6B]">Manage admin users and permissions</p>
        </div>

        <div className="flex items-center gap-3">
          {/* <Button variant="outline" className="border-[#B89B5E] text-[#B89B5E]">
            <Filter className="w-4 h-4 mr-2" />
            Filters
          </Button> */}

          {/* ⭐ OPEN ADD ADMIN MODAL */}
          <Button
            onClick={() => setOpenAddModal(true)}
            className="bg-[#B89B5E] text-white hover:bg-[#A28452]"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add New Admin
          </Button>
        </div>
      </div>

      {/* TABLE */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="border-b border-gray-100">
          <CardTitle>All Admins ({admins.length})</CardTitle>
        </CardHeader>

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="p-4 text-left text-sm text-[#B89B5E]">Admin</th>
                  <th className="p-4 text-left text-sm text-[#B89B5E]">Status</th>
                  <th className="p-4 text-left text-sm text-[#B89B5E]">
                    Created At
                  </th>
                    <th className="p-4 text-left text-sm text-[#B89B5E]">Last Active</th>
                  <th className="p-4 text-left text-sm text-[#B89B5E]">Actions</th>
                </tr>
              </thead>

              <tbody>
                {admins.map((admin: any) => (
                  <tr
                    key={admin.adminID}
                    className="border-t border-gray-100 hover:bg-gray-50 transition"
                  >
                    {/* ADMIN COLUMN */}
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#B89B5E] to-[#8B7547] flex items-center justify-center text-white text-sm">
                          {getInitials(admin.name)}
                        </div>

                        <div>
                          <p className="text-sm">{admin.name}</p>
                          <p className="text-xs text-[#6B6B6B]">{admin.email}</p>
                        </div>
                      </div>
                    </td>

                    {/* STATUS */}
                    <td className="p-4">
                      <Badge className={getStatusBadgeColor(admin.status)}>
                        {admin.status}
                      </Badge>
                    </td>
                     {/* Events */}

                    <td className="p-4">

                      <div className="flex items-center gap-2">

                        <CalendarIcon className="w-4 h-4 text-[#B89B5E]" />

                        <span className="text-sm">{new Date(admin.createdAt).toLocaleString() || 0}</span>

                      </div>

                    </td>

                    {/* CREATED AT */}
                    <td className="p-4 text-sm text-[#6B6B6B]">
                      {new Date(admin.lastLoginAt).toLocaleString()}
                    </td>

                    {/* ACTIONS */}
                    <td className="p-4">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            size="sm"
                            className="bg-[#B89B5E] text-white hover:bg-[#A28452]"
                          >
                            <Edit2 className="w-4 h-4 mr-2" /> Edit
                          </Button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent align="end" className="w-52">
                          <DropdownMenuItem
                            onClick={() =>
                              handleStatusToggle(
                                admin.adminID,
                                admin.name,
                                admin.status
                              )
                            }
                          >
                            <UserX className="w-4 h-4 mr-2" />
                            {admin.status === "active"
                              ? "Deactivate"
                              : "Activate"}
                          </DropdownMenuItem>

                          <DropdownMenuItem
                            className="text-red-500 focus:bg-red-50"
                            onClick={() =>
                              handleDelete(admin.adminID, admin.name)
                            }
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete User
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* EMPTY STATE */}
      {admins.length === 0 && (
        <Card className="border-0 shadow-sm">
          <CardContent className="p-12 text-center">
            <Search className="w-10 h-10 text-gray-400 mx-auto mb-3" />
            <h3>No admins found</h3>
            <p className="text-sm text-[#6B6B6B]">
              Try changing your search keyword.
            </p>
          </CardContent>
        </Card>
      )}

      {/* ⭐ ADD ADMIN MODAL */}
      <AddAdminModal open={openAddModal} setOpen={setOpenAddModal} refetch={refetch} />
    </div>
  );
}
