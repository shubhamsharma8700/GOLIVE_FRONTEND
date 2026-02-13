import { useMemo } from "react";
import { Badge } from "./ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { MapPin, Monitor, User, Mail, Calendar, Globe } from "lucide-react";
import { useGetViewerByIdQuery } from "../store/services/viewers.service";
import type { ApiViewer } from "../store/services/viewers.service";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  viewer: { clientViewerId: string } | null;
}

function getDisplayNameFromItem(item: ApiViewer): string {
  if (item.name && String(item.name).trim()) return item.name.trim();
  const first = item.formData?.firstName?.trim();
  const last = item.formData?.lastName?.trim();
  if (first || last) return [first, last].filter(Boolean).join(" ") || "Anonymous User";
  return "Anonymous User";
}

function getInitialsFromName(name: string): string {
  if (name === "Anonymous User" || name === "—") return "A";
  return name
    .split(" ")
    .filter(Boolean)
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function getDeviceSummary(item: ApiViewer | null | undefined): string | null {
  if (!item?.device) return null;
  const d = item.device;
  const parts: string[] = [];
  if (d.deviceType) parts.push(d.deviceType);
  if (d.os) parts.push(d.os);
  if (d.browser) parts.push(d.browser);
  if (parts.length) return parts.join(" · ");
  if (d.userAgent) return d.userAgent.length > 80 ? d.userAgent.slice(0, 80) + "…" : d.userAgent;
  return null;
}

function getLocationSummary(item: ApiViewer | null | undefined): string | null {
  if (!item?.network?.geo) return null;
  const g = item.network.geo;
  const parts = [g.city, g.region, g.country].filter(Boolean);
  return parts.length ? parts.join(", ") : null;
}

export function ViewerDetailsModal({
  open,
  onOpenChange,
  viewer,
}: Props) {
  const clientViewerId = viewer?.clientViewerId ?? "";
  const { data: items, isLoading, isError } = useGetViewerByIdQuery(clientViewerId, {
    skip: !open || !clientViewerId,
  });

  const aggregated = useMemo(() => {
    const list = Array.isArray(items) ? items : [];
    if (list.length === 0) return null;

    const first = list[0];
    let displayName = "Anonymous User";
    let email: string | null = null;
    for (const item of list) {
      const name = getDisplayNameFromItem(item);
      if (name !== "Anonymous User") {
        displayName = name;
        break;
      }
    }
    for (const item of list) {
      const e = item.email ?? item.formData?.email ?? null;
      if (e) {
        email = e;
        break;
      }
    }

    const totalWatchTimeSum = list.reduce((sum, item) => sum + (item.totalWatchTime ?? 0), 0);
    const totalSessionsSum = list.reduce((sum, item) => sum + (item.totalSessions ?? 0), 0);
    const lastActiveAtDates = list.map((item) => item.lastActiveAt).filter(Boolean) as string[];
    const lastActiveAt = lastActiveAtDates.length
      ? lastActiveAtDates.sort((a, b) => new Date(b).getTime() - new Date(a).getTime())[0]
      : null;
    const createdAtDates = list.map((item) => item.createdAt).filter(Boolean) as string[];
    const firstSeenAt = createdAtDates.length
      ? createdAtDates.sort((a, b) => new Date(a).getTime() - new Date(b).getTime())[0]
      : null;

    const deviceStr = getDeviceSummary(first);
    const locationStr = getLocationSummary(first);
    const networkIp = first?.network?.ip ?? null;
    const eventInfo = first?.event ?? list.find((i) => i.event)?.event ?? null;
    const isPaidViewer = list.some((i) => i.isPaidViewer);

    return {
      clientViewerId: first.clientViewerId,
      displayName,
      email: email ?? "—",
      isPaidViewer,
      totalWatchTimeSum,
      totalSessionsSum,
      lastActiveAt,
      firstSeenAt,
      deviceStr,
      locationStr,
      networkIp,
      eventInfo,
    };
  }, [items]);

  const getAvatarColor = (isPaid: boolean) =>
    isPaid ? "bg-gradient-to-br from-[#B89B5E] to-[#8B7547]" : "bg-gradient-to-br from-gray-500 to-gray-600";

  if (!viewer) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[95vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">Viewer Details</DialogTitle>
          <DialogDescription>
            Viewer information from the server
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {isLoading ? (
            <div className="space-y-4">
              <div className="h-20 bg-gray-100 rounded-lg animate-pulse" />
              <div className="grid grid-cols-2 gap-4">
                <div className="h-24 bg-gray-100 rounded-lg animate-pulse" />
                <div className="h-24 bg-gray-100 rounded-lg animate-pulse" />
              </div>
              <p className="text-sm text-gray-500 text-center py-4">Loading viewer details…</p>
            </div>
          ) : isError ? (
            <p className="text-sm text-red-600 text-center py-4">
              Failed to load viewer details. Please try again.
            </p>
          ) : !aggregated ? (
            <p className="text-sm text-gray-500 text-center py-4">No viewer data found.</p>
          ) : (
            <>
              {/* PROFILE */}
              <div className="flex items-start gap-4 flex-wrap">
                <div
                  className={`w-16 h-16 rounded-full flex items-center justify-center text-xl shrink-0 ${getAvatarColor(aggregated.isPaidViewer)}`}
                >
                  <span className="text-white font-medium">
                    {getInitialsFromName(aggregated.displayName)}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-lg font-semibold text-gray-900">{aggregated.displayName}</h3>
                    <Badge
                      variant="secondary"
                      className={
                        aggregated.isPaidViewer
                          ? "bg-green-50 text-green-700 border-green-200"
                          : "bg-gray-100 text-gray-700 border-gray-200"
                      }
                    >
                      {aggregated.isPaidViewer ? "Paid User" : "Anonymous"}
                    </Badge>
                    {aggregated.eventInfo?.accessMode && (
                      <Badge variant="outline" className="text-gray-600">
                        {aggregated.eventInfo.accessMode}
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-1 text-sm text-gray-600">
                    <Mail className="w-4 h-4 shrink-0" />
                    <span className="break-all">{aggregated.email}</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1 font-mono">
                    ID: {aggregated.clientViewerId}
                  </p>
                </div>
              </div>

              {/* STATS — variable names match API: totalWatchTime, lastActiveAt, totalSessions, createdAt */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <p className="text-sm text-gray-600 mb-1">Watch Time</p>
                  <p className="text-xl font-semibold text-[#B89B5E]">
                    {(aggregated.totalWatchTimeSum / 3600).toFixed(1)} hrs
                  </p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <p className="text-sm text-gray-600 mb-1">Last Active</p>
                  <p className="text-sm text-gray-900">
                    {aggregated.lastActiveAt
                      ? new Date(aggregated.lastActiveAt).toLocaleString()
                      : "—"}
                  </p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <p className="text-sm text-gray-600 mb-1">Sessions</p>
                  <p className="text-xl font-semibold text-gray-900">
                    {aggregated.totalSessionsSum}
                  </p>
                </div>
                {aggregated.firstSeenAt && (
                  <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <p className="text-sm text-gray-600 mb-1">First Seen</p>
                    <p className="text-sm text-gray-900">
                      {new Date(aggregated.firstSeenAt).toLocaleString()}
                    </p>
                  </div>
                )}
              </div>

              {/* EVENT — from API event object */}
              {aggregated.eventInfo && (aggregated.eventInfo.title || aggregated.eventInfo.eventType) && (
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 space-y-1">
                  <h4 className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Event
                  </h4>
                  <p className="text-sm text-gray-900">
                    {aggregated.eventInfo.title ?? "—"}{" "}
                    {aggregated.eventInfo.eventType && `(${aggregated.eventInfo.eventType})`}
                  </p>
                </div>
              )}

              {/* DEVICE & LOCATION — from API device and network.geo */}
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-gray-700 flex items-center gap-2 ">
                  <User className="w-4 h-4" />
                  Device &amp; Location
                </h4>
                {aggregated.deviceStr && (
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Monitor className="w-5 h-5 text-gray-500 shrink-0" />
                    <div className="min-w-0">
                      <p className="text-xs text-gray-500">Device</p>
                      <p className="text-sm text-gray-900 break-all">{aggregated.deviceStr}</p>
                    </div>
                  </div>
                )}
                {aggregated.locationStr && (
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <MapPin className="w-5 h-5 text-gray-500 shrink-0" />
                    <div className="min-w-0">
                      <p className="text-xs text-gray-500">Location</p>
                      <p className="text-sm text-gray-900">{aggregated.locationStr}</p>
                    </div>
                  </div>
                )}
                {aggregated.networkIp && (
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Globe className="w-5 h-5 text-gray-500 shrink-0" />
                    <div className="min-w-0">
                      <p className="text-xs text-gray-500">IP</p>
                      <p className="text-sm text-gray-900 font-mono">{aggregated.networkIp}</p>
                    </div>
                  </div>
                )}
                {!aggregated.deviceStr && !aggregated.locationStr && !aggregated.networkIp && (
                  <p className="text-sm text-gray-500 italic">No device or location data</p>
                )}
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
