"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Logo } from "@/components/brand/Logo";
import { Lock, ArrowRight, AlertCircle, ShieldCheck } from "lucide-react";
import { createClient, isClientSupabaseConfigured } from "@/lib/supabase/client";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setIsLoading(true);

    try {
      // If Supabase credentials are configured in environment
      if (isClientSupabaseConfigured()) {
        const supabase = createClient();
        const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });

        if (authError) {
          setErrorMessage(authError.message);
          setIsLoading(false);
          return;
        }

        if (authData?.user) {
          // Check if this user UID exists in the admin_users whitelist table
          const { data: adminRecord } = await supabase
            .from("admin_users")
            .select("id, role")
            .eq("id", authData.user.id)
            .maybeSingle();

          if (!adminRecord) {
            setErrorMessage(
              `User authenticated, but UID "${authData.user.id}" is not in public.admin_users. Please run the SQL insert in Supabase SQL Editor.`
            );
            setIsLoading(false);
            return;
          }
        }
      }

      // Successful auth or local dev mode fallback -> full page navigation to ensure fresh cookies
      window.location.href = "/admin/enquiries";
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to authenticate. Please check your credentials.");
      setIsLoading(false);
    }
  };

  const fillDemoCredentials = () => {
    setEmail("admin@projectadda.com");
    setPassword("MasterAdmin@2026");
  };

  return (
    <div className="min-h-dvh flex flex-col justify-center items-center px-4 sm:px-6 bg-[#090909] text-white">
      <div className="w-full max-w-md flex flex-col gap-8">
        {/* Brand Header */}
        <div className="flex flex-col items-center gap-3 text-center">
          <Logo />
          <div className="inline-flex items-center gap-1.5 rounded-full bg-[#141414] px-3 py-1 text-xs text-[#999999] mt-1">
            <Lock className="h-3.5 w-3.5 text-[#0099ff]" />
            <span>Private Administrative Desk</span>
          </div>
          <h1 className="text-2xl font-semibold text-white tracking-tight mt-2">
            Sign In to Manage Enquiries
          </h1>
          <p className="text-xs text-[#999999]">
            Authorized personnel only. Public registration is permanently disabled.
          </p>
        </div>

        {/* Login Card */}
        <div className="rounded-3xl bg-[#141414] p-8 flex flex-col gap-6">
          {errorMessage && (
            <div className="rounded-2xl bg-red-950/40 border border-red-500/30 p-3.5 text-xs text-red-300 flex items-start gap-2.5">
              <AlertCircle className="h-4 w-4 text-red-400 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="flex flex-col gap-5">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-white">
                Admin Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@projectadda.com"
                className="rounded-xl border border-[#262626] bg-[#090909] px-4 py-2.5 text-sm text-white placeholder-[#555555] input-focus-ring"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium text-white">
                  Password
                </label>
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="rounded-xl border border-[#262626] bg-[#090909] px-4 py-2.5 text-sm text-white placeholder-[#555555] input-focus-ring"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full justify-center !py-3 text-sm font-semibold mt-2 disabled:opacity-50"
            >
              {isLoading ? (
                <span>Authenticating...</span>
              ) : (
                <>
                  <span>Sign In to Dashboard</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          {/* Development Quick Assist */}
          <div className="pt-4 flex flex-col gap-2 text-center text-xs text-[#666666]">
            <span>Local Evaluation & Testing Mode</span>
            <button
              type="button"
              onClick={fillDemoCredentials}
              className="text-[#0099ff] hover:underline"
            >
              Fill default admin credentials
            </button>
          </div>
        </div>

        {/* Security Reassurance & Back Link */}
        <div className="flex items-center justify-between text-xs text-[#999999] px-2">
          <Link href="/" className="hover:text-white transition-colors">
            ← Return to Public Website
          </Link>
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="h-4 w-4 text-[#22c55e]" />
            <span>Encrypted Session</span>
          </div>
        </div>
      </div>
    </div>
  );
}

