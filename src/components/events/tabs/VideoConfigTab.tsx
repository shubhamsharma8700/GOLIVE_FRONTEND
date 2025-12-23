import { useAppDispatch } from "../../../hooks/useAppDispatch";
import { useAppSelector } from "../../../hooks/useAppSelector";
import { updateField } from "../../../store/slices/eventFormSlice";

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../../ui/select";

import { Label } from "../../../components/ui/label";

export default function VideoConfigTab() {
  const dispatch = useAppDispatch();
  const form = useAppSelector((s) => s.eventForm);

  // ------------------------------------------------------------
  // Hide whole tab when eventType === "vod"
  // ------------------------------------------------------------
  if (form.eventType === "vod") return null;

  // ------------------------------------------------------------
  // Helper to update videoConfig safely
  // ------------------------------------------------------------
  const updateVideoConfig = (key: string, value: any) => {
    const config = form.videoConfig || {
      resolution: "1080p",
      frameRate: 30,
      bitrateProfile: "medium",
    };

    dispatch(
      updateField({
        key: "videoConfig",
        value: {
          ...config,
          [key]: value,
        },
      })
    );
  };

  const config = form.videoConfig || {};

  return (
    <div className="space-y-10">
      {/* ------------------------------------------------------------------ */}
      {/*                 VIDEO QUALITY SETTINGS                              */}
      {/* ------------------------------------------------------------------ */}
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold mb-1">Video Quality Settings</h3>
          <p className="text-sm text-[#6B6B6B]">
            Configure per-event streaming quality for live broadcasts
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
                <SelectValue placeholder="Select resolution" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1080p">1080p (Full HD)</SelectItem>
                <SelectItem value="720p">720p (HD)</SelectItem>
                <SelectItem value="480p">480p (SD)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Frame Rate */}
          <div className="space-y-4">
            <Label>Frame Rate</Label>
            <Select
              value={String(config.frameRate ?? 30)}
              onValueChange={(v) =>
                updateVideoConfig("frameRate", Number(v))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select FPS" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="60">60 fps</SelectItem>
                <SelectItem value="30">30 fps</SelectItem>
                <SelectItem value="25">25 fps</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Bitrate Profile */}
          <div className="space-y-4">
            <Label>Bitrate Profile</Label>
            <Select
              value={config.bitrateProfile ?? "medium"}
              onValueChange={(v) =>
                updateVideoConfig("bitrateProfile", v)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select bitrate" />
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
    </div>
  );
}
