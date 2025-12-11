// src/components/common/CopyText.tsx
import { useState } from "react";
import { ClipboardCopy, Check } from "lucide-react";

interface CopyTextProps {
  text?: string | null;
}

export default function CopyText({ text }: CopyTextProps) {
  const [copied, setCopied] = useState(false);

  const copy = () => {
    navigator.clipboard.writeText(text || "");
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-gray-800">{text || "N/A"}</span>

      <button
        onClick={copy}
        className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 transition"
      >
        {copied ? (
          <Check className="w-4 h-4 text-green-600" />
        ) : (
          <ClipboardCopy className="w-4 h-4" />
        )}
      </button>
    </div>
  );
}
