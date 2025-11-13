import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { BarChart3 } from "lucide-react";

interface AnalyticsData {
  totalViews: number;
  watchTime: number;
  completionRate: number;
  engagementScore: number;
  bufferingEvents: number;
  qualityChanges: number;
}

interface PlayerAnalyticsCardProps {
  analyticsData: AnalyticsData;
  resetAnalytics: () => void;
  analyticsEnabled: boolean;
  setAnalyticsEnabled: (enabled: boolean) => void;
}

const PlayerAnalyticsCard: React.FC<PlayerAnalyticsCardProps> = ({
  analyticsData,
  resetAnalytics,
  analyticsEnabled,
  setAnalyticsEnabled,
}) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="w-5 h-5" />
          Analytics
        </CardTitle>
        <Button size="sm" variant="outline" onClick={resetAnalytics}>
          Reset
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{analyticsData.totalViews}</div>
            <div className="text-xs text-blue-600">Total Views</div>
          </div>

          <div className="text-center p-3 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">{Math.round(analyticsData.watchTime)}s</div>
            <div className="text-xs text-green-600">Watch Time</div>
          </div>

          <div className="text-center p-3 bg-purple-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">{Math.round(analyticsData.completionRate)}%</div>
            <div className="text-xs text-purple-600">Completion</div>
          </div>

          <div className="text-center p-3 bg-orange-50 rounded-lg">
            <div className="text-2xl font-bold text-orange-600">{Math.round(analyticsData.engagementScore)}</div>
            <div className="text-xs text-orange-600">Engagement</div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Buffering Events:</span>
            <Badge variant="outline">{analyticsData.bufferingEvents}</Badge>
          </div>
          <div className="flex justify-between text-sm">
            <span>Quality Changes:</span>
            <Badge variant="outline">{analyticsData.qualityChanges}</Badge>
          </div>
        </div>

        <div className="flex items-center space-x-2 pt-2">
          <Switch id="analytics" checked={analyticsEnabled} onCheckedChange={setAnalyticsEnabled} />
          <label htmlFor="analytics" className="text-sm">
            Enable Analytics
          </label>
        </div>
      </CardContent>
    </Card>
  );
};

export default PlayerAnalyticsCard;


