import { Loader2 } from "lucide-react";

export const PageLoader = () => {
    return (
        <div className="h-[400px] w-full flex flex-col items-center justify-center gap-4 animate-in fade-in duration-700">
            <div className="relative">
                <div className="absolute inset-0 bg-accent/20 blur-2xl rounded-full" />
                <Loader2 className="w-10 h-10 text-accent animate-spin relative" />
            </div>
            <div className="flex flex-col items-center gap-1">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40">Synchronizing Nexus</p>
                <div className="w-24 h-[1px] bg-gradient-to-r from-transparent via-accent/30 to-transparent" />
            </div>
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
