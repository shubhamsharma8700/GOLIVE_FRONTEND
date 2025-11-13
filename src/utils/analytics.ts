// Analytics tracking utilities

export interface AnalyticsEvent {
  eventId: string;
  userId?: string;
  action: string;
  timestamp: number;
  duration?: number;
  deviceType?: string;
  browser?: string;
  metadata?: Record<string, any>;
}

export interface PlaybackAnalytics {
  eventId: string;
  userId?: string;
  playTime: number;
  pauseTime: number;
  seekEvents: number;
  bufferingEvents: number;
  qualityChanges: number;
  completionRate: number;
  deviceInfo: {
    type: string;
    browser: string;
    os: string;
  };
}

class AnalyticsTracker {
  private eventBuffer: AnalyticsEvent[] = [];
  private playbackData: Map<string, PlaybackAnalytics> = new Map();
  private flushInterval: number | null = null;
  private readonly FLUSH_INTERVAL_MS = 30000; // 30 seconds
  private readonly MAX_BUFFER_SIZE = 50;

  constructor() {
    // Start periodic flush
    this.startFlushInterval();
  }

  // Track a single event
  track(event: AnalyticsEvent) {
    this.eventBuffer.push(event);
    
    // Flush if buffer is full
    if (this.eventBuffer.length >= this.MAX_BUFFER_SIZE) {
      this.flush();
    }
  }

  // Track playback events
  trackPlayback(eventId: string, data: Partial<PlaybackAnalytics>) {
    const existing = this.playbackData.get(eventId) || {
      eventId,
      playTime: 0,
      pauseTime: 0,
      seekEvents: 0,
      bufferingEvents: 0,
      qualityChanges: 0,
      completionRate: 0,
      deviceInfo: this.getDeviceInfo(),
    };

    const updated = { ...existing, ...data };
    this.playbackData.set(eventId, updated);

    // Track as event
    this.track({
      eventId,
      action: 'playback_update',
      timestamp: Date.now(),
      metadata: updated,
    });
  }

  // Track play event
  trackPlay(eventId: string, userId?: string) {
    this.track({
      eventId,
      userId,
      action: 'play',
      timestamp: Date.now(),
    });
  }

  // Track pause event
  trackPause(eventId: string, userId?: string, duration?: number) {
    this.track({
      eventId,
      userId,
      action: 'pause',
      timestamp: Date.now(),
      duration,
    });
  }

  // Track seek event
  trackSeek(eventId: string, from: number, to: number, userId?: string) {
    this.track({
      eventId,
      userId,
      action: 'seek',
      timestamp: Date.now(),
      metadata: { from, to },
    });
  }

  // Track buffering event
  trackBuffering(eventId: string, userId?: string) {
    this.track({
      eventId,
      userId,
      action: 'buffering',
      timestamp: Date.now(),
    });
  }

  // Track quality change
  trackQualityChange(eventId: string, quality: string, userId?: string) {
    this.track({
      eventId,
      userId,
      action: 'quality_change',
      timestamp: Date.now(),
      metadata: { quality },
    });
  }

  // Track completion
  trackCompletion(eventId: string, completionRate: number, userId?: string) {
    this.track({
      eventId,
      userId,
      action: 'completion',
      timestamp: Date.now(),
      duration: completionRate,
      metadata: { completionRate },
    });
  }

  // Get device information
  getDeviceInfo() {
    const ua = navigator.userAgent;
    return {
      type: this.getDeviceType(),
      browser: this.getBrowser(ua),
      os: this.getOS(ua),
    };
  }

  private getDeviceType(): string {
    const ua = navigator.userAgent;
    if (/tablet|ipad|playbook|silk/i.test(ua)) {
      return 'tablet';
    }
    if (/mobile|iphone|ipod|android|blackberry|opera|mini|windows\sce|palm|smartphone|iemobile/i.test(ua)) {
      return 'mobile';
    }
    return 'desktop';
  }

  private getBrowser(ua: string): string {
    if (ua.includes('Chrome')) return 'Chrome';
    if (ua.includes('Firefox')) return 'Firefox';
    if (ua.includes('Safari') && !ua.includes('Chrome')) return 'Safari';
    if (ua.includes('Edge')) return 'Edge';
    if (ua.includes('Opera')) return 'Opera';
    return 'Unknown';
  }

  private getOS(ua: string): string {
    if (ua.includes('Windows')) return 'Windows';
    if (ua.includes('Mac')) return 'macOS';
    if (ua.includes('Linux')) return 'Linux';
    if (ua.includes('Android')) return 'Android';
    if (ua.includes('iOS')) return 'iOS';
    return 'Unknown';
  }

  // Flush events to server
  async flush() {
    if (this.eventBuffer.length === 0) return;

    const events = [...this.eventBuffer];
    this.eventBuffer = [];

    try {
      // Import dynamically to avoid circular dependencies
      const { analyticsApi } = await import('./api');
      
      // Send events in batches
      for (const event of events) {
        await analyticsApi.trackEvent(event);
      }
    } catch (error) {
      console.error('Failed to flush analytics:', error);
      // Re-add events to buffer on failure
      this.eventBuffer.unshift(...events);
    }
  }

  // Start periodic flush
  private startFlushInterval() {
    if (this.flushInterval) return;
    
    this.flushInterval = window.setInterval(() => {
      this.flush();
    }, this.FLUSH_INTERVAL_MS);
  }

  // Stop periodic flush
  stop() {
    if (this.flushInterval) {
      clearInterval(this.flushInterval);
      this.flushInterval = null;
    }
    // Flush remaining events
    this.flush();
  }

  // Get playback analytics for an event
  getPlaybackAnalytics(eventId: string): PlaybackAnalytics | undefined {
    return this.playbackData.get(eventId);
  }
}

// Singleton instance
export const analyticsTracker = new AnalyticsTracker();

// Helper function to format time for analytics
export const formatTimeForAnalytics = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  return `${minutes}:${secs.toString().padStart(2, '0')}`;
};

