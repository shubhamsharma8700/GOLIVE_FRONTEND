import { Badge } from "./ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { MapPin, Monitor } from "lucide-react";
import { Viewer } from "../pages/ViewersManagement";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  viewer: Viewer | null;
}

export function ViewerDetailsModal({
  open,
  onOpenChange,
  viewer,
}: Props) {
  if (!viewer) return null;

  const getInitials = (name: string) =>
    name === "Anonymous User"
      ? "A"
      : name
          .split(" ")
          .map(w => w[0])
          .join("")
          .slice(0, 2)
          .toUpperCase();

  const getAvatarColor = (type: string) =>
    type === "Paid User"
      ? "bg-gradient-to-br from-[#B89B5E] to-[#8B7547]"
      : "bg-gradient-to-br from-gray-500 to-gray-600";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl">
            Viewer Details
          </DialogTitle>
          <DialogDescription>
            Complete information about this viewer&apos;s activity and engagement
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">

          {/* PROFILE */}
          <div className="flex items-start gap-4">
            <div
              className={`w-16 h-16 rounded-full flex items-center justify-center text-xl ${getAvatarColor(
                viewer.type
              )}`}
            >
              <span className="text-white">
                {getInitials(viewer.name)}
              </span>
            </div>

            <div className="flex-1">
              <h3 className="text-lg mb-1">{viewer.name}</h3>
              <p className="text-sm text-gray-600 mb-2">
                {viewer.email}
              </p>

              <Badge
                variant="secondary"
                className={
                  viewer.type === "Paid User"
                    ? "bg-green-50 text-green-700 border-green-200"
                    : "bg-gray-100 text-gray-700 border-gray-200"
                }
              >
                {viewer.type}
              </Badge>
            </div>

            {/* STATUS */}
            <div className="flex items-center gap-2">
              <div
                className={`w-3 h-3 rounded-full ${
                  viewer.status === "Active"
                    ? "bg-green-500"
                    : "bg-gray-400"
                }`}
              />
              <span
                className={`text-sm ${
                  viewer.status === "Active"
                    ? "text-green-700"
                    : "text-gray-500"
                }`}
              >
                {viewer.status}
              </span>
            </div>
          </div>

          {/* STATS */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <p className="text-sm text-gray-600 mb-1">
                Total Watching Hours
              </p>
              <p className="text-2xl text-[#B89B5E]">
                {viewer.watchingHours.toFixed(1)} hrs
              </p>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <p className="text-sm text-gray-600 mb-1">
                Last Active
              </p>
              <p className="text-lg">{viewer.lastActive}</p>
            </div>
          </div>

          {/* ADDITIONAL INFO */}
          <div className="space-y-3">
            <h4 className="text-sm text-gray-700">
              Additional Information
            </h4>

            {viewer.device && (
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Monitor className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="text-xs text-gray-500">Device</p>
                  <p className="text-sm">{viewer.device}</p>
                </div>
              </div>
            )}

            {viewer.location && (
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <MapPin className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="text-xs text-gray-500">Location</p>
                  <p className="text-sm">{viewer.location}</p>
                </div>
              </div>
            )}
          </div>

        </div>
      </DialogContent>
    </Dialog>
  );
}
