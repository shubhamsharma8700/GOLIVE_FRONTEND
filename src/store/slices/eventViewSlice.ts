import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type PlaybackMode = "live" | "vod";

export interface EventViewState {
  // Core
  eventId: string | null;
  title: string | null;
  description: string | null;
  eventType: "live" | "scheduled" | "vod" | null;
  status: string | null;

  // Playback (RESOLVED)
  playbackUrl: string | null;
  playbackMode: PlaybackMode | null;

  // Live URLs
  cloudFrontUrl: string | null;
  mediaPackageUrl: string | null;
  rtmpInputUrl: string | null;

  // VOD
  vodCloudFrontUrl: string | null;
  vodStatus: string | null;

  // Infra
  channelState: string | null;
  mediaLiveChannelId: string | null;
  mediaPackageChannelId: string | null;
  distributionId: string | null;
  cloudFrontDomain: string | null;

  // Meta
  createdBy: string | null;
  createdAt: string | null;
  updatedAt: string | null;
  startTime: string | null;
  endTime: string | null;

  // Runtime
  isWatching: boolean;
}

const initialState: EventViewState = {
  eventId: null,
  title: null,
  description: null,
  eventType: null,
  status: null,

  playbackUrl: null,
  playbackMode: null,

  cloudFrontUrl: null,
  mediaPackageUrl: null,
  rtmpInputUrl: null,

  vodCloudFrontUrl: null,
  vodStatus: null,

  channelState: null,
  mediaLiveChannelId: null,
  mediaPackageChannelId: null,
  distributionId: null,
  cloudFrontDomain: null,

  createdBy: null,
  createdAt: null,
  updatedAt: null,
  startTime: null,
  endTime: null,

  isWatching: false,
};

const eventSlice = createSlice({
  name: "eventView",
  initialState,
  reducers: {
    loadEvent(state, action: PayloadAction<any>) {
      const e = action.payload;

      /* ---------------- BASIC DATA ---------------- */
      state.eventId = e.eventId ?? null;
      state.title = e.title ?? null;
      state.description = e.description ?? null;
      state.eventType = e.eventType ?? null;
      state.status = e.status ?? null;

      /* ---------------- LIVE ---------------- */
      state.cloudFrontUrl = e.cloudFrontUrl ?? null;
      state.mediaPackageUrl = e.mediaPackageUrl ?? null;
      state.rtmpInputUrl = e.rtmpInputUrl ?? null;

      /* ---------------- VOD ---------------- */
      state.vodCloudFrontUrl =
        e.vodCloudFrontUrl ??
        e.vodcloudFrontUrl ??
        null;

      state.vodStatus = e.vodStatus ?? null;

      /* ---------------- INFRA ---------------- */
      state.channelState = e.channelState ?? null;
      state.mediaLiveChannelId = e.mediaLiveChannelId ?? null;
      state.mediaPackageChannelId = e.mediaPackageChannelId ?? null;
      state.distributionId = e.distributionId ?? null;
      state.cloudFrontDomain = e.cloudFrontDomain ?? null;

      /* ---------------- META ---------------- */
      state.createdBy = e.createdBy ?? null;
      state.createdAt = e.createdAt ?? null;
      state.updatedAt = e.updatedAt ?? null;
      state.startTime = e.startTime ?? null;
      state.endTime = e.endTime ?? null;

      /* =================================================
         PLAYBACK RESOLUTION (FINAL RULE)
         If VOD is READY → ALWAYS VOD CLOUDFRONT URL
      ================================================= */

      const isVodReady = state.vodStatus === "READY";

      if (isVodReady && state.vodCloudFrontUrl) {
        state.playbackUrl = state.vodCloudFrontUrl;
        state.playbackMode = "vod";
      } else {
        const liveUrl =
          state.cloudFrontUrl ||
          state.mediaPackageUrl ||
          null;

        if (liveUrl) {
          state.playbackUrl = liveUrl;
          state.playbackMode = "live";
        } else {
          state.playbackUrl = null;
          state.playbackMode = null;
        }
      }

      state.isWatching = false;
    },

    setWatchingState(state, action: PayloadAction<boolean>) {
      state.isWatching = action.payload;
    },

    resetEvent() {
      return initialState;
    },
  },
});

export const {
  loadEvent,
  setWatchingState,
  resetEvent,
} = eventSlice.actions;

export default eventSlice.reducer;
