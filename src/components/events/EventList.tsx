import {
  useListEventsQuery,
  useDeleteEventMutation,
} from "../../store/services/events.service";

import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import {
  Eye,
  Edit,
  Trash2,
  Calendar as CalendarIcon,
} from "lucide-react";
import { toast } from "sonner";

export default function EventList({
  // onCreate,
  onEdit,
  onView,
  searchQuery,
}: {
  onCreate: () => void;
  onEdit: (id: string) => void;
  onView: (id: string) => void;
  searchQuery?: string;
}) {
  // Fetch events (search from parent)
  const { data, isLoading } = useListEventsQuery({ q: searchQuery });
  const [deleteEvent] = useDeleteEventMutation();

  const events = data?.events || [];

  const handleDelete = async (eventId: string) => {
    try {
      await deleteEvent(eventId).unwrap();
      toast.success("Event deletion initiated successfully");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete event");
    }
  };

  return (
    <div className="space-y-6">

      {/* Events Table Card */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="border-b border-gray-100">
          <CardTitle>All Events ({events.length})</CardTitle>
        </CardHeader>

        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-6 text-center text-gray-500">Loading events...</div>
          ) : events.length === 0 ? (
            <div className="p-6 text-center text-gray-500">No events found</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                {/* ---------- TABLE HEADER ---------- */}
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left p-4 text-sm text-[#B89B5E]">Event Name</th>
                    <th className="text-left p-4 text-sm text-[#B89B5E]">Date & Time</th>
                    <th className="text-left p-4 text-sm text-[#B89B5E]">Status</th>
                    <th className="text-left p-4 text-sm text-[#B89B5E]">Created At</th>
                    <th className="text-left p-4 text-sm text-[#B89B5E]">Actions</th>
                  </tr>
                </thead>

                {/* ---------- TABLE BODY ---------- */}
                <tbody>
                  {events.map((event: any) => {
                    const date = event.startTime
                      ? new Date(event.startTime)
                      : null;

                    const formattedDate =
                      date ? date.toLocaleDateString() : "--";

                    const formattedTime =
                      date ? date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "--";

                    return (
                      <tr
                        key={event.eventId}
                        className="border-t border-gray-100 hover:bg-gray-50 transition-colors"
                      >
                        {/* -------- Event Name with Icon -------- */}
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-[#B89B5E]/10 flex items-center justify-center">
                              <CalendarIcon className="w-5 h-5 text-[#B89B5E]" />
                            </div>
                            <span className="font-medium">{event.title}</span>
                          </div>
                        </td>

                        {/* -------- Date & Time -------- */}
                        <td className="p-4 text-[#6B6B6B]">
                          {formattedDate} • {formattedTime}
                        </td>

                        {/* -------- Status Badge -------- */}
                        <td className="p-4">
                          <Badge
                            className={
                              event.status === "live"
                                ? "bg-green-100 text-green-800"
                                : event.status === "scheduled"
                                  ? "bg-blue-100 text-blue-800"
                                  : event.status === "uploaded"
                                    ? "bg-yellow-100 text-yellow-800"
                                    : "bg-gray-100 text-gray-700"
                            }
                          >
                            {event.status === "live" ? (
                              <span className="flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                                Live
                              </span>
                            ) : event.status === "scheduled" ? (
                              "Upcoming"
                            ) : event.status === "uploaded" ? (
                              "Completed"
                            ) : (
                             event.vodStatus === "READY" ? "VOD READY" : event.status
                            )}
                          </Badge>
                        </td>

                        {/* -------- Created At -------- */}
                        <td className="p-4 text-gray-700">
                          {event.createdAt
                            ? new Date(event.createdAt).toLocaleString()
                            : "--"}
                        </td>

                        {/* -------- Actions -------- */}
                        <td className="p-4 flex items-center gap-2">
                          {/* VIEW */}
                          <Button
                            size="sm"
                            className="bg-[#B89B5E] text-white hover:bg-[#A28452]"
                            onClick={() => onView(event.eventId)}
                          >
                            <Eye className="w-4 h-4 mr-1" /> View
                          </Button>

                          {/* EDIT */}
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => onEdit(event.eventId)}
                          >
                            <Edit className="w-4 h-4 mr-1" /> Edit
                          </Button>

                          {/* DELETE */}
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDelete(event.eventId)}
                            disabled={event.isDeletionInProgress}
                          >
                            <Trash2 className="w-4 h-4 mr-1" /> {event.isDeletionInProgress?"Deleting...":"Delete"}
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
