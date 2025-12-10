// src/features/events/eventSlice.ts
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type AccessMode = "freeAccess" | "emailAccess" | "passwordAccess" | "paidAccess";

export interface RegistrationField {
  id: string;
  label: string;
  type: string;
  required: boolean;
}

export interface EventFormState {
  mode: "create" | "update";
  eventId: string | null;
  // core event fields
  title: string;
  description: string;
  eventType: "live" | "vod";
  accessMode: AccessMode;
  startTime?: string | null;
  endTime?: string | null;
  s3Key?: string | null;
  s3Prefix?: string | null;
  // dynamic registration
  registrationFields: RegistrationField[];
  // payment
  paymentAmount?: number | null;
  currency?: string | null;
  // passwordAccess
  accessPasswordHash?: string | null; // store only hashed on backend — this is optional for UI
  // vod upload status
  vodUpload: {
    fileName?: string | null;
    progress: number;
    uploading: boolean;
    error?: string | null;
  };
  // generic meta
  status?: string | null;
  createdBy?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
}

const defaultRegistrationFields: RegistrationField[] = [
  { id: "userId", label: "User ID", type: "text", required: true },
  { id: "email", label: "Email", type: "email", required: true },
  { id: "eventId", label: "Event ID", type: "text", required: true },
];

const initialState: EventFormState = {
  mode: "create",
  eventId: null,
  title: "",
  description: "",
  eventType: "live",
  accessMode: "freeAccess",
  startTime: null,
  endTime: null,
  s3Key: null,
  s3Prefix: null,
  registrationFields: defaultRegistrationFields,
  paymentAmount: null,
  currency: null,
  accessPasswordHash: null,
  vodUpload: { fileName: null, progress: 0, uploading: false, error: null },
  status: null,
  createdBy: null,
  createdAt: null,
  updatedAt: null,
};

const slice = createSlice({
  name: "eventForm",
  initialState,
  reducers: {
    // Simple field updater
    updateField<T extends keyof EventFormState>(state: EventFormState, action: PayloadAction<{ key: T; value: EventFormState[T] }>) {
      const { key, value } = action.payload;
      // @ts-ignore assignment by key
      state[key] = value;
      state.updatedAt = new Date().toISOString();
    },

    // Bulk replace (used for loading existing event)
    loadEvent(state, action: PayloadAction<Partial<EventFormState> & { eventId?: string }>) {
      const payload = action.payload;
      state.mode = payload.eventId ? "update" : "create";
      state.eventId = payload.eventId ?? null;
      state.title = (payload.title ?? state.title) as string;
      state.description = (payload.description ?? state.description) as string;
      state.eventType = (payload.eventType ?? state.eventType) as "live" | "vod";
      state.accessMode = (payload.accessMode ?? state.accessMode) as AccessMode;
      state.startTime = payload.startTime ?? state.startTime;
      state.endTime = payload.endTime ?? state.endTime;
      state.s3Key = payload.s3Key ?? state.s3Key;
      state.s3Prefix = payload.s3Prefix ?? state.s3Prefix;
      state.registrationFields = payload.registrationFields ?? state.registrationFields;
      state.paymentAmount = payload.paymentAmount ?? state.paymentAmount;
      state.currency = payload.currency ?? state.currency;
      state.accessPasswordHash = payload.accessPasswordHash ?? state.accessPasswordHash;
      state.status = payload.status ?? state.status;
      state.createdBy = payload.createdBy ?? state.createdBy;
      state.createdAt = payload.createdAt ?? state.createdAt;
      state.updatedAt = payload.updatedAt ?? new Date().toISOString();
      // reset vod upload status if provided
      if (payload.s3Key) {
        state.vodUpload = { fileName: null, progress: 100, uploading: false, error: null };
      }
    },

    // reset to initial
    resetForm(state) {
      Object.assign(state, initialState);
    },

    // Registration fields actions
    addRegistrationField(state, action: PayloadAction<RegistrationField>) {
      state.registrationFields.push(action.payload);
      state.updatedAt = new Date().toISOString();
    },

    removeRegistrationField(state, action: PayloadAction<string>) {
      state.registrationFields = state.registrationFields.filter((f) => f.id !== action.payload);
      state.updatedAt = new Date().toISOString();
    },

    updateRegistrationField(state, action: PayloadAction<{ id: string; changes: Partial<RegistrationField> }>) {
      const { id, changes } = action.payload;
      const idx = state.registrationFields.findIndex((f) => f.id === id);
      if (idx !== -1) {
        state.registrationFields[idx] = { ...state.registrationFields[idx], ...changes };
        state.updatedAt = new Date().toISOString();
      }
    },

    // VOD upload progress
    setVodUploadProgress(state, action: PayloadAction<{ progress: number; uploading?: boolean }>) {
      state.vodUpload.progress = action.payload.progress;
      if (action.payload.uploading !== undefined) state.vodUpload.uploading = action.payload.uploading;
    },

    setVodUploadFile(state, action: PayloadAction<{ fileName: string }>) {
      state.vodUpload.fileName = action.payload.fileName;
      state.vodUpload.progress = 0;
      state.vodUpload.uploading = true;
      state.vodUpload.error = null;
    },

    setVodUploadError(state, action: PayloadAction<string | null>) {
      state.vodUpload.error = action.payload;
      state.vodUpload.uploading = false;
    },

    setVodS3Key(state, action: PayloadAction<{ s3Key: string; s3Prefix?: string }>) {
      state.s3Key = action.payload.s3Key;
      state.s3Prefix = action.payload.s3Prefix ?? (action.payload.s3Key.substring(0, action.payload.s3Key.lastIndexOf("/") + 1) || null);
      state.vodUpload.progress = 100;
      state.vodUpload.uploading = false;
    },
  },
});

export const {
  updateField,
  loadEvent,
  resetForm,
  addRegistrationField,
  removeRegistrationField,
  updateRegistrationField,
  setVodUploadProgress,
  setVodUploadFile,
  setVodUploadError,
  setVodS3Key,
} = slice.actions;

export default slice.reducer;
