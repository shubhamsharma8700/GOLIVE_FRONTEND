import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { Plus, Search, Eye, Filter, Calendar as CalendarIcon, ArrowLeft, CheckCircle2, XCircle, Shield, Users as UsersIcon, Video, Info, Trash2, Upload, Settings } from 'lucide-react';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Switch } from '../components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import { toast } from 'sonner';

const events = [
  { id: 1, name: 'Tech Conference 2025', date: '2025-03-15', time: '10:00 AM', status: 'upcoming', viewers: 1200 },
  { id: 2, name: 'Product Launch Stream', date: '2025-02-28', time: '2:00 PM', status: 'live', viewers: 3456 },
  { id: 3, name: 'Gaming Tournament', date: '2025-02-20', time: '6:00 PM', status: 'completed', viewers: 8932 },
  { id: 4, name: 'Music Festival Live', date: '2025-04-10', time: '8:00 PM', status: 'upcoming', viewers: 0 },
  { id: 5, name: 'Sports Match Stream', date: '2025-02-25', time: '7:30 PM', status: 'live', viewers: 5621 },
  { id: 6, name: 'Educational Webinar', date: '2025-02-18', time: '11:00 AM', status: 'completed', viewers: 2341 },
];

interface RegistrationField {
  id: string;
  label: string;
  type: string;
  required: boolean;
}

interface EventManagementProps {
  isCreatingEvent: boolean;
  setIsCreatingEvent: (value: boolean) => void;
  onNavigate: (view: string) => void;
  onCreateEvent: () => void;
}

