import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

/* =====================================================
   TYPES
===================================================== */

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

  // Stored as LOCAL datetime string: yyyy-MM-dd'T'HH:mm
  startTime: string | null;
  endTime: string | null;

  videoConfig: VideoConfig;
  registrationFields: RegistrationField[];

  paymentAmount: number | null;
  currency: string | null;
  accessPassword: string | null;

  // VOD upload (admin-only)
  s3Key: string | null;
  s3Prefix: string | null;
  vodUpload: {
    fileName: string | null;
    progress: number;
    uploading: boolean;
    error: string | null;
  };

  status: string | null;
  createdAt: string | null;
  updatedAt: string | null;
}

/* =====================================================
   DEFAULTS
===================================================== */

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

  videoConfig: {
    resolution: "1080p",
    frameRate: 30,
    bitrateProfile: "medium",
  },

  registrationFields: defaultRegistrationFields.slice(),

  paymentAmount: null,
  currency: null,
  accessPassword: null,

  s3Key: null,
  s3Prefix: null,

  vodUpload: {
    fileName: null,
    progress: 0,
    uploading: false,
    error: null,
  },

  status: null,
  createdAt: null,
  updatedAt: null,
};

/* =====================================================
   SLICE
===================================================== */

const eventFormSlice = createSlice({
  name: "eventForm",
  initialState,
  reducers: {
    /* ---------------- CORE FIELD UPDATE ---------------- */

    updateField(
      state,
      action: PayloadAction<{ key: keyof EventFormState; value: any }>
    ) {
      const { key, value } = action.payload;
      // @ts-ignore
      state[key] = value;
      state.updatedAt = new Date().toISOString();
    },

    updateVideoConfig(state, action: PayloadAction<Partial<VideoConfig>>) {
      state.videoConfig = { ...state.videoConfig, ...action.payload };
      state.updatedAt = new Date().toISOString();
    },

    /* ---------------- EVENT TYPE RULES ---------------- */

    enforceEventTypeRules(state) {
      if (state.eventType === "vod") {
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

    /* ---------------- REGISTRATION FIELDS ---------------- */

    addRegistrationField(
      state,
      action: PayloadAction<RegistrationField>
    ) {
      state.registrationFields.push(action.payload);
      state.updatedAt = new Date().toISOString();
    },

    updateRegistrationField(
      state,
      action: PayloadAction<{
        id: string;
        changes: Partial<RegistrationField>;
      }>
    ) {
      const idx = state.registrationFields.findIndex(
        (f) => f.id === action.payload.id
      );

      if (idx !== -1) {
        state.registrationFields[idx] = {
          ...state.registrationFields[idx],
          ...action.payload.changes,
        };
      }

      state.updatedAt = new Date().toISOString();
    },

    removeRegistrationField(state, action: PayloadAction<string>) {
      state.registrationFields = state.registrationFields.filter(
        (f) => f.id !== action.payload
      );
      state.updatedAt = new Date().toISOString();
    },

    /* ---------------- LOAD EVENT FOR EDIT ---------------- */

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

      state.startTime = payload.startTime ?? state.startTime;
      state.endTime = payload.endTime ?? state.endTime;

      state.videoConfig = payload.videoConfig ?? state.videoConfig;
      state.registrationFields =
        payload.registrationFields ?? state.registrationFields;

      state.paymentAmount = payload.paymentAmount ?? state.paymentAmount;
      state.currency = payload.currency ?? state.currency;
      state.accessPassword =
        payload.accessPassword ?? state.accessPassword;

      state.s3Key = payload.s3Key ?? state.s3Key;
      state.s3Prefix = payload.s3Prefix ?? state.s3Prefix;

      state.status = payload.status ?? state.status;
      state.createdAt = payload.createdAt ?? state.createdAt;
      state.updatedAt = new Date().toISOString();

      eventFormSlice.caseReducers.enforceEventTypeRules(state);
    },

    /* ---------------- RESET ---------------- */

    resetForm() {
      return initialState;
    },

    /* ---------------- VOD UPLOAD ---------------- */

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
  },
});

/* =====================================================
   EXPORTS
===================================================== */

export const {
  updateField,
  updateVideoConfig,
  enforceEventTypeRules,
  loadEvent,
  resetForm,
  addRegistrationField,
  updateRegistrationField,
  removeRegistrationField,
  setVodUploadProgress,
  setVodUploadError,
  setVodS3Key,
} = eventFormSlice.actions;

export default eventFormSlice.reducer;
