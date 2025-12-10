// src/features/events/EventView.tsx

import { useEffect } from "react";
import { useGetEventByIdQuery } from "../../store/services/events.service";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { loadEvent } from "../../store/slices/eventSlice";

import EventTabs from "./tabs/EventTabs";

// Tabs to show
import EventDetailsTab from "./tabs/EventDetailsTab";
import VideoConfigTab from "./tabs/VideoConfigTab";
import AccessSecurityTab from "./tabs/AccessSecurityTab"; // registration is inside here now

import { Button } from "../../components/ui/button";

export default function EventView({
  eventId,
  onBack,
}: {
  eventId: string;
  onBack: () => void;
}) {
  const { data, isLoading } = useGetEventByIdQuery(eventId);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (data?.event) {
      dispatch(loadEvent({ ...data.event, eventId: data.event.eventId }));
    }
  }, [data, dispatch]);

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="space-y-6">

      {/* Only 3 Tabs Now */}
      <EventTabs>
        <EventDetailsTab />
        <VideoConfigTab />
        <AccessSecurityTab /> 
      </EventTabs>

      {/* Back Button */}
      <div className="flex justify-end">
        <Button onClick={onBack}>Back</Button>
      </div>
    </div>
  );
}
