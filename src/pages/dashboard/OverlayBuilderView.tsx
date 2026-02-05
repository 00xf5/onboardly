import { useState, useEffect } from "react";
import { Plus, Trash2, Edit, MousePointer2, Info, Zap, Sparkles, Layout, Crosshair } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PageLoader } from "@/components/Loader";

const OverlayBuilderView = ({ user }: { user: any }) => {
    const [overlays, setOverlays] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isAddOverlayDialogOpen, setIsAddOverlayDialogOpen] = useState(false);
    const [editingOverlay, setEditingOverlay] = useState<any | null>(null);

    const [newOverlay, setNewOverlay] = useState({
        name: "",
        type: "tooltip",
        selector: "",
        content: "",
        position: "top",
    });

    useEffect(() => {
        if (!user?.id) return;

        const syncOverlays = async () => {
            const { collection, query, where, onSnapshot } = await import("firebase/firestore");
            const { db } = await import("@/lib/firebase");

            const q = query(collection(db, "overlays"), where("userId", "==", user.id));
            const unsubscribe = onSnapshot(q, (snapshot) => {
                setOverlays(snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })));
                setLoading(false);
            }, (error) => {
                console.error("Firestore listener error:", error);
                setLoading(false);
            });
            return unsubscribe;
        };

        let unsubscribe: any;
        syncOverlays().then(unsub => unsubscribe = unsub);
        return () => unsubscribe && unsubscribe();
    }, [user.id]);

    const handleSaveOverlay = async () => {
        if (!newOverlay.name || !newOverlay.selector || !newOverlay.content) {
            toast.error("Please fill in all critical vector fields.");
            return;
        }

        try {
            const { collection, addDoc, doc, updateDoc } = await import("firebase/firestore");
            const { db } = await import("@/lib/firebase");

            if (editingOverlay) {
                await updateDoc(doc(db, "overlays", editingOverlay.id), {
                    ...newOverlay,
                    updatedAt: new Date().toISOString(),
                });
                toast.success("Overlay Vector Recalibrated");
            } else {
                await addDoc(collection(db, "overlays"), {
                    userId: user.id,
                    ...newOverlay,
                    status: "active",
                    createdAt: new Date().toISOString(),
                });
                toast.success("Visual Layer Deployed to Nexus");
            }

            setIsAddOverlayDialogOpen(false);
            setEditingOverlay(null);
            setNewOverlay({ name: "", type: "tooltip", selector: "", content: "", position: "top" });
        } catch (error) {
            toast.error("Deployment failed");
        }
    };

    const handleDeleteOverlay = async (id: string) => {
        const { doc, deleteDoc } = await import("firebase/firestore");
        const { db } = await import("@/lib/firebase");
        await deleteDoc(doc(db, "overlays", id));
        toast.success("Layer Dissolved");
    };

    if (loading) return <PageLoader />;

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            {/* Hero Header */}
            <div className="relative p-10 bg-card/40 backdrop-blur-3xl rounded-[2.5rem] border border-border shadow-2xl overflow-hidden group">
                <div className="absolute top-0 right-0 w-80 h-80 bg-accent/5 blur-[120px] rounded-full" />
                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="max-w-xl">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="p-2 bg-accent/10 rounded-lg">
                                <Sparkles className="w-5 h-5 text-accent" />
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-accent">No-Code Subsystem</span>
                        </div>
                        <h1 className="text-4xl font-black text-foreground uppercase italic tracking-tight mb-2">Visual UI Layers</h1>
                        <p className="text-muted-foreground/60 text-sm font-medium leading-relaxed">
                            "Paint" your onboarding logic directly onto your DOM. Deploy persistent tooltips, hotspots, and high-conversion modals without deploying a single line of backend code.
                        </p>
                    </div>
                    <Button
                        onClick={() => setIsAddOverlayDialogOpen(true)}
                        variant="accent"
                        className="h-14 px-8 rounded-2xl font-black uppercase text-xs tracking-widest shadow-glow gap-3 transition-all hover:scale-105"
                    >
                        <Plus className="w-5 h-5" />
                        Initialize New Layer
                    </Button>
                </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid lg:grid-cols-3 gap-8">
                {/* Active Layers List */}
                <div className="lg:col-span-2 space-y-4">
                    <div className="flex items-center justify-between px-2">
                        <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground">Active Operational Layers</h3>
                        <span className="text-[10px] font-black text-accent">{overlays.length} Signals Ready</span>
                    </div>

                    <div className="grid gap-4">
                        {overlays.length > 0 ? overlays.map((overlay) => (
                            <div key={overlay.id} className="bg-card/40 backdrop-blur-xl rounded-[2rem] border border-border p-6 hover:border-accent/30 transition-all duration-500 group relative overflow-hidden">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-5">
                                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${overlay.type === 'tooltip' ? 'bg-blue-500/10 text-blue-500' :
                                                overlay.type === 'hotspot' ? 'bg-accent/10 text-accent font-black animate-pulse' :
                                                    'bg-orange-500/10 text-orange-500'
                                            }`}>
                                            {overlay.type === 'tooltip' ? <Info className="w-6 h-6" /> :
                                                overlay.type === 'hotspot' ? <Crosshair className="w-6 h-6" /> :
                                                    <Layout className="w-6 h-6" />}
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-black text-foreground uppercase tracking-tight">{overlay.name}</h4>
                                            <div className="flex items-center gap-2 mt-1">
                                                <code className="text-[9px] font-mono py-0.5 px-2 bg-muted rounded-md text-accent">
                                                    {overlay.selector}
                                                </code>
                                                <span className="text-[8px] font-black uppercase tracking-widest text-muted-foreground/40 italic">
                                                    Targeted Selector
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-9 w-9 rounded-xl bg-muted hover:bg-accent hover:text-white"
                                            onClick={() => {
                                                setEditingOverlay(overlay);
                                                setNewOverlay(overlay);
                                                setIsAddOverlayDialogOpen(true);
                                            }}
                                        >
                                            <Edit className="w-4 h-4" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-9 w-9 rounded-xl bg-muted hover:bg-red-500 hover:text-white"
                                            onClick={() => handleDeleteOverlay(overlay.id)}
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                                <div className="mt-4 pt-4 border-t border-border/10">
                                    <p className="text-[11px] text-muted-foreground/60 italic leading-relaxed">
                                        "{overlay.content.substring(0, 100)}{overlay.content.length > 100 ? '...' : ''}"
                                    </p>
                                </div>
                            </div>
                        )) : (
                            <div className="bg-card/40 backdrop-blur-xl rounded-[2rem] border border-border/50 border-dashed p-20 flex flex-col items-center justify-center text-center space-y-4">
                                <div className="w-20 h-20 rounded-[2rem] bg-muted/30 flex items-center justify-center">
                                    <MousePointer2 className="w-10 h-10 text-muted-foreground/10" />
                                </div>
                                <div>
                                    <p className="text-xs font-black uppercase tracking-widest text-muted-foreground/30">No visual layers active.</p>
                                    <p className="text-[10px] text-muted-foreground/20 font-black uppercase tracking-widest mt-1 italic">Bridge the gap by initializing your first UI vector.</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Documentation / Intelligence Sidebar */}
                <div className="space-y-6">
                    <div className="bg-accent/5 border border-accent/10 p-8 rounded-[2.5rem] relative overflow-hidden group">
                        <Zap className="absolute -right-4 -top-4 w-24 h-24 text-accent/5 rotate-12 transition-transform duration-700 group-hover:scale-125" />
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-accent mb-4 flex items-center gap-2">
                            <Plus className="w-3.5 h-3.5" /> Direct Injection
                        </h4>
                        <p className="text-xs text-muted-foreground/60 leading-relaxed font-medium">
                            Once deployed, your Onboardly Widget script automatically scans the DOM for these selectors and injects the layers in real-time.
                        </p>
                        <ul className="mt-6 space-y-3">
                            <li className="flex items-start gap-3 text-[10px] font-black uppercase tracking-widest text-foreground/40">
                                <div className="w-1.5 h-1.5 rounded-full bg-accent mt-1" />
                                Zero Code Deployment
                            </li>
                            <li className="flex items-start gap-3 text-[10px] font-black uppercase tracking-widest text-foreground/40">
                                <div className="w-1.5 h-1.5 rounded-full bg-accent mt-1" />
                                Cross-Platform Sync
                            </li>
                            <li className="flex items-start gap-3 text-[10px] font-black uppercase tracking-widest text-foreground/40">
                                <div className="w-1.5 h-1.5 rounded-full bg-accent mt-1" />
                                Interactive Heatmaps
                            </li>
                        </ul>
                    </div>

                    <div className="bg-success/5 border border-success/10 p-8 rounded-[2.5rem]">
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-success mb-2 italic">Pro-Tip</h4>
                        <p className="text-[10px] text-muted-foreground/40 leading-relaxed">
                            Use descriptive IDs or classes as selectors (e.g. <code className="text-success">#signup-vibrant-cta</code>) for maximum targeting precision.
                        </p>
                    </div>
                </div>
            </div>

            {/* Create/Edit Overlay Dialog */}
            <Dialog open={isAddOverlayDialogOpen} onOpenChange={setIsAddOverlayDialogOpen}>
                <DialogContent className="sm:max-w-[500px] bg-card border-border text-foreground rounded-[2.5rem] shadow-2xl backdrop-blur-3xl p-8">
                    <DialogHeader className="mb-6">
                        <DialogTitle className="text-2xl font-black uppercase italic tracking-tight">Deploy Visual Layer</DialogTitle>
                        <DialogDescription className="text-[10px] text-muted-foreground/40 font-black uppercase tracking-widest">Logic refinement for the visual HUD.</DialogDescription>
                    </DialogHeader>

                    <div className="space-y-5 mb-8">
                        <div className="space-y-1.5">
                            <Label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/40 ml-1">Layer Designation</Label>
                            <Input
                                placeholder="Sign-up Tooltip Vector"
                                className="bg-muted h-12 text-xs rounded-xl border-none shadow-inner"
                                value={newOverlay.name}
                                onChange={(e) => setNewOverlay({ ...newOverlay, name: e.target.value })}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <Label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/40 ml-1">Vector Type</Label>
                                <Select value={newOverlay.type} onValueChange={(v) => setNewOverlay({ ...newOverlay, type: v })}>
                                    <SelectTrigger className="bg-muted h-12 text-xs rounded-xl border-none">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="bg-card border-border">
                                        <SelectItem value="tooltip" className="text-[10px] font-black uppercase tracking-widest">Precision Tooltip</SelectItem>
                                        <SelectItem value="hotspot" className="text-[10px] font-black uppercase tracking-widest">Pulsing Hotspot</SelectItem>
                                        <SelectItem value="modal" className="text-[10px] font-black uppercase tracking-widest">Full Nexus Modal</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/40 ml-1">Position Link</Label>
                                <Select value={newOverlay.position} onValueChange={(v) => setNewOverlay({ ...newOverlay, position: v })}>
                                    <SelectTrigger className="bg-muted h-12 text-xs rounded-xl border-none">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="bg-card border-border">
                                        <SelectItem value="top" className="text-[10px] font-black uppercase tracking-widest">Zenith (Top)</SelectItem>
                                        <SelectItem value="bottom" className="text-[10px] font-black uppercase tracking-widest">Nadir (Bottom)</SelectItem>
                                        <SelectItem value="left" className="text-[10px] font-black uppercase tracking-widest">Left Vector</SelectItem>
                                        <SelectItem value="right" className="text-[10px] font-black uppercase tracking-widest">Right Vector</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <Label className="text-[9px] font-black uppercase tracking-widest text-accent ml-1">CSS Selector (DOM Target)</Label>
                            <Input
                                placeholder="#submit-button or .feature-card"
                                className="bg-accent/5 border border-accent/10 h-12 text-xs rounded-xl font-mono"
                                value={newOverlay.selector}
                                onChange={(e) => setNewOverlay({ ...newOverlay, selector: e.target.value })}
                            />
                        </div>

                        <div className="space-y-1.5">
                            <Label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/40 ml-1">Payload Content (Markdown/Text)</Label>
                            <Input
                                placeholder="Click here to reach the 'Aha!' moment."
                                className="bg-muted h-12 text-xs rounded-xl border-none shadow-inner"
                                value={newOverlay.content}
                                onChange={(e) => setNewOverlay({ ...newOverlay, content: e.target.value })}
                            />
                        </div>
                    </div>

                    <DialogFooter>
                        <Button
                            onClick={handleSaveOverlay}
                            className="w-full h-14 bg-accent text-white font-black uppercase text-[10px] tracking-[0.2em] rounded-2xl shadow-glow gap-3"
                        >
                            Authorize Deployment
                            <Zap className="w-4 h-4" />
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default OverlayBuilderView;
