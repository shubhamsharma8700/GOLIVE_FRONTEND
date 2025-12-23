import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { TrendingUp, Users, Eye, Clock, Calendar, Search, Filter, CalendarIcon, TrendingDown, Download, UserCheck, UserX, Video, BarChart3, Activity, ChevronLeft, ChevronRight } from 'lucide-react';
import { BarChart, Bar, LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { useState, useMemo } from 'react';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Calendar as CalendarComponent } from '../components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '../components/ui/popover';
import { Badge } from '../components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import { toast } from 'sonner';

const viewershipData = [
  { month: 'Jan', anonymous: 7200, registered: 5300, total: 12500 },
  { month: 'Feb', anonymous: 10500, registered: 8400, total: 18900 },
  { month: 'Mar', anonymous: 8800, registered: 6800, total: 15600 },
  { month: 'Apr', anonymous: 12300, registered: 9800, total: 22100 },
  { month: 'May', anonymous: 15600, registered: 12800, total: 28400 },
  { month: 'Jun', anonymous: 17200, registered: 14000, total: 31200 },
];

// New data for registrations by source
const registrationSourceData = [
  { source: 'Direct', count: 2850, color: '#B89B5E', percentage: 42 },
  { source: 'Social Media', count: 1920, color: '#3B82F6', percentage: 28 },
  { source: 'Email Campaign', count: 1360, color: '#10B981', percentage: 20 },
  { source: 'Referral', count: 680, color: '#EC4899', percentage: 10 },
];

// Top viewed videos data
const topVideosData = [
  { name: 'Gaming Finals Highlight', views: 45230, completionRate: 87 },
  { name: 'Product Demo', views: 38910, completionRate: 92 },
  { name: 'Tournament Recap', views: 34520, completionRate: 79 },
  { name: 'Festival Opening', views: 29840, completionRate: 85 },
  { name: 'Tech Keynote', views: 21560, completionRate: 94 },
];

// Daily engagement data for heatmap
const dailyEngagementData = [
  { day: 'Monday', views: 12400, avgTime: '32m' },
  { day: 'Tuesday', views: 15800, avgTime: '38m' },
  { day: 'Wednesday', views: 18900, avgTime: '42m' },
  { day: 'Thursday', views: 16200, avgTime: '35m' },
  { day: 'Friday', views: 21500, avgTime: '45m' },
  { day: 'Saturday', views: 24300, avgTime: '52m' },
  { day: 'Sunday', views: 19600, avgTime: '48m' },
];

const peakHoursData = [
  { hour: '00:00', viewers: 2400 },
  { hour: '04:00', viewers: 1200 },
  { hour: '08:00', viewers: 5600 },
  { hour: '12:00', viewers: 8900 },
  { hour: '16:00', viewers: 12400 },
  { hour: '20:00', viewers: 15800 },
];

const topEvents = [
  { name: 'Gaming Championship Finals', viewers: 45230, duration: '4h 32m', engagement: 94, status: 'Completed', date: '2024-11-20' },
  { name: 'Tech Product Launch', viewers: 38910, duration: '2h 15m', engagement: 89, status: 'Completed', date: '2024-11-18' },
  { name: 'Sports Tournament Live', viewers: 34520, duration: '3h 45m', engagement: 91, status: 'Live', date: '2024-11-27' },
  { name: 'Music Festival Stream', viewers: 29840, duration: '5h 20m', engagement: 87, status: 'Completed', date: '2024-11-15' },
  { name: 'Educational Conference', viewers: 21560, duration: '6h 10m', engagement: 82, status: 'Completed', date: '2024-11-10' },
  { name: 'Tech Summit 2025', viewers: 19200, duration: '3h 15m', engagement: 85, status: 'Upcoming', date: '2024-12-05' },
  { name: 'FIFA World Cup Highlights', viewers: 17850, duration: '2h 45m', engagement: 90, status: 'Completed', date: '2024-11-12' },
  { name: 'Gaming Live Stream', viewers: 16420, duration: '4h 05m', engagement: 88, status: 'Live', date: '2024-11-26' },
];

