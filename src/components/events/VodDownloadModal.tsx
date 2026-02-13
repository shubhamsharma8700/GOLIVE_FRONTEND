import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Download, Copy, Check, Loader2, Film } from "lucide-react";
import { useLazyGetVodDownloadUrlQuery } from "../../store/services/events.service";

interface VodDownloadModalProps {
  open: boolean;
  onClose: () => void;
  eventId: string;
}

export default function VodDownloadModal({
  open,
  onClose,
  eventId,
}: VodDownloadModalProps) {
  const [trigger, { isLoading }] = useLazyGetVodDownloadUrlQuery();
  const [resolutions, setResolutions] = useState<Record<string, string>>({});
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    if (!open || !eventId) return;
    setResolutions({});

    const fetchUrls = async () => {
      try {
        const result = await trigger(eventId).unwrap();
        const res = result?.data?.resolutions;
        if (res && typeof res === "object") {
          setResolutions({ ...res });
        }
      } catch {
        setResolutions({});
      }
    };

    fetchUrls();
  }, [open, eventId, trigger]);

  const copyUrl = (resolution: string, url: string) => {
    navigator.clipboard.writeText(url);
    setCopied(resolution);
    setTimeout(() => setCopied(null), 1500);
  };

  const downloadUrl = (url: string) => {
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const entries = Object.entries(resolutions);

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-sm rounded-xl border border-gray-200/80 shadow-xl bg-white p-0 overflow-hidden">
        <div className="bg-gradient-to-br from-[#B89B5E]/10 via-transparent to-[#B89B5E]/5 px-6 pt-6 pb-4">
          <DialogHeader>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#B89B5E]/20 flex items-center justify-center">
                <Film className="w-5 h-5 text-[#B89B5E]" />
              </div>
              <div>
                <DialogTitle className="text-lg font-semibold text-gray-900">
                  Download VOD
                </DialogTitle>
                <DialogDescription className="text-sm text-gray-600 mt-0.5">
                  Choose quality and copy link or download. Links expire after a short time.
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
        </div>

        <div className="px-6 pb-6 pt-2">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-8 gap-3">
              <Loader2 className="h-8 w-8 animate-spin text-[#B89B5E]" />
              <p className="text-sm text-gray-500">Loading download links...</p>
            </div>
          ) : entries.length === 0 ? (
            <div className="text-center py-8 px-4 rounded-lg bg-gray-50 border border-dashed border-gray-200">
              <Film className="w-10 h-10 text-gray-300 mx-auto mb-2" />
              <p className="text-sm text-gray-500">No download links available</p>
            </div>
          ) : (
            <div className="space-y-3">
              {entries.map(([resolution, url]) => (
                <div
                  key={resolution}
                  className="flex items-center justify-between gap-3 rounded-lg border border-gray-200 bg-gray-50/80 hover:bg-gray-50 transition-colors px-4 py-3"
                >
                  <span className="inline-flex items-center font-medium text-gray-900 bg-white border border-gray-200 rounded-md px-2.5 py-1 text-sm shadow-sm">
                    {resolution}
                  </span>
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="h-8 gap-1.5 px-3 text-xs border-gray-300 hover:bg-gray-100"
                      onClick={() => copyUrl(resolution, url)}
                    >
                      {copied === resolution ? (
                        <Check className="h-4 w-4 text-green-600" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                      {copied === resolution ? "Copied" : "Copy URL"}
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      className="h-8 gap-1.5 px-3 text-xs bg-[#B89B5E] text-white hover:bg-[#A28452] shadow-sm"
                      onClick={() => downloadUrl(url)}
                    >
                      <Download className="h-4 w-4" />
                      Download
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
