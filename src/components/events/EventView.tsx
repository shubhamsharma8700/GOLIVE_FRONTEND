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

// Quality selector
import "videojs-contrib-quality-levels";
import "jb-videojs-hls-quality-selector";

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
  PlayCircle,
  Radio,
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
      const isLive = event.playbackMode === "live";
      
      const player = videojs(videoRef.current, {
        autoplay: false,
        muted: false,
        controls: true,
        preload: "auto",
        fluid: true,
        responsive: true,
        aspectRatio: "16:9",
        liveui: isLive,
        playbackRates: [0.5, 1, 1.5, 2],
        controlBar: {
          volumePanel: { inline: false },
          remainingTimeDisplay: { displayNegative: false },
          playbackRateMenuButton: true,
          pictureInPictureToggle: true,
          fullscreenToggle: true,
        },
        html5: {
          vhs: {
            overrideNative: true,
            smoothQualityChange: true,
            enableLowInitialPlaylist: true,
          },
        },
      });

      playerRef.current = player;

      player.src({
        src: event.playbackUrl,
        type: "application/x-mpegURL",
      });

      dispatch(setWatchingState(true));

      player.ready(() => {
        if (!videoRef.current) return;
        (videoRef.current as any).player = playerRef.current;

        const anyPlayer = player as any;
        if (typeof anyPlayer.hlsQualitySelector === "function") {
          anyPlayer.hlsQualitySelector({ displayCurrentQuality: true });
        }
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
  }, [event.playbackUrl, event.playbackMode, dispatch]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading event details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-2 pb-20">
      <Header event={event} onBack={onBack} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <PlayerBlock event={event} videoRef={videoRef} dispatch={dispatch} />
        </div>
        
        <div className="lg:col-span-1">
          <EventQuickInfo event={event} />
        </div>
      </div>

      {event.description && <DescriptionSection text={event.description} />}
      
      <StreamConfig event={event} />
      
      {event.vodStatus && <VodSection event={event} />}
    </div>
  );
}

/* ------------------------------------------------------
   UI COMPONENTS
------------------------------------------------------ */

function Header({ event, onBack }: any) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
          >
            <ArrowLeft size={12} />
            <span className="font-medium">Back</span>
          </button>

          <div className="border-l border-gray-200 pl-4">
            <h3 className="text-xl font-bold text-gray-900">{event.title}</h3>
            <p className="text-sm text-gray-500 mt-1">Event configuration and playback</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <TypeBadge type={event.eventType} />
          <StatusBadge status={event.status} />
        </div>
      </div>
    </div>
  );
}

function PlayerBlock({ event, videoRef, dispatch }: any) {
  const hasVod = Boolean(event.vodCloudFrontUrl);
  const showToggle = event.eventType === "live" && hasVod;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      {showToggle && (
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200">
          <div className="flex gap-2">
            <button
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                event.playbackMode === "live"
                  ? "bg-red-500 text-white shadow-md"
                  : "bg-white text-gray-600 hover:bg-gray-50"
              }`}
              onClick={() => dispatch(setPlaybackMode("live"))}
            >
              <Radio size={16} />
              Live Stream
            </button>

            <button
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                event.playbackMode === "vod"
                  ? "bg-blue-500 text-white shadow-md"
                  : "bg-white text-gray-600 hover:bg-gray-50"
              }`}
              onClick={() => dispatch(setPlaybackMode("vod"))}
            >
              <PlayCircle size={16} />
              VOD Replay
            </button>
          </div>
        </div>
      )}

      <div className="p-4">
        <div className="aspect-video bg-black rounded-lg overflow-hidden">
          <video
            ref={videoRef}
            className="video-js vjs-default-skin vjs-big-play-centered w-full h-full"
          />
        </div>
      </div>
    </div>
  );
}

function EventQuickInfo({ event }: any) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 h-full">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Event Details</h3>
      
      <div className="space-y-4">
        <InfoRow label="Event ID" icon={<Hash size={16} />}>
          <CopyText text={event.eventId} />
        </InfoRow>

        <InfoRow label="Type" icon={<Activity size={16} />}>
          <span className="text-gray-900 font-medium capitalize">{event.eventType || "N/A"}</span>
        </InfoRow>

        <InfoRow label="Status" icon={<Circle size={16} />}>
          <StatusBadge status={event.status} compact />
        </InfoRow>

        <InfoRow label="Created By" icon={<User size={16} />}>
          <span className="text-gray-900 text-sm">{event.createdBy || "N/A"}</span>
        </InfoRow>

        <InfoRow label="Created" icon={<Calendar size={16} />}>
          <span className="text-gray-900 text-sm">{formatDate(event.createdAt)}</span>
        </InfoRow>

        <InfoRow label="Last Updated" icon={<Clock size={16} />}>
          <span className="text-gray-900 text-sm">{formatDate(event.updatedAt)}</span>
        </InfoRow>

        {event.startTime && (
          <InfoRow label="Start Time" icon={<Clock size={16} />}>
            <span className="text-gray-900 text-sm">{formatDate(event.startTime)}</span>
          </InfoRow>
        )}

        {event.endTime && (
          <InfoRow label="End Time" icon={<Clock size={16} />}>
            <span className="text-gray-900 text-sm">{formatDate(event.endTime)}</span>
          </InfoRow>
        )}
      </div>
    </div>
  );
}

function DescriptionSection({ text }: any) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
      <p className="text-gray-700 leading-relaxed">{text || "No description provided."}</p>
    </div>
  );
}

