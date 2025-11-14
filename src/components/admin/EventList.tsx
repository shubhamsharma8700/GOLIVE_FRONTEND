// Updated EventList component with API mapping

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  Play,
  Trash2,
  Loader2,
  AlertCircle,
  Plus,
  Eye,
  Code,
  Copy,
  Edit,
  Power,
  PowerOff,
  Info,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { eventApi } from '@/utils/api';
import { CreateEvent } from './CreateEvent';
import { EditEvent } from './EditEvent';
import { VideoPlayer } from '@/components/player/VideoPlayerNew';

// Updated Event interface based on transformed API response
interface Event {
  id: string;
  name: string;
  description?: string;
  startTime: string;
  accessMode: 'open' | 'email' | 'password' | 'payment';
  status: 'scheduled' | 'live' | 'ended' | 'vod';
  viewerCount?: number;
  channelId?: string;
  playbackUrl?: string;
}

// Mapping API event status -> UI status
const mapStatus = (status: string): Event['status'] => {
  switch (status) {
    case 'Ready for Live':
      return 'scheduled';
    case 'Failed':
      return 'ended';
    case 'Live':
      return 'live';
    default:
      return 'scheduled';
  }
};

// Mapping API access type -> UI access mode
const mapAccessMode = (type: string): Event['accessMode'] => {
  switch (type) {
    case 'paid':
      return 'payment';
    default:
      return 'open';
  }
};

