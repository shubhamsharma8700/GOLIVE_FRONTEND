import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { toast } from "sonner";

import { useCreateAdminMutation } from "../store/services/users.service";

export default function AddAdminModal({ open, setOpen, refetch }: any) {
  const [createAdmin, { isLoading }] = useCreateAdminMutation();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleSubmit = async () => {
    if (!form.name || !form.email || !form.password) {
      toast.error("All fields are required");
      return;
    }

    try {
      await createAdmin(form).unwrap();
      toast.success("Admin created successfully!");

      setForm({ name: "", email: "", password: "" });
      setOpen(false);

      // ⭐ REFRESH ADMIN LIST
      refetch?.();
    } catch (error: any) {
      console.error("Error creating admin:", error);
      toast.error(error?.data?.error || "Error creating admin");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="space-y-4">
        <DialogHeader>
          <DialogTitle className="text-lg">Add New Admin</DialogTitle>
        </DialogHeader>

        <div className="space-y-2">

          {/* Name */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Name</Label>
            <Input
              placeholder="Admin Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="h-10"
            />
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Email Address</Label>
            <Input
              type="email"
              placeholder="Email Address"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="h-10"
            />
          </div>

          {/* Password */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Temporary Password</Label>
            <Input
              type="password"
              placeholder="Temporary password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="h-10"
            />
          </div>

          {/* Submit Button */}
          <Button
            onClick={handleSubmit}
            disabled={isLoading}
            className="w-full h-10 bg-[#B89B5E] text-white hover:bg-[#A28452] transition"
          >
            {isLoading ? "Creating..." : "Create Admin"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