function StreamConfig({ event }: any) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center gap-2 mb-5">
        <Radio size={20} className="text-blue-600" />
        <h3 className="text-lg font-semibold text-gray-900">Live Streaming Configuration</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">
        <InfoField label="CloudFront URL" icon={<Link size={16} />}>
          <CopyText text={event.cloudFrontUrl} />
        </InfoField>

        <InfoField label="MediaPackage URL" icon={<Network size={16} />}>
          <CopyText text={event.mediaPackageUrl} />
        </InfoField>

        <InfoField label="RTMP Input URL" icon={<Server size={16} />}>
          <CopyText text={event.rtmpInputUrl} />
        </InfoField>

        <InfoField label="CloudFront Domain">
          <span className="text-sm text-gray-900">{event.cloudFrontDomain || "N/A"}</span>
        </InfoField>

        <InfoField label="MediaLive Channel ID">
          <span className="text-sm text-gray-900 font-mono">{event.mediaLiveChannelId || "N/A"}</span>
        </InfoField>

        <InfoField label="MediaPackage Channel ID">
          <span className="text-sm text-gray-900 font-mono">{event.mediaPackageChannelId || "N/A"}</span>
        </InfoField>

        <InfoField label="Distribution ID">
          <span className="text-sm text-gray-900 font-mono">{event.distributionId || "N/A"}</span>
        </InfoField>

        <InfoField label="Channel State">
          <span className={`text-sm font-medium ${event.channelState === 'IDLE' ? 'text-gray-600' : 'text-green-600'}`}>
            {event.channelState || "N/A"}
          </span>
        </InfoField>
      </div>
    </div>
  );
}

function VodSection({ event }: any) {
  const hasVodUrls = event.vod1080pUrl || event.vod720pUrl || event.vod480pUrl;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center gap-2 mb-5">
        <PlayCircle size={20} className="text-blue-600" />
        <h3 className="text-lg font-semibold text-gray-900">VOD Configuration</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">
        <InfoField label="VOD Status">
          <span className={`text-sm font-semibold ${
            event.vodStatus === 'READY' ? 'text-green-600' : 
            event.vodStatus === 'PROCESSING' ? 'text-yellow-600' : 
            'text-gray-600'
          }`}>
            {event.vodStatus || "N/A"}
          </span>
        </InfoField>

        <InfoField label="VOD Job ID">
          <span className="text-sm text-gray-900 font-mono">{event.vodJobId || "N/A"}</span>
        </InfoField>

        <InfoField label="VOD Output Path">
          <span className="text-sm text-gray-900 break-all">{event.vodOutputPath || "N/A"}</span>
        </InfoField>

        <InfoField label="Processing Start Time">
          <span className="text-sm text-gray-900">{formatDate(event.vodProcessingStartTime)}</span>
        </InfoField>

        {event.vodCloudFrontUrl && (
          <InfoField label="VOD CloudFront URL" className="md:col-span-2">
            <CopyText text={event.vodCloudFrontUrl} />
          </InfoField>
        )}
      </div>

      {hasVodUrls && (
        <>
          <div className="mt-6 pt-6 border-t border-gray-200">
            <h4 className="text-sm font-semibold text-gray-700 mb-4">Available Quality Variants</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {event.vod1080pUrl && (
                <QualityCard label="1080p (Full HD)" url={event.vod1080pUrl} />
              )}
              {event.vod720pUrl && (
                <QualityCard label="720p (HD)" url={event.vod720pUrl} />
              )}
              {event.vod480pUrl && (
                <QualityCard label="480p (SD)" url={event.vod480pUrl} />
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

/* ------------------------------------------------------
   SHARED COMPONENTS
------------------------------------------------------ */

function InfoRow({ label, icon, children }: any) {
  return (
    <div className="flex items-start justify-between gap-3 py-2 border-b border-gray-100 last:border-0">
      <label className="text-xs font-medium text-gray-500 flex items-center gap-1.5 min-w-0">
        <span className="text-gray-400">{icon}</span>
        <span className="truncate">{label}</span>
      </label>
      <div className="text-right min-w-0 flex-1">{children}</div>
    </div>
  );
}

function InfoField({ label, icon, children, className = "" }: any) {
  return (
    <div className={className}>
      <label className="text-xs font-medium text-gray-500 flex items-center gap-1.5 mb-2">
        {icon && <span className="text-gray-400">{icon}</span>}
        {label}
      </label>
      <div className="mt-1">{children}</div>
    </div>
  );
}

function QualityCard({ label, url }: any) {
  return (
    <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-semibold text-gray-700">{label}</span>
      </div>
      <CopyText text={url} />
    </div>
  );
}

function TypeBadge({ type }: any) {
  const isLive = type === "live";
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold ${
      isLive 
        ? "bg-red-50 text-red-700 border border-red-200" 
        : "bg-blue-50 text-blue-700 border border-blue-200"
    }`}>
      {isLive ? <Radio size={12} /> : <PlayCircle size={12} />}
      {type?.toUpperCase() || "N/A"}
    </span>
  );
}

function StatusBadge({ status }: any) {
  let colorClass =
    status === "live"
      ? "bg-red-50 text-red-700 border-red-200"
      : status === "Ready for Live"
      ? "bg-blue-50 text-blue-700 border-blue-200"
      : "bg-gray-50 text-gray-700 border-gray-200";

  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border ${colorClass}`}>
      <Circle size={8} fill="currentColor" />
      {status || "N/A"}
    </span>
  );
}

function formatDate(date?: string | null) {
  if (!date) return "N/A";
  return new Date(date).toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}