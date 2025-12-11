import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";

// Video.js
import videojs from "video.js";
import type Player from "video.js/dist/types/player";
import "video.js/dist/video-js.css";
import "@videojs/http-streaming";

// Quality selector plugins
import "videojs-contrib-quality-levels";
import "jb-videojs-hls-quality-selector";

// API + Redux
import { useGetEventByIdQuery } from "../store/services/events.service";
import { useAppDispatch } from "../hooks/useAppDispatch";
import { useAppSelector } from "../hooks/useAppSelector";
import { loadEvent } from "../store/slices/eventSlice";

// Access overlays
import EmailOverlay from "../components/player/EmailAccessOverlay";
import PasswordOverlay from "../components/player/EmailPasswordAccessOverlay";
import PaymentOverlay from "../components/player/PaymentAccessOverlay";

type AccessType = "open-source" | "email" | "email-password" | "payment";

// --------------------------------------------------
// DETECT BEST PLAYBACK URL FROM EVENT DATA
// --------------------------------------------------
function resolvePlaybackUrl(event: any): string | null {
  if (!event) return null;

  // VOD STREAM LOGIC
  if (event.eventType === "vod") {
    return (
      event.vodCloudFrontUrl ||
      event.vod1080pUrl ||
      event.vod720pUrl ||
      event.vod480pUrl ||
      null
    );
  }

  // LIVE STREAM LOGIC
  if (event.eventType === "live") {
    return (
      event.cloudFrontUrl ||
      event.mediaPackageUrl ||
      event.vodCloudFrontUrl ||
      null
    );
  }

  return null;
}

export default function PlayerPage() {
  const [search] = useSearchParams();
  const eventId = search.get("eventId") || "";
  const accessType = (search.get("access") as AccessType) || "open-source";

  const dispatch = useAppDispatch();

  const { data, isLoading } = useGetEventByIdQuery(eventId);
  const event = useAppSelector((s) => s.eventForm);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const playerRef = useRef<Player | null>(null);

  const [hasAccess, setHasAccess] = useState(accessType === "open-source");

  /* -----------------------------------------
      LOAD EVENT → REDUX
  ----------------------------------------- */
  useEffect(() => {
    if (data?.events?.length > 0) {
      const ev = data.events[0]; // Selecting first for testing
      dispatch(loadEvent({ ...ev, eventId: ev.eventId }));
    }
  }, [data, dispatch]);

  /* -----------------------------------------
      PLAYER INITIALIZATION + PLAYBACK URL
  ----------------------------------------- */
  useEffect(() => {
    if (!videoRef.current) return;
    if (!event) return;

    const playbackUrl = resolvePlaybackUrl(event);
    if (!playbackUrl) return;

    // CLEAN previous player
    if (playerRef.current && !playerRef.current.isDisposed()) {
      playerRef.current.dispose();
      playerRef.current = null;
    }

    // INIT PLAYER
    const player = videojs(videoRef.current, {
      autoplay: hasAccess ? "any" : false,
      muted: true,
      controls: true,
      playsinline: true,
      fluid: true,
      responsive: true,
      aspectRatio: "16:9",

      liveui: true,
      enableSmoothSeeking: true,

      controlBar: {
        volumePanel: { inline: false },
        remainingTimeDisplay: { displayNegative: false },
        skipButtons: { forward: 10, backward: 10 },
      },

      html5: { vhs: { overrideNative: true } },
    });

    playerRef.current = player;

    // SET SOURCE
    player.src({
      src: playbackUrl,
      type: playbackUrl.endsWith(".m3u8")
        ? "application/x-mpegURL"
        : "video/mp4",
    });

    // INIT QUALITY SELECTOR (TS SAFE)
player.ready(() => {
  if (typeof (player as any).hlsQualitySelector === "function") {
    (player as any).hlsQualitySelector({ displayCurrentQuality: true });
  }
});





    // ANALYTICS
    player.on("timeupdate", () => {
      const p = playerRef.current;
      if (!p || p.isDisposed()) return;
      console.log("Watch Position:", p.currentTime());
    });

    // CLEANUP
    return () => {
      const p = playerRef.current;
      if (p && !p.isDisposed()) p.dispose();
      playerRef.current = null;
    };
  }, [event, hasAccess]);

  /* -----------------------------------------
      ACCESS OVERLAY
  ----------------------------------------- */
  let overlay = null;
  if (!hasAccess) {
    if (accessType === "email")
      overlay = <EmailOverlay onAccessGranted={() => setHasAccess(true)} />;
    if (accessType === "email-password")
      overlay = (
        <PasswordOverlay onAccessGranted={() => setHasAccess(true)} />
      );
    if (accessType === "payment")
      overlay = <PaymentOverlay onAccessGranted={() => setHasAccess(true)} />;
  }

  if (isLoading) return <div className="p-6">Loading event...</div>;

  const playbackUrl = resolvePlaybackUrl(event);

  /* -----------------------------------------
      RENDER PLAYER + EVENT INFO
  ----------------------------------------- */
  return (
    <div className="min-h-screen w-full flex flex-col items-center bg-gray-950 p-6 text-white">

      <h1 className="text-xl font-semibold mb-4">
        Testing Player for Event: {event?.title}
      </h1>

      <div className="w-full max-w-[1300px]">
        <div
          className="relative w-full bg-black rounded-xl shadow-xl overflow-hidden"
          style={{ aspectRatio: "16/9" }}
        >
          {/* PLAYER */}
          <video
            ref={videoRef}
            className="video-js vjs-default-skin vjs-big-play-centered w-full h-full"
          />
          {overlay}
        </div>
      </div>

      <div className="mt-6 w-full max-w-[800px] bg-gray-800 p-4 rounded">
        <h2 className="text-lg mb-2">Event Data</h2>

        <p><strong>Event Type:</strong> {event?.eventType}</p>
        <p><strong>Status:</strong> {event?.status}</p>
        <p><strong>Description:</strong> {event?.description}</p>

        <p className="mt-2"><strong>Resolved Playback URL:</strong></p>
        <p className="text-blue-400 break-all">{playbackUrl}</p>
      </div>
    </div>
  );
}
