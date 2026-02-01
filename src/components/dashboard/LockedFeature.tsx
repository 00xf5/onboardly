import { Lock, Crown, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface LockedFeatureProps {
    title: string;
    description: string;
}

export const LockedFeature = ({ title, description }: LockedFeatureProps) => {
    return (
        <div className="h-[400px] w-full flex flex-col items-center justify-center relative p-8 text-center animate-in fade-in zoom-in duration-700">
            {/* Ambient Background */}
            <div className="absolute inset-0 bg-accent/[0.02] rounded-3xl overflow-hidden">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[60%] bg-accent/5 rounded-full blur-[100px]" />
            </div>

            {/* Lock Icon Hub */}
            <div className="relative mb-8">
                <div className="w-20 h-20 rounded-full border border-white/5 flex items-center justify-center relative">
                    <div className="absolute inset-0 rounded-full border-t border-accent/20 animate-spin duration-[4000ms]" />
                    <div className="w-12 h-12 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-center shadow-glow">
                        <Lock className="w-6 h-6 text-accent animate-pulse" />
                    </div>
                </div>
                <div className="absolute -top-2 -right-2">
                    <div className="w-8 h-8 rounded-lg bg-accent text-white flex items-center justify-center shadow-glow rotate-12">
                        <Crown className="w-4 h-4" />
                    </div>
                </div>
            </div>

            {/* Copy */}
            <div className="relative space-y-3 max-w-sm mb-8">
                <h3 className="text-xl font-black uppercase tracking-tight text-white italic">
                    Feature <span className="text-accent underline decoration-accent/20">Restricted</span>
                </h3>
                <p className="text-[11px] font-black uppercase tracking-widest text-white/30 leading-relaxed">
                    The {title} suite is an <span className="text-white/60">advanced nexus capability</span>. {description}
                </p>
            </div>

            {/* Action */}
            <div className="relative">
                <Button
                    variant="accent"
                    className="h-10 px-8 rounded-xl font-black uppercase text-[10px] tracking-widest shadow-glow group"
                    onClick={() => {
                        window.location.hash = "#settings";
                        // Note: In our Dashboard logic it depends on navigation state
                        // But for proof, let's just say this button takes you to upgrade
                        const settingsItem = document.querySelector('[data-nav="Settings"]');
                        if (settingsItem) (settingsItem as HTMLElement).click();
                    }}
                >
                    Initialize Upgrade
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
            </div>

            <p className="mt-4 text-[7px] font-black uppercase tracking-widest text-white/10 italic">Tier Verification Required for Access</p>
        </div>
    );
};
