// src/store/slices/eventSlice.ts

import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { DateTime } from "luxon";

/* =========================================================
   TYPES
========================================================= */

export type AccessMode =
  | "freeAccess"
  | "emailAccess"
  | "passwordAccess"
  | "paidAccess";

export interface RegistrationField {
  id: string;
  label: string;
  type: string;
  required: boolean;
}

export interface VideoConfig {
  resolution?: "1080p" | "720p" | "480p";
  frameRate?: 25 | 30 | 60;
  bitrateProfile?: "low" | "medium" | "high";
}

export interface EventFormState {
  mode: "create" | "update";
  eventId: string | null;

  title: string;
  description: string;
  eventType: "live" | "scheduled" | "vod";
  accessMode: AccessMode;

  startTime?: string | null;
  endTime?: string | null;

  s3Key?: string | null;
  s3Prefix?: string | null;

  videoConfig: VideoConfig;
  registrationFields: RegistrationField[];

  paymentAmount?: number | null;
  currency?: string | null;
  accessPasswordHash?: string | null;

  vodUpload: {
    fileName?: string | null;
    progress: number;
    uploading: boolean;
    error?: string | null;
  };

  status?: string | null;
  createdBy?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;

  playbackUrl?: string | null;
  playbackMode?: "live" | "vod";
  watchStartTime?: string | null;
  isWatching?: boolean;

  // LIVE
  cloudFrontUrl?: string | null;
  mediaPackageUrl?: string | null;
  rtmpInputUrl?: string | null;
  mediaLiveChannelId?: string | null;
  mediaLiveInputId?: string | null;
  mediaLiveInputSecurityGroupId?: string | null;
  mediaPackageChannelId?: string | null;
  mediaPackageEndpointId?: string | null;
  originId?: string | null;
  distributionId?: string | null;
  channelState?: string | null;
  vodcloudFrontUrl?: string | null;

  // VOD
  vodCloudFrontUrl?: string | null;
  vod1080pUrl?: string | null;
  vod720pUrl?: string | null;
  vod480pUrl?: string | null;
  vodStatus?: string | null;
  vodJobId?: string | null;
  vodOutputPath?: string | null;
  vodProcessingStartTime?: string | null;
  vodSourceType?: string | null;
}

/* =========================================================
   DEFAULTS
========================================================= */

const defaultRegistrationFields: RegistrationField[] = [
  { id: "firstName", label: "First Name", type: "text", required: true },
  { id: "lastName", label: "Last Name", type: "text", required: true },
  { id: "email", label: "Email", type: "email", required: true },
];

const initialState: EventFormState = {
  mode: "create",
  eventId: null,

  title: "",
  description: "",
  eventType: "scheduled",
  accessMode: "freeAccess",

  startTime: null,
  endTime: null,

  s3Key: null,
  s3Prefix: null,

  videoConfig: {
    resolution: "1080p",
    frameRate: 30,
    bitrateProfile: "medium",
  },

  registrationFields: defaultRegistrationFields.slice(),

  paymentAmount: null,
  currency: null,
  accessPasswordHash: null,

  vodUpload: {
    fileName: null,
    progress: 0,
    uploading: false,
    error: null,
  },

  status: null,
  createdBy: null,
  createdAt: null,
  updatedAt: null,

  playbackUrl: null,
  playbackMode: "live",
  watchStartTime: null,
  isWatching: false,
};

/* =========================================================
   SLICE
========================================================= */

