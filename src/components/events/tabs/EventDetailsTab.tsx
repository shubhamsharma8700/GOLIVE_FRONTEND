// src/features/events/tabs/EventDetailsTab.tsx

import { useRef, useState, useEffect } from "react";
import { DateTime } from "luxon";
import { Video, Upload, Info, Loader2 } from "lucide-react";

import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { Textarea } from "../../ui/textarea";

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../../ui/select";

import { useAppDispatch } from "../../../hooks/useAppDispatch";
import { useAppSelector } from "../../../hooks/useAppSelector";

import {
  updateField,
  setVodUploadProgress,
  setVodUploadError,
  setVodS3Key,
} from "../../../store/slices/eventFormSlice";

import { useGetPresignedVodUrlMutation } from "../../../store/services/events.service";

export default function EventDetailsTab() {
  const dispatch = useAppDispatch();
  const form = useAppSelector((s) => s.eventForm);

  const [getPresign] = useGetPresignedVodUrlMutation();
  const fileRef = useRef<HTMLInputElement | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const isUploading = form.vodUpload.uploading;
  const nowLocal = DateTime.local().toFormat("yyyy-MM-dd'T'HH:mm");


useEffect(() => {
  if (form.eventType === "live" && !form.startTime) {
    dispatch(updateField({ key: "startTime", value: nowLocal }));
  }
}, [form.eventType, form.startTime, dispatch]);


  /* ======================================================
     FILE SELECT
  ====================================================== */

  const handleSelect = (file?: File | null) => {
    if (!file) return;
    setSelectedFile(file);
    dispatch(updateField({ key: "s3Key", value: file.name }));
  };

  /* ======================================================
     FILE UPLOAD
  ====================================================== */

  const handleUpload = async () => {
    if (!selectedFile || isUploading) {
      dispatch(setVodUploadError("No file selected"));
      return;
    }

    dispatch(setVodUploadError(null));
    dispatch(setVodUploadProgress({ progress: 0, uploading: true }));

    try {
      const presign = await getPresign({
        filename: selectedFile.name,
        contentType: selectedFile.type,
      }).unwrap();

      const { uploadUrl, fileKey } = presign;

      await new Promise<void>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open("PUT", uploadUrl, true);
        xhr.setRequestHeader("Content-Type", selectedFile.type);

        xhr.upload.onprogress = (ev) => {
          if (ev.lengthComputable) {
            const percent = Math.round((ev.loaded / ev.total) * 100);
            dispatch(setVodUploadProgress({ progress: percent }));
          }
        };

        xhr.onerror = () => {
          dispatch(setVodUploadError("Upload failed"));
          dispatch(setVodUploadProgress({ progress: 0, uploading: false }));
          reject();
        };

        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            dispatch(setVodS3Key({ s3Key: fileKey }));
            resolve();
          } else {
            dispatch(setVodUploadError("Upload failed"));
            reject();
          }
        };

        xhr.send(selectedFile);
      });
    } catch {
      dispatch(setVodUploadError("Upload error"));
      dispatch(setVodUploadProgress({ progress: 0, uploading: false }));
    }
  };

  /* ======================================================
     UI
  ====================================================== */

  return (
    <div className="space-y-8">
      {/* BASIC INFO */}
      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-4">
          <Label>Event Title</Label>
          <Input
            value={form.title}
            placeholder="Enter event title"
            onChange={(e) =>
              dispatch(updateField({ key: "title", value: e.target.value }))
            }
          />
        </div>

        <div className="space-y-4">
          <Label>Event Type</Label>
          <Select
            value={form.eventType}
            onValueChange={(v) =>
              dispatch(updateField({ key: "eventType", value: v }))
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="live">Live</SelectItem>
              <SelectItem value="scheduled">Scheduled</SelectItem>
              <SelectItem value="vod">VOD</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* DESCRIPTION */}
      <div className="space-y-4 mt-4">
        <Label>Description</Label>
        <Textarea
          rows={4}
          value={form.description}
          onChange={(e) =>
            dispatch(updateField({ key: "description", value: e.target.value }))
          }
        />
      </div>

      {/* LIVE */}
      {form.eventType === "live" && (
        <div className="grid grid-cols-2 gap-6 mt-4">
          <div className="space-y-4">
            <Label>Live Start Time (Local)</Label>
            <Input
              type="datetime-local"
              value={form.startTime ?? ""}
              readOnly
              disabled
              className="bg-gray-100"
            />
          </div>

          <div className="space-y-4">
            <Label>End Time (Optional)</Label>
            <Input
              type="datetime-local"
              value={form.endTime ?? ""}
              min={form.startTime ?? undefined}
              onChange={(e) =>
                dispatch(updateField({ key: "endTime", value: e.target.value }))
              }
            />
          </div>
        </div>
      )}

      {/* SCHEDULED */}
      {form.eventType === "scheduled" && (
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-4">
            <Label>Start Time (Local)</Label>
            <Input
              type="datetime-local"
              value={form.startTime ?? ""}
              min={nowLocal}
              onChange={(e) =>
                dispatch(updateField({ key: "startTime", value: e.target.value }))
              }
            />
          </div>

          <div className="space-y-4">
            <Label>End Time (Optional)</Label>
            <Input
              type="datetime-local"
              value={form.endTime ?? ""}
              min={form.startTime ?? undefined}
              onChange={(e) =>
                dispatch(updateField({ key: "endTime", value: e.target.value }))
              }
            />
          </div>
        </div>
      )}

      {/* VOD UPLOAD (unchanged UI) */}
      {form.eventType === "vod" && (
        <div className="p-6 border-2 border-dashed border-[#B89B5E]/30 rounded-lg bg-[#B89B5E]/5 space-y-4 mt-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#B89B5E]/20 rounded-lg flex items-center justify-center">
              <Video className="w-5 h-5 text-[#B89B5E]" />
            </div>
            <div>
              <h3 className="font-semibold">Video On Demand (VOD) Upload</h3>
              <p className="text-xs text-gray-600">
                Upload your video file for on-demand streaming.
              </p>
            </div>
          </div>

          <input
            ref={fileRef}
            type="file"
            accept="video/*"
            className="hidden"
            onChange={(e) => handleSelect(e.target.files?.[0])}
          />

          <div className="space-y-3">
            <Label>Video File</Label>

            <div className="flex items-center gap-3">
              <Input
                readOnly
                value={form.s3Key ?? ""}
                placeholder="No file selected"
                className="bg-gray-50"
              />

              <button
                type="button"
                disabled={isUploading}
                onClick={() => fileRef.current?.click()}
                className="px-4 py-2 bg-[#B89B5E] text-white rounded-md hover:bg-[#A28452] flex items-center gap-2 disabled:opacity-50"
              >
                <Upload className="w-4 h-4" />
                Select
              </button>

              <button
                type="button"
                disabled={isUploading}
                onClick={handleUpload}
                className="px-4 py-2 border rounded-md bg-[#B89B5E]/10 text-[#B89B5E] hover:bg-[#B89B5E]/20 disabled:opacity-50 flex items-center gap-2"
              >
                {isUploading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  "Upload"
                )}
              </button>
            </div>

            {isUploading && (
              <div className="w-full bg-gray-200 h-2 rounded">
                <div
                  className="bg-green-600 h-2 rounded"
                  style={{ width: `${form.vodUpload.progress}%` }}
                />
              </div>
            )}

            {form.vodUpload.error && (
              <p className="text-xs text-red-600">{form.vodUpload.error}</p>
            )}

            <p className="text-xs text-[#6B6B6B]">
              Supported formats: MP4, MOV, MKV • Max size: 5GB
            </p>
          </div>

          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-xs text-blue-800 flex gap-2">
            <Info className="w-4 h-4 text-blue-600" />
            Files are uploaded to S3 and streamed via CloudFront CDN.
          </div>
       </div>
      )}
    </div>
  );
}
