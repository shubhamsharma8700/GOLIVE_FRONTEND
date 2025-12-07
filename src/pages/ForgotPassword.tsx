import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { toast } from "sonner";
import goliveLogo from "../assets/golive-logo.png";
import { useNavigate } from "react-router-dom";
import { useRequestOtpMutation } from "../store/services/auth.service";

export default function ForgotPassword() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");

  // RTK Query mutation
  const [requestOtp, { isLoading }] = useRequestOtpMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) return toast.error("Please enter your email");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      return toast.error("Enter a valid email address");

    try {
      await requestOtp({ email }).unwrap();

      toast.success("OTP sent successfully!");
      
      // Navigate to next screen with email pre-filled
      navigate("/new-password", { state: { email } });

    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to send OTP");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-[#B89B5E]/5 flex items-center justify-center p-4">
      <Card className="w-full max-w-xl border-0 shadow-xl rounded-xl">
        <CardHeader className="text-center pb-3 pt-6">
          <div className="flex items-center justify-center mb-3">
            <img src={goliveLogo} alt="GoLive" className="h-16" />
          </div>
          <CardTitle className="text-xl">Forgot Password</CardTitle>
          <p className="text-sm text-[#6B6B6B] mt-1">
            Enter your email to receive the OTP for resetting your password.
          </p>
        </CardHeader>

        <CardContent className="px-8 pb-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Email Input */}
            <div className="space-y-2">
              <Label>Email Address</Label>
              <Input
                type="email"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-10"
              />
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-10 bg-[#B89B5E] text-white hover:bg-[#A28452]"
            >
              {isLoading ? "Sending..." : "Send OTP"}
            </Button>

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
