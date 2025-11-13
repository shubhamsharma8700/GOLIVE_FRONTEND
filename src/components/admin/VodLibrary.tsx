import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Loader2, AlertCircle, Play, Copy, ExternalLink, Code, Eye } from 'lucide-react';
import { adminApi } from '@/utils/api';
import { VideoPlayer } from '@/components/player/VideoPlayerNew';

interface VodItem {
  id: string;
  eventId: string;
  eventName: string;
  vodUrl: string;
  thumbnailUrl?: string;
  duration?: number;
  createdAt: string;
  embedCode?: string;
}

export const VodLibrary: React.FC = () => {
  const [vods, setVods] = useState<VodItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedVod, setSelectedVod] = useState<VodItem | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [showEmbedDialog, setShowEmbedDialog] = useState(false);
  const [currentEmbedCode, setCurrentEmbedCode] = useState('');

  useEffect(() => {
    loadVods();
  }, []);

  const loadVods = async () => {
    try {
      setLoading(true);
      const data = await adminApi.getVodLibrary();
      setVods(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load VOD library');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      alert('Copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const formatDuration = (seconds?: number) => {
    if (!seconds) return 'N/A';
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const generateEmbedCode = (vod: VodItem) => {
    const baseUrl = window.location.origin;
    const embedUrl = `${baseUrl}/event/${vod.eventId}`;
    // const embedUrl = `https://d3duh532qzenq4.cloudfront.net/vod/testing-poc/file_example_MP4_640_3MG.mp4`;
    
    // Generate secure iframe embed code with security features
    const embedCode = `<iframe 
  src="${embedUrl}" 
  frameborder="0" 
  allow="payment; fullscreen; autoplay; clipboard-write; encrypted-media; picture-in-picture"
  loading="lazy"
  referrerpolicy="strict-origin-when-cross-origin"
  sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-modals allow-top-navigation-by-user-activation allow-presentation"
></iframe>`;
    
    return embedCode;
  };

  const handlePreview = (vod: VodItem) => {
    setSelectedVod(vod);
    setShowPreview(true);
  };

  const handleShowEmbed = (vod: VodItem) => {
    const embedCode = generateEmbedCode(vod);
    setCurrentEmbedCode(embedCode);
    setShowEmbedDialog(true);
  };

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
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            VOD Library
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            View and manage your video-on-demand content
          </p>
        </div>
        <Button onClick={loadVods} variant="outline">
          Refresh
        </Button>
      </div>

      {vods.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Play className="w-12 h-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
              No VOD content available
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              VODs will appear here after events end
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {vods.map((vod) => (
            <Card key={vod.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-lg">{vod.eventName}</CardTitle>
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mt-2">
                  <span>{new Date(vod.createdAt).toLocaleDateString()}</span>
                  {vod.duration && (
                    <>
                      <span>•</span>
                      <span>{formatDuration(vod.duration)}</span>
                    </>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Thumbnail/Preview */}
                {vod.thumbnailUrl ? (
                  <div className="aspect-video bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden">
                    <img
                      src={vod.thumbnailUrl}
                      alt={vod.eventName}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="aspect-video bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg flex items-center justify-center">
                    <Play className="w-12 h-12 text-blue-600" />
                  </div>
                )}

                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handlePreview(vod)}
                    className="w-full"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    Preview
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleShowEmbed(vod)}
                    className="w-full"
                  >
                    <Code className="w-4 h-4 mr-2" />
                    Embed
                  </Button>
                </div>

                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => window.open(vod.vodUrl, '_blank')}
                    className="flex-1"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Open
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => copyToClipboard(vod.vodUrl)}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Preview Dialog with Mini Player */}
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>{selectedVod?.eventName}</DialogTitle>
            <DialogDescription>
              Preview the video player with integrated security features
            </DialogDescription>
          </DialogHeader>
          {selectedVod && (
            <div className="space-y-4">
              <div className="border rounded-lg overflow-hidden bg-black">
                <VideoPlayer
                  streamUrl={selectedVod.vodUrl}
                  eventId={selectedVod.eventId}
                  title={selectedVod.eventName}
                  onReady={() => console.log('Player ready')}
                  onError={(error) => console.error('Player error:', error)}
                />
              </div>
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                <h4 className="font-semibold text-sm mb-2">Security Features:</h4>
                <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1 list-disc list-inside">
                  <li>CloudFront signed URLs for secure streaming</li>
                  <li>JWT token validation for access control</li>
                  <li>Iframe sandbox restrictions</li>
                  <li>Referrer policy enforcement</li>
                  <li>HTTPS-only content delivery</li>
                </ul>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Embed Code Dialog */}
      <Dialog open={showEmbedDialog} onOpenChange={setShowEmbedDialog}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Embed Code</DialogTitle>
            <DialogDescription>
              Copy this code to embed the video player on your website
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Iframe Embed Code</span>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => copyToClipboard(currentEmbedCode)}
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Copy Code
                </Button>
              </div>
              <textarea
                className="w-full h-40 p-3 border rounded-md font-mono text-sm dark:bg-gray-900 dark:text-gray-200 resize-none"
                value={currentEmbedCode}
                readOnly
              />
            </div>
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
              <h4 className="font-semibold text-sm mb-2">Security Features Included:</h4>
              <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                <li>• <code className="bg-white dark:bg-gray-800 px-1 rounded">sandbox</code> attribute restricts iframe capabilities</li>
                <li>• <code className="bg-white dark:bg-gray-800 px-1 rounded">referrerpolicy</code> controls referrer information</li>
                <li>• <code className="bg-white dark:bg-gray-800 px-1 rounded">allow</code> attributes specify allowed permissions</li>
                <li>• Secure HTTPS-only content delivery</li>
              </ul>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
