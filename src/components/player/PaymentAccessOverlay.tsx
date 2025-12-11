import { useState } from "react";

interface Props { onAccessGranted: () => void; }

const PaymentAccessOverlay: React.FC<Props> = ({ onAccessGranted }) => {
  const [loading, setLoading] = useState(false);

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm px-8 py-10 text-center">

        <div className="mx-auto mb-4 w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-yellow-600 flex items-center justify-center">
          <svg width="22" height="22" fill="white" viewBox="0 0 24 24">
            <path d="M2 6h20v12H2V6zm2 4v2h4v-2H4z" />
          </svg>
        </div>

        <h2 className="text-xl font-bold text-gray-900">Premium Access</h2>
        <p className="text-sm text-gray-500 mb-6">Complete payment to unlock</p>

        <div className="bg-yellow-50 border border-yellow-200 text-yellow-900 py-3 rounded-lg font-semibold text-lg mb-4">
          $9.99
        </div>

        <button
          disabled={loading}
          onClick={() => {
            setLoading(true);
            setTimeout(() => onAccessGranted(), 1000);
          }}
          className="w-full bg-yellow-500 hover:bg-yellow-600 disabled:opacity-70 text-white font-semibold py-2.5 rounded-lg shadow"
        >
          {loading ? "Processing..." : "Pay & Watch"}
        </button>

        <p className="text-xs text-gray-400 mt-4">Demo payment overlay</p>
      </div>
    </div>
  );
};

export default PaymentAccessOverlay;
