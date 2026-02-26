// src/features/events/EventManagementPage.tsx

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Plus } from "lucide-react";

import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";

import EventList from "../components/events/EventList";
import EventForm from "../components/events/EventForm";

import { useAppDispatch } from "../hooks/useAppDispatch";
import { resetForm } from "../store/slices/eventFormSlice";

export type EventViewMode = "list" | "create" | "edit";

export default function EventManagementPage() {
  const PAGE_SIZE = 10;
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [mode, setMode] = useState<EventViewMode>("list");
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const handleCreate = () => {
    dispatch(resetForm());
    setSelectedEventId(null);
    setMode("create");
  };

  const handleEdit = (eventId: string) => {
    dispatch(resetForm());
    setSelectedEventId(eventId);
    setMode("edit");
  };

  const handleView = (eventId: string) => {
    navigate(`/events/${eventId}`);
  };

  const goBackToList = () => {
    dispatch(resetForm());
    setSelectedEventId(null);
    setMode("list");
  };

  const renderPageHeader = () => {
    switch (mode) {
      case "list":
        return (
          <>
            <h1 className="text-2xl font-semibold mb-1">Event Management</h1>
            <p className="text-[#6B6B6B]">Create, edit, and manage all streaming events</p>
          </>
        );

      case "create":
        return (
          <>
            <h1 className="text-2xl font-semibold mb-1">Create New Event</h1>
            <p className="text-[#6B6B6B]">Add details to create a new streaming event</p>
          </>
        );

      case "edit":
        return (
          <>
            <h1 className="text-2xl font-semibold mb-1">Edit Event</h1>
            <p className="text-[#6B6B6B]">Update the event configuration</p>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <div className="w-full mx-auto space-y-8">
      {mode === "list" && (
        <div className="relative max-w-2xl">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            type="search"
            placeholder="Search..."
            className="pl-10 bg-white"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>
      )}

      {mode === "list" && (
        <div className="flex items-center justify-between mb-4 mt-4">
          <div className="space-y-1">{renderPageHeader()}</div>

          <Button
            className="bg-[#B89B5E] text-white hover:bg-[#A28452]"
            onClick={handleCreate}
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Event
          </Button>
        </div>
      )}

      {mode === "list" && (
        <EventList
          searchQuery={searchQuery}
          currentPage={currentPage}
          pageSize={PAGE_SIZE}
          onPageChange={setCurrentPage}
          onCreate={handleCreate}
          onEdit={handleEdit}
          onView={handleView}
        />
      )}

      {mode === "create" && <EventForm mode="create" onBack={goBackToList} />}

      {mode === "edit" && selectedEventId && (
        <EventForm mode="update" eventId={selectedEventId} onBack={goBackToList} />
      )}
    </div>
  );
}
