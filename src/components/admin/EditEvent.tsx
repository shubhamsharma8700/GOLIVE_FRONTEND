import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { eventApi } from '@/utils/api';
import { localToUTC, utcToLocal } from '@/utils/timezone';

interface EditEventProps {
  eventId: string;
  initialData?: {
    title?: string;
    description?: string;
    startTime?: string;
    endTime?: string;
    accessMode?: 'open' | 'email' | 'password' | 'payment';
    password?: string;
    paymentAmount?: number;
  };
  onSuccess?: () => void;
  onCancel?: () => void;
}

export const EditEvent: React.FC<EditEventProps> = ({ eventId, initialData, onSuccess, onCancel }) => {
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(!initialData);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    description: initialData?.description || '',
    // Convert UTC to local time for display
    startTime: initialData?.startTime ? utcToLocal(initialData.startTime) : '',
    endTime: initialData?.endTime ? utcToLocal(initialData.endTime) : '',
    accessMode: initialData?.accessMode || 'open' as 'open' | 'email' | 'password' | 'payment',
    password: initialData?.password || '',
    paymentAmount: initialData?.paymentAmount?.toString() || '',
  });

  // Load event data if not provided
  useEffect(() => {
    const loadEventData = async () => {
      if (initialData) return;
      
      try {
        setLoadingData(true);
        const data = await eventApi.getEvent(eventId);
        const event = data.event || data;
        
        setFormData({
          title: event.title || event.name || '',
          description: event.description || '',
          // Convert UTC from database to local time for display
          startTime: event.startTime ? utcToLocal(event.startTime) : '',
          endTime: event.endTime ? utcToLocal(event.endTime) : '',
          accessMode: event.accessMode || event.type === 'paid' ? 'payment' : 'open',
          password: event.password || '',
          paymentAmount: event.paymentAmount?.toString() || '',
        });
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load event data');
      } finally {
        setLoadingData(false);
      }
    };

    loadEventData();
  }, [eventId, initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const eventData = {
        title: formData.title,
        description: formData.description || undefined,
        // Convert local time to UTC for database storage
        startTime: localToUTC(formData.startTime),
        endTime: formData.endTime ? localToUTC(formData.endTime) : undefined,
        accessMode: formData.accessMode,
        password: formData.accessMode === 'password' ? formData.password : undefined,
        paymentAmount: formData.accessMode === 'payment' ? parseFloat(formData.paymentAmount) : undefined,
      };

      await eventApi.updateEvent(eventId, eventData);
      setSuccess(true);
      
      // Call success callback after 1 second
      setTimeout(() => {
        if (onSuccess) {
          onSuccess();
        }
      }, 1000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update event');
    } finally {
      setLoading(false);
    }
  };

  if (loadingData) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>Event updated successfully! Redirecting...</AlertDescription>
          </Alert>
        )}

        <div className="space-y-2">
          <Label htmlFor="title">Event Name *</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="My Live Event"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Input
            id="description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Event description"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="startTime">Start Time (Local Time) *</Label>
            <Input
              id="startTime"
              type="datetime-local"
              value={formData.startTime}
              onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
              required
            />
            <p className="text-xs text-gray-500">Time will be saved in UTC</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="endTime">End Time (Local Time)</Label>
            <Input
              id="endTime"
              type="datetime-local"
              value={formData.endTime}
              onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
            />
            <p className="text-xs text-gray-500">Time will be saved in UTC</p>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="accessMode">Access Mode *</Label>
          <Select
            value={formData.accessMode}
            onValueChange={(value: any) => setFormData({ ...formData, accessMode: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="open">Open Access</SelectItem>
              <SelectItem value="email">Email Access</SelectItem>
              <SelectItem value="password">Password Access</SelectItem>
              <SelectItem value="payment">Payment Access</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {formData.accessMode === 'password' && (
          <div className="space-y-2">
            <Label htmlFor="password">Password *</Label>
            <Input
              id="password"
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder="Enter password"
              required
            />
          </div>
        )}

        {formData.accessMode === 'payment' && (
          <div className="space-y-2">
            <Label htmlFor="paymentAmount">Payment Amount ($) *</Label>
            <Input
              id="paymentAmount"
              type="number"
              step="0.01"
              min="0"
              value={formData.paymentAmount}
              onChange={(e) => setFormData({ ...formData, paymentAmount: e.target.value })}
              placeholder="9.99"
              required
            />
          </div>
        )}

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Updating Event...
            </>
          ) : (
            'Update Event'
          )}
        </Button>

        {onCancel && (
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={onCancel}
            disabled={loading || success}
          >
            Cancel
          </Button>
        )}
      </form>
    </div>
  );
};

