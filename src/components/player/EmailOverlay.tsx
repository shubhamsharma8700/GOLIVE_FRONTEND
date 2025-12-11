import React, { useState, useEffect } from "react";
import { Mail } from "lucide-react";

export interface EmailOverlayProps {
  open: boolean;
  onAccessGranted: () => void;
}

const EmailOverlay: React.FC<EmailOverlayProps> = ({ open, onAccessGranted }) => {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: ""
  });

  const [error, setError] = useState("");
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (open) {
      setTimeout(() => setIsVisible(true), 10);
    } else {
      setIsVisible(false);
    }
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
    onAccessGranted();
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
        pointerEvents: open ? "auto" : "none"
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundColor: "rgba(0, 0, 0, 0.6)",
          backdropFilter: "blur(4px)",
          WebkitBackdropFilter: "blur(4px)"
        }}
        onClick={() => {}}
      />

      {/* Modal Content (SMALLER VERSION) */}
      <div
        style={{
          position: "relative",
          backgroundColor: "#ffffff",
          borderRadius: "1rem",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
          width: "100%",
          maxWidth: "20rem",       // smaller width
          padding: "1.25rem",      // smaller overall height
          transform: isVisible ? "scale(1)" : "scale(0.95)",
          opacity: isVisible ? 1 : 0,
          transition: "transform 300ms ease-out, opacity 300ms ease-out"
        }}
      >
        {/* Icon (smaller) */}
        <div
          style={{
            margin: "0 auto 0.75rem",
            width: "2.75rem",
            height: "2.75rem",
            borderRadius: "0.75rem",
            background: "linear-gradient(to bottom right, #fbbf24, #d97706)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          <Mail style={{ width: "1.4rem", height: "1.4rem", color: "white" }} />
        </div>

        {/* Title */}
        <h2
          style={{
            fontSize: "1.25rem",
            fontWeight: 700,
            color: "#111827",
            textAlign: "center",
            marginBottom: "0.5rem"
          }}
        >
          Access This Video
        </h2>

        {/* Description */}
        <p
          style={{
            fontSize: "0.8rem",
            color: "#6b7280",
            textAlign: "center",
            marginBottom: "1rem"
          }}
        >
          Enter your details to continue
        </p>

        {/* Form */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          {/* First Name */}
          <div>
            <label
              style={{
                display: "block",
                fontSize: "0.8rem",
                fontWeight: 600,
                color: "#374151",
                marginBottom: "0.25rem"
              }}
            >
              First Name
            </label>
            <input
              type="text"
              placeholder="John"
              style={{
                width: "100%",
                backgroundColor: "#f9fafb",
                border: "1px solid #d1d5db",
                borderRadius: "0.5rem",
                padding: "0.5rem 0.75rem",
                fontSize: "0.8rem",
                color: "#111827",
                outline: "none",
                transition: "all 0.2s ease-in-out"
              }}
              value={form.firstName}
              onChange={(e) => setForm({ ...form, firstName: e.target.value })}
              onKeyPress={handleKeyPress}
            />
          </div>

          {/* Last Name */}
          <div>
            <label
              style={{
                display: "block",
                fontSize: "0.8rem",
                fontWeight: 600,
                color: "#374151",
                marginBottom: "0.25rem"
              }}
            >
              Last Name
            </label>
            <input
              type="text"
              placeholder="Doe"
              style={{
                width: "100%",
                backgroundColor: "#f9fafb",
                border: "1px solid #d1d5db",
                borderRadius: "0.5rem",
                padding: "0.5rem 0.75rem",
                fontSize: "0.8rem",
                color: "#111827",
                outline: "none",
                transition: "all 0.2s ease-in-out"
              }}
              value={form.lastName}
              onChange={(e) => setForm({ ...form, lastName: e.target.value })}
              onKeyPress={handleKeyPress}
            />
          </div>

          {/* Email */}
          <div>
            <label
              style={{
                display: "block",
                fontSize: "0.8rem",
                fontWeight: 600,
                color: "#374151",
                marginBottom: "0.25rem"
              }}
            >
              Email Address
            </label>
            <input
              type="email"
              placeholder="john@example.com"
              style={{
                width: "100%",
                backgroundColor: "#f9fafb",
                border: "1px solid #d1d5db",
                borderRadius: "0.5rem",
                padding: "0.5rem 0.75rem",
                fontSize: "0.8rem",
                color: "#111827",
                outline: "none",
                transition: "all 0.2s ease-in-out"
              }}
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              onKeyPress={handleKeyPress}
            />
          </div>

          {/* Error */}
          {error && (
            <p
              style={{
                fontSize: "0.8rem",
                color: "#ef4444",
                marginTop: "-0.25rem"
              }}
            >
              {error}
            </p>
          )}

          {/* Submit */}
          <button
            type="button"
            onClick={handleSubmit}
            style={{
              width: "100%",
              background: "linear-gradient(to right, #fbbf24, #d97706)",
              color: "white",
              fontWeight: 600,
              padding: "0.65rem",
              borderRadius: "0.5rem",
              marginTop: "0.25rem",
              border: "none",
              cursor: "pointer"
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
            marginTop: "1rem"
          }}
        >
          Secure • Verified • Premium
        </p>
      </div>
    </div>
  );
};

// Demo Component
export default function Demo() {
  const [open, setOpen] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(to bottom right, #0f172a, #1e293b, #0f172a)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1rem"
      }}
    >
      {!hasAccess ? (
        <EmailOverlay
          open={open}
          onAccessGranted={() => {
            setHasAccess(true);
            setOpen(false);
          }}
        />
      ) : (
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              backgroundColor: "white",
              borderRadius: "1rem",
              padding: "2rem",
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
              maxWidth: "20rem",
              margin: "0 auto"
            }}
          >
            <div
              style={{
                width: "3rem",
                height: "3rem",
                backgroundColor: "#10b981",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 1rem"
              }}
            >
              <svg
                style={{ width: "1.75rem", height: "1.75rem", color: "white" }}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>

            <h2 style={{ fontSize: "1.25rem", fontWeight: 700, color: "#111827" }}>
              Access Granted!
            </h2>

            <p style={{ color: "#6b7280", marginBottom: "1rem" }}>
              You can now watch the video
            </p>

            <button
              onClick={() => {
                setHasAccess(false);
                setOpen(true);
              }}
              style={{
                padding: "0.5rem 1.25rem",
                backgroundColor: "#f59e0b",
                color: "white",
                borderRadius: "0.5rem",
                border: "none",
                cursor: "pointer"
              }}
            >
              Show Overlay Again
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
