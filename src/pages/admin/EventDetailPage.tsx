import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';

// Separator component - simple div if not available
const Separator = () => <div className="border-t border-gray-200 dark:border-gray-700 my-4" />;

import {
  Loader2,
  AlertCircle,
  ArrowLeft,
  Edit,
  Power,
  PowerOff,
  Copy,
  Calendar,
  Clock,
  Globe,
  Lock,
  DollarSign,
  Link as LinkIcon,
  Video,
} from 'lucide-react';
import { eventApi } from '@/utils/api';
import { formatLocalTime, getUserTimezone } from '@/utils/timezone';
import { EditEvent } from '@/components/admin/EditEvent';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';

interface EventDetail {
  eventId: string;
  title: string;
  description?: string;
  startTime: string;
  endTime?: string;
  accessMode: 'open' | 'email' | 'password' | 'payment';
  password?: string;
  paymentAmount?: number;
  status?: string;
  channelId?: string;
  rtmpUrl?: string;
  rtmpStreamKey?: string;
  cloudFrontUrl?: string;
  cloudfrontUrl?: string;
  updatedAt?: string;
}

export const EventDetailPage: React.FC = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const navigate = useNavigate();
  const [event, setEvent] = useState<EventDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [channelLoading, setChannelLoading] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  useEffect(() => {
    if (eventId) {
      loadEventDetails();
    }
  }, [eventId]);

  const loadEventDetails = async () => {
  try {
    setLoading(true);
    setError(null);

    const response = await eventApi.getEvent(eventId!);
    const eventData = response.event || response;

    // --- FIX RTMP URL / KEY EXTRACTION ---
    let rtmpUrl = null;
    let rtmpStreamKey = null;

    if (eventData.rtmpInputUrl) {
      // Example: rtmp://13.204.106.225:1935/live/de7b2ad3-80d7-4080-9e43-085ffc1b3bfb
      const lastSlashIndex = eventData.rtmpInputUrl.lastIndexOf("/");
      rtmpUrl = eventData.rtmpInputUrl.substring(0, lastSlashIndex);
      rtmpStreamKey = eventData.rtmpInputUrl.substring(lastSlashIndex + 1);
    }

    setEvent({
      eventId: eventData.eventId || eventData.id,
      title: eventData.title || eventData.name,
      description: eventData.description,
      startTime: eventData.startTime,
      endTime: eventData.endTime,
      accessMode: eventData.accessMode || "open",
      password: eventData.password,
      paymentAmount: eventData.paymentAmount,
      status: eventData.status,
      channelId: eventData.channelId,

      // --- USE FIXED VALUES ---
      rtmpUrl,
      rtmpStreamKey,

      cloudFrontUrl: eventData.cloudFrontUrl || eventData.cloudfrontUrl,
      updatedAt: eventData.updatedAt,
    });
  } catch (err: any) {
    setError(err.response?.data?.message || "Failed to load event details");
  } finally {
    setLoading(false);
  }
};


  const handleStartChannel = async () => {
    if (!event?.channelId) {
      alert('No channel ID available for this event');
      return;
    }
    
    if (!confirm('Are you sure you want to start this channel?')) return;
    
    try {
      setChannelLoading(true);
      await eventApi.startChannel(event.channelId);
      alert('Channel started successfully!');
      loadEventDetails(); // Refresh to update status
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to start channel');
    } finally {
      setChannelLoading(false);
    }
  };

  const handleStopChannel = async () => {
    if (!event?.channelId) {
      alert('No channel ID available for this event');
      return;
    }
    
    if (!confirm('Are you sure you want to stop this channel?')) return;
    
    try {
      setChannelLoading(true);
      await eventApi.stopChannel(event.channelId);
      alert('Channel stopped successfully!');
      loadEventDetails(); // Refresh to update status
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to stop channel');
    } finally {
      setChannelLoading(false);
    }
  };

  const copyToClipboard = async (text: string, fieldName: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(fieldName);
      setTimeout(() => setCopiedField(null), 2000);
    } catch (err) {
      alert('Failed to copy to clipboard');
    }
  };

  const getStatusBadge = (status?: string) => {
    if (!status) return null;
    
    const statusLower = status.toLowerCase();
    const variants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
      scheduled: 'secondary',
      'ready for live': 'secondary',
      live: 'default',
      running: 'default',
      failed: 'destructive',
      ended: 'destructive',
      stopped: 'destructive',
      vod: 'outline',
    };
    
    const variant = variants[statusLower] || 'secondary';
    return <Badge variant={variant}>{status.toUpperCase()}</Badge>;
  };

  const getAccessModeBadge = (mode: string) => {
    const icons = {
      open: <Globe className="w-3 h-3" />,
      email: <Lock className="w-3 h-3" />,
      password: <Lock className="w-3 h-3" />,
      payment: <DollarSign className="w-3 h-3" />,
    };
    
    return (
      <Badge variant="outline" className="flex items-center gap-1">
        {icons[mode as keyof typeof icons]}
        {mode.charAt(0).toUpperCase() + mode.slice(1)} Access
      </Badge>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Alert variant="destructive" className="max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error || 'Event not found'}</AlertDescription>
        </Alert>
      </div>
    );
  }

  const fullRtmpUrl = event.rtmpUrl && event.rtmpStreamKey 
    ? `${event.rtmpUrl}/${event.rtmpStreamKey}`
    : event.rtmpUrl || event.rtmpStreamKey;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => navigate('/admin/dashboard')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
            <div>
              <h1 className="text-3xl font-bold">{event.title}</h1>
              <p className="text-sm text-gray-500 mt-1">Event ID: {event.eventId}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {getStatusBadge(event.status)}
            {getAccessModeBadge(event.accessMode)}
            <Button variant="outline" onClick={() => setShowEditDialog(true)}>
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </Button>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Event Information */}
          <Card>
            <CardHeader>
              <CardTitle>Event Information</CardTitle>
              <CardDescription>Basic event details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Description</label>
                <p className="mt-1">{event.description || 'No description provided'}</p>
              </div>
              
              <Separator />
              
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <div>
                    <label className="text-sm font-medium text-gray-500">Start Time</label>
                    <p className="text-sm">
                      {formatLocalTime(event.startTime, {
                        dateStyle: 'full',
                        timeStyle: 'short',
                      })}
                    </p>
                    <p className="text-xs text-gray-400">UTC: {new Date(event.startTime).toISOString()}</p>
                  </div>
                </div>
                
                {event.endTime && (
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <div>
                      <label className="text-sm font-medium text-gray-500">End Time</label>
                      <p className="text-sm">
                        {formatLocalTime(event.endTime, {
                          dateStyle: 'full',
                          timeStyle: 'short',
                        })}
                      </p>
                      <p className="text-xs text-gray-400">UTC: {new Date(event.endTime).toISOString()}</p>
                    </div>
                  </div>
                )}
              </div>

              <Separator />

              <div>
                <label className="text-sm font-medium text-gray-500">Access Mode</label>
                <div className="mt-1">{getAccessModeBadge(event.accessMode)}</div>
                {event.accessMode === 'password' && event.password && (
                  <p className="text-sm mt-2">Password: {event.password}</p>
                )}
                {event.accessMode === 'payment' && event.paymentAmount && (
                  <p className="text-sm mt-2">Amount: ${event.paymentAmount.toFixed(2)}</p>
                )}
              </div>

              {event.updatedAt && (
                <>
                  <Separator />
                  <div>
                    <label className="text-sm font-medium text-gray-500">Last Updated</label>
                    <p className="text-sm mt-1">
                      {formatLocalTime(event.updatedAt, {
                        dateStyle: 'short',
                        timeStyle: 'short',
                      })}
                    </p>
                  </div>
                </>
              )}

              <div>
                <label className="text-sm font-medium text-gray-500">Your Timezone</label>
                <p className="text-sm mt-1">{getUserTimezone()}</p>
              </div>
            </CardContent>
          </Card>

          {/* Channel & Streaming Information */}
          <Card>
            <CardHeader>
              <CardTitle>Channel & Streaming</CardTitle>
              <CardDescription>RTMP and playback information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {event.channelId ? (
                <>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Channel ID</label>
                    <div className="flex items-center gap-2 mt-1">
                      <code className="text-sm bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded flex-1">
                        {event.channelId}
                      </code>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => copyToClipboard(event.channelId!, 'channelId')}
                      >
                        <Copy className="w-3 h-3 mr-1" />
                        {copiedField === 'channelId' ? 'Copied!' : 'Copy'}
                      </Button>
                    </div>
                  </div>

                  <Separator />

                  {/* Channel Control Buttons */}
                  <div className="flex gap-2">
                    <Button
                      variant="default"
                      onClick={handleStartChannel}
                      disabled={channelLoading}
                      className="flex-1"
                    >
                      {channelLoading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <>
                          <Power className="w-4 h-4 mr-2" />
                          Start Channel
                        </>
                      )}
                    </Button>
                    <Button
                      variant="secondary"
                      onClick={handleStopChannel}
                      disabled={channelLoading}
                      className="flex-1"
                    >
                      {channelLoading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <>
                          <PowerOff className="w-4 h-4 mr-2" />
                          Stop Channel
                        </>
                      )}
                    </Button>
                  </div>

                  <Separator />
                </>
              ) : (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>No channel ID available for this event</AlertDescription>
                </Alert>
              )}

              {/* RTMP URL */}
              {event.rtmpUrl && (
                <div>
                  <label className="text-sm font-medium text-gray-500 flex items-center gap-2">
                    <LinkIcon className="w-4 h-4" />
                    RTMP Server URL
                  </label>
                  <div className="flex items-center gap-2 mt-1">
                    <code className="text-sm bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded flex-1 break-all">
                      {event.rtmpUrl}
                    </code>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => copyToClipboard(event.rtmpUrl!, 'rtmpUrl')}
                    >
                      <Copy className="w-3 h-3 mr-1" />
                      {copiedField === 'rtmpUrl' ? 'Copied!' : 'Copy'}
                    </Button>
                  </div>
                </div>
              )}

              {/* RTMP Stream Key */}
              {event.rtmpStreamKey && (
                <div>
                  <label className="text-sm font-medium text-gray-500 flex items-center gap-2">
                    <Video className="w-4 h-4" />
                    RTMP Stream Key
                  </label>
                  <div className="flex items-center gap-2 mt-1">
                    <code className="text-sm bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded flex-1 break-all">
                      {event.rtmpStreamKey}
                    </code>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => copyToClipboard(event.rtmpStreamKey!, 'rtmpStreamKey')}
                    >
                      <Copy className="w-3 h-3 mr-1" />
                      {copiedField === 'rtmpStreamKey' ? 'Copied!' : 'Copy'}
                    </Button>
                  </div>
                </div>
              )}

              {/* Full RTMP URL */}
              {fullRtmpUrl && (
                <>
                  <Separator />
                  <div>
                    <label className="text-sm font-medium text-gray-500">Full RTMP URL</label>
                    <p className="text-xs text-gray-400 mb-1">Use this in your streaming software</p>
                    <div className="flex items-center gap-2 mt-1">
                      <code className="text-sm bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded flex-1 break-all">
                        {fullRtmpUrl}
                      </code>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => copyToClipboard(fullRtmpUrl, 'fullRtmpUrl')}
                      >
                        <Copy className="w-3 h-3 mr-1" />
                        {copiedField === 'fullRtmpUrl' ? 'Copied!' : 'Copy'}
                      </Button>
                    </div>
                  </div>
                </>
              )}

              {/* CloudFront URL */}
              {(event.cloudFrontUrl || event.cloudfrontUrl) && (
                <>
                  <Separator />
                  <div>
                    <label className="text-sm font-medium text-gray-500">Playback URL</label>
                    <div className="flex items-center gap-2 mt-1">
                      <code className="text-sm bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded flex-1 break-all">
                        {event.cloudFrontUrl || event.cloudfrontUrl}
                      </code>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => copyToClipboard(event.cloudFrontUrl || event.cloudfrontUrl || '', 'playbackUrl')}
                      >
                        <Copy className="w-3 h-3 mr-1" />
                        {copiedField === 'playbackUrl' ? 'Copied!' : 'Copy'}
                      </Button>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Edit Event Dialog */}
        <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Event</DialogTitle>
              <DialogDescription>Update event details</DialogDescription>
            </DialogHeader>
            <EditEvent
              eventId={event.eventId}
              initialData={{
                title: event.title,
                description: event.description,
                startTime: event.startTime,
                endTime: event.endTime,
                accessMode: event.accessMode,
                password: event.password,
                paymentAmount: event.paymentAmount,
              }}
              onSuccess={() => {
                setShowEditDialog(false);
                loadEventDetails();
              }}
              onCancel={() => setShowEditDialog(false)}
            />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

