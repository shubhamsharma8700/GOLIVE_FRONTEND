import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import videojs from "video.js";
import "video.js/dist/video-js.css";
import "@videojs/http-streaming";

// Overlays inside player
import EmailOverlay from "../components/player/EmailAccessOverlay";
import PasswordOverlay from "../components/player/EmailPasswordAccessOverlay";
import PaymentOverlay from "../components/player/PaymentAccessOverlay";

type AccessType = "open-source" | "email" | "email-password" | "payment";

export default function PlayerPage() {
  const [search] = useSearchParams();

  // Access type from URL
  const accessType = (search.get("access") as AccessType) || "open-source";

  // Video refs
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const playerRef = useRef<any>(null);

  // Access check
  const [hasAccess, setHasAccess] = useState<boolean>(accessType === "open-source");

  // ------------------------------------
  // VIDEO.JS INITIALIZATION (SAFE)
  // ------------------------------------
  useEffect(() => {
    if (!videoRef.current) return;

    const init = setTimeout(() => {
      if (!videoRef.current) return;

      const player = videojs(videoRef.current, {
        controls: true,
        autoplay: hasAccess,
        preload: "auto",
        fluid: true,
        responsive: true,
        inactivityTimeout: 3000,
        playbackRates: [0.5, 1, 1.5, 2],
        controlBar: {
          volumePanel: { inline: false },
          pictureInPictureToggle: true,
          remainingTimeDisplay: false,
          playbackRateMenuButton: true,
          fullscreenToggle: true,
        },
      });

      player.src({
        src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
        type: "video/mp4",
      });

      // Play automatically IF access granted
      if (hasAccess) {
        player.ready(() => player.play());
      }

      playerRef.current = player;
    }, 20);

    return () => {
      clearTimeout(init);
      try {
        playerRef.current?.dispose();
      } catch {}
      playerRef.current = null;
    };
  }, [hasAccess]);

  // ------------------------------------
  // SELECT OVERLAY BASED ON ACCESS TYPE
  // ------------------------------------
  let overlay = null;

  if (!hasAccess) {
    if (accessType === "email") {
      overlay = <EmailOverlay onAccessGranted={() => setHasAccess(true)} />;
    } else if (accessType === "email-password") {
      overlay = <PasswordOverlay onAccessGranted={() => setHasAccess(true)} />;
    } else if (accessType === "payment") {
      overlay = <PaymentOverlay onAccessGranted={() => setHasAccess(true)} />;
    }
  }

  // ------------------------------------
  // RENDER UI
  // ------------------------------------
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-950 p-6">

      {/* Player Wrapper - Centers nicely on the page */}
      <div className="w-full max-w-[1200px] mx-auto">

        {/* True YouTube-style container */}
        <div
          className="relative w-full overflow-hidden rounded-xl shadow-[0_8px_30px_rgba(0,0,0,0.35)] bg-black"
          style={{ aspectRatio: "16/9" }}
        >
          {/* Video.js player */}
          <video
            ref={videoRef}
            className="video-js vjs-default-skin vjs-big-play-centered w-full h-full"
            playsInline
          />

          {/* Overlay appears INSIDE video area only */}
          {overlay}
        </div>
      </div>
    </div>
  );
}
