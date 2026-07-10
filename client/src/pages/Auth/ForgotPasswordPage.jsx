import React, { useState } from "react";
import { Mail, ArrowRight, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { forgotPasswordAPI } from "../../api/auth";
import Inp from "../../components/common/Inp";
import Btn from "../../components/common/Btn";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      setError("Email address is required");
      return;
    }
    setLoading(true);
    setError(null);
    setSuccessMessage(null);
    try {
      const data = await forgotPasswordAPI(email);
      setSuccessMessage(data.message || "A reset link has been sent to your email.");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send reset link");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1
          className="text-2xl font-bold text-gray-900 mb-1"
          style={{ fontFamily: "'Poppins', sans-serif" }}
        >
          Reset password
        </h1>
        <p className="text-gray-500 text-sm">We'll send a reset link to your email</p>
      </div>

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

      <form onSubmit={handleSubmit} className="space-y-4">
        <Inp
          label="Email Address"
          placeholder="you@example.com"
          type="email"
          icon={Mail}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        
        <Btn
          variant="primary"
          size="lg"
          className="w-full"
          type="submit"
          disabled={loading}
        >
          {loading ? "Sending..." : "Send Reset Link"} <ArrowRight className="w-4 h-4" />
        </Btn>

        <Link
          to="/auth/login"
          className="w-full flex items-center justify-center gap-2 text-sm text-gray-600 hover:text-gray-900 py-2 font-semibold"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Login
        </Link>
      </form>
    </div>
  );
}
