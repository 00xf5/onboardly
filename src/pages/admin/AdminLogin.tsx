import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock, ArrowLeft, Eye, EyeOff, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

const AdminLogin = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        // Required Credentials from user request
        const ADMIN_EMAIL = "admin@onboardly.com";
        const ADMIN_PASS = "Jackson1?";

        try {
            // Check against the requested credentials
            if (email === ADMIN_EMAIL && password === ADMIN_PASS) {
                // Mock an admin session
                localStorage.setItem('onboardly_admin_session', JSON.stringify({
                    email: ADMIN_EMAIL,
                    role: 'super-admin',
                    authenticatedAt: new Date().toISOString()
                }));

                toast.success("Nexus Master Access Granted", {
                    description: "Authorized personnel identified. Initializing Master Control."
                });

                setTimeout(() => {
                    navigate("/admin/dashboard");
                }, 1000);
            } else {
                throw new Error("Invalid Administrative Credentials");
            }
        } catch (error: any) {
            console.error("Admin Login error:", error);
            toast.error(error.message || 'Access Denied');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#050510] flex items-center justify-center p-6 relative overflow-hidden">
            {/* Ambient Background */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent/5 blur-[120px] rounded-full -mr-64 -mt-64 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-accent/5 blur-[120px] rounded-full -ml-64 -mb-64 pointer-events-none" />

            <div className="w-full max-w-md relative z-10">
                <Link
                    to="/"
                    className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/40 hover:text-accent mb-12 transition-all group"
                >
                    <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
                    Abandon Secure Terminal
                </Link>

                <div className="bg-card/40 backdrop-blur-3xl border border-border/50 p-10 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
                    {/* Interior Glow */}
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-accent/50 to-transparent opacity-30" />

                    <div className="mb-10 text-center">
                        <div className="w-16 h-16 rounded-2xl bg-muted border border-border flex items-center justify-center mx-auto mb-6 shadow-sm">
                            <ShieldCheck className="w-8 h-8 text-accent" />
                        </div>
                        <h1 className="text-sm font-black text-foreground uppercase tracking-[0.4em] mb-2 leading-none">Terminal: Alpha</h1>
                        <p className="text-[10px] text-muted-foreground/40 font-black uppercase tracking-[0.1em]">Administrative Override Protocol</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <Label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/30 ml-1">Vessel Identification</Label>
                            <Input
                                type="email"
                                placeholder="admin@nexus.io"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="bg-muted/50 h-12 text-xs rounded-xl border-border/10 focus:border-accent/30 transition-all text-foreground"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/30 ml-1">Security Keyphrase</Label>
                            <div className="relative">
                                <Input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="bg-muted/50 h-12 text-xs rounded-xl border-border/10 focus:border-accent/30 transition-all text-foreground"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground/30 hover:text-foreground transition-colors"
                                >
                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>

                        <Button
                            type="submit"
                            className="w-full h-12 bg-accent hover:bg-accent/90 text-white font-black uppercase text-[10px] tracking-[0.3em] rounded-xl shadow-glow transition-all active:scale-[0.98]"
                            disabled={isLoading}
                        >
                            {isLoading ? "Validating Nexus Signatures..." : "Engage Override"}
                        </Button>
                    </form>

                    <div className="mt-10 flex items-center justify-center gap-4 opacity-10">
                        <div className="h-px w-12 bg-white" />
                        <span className="text-[7px] font-black uppercase tracking-[0.5em] text-white">System Level 7</span>
                        <div className="h-px w-12 bg-white" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminLogin;
