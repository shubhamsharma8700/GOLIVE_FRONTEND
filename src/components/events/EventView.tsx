// src/components/events/EventView.tsx
import { useEffect, useRef } from "react";
import { useGetEventByIdQuery } from "../../store/services/events.service";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { useAppSelector } from "../../hooks/useAppSelector";
import { DateTime } from "luxon";


import { loadEvent, setWatchingState } from "../../store/slices/eventViewSlice";

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
  const event = useAppSelector((s) => s.eventView);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const playerRef = useRef<Player | null>(null);

  /* ------------------------------------------------------
     LOAD EVENT INTO REDUX (PLAYBACK RESOLVED IN SLICE)
  ------------------------------------------------------ */
  useEffect(() => {
    if (!data?.event) return;
    dispatch(loadEvent(data.event));
  }, [data, dispatch]);

  /* ------------------------------------------------------
     VIDEO PLAYER INIT + URL UPDATE
  ------------------------------------------------------ */
  useEffect(() => {
    if (!videoRef.current || !event.playbackUrl) return;

    // INIT PLAYER (ONLY ONCE)
    if (!playerRef.current) {
      const player = videojs(videoRef.current, {
        autoplay: false,
        muted: false,
        controls: true,
        preload: "auto",
        fluid: true,
        responsive: true,
        aspectRatio: "16:9",
        liveui: event.playbackMode === "live",
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

      // QUALITY SELECTOR (safe)
      player.ready(() => {
        const anyPlayer = player as any;
        if (anyPlayer.hlsQualitySelector) {
          anyPlayer.hlsQualitySelector({ displayCurrentQuality: true });
        }
      });

      // AUTO-RETRY ON 403 / SRC ERROR (CloudFront warm-up)
      player.on("error", () => {
        const err = player.error();
        if (!err) return;

        if (err.code === 4) {
          setTimeout(() => {
            player.src({
              src: event.playbackUrl!,
              type: "application/x-mpegURL",
            });
          }, 3000);
        }
      });
    }

    // UPDATE SOURCE (NO RECREATE, NO DISPOSE)
    playerRef.current.src({
      src: event.playbackUrl,
      type: "application/x-mpegURL",
    });

    dispatch(setWatchingState(true));
  }, [event.playbackUrl, event.playbackMode, dispatch]);


  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
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
          <PlayerBlock videoRef={videoRef} />
        </div>

        <div className="lg:col-span-1">
          <EventQuickInfo event={event} />
        </div>
      </div>

      {event.description && <DescriptionSection text={event.description} />}
      {/* Live streaming details (hide for pure VOD events) */}
      {event.eventType !== "vod" && <StreamConfig event={event} />}

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
            <p className="text-sm text-gray-500 mt-1">
              Event configuration and playback
            </p>
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

function PlayerBlock({ videoRef }: { videoRef: any }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
      <div className="aspect-video bg-black rounded-lg overflow-hidden">
        <video
          ref={videoRef}
          className="video-js vjs-default-skin vjs-big-play-centered w-full h-full"
        />
      </div>
    </div>
  );
}

/* ---------------- REMAINING UI (UNCHANGED) ---------------- */

function EventQuickInfo({ event }: any) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 h-full">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Event Details
      </h3>

      <div className="space-y-4">
        <InfoRow label="Event ID" icon={<Hash size={16} />}>
          <CopyText text={event.eventId} />
        </InfoRow>

        <InfoRow label="Type" icon={<Activity size={16} />}>
          <span className="text-gray-900 font-medium capitalize">
            {event.eventType || "N/A"}
          </span>
        </InfoRow>

        <InfoRow label="Status" icon={<Circle size={16} />}>
          <StatusBadge status={event.status} />
        </InfoRow>

        <InfoRow label="Created By" icon={<User size={16} />}>
          <span className="text-gray-900 text-sm">
            {event.createdBy || "N/A"}
          </span>
        </InfoRow>

        <InfoRow label="Created At" icon={<Calendar size={16} />}>
          <span className="text-gray-900 text-sm">
            {formatLocalDateTime(event.createdAt)}
          </span>
        </InfoRow>

        {event.startTime && (
          <InfoRow label="Start Time" icon={<Clock size={16} />}>
            <span className="text-gray-900 text-sm">
              {formatLocalDateTime(event.startTime)}
            </span>
          </InfoRow>
        )}

        {event.endTime && (
          <InfoRow label="End Time" icon={<Clock size={16} />}>
            <span className="text-gray-900 text-sm">
              {formatLocalDateTime(event.endTime)}
            </span>
          </InfoRow>
        )}

        <InfoRow label="Last Updated" icon={<Clock size={16} />}>
          <span className="text-gray-900 text-sm">
            {formatLocalDateTime(event.updatedAt)}
          </span>
        </InfoRow>
      </div>
    </div>
  );
}


