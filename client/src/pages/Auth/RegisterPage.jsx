import React, { useState } from "react";
import { BookOpen, Building2, Phone, Mail, Lock, ArrowRight } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import Inp from "../../components/common/Inp";
import Sel from "../../components/common/Sel";
import Btn from "../../components/common/Btn";
import { cities } from "../../data/mockData";

export default function RegisterPage() {
  const { signup } = useAuth();
  const navigate = useNavigate();

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

  const handleSignup = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    setLoading(true);
    setError(null);
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
      // Navigate to verify-otp passing state variables
      navigate("/auth/verify-otp", { state: { email, password, phone } });
    } catch (err) {
      const errMsg = err.response?.data?.errors?.[0]?.message || err.response?.data?.message || "Registration failed";
      setError(errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Tab Selector Header */}
      <div className="flex gap-1 bg-gray-100 rounded-xl p-1 mb-8">
        <Link
          to="/auth/login"
          className="flex-1 py-2.5 text-center text-sm font-semibold rounded-lg transition-all text-gray-600 hover:text-gray-900"
        >
          Login
        </Link>
        <Link
          to="/auth/register"
          className="flex-1 py-2.5 text-center text-sm font-semibold rounded-lg transition-all bg-white shadow-sm text-blue-600"
        >
          Register
        </Link>
      </div>

      <div className="mb-6">
        <h1
          className="text-2xl font-bold text-gray-900 mb-1"
          style={{ fontFamily: "'Poppins', sans-serif" }}
        >
          Create account
        </h1>
        <p className="text-gray-500 text-sm">Join thousands of students on LivingHub</p>
      </div>

      {error && (
        <div className="mb-4 text-sm bg-red-50 text-red-600 p-3 rounded-xl border border-red-200">
          {error}
        </div>
      )}

      <div className="grid grid-cols-2 gap-3 mb-5">
        {[
          { id: "student", label: "Student", icon: BookOpen, desc: "Find housing" },
          { id: "owner", label: "Property Owner", icon: Building2, desc: "List property" }
        ].map((r) => (
          <button
            type="button"
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

      <form onSubmit={handleSignup} className="space-y-3">
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
        <Inp
          label="Mobile Number *"
          placeholder="+20 10 1234 5678"
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
        <Sel
          label="Gender *"
          options={["Male", "Female"]}
          value={gender}
          onChange={(e) => setGender(e.target.value)}
        />

        {/* Conditional Fields based on Role */}
        {role === "student" ? (
          <>
            <Sel
              label="Governorate *"
              options={cities}
              value={governorate}
              onChange={(e) => setGovernorate(e.target.value)}
            />
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
                <Inp
                  label="College *"
                  placeholder="Engineering"
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
              <Inp
                label="Occupation *"
                placeholder="Software Engineer"
                value={occupation}
                onChange={(e) => setOccupation(e.target.value)}
              />
            )}

            <Inp
              label="Date of Birth *"
              type="date"
              value={dateOfBirth}
              onChange={(e) => setDateOfBirth(e.target.value)}
            />
          </>
        ) : (
          <>
            <Sel
              label="Governorate *"
              options={cities}
              value={governorate}
              onChange={(e) => setGovernorate(e.target.value)}
            />
            <Inp
              label="Date of Birth *"
              type="date"
              value={dateOfBirth}
              onChange={(e) => setDateOfBirth(e.target.value)}
            />
            <Inp
              label="Alternative Mobile Number *"
              placeholder="+20 10 9876 5432"
              type="tel"
              icon={Phone}
              value={alternativePhone}
              onChange={(e) => setAlternativePhone(e.target.value)}
            />
          </>
        )}

        <label className="flex items-start gap-2 cursor-pointer pt-2">
          <input required type="checkbox" className="w-4 h-4 mt-0.5 rounded border-gray-300 accent-blue-600" />
          <span className="text-xs text-gray-600">
            I agree to the <span className="text-blue-600 font-semibold">Terms of Service</span>{" "}
            and <span className="text-blue-600 font-semibold">Privacy Policy</span>
          </span>
        </label>

        <Btn
          variant="primary"
          size="lg"
          className="w-full"
          type="submit"
          disabled={loading}
        >
          {loading ? "Creating Account..." : "Create Account"} <ArrowRight className="w-4 h-4" />
        </Btn>
      </form>
    </div>
  );
}
