import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Settings, Palette } from "lucide-react";

interface PlayerConfig {
  fluid: boolean;
  responsive: boolean;
  playbackRates: number[];
  hotkeys: boolean;
  pip: boolean;
  quality: boolean;
  analytics: boolean;
  thumbnails: boolean;
  markers: boolean;
  chapters: boolean;
  loop: boolean;
  muted: boolean;
  autoplay: boolean;
  preload: "auto" | "metadata" | "none";
  volume: number;
  currentTime: number;
}

interface UiConfig {
  theme: string;
  primaryColor: string;
  showControls: boolean;
  controlBar: Record<string, boolean>;
}

interface PlayerConfigPanelProps {
  playerConfig: PlayerConfig;
  setPlayerConfig: React.Dispatch<React.SetStateAction<PlayerConfig>>;
  uiConfig: UiConfig;
  setUiConfig: React.Dispatch<React.SetStateAction<UiConfig>>;
  playbackRate: number;
  changePlaybackRate: (rate: number) => void;
  themes: { label: string; value: string }[];
}

const PlayerConfigPanel: React.FC<PlayerConfigPanelProps> = ({
  playerConfig,
  setPlayerConfig,
  uiConfig,
  setUiConfig,
  playbackRate,
  changePlaybackRate,
  themes,
}) => {
  return (
    <div className="grid lg:grid-cols-3 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Player Config
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {[
              { key: "fluid", label: "Fluid" },
              { key: "responsive", label: "Responsive" },
              { key: "hotkeys", label: "Hotkeys" },
              { key: "pip", label: "PiP" },
              { key: "loop", label: "Loop" },
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

          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium mb-2 block">Preload</label>
              <Select
                value={playerConfig.preload}
                onValueChange={(value: "auto" | "metadata" | "none") =>
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
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="w-5 h-5" />
            UI Config
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Theme</label>
            <Select
              value={uiConfig.theme}
              onValueChange={(value) => setUiConfig((prev) => ({ ...prev, theme: value }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {themes.map((theme) => (
                  <SelectItem key={theme.value} value={theme.value}>
                    {theme.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Primary Color</label>
            <Input
              type="color"
              value={uiConfig.primaryColor}
              onChange={(e) => setUiConfig((prev) => ({ ...prev, primaryColor: e.target.value }))}
            />
          </div>

          <div className="space-y-2">
            <h4 className="text-sm font-medium">Control Bar Features</h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {Object.entries(uiConfig.controlBar)
                .slice(0, 6)
                .map(([key, value]) => (
                  <div key={key} className="flex items-center space-x-1">
                    <Switch
                      id={key}
                      checked={value}
                      onCheckedChange={(checked) =>
                        setUiConfig((prev) => ({
                          ...prev,
                          controlBar: { ...prev.controlBar, [key]: checked },
                        }))
                      }
                    />
                    <label htmlFor={key} className="text-xs capitalize">
                      {key.replace(/([A-Z])/g, " $1").trim()}
                    </label>
                  </div>
                ))}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Playback Rates</label>
            <div className="flex flex-wrap gap-1">
              {playerConfig.playbackRates.map((rate) => (
                <Button
                  key={rate}
                  size="sm"
                  variant={playbackRate === rate ? "default" : "outline"}
                  onClick={() => changePlaybackRate(rate)}
                  className="text-xs"
                >
                  {rate}x
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PlayerConfigPanel;