export function EventManagement({ isCreatingEvent, setIsCreatingEvent, onNavigate, onCreateEvent }: EventManagementProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isViewingEvent, setIsViewingEvent] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    startTime: '',
    endTime: '',
    accessMode: 'open',
    paymentFlag: false,
    status: 'scheduled',
    primarySource: '',
    backupSource: '',
    automationFlag: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });

  const [registrationFields, setRegistrationFields] = useState<RegistrationField[]>([
    { id: '1', label: 'User ID', type: 'text', required: true },
    { id: '2', label: 'Email', type: 'email', required: true },
    { id: '3', label: 'Event ID', type: 'text', required: true },
  ]);

  const filteredEvents = events.filter(event =>
    event.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateEvent = () => {
    setIsCreatingEvent(true);
    setIsViewingEvent(false);
    setFormData({
      ...formData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    onCreateEvent();
  };

  const handleViewEvent = (event: typeof events[0]) => {
    setIsCreatingEvent(true);
    setIsViewingEvent(true);
    onNavigate('events'); // Navigate to events view so sidebar highlights
    setFormData({
      name: event.name,
      description: '',
      startTime: `${event.date}T${event.time}`,
      endTime: '',
      accessMode: 'open',
      paymentFlag: false,
      status: event.status === 'upcoming' ? 'scheduled' : event.status === 'live' ? 'live' : 'completed',
      primarySource: 'arn:aws:medialive:us-east-1:123456789012:channel:1234567',
      backupSource: '',
      automationFlag: true,
      createdAt: new Date(event.date).toISOString(),
      updatedAt: new Date().toISOString(),
    });
  };

  const handleBackToList = () => {
    onNavigate('events');
    setIsCreatingEvent(false);
    setIsViewingEvent(false);
    setFormData({
      name: '',
      description: '',
      startTime: '',
      endTime: '',
      accessMode: 'open',
      paymentFlag: false,
      status: 'scheduled',
      primarySource: '',
      backupSource: '',
      automationFlag: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  };

  const handlePublishEvent = () => {
    toast.success('Event published successfully!');
    onNavigate('events');
    setIsCreatingEvent(false);
  };

  const handleDeleteEvent = (eventName: string) => {
    toast.success(`${eventName} deleted successfully`);
  };

  const handleAccessModeChange = (value: string) => {
    setFormData({
      ...formData,
      accessMode: value,
      paymentFlag: value === 'payment',
      updatedAt: new Date().toISOString(),
    });
  };

  const handleAddRegistrationField = () => {
    const newField: RegistrationField = {
      id: Date.now().toString(),
      label: '',
      type: 'text',
      required: false,
    };
    setRegistrationFields([...registrationFields, newField]);
  };

  const handleRemoveRegistrationField = (id: string) => {
    setRegistrationFields(registrationFields.filter(field => field.id !== id));
  };

  const handleUpdateRegistrationField = (id: string, key: keyof RegistrationField, value: string | boolean) => {
    setRegistrationFields(registrationFields.map(field =>
      field.id === id ? { ...field, [key]: value } : field
    ));
  };

  // Event Creation Dashboard
  if (isCreatingEvent) {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            onClick={handleBackToList}
            className="border-gray-300"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Events
          </Button>
          <div className="flex-1">
            <h1 className="text-2xl mb-1">
              {isViewingEvent ? 'Event Management Dashboard' : 'Create New Event'}
            </h1>
            <p className="text-[#6B6B6B]">
              {isViewingEvent ? 'View and manage event configuration' : 'Add details to create a new streaming event'}
            </p>
          </div>
        </div>

        {/* Tabbed Interface */}
        <Tabs defaultValue="details" className="space-y-6">
          <TabsList className="bg-white border">
            <TabsTrigger value="details" className="data-[state=active]:bg-[#B89B5E] data-[state=active]:text-white">
              <Info className="w-4 h-4 mr-2" />
              Event Details
            </TabsTrigger>
            {isViewingEvent && (
              <TabsTrigger value="sources" className="data-[state=active]:bg-[#B89B5E] data-[state=active]:text-white">
                <Video className="w-4 h-4 mr-2" />
                Video Sources
              </TabsTrigger>
            )}
            <TabsTrigger value="video-config" className="data-[state=active]:bg-[#B89B5E] data-[state=active]:text-white">
              <Settings className="w-4 h-4 mr-2" />
              Video Configuration
            </TabsTrigger>
            <TabsTrigger value="security" className="data-[state=active]:bg-[#B89B5E] data-[state=active]:text-white">
              <Shield className="w-4 h-4 mr-2" />
              Access & Security
            </TabsTrigger>
          </TabsList>

          {/* Event Details Tab */}
          <TabsContent value="details">
            <Card className="border-0 shadow-sm">
              <CardHeader className="border-b border-gray-100">
                <CardTitle>Event Information</CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="event-name">Event Name (title)</Label>
                    <Input
                      id="event-name"
                      placeholder="Enter event name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value, updatedAt: new Date().toISOString() })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value, updatedAt: new Date().toISOString() })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="scheduled">Scheduled</SelectItem>
                        <SelectItem value="live">Live</SelectItem>
                        <SelectItem value="vod">VOD</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* VOD Upload Section */}
                {formData.status === 'vod' && (
                  <div className="p-6 border-2 border-dashed border-[#B89B5E]/30 rounded-lg bg-[#B89B5E]/5">
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-[#B89B5E]/20 flex items-center justify-center">
                          <Video className="w-5 h-5 text-[#B89B5E]" />
                        </div>
                        <div>
                          <h4 className="mb-1">Video On Demand (VOD) Upload</h4>
                          <p className="text-sm text-[#6B6B6B]">Upload a pre-recorded video file for on-demand streaming</p>
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <Label htmlFor="video-upload">Video File</Label>
                        <div className="flex items-center gap-3">
                          <Input
                            id="video-upload"
                            type="file"
                            accept="video/*"
                            className="flex-1"
                          />
                          <Button className="bg-[#B89B5E] text-white hover:bg-[#A28452]">
                            <Upload className="w-4 h-4 mr-2" />
                            Upload
                          </Button>
                        </div>
                        <p className="text-xs text-[#6B6B6B]">
                          Supported formats: MP4, MOV, AVI, MKV • Max size: 5GB
                        </p>
                      </div>

                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                        <div className="flex gap-2">
                          <Info className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                          <p className="text-xs text-blue-800">
                            VOD files will be processed and stored in AWS S3, then distributed via CloudFront CDN for optimal playback performance.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Enter event description"
                    rows={4}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value, updatedAt: new Date().toISOString() })}
                  />
                </div>

                {/* Start Time and End Time - Hidden for VOD */}
                {formData.status !== 'vod' && (
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="start-time">Start Time (dateTime)</Label>
                      <Input
                        id="start-time"
                        type="datetime-local"
                        value={formData.startTime}
                        onChange={(e) => setFormData({ ...formData, startTime: e.target.value, updatedAt: new Date().toISOString() })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="end-time">End Time</Label>
                      <Input
                        id="end-time"
                        type="datetime-local"
                        value={formData.endTime}
                        onChange={(e) => setFormData({ ...formData, endTime: e.target.value, updatedAt: new Date().toISOString() })}
                      />
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <Label>Payment Flag (paymentFlag)</Label>
                  <div className="flex items-center h-10 px-3 border rounded-lg bg-gray-50">
                    <Badge className={formData.paymentFlag ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                      {formData.paymentFlag ? 'Enabled' : 'Disabled'}
                    </Badge>
                    <span className="ml-2 text-sm text-[#6B6B6B]">
                      {formData.paymentFlag ? 'Payment required' : 'No payment required'}
                    </span>
                  </div>
                </div>

                <div className="border-t pt-6">
                  <h3 className="mb-4 text-sm text-[#6B6B6B]">Metadata</h3>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label>Created At</Label>
                      <Input
                        value={formData.createdAt}
                        disabled
                        className="bg-gray-50 font-mono text-sm"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Updated At</Label>
                      <Input
                        value={formData.updatedAt}
                        disabled
                        className="bg-gray-50 font-mono text-sm"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Video Sources Tab */}
          <TabsContent value="sources">
            <Card className="border-0 shadow-sm">
              <CardHeader className="border-b border-gray-100">
                <CardTitle>AWS MediaLive Configuration</CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                {/* Primary Source */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="mb-1">Primary Source</h3>
                      <p className="text-sm text-[#6B6B6B]">Configure the primary AWS MediaLive Channel</p>
                    </div>
                    <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                      <CheckCircle2 className="w-3 h-3 mr-1" />
                      Connected
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="primary-source">MediaLive Channel ID or ARN</Label>
                    <Input
                      id="primary-source"
                      placeholder="e.g., arn:aws:medialive:us-east-1:123456789012:channel:1234567"
                      value={formData.primarySource}
                      onChange={(e) => setFormData({ ...formData, primarySource: e.target.value, updatedAt: new Date().toISOString() })}
                      className="font-mono text-sm"
                    />
                    <p className="text-xs text-[#6B6B6B]">
                      When saved, this will be mapped to → streamUrl (CloudFront HLS URL)
                    </p>
                  </div>
                </div>

                <div className="border-t border-gray-100 pt-6" />

                {/* Backup Source */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="mb-1">Backup Source</h3>
                      <p className="text-sm text-[#6B6B6B]">Configure a backup AWS MediaLive Channel for redundancy</p>
                    </div>
                    <Badge className={formData.backupSource ? 'bg-green-100 text-green-800 hover:bg-green-100' : 'bg-gray-100 text-gray-800 hover:bg-gray-100'}>
                      {formData.backupSource ? (
                        <>
                          <CheckCircle2 className="w-3 h-3 mr-1" />
                          Configured
                        </>
                      ) : (
                        <>
                          <XCircle className="w-3 h-3 mr-1" />
                          Not Configured
                        </>
                      )}
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="backup-source">MediaLive Channel ID or ARN</Label>
                    <Input
                      id="backup-source"
                      placeholder="Optional backup channel"
                      value={formData.backupSource}
                      onChange={(e) => setFormData({ ...formData, backupSource: e.target.value, updatedAt: new Date().toISOString() })}
                      className="font-mono text-sm"
                    />
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex gap-3">
                    <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-sm text-blue-900 mb-1">AWS MediaLive Integration</h4>
                      <p className="text-sm text-blue-800">
                        Ensure your AWS MediaLive channels are properly configured and running. The system will automatically generate CloudFront HLS URLs for stream delivery.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Video Configuration Tab */}
          <TabsContent value="video-config">
            <Card className="border-0 shadow-sm">
              <CardHeader className="border-b border-gray-100">
                <CardTitle>Video Configuration</CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                {/* Video Quality Settings */}
                <div className="space-y-4">
                  <div>
                    <h3 className="mb-1">Video Quality Settings</h3>
                    <p className="text-sm text-[#6B6B6B]">
                      Configure basic video streaming parameters
                    </p>
                  </div>

                  <div className="grid grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="video-resolution">Resolution</Label>
                      <Select defaultValue="1080p">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="2160p">2160p (4K)</SelectItem>
                          <SelectItem value="1080p">1080p (Full HD)</SelectItem>
                          <SelectItem value="720p">720p (HD)</SelectItem>
                          <SelectItem value="480p">480p (SD)</SelectItem>
                          <SelectItem value="360p">360p</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="frame-rate">Frame Rate</Label>
                      <Select defaultValue="30">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="60">60 fps</SelectItem>
                          <SelectItem value="30">30 fps</SelectItem>
                          <SelectItem value="24">24 fps</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="video-bitrate">Bitrate</Label>
                      <Select defaultValue="medium">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="high">High</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="low">Low</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <div className="border-t pt-6" />

                {/* Pixel Selection - Optional */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="mb-1">Tracking Pixels (Optional)</h3>
                      <p className="text-sm text-[#6B6B6B]">
                        Add tracking pixels for analytics if required
                      </p>
                    </div>
                    <Badge variant="secondary" className="bg-gray-100 text-gray-600">Optional</Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="pixel-provider">Pixel Provider</Label>
                      <Select defaultValue="none">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">None</SelectItem>
                          <SelectItem value="facebook">Facebook Pixel</SelectItem>
                          <SelectItem value="google">Google Analytics 4</SelectItem>
                          <SelectItem value="linkedin">LinkedIn Insight Tag</SelectItem>
                          <SelectItem value="twitter">Twitter/X Pixel</SelectItem>
                          <SelectItem value="custom">Custom Pixel</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="pixel-id">Pixel ID / Tracking Code</Label>
                      <Input
                        id="pixel-id"
                        placeholder="Enter pixel ID or tracking code"
                        className="font-mono text-sm"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Access & Security Tab */}
          <TabsContent value="security">
            <Card className="border-0 shadow-sm">
              <CardHeader className="border-b border-gray-100">
                <CardTitle>Access Control & Automation</CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="access-type">Access Type (configJSON)</Label>
                  <Select value={formData.accessMode} onValueChange={handleAccessModeChange}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="open">Open Access</SelectItem>
                      <SelectItem value="email">Email Required</SelectItem>
                      <SelectItem value="password">Password Protected</SelectItem>
                      <SelectItem value="payment">Payment Access</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-[#6B6B6B]">
                    {formData.accessMode === 'open' && 'Anyone can access this event without restrictions.'}
                    {formData.accessMode === 'email' && 'Users must provide email address to access.'}
                    {formData.accessMode === 'password' && 'Users must enter password to access.'}
                    {formData.accessMode === 'payment' && 'Users must complete payment to access.'}
                  </p>
                </div>

                {formData.accessMode === 'password' && (
                  <div className="space-y-2">
                    <Label htmlFor="event-password">Event Password</Label>
                    <Input
                      id="event-password"
                      type="password"
                      placeholder="Enter password for event access"
                    />
                  </div>
                )}

                {formData.accessMode === 'payment' && (
                  <div className="space-y-4 p-4 border rounded-lg bg-[#B89B5E]/5">
                    <div className="flex items-center gap-2">
                      <Badge className="bg-[#B89B5E] text-white">Payment Enabled</Badge>
                      <span className="text-sm text-[#6B6B6B]">Configure payment settings below</span>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="payment-amount">Amount</Label>
                        <Input
                          id="payment-amount"
                          type="number"
                          placeholder="99.00"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="payment-currency">Currency</Label>
                        <Select defaultValue="usd">
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="usd">USD</SelectItem>
                            <SelectItem value="eur">EUR</SelectItem>
                            <SelectItem value="gbp">GBP</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                )}

                <div className="border-t pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="mb-1">Automation Flag (automationFlag)</h4>
                      <p className="text-sm text-[#6B6B6B]">
                        Enable event automation triggers via EventBridge/Lambda
                      </p>
                    </div>
                    <Switch
                      checked={formData.automationFlag}
                      onCheckedChange={(checked) => setFormData({ ...formData, automationFlag: checked, updatedAt: new Date().toISOString() })}
                    />
                  </div>
                </div>

                {formData.automationFlag && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex gap-3">
                      <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="text-sm text-green-900 mb-1">Automation Enabled</h4>
                        <p className="text-sm text-green-800">
                          Event will automatically trigger AWS EventBridge rules and Lambda functions for stream management, notifications, and analytics.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Registration Form - Show only when Email Required is selected */}
                {(formData.accessMode === 'email' || formData.accessMode === 'password') && (
                  <div className="border-t pt-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="mb-1 flex items-center gap-2">
                            <UsersIcon className="w-4 h-4 text-[#B89B5E]" />
                            Custom Registration Fields
                          </h4>
                          <p className="text-sm text-[#6B6B6B]">
                            Configure fields to collect user information during {formData.accessMode === 'email' ? 'email' : 'password-protected'} registration
                          </p>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-[#B89B5E] text-[#B89B5E]"
                          onClick={handleAddRegistrationField}
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Add Field
                        </Button>
                      </div>

                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                        <div className="flex gap-2">
                          <Info className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                          <p className="text-xs text-blue-800">
                            These fields are linked with the Users Table and will be required during event registration. Default fields (User ID, Email, Event ID) cannot be modified.
                          </p>
                        </div>
                      </div>

                      <div className="space-y-3">
                        {registrationFields.map((field, index) => (
                          <div key={field.id} className="p-4 border rounded-lg bg-gray-50">
                            <div className="flex items-start gap-4">
                              <div className="flex-1 grid grid-cols-3 gap-4">
                                <div className="space-y-2">
                                  <Label className="text-xs">Field Label</Label>
                                  <Input
                                    value={field.label}
                                    onChange={(e) => handleUpdateRegistrationField(field.id, 'label', e.target.value)}
                                    placeholder="Field name"
                                    disabled={index < 3}
                                    className="h-9"
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label className="text-xs">Field Type</Label>
                                  <Select
                                    value={field.type}
                                    onValueChange={(value) => handleUpdateRegistrationField(field.id, 'type', value)}
                                    disabled={index < 3}
                                  >
                                    <SelectTrigger className="h-9">
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="text">Text</SelectItem>
                                      <SelectItem value="email">Email</SelectItem>
                                      <SelectItem value="tel">Phone</SelectItem>
                                      <SelectItem value="number">Number</SelectItem>
                                      <SelectItem value="date">Date</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div className="space-y-2">
                                  <Label className="text-xs">Required</Label>
                                  <div className="flex items-center h-9">
                                    <Switch
                                      checked={field.required}
                                      onCheckedChange={(checked) => handleUpdateRegistrationField(field.id, 'required', checked)}
                                      disabled={index < 3}
                                    />
                                    <span className="ml-3 text-xs text-[#6B6B6B]">
                                      {field.required ? 'Required' : 'Optional'}
                                    </span>
                                  </div>
                                </div>
                              </div>
                              {index >= 3 && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleRemoveRegistrationField(field.id)}
                                  className="text-red-500 hover:text-red-700 hover:bg-red-50 h-9 w-9 p-0"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              )}
                            </div>
                            {index < 3 && (
                              <p className="text-xs text-[#6B6B6B] mt-2">
                                {field.label === 'User ID' && '→ Unique identifier automatically generated'}
                                {field.label === 'Email' && '→ Required for login and event access notifications'}
                                {field.label === 'Event ID' && '→ Auto-associated from created event'}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>

                      {registrationFields.length === 3 && (
                        <div className="text-center py-6 border-2 border-dashed rounded-lg">
                          <p className="text-xs text-[#6B6B6B] mb-3">
                            Add custom fields to collect additional user information
                          </p>
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-[#B89B5E] text-[#B89B5E]"
                            onClick={handleAddRegistrationField}
                          >
                            <Plus className="w-4 h-4 mr-2" />
                            Add Custom Field
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 pt-6 border-t">
          <Button variant="outline" onClick={handleBackToList}>
            Cancel
          </Button>
          <Button variant="outline" className="border-[#B89B5E] text-[#B89B5E]">
            Save as Draft
          </Button>
          <Button className="bg-[#B89B5E] text-white hover:bg-[#A28452]" onClick={handlePublishEvent}>
            Publish Event
          </Button>
        </div>
      </div>
    );
  }

  // Events List View
  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <div className="relative max-w-2xl">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
        <Input
          type="search"
          placeholder="Search events by name..."
          className="pl-10 bg-white"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl mb-1">Event Management</h1>
          <p className="text-[#6B6B6B]">Create, edit, and manage all streaming events</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="border-[#B89B5E] text-[#B89B5E]">
            <Filter className="w-4 h-4 mr-2" />
            Filters
          </Button>
          <Button 
            className="bg-[#B89B5E] text-white hover:bg-[#A28452]"
            onClick={handleCreateEvent}
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Event
          </Button>
        </div>
      </div>

      {/* Events Table */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="border-b border-gray-100">
          <CardTitle>All Events ({filteredEvents.length})</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left p-4 text-sm text-[#B89B5E]">Event Name</th>
                  <th className="text-left p-4 text-sm text-[#B89B5E]">Date & Time</th>
                  <th className="text-left p-4 text-sm text-[#B89B5E]">Status</th>
                  <th className="text-left p-4 text-sm text-[#B89B5E]">Viewers</th>
                  <th className="text-left p-4 text-sm text-[#B89B5E]">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredEvents.map((event) => (
                  <tr key={event.id} className="border-t border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-[#B89B5E]/10 flex items-center justify-center">
                          <CalendarIcon className="w-5 h-5 text-[#B89B5E]" />
                        </div>
                        <span>{event.name}</span>
                      </div>
                    </td>
                    <td className="p-4 text-[#6B6B6B]">
                      {new Date(event.date).toLocaleDateString()} • {event.time}
                    </td>
                    <td className="p-4">
                      <Badge className={
                        event.status === 'live' ? 'bg-green-100 text-green-800 hover:bg-green-100' :
                        event.status === 'upcoming' ? 'bg-blue-100 text-blue-800 hover:bg-blue-100' :
                        'bg-gray-100 text-gray-800 hover:bg-gray-100'
                      }>
                        {event.status === 'live' ? (
                          <span className="flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                            Live
                          </span>
                        ) : event.status === 'upcoming' ? 'Upcoming' : 'Completed'}
                      </Badge>
                    </td>
                    <td className="p-4 text-[#6B6B6B]">
                      {event.viewers.toLocaleString()}
                    </td>
                    <td className="p-4">
                      <Button 
                        size="sm" 
                        className="bg-[#B89B5E] text-white hover:bg-[#A28452]"
                        onClick={() => handleViewEvent(event)}
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        View Event
                      </Button>
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