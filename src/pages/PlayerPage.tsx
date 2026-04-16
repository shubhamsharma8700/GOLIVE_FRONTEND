// src/pages/PlayerPage.tsx
import React, { useEffect, useRef, useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import { useSearchParams } from "react-router-dom";

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
  useValidateViewerQuery,
} from "../store/services/player.service";

// Analytics APIs
import {
  useStartSessionMutation,
  useHeartbeatMutation,
  useEndSessionMutation,
} from "../store/services/analytics.service";

// Payment API
import {
  useCreatePaymentSessionMutation,
  useLazyCheckPaymentStatusQuery,
} from "../store/services/payments.service";

// Overlays
import EmailOverlay from "../components/player/EmailOverlay";
import PasswordOverlay from "../components/player/PasswordAccessOverlay";
import PaymentOverlay from "../components/player/PaymentAccessOverlay";

/* ============================================================
   HELPERS
============================================================ */

function getClientViewerId() {
  let id = localStorage.getItem("clientViewerId");
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem("clientViewerId", id);
  }
  return id;
}

function collectDeviceInfo() {
  return {
    userAgent: navigator.userAgent,
    platform: navigator.platform,
    language: navigator.language,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    screen: {
      width: window.screen.width,
      height: window.screen.height,
      pixelRatio: window.devicePixelRatio,
    },
  };
}

function getStoredViewerToken(eventId: string) {
  if (!eventId) return null;
  return localStorage.getItem(`viewerToken:${eventId}`);
}

function storeViewerToken(eventId: string, token: string) {
  localStorage.setItem(`viewerToken:${eventId}`, token);
}

function clearViewerToken(eventId: string) {
  localStorage.removeItem(`viewerToken:${eventId}`);
}

function getPaidAccessPasswordDone(eventId: string) {
  if (!eventId) return false;
  return localStorage.getItem(`paidAccessPasswordDone:${eventId}`) === "1";
}

function setPaidAccessPasswordDoneState(eventId: string, done: boolean) {
  if (!eventId) return;
  if (done) {
    localStorage.setItem(`paidAccessPasswordDone:${eventId}`, "1");
    return;
  }
  localStorage.removeItem(`paidAccessPasswordDone:${eventId}`);
}

function getErrorMessage(err: any, fallback: string) {
  return (
    err?.data?.message ||
    err?.data?.error ||
    err?.error ||
    err?.message ||
    fallback
  );
}

