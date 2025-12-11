// src/components/events/EventView.tsx
import { useEffect, useRef } from "react";
import { useGetEventByIdQuery } from "../../store/services/events.service";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { useAppSelector } from "../../hooks/useAppSelector";

import {
  loadEvent,
  setWatchingState,
  setPlaybackMode,
} from "../../store/slices/eventSlice";

import CopyText from "../common/CopyText";

import videojs from "video.js";
import type Player from "video.js/dist/types/player";
import "video.js/dist/video-js.css";

import {
  ArrowLeft,
  Hash,
  Activity,
  Circle,
  User,
  Calendar,
  Clock,
  Server,
  Link,
  Network,
} from "lucide-react";

interface EventViewProps {
  eventId: string;
  onBack: () => void;
}

export default function EventView({ eventId, onBack }: EventViewProps) {
  const { data, isLoading } = useGetEventByIdQuery(eventId);
  const dispatch = useAppDispatch();
  const event = useAppSelector((s) => s.eventForm);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const playerRef = useRef<Player | null>(null);

  /* ------------------------------------------------------
     LOAD EVENT INTO REDUX
  ------------------------------------------------------ */
  useEffect(() => {
    if (data?.event) {
      dispatch(loadEvent({ ...data.event, eventId: data.event.eventId }));
    }
  }, [data, dispatch]);

  /* ------------------------------------------------------
     VIDEO PLAYER INIT + URL UPDATE
  ------------------------------------------------------ */
  useEffect(() => {
    if (!videoRef.current) return;
    if (!event.playbackUrl) return;

    // FIRST INITIALIZATION
    if (!playerRef.current) {
      playerRef.current = videojs(videoRef.current, {
        controls: true,
        preload: "auto",
        fluid: true,
        autoplay: false,
        sources: [{ src: event.playbackUrl, type: "application/x-mpegURL" }],
      });

      dispatch(setWatchingState(true));

      playerRef.current.ready(() => {
        if (!videoRef.current) return;
        (videoRef.current as any).player = playerRef.current;

        setTimeout(() => {
          addQualityButtonToControlBar(playerRef.current!, event.playbackUrl!);
        }, 60);
      });
    }

    // UPDATE SOURCE WHEN URL CHANGES
    else {
      playerRef.current.src({
        src: event.playbackUrl,
        type: "application/x-mpegURL",
      });
    }

    // CLEANUP ONLY ON UNMOUNT
    return () => {
      playerRef.current?.dispose();
      playerRef.current = null;
    };
  }, [event.playbackUrl]);

  if (isLoading) return <div className="p-6">Loading...</div>;

  return (
    <div className="space-y-6 pb-20">
      <Header event={event} onBack={onBack} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PlayerBlock event={event} videoRef={videoRef} dispatch={dispatch} />
        <EventDetails event={event} />
      </div>

      <DescriptionSection text={event.description} />
      <StreamConfig event={event} />
      <VodStatus event={event} />
    </div>
  );
}

/* ------------------------------------------------------
   QUALITY BUTTON (UNCHANGED)
------------------------------------------------------ */

function addQualityButtonToControlBar(player: Player | null, masterUrl: string) {
  if (!player) return;
  if ((player as any)._golive_quality_button_added) return;

  const controlBarEl = player.getChild("controlBar")?.el();
  if (!controlBarEl) {
    setTimeout(() => addQualityButtonToControlBar(player, masterUrl), 40);
    return;
  }

  const container = document.createElement("div");
  container.className = "golive-quality-container relative ml-2";
  container.style.display = "inline-block";

  const btn = document.createElement("button");
  btn.className =
    "golive-quality-button flex items-center gap-1 px-2 py-1 text-xs bg-transparent text-white hover:text-gray-200";
  btn.style.border = "none";
  btn.style.cursor = "pointer";

  btn.innerHTML = `
    <span style="display:inline-flex;align-items:center;gap:6px;">
      <svg width="16" height="16" stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24">
        <polyline points="7 10 12 5 17 10"/>
        <line x1="12" y1="5" x2="12" y2="15"/>
      </svg>
      <svg width="12" height="12" stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24">
        <polyline points="6 9 12 15 18 9"></polyline>
      </svg>
    </span>`;

  const dropdown = document.createElement("div");
  dropdown.className =
    "golive-quality-dropdown absolute right-0 mt-2 w-36 bg-white text-black rounded shadow z-50 hidden";
  dropdown.style.padding = "0.25rem";

  const showDropdown = () => dropdown.classList.remove("hidden");
  const hideDropdown = () => dropdown.classList.add("hidden");

  const createItem = (label: string, onClick: () => void) => {
    const item = document.createElement("button");
    item.className = "w-full text-left px-3 py-2 text-sm hover:bg-gray-100 rounded";
    item.innerText = label;
    item.onclick = (e) => {
      e.stopPropagation();
      onClick();
      hideDropdown();
    };
    return item;
  };

  const populate = () => {
    dropdown.innerHTML = "";
    dropdown.appendChild(
      createItem("Auto", () => {
        player.src({ src: masterUrl, type: "application/x-mpegURL" });
        player.play();
      })
    );

    try {
      const tech = (player as any).tech?.(true);
      const lists = tech?.vhs?.playlists?.master?.playlists || [];

      const seen = new Set();
      lists.forEach((p: any) => {
        const h = p?.attributes?.RESOLUTION?.height ?? null;
        if (seen.has(h)) return;
        seen.add(h);
        const label = h ? `${h}p` : "Unknown";
        dropdown.appendChild(
          createItem(label, () => {
            tech.vhs.selectPlaylist = () => p;
            player.play();
          })
        );
      });

      if (lists.length === 0) dropdown.append("No variants");
    } catch {
      dropdown.append("Quality unavailable");
    }
  };

  btn.onclick = (e) => {
    e.stopPropagation();
    dropdown.classList.contains("hidden") ? (populate(), showDropdown()) : hideDropdown();
  };

  const outside = (e: MouseEvent) => {
    if (!container.contains(e.target as Node)) hideDropdown();
  };
  document.addEventListener("click", outside);

  container.appendChild(btn);
  container.appendChild(dropdown);
  controlBarEl.appendChild(container);

  (player as any)._golive_quality_button_added = true;
  (player as any)._golive_quality_button_refs = { container, dropdown, outside };
}

