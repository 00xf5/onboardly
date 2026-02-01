import { useState, useEffect } from "react";
import { Check, Loader2, Sparkles, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface PaymentPortalProps {
    onSuccess: () => void;
}

export const PaymentPortal = ({ onSuccess }: PaymentPortalProps) => {
    const [verifying, setVerifying] = useState(false);
    const [completed, setCompleted] = useState(false);

    const simulateVerification = () => {
        setVerifying(true);
        // Simulate a delay while we "check" the blockchain/API
        setTimeout(() => {
            setVerifying(false);
            setCompleted(true);
            toast.success("Payment Verified! Your account has been upgraded to Pro.");
            onSuccess();
        }, 3000);
    };

    return (
        <div className="flex flex-col items-center w-full">
            {!completed ? (
                <>
                    <div className="w-full h-[600px] bg-white/[0.01] rounded-xl border border-white/5 overflow-hidden flex items-center justify-center relative">
                        {/* NOWPayments Widget */}
                        <iframe
                            src="https://nowpayments.io/embeds/payment-widget?iid=6136362268"
                            width="410"
                            height="596"
                            frameBorder="0"
                            scrolling="no"
                            style={{ overflowY: 'hidden', borderRadius: '12px' }}
                            title="NOWPayments Widget"
                            className="z-10"
                        >
                            Can't load widget
                        </iframe>
                        
                        {/* Background Decoration */}
                        <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-accent/5 rounded-full blur-[100px]" />
                        </div>
                    </div>

                    <div className="mt-8 w-full max-w-[410px] space-y-4">
                        <div className="p-4 rounded-xl bg-accent/[0.03] border border-accent/10 flex items-start gap-4">
                            <ShieldCheck className="w-5 h-5 text-accent mt-1 shrink-0" />
                            <div className="space-y-1">
                                <p className="text-[10px] font-black uppercase tracking-widest text-white">Secure Relay Active</p>
                                <p className="text-[9px] text-white/30 leading-relaxed font-medium">After completing the crypto transfer, click the verification button below to initialize your Pro configuration.</p>
                            </div>
                        </div>

                        <Button 
                            onClick={simulateVerification} 
                            disabled={verifying}
                            className="w-full h-12 rounded-xl bg-accent text-white font-black uppercase text-[10px] tracking-[0.2em] shadow-glow hover:bg-accent/90"
                        >
                            {verifying ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Verifying Nexus Transaction...
                                </>
                            ) : (
                                "Manual Verification"
                            )}
                        </Button>
                        <p className="text-center text-[7px] font-black uppercase tracking-widest text-white/10 italic">
                            Powered by NOWPayments Gateway • Processing Fee: 0%
                        </p>
                    </div>
                </>
            ) : (
                <div className="h-[400px] flex flex-col items-center justify-center text-center space-y-6 animate-in zoom-in duration-500">
                    <div className="w-20 h-20 rounded-full bg-success/20 border border-success/30 flex items-center justify-center shadow-glow-success">
                        <Check className="w-10 h-10 text-success" />
                    </div>
                    <div className="space-y-2">
                        <h3 className="text-2xl font-black text-white italic tracking-tight uppercase">Access <span className="text-accent underline">Granted</span></h3>
                        <p className="text-[11px] font-black uppercase tracking-[0.2em] text-white/40">Nexus Pro Systems Initialized</p>
                    </div>
                    <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/5">
                        <Sparkles className="w-3 h-3 text-accent" />
                        <span className="text-[9px] font-black uppercase text-white/60">All restrictions lifted</span>
                    </div>
                </div>
            )}
        </div>
    );
};
