import React, { useState, useEffect } from "react";
import { Mail } from "lucide-react";

export interface EmailOverlayProps {
  open: boolean;
  eventId: string;
  onAccessGranted: (formData: {
    firstName: string;
    lastName: string;
    email: string;
  }) => void;
}

const EmailOverlay: React.FC<EmailOverlayProps> = ({
  open,
  eventId,
  onAccessGranted,
}) => {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
  });

  const [error, setError] = useState("");
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (open) {
      const t = setTimeout(() => setIsVisible(true), 10);
      return () => clearTimeout(t);
    }
    setIsVisible(false);
  }, [open]);

  const handleSubmit = () => {
    if (!form.firstName || !form.lastName || !form.email) {
      setError("All fields are required");
      return;
    }

    if (!form.email.includes("@")) {
      setError("Please enter a valid email");
      return;
    }

    setError("");

    // ✅ Pass collected data back to PlayerPage
    onAccessGranted({
      firstName: form.firstName.trim(),
      lastName: form.lastName.trim(),
      email: form.email.trim().toLowerCase(),
    });
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
      {/* Backdrop */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundColor: "rgba(0,0,0,0.6)",
          backdropFilter: "blur(4px)",
        }}
      />

      {/* Modal */}
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
        {/* Icon */}
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

        {/* Title */}
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

        {/* Event context */}
        <p
          style={{
            fontSize: "0.7rem",
            color: "#9ca3af",
            textAlign: "center",
            marginBottom: "0.75rem",
          }}
        >
          Event ID: <span style={{ fontFamily: "monospace" }}>{eventId}</span>
        </p>

        {/* Description */}
        <p
          style={{
            fontSize: "0.8rem",
            color: "#6b7280",
            textAlign: "center",
            marginBottom: "1rem",
          }}
        >
          Enter your details to continue
        </p>

        {/* Form */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          <input
            placeholder="First name"
            value={form.firstName}
            onChange={(e) =>
              setForm({ ...form, firstName: e.target.value })
            }
            onKeyDown={handleKeyPress}
            style={inputStyle}
          />

          <input
            placeholder="Last name"
            value={form.lastName}
            onChange={(e) =>
              setForm({ ...form, lastName: e.target.value })
            }
            onKeyDown={handleKeyPress}
            style={inputStyle}
          />

          <input
            placeholder="Email address"
            value={form.email}
            onChange={(e) =>
              setForm({ ...form, email: e.target.value })
            }
            onKeyDown={handleKeyPress}
            style={inputStyle}
          />

          {error && (
            <p style={{ fontSize: "0.75rem", color: "#ef4444" }}>
              {error}
            </p>
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

        <p
          style={{
            fontSize: "0.7rem",
            color: "#9ca3af",
            textAlign: "center",
            marginTop: "0.75rem",
          }}
        >
          Secure • Verified • Event Access
        </p>
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
