import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { Calendar, Users, TrendingUp, Video, Eye, Clock, Activity, Search, UserPlus } from 'lucide-react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ImageWithFallback } from '../components/common/ImageWithFallback';

const metrics = [
  { title: 'Total Events', value: '142', change: '+12%', icon: Calendar, color: '#B89B5E' },
  { title: 'Active Admins', value: '8,432', change: '+23%', icon: Users, color: '#10B981' },
  { title: 'New Sign-ups', value: '342', change: '+15%', icon: UserPlus, color: '#3B82F6' },
  { title: 'Total Views', value: '124K', change: '+18%', icon: Eye, color: '#8B5CF6' },
];

const eventData = [
  { name: 'Mon', events: 12 },
  { name: 'Tue', events: 19 },
  { name: 'Wed', events: 15 },
  { name: 'Thu', events: 25 },
  { name: 'Fri', events: 22 },
  { name: 'Sat', events: 30 },
  { name: 'Sun', events: 28 },
];

const engagementData = [
  { name: 'Jan', viewers: 4000 },
  { name: 'Feb', viewers: 3000 },
  { name: 'Mar', viewers: 5000 },
  { name: 'Apr', viewers: 4500 },
  { name: 'May', viewers: 6000 },
  { name: 'Jun', viewers: 5500 },
];

const recentEvents = [
  { 
    id: 1, 
    name: 'Product Launch Webinar', 
    date: 'Dec 15, 2024',
    time: '10:00 AM',
    type: 'Live Stream',
    statusBadge: 'Live',
    statusColor: 'green',
    viewers: 1456,
    thumbnail: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=100&q=80'
  },
  { 
    id: 2, 
    name: 'Team Standup Meeting', 
    date: 'Dec 15, 2024',
    time: '9:00 AM',
    type: 'Meeting',
    statusBadge: 'Completed',
    statusColor: 'gray',
    viewers: 234,
    thumbnail: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=100&q=80'
  },
  { 
    id: 3, 
    name: 'Q4 Product Demo', 
    date: 'Dec 14, 2024',
    time: '2:00 PM',
    type: 'Product',
    statusBadge: 'Completed',
    statusColor: 'gray',
    viewers: 3241,
    thumbnail: 'https://images.unsplash.com/photo-1591115765373-5207764f72e7?w=100&q=80'
  },
  { 
    id: 4, 
    name: 'Customer Onboarding Session', 
    date: 'Dec 14, 2024',
    time: '11:30 AM',
    type: 'Webinar',
    statusBadge: 'Completed',
    statusColor: 'gray',
    viewers: 892,
    thumbnail: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=100&q=80'
  },
  { 
    id: 5, 
    name: 'Annual Conference 2024', 
    date: 'Dec 13, 2024',
    time: '8:00 AM',
    type: 'Conference',
    statusBadge: 'Completed',
    statusColor: 'gray',
    viewers: 5678,
    thumbnail: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=100&q=80'
  },
];

const previousGoLiveEvents = [
  {
    id: 1,
    name: 'Annual Conference 2024',
    date: 'Dec 13, 2024',
    time: '8:00 AM - 5:00 PM',
    duration: '9 hours',
    totalViewers: 5678,
    peakViewers: 4521,
    avgWatchTime: '2.5 hours',
    thumbnail: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=100&q=80'
  },
  {
    id: 2,
    name: 'Q4 Product Demo',
    date: 'Dec 14, 2024',
    time: '2:00 PM - 4:30 PM',
    duration: '2.5 hours',
    totalViewers: 3241,
    peakViewers: 2654,
    avgWatchTime: '1.8 hours',
    thumbnail: 'https://images.unsplash.com/photo-1591115765373-5207764f72e7?w=100&q=80'
  },
  {
    id: 3,
    name: 'Tech Summit 2024',
    date: 'Dec 10, 2024',
    time: '9:00 AM - 6:00 PM',
    duration: '9 hours',
    totalViewers: 2890,
    peakViewers: 2145,
    avgWatchTime: '3.2 hours',
    thumbnail: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=100&q=80'
  },
  {
    id: 4,
    name: 'Product Launch Webinar',
    date: 'Dec 15, 2024',
    time: '10:00 AM - 11:30 AM',
    duration: '1.5 hours',
    totalViewers: 1456,
    peakViewers: 1198,
    avgWatchTime: '1.1 hours',
    thumbnail: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=100&q=80'
  },
  {
    id: 5,
    name: 'Customer Success Workshop',
    date: 'Dec 12, 2024',
    time: '11:00 AM - 1:00 PM',
    duration: '2 hours',
    totalViewers: 1289,
    peakViewers: 987,
    avgWatchTime: '1.3 hours',
    thumbnail: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=100&q=80'
  },
];

