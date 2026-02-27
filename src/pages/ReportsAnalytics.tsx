import { useEffect, useMemo, useState } from 'react';
import { Activity, BarChart3, Calendar, Clock, DollarSign, Eye, Search, TrendingUp } from 'lucide-react';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { toast } from 'sonner';

import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import { useListEventsQuery } from '../store/services/events.service';
import { useGetAnalyticsReportMutation } from '../store/services/reports.service';
import type { AnalyticsTopEvent } from '../store/services/reports.service';

type ApiEvent = {
  eventId: string;
  title?: string;
  startTime?: string;
  eventType?: string;
  status?: string;
  vodStatus?: string;
};

const numberFmt = new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 1 });
const currencyFmt = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 });

const formatDuration = (seconds: number) => {
  if (!seconds) return '0m';
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  if (hrs === 0) return `${mins}m`;
  return `${hrs}h ${mins}m`;
};

const formatDate = (date: string | null | undefined) => {
  if (!date) return '-';
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
};

const formatAvgWatchTime = (minutes: number | string | null | undefined) => {
  if (minutes === null || minutes === undefined || minutes === '') return '-';
  if (typeof minutes === 'number') return `${minutes} m`;
  const trimmed = String(minutes).trim();
  if (!trimmed) return '-';
  if (/[a-zA-Z]/.test(trimmed)) return trimmed;
  return `${trimmed} m`;
};

