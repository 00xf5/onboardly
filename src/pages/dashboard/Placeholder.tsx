import { Cpu, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PlaceholderViewProps {
    title: string;
    onReset: () => void;
}

export const PlaceholderView = ({ title, onReset }: PlaceholderViewProps) => {
    return (
        <div className="h-full min-h-[400px] flex flex-col items-center justify-center text-center p-8 bg-[#1a1b23]/20 backdrop-blur-xl rounded-2xl border border-dashed border-white/5">
            <div className="relative mb-6">
                <div className="absolute inset-0 bg-accent/10 blur-2xl rounded-full" />
                <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center relative">
                    <Cpu className="w-8 h-8 text-accent/40" />
                </div>
            </div>

            <h2 className="text-xl font-black text-white uppercase tracking-tight mb-2">{title} Offline</h2>
            <p className="text-[10px] text-white/20 max-w-[240px] font-black uppercase tracking-[0.2em] leading-relaxed">
                Synchonization Protocols for the {title} module are currently in standby.
            </p>

            <div className="mt-8 flex flex-col items-center gap-4">
                <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 text-[9px] font-black uppercase tracking-[0.2em] text-white/30 hover:text-white hover:bg-white/5 gap-2 px-5 rounded-lg border border-white/5 shadow-glow"
                    onClick={onReset}
                >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    Reset Connection
                </Button>
            </div>
        </div>
    );
};