function DescriptionSection({ text }: any) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
      <p className="text-gray-700 leading-relaxed">{text}</p>
    </div>
  );
}

function VodSection({ event }: any) {
  const hasVariants =
    event.vod1080pUrl || event.vod720pUrl || event.vod480pUrl;

  const statusColor =
    event.vodStatus === "READY"
      ? "text-green-600"
      : event.vodStatus === "PROCESSING"
      ? "text-yellow-600"
      : event.vodStatus === "FAILED"
      ? "text-red-600"
      : "text-gray-600";

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-2">
        <PlayCircle size={20} className="text-blue-600" />
        <h3 className="text-lg font-semibold text-gray-900">
          VOD Configuration
        </h3>
      </div>

      {/* Status */}
      <InfoField label="VOD Status">
        <span className={`text-sm font-semibold ${statusColor}`}>
          {event.vodStatus || "N/A"}
        </span>
      </InfoField>

      {/* Master Playback */}
      {event.vodCloudFrontUrl && (
        <InfoField label="VOD Playback URL (Master)">
          <CopyText text={event.vodCloudFrontUrl} />
        </InfoField>
      )}

      {/* Processing Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <InfoField label="VOD Job ID">
          <span className="text-sm font-mono text-gray-900">
            {event.vodJobId || "N/A"}
          </span>
        </InfoField>

        <InfoField label="Source Type">
          <span className="text-sm text-gray-900">
            {event.vodSourceType || "N/A"}
          </span>
        </InfoField>

        <InfoField label="Processing Start Time">
          <span className="text-sm text-gray-900">
            {event.vodProcessingStartTime
              ? new Date(event.vodProcessingStartTime).toLocaleString()
              : "N/A"}
          </span>
        </InfoField>

        <InfoField label="Output Path">
          <span className="text-sm text-gray-900 break-all">
            {event.vodOutputPath || "N/A"}
          </span>
        </InfoField>
      </div>

      {/* S3 Paths */}
      {event.vodInputSource && (
        <InfoField label="Input Source (S3)">
          <span className="text-sm text-gray-900 break-all">
            {event.vodInputSource}
          </span>
        </InfoField>
      )}

      {event.vodS3Path && (
        <InfoField label="Output S3 Path">
          <span className="text-sm text-gray-900 break-all">
            {event.vodS3Path}
          </span>
        </InfoField>
      )}

      {/* Quality URLs */}
      {hasVariants && (
        <div className="pt-4 border-t border-gray-200 space-y-4">
          <h4 className="text-sm font-semibold text-gray-700">
            Available Quality Streams
          </h4>

          {event.vod1080pUrl && (
            <InfoField label="1080p (Full HD)">
              <CopyText text={event.vod1080pUrl} />
            </InfoField>
          )}

          {event.vod720pUrl && (
            <InfoField label="720p (HD)">
              <CopyText text={event.vod720pUrl} />
            </InfoField>
          )}

          {event.vod480pUrl && (
            <InfoField label="480p (SD)">
              <CopyText text={event.vod480pUrl} />
            </InfoField>
          )}
        </div>
      )}
    </div>
  );
}