export default function PlayerPage() {
  const { id } = useParams<{ id: string }>();
  const eventId = id ?? "";

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const playerRef = useRef<Player | null>(null);

  const heartbeatTimerRef = useRef<number | null>(null);
  const sessionIdRef = useRef<string | null>(null);
  const isPlayingRef = useRef(false);

  const initialClientViewerId = useMemo(() => getClientViewerId(), []);
  const [clientViewerId, setClientViewerId] = useState(initialClientViewerId);
  const [viewerToken, setViewerToken] = useState<string | null>(null);
  const [hasAccess, setHasAccess] = useState(false);
  const [validationAttempted, setValidationAttempted] = useState(false);
  const [paidAccessPasswordDone, setPaidAccessPasswordDone] = useState(false);
  const [isVerifyingPayment, setIsVerifyingPayment] = useState(false);

  /* ================= ACCESS CONFIG ================= */

  const { data: accessConfig, isLoading } =
    useGetAccessConfigQuery(eventId, { skip: !eventId });

  const accessMode = accessConfig?.accessMode;

  /* ================= RESTORE TOKEN ================= */

  const storedViewerToken = useMemo(
    () => getStoredViewerToken(eventId),
    [eventId]
  );

  const {
    data: validateData,
    isSuccess: isValidateSuccess,
    isError: isValidateError,
  } = useValidateViewerQuery(
    { eventId, viewerToken: storedViewerToken! },
    { skip: !eventId || !storedViewerToken }
  );

  useEffect(() => {
    if (!storedViewerToken) {
      setPaidAccessPasswordDone(getPaidAccessPasswordDone(eventId));
      setValidationAttempted(true);
      return;
    }

    if (isValidateSuccess && validateData?.success) {
      setViewerToken(storedViewerToken);
      if (validateData.viewer.clientViewerId) {
        setClientViewerId(validateData.viewer.clientViewerId);
      }
      const passwordStepDone =
        Boolean(validateData.viewer.passwordVerified) ||
        getPaidAccessPasswordDone(eventId);
      setPaidAccessPasswordDone(passwordStepDone);
      setPaidAccessPasswordDoneState(eventId, passwordStepDone);

      const canAccess =
        accessMode === "freeAccess" ||
        accessMode === "emailAccess" ||
        validateData.viewer.accessVerified === true;

      setHasAccess(canAccess);
      setValidationAttempted(true);
    }

    if (isValidateError) {
      clearViewerToken(eventId);
      setPaidAccessPasswordDoneState(eventId, false);
      setViewerToken(null);
      setHasAccess(false);
      setPaidAccessPasswordDone(false);
      setValidationAttempted(true);
    }
  }, [
    storedViewerToken,
    isValidateSuccess,
    isValidateError,
    validateData,
    accessMode,
    eventId,
  ]);

  /* ================= REGISTER VIEWER ================= */

  const [registerViewer] = useRegisterViewerMutation();

  const handleRegister = async (formData?: Record<string, string>) => {
    try {
      const res = await registerViewer({
        eventId,
        clientViewerId,
        formData,
        deviceInfo: collectDeviceInfo(),
      }).unwrap();

      const resolvedViewerId = res.resolvedClientViewerId || clientViewerId;
      setClientViewerId(resolvedViewerId);
      setViewerToken(res.viewerToken);
      storeViewerToken(eventId, res.viewerToken);
      const passwordStepDone = Boolean(res.steps?.passwordVerified);
      setPaidAccessPasswordDone(passwordStepDone);
      setPaidAccessPasswordDoneState(eventId, passwordStepDone);
      setHasAccess(
        Boolean(
          res.accessVerified ||
          (accessMode === "emailAccess" && res.steps?.registrationComplete)
        )
      );
    } catch (err: any) {
      throw new Error(getErrorMessage(err, "Registration failed. Please try again."));
    }
  };

  /* ================= PASSWORD VERIFY ================= */

  const [verifyPassword] = useVerifyPasswordMutation();

  const handlePasswordVerify = async (password: string) => {
    try {
      const res = await verifyPassword({
        eventId,
        clientViewerId,
        password,
        viewerToken: viewerToken ?? undefined,
      }).unwrap();

      if (accessMode === "passwordAccess") {
        setHasAccess(Boolean(res.accessVerified || res.steps?.registrationComplete));
        return;
      }

      if (accessMode === "paidAccess") {
        // Successful verify should immediately unlock payment step.
        const passwordStepDone = Boolean(res.success || res.steps?.passwordVerified);
        setPaidAccessPasswordDone(passwordStepDone);
        setPaidAccessPasswordDoneState(eventId, passwordStepDone);
      }
    } catch (err: any) {
      throw new Error(getErrorMessage(err, "Invalid password. Please try again."));
    }
  };

  /* ================= PAYMENT ================= */

  const [searchParams] = useSearchParams();
  const paymentStatus = searchParams.get("payment");
  const stripeSessionId = searchParams.get("session_id");
  const shouldVerifyPayment =
    accessMode === "paidAccess" &&
    !hasAccess &&
    (paymentStatus === "success" || Boolean(stripeSessionId));

  const [checkPaymentStatus] = useLazyCheckPaymentStatusQuery();

  useEffect(() => {
    let cancelled = false;

    const verifyPaymentWithRetry = async () => {
      if (!shouldVerifyPayment || !viewerToken) return;

      setIsVerifyingPayment(true);

      const waitMs = [0, 1500, 3000, 5000];

      for (let i = 0; i < waitMs.length; i += 1) {
        if (waitMs[i] > 0) {
          await new Promise((resolve) => setTimeout(resolve, waitMs[i]));
        }
        if (cancelled) return;

        try {
          const res = await checkPaymentStatus({ eventId, viewerToken }).unwrap();
          const status = res?.payment?.status;

          if (status === "succeeded") {
            if (!cancelled) {
              setHasAccess(true);
            }
            return;
          }

          if (status && status !== "pending") {
            return;
          }
        } catch {
          if (i === waitMs.length - 1) {
            return;
          }
        }
      }
    };

    verifyPaymentWithRetry().finally(() => {
      if (!cancelled) {
        setIsVerifyingPayment(false);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [shouldVerifyPayment, viewerToken, eventId, checkPaymentStatus]);

  const [createPaymentSession] = useCreatePaymentSessionMutation();

  const handlePayment = async () => {
    if (!viewerToken) return;
    try {
      const res = await createPaymentSession({
        eventId,
        viewerToken,
      }).unwrap();

      window.location.href = res.url;
    } catch (err: any) {
      throw new Error(getErrorMessage(err, "Unable to start payment. Please try again."));
    }
  };

  /* ================= STREAM ================= */

  const { data: streamData, isFetching } = useGetStreamQuery(
    { eventId, viewerToken: viewerToken! },
    { skip: !eventId || !viewerToken || !hasAccess }
  );

  /* ================= ANALYTICS ================= */

  const [startSession] = useStartSessionMutation();
  const [heartbeat] = useHeartbeatMutation();
  const [endSession] = useEndSessionMutation();

  /* ================= VIDEO + ANALYTICS ================= */

  useEffect(() => {
    if (!videoRef.current || !streamData?.streamUrl || !viewerToken) return;

    if (playerRef.current && !playerRef.current.isDisposed()) {
      playerRef.current.dispose();
    }

    const player = videojs(videoRef.current!, {
      autoplay: false,
      muted: false,
      controls: true,
      preload: "auto",
      fluid: true,
      responsive: true,
      aspectRatio: "16:9",
      liveui: streamData.playbackType === "live",
      playbackRates: [0.5, 1, 1.5, 2],
      controlBar: {
        volumePanel: { inline: false },
        remainingTimeDisplay: { displayNegative: false },
        skipButtons: { forward: 10, backward: 10 },
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
      src: streamData.streamUrl,
      type: "application/x-mpegURL",
    });

    player.ready(() => {
      const qualityPlayer = player as Player & {
        hlsQualitySelector?: (opts: { displayCurrentQuality: boolean }) => void;
      };
      if (typeof qualityPlayer.hlsQualitySelector === "function") {
        qualityPlayer.hlsQualitySelector({ displayCurrentQuality: true });
      }
    });

    const startAnalytics = async () => {
      if (sessionIdRef.current) return;

      const res = await startSession({
        eventId,
        playbackType: streamData.playbackType,
        deviceInfo: collectDeviceInfo(),
        viewerToken,
      }).unwrap();

      sessionIdRef.current = res.sessionId;
    };

    const startHeartbeat = () => {
      if (heartbeatTimerRef.current) return;

      heartbeatTimerRef.current = window.setInterval(() => {
        if (!sessionIdRef.current || !isPlayingRef.current) return;

        heartbeat({
          sessionId: sessionIdRef.current,
          seconds: 10,
          viewerToken,
          eventId,
          clientViewerId,
        });
      }, 10000);
    };

    const stopHeartbeat = () => {
      if (heartbeatTimerRef.current) {
        clearInterval(heartbeatTimerRef.current);
        heartbeatTimerRef.current = null;
      }
    };

    const endAnalytics = async () => {
      if (!sessionIdRef.current) return;

      stopHeartbeat();

      await endSession({
        sessionId: sessionIdRef.current,
        duration: Math.floor(player.currentTime() || 0),
        viewerToken,
      });

      sessionIdRef.current = null;
    };

    player.on("play", async () => {
      isPlayingRef.current = true;
      await startAnalytics();
      startHeartbeat();
    });

    player.on("pause", () => {
      isPlayingRef.current = false;
      stopHeartbeat();
    });

    player.on("ended", endAnalytics);
    player.on("dispose", endAnalytics);

    window.addEventListener("beforeunload", endAnalytics);

    return () => {
      window.removeEventListener("beforeunload", endAnalytics);
      endAnalytics();
      player.dispose();
    };
  }, [streamData, viewerToken]);

  /* ================= AUTO REGISTER ================= */

  useEffect(() => {
    if (
      accessMode === "freeAccess" &&
      !viewerToken &&
      eventId &&
      validationAttempted
    ) {
      handleRegister().catch(() => undefined);
    }
  }, [accessMode, eventId, viewerToken, validationAttempted]);

  useEffect(() => {
    if (!viewerToken) {
      setPaidAccessPasswordDone(getPaidAccessPasswordDone(eventId));
    }
  }, [eventId, viewerToken]);

  /* ================= OVERLAYS ================= */

  let overlay: React.ReactNode = null;

  if (!hasAccess && accessMode === "emailAccess") {
    overlay = (
      <EmailOverlay
        open
        fields={accessConfig?.registrationFields || []}
        eventId={eventId}
        onAccessGranted={handleRegister}
      />
    );
  }

  if (!hasAccess && accessMode === "passwordAccess") {
    overlay = !viewerToken ? (
      <EmailOverlay
        open
        fields={accessConfig?.registrationFields || []}
        eventId={eventId}
        onAccessGranted={handleRegister}
      />
    ) : (
      <PasswordOverlay open eventId={eventId} onSubmit={handlePasswordVerify} />
    );
  }

  if (!hasAccess && accessMode === "paidAccess") {
    if (!viewerToken) {
      overlay = (
        <EmailOverlay
          open
          fields={accessConfig?.registrationFields || []}
          eventId={eventId}
          onAccessGranted={handleRegister}
        />
      );
    } else if (shouldVerifyPayment || isVerifyingPayment) {
      overlay = (
        <div className="absolute inset-0 flex items-center justify-center bg-black/70 text-white">
          Verifying payment...
        </div>
      );
    } else if (!paidAccessPasswordDone) {
      overlay = (
        <PasswordOverlay
          open
          eventId={eventId}
          onSubmit={handlePasswordVerify}
        />
      );
    } else {
      overlay = (
        <PaymentOverlay
          open
          eventId={eventId}
          amount={accessConfig?.payment?.amount}
          currency={accessConfig?.payment?.currency}
          onPay={handlePayment}
        />
      );
    }
  }

  /* ================= RENDER ================= */

  if (isLoading) return <div className="p-6 text-white">Loading…</div>;
  if (!eventId) return <div className="p-6 text-white">Invalid event</div>;

  return (
    <div className="h-screen w-full bg-transparent flex items-center justify-center p-4">
      <div
        className="relative w-full bg-black rounded-xl overflow-hidden"
        style={{ aspectRatio: "16/9", maxWidth: "90%" }}
      >
        <video
          ref={videoRef}
          className="video-js vjs-default-skin vjs-big-play-centered w-full h-full"
        />
        {overlay}
        {isFetching && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/70 text-white">
            Loading stream…
          </div>
        )}
      </div>
    </div>
  );
}
