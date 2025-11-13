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
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Copy,
  Play,
  Upload,
  Share,
  Globe,
  Settings,
  Monitor,
  Film,
  Star,
  AlertCircle,
  CheckCircle,
} from "lucide-react";

interface VideoPlayerProps {
  onVideoLoad?: () => void;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ onVideoLoad }) => {
  // State management
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

  const [playerConfig, setPlayerConfig] = useState({
    fluid: true,
    responsive: true,
    playbackRates: [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2],
    hotkeys: true,
    pip: true,
    loop: false,
    muted: false,
    autoplay: false,
    preload: "metadata" as "auto" | "metadata" | "none",
  });

  // Refs
  const videoRef = useRef<HTMLVideoElement>(null);
  const playerInstanceRef = useRef<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Sample videos with working URLs
  const sampleVideos = [
    {
      name: "Big Buck Bunny",
      url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
      type: "MP4",
      description: "Open source 3D animated short film",
    },
    {
      name: "Elephant's Dream",
      url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
      type: "MP4",
      description: "First open movie made with open source tools",
    },
    {
      name: "Sintel",
      url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
      type: "MP4",
      description: "Fantasy adventure short film",
    },
  ];

  // Initialize Video.js with proper plugin handling
  useEffect(() => {
    if (!currentVideoSrc || !videoRef.current) return;

    // Dynamically load Video.js
    const loadVideoJS = async () => {
      try {
        // Clean up existing player
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

        // Load Video.js CSS
        if (!document.getElementById("videojs-css")) {
          const link = document.createElement("link");
          link.id = "videojs-css";
          link.rel = "stylesheet";
          link.href = "https://unpkg.com/video.js@8/dist/video-js.min.css";
          document.head.appendChild(link);
        }

        // Load Video.js script
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

        // Initialize player with options
        const options = {
          controls: true,
          autoplay: playerConfig.autoplay,
          preload: playerConfig.preload,
          muted: playerConfig.muted,
          loop: playerConfig.loop,
          fluid: playerConfig.fluid,
          responsive: playerConfig.responsive,
          playbackRates: playerConfig.playbackRates,
          controlBar: {
            volumePanel: { inline: false },
            pictureInPictureToggle: playerConfig.pip,
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
          src: currentVideoSrc,
          type: getMimeType(currentVideoSrc),
        });

        // Event handlers
        player.ready(() => {
          setPlayerReady(true);

          // Notify parent that video is loaded
          if (onVideoLoad) {
            onVideoLoad();
          }
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
        });

        player.on("play", () => {
          // setIsPlaying(true); // Removed
        });
        player.on("pause", () => {
          // setIsPlaying(false); // Removed
        });
        player.on("volumechange", () => {
          setVolume(player.volume());
          // setIsMuted(player.muted()); // Removed
        });

        player.on("waiting", () => {
          setIsBuffering(true);
        });

        player.on("canplay", () => setIsBuffering(false));
        player.on("ratechange", () => setPlaybackRate(player.playbackRate()));
        player.on("fullscreenchange", () => {
          // setIsFullscreen(player.isFullscreen()); // Removed
        });

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
  }, [currentVideoSrc, playerConfig]);

  // Keyboard shortcuts
  useEffect(() => {
    if (!playerConfig.hotkeys) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const player = playerInstanceRef.current;
      if (!player || !playerReady) return;

      if (
        e.target === document.body ||
        (e.target as HTMLElement).closest(".video-container")
      ) {
        switch (e.code) {
          case "Space":
            e.preventDefault();
            if (player.paused()) player.play();
            else player.pause();
            break;
          case "KeyF":
            e.preventDefault();
            if (player.isFullscreen()) player.exitFullscreen();
            else player.requestFullscreen();
            break;
          case "KeyM":
            e.preventDefault();
            player.muted(!player.muted());
            break;
          case "ArrowLeft":
            e.preventDefault();
            player.currentTime(Math.max(0, player.currentTime() - 10));
            break;
          case "ArrowRight":
            e.preventDefault();
            player.currentTime(
              Math.min(player.duration(), player.currentTime() + 10)
            );
            break;
          case "ArrowUp":
            e.preventDefault();
            player.volume(Math.min(1, player.volume() + 0.1));
            break;
          case "ArrowDown":
            e.preventDefault();
            player.volume(Math.max(0, player.volume() - 0.1));
            break;
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [playerConfig.hotkeys, playerReady]);

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

      // Scroll to player after a short delay
      setTimeout(() => {
        document.getElementById("video-player-section")?.scrollIntoView({
          behavior: "smooth",
          block: "start",
          inline: "nearest",
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
      generateEmbedCode(fileUrl);
    }
  };

  const generateEmbedCode = (src: string) => {
    const embedScript = `<!-- Video.js Player -->
<link href="https://unpkg.com/video.js@8/dist/video-js.min.css" rel="stylesheet" />
<script src="https://unpkg.com/video.js@8/dist/video.min.js"></script>

<video 
  id="my-player"
  class="video-js vjs-default-skin vjs-big-play-centered"
  controls 
  preload="${playerConfig.preload}"
  ${playerConfig.loop ? "loop" : ""}
  ${playerConfig.muted ? "muted" : ""}
  ${playerConfig.autoplay ? "autoplay" : ""}
  data-setup='{"playbackRates": ${JSON.stringify(playerConfig.playbackRates)}}'
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

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6 space-y-4 md:space-y-6">
      {/* Video Player - Shows first when video is loaded */}
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
          </CardHeader>
          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div
              ref={containerRef}
              className="video-container relative bg-black rounded-lg overflow-hidden shadow-lg"
            >
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

            {/* Playback Info */}
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

      {/* Video Input Section */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Play className="w-6 h-6 text-blue-600" />
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
                    className="hover:shadow-md transition-shadow"
                  >
                    <CardContent className="p-4">
                      <h4 className="font-medium mb-1">{video.name}</h4>
                      <p className="text-sm text-gray-600 mb-3">
                        {video.description}
                      </p>
                      <Button
                        size="sm"
                        onClick={() => handleUrlPlay(video.url)}
                        className="w-full"
                      >
                        <Play className="w-4 h-4 mr-2" />
                        Load
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Configuration */}
      <div className="grid lg:grid-cols-2 gap-4 md:gap-6">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5 text-blue-600" />
              Player Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-3 md:gap-4">
              {[
                { key: "fluid", label: "Fluid Layout" },
                { key: "responsive", label: "Responsive" },
                { key: "hotkeys", label: "Keyboard Shortcuts" },
                { key: "pip", label: "Picture-in-Picture" },
                { key: "loop", label: "Loop Video" },
                { key: "autoplay", label: "Autoplay" },
              ].map(({ key, label }) => (
                <div key={key} className="flex items-center space-x-2">
                  <Switch
                    id={key}
                    checked={(playerConfig as any)[key]}
                    onCheckedChange={(checked) =>
                      setPlayerConfig((prev) => ({ ...prev, [key]: checked }))
                    }
                  />
                  <label htmlFor={key} className="text-sm">
                    {label}
                  </label>
                </div>
              ))}
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Preload</label>
              <Select
                value={playerConfig.preload}
                onValueChange={(value: any) =>
                  setPlayerConfig((prev) => ({ ...prev, preload: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="auto">Auto</SelectItem>
                  <SelectItem value="metadata">Metadata</SelectItem>
                  <SelectItem value="none">None</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Features */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="w-5 h-5 text-blue-600" />
              Features & Capabilities
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-4 gap-4">
              {[
                { label: "Video Player", active: !!currentVideoSrc },
                { label: "Keyboard Controls", active: playerConfig.hotkeys },
                { label: "Analytics", active: false },
                { label: "Multiple Formats", active: true },
                { label: "Picture-in-Picture", active: playerConfig.pip },
                { label: "Fullscreen", active: true },
                { label: "Playback Speeds", active: true },
                { label: "Embed Generation", active: true },
              ].map((feature, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <Badge variant={feature.active ? "default" : "secondary"}>
                    {feature.active ? "Active" : "Inactive"}
                  </Badge>
                  <span className="text-sm">{feature.label}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default VideoPlayer;
