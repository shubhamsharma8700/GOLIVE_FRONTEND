import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { DateTime } from "luxon";

import { toast } from "sonner";
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
  const [timeErrors, setTimeErrors] = useState<{
    startTime?: string;
    endTime?: string;
  }>({});

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

  const validateTimeRules = () => {
    const nextErrors: { startTime?: string; endTime?: string } = {};
    const now = DateTime.local();
    const nowPlusFive = now.plus({ minutes: 5 });

    const parseLocal = (value?: string | null) =>
      value ? DateTime.fromISO(value, { zone: "local" }) : null;

    const start = parseLocal(form.startTime);
    const end = parseLocal(form.endTime);

    if (form.eventType === "live") {
      if (end && end < nowPlusFive) {
        nextErrors.endTime =
          "End time must be at least 5 minutes after current time.";
        setTimeErrors(nextErrors);
        toast.error("For live events, end time must be at least 5 minutes after current time.");
        document.getElementById("event-end-time")?.focus();
        return false;
      }
      setTimeErrors({});
      return true;
    }

    if (form.eventType === "scheduled") {
      if (!start || !start.isValid) {
        nextErrors.startTime = "Please select a valid start time.";
        setTimeErrors(nextErrors);
        toast.error("Please select a valid start time.");
        document.getElementById("event-start-time")?.focus();
        return false;
      }

      if (start < nowPlusFive) {
        nextErrors.startTime =
          "Start time must be at least 5 minutes after current time.";
        setTimeErrors(nextErrors);
        toast.error("For scheduled events, start time must be at least 5 minutes after current time.");
        document.getElementById("event-start-time")?.focus();
        return false;
      }

      if (end) {
        if (!end.isValid) {
          nextErrors.endTime = "Please select a valid end time.";
          setTimeErrors(nextErrors);
          toast.error("Please select a valid end time.");
          document.getElementById("event-end-time")?.focus();
          return false;
        }

        if (end < nowPlusFive) {
          nextErrors.endTime =
            "End time must be at least 5 minutes after current time.";
          setTimeErrors(nextErrors);
          toast.error("For scheduled events, end time must be at least 5 minutes after current time.");
          document.getElementById("event-end-time")?.focus();
          return false;
        }

        if (end < start) {
          nextErrors.endTime = "End time must be later than start time.";
          setTimeErrors(nextErrors);
          toast.error("End time must be later than start time.");
          document.getElementById("event-end-time")?.focus();
          return false;
        }
      }
    }

    setTimeErrors({});
    return true;
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
    // if (form.eventType === "live" || form.eventType === "scheduled") {
    //   payload.startTime = localToUtcISO(form.startTime);
    //   payload.endTime = localToUtcISO(form.endTime);

    //   payload.videoConfig = {
    //     resolution: form.videoConfig.resolution,
    //     frameRate: form.videoConfig.frameRate,
    //     bitrateProfile: form.videoConfig.bitrateProfile,
    //   };
    // }

    // CREATE ONLY → LIVE + SCHEDULED
    if (
      mode === "create" &&
      (form.eventType === "live" || form.eventType === "scheduled")
    ) {
      payload.startTime =
        form.eventType === "live"
          ? DateTime.local().toUTC().toISO()
          : localToUtcISO(form.startTime);
      payload.endTime = localToUtcISO(form.endTime);

      payload.videoConfig = {
        resolution: form.videoConfig.resolution,
        frameRate: form.videoConfig.frameRate,
        bitrateProfile: form.videoConfig.bitrateProfile,
      };
    }

    // UPDATE live → SCHEDULED (allow time edits)
    if (
      mode === "update" &&
      (form.eventType === "scheduled" || form.eventType === "live")
    ) {
      payload.startTime =
        form.eventType === "live"
          ? DateTime.local().toUTC().toISO()
          : localToUtcISO(form.startTime);
      payload.endTime = localToUtcISO(form.endTime);
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
      payload.accessPassword = form.accessPassword;
    }

    if (form.accessMode === "paidAccess") {
      payload.registrationFields = form.registrationFields;
      payload.accessPassword = form.accessPassword;
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
      if (mode === "create" && form.eventType === "vod") {
        if (!form.s3Key) {
          toast.error("Please upload a video before publishing the event.");
          return;
        }
      }

      if (form.accessMode === "passwordAccess") {
        if (!form.accessPassword?.trim()) {
          toast.error("Please set an event password before publishing.");
          return;
        }
      }

      if (form.accessMode === "paidAccess") {
        if (!form.accessPassword?.trim()) {
          toast.error("Please set an event password before publishing.");
          return;
        }
        if (form.paymentAmount == null || form.paymentAmount <= 0) {
          toast.error("Please enter a valid payment amount.");
          return;
        }
        if (!form.currency?.trim()) {
          toast.error("Please select a currency.");
          return;
        }
      }

      if (!validateTimeRules()) {
        return;
      }

      const payload = buildPayload();

      if (mode === "create") {
        await createEvent(payload).unwrap();
        toast.success("Event created successfully.");
      }

      if (mode === "update" && eventId) {
        await updateEvent({ eventId, body: payload }).unwrap();
        toast.success("Event updated successfully.");
      }

      dispatch(resetForm());
      onBack();
    } catch (err) {
      console.error("Event submit error:", err);
      const errorMessage =
        (err as { data?: { message?: string } })?.data?.message ||
        "Invalid Data Provided. Please check your inputs.";

      toast.error(errorMessage);
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
        <EventDetailsTab
          mode={mode}
          timeErrors={timeErrors}
          onClearTimeError={(field) =>
            setTimeErrors((prev) => ({ ...prev, [field]: undefined }))
          }
        />
        <VideoConfigTab mode={mode} />
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
          disabled={
            (mode === "create" && form.eventType === "vod" && !form.s3Key) ||
            (form.accessMode === "passwordAccess" && !form.accessPassword?.trim()) ||
            (form.accessMode === "paidAccess" &&
              (!form.accessPassword?.trim() ||
                form.paymentAmount == null ||
                form.paymentAmount <= 0 ||
                !form.currency?.trim()))
          }
          title={
            mode === "create" && form.eventType === "vod" && !form.s3Key
              ? "Upload a video first to publish"
              : form.accessMode === "passwordAccess" && !form.accessPassword?.trim()
                ? "Set event password to publish"
                : form.accessMode === "paidAccess" &&
                    (!form.accessPassword?.trim() ||
                      !form.currency?.trim() ||
                      form.paymentAmount == null ||
                      form.paymentAmount <= 0)
                  ? "Complete password, amount and currency to publish"
                  : undefined
          }
        >
          {mode === "create" ? "Publish Event" : "Publish Changes"}
        </Button>
      </div>
    </div>
  );
}
