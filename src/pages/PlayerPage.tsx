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
import EmailOverlay from "../components/player/EmailOverlay";
import PasswordOverlay from "../components/player/PasswordAccessOverlay";
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
    // const player = videojs(videoRef.current, {
    //   autoplay: hasAccess ? "any" : false,
    //   muted: true,
    //   controls: true,
    //   playsinline: true,
    //   fluid: true,
    //   responsive: true,
    //   aspectRatio: "16:9",

    //   liveui: true,
    //   enableSmoothSeeking: true,

    //   controlBar: {
    //     volumePanel: { inline: false },
    //     remainingTimeDisplay: { displayNegative: false },
    //     skipButtons: { forward: 10, backward: 10 },
    //   },

    //   html5: { vhs: { overrideNative: true } },
    // });
    const player = videojs(videoRef.current, {
  autoplay: hasAccess ? "any" : false,
  muted: false,
  controls: true,
  playsinline: true,
  preload: "auto",

  fluid: true,
  responsive: true,
  aspectRatio: "16:9",

  liveui: true,
  enableSmoothSeeking: true,

  // Advanced control bar
  controlBar: {
    volumePanel: { inline: false },
    remainingTimeDisplay: { displayNegative: false },

    skipButtons: {
      forward: 10,
      backward: 10,
    },

    playbackRateMenuButton: true,
    pictureInPictureToggle: true,
    fullscreenToggle: true,
  },

  html5: {
    vhs: {
      overrideNative: true,
      smoothQualityChange: true,   // smoother ABR switching
    },
  },

  // Spatial Navigation (Smart TVs / Remote Controls)
  spatialNavigation: {
    enabled: true,
    horizontalSeek: true,
  },

  // Improve UI responsiveness breakpoints
  breakpoints: {
    medium: 600,
    large: 1000,
    huge: 1400,
  },

  // User actions (mouse, keyboard)
  userActions: {
    doubleClick: true, // fullscreen on double click
    click: true,       // pause/play on click

    hotkeys: {
      // Space / K pause toggle (default)
      playPauseKey: (e: KeyboardEvent) => e.key === "k" || e.key === " ",

      // F fullscreen toggle
      fullscreenKey: (e: KeyboardEvent) => e.key === "f",

      // M mute toggle
      muteKey: (e: KeyboardEvent) => e.key === "m",
    },
  },

  // Poster hidden until playback
  posterImage: true,
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

if (accessType === "email") {
  overlay = (
    <EmailOverlay
      open={!hasAccess}
      onAccessGranted={() => setHasAccess(true)}
    />
  );
}

if (accessType === "email-password") {
  overlay = (
    <PasswordOverlay
      open={!hasAccess}
      onAccessGranted={() => setHasAccess(true)}
    />
  );
}

if (accessType === "payment") {
  overlay = (
    <PaymentOverlay
      open={!hasAccess}
      onAccessGranted={() => setHasAccess(true)}
    />
  );
}



  if (isLoading) return <div className="p-6">Loading event...</div>;

  const playbackUrl = resolvePlaybackUrl(event);

  /* -----------------------------------------
      RENDER PLAYER + EVENT INFO
  ----------------------------------------- */
return (
  <div className="h-screen w-full bg-gray-950 text-white overflow-hidden flex items-center justify-center p-4 sm:p-6 md:p-8">
    <div
      className="relative w-full bg-black rounded-xl shadow-xl overflow-hidden"
      style={{ 
        aspectRatio: "16/9",
        maxWidth: "75%",
        maxHeight: "100%"
      }}
    >
      {/* PLAYER */}
      <video
        ref={videoRef}
        className="video-js vjs-default-skin vjs-big-play-centered w-full h-full object-contain"
      />
      {overlay}
    </div>
  </div>
);
}
