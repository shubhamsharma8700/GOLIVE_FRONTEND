import { useEffect, useRef, useState, useMemo } from "react";
import { useParams } from "react-router-dom";

// Video.js
import videojs from "video.js";
import type Player from "video.js/dist/types/player";
import "video.js/dist/video-js.css";
import "@videojs/http-streaming";

// Quality selector
import "videojs-contrib-quality-levels";
import "jb-videojs-hls-quality-selector";

// Player APIs
import {
  useGetAccessConfigQuery,
  useRegisterViewerMutation,
  useVerifyPasswordMutation,
  useGetStreamQuery,
} from "../store/services/player.service";

// Overlays
import EmailOverlay from "../components/player/EmailOverlay";
import PasswordOverlay from "../components/player/PasswordAccessOverlay";
import PaymentOverlay from "../components/player/PaymentAccessOverlay";

// --------------------------------------------------
// Stable clientViewerId (Option A)
// --------------------------------------------------
function getClientViewerId() {
  let id = localStorage.getItem("clientViewerId");
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem("clientViewerId", id);
  }
  return id;
}

export default function PlayerPage() {
  // ---------------- Route Param ----------------
  const { id } = useParams<{ id: string }>();
  const safeEventId = id ?? "";

  // ---------------- Viewer Identity ----------------
  const clientViewerId = useMemo(getClientViewerId, []);

  // ---------------- Video.js Refs ----------------
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const playerRef = useRef<Player | null>(null);

  // ---------------- Auth State ----------------
  const [viewerToken, setViewerToken] = useState<string | null>(null);
  const [hasAccess, setHasAccess] = useState(false);

  // =================================================
  // ACCESS CONFIG
  // =================================================
  const {
    data: accessConfig,
    isLoading: accessLoading,
  } = useGetAccessConfigQuery(safeEventId, {
    skip: !safeEventId,
  });

  const accessMode = accessConfig?.accessMode;

  // =================================================
  // REGISTER VIEWER
  // =================================================
  const [registerViewer] = useRegisterViewerMutation();

  const handleRegister = async (formData?: any) => {
    if (!safeEventId) return;

    const res = await registerViewer({
      eventId: safeEventId,
      clientViewerId,
      formData,
    }).unwrap();

    setViewerToken(res.viewerToken);
    setHasAccess(res.accessVerified);
  };

  // =================================================
  // PASSWORD VERIFY
  // =================================================
  const [verifyPassword] = useVerifyPasswordMutation();

  const handlePasswordVerify = async (password: string) => {
    if (!safeEventId) return;

    await verifyPassword({
      eventId: safeEventId,
      clientViewerId,
      password,
    }).unwrap();

    setHasAccess(true);
  };

  // =================================================
  // STREAM API (Protected)
  // =================================================
  const {
    data: streamData,
    isFetching: streamLoading,
  } = useGetStreamQuery(
    {
      eventId: safeEventId,
      viewerToken: viewerToken!,
    },
    {
      skip: !safeEventId || !viewerToken || !hasAccess,
    }
  );

  // =================================================
  // VIDEO.JS INITIALIZATION
  // =================================================
  useEffect(() => {
    if (!videoRef.current) return;
    if (!streamData?.streamUrl) return;

    // Dispose previous player
    if (playerRef.current && !playerRef.current.isDisposed()) {
      playerRef.current.dispose();
      playerRef.current = null;
    }

    const player = videojs(videoRef.current, {
      autoplay: "any",
      muted: false,
      controls: true,
      preload: "auto",
      fluid: true,
      responsive: true,
      aspectRatio: "16:9",
      liveui: streamData.playbackType === "live",

      controlBar: {
        volumePanel: { inline: false },
        remainingTimeDisplay: { displayNegative: true },
        skipButtons: { forward: 10, backward: 10, },
        playbackRateMenuButton: true,
        pictureInPictureToggle: true,
        fullscreenToggle: true,
      },

      html5: {
        vhs: {
          overrideNative: true,
          smoothQualityChange: true,
          enableLowInitialPlaylist: true
        },
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

    });

    playerRef.current = player;

    player.src({
      src: streamData.streamUrl,
      type: "application/x-mpegURL",
    });

    player.ready(() => {
      if (typeof (player as any).hlsQualitySelector === "function") {
        (player as any).hlsQualitySelector({
          displayCurrentQuality: true,
        });
      }
    });

    return () => {
      if (player && !player.isDisposed()) {
        player.dispose();
      }
      playerRef.current = null;
    };
  }, [streamData]);

  // =================================================
  // AUTO REGISTER FOR FREE ACCESS
  // =================================================
  useEffect(() => {
    if (accessMode === "freeAccess" && !viewerToken) {
      handleRegister();
    }
  }, [accessMode, viewerToken]);

  // =================================================
  // ACCESS OVERLAYS
  // =================================================
  let overlay: JSX.Element | null = null;

  if (!hasAccess && accessMode === "emailAccess") {
    overlay = (
      <EmailOverlay
        open
        eventId={safeEventId}
        onAccessGranted={(formData) => handleRegister(formData)}
      />
    );
  }

  if (!hasAccess && accessMode === "passwordAccess") {
    overlay = (
      <PasswordOverlay
        open
        eventId={safeEventId}
        onSubmit={(password) => handlePasswordVerify(password)}
      />

    );
  }

  if (!hasAccess && accessMode === "paidAccess") {
    overlay = (
      <PaymentOverlay
        open
        eventId={safeEventId}
        amount={event?.paymentAmount}
        currency={event?.currency}
        onPay={async () => {
          await handleRegister(); // or payment + register flow
          setHasAccess(true);
        }}
      />

    );
  }

  // =================================================
  // RENDER
  // =================================================
  if (accessLoading) {
    return <div className="p-6 text-white">Loading event…</div>;
  }

  if (!safeEventId) {
    return <div className="p-6 text-white">Invalid event</div>;
  }

  return (
    <div className="h-screen w-full bg-gray-950 flex items-center justify-center p-4">
      <div
        className="relative w-full bg-black rounded-xl overflow-hidden"
        style={{ aspectRatio: "16/9", maxWidth: "75%" }}
      >
        <video
          ref={videoRef}
          className="video-js vjs-default-skin vjs-big-play-centered w-full h-full"
        />

        {overlay}

        {streamLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/70">
            <span className="text-white">Loading stream…</span>
          </div>
        )}
      </div>
    </div>
  );
}
