import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import {
  Copy,
  Play,
  Upload,
  Share,
  Globe,
  // Settings,
  Monitor,
  BarChart3,
  Film,
  AlertCircle,
  CheckCircle,
  ArrowRight,
} from "lucide-react";

// Analytics Page Component
const AnalyticsPage = ({ analyticsData, onBack }: any) => {
  const formatTime = (time: number) => {
    if (!time || isNaN(time)) return "0:00";
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = Math.floor(time % 60);

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, "0")}:${seconds
        .toString()
        .padStart(2, "0")}`;
    }
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <BarChart3 className="w-8 h-8 text-blue-600" />
            Analytics Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Comprehensive video playback analytics and insights
          </p>
        </div>
        <Button onClick={onBack} variant="outline">
          Back to Player
        </Button>
      </div>

      {/* Key Metrics */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card className="shadow-lg">
          <CardContent className="pt-6">
            <div className="text-center">
              <BarChart3 className="w-8 h-8 mx-auto text-blue-600 mb-2" />
              <div className="text-3xl font-bold text-blue-600">
                {analyticsData.totalViews}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Total Views
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardContent className="pt-6">
            <div className="text-center">
              <Monitor className="w-8 h-8 mx-auto text-green-600 mb-2" />
              <div className="text-3xl font-bold text-green-600">
                {formatTime(analyticsData.watchTime)}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Total Watch Time
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardContent className="pt-6">
            <div className="text-center">
              <CheckCircle className="w-8 h-8 mx-auto text-purple-600 mb-2" />
              <div className="text-3xl font-bold text-purple-600">
                {Math.round(analyticsData.completionRate)}%
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Completion Rate
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardContent className="pt-6">
            <div className="text-center">
              <Film className="w-8 h-8 mx-auto text-orange-600 mb-2" />
              <div className="text-3xl font-bold text-orange-600">
                {Math.round(analyticsData.engagementScore)}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Engagement Score
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analytics */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Playback Performance</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <span className="text-sm font-medium">Buffering Events</span>
              <Badge variant="secondary">{analyticsData.bufferingEvents}</Badge>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <span className="text-sm font-medium">Quality Changes</span>
              <Badge variant="secondary">{analyticsData.qualityChanges}</Badge>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <span className="text-sm font-medium">Average Session Time</span>
              <Badge variant="secondary">
                {formatTime(analyticsData.watchTime / Math.max(1, analyticsData.totalViews))}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Engagement Metrics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Completion Progress</span>
                <span className="font-medium">{Math.round(analyticsData.completionRate)}%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="bg-purple-600 h-2 rounded-full transition-all"
                  style={{ width: `${Math.min(100, analyticsData.completionRate)}%` }}
                ></div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Engagement Level</span>
                <span className="font-medium">{Math.round(analyticsData.engagementScore)}%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="bg-orange-600 h-2 rounded-full transition-all"
                  style={{ width: `${Math.min(100, analyticsData.engagementScore)}%` }}
                ></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Summary Stats */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Session Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                Video Sessions
              </div>
              <div className="text-2xl font-bold text-blue-600">
                {analyticsData.totalViews}
              </div>
            </div>
            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                Total Duration Watched
              </div>
              <div className="text-2xl font-bold text-green-600">
                {formatTime(analyticsData.watchTime)}
              </div>
            </div>
            <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                Performance Issues
              </div>
              <div className="text-2xl font-bold text-purple-600">
                {analyticsData.bufferingEvents + analyticsData.qualityChanges}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Main Video Player Page Component
const VideoPlayerApp = () => {
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [videoUrl, setVideoUrl] = useState("");
  const [currentVideoSrc, setCurrentVideoSrc] = useState("");
  const [embedCode, setEmbedCode] = useState("");
  const [showEmbed, setShowEmbed] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [isBuffering, setIsBuffering] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [playerReady, setPlayerReady] = useState(false);
  // const [showSettings, setShowSettings] = useState(false);

  const [analyticsData, setAnalyticsData] = useState({
    totalViews: 0,
    watchTime: 0,
    completionRate: 0,
    engagementScore: 0,
    bufferingEvents: 0,
    qualityChanges: 0,
  });

  const videoRef = useRef<HTMLVideoElement>(null);
  const playerInstanceRef = useRef<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const sampleVideos = [
    {
      name: "Big Buck Bunny",
      url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
      description: "Open source 3D animated short film",
    },
    {
      name: "Elephant's Dream",
      url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
      description: "First open movie made with open source tools",
    },
    {
      name: "Sintel",
      url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
      description: "Fantasy adventure short film",
    },
  ];

  useEffect(() => {
    if (!currentVideoSrc || !videoRef.current) return;

    const loadVideoJS = async () => {
      try {
        if (playerInstanceRef.current) {
          try {
            playerInstanceRef.current.dispose();
          } catch (e) {
            console.log("Player cleanup:", e);
          }
          playerInstanceRef.current = null;
        }

        setError(null);
        setPlayerReady(false);

        if (!document.getElementById("videojs-css")) {
          const link = document.createElement("link");
          link.id = "videojs-css";
          link.rel = "stylesheet";
          link.href = "https://unpkg.com/video.js@8/dist/video-js.min.css";
          document.head.appendChild(link);
        }

        if (!(window as any).videojs) {
          await new Promise((resolve, reject) => {
            const script = document.createElement("script");
            script.src = "https://unpkg.com/video.js@8/dist/video.min.js";
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
          });
        }

        const videojs = (window as any).videojs;

        const options = {
          controls: true,
          autoplay: false,
          preload: "metadata",
          fluid: true,
          responsive: true,
          playbackRates: [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2],
          controlBar: {
            volumePanel: { inline: false },
            pictureInPictureToggle: true,
          },
        };

        const player = videojs(videoRef.current, options);
        playerInstanceRef.current = player;

        player.src({
          src: currentVideoSrc,
          type: getMimeType(currentVideoSrc),
        });

        player.ready(() => {
          setPlayerReady(true);
          setAnalyticsData((prev) => ({
            ...prev,
            totalViews: prev.totalViews + 1,
          }));
        });

        player.on("loadedmetadata", () => {
          const dur = player.duration();
          if (dur && !isNaN(dur) && isFinite(dur)) {
            setDuration(dur);
          }
        });

        player.on("timeupdate", () => {
          const ct = player.currentTime();
          setCurrentTime(ct);

          const dur = player.duration();
          if (dur > 0) {
            const completion = (ct / dur) * 100;
            setAnalyticsData((prev) => ({
              ...prev,
              watchTime: ct,
              completionRate: completion,
              engagementScore: Math.min(100, completion + prev.totalViews * 5),
            }));
          }
        });

        player.on("volumechange", () => setVolume(player.volume()));
        player.on("waiting", () => {
          setIsBuffering(true);
          setAnalyticsData((prev) => ({
            ...prev,
            bufferingEvents: prev.bufferingEvents + 1,
          }));
        });
        player.on("canplay", () => setIsBuffering(false));
        player.on("ratechange", () => setPlaybackRate(player.playbackRate()));

        player.on("error", () => {
          const playerError = player.error();
          if (playerError) {
            setError(`Error ${playerError.code}: ${playerError.message}`);
          }
        });
      } catch (err) {
        console.error("Failed to load Video.js:", err);
        setError("Failed to initialize video player. Please try again.");
      }
    };

    loadVideoJS();

    return () => {
      if (playerInstanceRef.current) {
        try {
          playerInstanceRef.current.dispose();
        } catch (e) {
          console.log("Cleanup:", e);
        }
        playerInstanceRef.current = null;
      }
    };
  }, [currentVideoSrc]);

  const getMimeType = (url: string): string => {
    const lower = url.toLowerCase();
    if (lower.endsWith(".m3u8")) return "application/x-mpegURL";
    if (lower.endsWith(".mpd")) return "application/dash+xml";
    if (lower.endsWith(".webm")) return "video/webm";
    if (lower.endsWith(".ogg") || lower.endsWith(".ogv")) return "video/ogg";
    return "video/mp4";
  };

  const handleUrlPlay = (url?: string) => {
    const videoSrc = url || videoUrl;
    if (videoSrc.trim()) {
      setCurrentVideoSrc(videoSrc);
      setError(null);
      generateEmbedCode(videoSrc);

      setTimeout(() => {
        document.getElementById("video-player-section")?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 300);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith("video/")) {
      const fileUrl = URL.createObjectURL(file);
      setCurrentVideoSrc(fileUrl);
      setVideoUrl("");
      setError(null);
      generateEmbedCode(fileUrl, file.name);
    }
  };

  const generateEmbedCode = (src: string,  _fileName?: string) => {
    const embedScript = `<!-- Video.js Player -->
