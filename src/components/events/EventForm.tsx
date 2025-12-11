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

  const { data } = useGetEventByIdQuery(eventId ?? "", {
    skip: !eventId,
  });

  // --------------------------------------------------
  // LOAD EVENT FOR EDIT MODE
  // --------------------------------------------------
  useEffect(() => {
    if (mode === "create") {
      dispatch(resetForm());
    } else if (mode === "update" && data?.event) {
      dispatch(loadEvent({ ...data.event, eventId: data.event.eventId }));
    }
  }, [mode, data, dispatch, eventId]);

  // --------------------------------------------------
  // CLEAN PAYLOAD ACCORDING TO USER FLOW
  // --------------------------------------------------
  const buildPayload = (): Record<string, any> => {
    const payload: Record<string, any> = {
      title: form.title,
      description: form.description,
      eventType: form.eventType,
      accessMode: form.accessMode,
    };

    // LIVE ONLY
    if (form.eventType === "live") {
      payload.startTime = form.startTime;
      payload.endTime = form.endTime;

      // video config as a JSON object (uses nested 'pixel' structure)
      payload.videoConfig = {
        resolution: form.videoConfig.resolution,
        frameRate: form.videoConfig.frameRate,
        bitrate: form.videoConfig.bitrate,
        pixel: {
          provider: form.videoConfig.pixel?.provider || "none",
          id: form.videoConfig.pixel?.id || "",
        },
      };
    }

    // VOD ONLY
    if (form.eventType === "vod") {
      payload.s3Key = form.s3Key; // assigned after presigned upload
    }

    // ACCESS MODE CONDITIONAL PAYLOADS
    if (form.accessMode === "emailAccess" || form.accessMode === "passwordAccess") {
      // include registration fields only in these two modes
      payload.formFields = {};

      form.registrationFields.forEach((f: { id: string; label: string; type: string; required: boolean }) => {
        payload.formFields[f.id] = {
          label: f.label,
          type: f.type,
          required: f.required,
        };
      });
    }

    if (form.accessMode === "passwordAccess") {
      payload.accessPasswordHash = form.accessPasswordHash;
    }

    if (form.accessMode === "paidAccess") {
      payload.paymentAmount = form.paymentAmount;
      payload.currency = form.currency;
    }

    return payload;
  };

  // --------------------------------------------------
  // SUBMIT HANDLER
  // --------------------------------------------------
  const handleSubmit = async () => {
    try {
      const payload = buildPayload();

      if (mode === "create") {
        await createEvent(payload).unwrap();
      } else if (mode === "update" && eventId) {
        await updateEvent({ eventId, data: payload }).unwrap();
      }

      dispatch(resetForm());
      onBack();
    } catch (err) {
      console.error("Event Submit Error:", err);
    }
  };

  // UI headings based on mode
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

      {/* ------------------------------- */}
      {/* TABS: Details | Video | Access  */}
      {/* ------------------------------- */}
      <EventTabs>
        <EventDetailsTab />
        <VideoConfigTab />
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
