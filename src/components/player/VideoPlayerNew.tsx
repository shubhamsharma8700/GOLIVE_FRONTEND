import React, { useRef, useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Loader2, AlertCircle, CheckCircle } from 'lucide-react';
import { analyticsTracker } from '@/utils/analytics';
import { useUser } from '@/context/UserContext';

interface VideoPlayerProps {
  streamUrl: string;
  eventId: string;
  title?: string;
  onReady?: () => void;
  onError?: (error: string) => void;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  streamUrl,
  eventId,
  title,
  onReady,
  onError,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const playerInstanceRef = useRef<any>(null);
  const { user } = useUser();
  const [playerReady, setPlayerReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isBuffering, setIsBuffering] = useState(false);
  const [playbackStarted, setPlaybackStarted] = useState(false);

  useEffect(() => {
    if (!streamUrl || !videoRef.current) return;

    const loadVideoJS = async () => {
      try {
        // Clean up existing player
        if (playerInstanceRef.current) {
          try {
            playerInstanceRef.current.dispose();
          } catch (e) {
            console.log('Player cleanup:', e);
          }
          playerInstanceRef.current = null;
        }

        setError(null);
        setPlayerReady(false);

        // Load Video.js CSS
        if (!document.getElementById('videojs-css')) {
          const link = document.createElement('link');
          link.id = 'videojs-css';
          link.rel = 'stylesheet';
          link.href = 'https://unpkg.com/video.js@8/dist/video-js.min.css';
          document.head.appendChild(link);
        }

        // Load Video.js script
        if (!(window as any).videojs) {
          await new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = 'https://unpkg.com/video.js@8/dist/video.min.js';
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
          });
        }

        const videojs = (window as any).videojs;

        // Initialize player with options
        const options = {
          controls: true,
          autoplay: false,
          preload: 'metadata',
          fluid: true,
          responsive: true,
          playbackRates: [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2],
          controlBar: {
            volumePanel: { inline: false },
            pictureInPictureToggle: true,
          },
          html5: {
            vhs: {
              overrideNative: true,
            },
            nativeVideoTracks: false,
            nativeAudioTracks: false,
            nativeTextTracks: false,
          },
        };

        const player = videojs(videoRef.current, options);
        playerInstanceRef.current = player;

        // Set source
        player.src({
          src: streamUrl,
          type: getMimeType(streamUrl),
        });

        // Event handlers
        player.ready(() => {
          setPlayerReady(true);
          if (onReady) onReady();
        });

        player.on('play', () => {
          if (!playbackStarted) {
            setPlaybackStarted(true);
            analyticsTracker.trackPlay(eventId, user?.id);
          }
        });

        player.on('pause', () => {
          const currentTime = player.currentTime();
          analyticsTracker.trackPause(eventId, user?.id, currentTime);
        });

        player.on('timeupdate', () => {
          const currentTime = player.currentTime();
          const duration = player.duration();
          
          if (duration > 0) {
            const completionRate = (currentTime / duration) * 100;
            analyticsTracker.trackPlayback(eventId, {
              playTime: currentTime,
              completionRate,
            });
          }
        });

        player.on('waiting', () => {
          setIsBuffering(true);
          analyticsTracker.trackBuffering(eventId, user?.id);
        });

        player.on('canplay', () => {
          setIsBuffering(false);
        });

        player.on('error', () => {
          const playerError = player.error();
          if (playerError) {
            const errorMessage = `Error ${playerError.code}: ${playerError.message}`;
            setError(errorMessage);
            if (onError) onError(errorMessage);
          }
        });

        player.on('ended', () => {
          // const duration = player.duration();
          analyticsTracker.trackCompletion(eventId, 100, user?.id);
        });

      } catch (err: any) {
        console.error('Failed to load Video.js:', err);
        const errorMessage = 'Failed to initialize video player. Please try again.';
        setError(errorMessage);
        if (onError) onError(errorMessage);
      }
    };

    loadVideoJS();

    return () => {
      if (playerInstanceRef.current) {
        try {
          playerInstanceRef.current.dispose();
        } catch (e) {
          console.log('Cleanup:', e);
        }
        playerInstanceRef.current = null;
      }
    };
  }, [streamUrl, eventId, user?.id, onReady, onError]);

  const getMimeType = (url: string): string => {
    const lower = url.toLowerCase();
    if (lower.endsWith('.m3u8')) return 'application/x-mpegURL';
    if (lower.endsWith('.mpd')) return 'application/dash+xml';
    if (lower.endsWith('.webm')) return 'video/webm';
    if (lower.endsWith('.ogg') || lower.endsWith('.ogv')) return 'video/ogg';
    return 'video/mp4';
  };

  return (
    <Card className="shadow-xl">
      <CardContent className="p-0">
        {error && (
          <Alert variant="destructive" className="m-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="relative bg-black rounded-lg overflow-hidden" style={{ aspectRatio: '16/9' }}>
          <video
            ref={videoRef}
            className="video-js vjs-default-skin vjs-big-play-centered w-full h-full"
          />

          {isBuffering && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/20 pointer-events-none z-10">
              <Loader2 className="w-12 h-12 animate-spin text-white" />
            </div>
          )}

          {playerReady && (
            <div className="absolute top-4 left-4 z-10">
              <Badge variant="default" className="flex items-center gap-1">
                <CheckCircle className="w-3 h-3" />
                Ready
              </Badge>
            </div>
          )}

          {title && (
            <div className="absolute top-4 right-4 z-10">
              <Badge variant="secondary">{title}</Badge>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

