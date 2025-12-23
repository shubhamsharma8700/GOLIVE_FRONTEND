import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

/* =====================================================
   TYPES
===================================================== */

export type PlaybackMode = "live" | "vod";

export interface EventViewState {
  eventId: string | null;

  // Playback
  playbackUrl: string | null;
  playbackMode: PlaybackMode | null;

  // Runtime state
  isWatching: boolean;
  watchStartTime: string | null;

  // LIVE URLs
  cloudFrontUrl: string | null;
  mediaPackageUrl: string | null;

  // VOD URLs
  vodCloudFrontUrl: string | null;
  vod1080pUrl: string | null;
  vod720pUrl: string | null;
  vod480pUrl: string | null;

  vodStatus: string | null;

  // Infra/runtime metadata (read-only)
  channelState: string | null;
  mediaLiveChannelId: string | null;
  mediaPackageChannelId: string | null;
}

/* =====================================================
   INITIAL STATE
===================================================== */

const initialState: EventViewState = {
  eventId: null,

  playbackUrl: null,
  playbackMode: null,

  isWatching: false,
  watchStartTime: null,

  cloudFrontUrl: null,
  mediaPackageUrl: null,

  vodCloudFrontUrl: null,
  vod1080pUrl: null,
  vod720pUrl: null,
  vod480pUrl: null,

  vodStatus: null,

  channelState: null,
  mediaLiveChannelId: null,
  mediaPackageChannelId: null,
};

/* =====================================================
   SLICE
===================================================== */

const eventViewSlice = createSlice({
  name: "eventView",
  initialState,
  reducers: {
    /* ---------------- LOAD EVENT FOR VIEW ---------------- */

    loadEventView(
      state,
      action: PayloadAction<{
        eventId: string;
        eventType: "live" | "scheduled" | "vod";
        cloudFrontUrl?: string | null;
        mediaPackageUrl?: string | null;
        vodCloudFrontUrl?: string | null;
        vod1080pUrl?: string | null;
        vod720pUrl?: string | null;
        vod480pUrl?: string | null;
        vodStatus?: string | null;
        channelState?: string | null;
        mediaLiveChannelId?: string | null;
        mediaPackageChannelId?: string | null;
      }>
    ) {
      const payload = action.payload;

      state.eventId = payload.eventId;

      state.cloudFrontUrl = payload.cloudFrontUrl ?? null;
      state.mediaPackageUrl = payload.mediaPackageUrl ?? null;

      state.vodCloudFrontUrl = payload.vodCloudFrontUrl ?? null;
      state.vod1080pUrl = payload.vod1080pUrl ?? null;
      state.vod720pUrl = payload.vod720pUrl ?? null;
      state.vod480pUrl = payload.vod480pUrl ?? null;

      state.vodStatus = payload.vodStatus ?? null;

      state.channelState = payload.channelState ?? null;
      state.mediaLiveChannelId = payload.mediaLiveChannelId ?? null;
      state.mediaPackageChannelId = payload.mediaPackageChannelId ?? null;

      // Reset viewer session
      state.isWatching = false;
      state.watchStartTime = null;
    },

    /* ---------------- SET PLAYBACK ---------------- */

    setPlayback(
      state,
      action: PayloadAction<{
        playbackUrl: string | null;
        playbackMode: PlaybackMode | null;
      }>
    ) {
      state.playbackUrl = action.payload.playbackUrl;
      state.playbackMode = action.payload.playbackMode;
    },

    /* ---------------- WATCHING STATE ---------------- */

    setWatching(state, action: PayloadAction<boolean>) {
      state.isWatching = action.payload;

      if (action.payload) {
        state.watchStartTime = new Date().toISOString();
      } else {
        state.watchStartTime = null;
      }
    },

    /* ---------------- VOD STATUS UPDATE ---------------- */

    updateVodStatus(
      state,
      action: PayloadAction<{
        vodStatus: string;
        vodCloudFrontUrl?: string | null;
        vod1080pUrl?: string | null;
        vod720pUrl?: string | null;
        vod480pUrl?: string | null;
      }>
    ) {
      state.vodStatus = action.payload.vodStatus;

      if (action.payload.vodCloudFrontUrl !== undefined) {
        state.vodCloudFrontUrl = action.payload.vodCloudFrontUrl;
      }
      if (action.payload.vod1080pUrl !== undefined) {
        state.vod1080pUrl = action.payload.vod1080pUrl;
      }
      if (action.payload.vod720pUrl !== undefined) {
        state.vod720pUrl = action.payload.vod720pUrl;
      }
      if (action.payload.vod480pUrl !== undefined) {
        state.vod480pUrl = action.payload.vod480pUrl;
      }
    },

    /* ---------------- RESET ---------------- */

    resetEventView() {
      return initialState;
    },
  },
});

/* =====================================================
   EXPORTS
===================================================== */

export const {
  loadEventView,
  setPlayback,
  setWatching,
  updateVodStatus,
  resetEventView,
} = eventViewSlice.actions;

export default eventViewSlice.reducer;