const topUsersByHours = [
  {
    id: 1,
    name: 'Sarah Johnson',
    email: 'sarah.johnson@golive.com',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80',
    role: 'Admin',
    totalHours: 324.5,
    eventsAttended: 45,
    avgSessionTime: '7.2h',
    status: 'Active'
  },
  {
    id: 2,
    name: 'Michael Chen',
    email: 'michael.chen@golive.com',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80',
    role: 'Admin',
    totalHours: 298.3,
    eventsAttended: 38,
    avgSessionTime: '7.8h',
    status: 'Active'
  },
  {
    id: 3,
    name: 'Emily Rodriguez',
    email: 'emily.r@golive.com',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80',
    role: 'Admin',
    totalHours: 276.8,
    eventsAttended: 52,
    avgSessionTime: '5.3h',
    status: 'Active'
  },
  {
    id: 4,
    name: 'David Kim',
    email: 'david.kim@golive.com',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&q=80',
    role: 'Admin',
    totalHours: 245.2,
    eventsAttended: 41,
    avgSessionTime: '6.0h',
    status: 'Active'
  },
  {
    id: 5,
    name: 'Jessica Martinez',
    email: 'jessica.m@golive.com',
    avatar: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=100&q=80',
    role: 'Admin',
    totalHours: 223.7,
    eventsAttended: 36,
    avgSessionTime: '6.2h',
    status: 'Active'
  },
];

const topViewersByHours = [
  {
    id: 1,
    name: 'David Kim',
    email: 'david.kim@email.com',
    type: 'Paid User',
    watchingHours: 31.4,
    status: 'Active',
    lastActive: '45 minutes ago',
    device: 'Desktop - Edge',
    location: 'Austin, USA'
  },
  {
    id: 2,
    name: 'Michael Chen',
    email: 'michael.chen@email.com',
    type: 'Paid User',
    watchingHours: 24.8,
    status: 'Active',
    lastActive: '5 hours ago',
    device: 'Desktop - Firefox',
    location: 'San Francisco, USA'
  },
  {
    id: 3,
    name: 'Robert Martinez',
    email: 'robert.martinez@email.com',
    type: 'Paid User',
    watchingHours: 22.7,
    status: 'Active',
    lastActive: '6 hours ago',
    device: 'Desktop - Safari',
    location: 'Portland, USA'
  },
  {
    id: 4,
    name: 'Lisa Anderson',
    email: 'lisa.anderson@email.com',
    type: 'Paid User',
    watchingHours: 19.3,
    status: 'Active',
    lastActive: '2 hours ago',
    device: 'Tablet - Chrome',
    location: 'Phoenix, USA'
  },
  {
    id: 5,
    name: 'Emily Rodriguez',
    email: 'emily.rodriguez@email.com',
    type: 'Paid User',
    watchingHours: 18.6,
    status: 'Active',
    lastActive: '1 hour ago',
    device: 'Desktop - Chrome',
    location: 'Chicago, USA'
  },
];

interface DashboardOverviewProps {
  onNavigate?: (view: string) => void;
}

