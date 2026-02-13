import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Calendar, Users, TrendingUp, Video, Eye, Clock, Activity, Search, UserPlus, DollarSign } from 'lucide-react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ImageWithFallback } from '../components/common/ImageWithFallback';
import { useGetDashboardAnalyticsQuery } from '../store/services/dashboard.service';
import { useListEventsQuery } from '../store/services/events.service';

const ICON_MAP: Record<string, React.ComponentType<{ className?: string; style?: React.CSSProperties }>> = {
  Calendar,
  Users,
  UserPlus,
  Eye,
  DollarSign,
};

function getDuration(startTime?: string | null, endTime?: string | null): string {
  if (!startTime || !endTime) return "—";
  const start = new Date(startTime).getTime();
  const end = new Date(endTime).getTime();
  const ms = end - start;
  if (ms <= 0) return "—";
  const hours = Math.floor(ms / 3600000);
  const minutes = Math.floor((ms % 3600000) / 60000);
  if (hours > 0 && minutes > 0) return `${hours}h ${minutes}m`;
  if (hours > 0) return `${hours} hour${hours === 1 ? "" : "s"}`;
  return `${minutes} min`;
}

interface PreviousGoLiveRow {
  id: string;
  name: string;
  date: string;
  time: string;
  duration: string;
  totalViewers: number | string;
  peakViewers: number | string;
  avgWatchTime: string;
  thumbnail: string;
}

interface DashboardOverviewProps {
  onNavigate?: (view: string) => void;
}

export default function DashboardOverview({ onNavigate }: DashboardOverviewProps) {
  const navigate = useNavigate();
  const { data: analytics, isLoading: analyticsLoading } = useGetDashboardAnalyticsQuery();
  const { data: eventsData, isLoading: eventsLoading } = useListEventsQuery({ limit: 20 });

  const handleEventClick = () => {
    if (onNavigate) {
      onNavigate('events');
    } else {
      navigate('/events');
    }
  };

  const metrics = analytics?.cards ?? [];
  const eventData = analytics?.eventData ?? [];
  const engagementData = analytics?.engagementData ?? [];
  const previousGoLiveEvents = (eventsData?.events ?? []).map((event: any) => ({
    id: event.eventId,
    name: event.title,
    date: event.startTime ? new Date(event.startTime).toLocaleDateString() : "—",
    time: event.startTime && event.endTime
      ? `${new Date(event.startTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} - ${new Date(event.endTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`
      : event.startTime
        ? new Date(event.startTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
        : "—",
    duration: getDuration(event.startTime, event.endTime),
    totalViewers: (event as any).totalViewers ?? 0,
    peakViewers: (event as any).peakViewers ?? 0,
    avgWatchTime: (event as any).avgWatchTime ?? "—",
    thumbnail: (event as any).thumbnailUrl ?? "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=100&q=80",
  }));

  // const handleUserClick = () => {
  //   if (onNavigate) {
  //     onNavigate('users');
  //   }
  // };

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <div className="relative max-w-2xl">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
        <Input
          type="search"
          placeholder="Search events, admins or analytics..."
          className="pl-10 bg-white"
        />
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {analyticsLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="border-0 shadow-sm">
              <CardContent className="p-6">
                <div className="animate-pulse h-24 bg-gray-100 rounded" />
              </CardContent>
            </Card>
          ))
        ) : metrics.length === 0 ? (
          <Card className="border-0 shadow-sm col-span-full">
            <CardContent className="p-6 text-center text-[#6B6B6B]">
              No analytics data available
            </CardContent>
          </Card>
        ) : (
          metrics.map((metric) => {
            const Icon = ICON_MAP[metric.icon] ?? Calendar;
            return (
              <Card key={metric.title} className="border-0 shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="text-sm text-[#6B6B6B] mb-1">{metric.title}</p>
                      <h3 className="text-3xl mb-2">{metric.value}</h3>
                      <div className="flex items-center gap-1">
                        <TrendingUp className="w-3 h-3 text-emerald-400" />
                        <span className="text-xs text-emerald-400">{metric.change}</span>
                      </div>
                    </div>
                    <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${metric.color}20` }}>
                      <Icon className="w-6 h-6" style={{ color: metric.color }} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Events This Week */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="border-b border-gray-100 pb-4">
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-[#B89B5E]" />
              Events This Week
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={eventData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" stroke="#6B6B6B" />
                <YAxis stroke="#6B6B6B" />
                <Tooltip />
                <Bar dataKey="events" fill="#B89B5E" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Viewer Engagement */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="border-b border-gray-100 pb-4">
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-[#B89B5E]" />
              Viewer Engagement
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={engagementData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" stroke="#6B6B6B" />
                <YAxis stroke="#6B6B6B" />
                <Tooltip />
                <Line type="monotone" dataKey="viewers" stroke="#B89B5E" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Previous Go Live Section */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="border-b border-gray-100 pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Video className="w-5 h-5 text-[#B89B5E]" />
              Previous Go Live
            </CardTitle>
            <button
              onClick={handleEventClick}
              className="text-sm text-[#B89B5E] hover:text-[#A28452] transition-colors"
            >
              View All →
            </button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left p-4 text-sm text-[#6B6B6B]">Event</th>
                  <th className="text-left p-4 text-sm text-[#6B6B6B]">Date & Time</th>
                  <th className="text-left p-4 text-sm text-[#6B6B6B]">Duration</th>
                  <th className="text-left p-4 text-sm text-[#6B6B6B]">Total Viewers</th>
                  <th className="text-left p-4 text-sm text-[#6B6B6B]">Peak Viewers</th>
                  <th className="text-left p-4 text-sm text-[#6B6B6B]">Avg Watch Time</th>
                </tr>
              </thead>
              <tbody>
                {eventsLoading ? (
                  <tr>
                    <td colSpan={6} className="p-6 text-center text-[#6B6B6B]">
                      Loading events...
                    </td>
                  </tr>
                ) : previousGoLiveEvents.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-6 text-center text-[#6B6B6B]">
                      No events yet
                    </td>
                  </tr>
                ) : (
                  previousGoLiveEvents.map((event: PreviousGoLiveRow) => (
                    <tr
                      key={event.id}
                      className="border-t border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer"
                      onClick={() => navigate("/events", { state: { viewEventId: event.id } })}
                    >
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <ImageWithFallback
                            src={event.thumbnail}
                            alt={event.name}
                            className="w-16 h-16 rounded-lg object-cover"
                          />
                          <span className="text-sm hover:text-[#B89B5E] transition-colors">{event.name}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex flex-col">
                          <span className="text-sm">{event.date}</span>
                          <span className="text-xs text-[#6B6B6B]">{event.time}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-[#B89B5E]" />
                          <span className="text-sm">{event.duration}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <Eye className="w-4 h-4 text-[#6B6B6B]" />
                          <span className="text-sm">{typeof event.totalViewers === "number" ? event.totalViewers.toLocaleString() : event.totalViewers}</span>
                        </div>
                      </td>
                      <td className="p-4 text-sm text-[#B89B5E]">
                        {typeof event.peakViewers === "number" ? event.peakViewers.toLocaleString() : event.peakViewers}
                      </td>
                      <td className="p-4 text-sm text-[#6B6B6B]">
                        {event.avgWatchTime}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}