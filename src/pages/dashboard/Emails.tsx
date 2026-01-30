import React, { useState, useEffect } from "react";
import { Mail, Send, Clock, Edit3, Trash2, Plus, ArrowUpRight, CheckCircle2, AlertCircle, Eye, Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { store } from "@/lib/store";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

export const EmailsView = React.memo(() => {
    const [templates, setTemplates] = useState([
        {
            id: 1,
            name: "Initial Contact",
            subject: "Welcome to the Nexus, {client_name}",
            trigger: "Submission",
            openRate: "94%",
            status: "active"
        },
        {
            id: 2,
            name: "Task Reminder",
            subject: "Action Required: {task_name}",
            trigger: "24h Idle",
            openRate: "82%",
            status: "active"
        },
        {
            id: 3,
            name: "Mission Complete",
            subject: "Onboarding Finalized for {project_name}",
            trigger: "Finished",
            openRate: "98%",
            status: "active"
        }
    ]);

    const [transmissions, setTransmissions] = useState(() => {
        return store.getTransmissions();
    });

    useEffect(() => {
        const handler = () => setTransmissions(store.getTransmissions());
        window.addEventListener('onboardly:transmissions:updated', handler as EventListener);
        return () => window.removeEventListener('onboardly:transmissions:updated', handler as EventListener);
    }, []);

    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [newTemplate, setNewTemplate] = useState({ name: "", subject: "" });

    const handleCreateTemplate = () => {
        if (!newTemplate.name) return;
        setTemplates([...templates, {
            id: Date.now(),
            ...newTemplate,
            trigger: "Manual",
            openRate: "0%",
            status: "active"
        }]);
        setIsAddDialogOpen(false);
        setNewTemplate({ name: "", subject: "" });
        toast.success("Relay Synced");
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-700">
            {/* 🔮 Header Segment */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-4">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center">
                        <Mail className="w-4 h-4 text-accent" />
                    </div>
                    <div>
                        <h2 className="text-sm font-black text-white uppercase tracking-tight">Transmission Relays</h2>
                        <p className="text-[9px] text-white/20 font-black uppercase tracking-[0.2em] mt-0.5">Global automation protocols</p>
                    </div>
                </div>
                <Button
                    variant="accent"
                    size="sm"
                    onClick={() => setIsAddDialogOpen(true)}
                    className="h-7 px-4 rounded-lg font-black uppercase text-[9px] tracking-widest shadow-glow"
                >
                    <Plus className="w-3.5 h-3.5 mr-1.5" />
                    New Relay
                </Button>
            </div>

            <div className="grid lg:grid-cols-12 gap-6">
                {/* Templates Nexus */}
                <div className="lg:col-span-8 space-y-3">
                    {templates.map((template) => (
                        <div
                            key={template.id}
                            className="group flex items-center justify-between p-3.5 bg-[#1a1b23]/40 backdrop-blur-3xl rounded-xl border border-white/5 hover:border-accent/20 transition-all gap-4"
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-9 h-9 rounded-lg bg-white/5 border border-white/5 flex items-center justify-center group-hover:bg-accent/10 transition-colors">
                                    <Edit3 className="w-4 h-4 text-accent/60" />
                                </div>
                                <div className="space-y-0.5">
                                    <div className="flex items-center gap-2">
                                        <h3 className="text-[11px] font-bold text-white tracking-tight">{template.name}</h3>
                                        <div className="w-1 h-1 rounded-full bg-success animate-pulse" />
                                    </div>
                                    <p className="text-[9px] text-white/20 font-medium italic break-all max-w-[200px] truncate">"{template.subject}"</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-6">
                                <div className="text-right">
                                    <p className="text-[7px] font-black uppercase tracking-widest text-white/20 mb-0.5">Trigger</p>
                                    <p className="text-[9px] font-bold text-white/40">{template.trigger}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-[7px] font-black uppercase tracking-widest text-white/20 mb-0.5">Open Rate</p>
                                    <p className="text-[9px] font-black text-accent italic">{template.openRate}</p>
                                </div>
                                <div className="flex items-center gap-1.5 ml-2">
                                    <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-white/20 hover:text-white" onClick={() => toast.info(`Viewing ${template.name}`)}>
                                        <Eye className="w-3.5 h-3.5" />
                                    </Button>
                                    <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-white/10 hover:text-red-400">
                                        <Trash2 className="w-3.5 h-3.5" />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Live Stream */}
                <div className="lg:col-span-4">
                    <div className="bg-[#1a1b23]/40 backdrop-blur-3xl rounded-2xl border border-white/5 p-5 shadow-2xl overflow-hidden relative">
                        <div className="flex items-center justify-between mb-6">
                            <span className="text-[8px] font-black uppercase tracking-widest text-white/20">Active Log</span>
                            <span className="text-[8px] font-black uppercase tracking-widest text-accent italic">Online</span>
                        </div>
                        <div className="space-y-5">
                            {transmissions.map((log) => (
                                <div key={log.id} className="relative pl-4 border-l border-white/5">
                                    <div className={`absolute left-[-2px] top-0.5 w-[3px] h-[3px] rounded-full ${log.status === 'opened' ? 'bg-success shadow-[0_0_8px_#4ade80]' :
                                            log.status === 'bounced' ? 'bg-red-500 shadow-[0_0_8px_#f87171]' : 'bg-blue-400 shadow-[0_0_8px_#60a5fa]'
                                        }`} />
                                    <div className="flex items-center justify-between">
                                        <p className="text-[10px] font-bold text-white leading-none">{log.client}</p>
                                        <span className="text-[7px] font-black text-white/10 uppercase tracking-tighter">{log.time}</span>
                                    </div>
                                    <p className="text-[8px] text-white/30 font-black uppercase tracking-widest mt-1 italic">{log.template}</p>
                                </div>
                            ))}
                        </div>
                        <Button variant="ghost" className="w-full mt-6 h-8 text-[8px] font-black uppercase tracking-widest text-white/10 hover:text-white/30 border border-dashed border-white/5 rounded-lg">
                            Archive Matrix
                        </Button>
                    </div>
                </div>
            </div>

            {/* Template Dialog */}
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogContent className="sm:max-w-[360px] bg-[#1a1b23] border-white/5 text-white rounded-2xl p-6 shadow-2xl backdrop-blur-3xl">
                    <DialogHeader className="mb-4">
                        <DialogTitle className="text-xl font-black tracking-tight uppercase italic">Relay Init</DialogTitle>
                        <DialogDescription className="text-white/40 text-[11px]">Sync an automated transmission pattern.</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div className="space-y-1.5">
                            <Label className="text-[9px] uppercase font-black tracking-widest text-white/20 ml-1">Template Code</Label>
                            <Input placeholder="E.g. Follow-Up Alpha" className="bg-white/5 h-10 border-white/5 rounded-xl text-xs" value={newTemplate.name} onChange={(e) => setNewTemplate({ ...newTemplate, name: e.target.value })} />
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-[9px] uppercase font-black tracking-widest text-white/20 ml-1">Subject Header</Label>
                            <Input placeholder="Hello {{client_name}}..." className="bg-white/5 h-10 border-white/5 rounded-xl text-xs" value={newTemplate.subject} onChange={(e) => setNewTemplate({ ...newTemplate, subject: e.target.value })} />
                        </div>
                    </div>
                    <DialogFooter className="mt-6">
                        <Button variant="accent" className="w-full h-10 rounded-xl font-black uppercase text-[10px] tracking-widest shadow-glow" onClick={handleCreateTemplate}>Execute Init</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};
