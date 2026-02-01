import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Zap, ArrowLeft, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const { signInWithEmailAndPassword } = await import("firebase/auth");
    const { doc, getDoc } = await import("firebase/firestore");
    const { auth, db } = await import("@/lib/firebase");

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Get user profile from Firestore
      const userDoc = await getDoc(doc(db, "users", user.uid));

      if (userDoc.exists()) {
        localStorage.setItem('onboardly_user', JSON.stringify({ ...userDoc.data(), id: userDoc.id }));
      } else {
        // Fallback if doc doesn't exist for some reason
        localStorage.setItem('onboardly_user', JSON.stringify({
          id: user.uid,
          email: user.email,
          name: user.displayName || 'User',
          plan: 'free'
        }));
      }

      navigate("/dashboard");
    } catch (error: any) {
      console.error("Login error:", error);
      toast.error(error.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[var(--viewport-height)] bg-background flex">
      {/* Left side - Form */}
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
            <Link to="/" className="flex items-center gap-2 mb-6">
              <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center">
                <Zap className="w-6 h-6 text-accent-foreground" />
              </div>
              <span className="text-2xl font-bold text-foreground">Onboardly</span>
            </Link>
            <h1 className="text-2xl font-bold text-foreground mb-2">Welcome back</h1>
            <p className="text-muted-foreground">
              Sign in to your account to continue
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">

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
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <a
                  href="#"
                  className="text-sm text-accent hover:underline"
                  onClick={async (e) => {
                    e.preventDefault();
                    if (!email) {
                      toast.error('Please enter your email first');
                      return;
                    }

                    try {
                      const { sendPasswordResetEmail } = await import("firebase/auth");
                      const { auth } = await import("@/lib/firebase");
                      await sendPasswordResetEmail(auth, email);
                      toast.success('If an account exists, a reset link will be sent');
                    } catch (error: any) {
                      console.error("Reset error:", error);
                      toast.error('Failed to send reset email');
                    }
                  }}
                >
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
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
            </div>

            <Button
              type="submit"
              variant="accent"
              className="w-full"
              size="lg"
              disabled={isLoading}
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link to="/signup" className="text-accent hover:underline font-medium">
              Sign up
            </Link>
          </p>
        </div>
      </div>

      {/* Right side - Decorative */}
      <div className="hidden lg:flex flex-1 hero-gradient items-center justify-center p-12">
        <div className="max-w-md text-center">
          <div className="w-20 h-20 rounded-2xl bg-accent/20 flex items-center justify-center mx-auto mb-8">
            <Zap className="w-10 h-10 text-accent" />
          </div>
          <h2 className="text-3xl font-bold text-primary-foreground mb-4">
            Streamline your onboarding
          </h2>
          <p className="text-primary-foreground/70">
            Automate client onboarding, track progress, and deliver a professional experience every time.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
