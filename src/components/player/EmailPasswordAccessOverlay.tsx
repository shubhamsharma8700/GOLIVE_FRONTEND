import { useState } from "react";

interface Props { onAccessGranted: () => void; }

const EmailPasswordAccessOverlay: React.FC<Props> = ({ onAccessGranted }) => {
  const [step, setStep] = useState<1 | 2>(1);
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", password: "" });
  const [error, setError] = useState("");

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md px-8 py-10 text-center">

        {/* Icon */}
        <div className="mx-auto mb-4 w-12 h-12 rounded-xl bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center">
          <svg width="22" height="22" fill="white" viewBox="0 0 24 24">
            <path d="M12 2a5 5 0 00-5 5v4H5v9h14v-9h-2V7a5 5 0 00-5-5zm0 2a3 3 0 013 3v4H9V7a3 3 0 013-3z" />
          </svg>
        </div>

        <h2 className="text-xl font-bold text-gray-900">Secure Access</h2>
        <p className="text-sm text-gray-500 mb-6">{step === 1 ? "Enter your info" : "Create password"}</p>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (step === 1) {
              if (!form.firstName || !form.lastName || !form.email) {
                setError("All fields are required");
                return;
              }
              setStep(2);
              setError("");
              return;
            }
            if (!form.password) {
              setError("Enter a password");
              return;
            }
            onAccessGranted();
          }}
          className="flex flex-col gap-4 text-left"
        >
          {step === 1 ? (
            <>
              <div>
                <label className="text-xs font-semibold text-gray-700">First Name</label>
                <input
                  className="mt-1 w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-purple-400 outline-none"
                  value={form.firstName}
                  onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                  placeholder="John"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-700">Last Name</label>
                <input
                  className="mt-1 w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-purple-400 outline-none"
                  value={form.lastName}
                  onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                  placeholder="Doe"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-700">Email</label>
                <input
                  type="email"
                  className="mt-1 w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-purple-400 outline-none"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="john@example.com"
                />
              </div>
            </>
          ) : (
            <div>
              <label className="text-xs font-semibold text-gray-700">Password</label>
              <input
                type="password"
                className="mt-1 w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-purple-400 outline-none"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="Create password"
              />
            </div>
          )}

          {error && <p className="text-xs text-red-500">{error}</p>}

          <div className="flex gap-3 mt-2">
            {step === 2 && (
              <button
                type="button"
                onClick={() => setStep(1)}
                className="flex-1 bg-gray-100 py-2.5 rounded-lg border text-gray-700 text-sm hover:bg-gray-200"
              >
                Back
              </button>
            )}

            <button
              type="submit"
              className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-2.5 rounded-lg text-sm"
            >
              {step === 1 ? "Continue" : "Unlock & Watch"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EmailPasswordAccessOverlay;
