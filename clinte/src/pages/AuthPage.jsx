import React, { useState } from "react";
import {
  Building2,
  Mail,
  Lock,
  ArrowRight,
  ArrowLeft,
  Phone,
  BookOpen,
  Shield
} from "lucide-react";
import Inp from "../components/common/Inp";
import Btn from "../components/common/Btn";
import Sel from "../components/common/Sel";
import { cities } from "../data/mockData";

export default function AuthPage({ onNavigate }) {
  const [tab, setTab] = useState("login");
  const [role, setRole] = useState("student");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [isStudent, setIsStudent] = useState(true);

  return (
    <div className="min-h-screen flex">
      {/* Left Banner */}
      <div className="hidden lg:flex lg:w-1/2 bg-blue-600 relative overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=1000&fit=crop&auto=format"
          alt="Student apartment"
          className="absolute inset-0 w-full h-full object-cover opacity-30 mix-blend-multiply"
        />
        <div className="relative z-10 p-12 flex flex-col justify-between h-full">
          <button onClick={() => onNavigate("home")} className="flex items-center gap-2">
            <div className="w-8 h-8 bg-white/25 rounded-xl flex items-center justify-center">
              <Building2 className="w-4 h-4 text-white" />
            </div>
            <span
              className="text-xl font-bold text-white"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              LivingHub
            </span>
          </button>

          <div>
            <h2
              className="text-4xl font-extrabold text-white mb-4 leading-tight"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              Your perfect home
              <br />
              awaits you
            </h2>
            <p className="text-blue-200 text-lg mb-8">
              Join 50,000+ students finding verified housing across Egypt.
            </p>
            <div className="flex gap-3">
              {[
                { value: "15K+", label: "Units" },
                { value: "50K+", label: "Students" },
                { value: "98%", label: "Satisfied" }
              ].map((s) => (
                <div
                  key={s.label}
                  className="bg-white/15 backdrop-blur-sm rounded-xl p-4 flex-1 text-center border border-white/20"
                >
                  <p className="text-2xl font-bold text-white">{s.value}</p>
                  <p className="text-blue-200 text-xs mt-0.5">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Right Form Area */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 bg-white">
        <div className="w-full max-w-md">
          {(tab === "login" || tab === "register") && (
            <div className="flex gap-1 bg-gray-100 rounded-xl p-1 mb-8">
              {[
                { id: "login", label: "Login" },
                { id: "register", label: "Register" }
              ].map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all ${
                    tab === t.id
                      ? "bg-white shadow-sm text-blue-600"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          )}

          {tab === "login" && (
            <div>
              <div className="mb-7">
                <h1
                  className="text-2xl font-bold text-gray-900 mb-1"
                  style={{ fontFamily: "'Poppins', sans-serif" }}
                >
                  Welcome back
                </h1>
                <p className="text-gray-500 text-sm">Sign in to your LivingHub account</p>
              </div>

              <div className="space-y-4">
                <Inp label="Email Address" placeholder="you@example.com" type="email" icon={Mail} />
                <Inp label="Password" placeholder="Enter your password" type="password" icon={Lock} />

                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      className="w-4 h-4 rounded border-gray-300 text-blue-600 accent-blue-600"
                    />
                    <span className="text-sm text-gray-600">Remember me</span>
                  </label>
                  <button
                    onClick={() => setTab("forgot")}
                    className="text-sm text-blue-600 hover:text-blue-700 font-semibold"
                  >
                    Forgot password?
                  </button>
                </div>

                <Btn
                  variant="primary"
                  size="lg"
                  className="w-full"
                  onClick={() => onNavigate("student")}
                >
                  Sign In <ArrowRight className="w-4 h-4" />
                </Btn>

                <div className="relative flex items-center">
                  <div className="flex-1 border-t border-gray-200" />
                  <span className="px-4 text-xs text-gray-400 bg-white">or continue with</span>
                  <div className="flex-1 border-t border-gray-200" />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <Btn variant="outline" className="w-full">
                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                    Google
                  </Btn>
                  <Btn variant="outline" className="w-full">
                    <Phone className="w-4 h-4 text-green-600" /> Mobile
                  </Btn>
                </div>
              </div>

              <p className="mt-6 text-center text-sm text-gray-600">
                Don't have an account?{" "}
                <button
                  onClick={() => setTab("register")}
                  className="text-blue-600 font-bold hover:text-blue-700"
                >
                  Register now
                </button>
              </p>
            </div>
          )}

          {tab === "register" && (
            <div>
              <div className="mb-6">
                <h1
                  className="text-2xl font-bold text-gray-900 mb-1"
                  style={{ fontFamily: "'Poppins', sans-serif" }}
                >
                  Create account
                </h1>
                <p className="text-gray-500 text-sm">Join thousands of students on LivingHub</p>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-5">
                {[
                  { id: "student", label: "Student", icon: BookOpen, desc: "Find housing" },
                  { id: "owner", label: "Property Owner", icon: Building2, desc: "List property" }
                ].map((r) => (
                  <button
                    key={r.id}
                    onClick={() => setRole(r.id)}
                    className={`p-3.5 rounded-xl border-2 text-left transition-all ${
                      role === r.id
                        ? "border-blue-600 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300 bg-white"
                    }`}
                  >
                    <r.icon
                      className={`w-5 h-5 mb-1.5 ${role === r.id ? "text-blue-600" : "text-gray-400"}`}
                    />
                    <p
                      className={`font-semibold text-sm ${
                        role === r.id ? "text-blue-700" : "text-gray-800"
                      }`}
                    >
                      {r.label}
                    </p>
                    <p className="text-xs text-gray-500">{r.desc}</p>
                  </button>
                ))}
              </div>

              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <Inp label="First Name *" placeholder="Ahmed" />
                  <Inp label="Second Name *" placeholder="Hassan" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <Inp label="Third Name (Optional)" placeholder="Ali" />
                  <Inp label="Fourth Name (Optional)" placeholder="Fouad" />
                </div>
                <Inp label="Mobile Number *" placeholder="+20 10 1234 5678" type="tel" icon={Phone} />
                <Inp label="Email Address *" placeholder="ahmed@example.com" type="email" icon={Mail} />
                <div className="grid grid-cols-2 gap-3">
                  <Inp label="Password *" placeholder="••••••••" type="password" icon={Lock} />
                  <Inp label="Confirm Password *" placeholder="••••••••" type="password" icon={Lock} />
                </div>
                <Sel label="Gender *" options={["Male", "Female"]} />

                {/* Conditional Fields based on Role */}
                {role === "student" ? (
                  <>
                    <Sel label="Governorate *" options={cities} />
                    <div className="flex items-center gap-2 py-1">
                      <input
                        type="checkbox"
                        id="isStudentToggle"
                        checked={isStudent}
                        onChange={(e) => setIsStudent(e.target.checked)}
                        className="w-4 h-4 rounded border-gray-300 accent-blue-600 cursor-pointer"
                      />
                      <label htmlFor="isStudentToggle" className="text-sm text-gray-700 cursor-pointer select-none">
                        Are you a student?
                      </label>
                    </div>

                    {isStudent ? (
                      <div className="grid grid-cols-2 gap-3">
                        <Inp label="College *" placeholder="Engineering" />
                        <Sel
                          label="Year *"
                          options={["1st Year", "2nd Year", "3rd Year", "4th Year", "5th Year+"]}
                        />
                      </div>
                    ) : (
                      <Inp label="Occupation *" placeholder="Software Engineer" />
                    )}

                    <Inp label="Date of Birth *" type="date" />
                  </>
                ) : (
                  <>
                    <Sel label="Governorate *" options={cities} />
                    <Inp label="Date of Birth *" type="date" />
                    <Inp label="Alternative Mobile Number *" placeholder="+20 10 9876 5432" type="tel" icon={Phone} />
                  </>
                )}

                <label className="flex items-start gap-2 cursor-pointer pt-2">
                  <input type="checkbox" className="w-4 h-4 mt-0.5 rounded border-gray-300 accent-blue-600" />
                  <span className="text-xs text-gray-600">
                    I agree to the <span className="text-blue-600 font-semibold">Terms of Service</span>{" "}
                    and <span className="text-blue-600 font-semibold">Privacy Policy</span>
                  </span>
                </label>

                <Btn
                  variant="primary"
                  size="lg"
                  className="w-full"
                  onClick={() => setTab("otp")}
                >
                  Create Account <ArrowRight className="w-4 h-4" />
                </Btn>
              </div>
            </div>
          )}

          {tab === "forgot" && (
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

              <div className="space-y-4">
                <Inp label="Email Address" placeholder="you@example.com" type="email" icon={Mail} />
                <Btn
                  variant="primary"
                  size="lg"
                  className="w-full"
                  onClick={() => setTab("otp")}
                >
                  Send Reset Link <ArrowRight className="w-4 h-4" />
                </Btn>
                <button
                  onClick={() => setTab("login")}
                  className="w-full flex items-center justify-center gap-2 text-sm text-gray-600 hover:text-gray-900 py-2"
                >
                  <ArrowLeft className="w-4 h-4" /> Back to Login
                </button>
              </div>
            </div>
          )}

          {tab === "otp" && (
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-5">
                <Phone className="w-8 h-8 text-blue-600" />
              </div>
              <h1
                className="text-2xl font-bold text-gray-900 mb-2"
                style={{ fontFamily: "'Poppins', sans-serif" }}
              >
                Verify your phone
              </h1>
              <p className="text-gray-500 text-sm mb-7">
                Enter the 6-digit code sent to
                <br />
                <span className="font-semibold text-gray-800">+20 10 1234 5678</span>
              </p>

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
                onClick={() => onNavigate(role === "student" ? "student" : "owner")}
              >
                Verify & Continue
              </Btn>
              <p className="text-sm text-gray-500">
                Didn't receive code?{" "}
                <button className="text-blue-600 font-semibold">Resend in 0:45</button>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
