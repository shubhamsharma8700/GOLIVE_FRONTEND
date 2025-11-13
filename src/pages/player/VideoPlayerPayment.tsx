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
  Monitor,
  BarChart3,
  Film,
  AlertCircle,
  CheckCircle,
  ArrowRight,
  CreditCard,
  Lock,
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
  const [hasAccess, setHasAccess] = useState(false);
  const [showRegistration, setShowRegistration] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [formData, setFormData] = useState({ 
    name: "", 
    email: "", 
    cardNumber: "", 
    expiry: "", 
    cvv: "" 
  });

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
      setShowRegistration(true);
      setHasAccess(false);
      generateEmbedCode(videoSrc);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith("video/")) {
      const fileUrl = URL.createObjectURL(file);
      setCurrentVideoSrc(fileUrl);
      setVideoUrl("");
      setError(null);
      setShowRegistration(true);
      setHasAccess(false);
      generateEmbedCode(fileUrl, file.name);
    }
  };

  const handleRegistrationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      setHasAccess(true);
      setShowRegistration(false);
      
      // Auto-play video after successful payment
      setTimeout(() => {
        if (playerInstanceRef.current) {
          playerInstanceRef.current.play();
        }
      }, 500);
    }, 2000);
  };

  const generateEmbedCode = (src: string, _fileName?: string) => {
    const embedScript = `<!-- Video.js Player with Payment Gate -->
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
            Advanced video player with payment integration
          </p>
        </div>
        <Button onClick={() => setShowAnalytics(true)} variant="outline">
          <BarChart3 className="w-4 h-4 mr-2" />
          View Analytics
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>

      {/* Video Source - Always at top */}
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

      {/* Video Player - Always visible, centered, fixed height */}
      <Card className="shadow-xl">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Monitor className="w-5 h-5 text-blue-600" />
              Video Player
            </CardTitle>
            {playerReady && hasAccess && (
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
          {currentVideoSrc && (
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
          )}
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div 
            className="video-container relative bg-black rounded-lg overflow-hidden shadow-lg" 
            style={{ aspectRatio: "16/9", minHeight: "400px" }}
          >
            {currentVideoSrc ? (
              <>
                <video
                  ref={videoRef}
                  className="video-js vjs-default-skin vjs-big-play-centered w-full h-full"
                />

                {/* Registration/Payment Form Overlay */}
                {showRegistration && !hasAccess && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-black/95 via-black/90 to-blue-900/50 backdrop-blur-sm z-20">
                    <Card className="w-full max-w-md mx-4 bg-white dark:bg-gray-900 shadow-2xl">
                      <CardHeader className="text-center pb-4">
                        <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                          <Lock className="w-8 h-8 text-blue-600" />
                        </div>
                        <CardTitle className="text-2xl">
                          Unlock This Video
                        </CardTitle>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                          Complete registration and payment to access premium content
                        </p>
                      </CardHeader>
                      <CardContent>
                        <form onSubmit={handleRegistrationSubmit} className="space-y-4">
                          {/* Registration Section */}
                          <div className="space-y-3">
                            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                              <span className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs">1</span>
                              Account Information
                            </h3>
                            
                            <div className="space-y-2">
                              <label className="text-sm font-medium">Full Name *</label>
                              <Input
                                type="text"
                                placeholder="John Doe"
                                required
                                value={formData.name}
                                onChange={(e) => setFormData({...formData, name: e.target.value})}
                              />
                            </div>
                            
                            <div className="space-y-2">
                              <label className="text-sm font-medium">Email Address *</label>
                              <Input
                                type="email"
                                placeholder="john@example.com"
                                required
                                value={formData.email}
                                onChange={(e) => setFormData({...formData, email: e.target.value})}
                              />
                            </div>
                          </div>

                          {/* Payment Section */}
                          <div className="border-t pt-4 space-y-3">
                            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                              <span className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs">2</span>
                              Payment Details
                            </h3>
                            
                            <div className="space-y-3">
                              <div className="space-y-2">
                                <label className="text-sm font-medium flex items-center gap-2">
                                  <CreditCard className="w-4 h-4" />
                                  Card Number *
                                </label>
                                <Input
                                  type="text"
                                  placeholder="1234 5678 9012 3456"
                                  maxLength={19}
                                  required
                                  value={formData.cardNumber}
                                  onChange={(e) => {
                                    const value = e.target.value.replace(/\s/g, '');
                                    const formatted = value.match(/.{1,4}/g)?.join(' ') || value;
                                    setFormData({...formData, cardNumber: formatted});
                                  }}
                                />
                              </div>
                              
                              <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-2">
                                  <label className="text-sm font-medium">Expiry Date *</label>
                                  <Input
                                    type="text"
                                    placeholder="MM/YY"
                                    maxLength={5}
                                    required
                                    value={formData.expiry}
                                    onChange={(e) => {
                                      let value = e.target.value.replace(/\D/g, '');
                                      if (value.length >= 2) {
                                        value = value.slice(0, 2) + '/' + value.slice(2, 4);
                                      }
                                      setFormData({...formData, expiry: value});
                                    }}
                                  />
                                </div>
                                <div className="space-y-2">
                                  <label className="text-sm font-medium">CVV *</label>
                                  <Input
                                    type="text"
                                    placeholder="123"
                                    maxLength={4}
                                    required
                                    value={formData.cvv}
                                    onChange={(e) => {
                                      const value = e.target.value.replace(/\D/g, '');
                                      setFormData({...formData, cvv: value});
                                    }}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Price Summary */}
                          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-4 rounded-lg border-2 border-blue-200 dark:border-blue-800">
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-sm text-gray-600 dark:text-gray-400">Video Access</span>
                              <span className="text-sm font-medium">$9.99</span>
                            </div>
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-sm text-gray-600 dark:text-gray-400">Processing Fee</span>
                              <span className="text-sm font-medium">$0.00</span>
                            </div>
                            <div className="border-t border-blue-300 dark:border-blue-700 pt-2 mt-2">
                              <div className="flex justify-between items-center">
                                <span className="font-semibold">Total Amount</span>
                                <span className="text-3xl font-bold text-blue-600">$9.99</span>
                              </div>
                            </div>
                          </div>

                          {/* Submit Button */}
                          <Button 
                            type="submit" 
                            className="w-full h-12 text-base font-semibold" 
                            size="lg"
                            disabled={isProcessing}
                          >
                            {isProcessing ? (
                              <>
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                Processing Payment...
                              </>
                            ) : (
                              <>
                                <CheckCircle className="w-5 h-5 mr-2" />
                                Pay $9.99 & Watch Now
                              </>
                            )}
                          </Button>

                          {/* Security Notice */}
                          <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
                            <Lock className="w-3 h-3" />
                            <span>Secure 256-bit SSL encrypted payment</span>
                          </div>
                          
                          <p className="text-xs text-center text-gray-500 mt-2">
                            By proceeding, you agree to our Terms of Service and Privacy Policy
                          </p>
                        </form>
                      </CardContent>
                    </Card>
                  </div>
                )}

                {/* Buffering Indicator */}
                {isBuffering && hasAccess && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/20 pointer-events-none z-10">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
                  </div>
                )}
              </>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-gray-400">
                  <Film className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p className="text-lg font-medium">No Video Loaded</p>
                  <p className="text-sm mt-2">Select a video source above to get started</p>
                </div>
              </div>
            )}
          </div>

          {/* Player Info - Only show when user has access */}
          {playerReady && hasAccess && (
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
    </div>
  );
};

export default VideoPlayerApp;