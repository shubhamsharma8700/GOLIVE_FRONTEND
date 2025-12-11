// src/features/events/tabs/EventTabs.tsx

import { type ReactElement } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../../../components/ui/tabs";
import { useAppSelector } from "../../../hooks/useAppSelector";

// Icons
import { FileText, Video, ShieldCheck } from "lucide-react";

interface EventTabsProps {
  children: ReactElement[]; // expected: [Details, Video, Access]
}

export default function EventTabs({ children }: EventTabsProps) {
  const eventType = useAppSelector((s) => s.eventForm.eventType);

  // ----------------------------------------------------
  // TAB CONFIG (with icons)
  // ----------------------------------------------------
  const baseTabs = [
    { id: "details", label: "Event Details", icon: FileText },
    { id: "video", label: "Video Config", icon: Video },
    { id: "access", label: "Access & Security", icon: ShieldCheck },
  ];

  // When VOD → remove Video Config tab entirely
  const visibleTabs = eventType === "vod"
    ? baseTabs.filter((t) => t.id !== "video")
    : baseTabs;

  // Children mapping
  const tabContentMap: Record<string, ReactElement> = {
    details: children[0],
    video: children[1],
    access: children[2],
  };

  return (
    <Tabs defaultValue={visibleTabs[0].id} className="space-y-6">

      {/* TAB LIST */}
      <TabsList className="bg-white border">
        {visibleTabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <TabsTrigger
              key={tab.id}
              value={tab.id}
              className="
                flex items-center gap-2
                data-[state=active]:bg-[#B89B5E]
                data-[state=active]:text-white
              "
            >
              <Icon size={16} />
              {tab.label}
            </TabsTrigger>
          );
        })}
      </TabsList>

      {/* TAB CONTENT */}
      {visibleTabs.map((tab) => (
        <TabsContent key={tab.id} value={tab.id}>
          {tabContentMap[tab.id]}
        </TabsContent>
      ))}
    </Tabs>
  );
}
