"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Wrench, Eye, EyeOff, CheckCircle2 } from "lucide-react";
import { signUp, ensureProfile } from "@/lib/db";

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { data, error: authError } = await signUp(email, password, {
      full_name: name,
      company_name: companyName,
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
    } else {
      try {
        if (data.user) {
          await ensureProfile(data.user.id, { full_name: name, company_name: companyName });
        }
      } catch {
        // Profile creation is best-effort; dashboard will retry
      }
      router.push("/dashboard");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-orange-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center">
              <Wrench className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold">
              HVAC <span className="text-orange-500">BidPro</span>
            </span>
          </Link>
          <h1 className="text-2xl font-bold mb-2">Start your free trial</h1>
          <p className="text-gray-400 text-sm">
            14 days free. No credit card required.
          </p>
        </div>

        <form
          onSubmit={handleSignup}
          className="bg-gray-900 border border-gray-800 rounded-2xl p-8 space-y-4"
        >
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-lg px-4 py-3">
              {error}
            </div>
          )}

          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-300 mb-1.5"
            >
              Full Name
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="John Smith"
              className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-colors outline-none"
              required
            />
          </div>

          <div>
            <label
              htmlFor="company"
              className="block text-sm font-medium text-gray-300 mb-1.5"
            >
              Company Name{" "}
              <span className="text-gray-600">(optional)</span>
            </label>
            <input
              id="company"
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="Smith HVAC Services"
              className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-colors outline-none"
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-300 mb-1.5"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@company.com"
              className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-colors outline-none"
              required
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-300 mb-1.5"
            >
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Min. 8 characters"
                minLength={8}
                className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-colors outline-none pr-12"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-orange-500/50 text-white py-3 rounded-xl font-semibold transition-all hover:shadow-lg hover:shadow-orange-500/25 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg
                  className="animate-spin w-5 h-5"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  />
                </svg>
                Creating account...
              </span>
            ) : (
              "Create Account"
            )}
          </button>

          <div className="space-y-2 pt-2">
            {[
              "14-day free trial included",
              "No credit card required",
              "Cancel anytime",
            ].map((item) => (
              <p
                key={item}
                className="flex items-center gap-2 text-xs text-gray-500"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-green-500 shrink-0" />
                {item}
              </p>
            ))}
          </div>

          <p className="text-center text-sm text-gray-400 pt-2">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-orange-400 hover:text-orange-300 font-medium"
            >
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
