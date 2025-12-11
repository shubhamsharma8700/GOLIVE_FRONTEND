// src/features/events/tabs/VideoConfigTab.tsx

import { useAppDispatch } from "../../../hooks/useAppDispatch";
import { useAppSelector } from "../../../hooks/useAppSelector";
import { updateField } from "../../../store/slices/eventSlice";

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../../ui/select";

import { Label } from "../../../components/ui/label";
import { Input } from "../../../components/ui/input";
import { Badge } from "../../../components/ui/badge";

export default function VideoConfigTab() {
  const dispatch = useAppDispatch();
  const form = useAppSelector((s) => s.eventForm);

  // ------------------------------------------------------------
  // Hide whole tab when eventType === "vod"
  // ------------------------------------------------------------
  if (form.eventType === "vod") return null;

  // ------------------------------------------------------------
  // Helper to update nested JSON config object
  // ------------------------------------------------------------
  const updateVideoConfig = (path: string, value: any) => {
    const config = form.videoConfig || {
      resolution: "1080p",
      frameRate: "30",
      bitrate: "medium",
      pixel: { provider: "none", id: "" },
    };

    const updated = { ...config } as any;

    if (path.startsWith("pixel.")) {
      const key = path.split(".")[1];
      updated.pixel = { 
        provider: updated.pixel?.provider ?? "none", 
        id: updated.pixel?.id ?? "", 
        [key]: value 
      };
    } else {
      updated[path] = value;
    }

    dispatch(updateField({ key: "videoConfig", value: updated }));
  };

  const config = form.videoConfig || {};

  return (
    <div className="space-y-10">

      {/* ------------------------------------------------------------------ */}
      {/*                 VIDEO QUALITY SETTINGS (Figma Style)               */}
      {/* ------------------------------------------------------------------ */}
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold mb-1">Video Quality Settings</h3>
          <p className="text-sm text-[#6B6B6B]">
            Configure basic video streaming parameters
          </p>
        </div>

        <div className="grid grid-cols-3 gap-6">

          {/* Resolution */}
          <div className="space-y-4">
            <Label>Resolution</Label>
            <Select
              value={config.resolution ?? "1080p"}
              onValueChange={(v) => updateVideoConfig("resolution", v)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Resolution" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2160p">2160p (4K)</SelectItem>
                <SelectItem value="1080p">1080p (Full HD)</SelectItem>
                <SelectItem value="720p">720p (HD)</SelectItem>
                <SelectItem value="480p">480p (SD)</SelectItem>
                <SelectItem value="360p">360p</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Frame Rate */}
          <div className="space-y-4">
            <Label>Frame Rate</Label>
            <Select
              value={config.frameRate ?? "30"}
              onValueChange={(v) => updateVideoConfig("frameRate", v)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select FPS" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="60">60 fps</SelectItem>
                <SelectItem value="30">30 fps</SelectItem>
                <SelectItem value="24">24 fps</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Bitrate */}
          <div className="space-y-4">
            <Label>Bitrate</Label>
            <Select
              value={config.bitrate ?? "medium"}
              onValueChange={(v) => updateVideoConfig("bitrate", v)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Bitrate" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/*                      TRACKING PIXELS (Optional)                    */}
      {/* ------------------------------------------------------------------ */}
      <div className="space-y-4 pt-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="mb-1">Tracking Pixels (Optional)</h3>
            <p className="text-sm text-[#6B6B6B]">
              Add tracking pixels for analytics if required
            </p>
          </div>

          <Badge className="bg-gray-100 text-gray-600">Optional</Badge>
        </div>

        <div className="grid grid-cols-2 gap-6">

          {/* Pixel Provider */}
          <div className="space-y-2">
            <Label>Pixel Provider</Label>
            <Select
              value={config.pixel?.provider ?? "none"}
              onValueChange={(v) => updateVideoConfig("pixel.provider", v)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select provider" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                <SelectItem value="facebook">Facebook Pixel</SelectItem>
                <SelectItem value="google">Google Analytics 4</SelectItem>
                <SelectItem value="linkedin">LinkedIn Insight Tag</SelectItem>
                <SelectItem value="twitter">Twitter/X Pixel</SelectItem>
                <SelectItem value="custom">Custom Pixel</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Pixel ID */}
          <div className="space-y-2">
            <Label>Pixel ID / Tracking Code</Label>
            <Input
              placeholder="Enter tracking code"
              className="font-mono text-sm"
              value={config.pixel?.id ?? ""}
              onChange={(e) => updateVideoConfig("pixel.id", e.target.value)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