// Top 6 events viewership comparison data
const topEventsComparison = [
  { name: 'Gaming Finals', viewers: 45230, peakConcurrent: 12400, avgWatchTime: 38 },
  { name: 'Tech Launch', viewers: 38910, peakConcurrent: 10200, avgWatchTime: 42 },
  { name: 'Sports Tournament', viewers: 34520, peakConcurrent: 9800, avgWatchTime: 35 },
  { name: 'Music Festival', viewers: 29840, peakConcurrent: 8200, avgWatchTime: 45 },
  { name: 'Edu Conference', viewers: 21560, peakConcurrent: 5600, avgWatchTime: 52 },
  { name: 'Tech Summit', viewers: 19200, peakConcurrent: 5200, avgWatchTime: 28 },
];

// Event engagement scatter data
const eventEngagementData = [
  { name: 'Gaming Championship Finals', viewers: 45230, engagement: 94, completionRate: 87, size: 450 },
  { name: 'Tech Product Launch', viewers: 38910, engagement: 89, completionRate: 92, size: 389 },
  { name: 'Sports Tournament Live', viewers: 34520, engagement: 91, completionRate: 85, size: 345 },
  { name: 'Music Festival Stream', viewers: 29840, engagement: 87, completionRate: 79, size: 298 },
  { name: 'Educational Conference', viewers: 21560, engagement: 82, completionRate: 88, size: 215 },
  { name: 'Tech Summit 2025', viewers: 19200, engagement: 85, completionRate: 90, size: 192 },
  { name: 'FIFA World Cup Highlights', viewers: 17850, engagement: 90, completionRate: 95, size: 178 },
  { name: 'Gaming Live Stream', viewers: 16420, engagement: 88, completionRate: 83, size: 164 },
];

