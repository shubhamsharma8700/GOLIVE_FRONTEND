import { useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import { DateTime } from "luxon";

import { useAppDispatch } from "../../hooks/useAppDispatch";
import { useAppSelector } from "../../hooks/useAppSelector";

import {
  loadEvent,
  resetForm,
} from "../../store/slices/eventFormSlice";

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

  const { data, isFetching } = useGetEventByIdQuery(eventId ?? "", {
    skip: !eventId || mode !== "update",
  });

  /* ======================================================
     LOAD EVENT (CREATE / UPDATE)
  ====================================================== */
  useEffect(() => {
    if (mode === "create") {
      dispatch(resetForm());
      return;
    }

    if (mode === "update" && data?.event) {
      dispatch(loadEvent({ ...data.event, eventId: data.event.eventId }));
    }
  }, [mode, data, dispatch, eventId]);

  /* ======================================================
     TIME HELPER (LOCAL → UTC)
     Redux stores LOCAL datetime string
     Backend ALWAYS receives UTC ISO
  ====================================================== */
  const localToUtcISO = (value?: string | null) => {
    if (!value) return null;

    return DateTime.fromISO(value, { zone: "local" })
      .toUTC()
      .toISO();
  };

  /* ======================================================
     BUILD PAYLOAD (BACKEND SAFE)
  ====================================================== */
  const buildPayload = (): Record<string, any> => {
    const payload: Record<string, any> = {
      title: form.title,
      description: form.description,
      accessMode: form.accessMode,
    };

    // CREATE ONLY
    if (mode === "create") {
      payload.eventType = form.eventType;
    }

    // LIVE + SCHEDULED → UTC time + video config
    if (form.eventType === "live" || form.eventType === "scheduled") {
      payload.startTime = localToUtcISO(form.startTime);
      payload.endTime = localToUtcISO(form.endTime);

      payload.videoConfig = {
        resolution: form.videoConfig.resolution,
        frameRate: form.videoConfig.frameRate,
        bitrateProfile: form.videoConfig.bitrateProfile,
      };
    }

    // VOD ONLY
    if (form.eventType === "vod") {
      payload.s3Key = form.s3Key;
    }

    // ACCESS MODES
    if (
      form.accessMode === "emailAccess" ||
      form.accessMode === "passwordAccess"
    ) {
      payload.registrationFields = form.registrationFields;
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

  /* ======================================================
     SUBMIT
  ====================================================== */
  const handleSubmit = async () => {
    try {
      const payload = buildPayload();

      if (mode === "create") {
        await createEvent(payload).unwrap();
      }

      if (mode === "update" && eventId) {
        await updateEvent({ eventId, body: payload }).unwrap();
      }

      dispatch(resetForm());
      onBack();
    } catch (err) {
      console.error("Event submit error:", err);
    }
  };

  /* ======================================================
     UI
  ====================================================== */

  const title =
    mode === "create" ? "Create New Event" : "Edit Event";

  const subtitle =
    mode === "create"
      ? "Add details to create a new streaming event"
      : "Update the existing event configuration";

  if (mode === "update" && isFetching) {
    return <div className="p-6 text-sm text-gray-500">Loading event…</div>;
  }

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
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        <div className="flex-1">
          <h1 className="text-2xl font-semibold">{title}</h1>
          <p className="text-sm text-[#6B6B6B]">{subtitle}</p>
        </div>
      </div>

      {/* Tabs */}
      <EventTabs>
        <EventDetailsTab />
        <VideoConfigTab />
        <AccessSecurityTab />
      </EventTabs>

      {/* Footer */}
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
