import React, { useState, useEffect } from "react";
import { Lock } from "lucide-react";

export interface PasswordAccessOverlayProps {
  open: boolean;
  eventId: string;
  onSubmit: (password: string) => void;
}

const PasswordAccessOverlay: React.FC<PasswordAccessOverlayProps> = ({
  open,
  eventId,
  onSubmit,
}) => {
  const [password, setPassword] = useState("");
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
    if (!password) {
      setError("Password is required");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setError("");
    onSubmit(password);
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
          backgroundColor: "rgba(0, 0, 0, 0.6)",
          backdropFilter: "blur(4px)",
        }}
      />

      {/* Modal */}
      <div
        style={{
          position: "relative",
          backgroundColor: "#ffffff",
          borderRadius: "1rem",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
          width: "100%",
          maxWidth: "28rem",
          padding: "2rem",
          transform: isVisible ? "scale(1)" : "scale(0.95)",
          opacity: isVisible ? 1 : 0,
          transition: "transform 300ms ease, opacity 300ms ease",
        }}
      >
        {/* Icon */}
        <div
          style={{
            margin: "0 auto 1rem",
            width: "3.5rem",
            height: "3.5rem",
            borderRadius: "0.75rem",
            background: "linear-gradient(to bottom right, #fbbf24, #d97706)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Lock size={22} color="white" />
        </div>

        {/* Title */}
        <h2
          style={{
            fontSize: "1.5rem",
            fontWeight: 700,
            color: "#111827",
            textAlign: "center",
            marginBottom: "0.25rem",
          }}
        >
          Enter Password
        </h2>

        {/* Event Context */}
        <p
          style={{
            fontSize: "0.75rem",
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
            fontSize: "0.875rem",
            color: "#6b7280",
            textAlign: "center",
            marginBottom: "1.5rem",
          }}
        >
          This video is password protected
        </p>

        {/* Form */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <input
            type="password"
            placeholder="Enter password"
            autoFocus
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={handleKeyPress}
            style={inputStyle}
          />

          {error && (
            <p style={{ fontSize: "0.875rem", color: "#ef4444" }}>
              {error}
            </p>
          )}

          <button
            type="button"
            onClick={handleSubmit}
            style={buttonStyle}
          >
            Unlock & Watch
          </button>
        </div>

        <p
          style={{
            fontSize: "0.75rem",
            color: "#9ca3af",
            textAlign: "center",
            marginTop: "1.25rem",
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
  padding: "0.625rem 1rem",
  fontSize: "0.875rem",
  color: "#111827",
  outline: "none",
};

const buttonStyle: React.CSSProperties = {
  width: "100%",
  background: "linear-gradient(to right, #fbbf24, #d97706)",
  color: "white",
  fontWeight: 600,
  padding: "0.75rem",
  borderRadius: "0.5rem",
  border: "none",
  cursor: "pointer",
};

export default PasswordAccessOverlay;
