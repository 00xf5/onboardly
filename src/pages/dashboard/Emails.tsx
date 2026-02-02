import React, { useState, useEffect } from "react";
import { Mail, Send, Clock, Edit3, Trash2, Plus, ArrowUpRight, CheckCircle2, AlertCircle, Eye, Search, Filter } from "lucide-react";
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

import { PageLoader } from "@/components/Loader";

export const EmailsView = React.memo(({ user }: { user: any }) => {
    const [templates, setTemplates] = useState<any[]>([]);
    const [transmissions, setTransmissions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user?.id) return;

        const syncTemplates = async () => {
            const { collection, query, where, onSnapshot } = await import("firebase/firestore");
            const { db } = await import("@/lib/firebase");
            const q = query(collection(db, "email_templates"), where("userId", "==", user.id));
            const unsubscribe = onSnapshot(q, (snapshot) => {
                setTemplates(snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })));
            });
            return unsubscribe;
        };

        const syncTransmissions = async () => {
            const { collection, query, where, orderBy, onSnapshot, limit } = await import("firebase/firestore");
            const { db } = await import("@/lib/firebase");

            const q = query(
                collection(db, "transmissions"),
                where("userId", "==", user.id),
                orderBy("sentAt", "desc"),
                limit(20)
            );
            const unsubscribe = onSnapshot(q, (snapshot) => {
                const logs = snapshot.docs.map(doc => {
                    const data = doc.data();
                    // Simple formatting for the time
                    const date = data.sentAt ? new Date(data.sentAt) : new Date();
                    return {
                        id: doc.id,
                        client: data.client,
                        template: data.template,
                        status: data.status,
                        time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                    };
                });
                setTransmissions(logs);
                setLoading(false);
            }, (error) => {
                console.error("Firestore listener error:", error);
                setLoading(false);
            });
            return unsubscribe;
        };

        let unsubscribeTransmissions: any;
        let unsubscribeTemplates: any;
        syncTransmissions().then(unsub => unsubscribeTransmissions = unsub);
        syncTemplates().then(unsub => unsubscribeTemplates = unsub);

        return () => {
            if (unsubscribeTransmissions) unsubscribeTransmissions();
            if (unsubscribeTemplates) unsubscribeTemplates();
        };
    }, []);

    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [newTemplate, setNewTemplate] = useState({ name: "", subject: "" });

    if (loading) return <PageLoader />;


    const handleCreateTemplate = async () => {
        if (!newTemplate.name) return;
        const { collection, addDoc } = await import("firebase/firestore");
        const { db } = await import("@/lib/firebase");

        await addDoc(collection(db, "email_templates"), {
            ...newTemplate,
            userId: user.id,
            trigger: "Manual",
            openRate: "0%",
            status: "draft",
            createdAt: new Date().toISOString()
        });

        setIsAddDialogOpen(false);
        setNewTemplate({ name: "", subject: "" });
        toast.success("Relay Synced");
    };

    const handleDeleteTemplate = async (id: string) => {
        const { doc, deleteDoc } = await import("firebase/firestore");
        const { db } = await import("@/lib/firebase");
        await deleteDoc(doc(db, "email_templates", id));
        toast.success("Relay Deleted");
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-700">
            {/* 🔮 Header Segment */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-4">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center">
                        <Mail className="w-4 h-4 text-accent" />
                    </div>
                    <div>
                        <h2 className="text-sm font-black text-foreground uppercase tracking-tight">Transmission Relays</h2>
                        <p className="text-[9px] text-muted-foreground/30 font-black uppercase tracking-[0.2em] mt-0.5">Global automation protocols</p>
                    </div>
                </div>
                <Button
                    onClick={() => setIsAddDialogOpen(true)}
                    className="h-9 px-4 rounded-xl bg-accent text-white font-black uppercase text-[10px] tracking-widest shadow-glow hover:bg-accent/90 transition-all"
                >
                    <Plus className="w-4 h-4 mr-2" />
                    New Relay
                </Button>
            </div>

            <div className="grid lg:grid-cols-12 gap-6">
                {/* Templates Nexus */}
                <div className="lg:col-span-8 space-y-3">
                    {templates.map((template) => (
                        <div
                            key={template.id}
                            className="group flex items-center justify-between p-5 bg-card/95 dark:bg-card/40 backdrop-blur-xl rounded-2xl border border-border hover:border-accent/30 transition-all duration-300 gap-4 shadow-sm hover:shadow-md"
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl bg-muted border border-border/5 flex items-center justify-center group-hover:bg-accent/10 transition-colors">
                                    <Edit3 className="w-4 h-4 text-accent/60" />
                                </div>
                                <div className="space-y-0.5">
                                    <div className="flex items-center gap-2">
                                        <h3 className="text-xs font-black text-foreground uppercase tracking-tight">{template.name}</h3>
                                        <div className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
                                    </div>
                                    <p className="text-[10px] text-muted-foreground/60 font-medium italic break-all max-w-[300px] truncate leading-relaxed">"{template.subject}"</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-8">
                                <div className="text-right hidden sm:block">
                                    <p className="text-[8px] font-black uppercase tracking-widest text-muted-foreground/20 mb-0.5">Trigger</p>
                                    <p className="text-[10px] font-bold text-foreground/60">{template.trigger}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-[8px] font-black uppercase tracking-widest text-muted-foreground/20 mb-0.5">Open Rate</p>
                                    <p className="text-[11px] font-black text-accent italic tracking-tighter">{template.openRate}</p>
                                </div>
                                <div className="flex items-center gap-1 ml-2">
                                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-muted-foreground/30 hover:text-foreground" onClick={() => toast.info(`Viewing ${template.name}`)}>
                                        <Eye className="w-4 h-4" />
                                    </Button>
                                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-muted-foreground/20 hover:text-red-500 hover:bg-red-500/10" onClick={() => handleDeleteTemplate(template.id)}>
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Live Stream */}
                <div className="lg:col-span-4">
                    <div className="bg-card/95 dark:bg-card/40 backdrop-blur-xl rounded-2xl border border-border p-6 shadow-xl overflow-hidden relative min-h-[400px]">
                        <div className="flex items-center justify-between mb-8 pb-4 border-b border-border/10">
                            <span className="text-[10px] font-black uppercase tracking-widest text-foreground">Relay Telemetry</span>
                            <div className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
                                <span className="text-[9px] font-black uppercase tracking-widest text-success italic">Live Sync</span>
                            </div>
                        </div>
                        <div className="space-y-6">
                            {transmissions.map((log) => (
                                <div key={log.id} className="relative pl-5 border-l-2 border-border/10">
                                    <div className={`absolute left-[-5px] top-1 w-2 h-2 rounded-full border-2 border-card ${log.status === 'opened' ? 'bg-success shadow-[0_0_10px_rgba(34,197,94,0.3)]' :
                                        log.status === 'bounced' ? 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.3)]' : 'bg-blue-400 shadow-[0_0_10px_rgba(96,165,250,0.3)]'
                                        }`} />
                                    <div className="flex items-center justify-between">
                                        <p className="text-[11px] font-black text-foreground leading-none uppercase tracking-tight">{log.client}</p>
                                        <span className="text-[9px] font-black text-muted-foreground/30 uppercase tracking-tighter">{log.time}</span>
                                    </div>
                                    <p className="text-[9px] text-muted-foreground/40 font-bold uppercase tracking-widest mt-1.5 italic">{log.template}</p>
                                </div>
                            ))}
                        </div>
                        <Button variant="ghost" className="w-full mt-8 h-10 text-[9px] font-black uppercase tracking-widest text-muted-foreground/40 hover:text-foreground border border-dashed border-border/20 rounded-xl transition-all">
                            Archive Manifest
                        </Button>
                    </div>
                </div>
            </div>

            {/* Template Dialog */}
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogContent className="sm:max-w-[400px] bg-card border-border text-foreground rounded-2xl p-8 shadow-2xl backdrop-blur-3xl">
                    <DialogHeader className="mb-6">
                        <DialogTitle className="text-xl font-black uppercase italic tracking-tight">Sync New Relay</DialogTitle>
                        <DialogDescription className="text-muted-foreground/40 text-xs mt-1">Initialize an automated transmission pattern.</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-5">
                        <div className="space-y-2">
                            <Label className="text-[10px] uppercase font-black tracking-widest text-muted-foreground/40 ml-1">Relay Signature</Label>
                            <Input placeholder="E.g. Protocol: ALPHA-7" className="bg-muted h-11 border-none rounded-xl text-xs" value={newTemplate.name} onChange={(e) => setNewTemplate({ ...newTemplate, name: e.target.value })} />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-[10px] uppercase font-black tracking-widest text-muted-foreground/40 ml-1">Payload Subject</Label>
                            <Input placeholder="Welcome Sequence: {{node_id}}" className="bg-muted h-11 border-none rounded-xl text-xs" value={newTemplate.subject} onChange={(e) => setNewTemplate({ ...newTemplate, subject: e.target.value })} />
                        </div>
                    </div>
                    <DialogFooter className="mt-8">
                        <Button className="w-full h-11 bg-accent text-white font-black uppercase text-[10px] tracking-widest rounded-xl shadow-glow" onClick={handleCreateTemplate}>Execute Initialization</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
});
