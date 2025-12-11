import React, { useState, useEffect } from "react";
import { Lock } from "lucide-react";

export interface PasswordAccessOverlayProps {
  open: boolean;
  onAccessGranted: () => void;
}

const PasswordAccessOverlay: React.FC<PasswordAccessOverlayProps> = ({ 
  open, 
  onAccessGranted 
}) => {
  const [password, setPassword] = useState("");
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
    if (!password) {
      setError("Password is required");
      return;
    }
    
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    
    setError("");
    onAccessGranted();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSubmit();
    }
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
          maxWidth: '28rem',
          padding: '2rem',
          transform: isVisible ? 'scale(1)' : 'scale(0.95)',
          opacity: isVisible ? 1 : 0,
          transition: 'transform 300ms ease-out, opacity 300ms ease-out'
        }}
      >
        {/* Icon */}
        <div
          style={{
            margin: '0 auto 1rem',
            width: '3.5rem',
            height: '3.5rem',
            borderRadius: '0.75rem',
            background: 'linear-gradient(to bottom right, #fbbf24, #d97706)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)'
          }}
        >
          <Lock style={{ width: '1.75rem', height: '1.75rem', color: 'white' }} />
        </div>

        {/* Title */}
        <h2
          style={{
            fontSize: '1.5rem',
            fontWeight: 700,
            color: '#111827',
            textAlign: 'center',
            marginBottom: '0.5rem'
          }}
        >
          Enter Password
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
          This video is password protected
        </p>

        {/* Form */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Password */}
          <div>
            <label
              style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: 600,
                color: '#374151',
                marginBottom: '0.375rem'
              }}
            >
              Password
            </label>
            <input
              type="password"
              placeholder="Enter password"
              autoFocus
              style={{
                width: '100%',
                backgroundColor: '#f9fafb',
                border: '1px solid #d1d5db',
                borderRadius: '0.5rem',
                padding: '0.625rem 1rem',
                fontSize: '0.875rem',
                color: '#111827',
                outline: 'none',
                transition: 'all 0.2s ease-in-out'
              }}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyPress={handleKeyPress}
              onFocus={(e) => {
                e.target.style.borderColor = '#fbbf24';
                e.target.style.boxShadow = '0 0 0 3px rgba(251, 191, 36, 0.1)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#d1d5db';
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>

          {/* Error Message */}
          {error && (
            <p
              style={{
                fontSize: '0.875rem',
                color: '#ef4444',
                marginTop: '-0.5rem'
              }}
            >
              {error}
            </p>
          )}

          {/* Submit Button */}
          <button
            type="button"
            onClick={handleSubmit}
            style={{
              width: '100%',
              background: 'linear-gradient(to right, #fbbf24, #d97706)',
              color: 'white',
              fontWeight: 600,
              padding: '0.75rem',
              borderRadius: '0.5rem',
              marginTop: '0.5rem',
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
              transition: 'all 0.2s ease-in-out'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'linear-gradient(to right, #f59e0b, #b45309)';
              e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'linear-gradient(to right, #fbbf24, #d97706)';
              e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)';
            }}
            onMouseDown={(e) => {
              e.currentTarget.style.transform = 'scale(0.98)';
            }}
            onMouseUp={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            Unlock & Watch
          </button>
        </div>

        {/* Footer */}
        <p
          style={{
            fontSize: '0.75rem',
            color: '#9ca3af',
            textAlign: 'center',
            marginTop: '1.25rem'
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
    <div style={{ minHeight: '100vh', background: 'linear-gradient(to bottom right, #0f172a, #1e293b, #0f172a)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
      {!hasAccess ? (
        <PasswordAccessOverlay 
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
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#111827', marginBottom: '0.5rem' }}>Access Granted!</h2>
            <p style={{ color: '#6b7280', marginBottom: '1.5rem' }}>You can now watch the video</p>
            <button 
              onClick={() => {
                setHasAccess(false);
                setOpen(true);
              }}
              style={{ padding: '0.5rem 1.5rem', backgroundColor: '#f59e0b', color: 'white', borderRadius: '0.5rem', border: 'none', cursor: 'pointer', transition: 'background-color 0.2s' }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#d97706'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#f59e0b'}
            >
              Show Overlay Again
            </button>
          </div>
        </div>
      )}
    </div>
  );
}