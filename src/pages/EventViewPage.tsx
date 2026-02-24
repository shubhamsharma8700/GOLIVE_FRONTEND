import { Navigate, useNavigate, useParams } from "react-router-dom";
import EventView from "../components/events/EventView";

export default function EventViewPage() {
  const navigate = useNavigate();
  const { eventId } = useParams<{ eventId: string }>();

  if (!eventId) {
    return <Navigate to="/events" replace />;
  }

  return (
    <EventView
      eventId={eventId}
      onBack={() => navigate("/events")}
    />
  );
}
