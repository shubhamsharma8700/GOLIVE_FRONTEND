import React, { useState, useEffect } from "react";
import { CreditCard } from "lucide-react";

export interface PaymentAccessOverlayProps {
  open: boolean;
  onAccessGranted: () => void;
}

const PaymentAccessOverlay: React.FC<PaymentAccessOverlayProps> = ({ 
  open, 
  onAccessGranted 
}) => {
  const [loading, setLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (open) {
      setTimeout(() => setIsVisible(true), 10);
    } else {
      setIsVisible(false);
    }
  }, [open]);

  const handlePayment = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onAccessGranted();
    }, 1500);
  };

  if (!open) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
        opacity: isVisible ? 1 : 0,
        transition: 'opacity 300ms ease-in-out',
        pointerEvents: open ? 'auto' : 'none'
      }}
    >
      {/* Backdrop */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.6)',
          backdropFilter: 'blur(4px)',
          WebkitBackdropFilter: 'blur(4px)'
        }}
      />

      {/* Modal Content */}
      <div
        style={{
          position: 'relative',
          backgroundColor: '#ffffff',
          borderRadius: '1rem',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          width: '100%',
          maxWidth: '24rem',
          padding: '2.5rem 2rem',
          transform: isVisible ? 'scale(1)' : 'scale(0.95)',
          opacity: isVisible ? 1 : 0,
          transition: 'transform 300ms ease-out, opacity 300ms ease-out'
        }}
      >
        {/* Icon */}
        <div
          style={{
            margin: '0 auto 1rem',
            width: '3rem',
            height: '3rem',
            borderRadius: '0.75rem',
            background: 'linear-gradient(to bottom right, #f59e0b, #ca8a04)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)'
          }}
        >
          <CreditCard style={{ width: '1.375rem', height: '1.375rem', color: 'white' }} />
        </div>

        {/* Title */}
        <h2
          style={{
            fontSize: '1.25rem',
            fontWeight: 700,
            color: '#111827',
            textAlign: 'center',
            marginBottom: '0.5rem'
          }}
        >
          Premium Access
        </h2>

        {/* Description */}
        <p
          style={{
            fontSize: '0.875rem',
            color: '#6b7280',
            textAlign: 'center',
            marginBottom: '1.5rem'
          }}
        >
          Complete payment to unlock
        </p>

        {/* Price Box */}
        <div
          style={{
            backgroundColor: '#fef3c7',
            border: '1px solid #fde68a',
            color: '#78350f',
            padding: '0.75rem',
            borderRadius: '0.5rem',
            fontWeight: 600,
            fontSize: '1.125rem',
            marginBottom: '1rem',
            textAlign: 'center'
          }}
        >
          $9.99
        </div>

        {/* Payment Button */}
        <button
          type="button"
          disabled={loading}
          onClick={handlePayment}
          style={{
            width: '100%',
            background: loading ? '#d1d5db' : 'linear-gradient(to right, #eab308, #ca8a04)',
            color: 'white',
            fontWeight: 600,
            padding: '0.625rem',
            borderRadius: '0.5rem',
            border: 'none',
            cursor: loading ? 'not-allowed' : 'pointer',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
            transition: 'all 0.2s ease-in-out',
            opacity: loading ? 0.7 : 1
          }}
          onMouseEnter={(e) => {
            if (!loading) {
              e.currentTarget.style.background = 'linear-gradient(to right, #ca8a04, #a16207)';
              e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)';
            }
          }}
          onMouseLeave={(e) => {
            if (!loading) {
              e.currentTarget.style.background = 'linear-gradient(to right, #eab308, #ca8a04)';
              e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)';
            }
          }}
          onMouseDown={(e) => {
            if (!loading) {
              e.currentTarget.style.transform = 'scale(0.98)';
            }
          }}
          onMouseUp={(e) => {
            if (!loading) {
              e.currentTarget.style.transform = 'scale(1)';
            }
          }}
        >
          {loading ? "Processing..." : "Pay & Watch"}
        </button>

        {/* Footer */}
        <p
          style={{
            fontSize: '0.75rem',
            color: '#9ca3af',
            textAlign: 'center',
            marginTop: '1rem'
          }}
        >
          Demo payment overlay
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
    <div style={{ minHeight: '100vh', background: 'linear-gradient(to bottom right, #0f172a, #1e293b, #0f172a)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
      {!hasAccess ? (
        <PaymentAccessOverlay 
          open={open}
          onAccessGranted={() => {
            setHasAccess(true);
            setOpen(false);
          }}
        />
      ) : (
        <div style={{ textAlign: 'center' }}>
          <div style={{ backgroundColor: 'white', borderRadius: '1rem', padding: '2rem', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', maxWidth: '28rem' }}>
            <div style={{ width: '4rem', height: '4rem', backgroundColor: '#10b981', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
              <svg style={{ width: '2rem', height: '2rem', color: 'white' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#111827', marginBottom: '0.5rem' }}>Payment Successful!</h2>
            <p style={{ color: '#6b7280', marginBottom: '1.5rem' }}>You can now watch the video</p>
            <button 
              onClick={() => {
                setHasAccess(false);
                setOpen(true);
              }}
              style={{ padding: '0.5rem 1.5rem', backgroundColor: '#eab308', color: 'white', borderRadius: '0.5rem', border: 'none', cursor: 'pointer', transition: 'background-color 0.2s' }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#ca8a04'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#eab308'}
            >
              Show Overlay Again
            </button>
          </div>
        </div>
      )}
    </div>
  );
}