export function ReportsAnalytics() {
  const [selectedEventId, setSelectedEventId] = useState<string>('all');
  const { data: eventsData } = useListEventsQuery({ limit: 20 });
  const [getAnalyticsReport, { data: reportData, isLoading: reportLoading }] = useGetAnalyticsReportMutation();

  const apiEvents = (eventsData?.events ?? []) as ApiEvent[];
  const eventsForDropdown = useMemo(
    () => [{ eventId: 'all', title: 'All Events' }, ...apiEvents.map((e) => ({ eventId: e.eventId, title: e.title || 'Untitled Event' }))],
    [apiEvents],
  );

  useEffect(() => {
    getAnalyticsReport({ eventId: selectedEventId })
      .unwrap()
      .catch(() => toast.error('Failed to fetch report'));
  }, [selectedEventId, getAnalyticsReport]);

  const summary = reportData?.summary;
  const charts = reportData?.charts;
  const revenueCurrency = summary?.totalRevenueCurrency || 'USD';
  const totalRevenue = summary?.totalRevenue ?? 0;
  const formattedRevenue = revenueCurrency === 'USD'
    ? currencyFmt.format(totalRevenue)
    : new Intl.NumberFormat('en-US', { style: 'currency', currency: revenueCurrency }).format(totalRevenue);

  const topEventsRows = useMemo<AnalyticsTopEvent[]>(() => {
    if (reportData?.topEvents?.length) return reportData.topEvents;
    return apiEvents.map((event) => ({
      eventId: event.eventId,
      name: event.title || 'Untitled Event',
      date: event.startTime ?? null,
      type: event.eventType ?? 'unknown',
      status: event.status ?? event.vodStatus ?? 'unknown',
      viewers: 0,
      uniqueViewers: 0,
      peakConcurrent: 0,
      avgWatchTime: 0,
      duration: '0m',
      engagement: 0,
      size: 80,
    }));
  }, [apiEvents, reportData?.topEvents]);

  return (
    <div className="space-y-6">
      <div className="relative max-w-2xl">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <Select value={selectedEventId} onValueChange={setSelectedEventId}>
          <SelectTrigger className="bg-white pl-10">
            <SelectValue placeholder="Select event..." />
          </SelectTrigger>
          <SelectContent>
            {eventsForDropdown.map((item) => (
              <SelectItem key={item.eventId} value={item.eventId}>
                {item.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {reportLoading && (
          <span className="absolute right-10 top-1/2 -translate-y-1/2 text-xs text-gray-500">Loading report...</span>
        )}
      </div>

      <div>
        <h1 className="mb-1 text-2xl">Reports & Analytics</h1>
        <p className="text-[#6B6B6B]">Comprehensive insights and performance metrics</p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="mb-1 text-sm text-[#6B6B6B]">Total Views</p>
                <h3 className="text-3xl">{numberFmt.format(summary?.totalViews ?? 0)}</h3>
              </div>
              <Eye className="h-10 w-10 text-[#B89B5E]" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="mb-1 text-sm text-[#6B6B6B]">Total Revenue</p>
                <h3 className="text-3xl">{formattedRevenue}</h3>
              </div>
              <DollarSign className="h-10 w-10 text-[#3B82F6]" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="mb-1 text-sm text-[#6B6B6B]">Total Watch Time</p>
                <h3 className="text-3xl">{formatDuration(summary?.totalWatchTime ?? 0)}</h3>
              </div>
              <Clock className="h-10 w-10 text-[#10B981]" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="mb-1 text-sm text-[#6B6B6B]">Total Events</p>
                <h3 className="text-3xl">{numberFmt.format(summary?.totalEvents ?? 0)}</h3>
              </div>
              <Calendar className="h-10 w-10 text-[#EC4899]" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className="border-0 shadow-sm">
          <CardHeader className="border-b border-gray-100">
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-[#B89B5E]" />
              Viewership Trends
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={charts?.viewershipData ?? []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" stroke="#6B6B6B" />
                <YAxis stroke="#6B6B6B" />
                <Tooltip />
                <Legend iconType="circle" />
                <Area type="monotone" dataKey="anonymous" stackId="1" stroke="#3B82F6" fill="#93C5FD" name="Anonymous" />
                <Area type="monotone" dataKey="registered" stackId="1" stroke="#B89B5E" fill="#E9D9B5" name="Registered" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardHeader className="border-b border-gray-100">
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-[#B89B5E]" />
              Peak Viewing Hours
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={charts?.peakHoursData ?? []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="hour" stroke="#6B6B6B" />
                <YAxis stroke="#6B6B6B" />
                <Tooltip />
                <Bar dataKey="viewers" fill="#B89B5E" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className="border-0 shadow-sm">
          <CardHeader className="border-b border-gray-100">
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-[#B89B5E]" />
              Most Watched Events
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={charts?.topEventsComparison ?? []} layout="vertical" margin={{ left: 30 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis type="number" stroke="#6B6B6B" />
                <YAxis dataKey="name" type="category" width={130} stroke="#6B6B6B" style={{ fontSize: '12px' }} />
                <Tooltip />
                <Legend iconType="circle" />
                <Bar dataKey="viewers" fill="#B89B5E" name="Total Viewers" />
                <Bar dataKey="peakConcurrent" fill="#3B82F6" name="Peak Concurrent" />
                <Bar dataKey="avgWatchTime" fill="#10B981" name="Avg Watch Time (min)" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardHeader className="border-b border-gray-100">
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-[#B89B5E]" />
              Engagement vs Viewership
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <ResponsiveContainer width="100%" height={350}>
              <LineChart data={charts?.eventEngagementData ?? []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="viewers" stroke="#6B6B6B" />
                <YAxis dataKey="engagement" stroke="#6B6B6B" />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="engagement"
                  stroke="#B89B5E"
                  strokeWidth={3}
                  dot={{ fill: '#B89B5E', r: 6, strokeWidth: 2, stroke: '#fff' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card className="border-0 shadow-sm">
        <CardHeader className="border-b border-gray-100">
          <CardTitle>Top Performing Events</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="p-4 text-left text-sm text-[#B89B5E]">Rank</th>
                  <th className="p-4 text-left text-sm text-[#B89B5E]">Event ID</th>
                  <th className="p-4 text-left text-sm text-[#B89B5E]">Event Name</th>
                  <th className="p-4 text-left text-sm text-[#B89B5E]">Date</th>
                  <th className="p-4 text-left text-sm text-[#B89B5E]">Type</th>
                  <th className="p-4 text-left text-sm text-[#B89B5E]">Status</th>
                  <th className="p-4 text-left text-sm text-[#B89B5E]">Views</th>
                  <th className="p-4 text-left text-sm text-[#B89B5E]">Unique Viewers</th>
                  <th className="p-4 text-left text-sm text-[#B89B5E]">Peak Concurrent</th>
                  <th className="p-4 text-left text-sm text-[#B89B5E]">Avg Watch Time</th>
                  <th className="p-4 text-left text-sm text-[#B89B5E]">Duration</th>
                  <th className="p-4 text-left text-sm text-[#B89B5E]">Engagement</th>
                </tr>
              </thead>
              <tbody>
                {topEventsRows.length === 0 ? (
                  <tr>
                    <td colSpan={12} className="p-6 text-center text-[#6B6B6B]">No events found</td>
                  </tr>
                ) : (
                  topEventsRows.map((event, index) => (
                    <tr key={event.eventId} className="border-t border-gray-100 transition-colors hover:bg-gray-50">
                      <td className="p-4 font-medium">{index + 1}</td>
                      <td className="p-4 font-mono text-xs text-[#6B6B6B]">{event.eventId}</td>
                      <td className="p-4">{event.name}</td>
                      <td className="p-4 text-[#6B6B6B]">{formatDate(event.date)}</td>
                      <td className="p-4 text-[#6B6B6B]">{event.type ?? '-'}</td>
                      <td className="p-4">
                        <Badge variant="secondary">{event.status ?? '-'}</Badge>
                      </td>
                      <td className="p-4 text-[#6B6B6B]">{event.viewers ?? '-'}</td>
                      <td className="p-4 text-[#6B6B6B]">{event.uniqueViewers ?? '-'}</td>
                      <td className="p-4 text-[#6B6B6B]">{event.peakConcurrent ?? '-'}</td>
                      <td className="p-4 text-[#6B6B6B]">{formatAvgWatchTime(event.avgWatchTime)}</td>
                      <td className="p-4 text-[#6B6B6B]">{event.duration ?? '-'}</td>
                      <td className="p-4 text-[#6B6B6B]">{event.engagement ?? '-'}</td>
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
