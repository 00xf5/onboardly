import { useState } from "react";
import {
    Settings as SettingsIcon,
    CreditCard,
    Zap,
    Shield,
    Key,
    Bell,
    Smartphone,
    Check,
    Star,
    Crown,
    CheckCircle2,
    ArrowUpRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { PaymentPortal } from "@/components/dashboard/PaymentPortal";

export const SettingsView = () => {
    const [plan, setPlan] = useState(() => {
        const user = localStorage.getItem('onboardly_user');
        return user ? JSON.parse(user).plan || 'free' : 'free';
    });
    const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
    const [autoLockout, setAutoLockout] = useState(false);
    const [neuralCryptography, setNeuralCryptography] = useState(true);

    const handleUpgrade = async () => {
        setIsPaymentDialogOpen(true);
    };

    const onPaymentSuccess = async () => {
        const user = localStorage.getItem('onboardly_user');
        if (user) {
            const userData = JSON.parse(user);

            try {
                // Persistent Trace: Update the cloud state
                const { doc, updateDoc } = await import("firebase/firestore");
                const { db } = await import("@/lib/firebase");

                const userRef = doc(db, "users", userData.id);
                await updateDoc(userRef, { plan: 'pro' });

                // Synchronize Local Reality
                userData.plan = 'pro';
                localStorage.setItem('onboardly_user', JSON.stringify(userData));
                setPlan('pro');

                // Alert the system nexus
                window.dispatchEvent(new Event('user-update'));
                toast.success("Nexus Upgrade Authorized", {
                    description: "Your operational tier has been elevated to Pro."
                });

                // Secure exit
                setTimeout(() => {
                    setIsPaymentDialogOpen(false);
                }, 1500);
            } catch (error) {
                console.error("Nexus upgrade failed:", error);
                toast.error("Cloud synchronization failed. Contact support.");
            }
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-700 pb-8">
            {/* Header Fragment */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-4">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center">
                        <SettingsIcon className="w-4 h-4 text-accent" />
                    </div>
                    <div>
                        <h2 className="text-sm font-black text-foreground uppercase tracking-tight">System Configuration</h2>
                        <p className="text-[9px] text-muted-foreground/30 font-black uppercase tracking-[0.2em] mt-0.5">Nexus operational parameters</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-[8px] font-black uppercase tracking-widest text-muted-foreground/30">Operational Tier</span>
                    <div className={`px-2.5 py-1 rounded-lg border flex items-center gap-1.5 ${plan === 'pro' ? 'border-accent/40 bg-accent/10 text-accent' : 'border-border bg-muted/50 text-muted-foreground'}`}>
                        {plan === 'pro' ? <Crown className="w-3 h-3" /> : <Star className="w-3 h-3" />}
                        <span className="text-[9px] font-black uppercase tracking-widest">{plan}</span>
                    </div>
                </div>
            </div>

            <div className="grid lg:grid-cols-12 gap-6">
                {/* Billing Matrix */}
                <div className="lg:col-span-8 space-y-8">
                    <section className="space-y-4">
                        <div className="flex items-center gap-2 text-muted-foreground/40 mb-2">
                            <CreditCard className="w-3.5 h-3.5" />
                            <h3 className="text-[10px] font-black uppercase tracking-widest">Financial Interface</h3>
                        </div>
                        <div className="grid md:grid-cols-2 gap-4">
                            <div className={`p-6 bg-card/40 rounded-2xl border transition-all ${plan === 'free' ? 'border-accent/30 bg-accent/[0.02]' : 'border-border'}`}>
                                <h4 className="text-sm font-black text-foreground uppercase mb-1">Nexus (Free)</h4>
                                <p className="text-[9px] text-muted-foreground/30 mb-5 font-medium uppercase tracking-tighter">Baseline operator tier</p>
                                <ul className="space-y-2 mb-6">
                                    {['1 Logic Blueprint', '1 Priority Partner', 'Standard Metrics'].map((feature, i) => (
                                        <li key={i} className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground/50">
                                            <CheckCircle2 className="w-3 h-3 text-muted-foreground/10" />
                                            {feature}
                                        </li>
                                    ))}
                                </ul>
                                <Button disabled={plan === 'free'} size="sm" className="w-full h-8 rounded-lg border border-border text-[8px] font-black uppercase tracking-widest">
                                    {plan === 'free' ? 'Current State' : 'Select'}
                                </Button>
                            </div>

                            <div className={`relative p-6 bg-card/40 rounded-2xl border transition-all overflow-hidden ${plan === 'pro' ? 'border-accent bg-accent/[0.02]' : 'border-border hover:border-accent/20'}`}>
                                <div className="absolute top-0 right-0 w-24 h-24 bg-accent/5 blur-3xl" />
                                <div className="flex items-start justify-between mb-1">
                                    <h4 className="text-sm font-black text-foreground uppercase">Pro</h4>
                                    <span className="text-accent font-black text-lg tracking-tighter">$16<span className="text-[8px] text-muted-foreground/50 uppercase font-black ml-1">/mo</span></span>
                                </div>
                                <p className="text-[9px] text-muted-foreground/30 mb-5 font-medium uppercase tracking-tighter">Adv. automation suite (23,000 NGN/mo)</p>
                                <ul className="space-y-2 mb-6">
                                    {['Unlimited Blueprints', 'Unlimited Partners', 'Nexus Insights', 'Visual Flow Engine'].map((feature, i) => (
                                        <li key={i} className="flex items-center gap-2 text-[10px] font-bold text-foreground">
                                            <CheckCircle2 className="w-3 h-3 text-accent" />
                                            {feature}
                                        </li>
                                    ))}
                                </ul>
                                <Button
                                    size="sm"
                                    onClick={handleUpgrade}
                                    className={`w-full h-8 rounded-lg font-black uppercase text-[8px] tracking-widest ${plan === 'pro' ? 'bg-white/5 text-white/40' : 'bg-accent text-white shadow-glow'}`}
                                >
                                    {plan === 'pro' ? 'Current State' : 'Initiate Upgrade'}
                                </Button>
                            </div>
                        </div>
                    </section>

                    {/* Protection Protocols */}
                    <section className="space-y-4">
                        <div className="flex items-center gap-2 text-muted-foreground/40 mb-2">
                            <Shield className="w-3.5 h-3.5" />
                            <h3 className="text-[10px] font-black uppercase tracking-widest">Security Subsystems</h3>
                        </div>
                        <div className="space-y-3 bg-card/20 p-5 rounded-2xl border border-border">
                            <div className="flex items-center justify-between pb-3 border-b border-border/50">
                                <div className="space-y-0.5">
                                    <p className="text-[11px] font-bold text-foreground">Auto-Lockout</p>
                                    <p className="text-[9px] text-muted-foreground/30 uppercase tracking-tighter italic">Terminate session after 15m idle</p>
                                </div>
                                <Switch checked={autoLockout} onCheckedChange={setAutoLockout} className="scale-75 data-[state=checked]:bg-accent" />
                            </div>
                            <div className="flex items-center justify-between pt-1">
                                <div className="space-y-1">
                                    <p className="text-[11px] font-bold text-foreground">Neural Cryptography</p>
                                    <p className="text-[9px] text-muted-foreground/30 uppercase tracking-tighter italic">Encrypt all partner payloads</p>
                                </div>
                                <Switch checked={neuralCryptography} onCheckedChange={setNeuralCryptography} className="scale-75 data-[state=checked]:bg-accent" />
                            </div>
                        </div>
                    </section>
                </div>

                {/* Integration Slots */}
                <div className="lg:col-span-4 space-y-4">
                    <div className="p-6 bg-card/40 rounded-2xl border border-border">
                        <h4 className="text-[8px] font-black uppercase tracking-widest text-muted-foreground/20 mb-5">Command Gateway</h4>
                        <div className="space-y-6">
                            <h2 className="text-2xl font-bold text-foreground">Settings</h2>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-[10px] uppercase font-black tracking-widest text-muted-foreground/30 ml-1 mb-2 italic">Trojan Horse Widget Snippet</label>
                                    <div className="relative group">
                                        <textarea
                                            readOnly
                                            value={`<script \n  src="${window.location.origin}/widget-loader.js" \n  data-onboardly-id="YOUR_PARTNER_SLUG"\n></script>`}
                                            className="w-full bg-muted p-4 rounded-xl text-[10px] font-mono text-accent/80 border border-border group-hover:border-accent/30 transition-all h-24"
                                        />
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="absolute top-2 right-2 h-6 text-[8px] font-black uppercase tracking-widest bg-card/50"
                                            onClick={() => {
                                                navigator.clipboard.writeText(`<script src="${window.location.origin}/widget-loader.js" data-onboardly-id="YOUR_PARTNER_SLUG"></script>`);
                                                toast.success("Snippet Copied");
                                            }}
                                        >
                                            Copy
                                        </Button>
                                    </div>
                                    <p className="text-[8px] text-muted-foreground/20 mt-2 font-black uppercase tracking-widest italic">Replace YOUR_PARTNER_SLUG with the target ID.</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-muted-foreground/50">Event schema</label>
                                    <textarea readOnly className="w-full bg-muted p-2 rounded-lg mt-1 text-muted-foreground/50 h-24" value={JSON.stringify({ user: '...', event: '...' }, null, 2)} />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-muted-foreground/50">Webhook config</label>
                                    <input type="text" value="https://..." readOnly className="w-full bg-muted p-2 rounded-lg mt-1 text-muted-foreground/50" />
                                </div>
                            </div>
                            <div className="space-y-2 mt-4">
                                <Label className="text-[8px] uppercase font-black tracking-widest text-muted-foreground/20 ml-1">Master Token</Label>
                                <Input type="password" value="sk_nexus_********************" className="bg-muted h-8 text-[9px] rounded-lg border-border text-muted-foreground/40" readOnly />
                            </div>
                        </div>
                    </div>

                    <div className="p-6 bg-success/5 rounded-2xl border border-success/10 relative overflow-hidden">
                        <Zap className="absolute -right-4 -top-4 w-16 h-16 text-success/10" />
                        <h4 className="text-[9px] font-black uppercase tracking-widest text-success mb-2">Systems Nominal</h4>
                        <p className="text-[8px] text-muted-foreground/30 uppercase tracking-tighter font-black leading-tight italic">All serverless clusters are active in the US-EAST quadrant.</p>
                    </div>
                </div>
            </div>

            {/* Payment Portal Dialog */}
            <Dialog open={isPaymentDialogOpen} onOpenChange={setIsPaymentDialogOpen}>
                <DialogContent className="sm:max-w-[460px] bg-card border-border text-foreground rounded-2xl p-0 overflow-hidden shadow-2xl backdrop-blur-3xl">
                    <DialogHeader className="p-6 pb-2">
                        <DialogTitle className="text-xl font-black tracking-tight uppercase italic">Nexus Tier Upgrade</DialogTitle>
                        <DialogDescription className="text-muted-foreground/40 text-[11px]">Authorize the crypto-relay for Pro access.</DialogDescription>
                    </DialogHeader>
                    <div className="p-6">
                        <PaymentPortal onSuccess={onPaymentSuccess} />
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
};

