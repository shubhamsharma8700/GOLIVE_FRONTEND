import type Player from "video.js/dist/types/player";
import { collectDeviceInfo } from "./analyticsDevice";

/**
 * Attaches analytics lifecycle to a Video.js player
 * without touching UI or playback logic.
 */
export function attachAnalyticsToPlayer({
  player,
  eventId,
  playbackType,
  startSession,
  heartbeat,
  endSession,
}: {
  player: Player;
  eventId: string;
  playbackType: "live" | "vod";
  startSession: any;
  heartbeat: any;
  endSession: any;
}) {
  let sessionId: string | null = null;
  let heartbeatTimer: number | null = null;
  let isPlaying = false;

  /* ================= START SESSION ================= */

  const start = async () => {
    if (sessionId) return;

    const res = await startSession({
      eventId,
      playbackType,
      deviceInfo: collectDeviceInfo(),
    }).unwrap();

    sessionId = res.sessionId;

    heartbeatTimer = window.setInterval(() => {
      if (!sessionId || !isPlaying) return;

      heartbeat({
        sessionId,
        seconds: 10,
      });
    }, 10000);
  };

  /* ================= END SESSION ================= */

  const end = async () => {
    if (!sessionId) return;

    try {
      await endSession({
        sessionId,
        duration: Math.floor(player.currentTime() || 0),
      });
    } finally {
      sessionId = null;

      if (heartbeatTimer) {
        clearInterval(heartbeatTimer);
        heartbeatTimer = null;
      }
    }
  };

  /* ================= PLAYER EVENTS ================= */

  player.one("play", start);

  player.on("play", () => {
    isPlaying = true;
  });

  player.on("pause", () => {
    isPlaying = false;
  });

  player.on("ended", end);
  player.on("dispose", end);

  /* ================= PAGE LIFECYCLE ================= */

  window.addEventListener("beforeunload", end);

  return () => {
    window.removeEventListener("beforeunload", end);
    end();
  };
}