export default function DashboardOverview({ onNavigate }: DashboardOverviewProps) {
  const handleEventClick = () => {
    if (onNavigate) {
      onNavigate('events');
    }
  };

  const handleUserClick = () => {
    if (onNavigate) {
      onNavigate('users');
    }
  };

  const handleViewerClick = () => {
    if (onNavigate) {
      onNavigate('viewers');
    }
  };

//   const getRoleBadgeColor = (role: string) => {
//     switch (role) {
//       case 'Admin':
//         return 'bg-purple-100 text-purple-800 hover:bg-purple-100';
//       default:
//         return 'bg-gray-100 text-gray-800 hover:bg-gray-100';
//     }
//   };

  const getInitials = (name: string) => {
    const words = name.split(' ');
    return words.map(word => word[0]).join('').toUpperCase().slice(0, 2);
  };

  const getAvatarColor = (type: string) => {
    return type === 'Paid User' 
      ? 'bg-gradient-to-br from-[#B89B5E] to-[#8B7547]' 
      : 'bg-gradient-to-br from-gray-500 to-gray-600';
  };

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
        {metrics.map((metric) => {
          const Icon = metric.icon;
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
        })}
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
                {previousGoLiveEvents.map((event) => (
                  <tr 
                    key={event.id} 
                    className="border-t border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer"
                    onClick={handleEventClick}
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
                        <span className="text-sm">{event.totalViewers.toLocaleString()}</span>
                      </div>
                    </td>
                    <td className="p-4 text-sm text-[#B89B5E]">
                      {event.peakViewers.toLocaleString()}
                    </td>
                    <td className="p-4 text-sm text-[#6B6B6B]">
                      {event.avgWatchTime}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Tables Section */}
      <div className="space-y-6">
        {/* Recent Events Table */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="border-b border-gray-100 pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-[#B89B5E]" />
                Recent Events
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
                    <th className="text-left p-4 text-sm text-[#6B6B6B]">Type</th>
                    <th className="text-left p-4 text-sm text-[#6B6B6B]">Date & Time</th>
                    <th className="text-left p-4 text-sm text-[#6B6B6B]">Status</th>
                    <th className="text-left p-4 text-sm text-[#6B6B6B]">Viewers</th>
                  </tr>
                </thead>
                <tbody>
                  {recentEvents.map((event) => (
                    <tr 
                      key={event.id} 
                      className="border-t border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer"
                      onClick={handleEventClick}
                    >
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <ImageWithFallback
                            src={event.thumbnail}
                            alt={event.name}
                            className="w-12 h-12 rounded-lg object-cover"
                          />
                          <span className="text-sm hover:text-[#B89B5E] transition-colors">{event.name}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
                          {event.type}
                        </Badge>
                      </td>
                      <td className="p-4 text-sm text-[#6B6B6B]">
                        {event.date} • {event.time}
                      </td>
                      <td className="p-4">
                        <Badge className={
                          event.statusColor === 'green' ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-100' :
                          'bg-gray-100 text-gray-800 hover:bg-gray-100'
                        }>
                          {event.statusBadge === 'Live' ? (
                            <span className="flex items-center gap-1.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                              Live
                            </span>
                          ) : event.statusBadge}
                        </Badge>
                      </td>
                      <td className="p-4 text-sm">
                        <div className="flex items-center gap-2">
                          <Eye className="w-4 h-4 text-[#6B6B6B]" />
                          {event.viewers.toLocaleString()}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Admins with Most Hours Table */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="border-b border-gray-100 pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-[#B89B5E]" />
                Admins with Most Watch Hours
              </CardTitle>
              <button
                onClick={handleUserClick}
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
                    <th className="text-left p-4 text-sm text-[#6B6B6B]">Rank</th>
                    <th className="text-left p-4 text-sm text-[#6B6B6B]">Admin</th>
                    <th className="text-left p-4 text-sm text-[#6B6B6B]">Total Hours</th>
                    <th className="text-left p-4 text-sm text-[#6B6B6B]">Events Attended</th>
                    <th className="text-left p-4 text-sm text-[#6B6B6B]">Avg Session</th>
                    <th className="text-left p-4 text-sm text-[#6B6B6B]">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {topUsersByHours.map((user, index) => (
                    <tr 
                      key={user.id} 
                      className="border-t border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer"
                      onClick={handleUserClick}
                    >
                      <td className="p-4">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          index === 0 ? 'bg-[#B89B5E] text-white' :
                          index === 1 ? 'bg-gray-300 text-gray-800' :
                          index === 2 ? 'bg-orange-300 text-orange-900' :
                          'bg-gray-100 text-gray-600'
                        }`}>
                          {index + 1}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <ImageWithFallback
                            src={user.avatar}
                            alt={user.name}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                          <div>
                            <p className="text-sm hover:text-[#B89B5E] transition-colors">{user.name}</p>
                            <p className="text-xs text-[#6B6B6B]">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-[#B89B5E]" />
                          <span className="text-sm">{user.totalHours}h</span>
                        </div>
                      </td>
                      <td className="p-4 text-sm text-[#6B6B6B]">
                        {user.eventsAttended}
                      </td>
                      <td className="p-4 text-sm text-[#6B6B6B]">
                        {user.avgSessionTime}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-emerald-400" />
                          <span className="text-sm text-emerald-700">{user.status}</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Top Viewers by Watch Hours Table */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="border-b border-gray-100 pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Eye className="w-5 h-5 text-[#B89B5E]" />
                Top Viewers by Watch Hours
              </CardTitle>
              <button
                onClick={handleViewerClick}
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
                    <th className="text-left p-4 text-sm text-[#6B6B6B]">Rank</th>
                    <th className="text-left p-4 text-sm text-[#6B6B6B]">Viewer</th>
                    <th className="text-left p-4 text-sm text-[#6B6B6B]">Type</th>
                    <th className="text-left p-4 text-sm text-[#6B6B6B]">Watch Hours</th>
                    <th className="text-left p-4 text-sm text-[#6B6B6B]">Device</th>
                    <th className="text-left p-4 text-sm text-[#6B6B6B]">Location</th>
                    <th className="text-left p-4 text-sm text-[#6B6B6B]">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {topViewersByHours.map((viewer, index) => (
                    <tr 
                      key={viewer.id} 
                      className="border-t border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer"
                      onClick={handleViewerClick}
                    >
                      <td className="p-4">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          index === 0 ? 'bg-[#B89B5E] text-white' :
                          index === 1 ? 'bg-gray-300 text-gray-800' :
                          index === 2 ? 'bg-orange-300 text-orange-900' :
                          'bg-gray-100 text-gray-600'
                        }`}>
                          {index + 1}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getAvatarColor(viewer.type)}`}>
                            <span className="text-white text-sm">
                              {getInitials(viewer.name)}
                            </span>
                          </div>
                          <div>
                            <p className="text-sm hover:text-[#B89B5E] transition-colors">{viewer.name}</p>
                            <p className="text-xs text-[#6B6B6B]">{viewer.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <Badge className={
                          viewer.type === 'Paid User' 
                            ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-100' 
                            : 'bg-gray-100 text-gray-800 hover:bg-gray-100'
                        }>
                          {viewer.type}
                        </Badge>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-[#B89B5E]" />
                          <span className="text-sm">{viewer.watchingHours}h</span>
                        </div>
                      </td>
                      <td className="p-4 text-sm text-[#6B6B6B]">
                        {viewer.device}
                      </td>
                      <td className="p-4 text-sm text-[#6B6B6B]">
                        {viewer.location}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${viewer.status === 'Active' ? 'bg-green-500' : 'bg-gray-400'}`} />
                          <span className={`text-sm ${viewer.status === 'Active' ? 'text-green-800' : 'text-gray-600'}`}>
                            {viewer.status}
                          </span>
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
    </div>
  );
}