export function ReportsAnalytics() {
  const [selectedEvent, setSelectedEvent] = useState<string>('all');

  const filteredTopEvents = useMemo(() => {
    return topEvents
      .filter(event => {
        // Selected event filter
        if (selectedEvent !== 'all') return event.name === selectedEvent;
        return true;
      });
  }, [selectedEvent]);

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <div className="relative max-w-2xl">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
        <Select value={selectedEvent} onValueChange={setSelectedEvent}>
          <SelectTrigger className="pl-10 bg-white">
            <SelectValue placeholder="Search by event name..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Events</SelectItem>
            {topEvents.map((event) => (
              <SelectItem key={event.name} value={event.name}>
                {event.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Header */}
      <div>
        <h1 className="text-2xl mb-1">Reports & Analytics</h1>
        <p className="text-[#6B6B6B]">Comprehensive insights and performance metrics</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm text-[#6B6B6B] mb-1">Total Views</p>
                <h3 className="text-3xl mb-2">128.7K</h3>
                <div className="flex items-center gap-1">
                  <TrendingUp className="w-3 h-3 text-green-500" />
                  <span className="text-xs text-green-500">+24.5%</span>
                </div>
              </div>
              <Eye className="w-10 h-10 text-[#B89B5E]" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm text-[#6B6B6B] mb-1">Avg Viewers</p>
                <h3 className="text-3xl mb-2">12.4K</h3>
                <div className="flex items-center gap-1">
                  <TrendingUp className="w-3 h-3 text-green-500" />
                  <span className="text-xs text-green-500">+18.2%</span>
                </div>
              </div>
              <Users className="w-10 h-10 text-[#3B82F6]" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm text-[#6B6B6B] mb-1">Watch Time</p>
                <h3 className="text-3xl mb-2">2.4M</h3>
                <div className="flex items-center gap-1">
                  <TrendingUp className="w-3 h-3 text-green-500" />
                  <span className="text-xs text-green-500">+32.1%</span>
                </div>
              </div>
              <Clock className="w-10 h-10 text-[#10B981]" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm text-[#6B6B6B] mb-1">Total Events</p>
                <h3 className="text-3xl mb-2">142</h3>
                <div className="flex items-center gap-1">
                  <TrendingUp className="w-3 h-3 text-green-500" />
                  <span className="text-xs text-green-500">+12.0%</span>
                </div>
              </div>
              <Calendar className="w-10 h-10 text-[#EC4899]" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Viewership Trends */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="border-b border-gray-100">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-[#B89B5E]" />
                Viewership Trends
              </CardTitle>
              <Badge className="bg-green-100 text-green-800 hover:bg-green-200">6 Months</Badge>
            </div>
            <p className="text-sm text-[#6B6B6B] mt-2">Anonymous vs Registered viewer growth over time</p>
          </CardHeader>
          <CardContent className="p-6">
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={viewershipData}>
                <defs>
                  <linearGradient id="colorRegistered" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#B89B5E" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#B89B5E" stopOpacity={0.1}/>
                  </linearGradient>
                  <linearGradient id="colorAnonymous" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" stroke="#6B6B6B" />
                <YAxis stroke="#6B6B6B" tickFormatter={(value) => `${(value / 1000).toFixed(0)}K`} />
                <Tooltip 
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
                          <p className="font-medium mb-2">{label}</p>
                          <div className="space-y-1 text-sm">
                            <p className="flex items-center justify-between gap-4">
                              <span className="flex items-center gap-2">
                                <span className="w-3 h-3 rounded-full bg-[#B89B5E]"></span>
                                Registered:
                              </span>
                              <span className="font-medium">{payload[1]?.value?.toLocaleString()}</span>
                            </p>
                            <p className="flex items-center justify-between gap-4">
                              <span className="flex items-center gap-2">
                                <span className="w-3 h-3 rounded-full bg-[#3B82F6]"></span>
                                Anonymous:
                              </span>
                              <span className="font-medium">{payload[0]?.value?.toLocaleString()}</span>
                            </p>
                            <div className="pt-2 mt-2 border-t border-gray-200">
                              <p className="flex items-center justify-between gap-4">
                                <span className="text-[#6B6B6B]">Total:</span>
                                <span className="font-medium">{((payload[0]?.value || 0) + (payload[1]?.value || 0)).toLocaleString()}</span>
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Legend 
                  wrapperStyle={{ paddingTop: '10px' }}
                  iconType="circle"
                />
                <Area 
                  type="monotone" 
                  dataKey="anonymous" 
                  stackId="1"
                  stroke="#3B82F6" 
                  fill="url(#colorAnonymous)" 
                  name="Anonymous Viewers"
                />
                <Area 
                  type="monotone" 
                  dataKey="registered" 
                  stackId="1"
                  stroke="#B89B5E" 
                  fill="url(#colorRegistered)" 
                  name="Registered Viewers"
                />
              </AreaChart>
            </ResponsiveContainer>
            <div className="mt-4 grid grid-cols-2 gap-4">
              <div className="p-3 bg-gradient-to-br from-[#B89B5E]/5 to-[#B89B5E]/10 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-2 h-2 rounded-full bg-[#B89B5E]"></div>
                  <p className="text-xs text-[#6B6B6B]">Registered (June)</p>
                </div>
                <p className="text-lg">14,000</p>
                <p className="text-xs text-green-600 mt-1">+9.3% from May</p>
              </div>
              <div className="p-3 bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-2 h-2 rounded-full bg-[#3B82F6]"></div>
                  <p className="text-xs text-[#6B6B6B]">Anonymous (June)</p>
                </div>
                <p className="text-lg">17,200</p>
                <p className="text-xs text-green-600 mt-1">+10.3% from May</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Peak Hours Chart */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="border-b border-gray-100">
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-[#B89B5E]" />
              Peak Viewing Hours
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={peakHoursData}>
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

      {/* Advanced Charts Row - Most Watched Events Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Events Viewership Comparison */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="border-b border-gray-100">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-[#B89B5E]" />
                Most Watched Events - Multi-Metric Analysis
              </CardTitle>
              <Badge className="bg-[#B89B5E]/10 text-[#B89B5E] hover:bg-[#B89B5E]/20">Top 6</Badge>
            </div>
            <p className="text-sm text-[#6B6B6B] mt-2">Comparison of total viewers, peak concurrent viewers, and average watch time</p>
          </CardHeader>
          <CardContent className="p-6">
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={topEventsComparison} layout="vertical" margin={{ left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis type="number" stroke="#6B6B6B" />
                <YAxis dataKey="name" type="category" width={120} stroke="#6B6B6B" style={{ fontSize: '12px' }} />
                <Tooltip 
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
                          <p className="font-medium mb-2">{payload[0].payload.name}</p>
                          <div className="space-y-1 text-sm">
                            <p className="flex items-center gap-2">
                              <span className="w-3 h-3 rounded-full bg-[#B89B5E]"></span>
                              Total Viewers: <span className="font-medium">{payload[0].value?.toLocaleString()}</span>
                            </p>
                            <p className="flex items-center gap-2">
                              <span className="w-3 h-3 rounded-full bg-[#3B82F6]"></span>
                              Peak Concurrent: <span className="font-medium">{payload[1]?.value?.toLocaleString()}</span>
                            </p>
                            <p className="flex items-center gap-2">
                              <span className="w-3 h-3 rounded-full bg-[#10B981]"></span>
                              Avg Watch Time: <span className="font-medium">{payload[2]?.value} min</span>
                            </p>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Legend 
                  wrapperStyle={{ paddingTop: '20px' }}
                  iconType="circle"
                />
                <Bar dataKey="viewers" fill="#B89B5E" name="Total Viewers" radius={[0, 4, 4, 0]} />
                <Bar dataKey="peakConcurrent" fill="#3B82F6" name="Peak Concurrent" radius={[0, 4, 4, 0]} />
                <Bar dataKey="avgWatchTime" fill="#10B981" name="Avg Watch Time (min)" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
            <div className="mt-4 grid grid-cols-3 gap-4 p-4 bg-gradient-to-r from-[#B89B5E]/5 to-blue-50/50 rounded-lg">
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <div className="w-2 h-2 rounded-full bg-[#B89B5E]"></div>
                  <p className="text-xs text-[#6B6B6B]">Highest Total</p>
                </div>
                <p className="text-sm">45.2K views</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <div className="w-2 h-2 rounded-full bg-[#3B82F6]"></div>
                  <p className="text-xs text-[#6B6B6B]">Peak Concurrent</p>
                </div>
                <p className="text-sm">12.4K viewers</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <div className="w-2 h-2 rounded-full bg-[#10B981]"></div>
                  <p className="text-xs text-[#6B6B6B]">Longest Watch</p>
                </div>
                <p className="text-sm">52 minutes</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Event Engagement Scatter Plot */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="border-b border-gray-100">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-[#B89B5E]" />
                Engagement vs Viewership Analysis
              </CardTitle>
              <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-200">Scatter Plot</Badge>
            </div>
            <p className="text-sm text-[#6B6B6B] mt-2">Correlation between viewer count and engagement scores</p>
          </CardHeader>
          <CardContent className="p-6">
            <ResponsiveContainer width="100%" height={350}>
              <LineChart data={eventEngagementData} margin={{ top: 20, right: 20, bottom: 20, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="viewers" 
                  type="number"
                  domain={[15000, 50000]}
                  stroke="#6B6B6B"
                  label={{ value: 'Total Viewers', position: 'insideBottom', offset: -10, style: { fontSize: '12px', fill: '#6B6B6B' } }}
                  tickFormatter={(value) => `${(value / 1000).toFixed(0)}K`}
                />
                <YAxis 
                  dataKey="engagement"
                  domain={[75, 100]}
                  stroke="#6B6B6B"
                  label={{ value: 'Engagement Score', angle: -90, position: 'insideLeft', style: { fontSize: '12px', fill: '#6B6B6B' } }}
                />
                <Tooltip 
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
                          <p className="font-medium mb-2 text-sm">{data.name}</p>
                          <div className="space-y-1 text-xs">
                            <p className="flex items-center justify-between gap-4">
                              <span className="text-[#6B6B6B]">Viewers:</span>
                              <span className="font-medium">{data.viewers.toLocaleString()}</span>
                            </p>
                            <p className="flex items-center justify-between gap-4">
                              <span className="text-[#6B6B6B]">Engagement:</span>
                              <span className="font-medium">{data.engagement}%</span>
                            </p>
                            <p className="flex items-center justify-between gap-4">
                              <span className="text-[#6B6B6B]">Completion:</span>
                              <span className="font-medium">{data.completionRate}%</span>
                            </p>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="engagement" 
                  stroke="#B89B5E" 
                  strokeWidth={3}
                  dot={{ fill: '#B89B5E', r: 6, strokeWidth: 2, stroke: '#fff' }}
                  activeDot={{ r: 8, stroke: '#B89B5E', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
            <div className="mt-4 grid grid-cols-2 gap-4">
              <div className="p-4 bg-gradient-to-br from-[#B89B5E]/5 to-[#B89B5E]/10 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-4 h-4 text-[#B89B5E]"/>
                  <p className="text-xs text-[#6B6B6B]">Average Engagement</p>
                </div>
                <p className="text-xl">88.0%</p>
                <p className="text-xs text-green-600 mt-1">+5.2% from last period</p>
              </div>
              <div className="p-4 bg-gradient-to-br from-purple-50 to-purple-100/50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Eye className="w-4 h-4 text-purple-600"/>
                  <p className="text-xs text-[#6B6B6B]">Avg Completion Rate</p>
                </div>
                <p className="text-xl">87.4%</p>
                <p className="text-xs text-green-600 mt-1">+3.8% from last period</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Performing Events */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="border-b border-gray-100">
          <CardTitle>Top Performing Events</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left p-4 text-sm text-[#B89B5E]">Rank</th>
                  <th className="text-left p-4 text-sm text-[#B89B5E]">Event Name</th>
                  <th className="text-left p-4 text-sm text-[#B89B5E]">Date</th>
                  <th className="text-left p-4 text-sm text-[#B89B5E]">Total Viewers</th>
                  <th className="text-left p-4 text-sm text-[#B89B5E]">Duration</th>
                  <th className="text-left p-4 text-sm text-[#B89B5E]">Engagement</th>
                </tr>
              </thead>
              <tbody>
                {filteredTopEvents.map((event, index) => (
                  <tr key={event.name} className="border-t border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="p-4">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        index === 0 ? 'bg-yellow-100 text-yellow-800' :
                        index === 1 ? 'bg-gray-100 text-gray-800' :
                        index === 2 ? 'bg-orange-100 text-orange-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        #{index + 1}
                      </div>
                    </td>
                    <td className="p-4">{event.name}</td>
                    <td className="p-4 text-[#6B6B6B]">
                      {new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <Eye className="w-4 h-4 text-[#6B6B6B]" />
                        <span>{event.viewers.toLocaleString()}</span>
                      </div>
                    </td>
                    <td className="p-4 text-[#6B6B6B]">{event.duration}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-gray-200 rounded-full h-2 max-w-[100px]">
                          <div
                            className="bg-[#B89B5E] h-2 rounded-full"
                            style={{ width: `${event.engagement}%` }}
                          />
                        </div>
                        <span className="text-sm text-[#6B6B6B]">{event.engagement}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}