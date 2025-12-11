import { useState } from "react";

interface EmailAccessOverlayProps { onAccessGranted: () => void; }

const EmailAccessOverlay: React.FC<EmailAccessOverlayProps> = ({ onAccessGranted }) => {
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "" });
  const [error, setError] = useState("");

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md px-8 py-10 text-center">

        {/* Icon */}
        <div className="mx-auto mb-4 w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center">
          <svg width="22" height="22" fill="white" viewBox="0 0 24 24">
            <path d="M2 4h20v16H2V4zm10 9L4 6v12h16V6l-8 7z" />
          </svg>
        </div>

        <h2 className="text-xl font-bold text-gray-900">Access This Video</h2>
        <p className="text-sm text-gray-500 mb-6">Enter your details to continue</p>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!form.firstName || !form.lastName || !form.email) {
              setError("All fields are required");
              return;
            }
            onAccessGranted();
          }}
          className="flex flex-col gap-4 text-left"
        >
          <div>
            <label className="text-xs font-semibold text-gray-700">First Name</label>
            <input
              className="mt-1 w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-amber-400 outline-none"
              placeholder="John"
              value={form.firstName}
              onChange={(e) => setForm({ ...form, firstName: e.target.value })}
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-700">Last Name</label>
            <input
              className="mt-1 w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-amber-400 outline-none"
              placeholder="Doe"
              value={form.lastName}
              onChange={(e) => setForm({ ...form, lastName: e.target.value })}
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-700">Email Address</label>
            <input
              type="email"
              className="mt-1 w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-amber-400 outline-none"
              placeholder="john@example.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>

          {error && <p className="text-xs text-red-500">{error}</p>}

          <button
            className="w-full bg-gradient-to-r from-amber-400 to-amber-600 text-white font-semibold py-2.5 rounded-lg mt-2 hover:from-amber-500 hover:to-amber-700"
          >
            Continue to Watch
          </button>
        </form>

        <p className="text-xs text-gray-400 mt-4">Secure • Verified • Premium</p>
      </div>
    </div>
  );
};

export default EmailAccessOverlay;
