import { useEffect, useState } from 'react';
import { eventApi } from '@/utils/api';

export interface EventConfig {
  id: string;
  name: string;
  description?: string;
  accessMode: 'open' | 'email' | 'password' | 'payment';
  password?: string;
  paymentAmount?: number;
  streamUrl: string;
  vodUrl?: string;
  startTime?: string;
  endTime?: string;
  status?: 'scheduled' | 'live' | 'ended' | 'vod';
}

export const useEventConfig = (eventId: string | null) => {
  const [config, setConfig] = useState<EventConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!eventId) {
      setLoading(false);
      return;
    }

    const loadConfig = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await eventApi.getEvent(eventId);
        setConfig(data);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load event configuration');
      } finally {
        setLoading(false);
      }
    };

    loadConfig();
  }, [eventId]);

  return { config, loading, error };
};

