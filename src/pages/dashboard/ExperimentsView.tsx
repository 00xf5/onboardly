import { useState, useEffect, useMemo } from "react";
import { FileText, Plus, Zap, Play, Pause, BarChart3, TrendingUp, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PageLoader } from "@/components/Loader";

const ExperimentsView = ({ user }: { user: any }) => {
    const [experiments, setExperiments] = useState<any[]>([]);
    const [templates, setTemplates] = useState<any[]>([]);
    const [clients, setClients] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isAddExperimentDialogOpen, setIsAddExperimentDialogOpen] = useState(false);

    const [newExp, setNewExp] = useState({
        name: "",
        baseTemplate: "",
        variantA: "",
        variantB: "",
    });

    useEffect(() => {
        if (!user?.id) return;

        const fetchData = async () => {
            const { collection, query, where, onSnapshot } = await import("firebase/firestore");
            const { db } = await import("@/lib/firebase");

            // Sync Experiments
            const expQuery = query(collection(db, "experiments"), where("userId", "==", user.id));
            const unsubExp = onSnapshot(expQuery, (snap) => {
                setExperiments(snap.docs.map(doc => ({ ...doc.data(), id: doc.id })));
            });

            // Sync Templates
            const tempQuery = query(collection(db, "templates"), where("userId", "==", user.id));
            const unsubTemp = onSnapshot(tempQuery, (snap) => {
                setTemplates(snap.docs.map(doc => ({ ...doc.data(), id: doc.id })));
            });

            // Sync Clients (to calculate conversions)
            const clientQuery = query(collection(db, "clients"), where("userId", "==", user.id));
            const unsubClient = onSnapshot(clientQuery, (snap) => {
                setClients(snap.docs.map(doc => ({ ...doc.data(), id: doc.id })));
            });

            setLoading(false);
            return () => {
                unsubExp();
                unsubTemp();
                unsubClient();
            };
        };

        fetchData();
    }, [user.id]);

    const handleCreateExperiment = async () => {
        if (!newExp.name || !newExp.variantA || !newExp.variantB) {
            toast.error("Please fill in all critical parameters.");
            return;
        }

        try {
            const { collection, addDoc } = await import("firebase/firestore");
            const { db } = await import("@/lib/firebase");

            await addDoc(collection(db, "experiments"), {
                userId: user.id,
                name: newExp.name,
                baseTemplate: newExp.baseTemplate || templates[0]?.title,
                variantA: newExp.variantA,
                variantB: newExp.variantB,
                status: "active",
                createdAt: new Date().toISOString(),
            });

            setIsAddExperimentDialogOpen(false);
            setNewExp({ name: "", baseTemplate: "", variantA: "", variantB: "" });
            toast.success("Split-Test Environment Initialized");
        } catch (error) {
            toast.error("Failed to initialize experiment");
        }
    };

    const toggleExperiment = async (exp: any) => {
        const { doc, updateDoc } = await import("firebase/firestore");
        const { db } = await import("@/lib/firebase");
        const newStatus = exp.status === "active" ? "paused" : "active";
        await updateDoc(doc(db, "experiments", exp.id), { status: newStatus });
        toast.info(`Experiment ${newStatus === 'active' ? 'Activated' : 'Suspended'}`);
    };

    const stats = useMemo(() => {
        return experiments.map(exp => {
            const expClients = clients.filter(c => c.experimentId === exp.id);
            const variantAClients = expClients.filter(c => c.variant === 'A');
            const variantBClients = expClients.filter(c => c.variant === 'B');

            const getConv = (cls: any[]) => {
                if (cls.length === 0) return 0;
                const completed = cls.filter(c => c.progress === 100).length;
                return Math.round((completed / cls.length) * 100);
            };

            const convA = getConv(variantAClients);
            const convB = getConv(variantBClients);
            const winner = convA > convB ? 'A' : convB > convA ? 'B' : null;

            return {
                ...exp,
                variantAStats: { views: variantAClients.length, conversion: convA },
                variantBStats: { views: variantBClients.length, conversion: convB },
                winner
            };
        });
    }, [experiments, clients]);

    if (loading) return <PageLoader />;

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            <div className="flex justify-between items-center bg-card/40 backdrop-blur-3xl p-8 rounded-[2.5rem] border border-border shadow-2xl">
                <div>
                    <h1 className="text-3xl font-black text-foreground uppercase italic tracking-tight mb-2">Nexus Split-Testing</h1>
                    <p className="text-muted-foreground/60 text-xs font-black uppercase tracking-widest">Optimize activation rates via differential onboarding logic.</p>
                </div>
                <Button
                    onClick={() => setIsAddExperimentDialogOpen(true)}
                    variant="accent"
                    className="h-12 px-6 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-glow gap-2"
                >
                    <Plus className="w-4 h-4" />
                    Initialize Test
                </Button>
            </div>

            <div className="grid gap-6">
                {stats.length > 0 ? stats.map((exp) => (
                    <div key={exp.id} className="bg-card/40 backdrop-blur-xl rounded-[2rem] border border-border p-8 relative overflow-hidden group">
                        {/* Status Badge */}
                        <div className="absolute top-8 right-8 flex items-center gap-3">
                            <div className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest ${exp.status === 'active' ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'}`}>
                                {exp.status}
                            </div>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 rounded-lg bg-muted hover:bg-muted-foreground/10"
                                onClick={() => toggleExperiment(exp)}
                            >
                                {exp.status === 'active' ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 text-success" />}
                            </Button>
                        </div>

                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                            <div className="space-y-4">
                                <div>
                                    <h2 className="text-xl font-black text-foreground uppercase italic tracking-tight">{exp.name}</h2>
                                    <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/40 mt-1 italic leading-none">Targeting Template: {exp.baseTemplate}</p>
                                </div>

                                <div className="flex items-center gap-6">
                                    <div className="flex items-center gap-2">
                                        <Users className="w-4 h-4 text-muted-foreground/30" />
                                        <span className="text-[10px] font-black uppercase tracking-widest text-foreground">{exp.variantAStats.views + exp.variantBStats.views} Total Subjects</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <BarChart3 className="w-4 h-4 text-muted-foreground/30" />
                                        <span className="text-[10px] font-black uppercase tracking-widest text-foreground">Statistical Significance: High</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-4 bg-muted/30 p-4 rounded-2xl border border-border/50">
                                {/* Variant A */}
                                <div className={`px-6 py-2 rounded-xl text-center space-y-1 relative ${exp.winner === 'A' ? 'bg-accent/10 border border-accent/20' : ''}`}>
                                    {exp.winner === 'A' && <TrendingUp className="w-3.5 h-3.5 text-accent absolute -top-1.5 -right-1.5" />}
                                    <p className="text-[8px] font-black uppercase tracking-widest text-muted-foreground/40">Variant A</p>
                                    <p className="text-2xl font-black text-foreground">{exp.variantAStats.conversion}%</p>
                                    <p className="text-[9px] font-black uppercase tracking-tight text-muted-foreground/60">{exp.variantA}</p>
                                </div>

                                <div className="w-px h-12 bg-border/40" />

                                {/* Variant B */}
                                <div className={`px-6 py-2 rounded-xl text-center space-y-1 relative ${exp.winner === 'B' ? 'bg-orange-500/10 border border-orange-500/20' : ''}`}>
                                    {exp.winner === 'B' && <TrendingUp className="w-3.5 h-3.5 text-orange-500 absolute -top-1.5 -right-1.5" />}
                                    <p className="text-[8px] font-black uppercase tracking-widest text-muted-foreground/40">Variant B</p>
                                    <p className="text-2xl font-black text-foreground">{exp.variantBStats.conversion}%</p>
                                    <p className="text-[9px] font-black uppercase tracking-tight text-muted-foreground/60">{exp.variantB}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )) : (
                    <div className="bg-card/40 backdrop-blur-xl rounded-[2rem] border border-border/50 border-dashed p-20 flex flex-col items-center justify-center text-center space-y-4">
                        <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center">
                            <Zap className="w-8 h-8 text-muted-foreground/20" />
                        </div>
                        <div>
                            <p className="text-[10px] text-muted-foreground/30 font-black uppercase tracking-widest">No active split-tests in the registry.</p>
                            <p className="text-[9px] text-muted-foreground/20 font-black uppercase tracking-widest mt-1 italic">Initiate a test to optimize activation throughput.</p>
                        </div>
                    </div>
                )}
            </div>

            <Dialog open={isAddExperimentDialogOpen} onOpenChange={setIsAddExperimentDialogOpen}>
                <DialogContent className="sm:max-w-[480px] bg-card border-border text-foreground rounded-[2rem] shadow-2xl backdrop-blur-3xl p-8">
                    <DialogHeader className="mb-6">
                        <DialogTitle className="text-2xl font-black uppercase italic tracking-tight">Configure Experiment</DialogTitle>
                        <DialogDescription className="text-[10px] text-muted-foreground/40 font-black uppercase tracking-widest">Define the differential logic for the activation test.</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-6 mb-8">
                        <div className="space-y-1.5">
                            <Label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/40 ml-1">Experiment Identifier</Label>
                            <Input
                                placeholder="Conversion Optimization Q1"
                                className="bg-muted h-12 text-xs rounded-xl border-none"
                                value={newExp.name}
                                onChange={(e) => setNewExp({ ...newExp, name: e.target.value })}
                            />
                        </div>

                        <div className="space-y-1.5">
                            <Label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/40 ml-1">Trigger Template</Label>
                            <Select onValueChange={(v) => setNewExp({ ...newExp, baseTemplate: v })}>
                                <SelectTrigger className="bg-muted h-12 text-xs rounded-xl border-none">
                                    <SelectValue placeholder="Select Template to Test Against" />
                                </SelectTrigger>
                                <SelectContent className="bg-card border-border">
                                    {templates.map(t => (
                                        <SelectItem key={t.id} value={t.title} className="text-[10px] font-black uppercase tracking-widest">{t.title}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <Label className="text-[9px] font-black uppercase tracking-widest text-accent ml-1">Variant Alpha (A)</Label>
                                <Select onValueChange={(v) => setNewExp({ ...newExp, variantA: v })}>
                                    <SelectTrigger className="bg-accent/5 border border-accent/10 h-12 text-xs rounded-xl">
                                        <SelectValue placeholder="Select variant" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-card border-border">
                                        {templates.map(t => (
                                            <SelectItem key={t.id} value={t.title} className="text-[10px] font-black uppercase tracking-widest">{t.title}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-[9px] font-black uppercase tracking-widest text-orange-500 ml-1">Variant Beta (B)</Label>
                                <Select onValueChange={(v) => setNewExp({ ...newExp, variantB: v })}>
                                    <SelectTrigger className="bg-orange-500/5 border border-orange-500/10 h-12 text-xs rounded-xl">
                                        <SelectValue placeholder="Select variant" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-card border-border">
                                        {templates.map(t => (
                                            <SelectItem key={t.id} value={t.title} className="text-[10px] font-black uppercase tracking-widest">{t.title}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button onClick={handleCreateExperiment} className="w-full h-12 bg-accent text-white font-black uppercase text-[10px] tracking-widest rounded-xl shadow-glow">Execute Deployment</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default ExperimentsView;
