import React, { useState } from "react";
import { BookOpen, Building2, Phone, Mail, Lock, ArrowRight, User, ChevronLeft, Calendar, Sparkles } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import Inp from "../../components/common/Inp";
import Sel from "../../components/common/Sel";
import Btn from "../../components/common/Btn";
import { cities } from "../../constants/staticData";

export default function RegisterPage() {
  const { signup } = useAuth();
  const navigate = useNavigate();

  // Multi-step state
  const [step, setStep] = useState(1);
  const [localError, setLocalError] = useState(null);

  // Form states
  const [role, setRole] = useState("student");
  const [isStudent, setIsStudent] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [secondName, setSecondName] = useState("");
  const [thirdName, setThirdName] = useState("");
  const [fourthName, setFourthName] = useState("");
  const [phone, setPhone] = useState("");
  const [gender, setGender] = useState("Male");
  const [governorate, setGovernorate] = useState(cities[0] || "");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [college, setCollege] = useState("");
  const [year, setYear] = useState("1st Year");
  const [occupation, setOccupation] = useState("");
  const [alternativePhone, setAlternativePhone] = useState("");

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const validateStep = () => {
    setLocalError(null);
    if (step === 1) {
      if (!firstName.trim() || !secondName.trim()) {
        setLocalError("First Name and Second Name are required.");
        return false;
      }
    } else if (step === 2) {
      if (!email.trim() || !phone.trim() || !password.trim() || !confirmPassword.trim()) {
        setLocalError("Email, mobile number, and passwords are required.");
        return false;
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        setLocalError("Please enter a valid email address.");
        return false;
      }
      if (password !== confirmPassword) {
        setLocalError("Passwords do not match.");
        return false;
      }
      if (password.length < 6) {
        setLocalError("Password must be at least 6 characters.");
        return false;
      }
    }
    return true;
  };

  const handleNext = () => {
    if (validateStep()) {
      setStep((s) => s + 1);
    }
  };

  const handleBack = () => {
    setLocalError(null);
    setStep((s) => s - 1);
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    if (!validateStep()) return;

    if (!dateOfBirth) {
      setLocalError("Date of Birth is required.");
      return;
    }

    setLoading(true);
    setError(null);
    setLocalError(null);
    try {
      const payload = {
        firstName,
        secondName,
        thirdName: thirdName || undefined,
        fourthName: fourthName || undefined,
        email: email || undefined,
        phone,
        password,
        role,
        gender,
        governorate,
        dateOfBirth,
        isStudent: role === "student" ? isStudent : undefined,
        college: role === "student" && isStudent ? college : undefined,
        year: role === "student" && isStudent ? year : undefined,
        occupation: role === "student" && !isStudent ? occupation : undefined,
        alternativePhone: role === "owner" ? alternativePhone : undefined
      };
      await signup(payload);
      navigate("/verify-account", { state: { email, password, phone } });
    } catch (err) {
      const errMsg = err.response?.data?.errors?.[0]?.message || err.response?.data?.message || "Registration failed";
      setError(errMsg);
    } finally {
      setLoading(false);
    }
  };

  // Progress Tracker Component
  const renderProgressBar = () => {
    return (
      <div className="mb-8 flex items-center justify-between relative px-2">
        {/* Connection Line */}
        <div className="absolute left-4 right-4 top-4 h-0.5 bg-gray-100 -z-10" />
        <div
          className="absolute left-4 top-4 h-0.5 bg-blue-600 -z-10 transition-all duration-500"
          style={{ width: `${((step - 1) / 2) * 90}%` }}
        />

        {[
          { num: 1, label: "Profile" },
          { num: 2, label: "Account" },
          { num: 3, label: "Details" }
        ].map((s) => (
          <div key={s.num} className="flex flex-col items-center gap-1.5 bg-white px-2">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs border transition-all duration-300 ${
                step === s.num
                  ? "bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-500/20 scale-110"
                  : step > s.num
                  ? "bg-blue-50 border-blue-600 text-blue-600"
                  : "bg-gray-50 border-gray-200 text-gray-400"
              }`}
            >
              {s.num}
            </div>
            <span
              className={`text-[10px] font-bold tracking-wider transition-all duration-300 uppercase ${
                step === s.num ? "text-blue-600" : "text-gray-400"
              }`}
            >
              {s.label}
            </span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="w-full animate-fadeIn">
      {/* Tab Selector Header */}
      <div className="flex gap-1 bg-gray-100 rounded-xl p-1 mb-6">
        <Link
          to="/login"
          className="flex-1 py-2 text-center text-sm font-semibold rounded-lg transition-all text-gray-600 hover:text-gray-900"
        >
          Login
        </Link>
        <Link
          to="/register"
          className="flex-1 py-2 text-center text-sm font-semibold rounded-lg transition-all bg-white shadow-sm text-blue-600"
        >
          Register
        </Link>
      </div>

      <div className="mb-6">
        <h1
          className="text-2xl font-extrabold text-gray-900 mb-1 flex items-center gap-2"
          style={{ fontFamily: "'Poppins', sans-serif" }}
        >
          Create account <Sparkles className="w-5 h-5 text-blue-500 animate-pulse" />
        </h1>
        <p className="text-gray-500 text-xs font-medium">Join thousands of students on Maeesha</p>
      </div>

      {/* Progress Bar */}
      {renderProgressBar()}

      {/* Error Displays */}
      {error && (
        <div className="mb-5 text-xs bg-red-50 text-red-600 p-3 rounded-xl border border-red-200 font-medium">
          {error}
        </div>
      )}
      {localError && (
        <div className="mb-5 text-xs bg-amber-50 text-amber-700 p-3 rounded-xl border border-amber-200 font-medium">
          {localError}
        </div>
      )}

      <form onSubmit={handleSignup} className="space-y-4">
        {/* STEP 1: CHOOSE ROLE & NAME */}
        {step === 1 && (
          <div className="space-y-4 animate-fadeIn">
            <div>
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-2">
                Choose Account Type
              </label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { id: "student", label: "Student", icon: BookOpen, desc: "Looking for units" },
                  { id: "owner", label: "Property Owner", icon: Building2, desc: "List listings" }
                ].map((r) => (
                  <button
                    type="button"
                    key={r.id}
                    onClick={() => setRole(r.id)}
                    className={`p-3.5 rounded-2xl border-2 text-left transition-all cursor-pointer ${
                      role === r.id
                        ? "border-blue-600 bg-blue-50/50 shadow-sm"
                        : "border-gray-200 hover:border-gray-300 bg-white"
                    }`}
                  >
                    <r.icon
                      className={`w-5 h-5 mb-1.5 ${role === r.id ? "text-blue-600" : "text-gray-400"}`}
                    />
                    <p
                      className={`font-bold text-sm ${
                        role === r.id ? "text-blue-700" : "text-gray-800"
                      }`}
                    >
                      {r.label}
                    </p>
                    <p className="text-[10px] text-gray-400 mt-0.5">{r.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Inp
                label="First Name *"
                placeholder="Ahmed"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
              <Inp
                label="Second Name *"
                placeholder="Hassan"
                value={secondName}
                onChange={(e) => setSecondName(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Inp
                label="Third Name (Optional)"
                placeholder="Ali"
                value={thirdName}
                onChange={(e) => setThirdName(e.target.value)}
              />
              <Inp
                label="Fourth Name (Optional)"
                placeholder="Fouad"
                value={fourthName}
                onChange={(e) => setFourthName(e.target.value)}
              />
            </div>

            <Btn
              variant="primary"
              size="lg"
              className="w-full justify-center mt-2 cursor-pointer"
              type="button"
              onClick={handleNext}
            >
              Continue <ArrowRight className="w-4 h-4 ml-1" />
            </Btn>
          </div>
        )}

        {/* STEP 2: CONTACT & SECURITY */}
        {step === 2 && (
          <div className="space-y-4 animate-fadeIn">
            <Inp
              label="Mobile Number *"
              placeholder="e.g. 01012345678"
              type="tel"
              icon={Phone}
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
            <Inp
              label="Email Address *"
              placeholder="ahmed@example.com"
              type="email"
              icon={Mail}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <div className="grid grid-cols-2 gap-3">
              <Inp
                label="Password *"
                placeholder="••••••••"
                type="password"
                icon={Lock}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Inp
                label="Confirm Password *"
                placeholder="••••••••"
                type="password"
                icon={Lock}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={handleBack}
                className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50 text-sm font-semibold flex items-center justify-center gap-1 cursor-pointer bg-white"
              >
                <ChevronLeft className="w-4 h-4" /> Back
              </button>
              <Btn
                variant="primary"
                className="flex-1 justify-center cursor-pointer"
                type="button"
                onClick={handleNext}
              >
                Next <ArrowRight className="w-4 h-4 ml-1" />
              </Btn>
            </div>
          </div>
        )}

        {/* STEP 3: DETAILS */}
        {step === 3 && (
          <div className="space-y-4 animate-fadeIn">
            <div className="grid grid-cols-2 gap-3">
              <Sel
                label="Gender *"
                options={["Male", "Female"]}
                value={gender}
                onChange={(e) => setGender(e.target.value)}
              />
              <Sel
                label="Governorate *"
                options={cities}
                value={governorate}
                onChange={(e) => setGovernorate(e.target.value)}
              />
            </div>

            <Inp
              label="Date of Birth *"
              type="date"
              icon={Calendar}
              value={dateOfBirth}
              onChange={(e) => setDateOfBirth(e.target.value)}
            />

            {/* Conditional Role Fields */}
            {role === "student" ? (
              <div className="space-y-3.5 pt-1">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="isStudentToggle"
                    checked={isStudent}
                    onChange={(e) => setIsStudent(e.target.checked)}
                    className="w-4 h-4 rounded border-gray-300 accent-blue-600 cursor-pointer"
                  />
                  <label htmlFor="isStudentToggle" className="text-xs font-semibold text-gray-600 cursor-pointer select-none">
                    Are you currently a university student?
                  </label>
                </div>

                {isStudent ? (
                  <div className="grid grid-cols-2 gap-3 animate-fadeIn">
                    <Inp
                      label="College *"
                      placeholder="e.g. Engineering"
                      value={college}
                      onChange={(e) => setCollege(e.target.value)}
                    />
                    <Sel
                      label="Year *"
                      options={["1st Year", "2nd Year", "3rd Year", "4th Year", "5th Year+"]}
                      value={year}
                      onChange={(e) => setYear(e.target.value)}
                    />
                  </div>
                ) : (
                  <div className="animate-fadeIn">
                    <Inp
                      label="Occupation *"
                      placeholder="e.g. Software Engineer"
                      value={occupation}
                      onChange={(e) => setOccupation(e.target.value)}
                    />
                  </div>
                )}
              </div>
            ) : (
              <div className="animate-fadeIn">
                <Inp
                  label="Alternative Mobile Number *"
                  placeholder="e.g. 01098765432"
                  type="tel"
                  icon={Phone}
                  value={alternativePhone}
                  onChange={(e) => setAlternativePhone(e.target.value)}
                />
              </div>
            )}

            <label className="flex items-start gap-2 cursor-pointer pt-1">
              <input required type="checkbox" className="w-4 h-4 mt-0.5 rounded border-gray-300 accent-blue-600 cursor-pointer" />
              <span className="text-[11px] text-gray-500 font-medium">
                I agree to the <span className="text-blue-600 font-bold hover:underline">Terms of Service</span>{" "}
                and <span className="text-blue-600 font-bold hover:underline">Privacy Policy</span>
              </span>
            </label>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                disabled={loading}
                onClick={handleBack}
                className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50 text-sm font-semibold flex items-center justify-center gap-1 cursor-pointer bg-white disabled:opacity-50"
              >
                <ChevronLeft className="w-4 h-4" /> Back
              </button>
              <Btn
                variant="primary"
                className="flex-1 justify-center cursor-pointer"
                type="submit"
                disabled={loading}
              >
                {loading ? "Creating..." : "Finish"} <ArrowRight className="w-4 h-4 ml-1" />
              </Btn>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}
