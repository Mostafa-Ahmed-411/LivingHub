import React, { useState } from "react";
import { Phone, ArrowLeft } from "lucide-react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import Btn from "../../components/common/Btn";

export default function VerifyOTPPage({ onNavigate }) {
  const { verifyOTP, resendOTP, login } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // Retrieve credentials passed from RegisterPage
  const { email, password, phone } = location.state || {};

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  const identifier = email || phone;

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    const otpCode = otp.join("");
    if (otpCode.length !== 6) {
      setError("Please enter the 6-digit verification code");
      return;
    }
    if (!identifier) {
      setError("Invalid session. Please sign up or login again.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await verifyOTP(identifier, otpCode);
      
      // Auto login if we have both credentials from the registration page
      if (identifier && password) {
        const user = await login(identifier, password);
        onNavigate(user.role);
      } else {
        setSuccessMessage("Account verified successfully! You can now log in.");
        setTimeout(() => {
          navigate("/auth/login");
        }, 2000);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Verification failed");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!identifier) {
      setError("Invalid session. Unable to resend code.");
      return;
    }
    setError(null);
    setSuccessMessage(null);
    try {
      await resendOTP(identifier);
      setSuccessMessage("A new verification code has been sent.");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to resend code");
    }
  };

  return (
    <div className="text-center">
      <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-5">
        <Phone className="w-8 h-8 text-blue-600" />
      </div>
      <h1
        className="text-2xl font-bold text-gray-900 mb-2"
        style={{ fontFamily: "'Poppins', sans-serif" }}
      >
        Verify your account
      </h1>
      <p className="text-gray-500 text-sm mb-7">
        Enter the 6-digit code sent to
        <br />
        <span className="font-semibold text-gray-800">{identifier || "your email/phone"}</span>
      </p>

      {error && (
        <div className="mb-4 text-sm bg-red-50 text-red-600 p-3 rounded-xl border border-red-200">
          {error}
        </div>
      )}
      {successMessage && (
        <div className="mb-4 text-sm bg-green-50 text-green-600 p-3 rounded-xl border border-green-200">
          {successMessage}
        </div>
      )}

      <form onSubmit={handleVerifyOTP}>
        <div className="flex gap-2 justify-center mb-7">
          {otp.map((val, i) => (
            <input
              key={i}
              type="text"
              maxLength={1}
              value={val}
              onChange={(e) => {
                if (/^\d*$/.test(e.target.value)) {
                  const n = [...otp];
                  n[i] = e.target.value;
                  setOtp(n);
                  
                  // Auto focus next input
                  if (e.target.value && e.target.nextSibling) {
                    e.target.nextSibling.focus();
                  }
                }
              }}
              onKeyDown={(e) => {
                // Focus previous on backspace
                if (e.key === "Backspace" && !otp[i] && e.target.previousSibling) {
                  e.target.previousSibling.focus();
                }
              }}
              className="w-12 h-12 text-center text-xl font-bold border-2 rounded-xl focus:outline-none focus:border-blue-500 transition-colors bg-gray-50 text-gray-900"
            />
          ))}
        </div>

        <Btn
          variant="primary"
          size="lg"
          className="w-full mb-4"
          type="submit"
          disabled={loading}
        >
          {loading ? "Verifying..." : "Verify & Continue"}
        </Btn>
      </form>
      
      <p className="text-sm text-gray-500 mb-4">
        Didn't receive code?{" "}
        <button
          type="button"
          onClick={handleResend}
          className="text-blue-600 font-semibold hover:underline bg-transparent border-0 cursor-pointer p-0"
        >
          Resend code
        </button>
      </p>

      <Link
        to="/auth/login"
        className="flex items-center justify-center gap-2 text-sm text-gray-600 hover:text-gray-900 font-semibold"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Login
      </Link>
    </div>
  );
}
