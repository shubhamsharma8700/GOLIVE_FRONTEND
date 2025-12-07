import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";

import { Eye, EyeOff, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../hooks/useAppDispatch";

import { useLoginMutation } from "../store/services/auth.service";
import { setCredentials } from "../store/slices/authSlice";

import goliveLogo from "../assets/golive-logo.png";

export default function Login() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  // RTK Query login mutation hook
  const [loginRequest, { isLoading }] = useLoginMutation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({ email: "", password: "" });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    setErrors({ email: "", password: "" });
    let hasErrors = false;

    const newErrors = { email: "", password: "" };

    if (!email) {
      newErrors.email = "Email is required";
      hasErrors = true;
    }

    if (!password) {
      newErrors.password = "Password is required";
      hasErrors = true;
    }

    if (hasErrors) {
      setErrors(newErrors);
      return;
    }

    try {
      // Call API
      const response = await loginRequest({ email, password }).unwrap();

      // Save login data in Redux
      dispatch(
        setCredentials({
          token: response.token,
          user: response.user,
        })
      );

      toast.success("Login successful! Welcome to GoLive Admin Dashboard");
      navigate("/", { replace: true });
    } catch (err: any) {
      toast.error(err?.data?.message || "Invalid email or password");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-[#B89B5E]/5 flex items-center justify-center p-4">
      <Card className="w-full max-w-xl border-0 shadow-xl rounded-xl">
        <CardHeader className="text-center pb-3 pt-6">
          <div className="flex items-center justify-center mb-3">
            <img src={goliveLogo} alt="GoLive" className="h-16" />
          </div>
          <CardTitle className="text-xl">GoLive Admin Dashboard</CardTitle>
          <p className="text-sm text-[#6B6B6B] mt-1">
            Sign in to manage your live streaming events
          </p>
        </CardHeader>

        <CardContent className="px-8 pb-6">
          <form onSubmit={handleLogin} className="space-y-4">
            {/* Email */}
            <div className="space-y-2">
              <Label>Email Address</Label>
              <Input
                type="email"
                placeholder="Enter email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errors.email) setErrors({ ...errors, email: "" });
                }}
                className={`h-10 ${
                  errors.email ? "border-red-500 focus-visible:ring-red-500" : ""
                }`}
              />
              {errors.email && (
                <div className="flex items-center gap-1.5 text-red-600 text-sm">
                  <AlertCircle className="w-4 h-4" />
                  <span>{errors.email}</span>
                </div>
              )}
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label>Password</Label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errors.password) setErrors({ ...errors, password: "" });
                  }}
                  className={`h-10 pr-10 ${
                    errors.password
                      ? "border-red-500 focus-visible:ring-red-500"
                      : ""
                  }`}
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6B6B6B] hover:text-[#B89B5E]"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {errors.password && (
                <div className="flex items-center gap-1.5 text-red-600 text-sm">
                  <AlertCircle className="w-4 h-4" />
                  <span>{errors.password}</span>
                </div>
              )}
            </div>

            {/* Forgot Password Link */}
            <div className="text-right -mt-1">
              <button
                type="button"
                onClick={() => navigate("/forgot-password")}
                className="text-sm text-[#B89B5E] hover:text-[#A28452] hover:underline transition-colors"
              >
                Forgot Password?
              </button>
            </div>

            {/* Login Button */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-10 bg-[#B89B5E] text-white hover:bg-[#A28452] shadow-md hover:shadow-lg transition-all mt-4"
            >
              {isLoading ? "Signing in..." : "Login"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
