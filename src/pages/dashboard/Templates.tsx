import { useState } from "react";
import { FileText, Plus, Search, Trash2, Edit3, CheckCircle2, Copy, Rocket, Zap, Shield, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

export const TemplatesView = () => {
    const [templates, setTemplates] = useState([
        {
            id: 1,
            title: "Enterprise Nexus",
            description: "High-compliance protocol for global institutions.",
            tasks: 12,
            icon: Shield,
            color: "text-accent"
        },
        {
            id: 2,
            title: "Velocity Stream",
            description: "Rapid onboarding for high-growth startups.",
            tasks: 6,
            icon: Zap,
            color: "text-orange-500"
        },
        {
            id: 3,
            title: "Standard Ops",
            description: "Baseline verification sequence for standard partners.",
            tasks: 8,
            icon: Target,
            color: "text-blue-400"
        },
    ]);

    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [newTemplate, setNewTemplate] = useState({ title: "", description: "" });

    const handleAddTemplate = () => {
        if (!newTemplate.title) return;
        setTemplates([...templates, {
            id: Date.now(),
            ...newTemplate,
            tasks: 0,
            icon: FileText,
            color: "text-white/40"
        }]);
        setIsAddDialogOpen(false);
        setNewTemplate({ title: "", description: "" });
        toast.success("Blueprint Forged");
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-700">
            {/* Header Control */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-4">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-orange-500/10 border border-orange-500/20 flex items-center justify-center">
                        <Rocket className="w-4 h-4 text-orange-500" />
                    </div>
                    <div>
                        <h2 className="text-sm font-black text-white uppercase tracking-tight">Workflow Blueprints</h2>
                        <p className="text-[9px] text-white/20 font-black uppercase tracking-[0.2em] mt-0.5">Tactical Onboarding Logic</p>
                    </div>
                </div>
                <Button
                    variant="accent"
                    size="sm"
                    onClick={() => setIsAddDialogOpen(true)}
                    className="h-7 px-4 rounded-lg font-black uppercase text-[9px] tracking-widest shadow-glow"
                >
                    <Plus className="w-3.5 h-3.5 mr-1.5" />
                    Forge Blueprint
                </Button>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {templates.map((template) => (
                    <div
                        key={template.id}
                        className="group relative p-5 bg-[#1a1b23]/40 backdrop-blur-3xl rounded-2xl border border-white/5 hover:border-accent/20 transition-all overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 w-20 h-20 bg-accent/5 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />

                        <div className="relative flex flex-col h-full gap-4">
                            <div className="flex items-start justify-between">
                                <div className={`w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/5 group-hover:border-accent/20 transition-colors`}>
                                    <template.icon className={`w-5 h-5 ${template.color}`} />
                                </div>
                                <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-all translate-y-1 group-hover:translate-y-0">
                                    <Button variant="ghost" size="sm" className="h-7 w-7 p-0 rounded-lg bg-white/5 text-white/20 hover:text-white" onClick={() => toast.info("Cloning Sequence")}>
                                        <Copy className="w-3 h-3" />
                                    </Button>
                                    <Button variant="ghost" size="sm" className="h-7 w-7 p-0 rounded-lg bg-white/5 text-white/10 hover:text-red-400" onClick={() => setTemplates(prev => prev.filter(t => t.id !== template.id))}>
                                        <Trash2 className="w-3 h-3" />
                                    </Button>
                                </div>
                            </div>

                            <div className="space-y-1 mt-2">
                                <h3 className="text-xs font-black text-white uppercase tracking-tight">{template.title}</h3>
                                <p className="text-[10px] text-white/30 font-medium leading-relaxed italic line-clamp-2">"{template.description}"</p>
                            </div>

                            <div className="mt-auto pt-4 flex items-center justify-between border-t border-white/5">
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-accent/20" />
                                    <span className="text-[8px] font-black tracking-widest text-white/20 uppercase">{template.tasks} Objectives</span>
                                </div>
                                <Button variant="ghost" className="h-6 px-2 rounded-md text-[8px] font-black uppercase tracking-widest text-accent hover:bg-accent/10 transition-all">
                                    Configure
                                </Button>
                            </div>
                        </div>
                    </div>
                ))}

                {/* Create Orb */}
                <button
                    onClick={() => setIsAddDialogOpen(true)}
                    className="p-5 rounded-2xl border border-dashed border-white/5 bg-white/[0.01] hover:bg-white/[0.03] hover:border-white/10 transition-all flex flex-col items-center justify-center gap-3 text-center group"
                >
                    <div className="w-9 h-9 rounded-full border border-white/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Plus className="w-4 h-4 text-white/20 group-hover:text-white" />
                    </div>
                    <p className="text-[9px] font-black uppercase tracking-widest text-white/20">New Logic Block</p>
                </button>
            </div>

            {/* Forge Dialog */}
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogContent className="sm:max-w-[360px] bg-[#1a1b23] border-white/5 text-white rounded-2xl p-6 shadow-2xl backdrop-blur-3xl">
                    <DialogHeader className="mb-4">
                        <DialogTitle className="text-xl font-black tracking-tight uppercase italic">Blueprint Forge</DialogTitle>
                        <DialogDescription className="text-white/40 text-[11px]">Manifest a new tactical onboarding sequence.</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div className="space-y-1.5">
                            <Label className="text-[9px] uppercase font-black tracking-widest text-white/20 ml-1">Blueprint Title</Label>
                            <Input placeholder="E.g. Quantum Integration" className="bg-white/5 h-10 border-white/5 rounded-xl text-xs" value={newTemplate.title} onChange={(e) => setNewTemplate({ ...newTemplate, title: e.target.value })} />
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-[9px] uppercase font-black tracking-widest text-white/20 ml-1">Operational Summary</Label>
                            <Input placeholder="Brief mission brief..." className="bg-white/5 h-10 border-white/5 rounded-xl text-xs" value={newTemplate.description} onChange={(e) => setNewTemplate({ ...newTemplate, description: e.target.value })} />
                        </div>
                    </div>
                    <DialogFooter className="mt-6">
                        <Button variant="accent" className="w-full h-10 rounded-xl font-black uppercase text-[10px] tracking-widest shadow-glow" onClick={handleAddTemplate}>Forge Blueprint</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};
