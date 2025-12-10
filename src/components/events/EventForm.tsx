// src/features/events/EventForm.tsx

import { useEffect } from "react";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { useAppSelector } from "../../hooks/useAppSelector";
import { loadEvent, resetForm } from "../../store/slices/eventSlice";

import {
  useCreateEventMutation,
  useUpdateEventMutation,
  useGetEventByIdQuery,
} from "../../store/services/events.service";

// Tabs
import EventTabs from "./tabs/EventTabs";
import EventDetailsTab from "./tabs/EventDetailsTab";
import VideoConfigTab from "./tabs/VideoConfigTab";
import AccessSecurityTab from "./tabs/AccessSecurityTab";

import { Button } from "../../components/ui/button";
import { ArrowLeft } from "lucide-react";

type Props = {
  mode: "create" | "update";
  eventId?: string;
  onBack: () => void;
};

export default function EventForm({ mode, eventId, onBack }: Props) {
  const dispatch = useAppDispatch();
  const form = useAppSelector((s) => s.eventForm);

  const [createEvent] = useCreateEventMutation();
  const [updateEvent] = useUpdateEventMutation();

  const { data } = useGetEventByIdQuery(eventId ?? "", { skip: !eventId });

  useEffect(() => {
    if (mode === "create") {
      dispatch(resetForm());
    } else if (mode === "update" && data?.event) {
      dispatch(loadEvent({ ...data.event, eventId: data.event.eventId }));
    }
  }, [mode, data, dispatch, eventId]);

  const handleSubmit = async () => {
    try {
      const payload: any = {
        title: form.title,
        description: form.description,
        accessMode: form.accessMode,
        startTime: form.startTime,
        endTime: form.endTime,
        s3Key: form.s3Key,
        formFields: form.registrationFields.reduce(
          (acc: { [key: string]: { type: string; required: boolean } }, f) => {
            acc[f.id] = { type: f.type, required: f.required };
            return acc;
          },
          {}
        ),
        paymentAmount: form.paymentAmount,
        currency: form.currency,
      };

      if (mode === "create") {
        await createEvent({ ...payload, eventType: form.eventType }).unwrap();
        dispatch(resetForm());
        onBack();
      } else if (mode === "update" && eventId) {
        await updateEvent({ eventId, data: payload }).unwrap();
        onBack();
      }
    } catch (err) {
      console.error("Event Submit Error:", err);
    }
  };

  // FIGMA heading
  const title =
    mode === "create"
      ? "Create New Event"
      : mode === "update"
      ? "Edit Event"
      : "Event";

  const subtitle =
    mode === "create"
      ? "Add details to create a new streaming event"
      : "Update the existing event configuration";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          onClick={() => {
            dispatch(resetForm());
            onBack();
          }}
          className="border-gray-300"
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Back
        </Button>

        <div className="flex-1">
          <h1 className="text-2xl font-semibold">{title}</h1>
          <p className="text-sm text-[#6B6B6B]">{subtitle}</p>
        </div>
      </div>

      {/* ---------------------------------------------------------------- */}
      {/* 🟦 THREE-TABS ONLY: Details | Video (Live only) | Access & Security */}
      {/* ---------------------------------------------------------------- */}
      <EventTabs>
        {/* TAB 1: Event Details */}
        <EventDetailsTab />

        {/* TAB 2: Video Config (hidden for VOD because component returns null) */}
        <VideoConfigTab />

        {/* TAB 3: Access & Security (includes Registration Form inside) */}
        <AccessSecurityTab />
      </EventTabs>

      {/* Footer Buttons */}
      <div className="flex justify-end gap-3 pt-6 border-t">
        <Button
          variant="outline"
          onClick={() => {
            dispatch(resetForm());
            onBack();
          }}
        >
          Cancel
        </Button>

        <Button
          className="bg-[#B89B5E] text-white hover:bg-[#A28452]"
          onClick={handleSubmit}
        >
          {mode === "create" ? "Publish Event" : "Publish Changes"}
        </Button>
      </div>
    </div>
  );
}
