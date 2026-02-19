import { useState } from "react";
import { X } from "lucide-react";
import { ClipboardCopy, Check } from "lucide-react";

interface Props {
  open: boolean;
  onClose: () => void;
  eventId: string ;
}

export default function EmbedPlayerModal({ open, onClose, eventId }: Props) {
  const [copied, setCopied] = useState(false);
  if (!open) return null;

  const iframeCode = `<iframe
  src="${window.location.origin}/player/${eventId}"
  width="100%"
  height="100%"
  frameborder="0" 
  allow="payment; fullscreen; autoplay; clipboard-write; encrypted-media; picture-in-picture"
  loading="lazy"
  referrerpolicy="strict-origin-when-cross-origin"
  sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-modals allow-top-navigation-by-user-activation allow-presentation"
></iframe>`;

  const copyIframeCode = async () => {
    await navigator.clipboard.writeText(iframeCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white w-full max-w-2xl rounded-xl shadow-lg p-6 relative">
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
        >
          <X size={18} />
        </button>

        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold">Embed Player</h3>
        </div>

      <div className="flex items-center justify-between mb-2">
        <p className="text-sm text-gray-600">
          Copy and paste this iframe code into your website.
        </p>
        <button
            type="button"
            onClick={copyIframeCode}
            className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-blue-600 border border-blue-200 rounded-md hover:bg-blue-50"
          >
            {copied ? <Check size={14} className="text-green-600" /> : <ClipboardCopy size={14} />}
            {copied ? "Copied" : "Copy"}
          </button>
        </div>
        

        <pre className="bg-gray-100 border rounded-lg p-4 text-sm overflow-auto">
          <code>{iframeCode}</code>
        </pre>
      </div>
    </div>
  );
}
