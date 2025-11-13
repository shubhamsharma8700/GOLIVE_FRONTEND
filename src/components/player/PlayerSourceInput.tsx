import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Globe, Upload, Film, Play } from "lucide-react";

interface SampleVideo {
  name: string;
  url: string;
  type: string;
  description?: string;
}

interface PlayerSourceInputProps {
  videoUrl: string;
  setVideoUrl: (url: string) => void;
  handleUrlPlay: (url?: string) => void;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  fileInputRef: React.RefObject<HTMLInputElement>;
  sampleVideos: SampleVideo[];
}

const PlayerSourceInput: React.FC<PlayerSourceInputProps> = ({
  videoUrl,
  setVideoUrl,
  handleUrlPlay,
  handleFileChange,
  fileInputRef,
  sampleVideos,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Play className="w-6 h-6" />
          Advanced VideoJS Player - Full Feature Suite
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="url" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="url" className="flex items-center gap-2">
              <Globe className="w-4 h-4" />
              URL Video
            </TabsTrigger>
            <TabsTrigger value="local" className="flex items-center gap-2">
              <Upload className="w-4 h-4" />
              Local File
            </TabsTrigger>
            <TabsTrigger value="samples" className="flex items-center gap-2">
              <Film className="w-4 h-4" />
              Sample Videos
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
              <Button onClick={() => handleUrlPlay()} disabled={!videoUrl.trim()}>
                <Play className="w-4 h-4 mr-2" />
                Load Video
              </Button>
            </div>
            <Alert>
              <AlertDescription>
                Supports: MP4, WebM, OGG, HLS (.m3u8), DASH (.mpd), and more formats
              </AlertDescription>
            </Alert>
          </TabsContent>

          <TabsContent value="local" className="space-y-4">
            <div className="flex gap-2">
              <Input
                ref={fileInputRef}
                type="file"
                accept="video/*"
                onChange={handleFileChange}
                className="flex-1"
              />
              <Button onClick={() => fileInputRef.current?.click()} variant="outline">
                <Upload className="w-4 h-4 mr-2" />
                Browse Files
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="samples" className="space-y-4">
            <div className="grid md:grid-cols-3 gap-4">
              {sampleVideos.map((video, index) => (
                <Card key={index} className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">{video.name}</h4>
                      <Badge variant="secondary">{video.type}</Badge>
                    </div>
                    {video.description && (
                      <p className="text-sm text-gray-600 mb-3">{video.description}</p>
                    )}
                    <Button size="sm" onClick={() => handleUrlPlay(video.url)} className="w-full">
                      <Play className="w-4 h-4 mr-2" />
                      Load Sample
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default PlayerSourceInput;


