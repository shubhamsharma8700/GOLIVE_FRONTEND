// src/features/events/tabs/EventDetailsTab.tsx

import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { Textarea } from "../../ui/textarea";
import { useAppDispatch } from "../../../hooks/useAppDispatch";
import { useAppSelector } from "../../../hooks/useAppSelector";
import { updateField, setVodUploadProgress, setVodUploadError } from "../../../store/slices/eventSlice";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";

import { Video, Upload, Info } from "lucide-react";
import { useRef, useState } from "react";
import { useGetPresignedVodUrlMutation } from "../../../store/services/events.service";

export default function EventDetailsTab() {
  const dispatch = useAppDispatch();
  const form = useAppSelector((s) => s.eventForm);

  const fileRef = useRef<HTMLInputElement | null>(null);

  // RTK Query mutation
  const [getPresign] = useGetPresignedVodUrlMutation();

  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // ----------------------------
  // HANDLE FILE SELECTION
  // ----------------------------
  const handleSelect = (file?: File | null) => {
    if (!file) return;
    setSelectedFile(file);

    // Show file name in UI
    dispatch(updateField({ key: "s3Key", value: file.name }));
  };

  // ----------------------------
  // UPLOAD TO S3 USING PRESIGN URL
  // ----------------------------
  const handleUpload = async () => {
    if (!selectedFile) {
      dispatch(setVodUploadError("No file selected."));
      return;
    }

    try {
      dispatch(setVodUploadError(""));
      dispatch(setVodUploadProgress(0));

      // Step 1: Ask Backend for Presigned URL
      const presign = await getPresign({
        filename: selectedFile.name,
        contentType: selectedFile.type,
      }).unwrap();

      const uploadUrl = presign.uploadUrl;
      const s3Key = presign.fileKey;

      // Step 2: Upload to S3 via PUT
      await new Promise<void>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open("PUT", uploadUrl, true);
        xhr.setRequestHeader("Content-Type", selectedFile.type);

        xhr.upload.onprogress = (e) => {
          if (e.lengthComputable) {
            const percent = Math.round((e.loaded / e.total) * 100);
            dispatch(setVodUploadProgress(percent));
          }
        };

        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            dispatch(updateField({ key: "s3Key", value: s3Key })); // store S3 key returned by backend
            resolve();
          } else {
            dispatch(setVodUploadError("Upload failed."));
            reject();
          }
        };

        xhr.onerror = () => {
          dispatch(setVodUploadError("Network error during upload."));
          reject();
        };

        xhr.send(selectedFile);
      });
    } catch (err) {
      dispatch(setVodUploadError("Failed to upload file."));
    }
  };

  return (
    <div className="space-y-8">

      {/* ----------------------------- */}
      {/* Title + Type */}
      {/* ----------------------------- */}
      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label>Event Title</Label>
          <Input
            value={form.title}
            placeholder="Enter event title"
            onChange={(e) =>
              dispatch(updateField({ key: "title", value: e.target.value }))
            }
          />
        </div>

        <div className="space-y-2">
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
              <SelectItem value="vod">VOD</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* ----------------------------- */}
      {/* Description */}
      {/* ----------------------------- */}
      <div className="space-y-2">
        <Label>Description</Label>
        <Textarea
          rows={4}
          value={form.description}
          placeholder="Enter description"
          onChange={(e) =>
            dispatch(updateField({ key: "description", value: e.target.value }))
          }
        />
      </div>

      {/* ----------------------------- */}
      {/* LIVE FIELDS */}
      {/* ----------------------------- */}
      {form.eventType === "live" && (
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label>Start Time</Label>
            <Input
              type="datetime-local"
              value={form.startTime ?? ""}
              onChange={(e) =>
                dispatch(updateField({ key: "startTime", value: e.target.value }))
              }
            />
          </div>

          <div className="space-y-2">
            <Label>End Time (optional)</Label>
            <Input
              type="datetime-local"
              value={form.endTime ?? ""}
              onChange={(e) =>
                dispatch(updateField({ key: "endTime", value: e.target.value }))
              }
            />
          </div>
        </div>
      )}

      {/* ----------------------------- */}
      {/*            VOD UPLOAD         */}
      {/* ----------------------------- */}
      {form.eventType === "vod" && (
        <div className="p-6 border-2 border-dashed border-[#B89B5E]/30 rounded-lg bg-[#B89B5E]/5 space-y-4">

          {/* Title Row */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#B89B5E]/20 flex items-center justify-center">
              <Video className="w-5 h-5 text-[#B89B5E]" />
            </div>
            <div>
              <h3 className="font-semibold">Video On Demand (VOD) Upload</h3>
              <p className="text-xs text-gray-600">
                Upload pre-recorded video file for playback
              </p>
            </div>
          </div>

          {/* Hidden input */}
          <input
            ref={fileRef}
            type="file"
            accept="video/*"
            className="hidden"
            onChange={(e) => handleSelect(e.target.files?.[0])}
          />

          {/* UI */}
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
                onClick={() => fileRef.current?.click()}
                className="px-4 py-2 bg-[#B89B5E] text-white rounded-md hover:bg-[#A28452] flex items-center gap-2"
              >
                <Upload className="w-4 h-4" />
                Select
              </button>

              <button
                type="button"
                onClick={handleUpload}
                className="px-4 py-2 border rounded-md bg-[#B89B5E]/10 text-[#B89B5E] hover:bg-[#B89B5E]/20"
              >
                Upload
              </button>
            </div>

            {/* Progress Bar */}
            {form.vodUpload?.progress > 0 && (
              <div className="w-full bg-gray-200 h-2 rounded">
                <div
                  className="bg-green-600 h-2 rounded"
                  style={{ width: `${form.vodUpload.progress}%` }}
                />
              </div>
            )}

            {/* Error */}
            {form.vodUpload?.error && (
              <p className="text-xs text-red-600">{form.vodUpload.error}</p>
            )}

            <p className="text-xs text-[#6B6B6B]">
              Supported formats: MP4, MOV, MKV • Max size: 5GB
            </p>
          </div>

          {/* Info Box */}
          <div className="bg-blue-50 border border-blue-200 text-blue-800 p-3 rounded-lg text-xs leading-5 flex gap-2">
            <Info className="w-4 h-4 text-blue-600 flex-shrink-0" />
            VOD files are uploaded to S3 & served through CloudFront.
          </div>
        </div>
      )}
    </div>
  );
}