function StreamConfig({ event }: any) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center gap-2 mb-5">
        <Radio size={20} className="text-blue-600" />
        <h3 className="text-lg font-semibold text-gray-900">
          Live Streaming Configuration
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">
        {/* STREAM URLS */}
        <InfoField label="CloudFront Playback URL" icon={<Link size={16} />}>
          <CopyText text={event.cloudFrontUrl} />
        </InfoField>

        <InfoField label="MediaPackage Playback URL" icon={<Network size={16} />}>
          <CopyText text={event.mediaPackageUrl} />
        </InfoField>

        <InfoField label="RTMP Input URL" icon={<Server size={16} />}>
          <CopyText text={event.rtmpInputUrl} />
        </InfoField>

        <InfoField label="CloudFront Domain">
          <span className="text-sm text-gray-900">
            {event.cloudFrontDomain || "N/A"}
          </span>
        </InfoField>

        {/* AWS MEDIALIVE */}
        <InfoField label="MediaLive Channel ID">
          <span className="text-sm text-gray-900 font-mono">
            {event.mediaLiveChannelId || "N/A"}
          </span>
        </InfoField>

        <InfoField label="MediaLive Input ID">
          <span className="text-sm text-gray-900 font-mono">
            {event.mediaLiveInputId || "N/A"}
          </span>
        </InfoField>

        <InfoField label="MediaLive Security Group ID">
          <span className="text-sm text-gray-900 font-mono">
            {event.mediaLiveInputSecurityGroupId || "N/A"}
          </span>
        </InfoField>

        <InfoField label="Channel State">
          <span
            className={`text-sm font-medium ${event.channelState === "IDLE"
                ? "text-gray-600"
                : "text-green-600"
              }`}
          >
            {event.channelState || "N/A"}
          </span>
        </InfoField>

        {/* AWS MEDIAPACKAGE */}
        <InfoField label="MediaPackage Channel ID">
          <span className="text-sm text-gray-900 font-mono">
            {event.mediaPackageChannelId || "N/A"}
          </span>
        </InfoField>

        <InfoField label="MediaPackage Endpoint ID">
          <span className="text-sm text-gray-900 font-mono">
            {event.mediaPackageEndpointId || "N/A"}
          </span>
        </InfoField>

        {/* CLOUDFRONT */}
        <InfoField label="Distribution ID">
          <span className="text-sm text-gray-900 font-mono">
            {event.distributionId || "N/A"}
          </span>
        </InfoField>

        <InfoField label="Origin ID">
          <span className="text-sm text-gray-900 font-mono">
            {event.originId || "N/A"}
          </span>
        </InfoField>

        {/* S3 RECORDING */}
        <InfoField label="Recording Bucket">
          <span className="text-sm text-gray-900">
            {event.s3RecordingBucket || "N/A"}
          </span>
        </InfoField>

        <InfoField label="Recording Prefix">
          <span className="text-sm text-gray-900 break-all">
            {event.s3RecordingPrefix || "N/A"}
          </span>
        </InfoField>

        <InfoField label="Recording Manifest Key" className="md:col-span-2">
          <span className="text-sm text-gray-900 break-all">
            {event.s3RecordingManifestKey || "N/A"}
          </span>
        </InfoField>
      </div>
    </div>
  );
}




/* ------------------------------------------------------ */

function InfoRow({ label, icon, children }: any) {
  return (
    <div className="flex items-start justify-between gap-3 py-2 border-b border-gray-100 last:border-0">
      <label className="text-xs font-medium text-gray-500 flex items-center gap-1.5">
        {icon}
        {label}
      </label>
      <div className="text-right">{children}</div>
    </div>
  );
}

function InfoField({ label, icon, children }: any) {
  return (
    <div>
      <label className="text-xs font-medium text-gray-500 flex items-center gap-1.5 mb-2">
        {icon}
        {label}
      </label>
      {children}
    </div>
  );
}

function TypeBadge({ type }: any) {
  return (
    <span className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-gray-100">
      {type?.toUpperCase() || "N/A"}
    </span>
  );
}

function StatusBadge({ status }: any) {
  return (
    <span className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-gray-100">
      {status || "N/A"}
    </span>
  );
}

function formatLocalDateTime(date?: string | null) {
  if (!date) return "N/A";

  return DateTime
    .fromISO(date, { zone: "utc" })
    .toLocal()
    .toFormat("dd LLL yyyy, hh:mm a");
}

