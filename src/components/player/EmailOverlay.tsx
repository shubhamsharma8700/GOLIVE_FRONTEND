// src/components/player/EmailOverlay.tsx
import React, { useState, useEffect } from "react";
import { Mail } from "lucide-react";

export interface RegistrationField {
  id: string;
  label: string;
  type: string;
  required?: boolean;
}

export interface EmailOverlayProps {
  open: boolean;
  eventId: string;
  fields: RegistrationField[];
  onAccessGranted: (formData: Record<string, string>) => void;
}

const EmailOverlay: React.FC<EmailOverlayProps> = ({
  open,
  eventId,
  fields,
  onAccessGranted,
}) => {
  const [form, setForm] = useState<Record<string, string>>({});
  const [error, setError] = useState("");
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (open) {
      const t = setTimeout(() => setIsVisible(true), 10);
      return () => clearTimeout(t);
    }
    setIsVisible(false);
  }, [open]);

  const handleChange = (id: string, value: string) => {
    setForm((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = () => {
    for (const field of fields) {
      if (field.required && !form[field.id]) {
        setError(`${field.label} is required`);
        return;
      }
    }

    setError("");
    onAccessGranted(form);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSubmit();
    }
  };

  if (!open) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1rem",
        opacity: isVisible ? 1 : 0,
        transition: "opacity 300ms ease-in-out",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundColor: "rgba(0,0,0,0.6)",
          backdropFilter: "blur(4px)",
        }}
      />

      <div
        style={{
          position: "relative",
          backgroundColor: "#ffffff",
          borderRadius: "1rem",
          boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)",
          width: "100%",
          maxWidth: "20rem",
          padding: "1.25rem",
          transform: isVisible ? "scale(1)" : "scale(0.95)",
          opacity: isVisible ? 1 : 0,
          transition: "transform 300ms ease, opacity 300ms ease",
        }}
      >
        <div
          style={{
            margin: "0 auto 0.75rem",
            width: "2.75rem",
            height: "2.75rem",
            borderRadius: "0.75rem",
            background: "linear-gradient(to bottom right, #fbbf24, #d97706)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Mail size={18} color="white" />
        </div>

        <h2
          style={{
            fontSize: "1.25rem",
            fontWeight: 700,
            color: "#111827",
            textAlign: "center",
            marginBottom: "0.25rem",
          }}
        >
          Access This Video
        </h2>

        <p
          style={{
            fontSize: "0.7rem",
            color: "#9ca3af",
            textAlign: "center",
            marginBottom: "1rem",
          }}
        >
          Event ID: <span style={{ fontFamily: "monospace" }}>{eventId}</span>
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          {fields.map((field) => (
            <input
              key={field.id}
              type={field.type || "text"}
              placeholder={field.label}
              value={form[field.id] || ""}
              onChange={(e) => handleChange(field.id, e.target.value)}
              onKeyDown={handleKeyPress}
              style={inputStyle}
            />
          ))}

          {error && (
            <p style={{ fontSize: "0.75rem", color: "#ef4444" }}>{error}</p>
          )}

          <button
            onClick={handleSubmit}
            style={{
              width: "100%",
              background: "linear-gradient(to right, #fbbf24, #d97706)",
              color: "white",
              fontWeight: 600,
              padding: "0.65rem",
              borderRadius: "0.5rem",
              border: "none",
              cursor: "pointer",
            }}
          >
            Continue to Watch
          </button>
        </div>
      </div>
    </div>
  );
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  backgroundColor: "#f9fafb",
  border: "1px solid #d1d5db",
  borderRadius: "0.5rem",
  padding: "0.5rem 0.75rem",
  fontSize: "0.8rem",
  color: "#111827",
  outline: "none",
};

export default EmailOverlay;
