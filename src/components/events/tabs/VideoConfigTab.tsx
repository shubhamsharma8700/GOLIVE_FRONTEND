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

  // 👉 HIDE THIS ENTIRE TAB for VOD EVENTS
  if (form.eventType === "vod") return null;

  return (
    <div className="space-y-10">

      {/* --------------------------------------------- */}
      {/*   VIDEO QUALITY SETTINGS (FIGMA STYLE)        */}
      {/* --------------------------------------------- */}
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold mb-1">Video Quality Settings</h3>
          <p className="text-sm text-[#6B6B6B]">
            Configure basic video streaming parameters
          </p>
        </div>

        <div className="grid grid-cols-3 gap-6">

          {/* Resolution */}
          <div className="space-y-2">
            <Label>Resolution</Label>
            <Select
              value={form.videoResolution ?? "1080p"}
              onValueChange={(v) =>
                dispatch(updateField({ key: "videoResolution", value: v }))
              }
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
          <div className="space-y-2">
            <Label>Frame Rate</Label>
            <Select
              value={form.frameRate ?? "30"}
              onValueChange={(v) =>
                dispatch(updateField({ key: "frameRate", value: v }))
              }
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
          <div className="space-y-2">
            <Label>Bitrate</Label>
            <Select
              value={form.bitrate ?? "medium"}
              onValueChange={(v) =>
                dispatch(updateField({ key: "bitrate", value: v }))
              }
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

      {/* --------------------------------------------- */}
      {/*        TRACKING PIXELS SECTION                */}
      {/* --------------------------------------------- */}
      <div className="space-y-4 border-t pt-6">
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
          <div className="space-y-2">
            <Label>Pixel Provider</Label>
            <Select
              value={form.pixelProvider ?? "none"}
              onValueChange={(v) =>
                dispatch(updateField({ key: "pixelProvider", value: v }))
              }
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

          <div className="space-y-2">
            <Label>Pixel ID / Tracking Code</Label>
            <Input
              placeholder="Enter tracking code"
              className="font-mono text-sm"
              value={form.pixelId ?? ""}
              onChange={(e) =>
                dispatch(updateField({ key: "pixelId", value: e.target.value }))
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
}
