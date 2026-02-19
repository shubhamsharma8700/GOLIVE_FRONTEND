import { useState, useMemo } from "react";
import { Search, ArrowUpDown, Eye, Tag } from "lucide-react";

import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
} from "../components/ui/pagination";

import { ViewerDetailsModal } from "../components/ViewerDetailsModal";
import {
  useGetViewersQuery,
  type ApiViewer,
  type ViewersPaginationKey,
} from "../store/services/viewers.service";
import { formatDateTime12h } from "../utils/formatDateTime";

/** Re-export for components that expect Viewer by name */
export type Viewer = ApiViewer;

/* ===================== COMPONENT ===================== */

export function ViewersManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [limit] = useState(10);

  // DynamoDB cursor stack (back/forward)
  const [cursorStack, setCursorStack] = useState<
    (string | ViewersPaginationKey | null)[]
  >([null]);
  const currentCursor = cursorStack[cursorStack.length - 1];

  const [sortColumn, setSortColumn] =
    useState<"name" | "watchingHours" | null>(null);
  const [sortDirection, setSortDirection] =
    useState<"asc" | "desc">("asc");

  const [selectedViewer, setSelectedViewer] = useState<ApiViewer | null>(null);
  const [isViewerModalOpen, setIsViewerModalOpen] = useState(false);

  /* ================= API ================= */

  const { data, isLoading } = useGetViewersQuery({
    limit,
    lastKey: currentCursor,
    q: searchTerm || undefined,
  });

  /* ================= SORTING ================= */

  const getRowDisplayName = (a: ApiViewer) => {
    if (a.name && String(a.name).trim()) return a.name.trim();
    const first = a.formData?.firstName?.trim();
    const last = a.formData?.lastName?.trim();
    if (first || last) return [first, last].filter(Boolean).join(" ") || "Anonymous User";
    return "Anonymous User";
  };

  const viewers = useMemo(() => {
    if (!data?.items) return [];

    const list = [...(data.items as ApiViewer[])];

    if (!sortColumn) return list;

    return list.sort((a, b) => {
      if (sortColumn === "name") {
        const aName = getRowDisplayName(a).toLowerCase();
        const bName = getRowDisplayName(b).toLowerCase();
        return sortDirection === "asc"
          ? aName.localeCompare(bName)
          : bName.localeCompare(aName);
      }
      const aVal = a.totalWatchTime ?? 0;
      const bVal = b.totalWatchTime ?? 0;
      return sortDirection === "asc" ? aVal - bVal : bVal - aVal;
    });
  }, [data, sortColumn, sortDirection]);

  const totalViewers =
    data?.totalItems ?? data?.pagination?.totalItems ?? viewers.length;
  const nextCursor =
    data?.pagination?.nextToken ?? data?.pagination?.nextKey ?? null;

  const handleSort = (column: "name" | "watchingHours") => {
    if (sortColumn === column) {
      setSortDirection((p) => (p === "asc" ? "desc" : "asc"));
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  /* ================= HELPERS ================= */

  const openViewerModal = (viewer: ApiViewer) => {
    setSelectedViewer(viewer);
    setIsViewerModalOpen(true);
  };

  const getInitials = (v: ApiViewer) => {
    const name = getRowDisplayName(v);
    if (name === "Anonymous User") return "A";
    return name
      .split(" ")
      .filter(Boolean)
      .map((w) => w[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  };

  const getAvatarColor = (isPaid?: boolean) =>
    isPaid
      ? "bg-gradient-to-br from-[#B89B5E] to-[#8B7547]"
      : "bg-gradient-to-br from-gray-500 to-gray-600";

  const getViewerTypeBadgeColor = (type?: string) => {
    switch ((type ?? "").trim()) {
      case "freeAccess":
        return "bg-blue-100 text-blue-800 hover:bg-blue-100";
      case "emailAccess":
        return "bg-emerald-100 text-emerald-800 hover:bg-emerald-100";
      case "passwordAccess":
        return "bg-amber-100 text-amber-800 hover:bg-amber-100";
      case "paidAccess":
        return "bg-rose-100 text-rose-800 hover:bg-rose-100";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100";
    }
  };

  const getViewerAccessLabel = (type?: string) => {
    switch ((type ?? "").trim()) {
      case "freeAccess":
        return "Open Access";
      case "emailAccess":
        return "Email Required";
      case "passwordAccess":
        return "Password Protected";
      case "paidAccess":
        return "Paid Access";
      default:
        return "Unknown";
    }
  };

  const getEventTypeLabel = (eventType?: string) => {
    switch ((eventType ?? "").trim()) {
      case "vod":
        return "VOD";
      case "live":
        return "Live";
      case "scheduled":
        return "Scheduled";
      default:
        return "Unknown";
    }
  };


  const formatDuration = (totalSeconds = 0) => {
    const seconds = Math.floor(totalSeconds);

    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hrs > 0) {
      if (mins > 0 && secs > 0) return `${hrs} hr ${mins} min ${secs} sec`;
      if (mins > 0) return `${hrs} hr ${mins} min`;
      return `${hrs} hr ${secs} sec`;
    }

    if (mins > 0) {
      return `${mins} min ${secs} sec`;
    }

    return `${secs} sec`;
  };


  /* ================= RENDER ================= */

  return (
    <div className="space-y-6">

      {/* SEARCH */}
      <div className="relative max-w-2xl">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <Input
          className="pl-10 bg-white"
          placeholder="Search viewers by name or email..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCursorStack([null]);
          }}
        />
      </div>

      {/* HEADER */}
      <div>
        <h1 className="text-2xl mb-1">Viewers Management</h1>
        <p className="text-[#6B6B6B]">
          Track viewer activity and engagement
        </p>
      </div>

      {/* TABLE */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="border-b border-gray-100">
          <CardTitle>All Viewers ({totalViewers})</CardTitle>
        </CardHeader>

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  {[
                    "Viewer Name",
                    "Email",
                    "Type",
                    "Watch Time",
                    "Event Type",
                    "Last Active",
                    "Actions",
                  ].map((label) => (
                    <th
                      key={label}
                      className="p-4 text-left text-sm text-[#B89B5E]"
                    >
                      {label === "Viewer Name" ||
                        label === "Watch Time" ? (
                        <button
                          onClick={() =>
                            handleSort(
                              label === "Viewer Name"
                                ? "name"
                                : "watchingHours"
                            )
                          }
                          className="flex items-center gap-2 font-medium"
                        >
                          {label}
                          <ArrowUpDown className="w-4 h-4" />
                        </button>
                      ) : (
                        label
                      )}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-[#6B6B6B]">
                      Loading viewers...
                    </td>
                  </tr>
                ) : viewers.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-[#6B6B6B]">
                      No viewers found
                    </td>
                  </tr>
                ) : (
                  viewers.map((viewer) => (
                    <tr
                      key={`${viewer.eventId}-${viewer.clientViewerId}`}
                      className="border-t border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer"
                      onClick={() => openViewerModal(viewer)}
                    >
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center ${getAvatarColor(
                              viewer.isPaidViewer
                            )}`}
                          >
                            <span className="text-white text-sm font-medium">
                              {getInitials(viewer)}
                            </span>
                          </div>
                          <span className="font-medium text-gray-900">{getRowDisplayName(viewer)}</span>
                        </div>
                      </td>

                      <td className="p-4 text-[#6B6B6B]">
                        {viewer.email ?? viewer.formData?.email ?? "-"}
                      </td>

                      <td className="p-4">
                        <Badge className={getViewerTypeBadgeColor(viewer?.event?.accessMode)}>
                          {getViewerAccessLabel(viewer?.event?.accessMode)}
                        </Badge>
                      </td>

                      <td className="p-4 text-[#6B6B6B]">
                        {formatDuration(viewer.totalWatchTime ?? 0)}
                      </td>

                      <td className="p-4 text-[#6B6B6B]">
                        <div className="flex items-center gap-2">
                          <Tag className="w-4 h-4 text-[#B89B5E]" />
                          <span>{getEventTypeLabel(viewer?.event?.eventType)}</span>
                        </div>
                      </td>

                      <td className="p-4 text-[#6B6B6B]">
                        {formatDateTime12h(viewer.lastActiveAt)}
                      </td>

                      <td className="p-4" onClick={(e) => e.stopPropagation()}>
                        <Button
                          size="sm"
                          className="bg-[#B89B5E] text-white hover:bg-[#A28452]"
                          onClick={() => openViewerModal(viewer)}
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          View
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* PAGINATION */}
          <div className="border-t bg-gray-50 px-6 py-4">
            <Pagination>
              <PaginationContent>

                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      if (cursorStack.length > 1) {
                        setCursorStack((prev) =>
                          prev.slice(0, prev.length - 1)
                        );
                      }
                    }}
                    className={
                      cursorStack.length === 1
                        ? "pointer-events-none opacity-50"
                        : ""
                    }
                  />
                </PaginationItem>

                <PaginationItem>
                  <PaginationLink isActive>
                    {cursorStack.length}
                  </PaginationLink>
                </PaginationItem>

                <PaginationItem>
                  <PaginationNext
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      if (nextCursor) {
                        setCursorStack((prev) => [
                          ...prev,
                          nextCursor,
                        ]);
                      }
                    }}
                    className={
                      !data?.pagination?.hasMore || !nextCursor
                        ? "pointer-events-none opacity-50"
                        : ""
                    }
                  />
                </PaginationItem>

              </PaginationContent>
            </Pagination>
          </div>
        </CardContent>
      </Card>

      {/* MODAL */}
      <ViewerDetailsModal
        open={isViewerModalOpen}
        onOpenChange={setIsViewerModalOpen}
        viewer={selectedViewer ? { clientViewerId: selectedViewer.clientViewerId } : null}
      />
    </div>
  );
}


