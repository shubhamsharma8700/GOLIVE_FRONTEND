import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { toast } from "sonner";
import goliveLogo from "../assets/golive-logo.png";
import { Eye, EyeOff } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useVerifyOtpAndResetMutation } from "../store/services/auth.service";

export default function NewPassword() {
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [verifyOtpAndReset, { isLoading }] = useVerifyOtpAndResetMutation();

  // Auto-fill email from previous page
  useEffect(() => {
    if (location.state?.email) {
      setEmail(location.state.email);
    }
  }, [location.state]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!otp || !newPassword) {
      return toast.error("All fields are required");
    }

    try {
      await verifyOtpAndReset({ email, otp, newPassword }).unwrap();

      toast.success("Password reset successful!");
      navigate("/login");
    } catch (error: any) {
      toast.error(error?.data?.message || "Invalid OTP or request failed");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-[#B89B5E]/5 flex items-center justify-center p-4">
      <Card className="w-full max-w-xl border-0 shadow-xl rounded-xl">
        <CardHeader className="text-center pb-3 pt-6">
          <div className="flex items-center justify-center mb-3">
            <img src={goliveLogo} alt="GoLive" className="h-16" />
          </div>
          <CardTitle className="text-xl">Reset Password</CardTitle>
          <p className="text-sm text-[#6B6B6B] mt-1">
            Enter the OTP sent to your email and set a new password.
          </p>
        </CardHeader>

        <CardContent className="px-8 pb-6">
          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Email (Read Only) */}
            <div className="space-y-2">
              <Label>Email Address</Label>
              <Input
                type="email"
                value={email}
                disabled
                className="h-10 bg-gray-100 cursor-not-allowed"
              />
            </div>

            {/* OTP */}
            <div className="space-y-2">
              <Label>OTP Code</Label>
              <Input
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="h-10"
              />
            </div>

            {/* New Password with Show/Hide toggle */}
            <div className="space-y-2">
              <Label>New Password</Label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="h-10 pr-10"
                />

                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6B6B6B] hover:text-[#B89B5E]"
                  onClick={() => setShowPassword((prev) => !prev)}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-10 bg-[#B89B5E] text-white hover:bg-[#A28452]"
            >
              {isLoading ? "Resetting..." : "Reset Password"}
            </Button>

            {/* Back to Login */}
            <Button
              type="button"
              variant="ghost"
              className="w-full h-10 text-[#6B6B6B]"
              onClick={() => navigate("/login")}
            >
              Back to Login
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
