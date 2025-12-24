import CopyText from "../common/CopyText";
import { X } from "lucide-react";

interface Props {
  open: boolean;
  onClose: () => void;
  eventId: string ;
}

export default function EmbedPlayerModal({ open, onClose, eventId }: Props) {
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

        <h3 className="text-lg font-semibold mb-2">Embed Player</h3>
        <p className="text-sm text-gray-600 mb-4">
          Copy and paste this iframe code into your website.
        </p>

        <pre className="bg-gray-100 border rounded-lg p-4 text-sm overflow-auto">
          <code>{iframeCode}</code>
        </pre>

        <div className="mt-4">
          <CopyText text={iframeCode} />
        </div>
      </div>
    </div>
  );
}