export const EventList: React.FC = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [showEmbedDialog, setShowEmbedDialog] = useState(false);
  const [currentEmbedCode, setCurrentEmbedCode] = useState('');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [channelLoading, setChannelLoading] = useState<string | null>(null);

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      setLoading(true);
      const api = await eventApi.listEvents();

      const mapped = api.events.map((e: any) => ({
        id: e.eventId,
        name: e.title,
        description: e.description,
        startTime: e.startTime || e.dateTime,
        status: mapStatus(e.status),
        accessMode: mapAccessMode(e.type),
        playbackUrl: e.cloudFrontUrl || e.mediaPackageUrl,
        viewerCount: 0,
        channelId: e.channelId,
      }));

      setEvents(mapped);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load events');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async (text: string) => {
    await navigator.clipboard.writeText(text);
    alert('Copied to clipboard!');
  };

  const generateEmbedCode = (event: Event) => {
    const baseUrl = window.location.origin;
    const embedUrl = `${baseUrl}/event/${event.id}`;

    return `<iframe 
  src="${embedUrl}" 
  frameborder="0" 
  allow="payment; fullscreen; autoplay; clipboard-write; encrypted-media; picture-in-picture"
  loading="lazy"
  referrerpolicy="strict-origin-when-cross-origin"
  sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-modals allow-top-navigation-by-user-activation allow-presentation"
></iframe>`;
  };

  const handlePreview = (event: Event) => {
    setSelectedEvent(event);
    setShowPreview(true);
  };

  const handleShowEmbed = (event: Event) => {
    const code = generateEmbedCode(event);
    setCurrentEmbedCode(code);
    setShowEmbedDialog(true);
  };

  const handleDeleteEvent = async (eventId: string) => {
    if (!confirm('Are you sure you want to delete this event?')) return;
    await eventApi.deleteEvent(eventId);
    loadEvents();
  };

  const handleEditEvent = (event: Event) => {
    setEditingEvent(event);
    setShowEditDialog(true);
  };

  const handleStartChannel = async (channelId: string) => {
    if (!channelId) {
      alert('No channel ID available for this event');
      return;
    }
    
    if (!confirm('Are you sure you want to start this channel?')) return;
    
    try {
      setChannelLoading(channelId);
      await eventApi.startChannel(channelId);
      alert('Channel started successfully!');
      loadEvents(); // Refresh to update status
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to start channel');
    } finally {
      setChannelLoading(null);
    }
  };

  const handleStopChannel = async (channelId: string) => {
    if (!channelId) {
      alert('No channel ID available for this event');
      return;
    }
    
    if (!confirm('Are you sure you want to stop this channel?')) return;
    
    try {
      setChannelLoading(channelId);
      await eventApi.stopChannel(channelId);
      alert('Channel stopped successfully!');
      loadEvents(); // Refresh to update status
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to stop channel');
    } finally {
      setChannelLoading(null);
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
      scheduled: 'secondary',
      live: 'default',
      ended: 'destructive',
      vod: 'outline',
    };
    return <Badge variant={variants[status] || 'secondary'}>{status.toUpperCase()}</Badge>;
  };

  const getAccessModeBadge = (mode: string) => (
    <Badge variant="outline">{mode.charAt(0).toUpperCase() + mode.slice(1)} Access</Badge>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Event Library</h3>
          <p className="text-sm text-gray-500">Manage, preview, and embed your events</p>
        </div>
        <Button onClick={() => setShowCreateDialog(true)} variant="outline">
          <Plus className="w-4 h-4 mr-2" /> Create Event
        </Button>
      </div>

      {events.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Play className="w-12 h-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg">No events available</h3>
            <p className="text-sm text-gray-500">Events will appear once created.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => (
            <Card key={event.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-lg">{event.name}</CardTitle>
                <div className="flex items-center gap-2 text-sm mt-2 text-gray-500">
                  <span>{new Date(event.startTime).toLocaleString()}</span>
                  <span>•</span>
                  {getStatusBadge(event.status)}
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {event.description && <p className="text-sm text-gray-600">{event.description}</p>}
                {getAccessModeBadge(event.accessMode)}
                <p className="text-sm text-gray-600">Viewers: {event.viewerCount || 0}</p>

                <div className="grid grid-cols-3 gap-2">
                  <Button 
                    size="sm" 
                    variant="default" 
                    onClick={() => navigate(`/admin/event/${event.id}`)}
                  >
                    <Info className="w-4 h-4 mr-2" /> Details
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handlePreview(event)}>
                    <Eye className="w-4 h-4 mr-2" /> Preview
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleShowEmbed(event)}>
                    <Code className="w-4 h-4 mr-2" /> Embed
                  </Button>
                </div>

                {event.channelId && (
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      variant="default" 
                      onClick={() => handleStartChannel(event.channelId!)}
                      disabled={channelLoading === event.channelId}
                    >
                      {channelLoading === event.channelId ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <>
                          <Power className="w-4 h-4 mr-2" /> Start
                        </>
                      )}
                    </Button>
                    <Button 
                      size="sm" 
                      variant="secondary" 
                      onClick={() => handleStopChannel(event.channelId!)}
                      disabled={channelLoading === event.channelId}
                    >
                      {channelLoading === event.channelId ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <>
                          <PowerOff className="w-4 h-4 mr-2" /> Stop
                        </>
                      )}
                    </Button>
                  </div>
                )}

                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => handleEditEvent(event)}>
                    <Edit className="w-4 h-4 mr-2" /> Edit
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => handleDeleteEvent(event.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Preview Dialog */}
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>{selectedEvent?.name}</DialogTitle>
            <DialogDescription>Preview the event</DialogDescription>
          </DialogHeader>
          {selectedEvent && (
            <div className="space-y-4">
              <div className="border rounded-lg overflow-hidden bg-black">
                <VideoPlayer
                  streamUrl={selectedEvent.playbackUrl || ''}
                  eventId={selectedEvent.id}
                  title={selectedEvent.name}
                  onReady={() => console.log('Player ready')}
                  onError={(e) => console.error(e)}
                />
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Embed Dialog */}
      <Dialog open={showEmbedDialog} onOpenChange={setShowEmbedDialog}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Embed Code</DialogTitle>
            <DialogDescription>Copy this iframe</DialogDescription>
          </DialogHeader>
          <div className="bg-gray-100 p-4 rounded-md">
            <textarea
              className="w-full h-40 p-2 text-sm font-mono bg-white rounded"
              readOnly
              value={currentEmbedCode}
            />
            <Button className="mt-2" variant="outline" onClick={() => copyToClipboard(currentEmbedCode)}>
              <Copy className="w-4 h-4 mr-2" /> Copy
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Create Event */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Event</DialogTitle>
            <DialogDescription>Fill details to create event</DialogDescription>
          </DialogHeader>
          <CreateEvent onSuccess={() => { setShowCreateDialog(false); loadEvents(); }} />
        </DialogContent>
      </Dialog>

      {/* Edit Event */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Event</DialogTitle>
            <DialogDescription>Update event details</DialogDescription>
          </DialogHeader>
          {editingEvent && (
            <EditEvent
              eventId={editingEvent.id}
              initialData={{
                title: editingEvent.name,
                description: editingEvent.description,
                startTime: editingEvent.startTime,
                accessMode: editingEvent.accessMode,
              }}
              onSuccess={() => {
                setShowEditDialog(false);
                setEditingEvent(null);
                loadEvents();
              }}
              onCancel={() => {
                setShowEditDialog(false);
                setEditingEvent(null);
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};