<link href="https://unpkg.com/video.js@8/dist/video-js.min.css" rel="stylesheet" />
<script src="https://unpkg.com/video.js@8/dist/video.min.js"></script>

<video 
  id="my-player"
  class="video-js vjs-default-skin vjs-big-play-centered"
  controls 
  preload="metadata"
  data-setup='{"playbackRates": [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2]}'
>
  <source src="${src}" type="${getMimeType(src)}" />
</video>`;

    setEmbedCode(embedScript);
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      alert("Copied to clipboard!");
    } catch (err) {
      alert("Failed to copy to clipboard");
    }
  };

  const formatTime = (time: number) => {
    if (!time || isNaN(time)) return "0:00";
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = Math.floor(time % 60);

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, "0")}:${seconds
        .toString()
        .padStart(2, "0")}`;
    }
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  if (showAnalytics) {
    return (
      <AnalyticsPage
        analyticsData={analyticsData}
        onBack={() => setShowAnalytics(false)}
      />
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6 space-y-4 md:space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Play className="w-8 h-8 text-blue-600" />
            Video Player
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Advanced video player with analytics
          </p>
        </div>
        <Button onClick={() => setShowAnalytics(true)} variant="outline">
          <BarChart3 className="w-4 h-4 mr-2" />
          View Analytics
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>

      {/* Video Player */}
      {currentVideoSrc && (
        <Card className="shadow-xl" id="video-player-section">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Monitor className="w-5 h-5 text-blue-600" />
                Video Player
              </CardTitle>
              {playerReady && (
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="default" className="flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" />
                    Ready
                  </Badge>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {formatTime(duration)}
                  </span>
                </div>
              )}
            </div>
            <div className="flex gap-2">
              <Dialog open={showEmbed} onOpenChange={setShowEmbed}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Share className="w-4 h-4 mr-2" />
                    Embed
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl">
                  <DialogHeader>
                    <DialogTitle>Embed Code</DialogTitle>
                  </DialogHeader>
                  <textarea
                    className="w-full h-40 p-3 border rounded-md font-mono text-sm dark:bg-gray-800 dark:text-gray-200"
                    value={embedCode}
                    readOnly
                  />
                  <Button onClick={() => copyToClipboard(embedCode)}>
                    <Copy className="w-4 h-4 mr-2" />
                    Copy Code
                  </Button>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="video-container relative bg-black rounded-lg overflow-hidden shadow-lg">
              <video
                ref={videoRef}
                className="video-js vjs-default-skin vjs-big-play-centered w-full"
                style={{ aspectRatio: "16/9" }}
              />

              {isBuffering && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/20 pointer-events-none z-10">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
                </div>
              )}
            </div>

            {playerReady && (
              <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-700 dark:text-gray-300">
                      Duration:
                    </span>{" "}
                    <span className="text-gray-600 dark:text-gray-400">
                      {formatTime(duration)}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700 dark:text-gray-300">
                      Current:
                    </span>{" "}
                    <span className="text-gray-600 dark:text-gray-400">
                      {formatTime(currentTime)}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700 dark:text-gray-300">
                      Speed:
                    </span>{" "}
                    <span className="text-gray-600 dark:text-gray-400">
                      {playbackRate}x
                    </span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700 dark:text-gray-300">
                      Volume:
                    </span>{" "}
                    <span className="text-gray-600 dark:text-gray-400">
                      {Math.round(volume * 100)}%
                    </span>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Video Source */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="w-6 h-6 text-blue-600" />
            Video Source
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="url" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="url">
                <Globe className="w-4 h-4 mr-2" />
                URL
              </TabsTrigger>
              <TabsTrigger value="local">
                <Upload className="w-4 h-4 mr-2" />
                Local File
              </TabsTrigger>
              <TabsTrigger value="samples">
                <Film className="w-4 h-4 mr-2" />
                Samples
              </TabsTrigger>
            </TabsList>

            <TabsContent value="url" className="space-y-4">
              <div className="flex gap-2">
                <Input
                  type="url"
                  placeholder="Enter video URL (MP4, WebM, HLS, DASH)"
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  className="flex-1"
                />
                <Button
                  onClick={() => handleUrlPlay()}
                  disabled={!videoUrl.trim()}
                >
                  <Play className="w-4 h-4 mr-2" />
                  Load
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="local">
              <Input
                ref={fileInputRef}
                type="file"
                accept="video/*"
                onChange={handleFileChange}
              />
            </TabsContent>

            <TabsContent value="samples">
              <div className="grid md:grid-cols-3 gap-4">
                {sampleVideos.map((video, index) => (
                  <Card
                    key={index}
                    className="hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => handleUrlPlay(video.url)}
                  >
                    <CardContent className="p-4">
                      <h4 className="font-medium mb-1">{video.name}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                        {video.description}
                      </p>
                      <Button size="sm" className="w-full">
                        <Play className="w-4 h-4 mr-2" />
                        Load Video
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      {currentVideoSrc && (
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-blue-600" />
              Quick Stats
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">
                  {analyticsData.totalViews}
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400">Views</div>
              </div>
              <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {Math.round(analyticsData.watchTime)}s
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400">Watch Time</div>
              </div>
              <div className="text-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">
                  {Math.round(analyticsData.completionRate)}%
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400">Completed</div>
              </div>
              <div className="text-center p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                <div className="text-2xl font-bold text-orange-600">
                  {analyticsData.bufferingEvents}
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400">Buffering</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default VideoPlayerApp;