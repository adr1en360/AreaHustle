import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { useNavigate } from "@tanstack/react-router";
import { X, Phone, MessageCircle, Check, Loader2 } from "lucide-react";

interface Props {
  open: boolean;
  onClose: () => void;
  role?: "customer" | "hustler";
  redirectTo?: string;
}

export function AuthModal({ open, onClose, role = "customer", redirectTo }: Props) {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState<"phone" | "otp" | "success">("phone");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  const submitPhone = () => {
    if (phone.length < 7) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep("otp");
    }, 700);
  };

  const handleOtp = (i: number, v: string) => {
    if (!/^\d?$/.test(v)) return;
    const next = [...otp];
    next[i] = v;
    setOtp(next);
    if (v && i < 3) {
      const el = document.getElementById(`otp-${i + 1}`);
      el?.focus();
    }
    if (next.join("") === "1234") {
      setTimeout(() => {
        setStep("success");
        setTimeout(() => {
          login(role);
          onClose();
          setStep("phone");
          setPhone("");
          setOtp(["", "", "", ""]);
          if (redirectTo) navigate({ to: redirectTo });
          else navigate({ to: "/onboarding" });
        }, 1200);
      }, 200);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-up">
      <div className="absolute inset-0 bg-foreground/30 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md rounded-3xl bg-card p-8 sm:p-10 shadow-elevated animate-scale-in">
        <button
          onClick={onClose}
          className="absolute right-5 top-5 rounded-full p-2 text-muted-foreground hover:bg-muted transition"
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </button>

        {step === "phone" && (
          <>
            <div className="mb-1 text-xs uppercase tracking-widest text-muted-foreground">AreaHustle</div>
            <h2 className="font-display text-3xl font-bold mb-2">Log in or Sign up</h2>
            <p className="text-sm text-muted-foreground mb-7">
              Continue as {role === "hustler" ? "a Hustler" : "a Customer"}. We'll send a secure code.
            </p>
            <label className="block text-sm font-medium mb-2">Phone Number</label>
            <div className="flex items-center rounded-2xl border bg-background px-4 py-3.5 focus-within:border-primary transition">
              <Phone className="h-4 w-4 text-muted-foreground mr-3" />
              <span className="text-sm text-muted-foreground mr-2">+234</span>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                placeholder="801 234 5678"
                className="flex-1 bg-transparent outline-none text-sm"
              />
            </div>
            <button
              onClick={submitPhone}
              disabled={loading || phone.length < 7}
              className="mt-5 w-full rounded-2xl bg-primary py-3.5 text-sm font-semibold text-primary-foreground hover:opacity-95 transition disabled:opacity-40 flex items-center justify-center gap-2"
            >
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              Send Secure OTP
            </button>
            <button className="mt-3 w-full rounded-2xl border py-3.5 text-sm font-medium hover:bg-muted transition flex items-center justify-center gap-2">
              <MessageCircle className="h-4 w-4 text-[#25D366]" />
              Send via WhatsApp
            </button>
            <p className="mt-6 text-center text-xs text-muted-foreground">
              By continuing you agree to our Terms & Privacy.
            </p>
          </>
        )}

        {step === "otp" && (
          <>
            <div className="mb-1 text-xs uppercase tracking-widest text-muted-foreground">Verify</div>
            <h2 className="font-display text-3xl font-bold mb-2">Enter the code</h2>
            <p className="text-sm text-muted-foreground mb-8">
              We sent a 4-digit code to +234 {phone}. Try <span className="font-semibold text-foreground">1234</span>.
            </p>
            <div className="flex justify-between gap-3 mb-6">
              {otp.map((d, i) => (
                <input
                  key={i}
                  id={`otp-${i}`}
                  inputMode="numeric"
                  maxLength={1}
                  value={d}
                  onChange={(e) => handleOtp(i, e.target.value)}
                  className="h-16 w-full max-w-[68px] rounded-2xl border bg-background text-center font-display text-3xl font-bold outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition"
                />
              ))}
            </div>
            <p className="text-center text-sm text-muted-foreground">
              Didn't receive code? <span className="text-foreground">Resend in 0:59</span>
            </p>
          </>
        )}

        {step === "success" && (
          <div className="py-10 flex flex-col items-center justify-center text-center animate-scale-in">
            <div className="relative h-20 w-20 rounded-full bg-success/15 flex items-center justify-center mb-5">
              <Check className="h-10 w-10 text-success" strokeWidth={3} />
            </div>
            <h2 className="font-display text-2xl font-bold mb-1">You're in</h2>
            <p className="text-sm text-muted-foreground">Redirecting to your dashboard…</p>
          </div>
        )}
      </div>
    </div>
  );
}
