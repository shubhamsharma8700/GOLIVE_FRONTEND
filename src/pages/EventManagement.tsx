// src/features/events/EventManagementPage.tsx

import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Search, Plus } from "lucide-react";

import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";

import EventList from "../components/events/EventList";
import EventForm from "../components/events/EventForm";
import EventView from "../components/events/EventView";

import { useAppDispatch } from "../hooks/useAppDispatch";
import { resetForm } from "../store/slices/eventFormSlice";

export type EventViewMode = "list" | "create" | "edit" | "view";

export default function EventManagementPage() {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const viewEventIdFromState = (location.state as { viewEventId?: string } | null)?.viewEventId;

  const [mode, setMode] = useState<EventViewMode>("list");
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (viewEventIdFromState) {
      setSelectedEventId(viewEventIdFromState);
      setMode("view");
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [viewEventIdFromState, navigate, location.pathname]);

  /* ======================================================
     NAVIGATION HELPERS
  ====================================================== */

  const handleCreate = () => {
    dispatch(resetForm()); // fresh form
    setSelectedEventId(null);
    setMode("create");
  };

  const handleEdit = (eventId: string) => {
    dispatch(resetForm()); // clear stale form before load
    setSelectedEventId(eventId);
    setMode("edit");
  };

  const handleView = (eventId: string) => {
    // ❌ do NOT reset form for view
    setSelectedEventId(eventId);
    setMode("view");
  };

  const goBackToList = () => {
    dispatch(resetForm()); // cleanup when leaving form
    setSelectedEventId(null);
    setMode("list");
  };

  /* ======================================================
     PAGE HEADER
  ====================================================== */

  const renderPageHeader = () => {
    switch (mode) {
      case "list":
        return (
          <>
            <h1 className="text-2xl font-semibold mb-1">
              Event Management
            </h1>
            <p className="text-[#6B6B6B]">
              Create, edit, and manage all streaming events
            </p>
          </>
        );

      case "create":
        return (
          <>
            <h1 className="text-2xl font-semibold mb-1">
              Create New Event
            </h1>
            <p className="text-[#6B6B6B]">
              Add details to create a new streaming event
            </p>
          </>
        );

      case "edit":
        return (
          <>
            <h1 className="text-2xl font-semibold mb-1">
              Edit Event
            </h1>
            <p className="text-[#6B6B6B]">
              Update the event configuration
            </p>
          </>
        );

      case "view":
        return (
          <>
            <h1 className="text-2xl font-semibold mb-1">
              Event Overview
            </h1>
            <p className="text-[#6B6B6B]">
              View event details and metadata
            </p>
          </>
        );

      default:
        return null;
    }
  };

  /* ======================================================
     RENDER
  ====================================================== */

  return (
    <div className="w-full mx-auto space-y-8">
      {/* SEARCH BAR */}
      {mode === "list" && (
        <div className="relative max-w-2xl">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            type="search"
            placeholder="Search events by name..."
            className="pl-10 bg-white"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      )}

      {/* HEADER */}
      {mode === "list" && (
        <div className="flex items-center justify-between mb-4 mt-4">
          <div className="space-y-1">
            {renderPageHeader()}
          </div>

          <Button
            className="bg-[#B89B5E] text-white hover:bg-[#A28452]"
            onClick={handleCreate}
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Event
          </Button>
        </div>
      )}

      {/* CONTENT */}
      {mode === "list" && (
        <EventList
          searchQuery={searchQuery}
          onCreate={handleCreate}
          onEdit={handleEdit}
          onView={handleView}
        />
      )}

      {mode === "create" && (
        <EventForm mode="create" onBack={goBackToList} />
      )}

      {mode === "edit" && selectedEventId && (
        <EventForm
          mode="update"
          eventId={selectedEventId}
          onBack={goBackToList}
        />
      )}

      {mode === "view" && selectedEventId && (
        <EventView
          eventId={selectedEventId}
          onBack={goBackToList}
        />
      )}
    </div>
  );
}
