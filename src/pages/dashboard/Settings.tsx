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
import { store } from "@/lib/store";

export const SettingsView = () => {
    const [plan, setPlan] = useState(() => store.getPlan()); // free | pro
    const [autoLockout, setAutoLockout] = useState(false);
    const [neuralCryptography, setNeuralCryptography] = useState(true);

    const handleUpgrade = async () => {
        try {
            const resp = await fetch('/api/create-payment', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ clientId: 'admin', plan: 'premium' })
            });
            const json = await resp.json();
            if (!json.ok) throw new Error(json.error || 'Payment creation failed');
            const invoice = json.invoice;
            const paymentUrl = invoice.invoice_url || invoice.payment_url || invoice.url || (invoice.payment && invoice.payment.url);
            if (paymentUrl) {
                window.open(paymentUrl, '_blank');
                toast.success('Payment initiated — complete the purchase in the new tab.');
            } else {
                toast.error('Failed to retrieve payment URL');
            }
        } catch (err: any) {
            toast.error(err?.message || String(err));
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-700 pb-8">
            {/* Header Fragment */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-4">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center">
                        <SettingsIcon className="w-4 h-4 text-accent" />
                    </div>
                    <div>
                        <h2 className="text-sm font-black text-white uppercase tracking-tight">System Configuration</h2>
                        <p className="text-[9px] text-white/20 font-black uppercase tracking-[0.2em] mt-0.5">Nexus operational parameters</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-[8px] font-black uppercase tracking-widest text-white/20">Operational Tier</span>
                    <div className={`px-2.5 py-1 rounded-lg border flex items-center gap-1.5 ${plan === 'pro' ? 'border-accent/40 bg-accent/10 text-accent' : 'border-white/5 bg-white/5 text-white/40'}`}>
                        {plan === 'pro' ? <Crown className="w-3 h-3" /> : <Star className="w-3 h-3" />}
                        <span className="text-[9px] font-black uppercase tracking-widest">{plan}</span>
                    </div>
                </div>
            </div>

            <div className="grid lg:grid-cols-12 gap-6">
                {/* Billing Matrix */}
                <div className="lg:col-span-8 space-y-8">
                    <section className="space-y-4">
                        <div className="flex items-center gap-2 text-white/40 mb-2">
                            <CreditCard className="w-3.5 h-3.5" />
                            <h3 className="text-[10px] font-black uppercase tracking-widest">Financial Interface</h3>
                        </div>
                        <div className="grid md:grid-cols-2 gap-4">
                            <div className={`p-6 bg-[#1a1b23]/40 rounded-2xl border transition-all ${plan === 'free' ? 'border-accent/30 bg-accent/[0.02]' : 'border-white/5'}`}>
                                <h4 className="text-sm font-black text-white uppercase mb-1">Nexus (Free)</h4>
                                <p className="text-[9px] text-white/30 mb-5 font-medium uppercase tracking-tighter">Baseline operator tier</p>
                                <ul className="space-y-2 mb-6">
                                    {['1 Logic Blueprint', '1 Priority Partner', 'Standard Metrics'].map((feature, i) => (
                                        <li key={i} className="flex items-center gap-2 text-[10px] font-bold text-white/50">
                                            <CheckCircle2 className="w-3 h-3 text-white/10" />
                                            {feature}
                                        </li>
                                    ))}
                                </ul>
                                <Button disabled={plan === 'free'} size="sm" className="w-full h-8 rounded-lg border border-white/5 text-[8px] font-black uppercase tracking-widest">
                                    {plan === 'free' ? 'Current State' : 'Select'}
                                </Button>
                            </div>

                            <div className={`relative p-6 bg-[#1a1b23]/40 rounded-2xl border transition-all overflow-hidden ${plan === 'pro' ? 'border-accent bg-accent/[0.02]' : 'border-white/5 hover:border-accent/20'}`}>
                                <div className="absolute top-0 right-0 w-24 h-24 bg-accent/5 blur-3xl" />
                                <div className="flex items-start justify-between mb-1">
                                    <h4 className="text-sm font-black text-white uppercase">Enterprise</h4>
                                    <span className="text-accent font-black text-lg tracking-tighter">$10<span className="text-[8px] text-white/40 uppercase font-black ml-1">/mo</span></span>
                                </div>
                                <p className="text-[9px] text-white/30 mb-5 font-medium uppercase tracking-tighter">Adv. automation suite</p>
                                <ul className="space-y-2 mb-6">
                                    {['Unlimited Blueprints', 'Unlimited Partners', 'Automated Relays'].map((feature, i) => (
                                        <li key={i} className="flex items-center gap-2 text-[10px] font-bold text-white/80">
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
                        <div className="flex items-center gap-2 text-white/40 mb-2">
                            <Shield className="w-3.5 h-3.5" />
                            <h3 className="text-[10px] font-black uppercase tracking-widest">Security Subsystems</h3>
                        </div>
                        <div className="space-y-3 bg-[#1a1b23]/20 p-5 rounded-2xl border border-white/5">
                            <div className="flex items-center justify-between pb-3 border-b border-white/5">
                                <div className="space-y-0.5">
                                    <p className="text-[11px] font-bold text-white">Auto-Lockout</p>
                                    <p className="text-[9px] text-white/20 uppercase tracking-tighter italic">Terminate session after 15m idle</p>
                                </div>
                                <Switch checked={autoLockout} onCheckedChange={setAutoLockout} className="scale-75 data-[state=checked]:bg-accent" />
                            </div>
                            <div className="flex items-center justify-between pt-1">
                                <div className="space-y-1">
                                    <p className="text-[11px] font-bold text-white">Neural Cryptography</p>
                                    <p className="text-[9px] text-white/20 uppercase tracking-tighter italic">Encrypt all partner payloads</p>
                                </div>
                                <Switch checked={neuralCryptography} onCheckedChange={setNeuralCryptography} className="scale-75 data-[state=checked]:bg-accent" />
                            </div>
                        </div>
                    </section>
                </div>

                {/* Integration Slots */}
                <div className="lg:col-span-4 space-y-4">
                    <div className="p-6 bg-[#1a1b23]/40 rounded-2xl border border-white/5">
                        <h4 className="text-[8px] font-black uppercase tracking-widest text-white/20 mb-5">Command Gateway</h4>
                        <div className="space-y-6">
                            <h2 className="text-2xl font-bold">Settings</h2>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-white/50">JS snippet</label>
                                    <input type="text" value="<script src='...'></script>" readOnly className="w-full bg-white/5 p-2 rounded-lg mt-1" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-white/50">Event schema</label>
                                    <textarea readOnly className="w-full bg-white/5 p-2 rounded-lg mt-1" value={JSON.stringify({ user: '...', event: '...' }, null, 2)} />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-white/50">Webhook config</label>
                                    <input type="text" value="https://..." readOnly className="w-full bg-white/5 p-2 rounded-lg mt-1" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-white/50">User ID mapping</label>
                                    <input type="text" value="..." readOnly className="w-full bg-white/5 p-2 rounded-lg mt-1" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-[8px] uppercase font-black tracking-widest text-white/20 ml-1">Master Token</Label>
                                <Input type="password" value="sk_nexus_********************" className="bg-white/5 h-8 text-[9px] rounded-lg border-white/5 text-white/20" readOnly />
                            </div>
                        </div>
                    </div>

                    <div className="p-6 bg-success/5 rounded-2xl border border-success/10 relative overflow-hidden">
                        <Zap className="absolute -right-4 -top-4 w-16 h-16 text-success/10" />
                        <h4 className="text-[9px] font-black uppercase tracking-widest text-success mb-2">Systems Nominal</h4>
                        <p className="text-[8px] text-white/30 uppercase tracking-tighter font-black leading-tight italic">All serverless clusters are active in the US-EAST quadrant.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};
