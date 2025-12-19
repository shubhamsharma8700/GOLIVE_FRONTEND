import React, { useState, useEffect } from "react";
import { CreditCard } from "lucide-react";

export interface PaymentAccessOverlayProps {
  open: boolean;
  eventId: string;
  amount?: number;
  currency?: string;
  onPay: () => Promise<void> | void;
}

const PaymentAccessOverlay: React.FC<PaymentAccessOverlayProps> = ({
  open,
  eventId,
  amount,
  currency,
  onPay,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  /* ---------------------------------------------
     Open / close animation + reset
  --------------------------------------------- */
  useEffect(() => {
    if (open) {
      setLoading(false);
      setError(null);

      const t = setTimeout(() => setIsVisible(true), 10);
      return () => clearTimeout(t);
    }
    setIsVisible(false);
  }, [open]);

  /* ---------------------------------------------
     Handle payment
  --------------------------------------------- */
  const handlePayment = async () => {
    if (loading) return;

    try {
      setLoading(true);
      setError(null);
      await onPay(); // Stripe handled in PlayerPage
    } catch (err: any) {
      setError(
        err?.message ||
          "Payment failed. Please try again or use a different card."
      );
    } finally {
      setLoading(false);
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
          maxWidth: "24rem",
          padding: "2.25rem 2rem",
          transform: isVisible ? "scale(1)" : "scale(0.95)",
          opacity: isVisible ? 1 : 0,
          transition: "transform 300ms ease, opacity 300ms ease",
        }}
      >
        {/* Icon */}
        <div
          style={{
            margin: "0 auto 1rem",
            width: "3rem",
            height: "3rem",
            borderRadius: "0.75rem",
            background: "linear-gradient(to bottom right, #f59e0b, #ca8a04)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <CreditCard size={18} color="white" />
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
          Premium Access
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
            marginBottom: "1.25rem",
          }}
        >
          Complete payment to unlock this stream
        </p>

        {/* Price */}
        <div
          style={{
            backgroundColor: "#fef3c7",
            border: "1px solid #fde68a",
            color: "#78350f",
            padding: "0.75rem",
            borderRadius: "0.5rem",
            fontWeight: 700,
            fontSize: "1.125rem",
            marginBottom: "1rem",
            textAlign: "center",
          }}
        >
          {currency || '$'} {amount?.toFixed(2) || '0.00'}
        </div>

        {/* Error */}
        {error && (
          <p
            style={{
              fontSize: "0.75rem",
              color: "#ef4444",
              textAlign: "center",
              marginBottom: "0.75rem",
            }}
          >
            {error}
          </p>
        )}

        {/* Pay Button */}
        <button
          type="button"
          disabled={loading}
          onClick={handlePayment}
          style={{
            width: "100%",
            background: loading
              ? "#d1d5db"
              : "linear-gradient(to right, #eab308, #ca8a04)",
            color: "white",
            fontWeight: 600,
            padding: "0.65rem",
            borderRadius: "0.5rem",
            border: "none",
            cursor: loading ? "not-allowed" : "pointer",
            opacity: loading ? 0.7 : 1,
          }}
        >
          {loading ? "Processing payment…" : "Pay & Watch"}
        </button>

        {/* Footer */}
        <p
          style={{
            fontSize: "0.75rem",
            color: "#9ca3af",
            textAlign: "center",
            marginTop: "1rem",
          }}
        >
          Secure • Encrypted • Event Access
        </p>
      </div>
    </div>
  );
};

export default PaymentAccessOverlay;
