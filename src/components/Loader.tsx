import { Loader2 } from "lucide-react";

export const PageLoader = () => {
    return (
        <div className="fixed inset-0 z-[100] bg-[#0b0c10] flex flex-col items-center justify-center gap-8 animate-in fade-in duration-700">
            {/* Ambient Background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[60%] bg-accent/5 rounded-full blur-[120px] animate-pulse" />
            </div>

            <div className="relative flex items-center justify-center">
                {/* Outer Ring */}
                <div className="w-24 h-24 rounded-full border border-white/5 flex items-center justify-center relative">
                    <div className="absolute inset-0 rounded-full border-t border-accent animate-spin duration-1000" />
                    <div className="absolute inset-1 rounded-full border border-white/5 border-dashed animate-spin duration-[3000ms] reverse" />
                </div>

                {/* Logo Hub */}
                <div className="absolute w-12 h-12 rounded-2xl bg-orange-500 p-2 shadow-glow animate-bounce duration-[2000ms]">
                    <img src="/assets/brand/logo.png" alt="Onboardly" className="w-full h-full object-contain" />
                </div>
            </div>

            <div className="flex flex-col items-center gap-3 relative">
                <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black uppercase tracking-[0.5em] text-white/40">Initializing</span>
                    <span className="text-[10px] font-black uppercase tracking-[0.5em] text-accent animate-pulse">Nexus</span>
                </div>
                <div className="w-48 h-[1px] bg-white/5 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-accent to-transparent w-full -translate-x-full animate-progress" />
                </div>
                <p className="text-[7px] font-black uppercase tracking-widest text-white/10 italic">Secure Point-to-Point Encryption Active</p>
            </div>

            <style>{`
                @keyframes progress {
                    0% { transform: translateX(-100%); }
                    100% { transform: translateX(100%); }
                }
                .animate-progress {
                    animation: progress 2s infinite linear;
                }
            `}</style>
        </div>
    );
};

export const CardLoader = () => {
    return (
        <div className="bg-white/5 p-6 rounded-2xl border border-white/5 animate-pulse">
            <div className="flex items-center gap-4 mb-4">
                <div className="w-10 h-10 rounded-lg bg-white/5" />
                <div className="space-y-2">
                    <div className="h-4 w-32 bg-white/5 rounded" />
                    <div className="h-2 w-20 bg-white/5 rounded" />
                </div>
            </div>
            <div className="space-y-3">
                <div className="h-10 w-full bg-white/5 rounded-xl" />
                <div className="h-10 w-full bg-white/5 rounded-xl" />
                <div className="h-10 w-full bg-white/5 rounded-xl" />
            </div>
        </div>
    );
};
