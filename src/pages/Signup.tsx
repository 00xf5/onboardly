import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Zap, ArrowLeft, Eye, EyeOff, Check } from "lucide-react";
import { toast } from "sonner";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [trustToken, setTrustToken] = useState<string | null>(null);

  useEffect(() => {
    // Load Sentinel Script
    const script = document.createElement("script");
    script.src = "https://sentinel.risksignal.name.ng/widget.js";
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);

    // Event Listener for Sentinel Success
    const handleSentinelSuccess = (event: any) => {
      const { trust_token } = event.detail;
      console.log('Verified!', trust_token);
      setTrustToken(trust_token);
      setIsVerified(true);
      toast.success("Identity verified successfully");
    };

    document.addEventListener('sentinelSuccess', handleSentinelSuccess);

    return () => {
      document.body.removeChild(script);
      document.removeEventListener('sentinelSuccess', handleSentinelSuccess);
    };
  }, []);

  const benefits = [
    "Free forever plan available",
    "No credit card required",
    "Set up in under 5 minutes",
  ];

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreed) return;
    setIsLoading(true);

    const { createUserWithEmailAndPassword, updateProfile } = await import("firebase/auth");
    const { doc, setDoc } = await import("firebase/firestore");
    const { auth, db } = await import("@/lib/firebase");
    const { sendWelcomeEmail } = await import("@/lib/email");

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await updateProfile(user, { displayName: name });

      // Create user document in Firestore
      const userDoc = {
        id: user.uid,
        name,
        email,
        plan: 'free',
        createdAt: new Date().toISOString()
      };
      await setDoc(doc(db, "users", user.uid), userDoc);

      // Send welcome email (non-blocking - don't fail signup if email fails)
      sendWelcomeEmail(email, name).then((result) => {
        if (result.success) {
          console.log('✅ Welcome email sent successfully!');
        } else {
          console.warn('⚠️ Welcome email failed to send:', result.error);
        }
      });

      localStorage.setItem('onboardly_user', JSON.stringify(userDoc));
      toast.success('Account created successfully!');
      navigate("/dashboard");
    } catch (error: any) {
      console.error("Signup error:", error);
      toast.error(error.message || 'Signup failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[var(--viewport-height)] bg-background flex">
      {/* Left side - Decorative */}
      <div className="hidden lg:flex flex-1 hero-gradient items-center justify-center p-12 relative">
        <div className="absolute inset-0 bg-accent/5 mix-blend-overlay" />
        <div className="max-w-md relative z-10">
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-10 rounded-[2.5rem] shadow-2xl animate-in fade-in slide-in-from-left duration-1000">
            <div className="w-20 h-20 rounded-2xl bg-accent p-4 shadow-glow flex items-center justify-center mb-8 rotate-3 transition-transform hover:rotate-0 duration-500">
              <img src="/assets/brand/logo.png" alt="Onboardly" className="w-full h-full object-contain" />
            </div>
            <h2 className="text-3xl font-black text-white mb-4 tracking-tight uppercase italic">
              Start onboarding <span className="text-accent underline decoration-accent/30">partners</span> today
            </h2>
            <p className="text-white/40 text-xs font-black uppercase tracking-[0.2em] mb-8 leading-relaxed">
              Join hundreds of high-velocity teams who trust Onboardly to manage their client activation sequence.
            </p>
            <ul className="space-y-4">
              {benefits.map((benefit, index) => (
                <li key={index} className="flex items-center gap-4 text-white/80 group">
                  <div className="w-6 h-6 rounded-lg bg-accent/20 border border-accent/20 flex items-center justify-center transition-colors group-hover:bg-accent group-hover:text-white">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest">{benefit}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to home
          </Link>

          <div className="mb-8">
            <Link to="/" className="flex items-center gap-2.5 mb-6">
              <div className="w-10 h-10 rounded-xl bg-orange-500 p-1 flex items-center justify-center shadow-glow">
                <img src="/assets/brand/logo.png" alt="Onboardly" className="w-full h-full object-contain" />
              </div>
              <span className="text-2xl font-display font-black tracking-tight text-foreground uppercase italic">Onboardly <span className="text-accent underline decoration-accent/20">Nexus</span></span>
            </Link>
            <h1 className="text-2xl font-bold text-foreground mb-2">Create your account</h1>
            <p className="text-muted-foreground">
              Get started with your free account today
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">

            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a strong password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={8}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
              <p className="text-xs text-muted-foreground">
                Must be at least 8 characters
              </p>
            </div>

            <div className="flex items-start gap-3">
              <Checkbox
                id="terms"
                checked={agreed}
                onCheckedChange={(checked) => setAgreed(checked as boolean)}
              />
              <Label htmlFor="terms" className="text-sm text-muted-foreground leading-relaxed">
                I agree to the{" "}
                <a href="#" className="text-accent hover:underline">
                  Terms of Service
                </a>{" "}
                and{" "}
                <a href="#" className="text-accent hover:underline">
                  Privacy Policy
                </a>
              </Label>
            </div>

            {/* Sentinel Widget Target */}
            <div
              id="sentinel-widget"
              data-sitekey="sl_05a5bb0835cc8b64257cb5d9096386cf836c7dbc088b3b18"
              className="min-h-[60px] flex items-center justify-center transition-all my-6"
            ></div>

            <Button
              id="submit-btn"
              type="submit"
              variant="accent"
              className="w-full relative overflow-hidden group"
              size="lg"
              disabled={isLoading || !agreed || !isVerified}
            >
              <div className={`absolute inset-0 bg-white/10 transition-transform duration-500 ${isVerified ? 'translate-x-[100%]' : 'translate-x-0'}`} />
              <span className="relative z-10">
                {isLoading ? "Initializing Identity..." : isVerified ? "Create Account" : "Complete Verification"}
              </span>
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link to="/login" className="text-accent hover:underline font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
