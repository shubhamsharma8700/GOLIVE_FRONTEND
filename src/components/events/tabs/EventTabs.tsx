import { type ReactElement } from "react";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "../../../components/ui/tabs";

interface EventTabsProps {
  children: ReactElement[]; // must receive exactly: [detailsTab, videoTab(or null), accessTab]
}

export default function EventTabs({ children }: EventTabsProps) {
  // children[0] = EventDetailsTab
  // children[1] = VideoConfigTab (can be null for VOD)
  // children[2] = AccessSecurityTab

  const [detailsTab, videoTab, accessTab] = children;

  // Build tab config dynamically → hides video tab if videoTab === null
  const visibleTabs = [
    { id: "details", label: "Event Details", content: detailsTab },
    ...(videoTab ? [{ id: "video", label: "Video Config", content: videoTab }] : []),
    { id: "access", label: "Access & Security", content: accessTab },
  ];

  return (
    <Tabs defaultValue="details" className="space-y-6">
      {/* ------------------------------ */}
      {/*          TAB HEADERS           */}
      {/* ------------------------------ */}
      <TabsList className="bg-white border rounded-md">
        {visibleTabs.map((tab) => (
          <TabsTrigger
            key={tab.id}
            value={tab.id}
            className="
              data-[state=active]:bg-[#B89B5E]
              data-[state=active]:text-white
              px-4 py-2
            "
          >
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>

      {/* ------------------------------ */}
      {/*          TAB CONTENT            */}
      {/* ------------------------------ */}
      {visibleTabs.map((tab) => (
        <TabsContent key={tab.id} value={tab.id}>
          {tab.content}
        </TabsContent>
      ))}
    </Tabs>
  );
}