// function removeQualityButtonFromControlBar(player: Player | null) {
//   if (!player) return;
//   const refs = (player as any)._golive_quality_button_refs;
//   if (!refs) return;

//   try {
//     refs.container.remove();
//     document.removeEventListener("click", refs.outside);
//   } catch {}

//   delete (player as any)._golive_quality_button_refs;
//   delete (player as any)._golive_quality_button_added;
// }

/* ------------------------------------------------------
   UI COMPONENTS
------------------------------------------------------ */

function Header({ event, onBack }: any) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft size={20} /> Back
        </button>

        <div>
          <h1 className="text-xl font-semibold text-gray-900">{event.title}</h1>
          <p className="text-sm text-gray-500">Overview of event configuration</p>
        </div>
      </div>

      <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded text-sm">
        {event.eventType?.toUpperCase()}
      </span>
    </div>
  );
}

function PlayerBlock({ event, videoRef, dispatch }: any) {
  const hasVod = Boolean(event.vodCloudFrontUrl);
  const showToggle = event.eventType === "live" && hasVod;

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 relative">
      {showToggle && (
        <div className="flex gap-3 mb-4">
          <button
            className={`px-3 py-1 rounded ${
              event.playbackMode === "live" ? "bg-blue-600 text-white" : "bg-gray-200"
            }`}
            onClick={() => dispatch(setPlaybackMode("live"))}
          >
            Live Stream
          </button>

          <button
            className={`px-3 py-1 rounded ${
              event.playbackMode === "vod" ? "bg-green-600 text-white" : "bg-gray-200"
            }`}
            onClick={() => dispatch(setPlaybackMode("vod"))}
          >
            VOD Replay
          </button>
        </div>
      )}

      <div className="aspect-video bg-black rounded-lg overflow-hidden">
        <video
          ref={videoRef}
          className="video-js vjs-default-skin vjs-big-play-centered w-full h-full"
        />
      </div>
    </div>
  );
}

function EventDetails({ event }: any) {
  return (
    <Section title="Event Details">
      <div className="grid grid-cols-2 gap-x-8 gap-y-4">
        <Info label="Event ID" icon={<Hash size={14} />}>
          <CopyText text={event.eventId} />
        </Info>

        <Info label="Type" icon={<Activity size={14} />} value={event.eventType} />

        <Info label="Status" icon={<Circle size={14} />}>
          <StatusBadge status={event.status} />
        </Info>

        <Info label="Created By" icon={<User size={14} />} value={event.createdBy} />

        <Info label="Created At" icon={<Calendar size={14} />} value={formatDate(event.createdAt)} />

        <Info label="Updated At" icon={<Clock size={14} />} value={formatDate(event.updatedAt)} />
      </div>
    </Section>
  );
}

function DescriptionSection({ text }: any) {
  return (
    <Section title="Description">
      <p className="text-gray-700">{text || "No description provided."}</p>
    </Section>
  );
}

function StreamConfig({ event }: any) {
  return (
    <Section title="Live Streaming Configuration">
      <div className="grid grid-cols-2 gap-x-8 gap-y-4">
        <Info label="CloudFront URL" icon={<Link size={14} />}>
          <CopyText text={event.cloudFrontUrl} />
        </Info>

        <Info label="MediaPackage URL" icon={<Network size={14} />}>
          <CopyText text={event.mediaPackageUrl} />
        </Info>

        <Info label="RTMP URL" icon={<Server size={14} />}>
          <CopyText text={event.rtmpInputUrl} />
        </Info>

        <Info label="MediaLive Channel ID" value={event.mediaLiveChannelId} />
        <Info label="MediaPackage Channel ID" value={event.mediaPackageChannelId} />
        <Info label="Distribution ID" value={event.distributionId} />
      </div>
    </Section>
  );
}

function VodStatus({ event }: any) {
  return (
    <Section title="VOD Status">
      <div className="grid grid-cols-2 gap-x-8 gap-y-4">
        <Info label="VOD Status" value={event.vodStatus} />
        <Info label="VOD Job ID" value={event.vodJobId} />
        <Info label="VOD Output Path" value={event.vodOutputPath} />
      </div>
    </Section>
  );
}

/* ------------------------------------------------------
   SHARED COMPONENTS
------------------------------------------------------ */

function Info({ label, icon, value, children }: any) {
  return (
    <div>
      <label className="text-sm text-gray-500 flex items-center gap-1.5">
        {icon} {label}
      </label>

      {children ? (
        children
      ) : (
        <p className="mt-1 text-gray-900">{value || "N/A"}</p>
      )}
    </div>
  );
}

function Section({ title, children }: any) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      {children}
    </div>
  );
}

function StatusBadge({ status }: any) {
  let color =
    status === "live"
      ? "bg-red-50 text-red-600"
      : status === "Ready for Live"
      ? "bg-blue-50 text-blue-600"
      : "bg-gray-100 text-gray-700";

  return (
    <span className={`px-2 py-0.5 rounded text-sm ${color}`}>
      {status || "N/A"}
    </span>
  );
}

function formatDate(date?: string | null) {
  if (!date) return "N/A";
  return new Date(date).toLocaleString();
}