const slice = createSlice({
  name: "eventForm",
  initialState,
  reducers: {
    /* =====================================================
       CORE FIELD UPDATE
    ===================================================== */
    updateField(
      state,
      action: PayloadAction<{ key: keyof EventFormState; value: any }>
    ) {
      const { key, value } = action.payload;
      // @ts-ignore
      state[key] = value;

      if (key === "eventType") {
        slice.caseReducers.enforceEventTypeRules(state);
      }

      state.updatedAt = new Date().toISOString();
    },

    updateVideoConfig(state, action: PayloadAction<Partial<VideoConfig>>) {
      state.videoConfig = {
        ...state.videoConfig,
        ...action.payload,
      };
      state.updatedAt = new Date().toISOString();
    },

    /* =====================================================
       EVENT TYPE INVARIANTS (BACKEND CONTRACT)
    ===================================================== */
    enforceEventTypeRules(state) {
      if (state.eventType !== "scheduled") {
        state.startTime = null;
        state.endTime = null;
        state.videoConfig = {};
      }

      if (state.eventType !== "vod") {
        state.s3Key = null;
        state.s3Prefix = null;
      }

      state.updatedAt = new Date().toISOString();
    },

    /* =====================================================
       LOAD EVENT
    ===================================================== */
    loadEvent(
      state,
      action: PayloadAction<Partial<EventFormState> & { eventId?: string }>
    ) {
      const payload = action.payload;

      state.mode = payload.eventId ? "update" : "create";
      state.eventId = payload.eventId ?? null;

      state.title = payload.title ?? state.title;
      state.description = payload.description ?? state.description;
      state.eventType = payload.eventType ?? state.eventType;
      state.accessMode = payload.accessMode ?? state.accessMode;

      state.startTime = payload.startTime ? DateTime.fromISO(payload.startTime).toLocal().toFormat("yyyy-MM-dd'T'HH:mm") : state.startTime;
      state.endTime = payload.endTime ? DateTime.fromISO(payload.endTime).toLocal().toFormat("yyyy-MM-dd'T'HH:mm") : state.endTime;

      if (payload.videoConfig) {
        state.videoConfig = { ...payload.videoConfig };
      }

      if (payload.registrationFields) {
        state.registrationFields = payload.registrationFields;
      }

      state.paymentAmount = payload.paymentAmount ?? state.paymentAmount;
      state.currency = payload.currency ?? state.currency;
      state.accessPasswordHash =
        payload.accessPasswordHash ?? state.accessPasswordHash;

      state.status = payload.status ?? state.status;
      state.createdBy = payload.createdBy ?? state.createdBy;
      state.createdAt = payload.createdAt ?? state.createdAt;
      state.updatedAt = new Date().toISOString();

      const liveUrl = payload.cloudFrontUrl || payload.vodcloudFrontUrl || null;
      const vodUrl =
        payload.vodCloudFrontUrl ||
        payload.vod1080pUrl ||
        payload.vod720pUrl ||
        payload.vod480pUrl ||
        null;

      if (payload.eventType === "live") {
        state.playbackMode = "live";
        state.playbackUrl = liveUrl;
      } else {
        state.playbackMode = "vod";
        state.playbackUrl = vodUrl;
      }

      if (payload.s3Key) {
        state.vodUpload = {
          fileName: payload.s3Key,
          progress: 100,
          uploading: false,
          error: null,
        };
      }

      slice.caseReducers.enforceEventTypeRules(state);
    },

    /* =====================================================
       FORM RESET
    ===================================================== */
    resetForm() {
      return initialState;
    },

    /* =====================================================
       REGISTRATION FIELDS
    ===================================================== */
    addRegistrationField(state, action: PayloadAction<RegistrationField>) {
      state.registrationFields.push(action.payload);
      state.updatedAt = new Date().toISOString();
    },

    removeRegistrationField(state, action: PayloadAction<string>) {
      state.registrationFields = state.registrationFields.filter(
        (f) => f.id !== action.payload
      );
      state.updatedAt = new Date().toISOString();
    },

    updateRegistrationField(
      state,
      action: PayloadAction<{ id: string; changes: Partial<RegistrationField> }>
    ) {
      const { id, changes } = action.payload;
      const idx = state.registrationFields.findIndex((f) => f.id === id);
      if (idx !== -1) {
        state.registrationFields[idx] = {
          ...state.registrationFields[idx],
          ...changes,
        };
      }
      state.updatedAt = new Date().toISOString();
    },

    /* =====================================================
       VOD UPLOAD
    ===================================================== */
    setVodUploadProgress(
      state,
      action: PayloadAction<{ progress: number; uploading?: boolean }>
    ) {
      state.vodUpload.progress = action.payload.progress;
      if (action.payload.uploading !== undefined) {
        state.vodUpload.uploading = action.payload.uploading;
      }
      state.updatedAt = new Date().toISOString();
    },

    setVodUploadFile(state, action: PayloadAction<{ fileName: string }>) {
      state.vodUpload = {
        fileName: action.payload.fileName,
        progress: 0,
        uploading: true,
        error: null,
      };
      state.updatedAt = new Date().toISOString();
    },

    setVodUploadError(state, action: PayloadAction<string | null>) {
      state.vodUpload.error = action.payload;
      state.vodUpload.uploading = false;
      state.updatedAt = new Date().toISOString();
    },

    setVodS3Key(
      state,
      action: PayloadAction<{ s3Key: string; s3Prefix?: string | null }>
    ) {
      state.s3Key = action.payload.s3Key;
      state.s3Prefix = action.payload.s3Prefix ?? null;
      state.vodUpload = {
        fileName: null,
        progress: 100,
        uploading: false,
        error: null,
      };
      state.updatedAt = new Date().toISOString();
    },

    /* =====================================================
       PLAYBACK
    ===================================================== */
    setPlaybackMode(state, action: PayloadAction<"live" | "vod">) {
      state.playbackMode = action.payload;
      state.updatedAt = new Date().toISOString();
    },

    setWatchingState(state, action: PayloadAction<boolean>) {
      state.isWatching = action.payload;
      if (action.payload) {
        state.watchStartTime = new Date().toISOString();
      }
      state.updatedAt = new Date().toISOString();
    },
  },
});

export const {
  updateField,
  updateVideoConfig,
  loadEvent,
  resetForm,
  addRegistrationField,
  removeRegistrationField,
  updateRegistrationField,
  setVodUploadProgress,
  setVodUploadFile,
  setVodUploadError,
  setVodS3Key,
  setPlaybackMode,
  setWatchingState,
  enforceEventTypeRules,
} = slice.actions;

export default slice.reducer;
