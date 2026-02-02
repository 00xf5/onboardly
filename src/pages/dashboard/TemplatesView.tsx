import { useState, useEffect } from "react";
import { FileText, Plus, Trash2, Edit, Sparkles, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import { PageLoader } from "@/components/Loader";

export const TemplatesView = ({ user }: { user: any }) => {
    const [templates, setTemplates] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedTemplate, setSelectedTemplate] = useState<any | null>(null);
    const [newTemplateTitle, setNewTemplateTitle] = useState("");
    const [newTaskTitle, setNewTaskTitle] = useState("");
    const [isAIDialogOpen, setIsAIDialogOpen] = useState(false);
    const [aiUrl, setAiUrl] = useState("");
    const [aiDesc, setAiDesc] = useState("");
    const [isGenerating, setIsGenerating] = useState(false);
    const [isAddTemplateDialogOpen, setIsAddTemplateDialogOpen] = useState(false);

    const handleAIForge = async () => {
        if (!aiUrl) return;
        setIsGenerating(true);
        const tid = toast.loading("Forging AI Blueprint...");

        try {
            const response = await fetch("/api/generate-blueprint", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ url: aiUrl, description: aiDesc }),
            });

            const data = await response.json();
            if (!data.success) throw new Error(data.error);

            // Create new template with forged tasks
            const { collection, addDoc } = await import("firebase/firestore");
            const { db } = await import("@/lib/firebase");

            const newDoc = await addDoc(collection(db, "templates"), {
                title: `AI: ${aiUrl.replace(/https?:\/\//, '').split('/')[0]}`,
                userId: user.id,
                tasks: data.tasks.map((t: any, i: number) => ({ ...t, id: Date.now() + i })),
                createdAt: new Date().toISOString()
            });

            toast.success("Blueprint Forged by AI", { id: tid });
            setIsAIDialogOpen(false);
            setAiUrl("");
            setAiDesc("");
        } catch (error: any) {
            toast.error(error.message || "Forge failed", { id: tid });
        } finally {
            setIsGenerating(false);
        }
    };

    useEffect(() => {
        if (!user?.id) return;

        const syncTemplates = async () => {
            const { collection, query, where, onSnapshot } = await import("firebase/firestore");
            const { db } = await import("@/lib/firebase");
            const q = query(collection(db, "templates"), where("userId", "==", user.id));
            const unsubscribe = onSnapshot(q, (snapshot) => {
                const list = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
                setTemplates(list);
                if (list.length > 0 && !selectedTemplate) {
                    setSelectedTemplate(list[0]);
                }
                setLoading(false);
            }, (error) => {
                console.error("Firestore listener error:", error);
                setLoading(false);
            });
            return unsubscribe;
        };
        let unsubscribe: any;
        syncTemplates().then(unsub => unsubscribe = unsub);
        return () => unsubscribe && unsubscribe();
    }, []);

    if (loading) return <PageLoader />;

    const handleAddTemplate = async () => {
        if (!newTemplateTitle) return;
        const { collection, addDoc } = await import("firebase/firestore");
        const { db } = await import("@/lib/firebase");

        const newDoc = await addDoc(collection(db, "templates"), {
            title: newTemplateTitle,
            userId: user.id,
            tasks: [],
            createdAt: new Date().toISOString()
        });

        setIsAddTemplateDialogOpen(false);
        setNewTemplateTitle("");
        toast.success("Template created");
    };

    const handleUpdateTemplateTitle = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!selectedTemplate) return;
        const newTitle = e.target.value;
        setSelectedTemplate({ ...selectedTemplate, title: newTitle });

        const { doc, updateDoc } = await import("firebase/firestore");
        const { db } = await import("@/lib/firebase");
        await updateDoc(doc(db, "templates", selectedTemplate.id), { title: newTitle });
    };

    const handleAddTask = async () => {
        if (!selectedTemplate || !newTaskTitle) return;
        const { doc, updateDoc } = await import("firebase/firestore");
        const { db } = await import("@/lib/firebase");

        const newTask = { id: Date.now(), title: newTaskTitle };
        const updatedTasks = [...(selectedTemplate.tasks || []), newTask];

        await updateDoc(doc(db, "templates", selectedTemplate.id), { tasks: updatedTasks });
        setSelectedTemplate({ ...selectedTemplate, tasks: updatedTasks });
        setNewTaskTitle("");
    };

    const handleDeleteTask = async (taskId: number | string) => {
        if (!selectedTemplate) return;
        const { doc, updateDoc } = await import("firebase/firestore");
        const { db } = await import("@/lib/firebase");

        const updatedTasks = selectedTemplate.tasks?.filter((task: any) => task.id !== taskId);
        await updateDoc(doc(db, "templates", selectedTemplate.id), { tasks: updatedTasks });
        setSelectedTemplate({ ...selectedTemplate, tasks: updatedTasks });
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 h-full animate-in fade-in duration-500">
            <div className="md:col-span-1 bg-card/95 dark:bg-card/40 backdrop-blur-xl p-6 rounded-2xl border border-border flex flex-col shadow-lg">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-sm font-black text-foreground uppercase tracking-widest">Master Blueprints</h2>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-lg bg-orange-500/10 text-orange-500 hover:bg-orange-500 hover:text-white"
                            onClick={() => setIsAIDialogOpen(true)}
                        >
                            <Sparkles className="w-4 h-4" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-lg bg-accent/10 text-accent hover:bg-accent hover:text-white"
                            onClick={() => setIsAddTemplateDialogOpen(true)}
                        >
                            <Plus className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
                <div className="space-y-2 flex-1 overflow-y-auto">
                    {templates.map(template => (
                        <div
                            key={template.id}
                            className={`p-4 rounded-xl cursor-pointer transition-all duration-300 border ${selectedTemplate?.id === template.id ? 'bg-accent/10 border-accent/20 text-accent' : 'hover:bg-muted border-transparent text-muted-foreground/60'}`}
                            onClick={() => setSelectedTemplate(template)}
                        >
                            <h3 className="font-bold text-xs uppercase tracking-tight">{template.title}</h3>
                            <p className="text-[9px] font-black uppercase tracking-widest mt-1 opacity-50">{template.tasks?.length || 0} Sequences</p>
                        </div>
                    ))}
                </div>
            </div>

            <div className="md:col-span-3 bg-card/95 dark:bg-card/40 backdrop-blur-xl p-8 rounded-2xl border border-border shadow-lg">
                {selectedTemplate ? (
                    <div className="space-y-8">
                        <div className="border-b border-border pb-6">
                            <Input
                                className="text-2xl font-black bg-transparent border-none p-0 focus-visible:ring-0 text-foreground uppercase italic tracking-tight"
                                value={selectedTemplate.title}
                                onChange={handleUpdateTemplateTitle}
                            />
                            <p className="text-[10px] text-muted-foreground/40 font-black uppercase tracking-widest mt-2 italic">Refining Blueprint Configuration</p>
                        </div>

                        <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
                            {selectedTemplate.tasks?.map(task => (
                                <div key={task.id} className="flex items-center justify-between bg-muted/50 p-4 rounded-xl border border-border/5 group hover:border-accent/30 transition-all duration-300">
                                    <p className="text-xs font-bold text-foreground/80">{task.title}</p>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 rounded-lg text-muted-foreground/20 hover:text-red-500 hover:bg-red-500/10 transition-colors"
                                        onClick={() => handleDeleteTask(task.id)}
                                    >
                                        <Trash2 className="w-3.5 h-3.5" />
                                    </Button>
                                </div>
                            ))}
                        </div>

                        <div className="pt-6 border-t border-border flex items-center gap-3">
                            <Input
                                placeholder="Initialize new sequence step..."
                                value={newTaskTitle}
                                onChange={(e) => setNewTaskTitle(e.target.value)}
                                className="bg-muted h-11 text-xs rounded-xl border-none"
                            />
                            <Button onClick={handleAddTask} className="h-11 px-6 rounded-xl bg-accent text-white font-black uppercase text-[10px] tracking-widest shadow-glow">
                                Add Step
                            </Button>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
                        <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center">
                            <FileText className="w-8 h-8 text-muted-foreground/20" />
                        </div>
                        <p className="text-[10px] text-muted-foreground/30 font-black uppercase tracking-widest">Select a blueprint to begin sequence refinement</p>
                    </div>
                )}
            </div>

            <Dialog open={isAddTemplateDialogOpen} onOpenChange={setIsAddTemplateDialogOpen}>
                <DialogContent className="sm:max-w-[425px] bg-card border-border text-foreground rounded-2xl shadow-2xl backdrop-blur-3xl p-6">
                    <DialogHeader className="mb-6">
                        <DialogTitle className="text-xl font-black uppercase italic tracking-tight">Initialize Blueprint</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 mb-8">
                        <div className="space-y-2">
                            <Label htmlFor="name" className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/40 ml-1">Blueprint Title</Label>
                            <Input id="name" value={newTemplateTitle} onChange={(e) => setNewTemplateTitle(e.target.value)} className="bg-muted h-11 text-xs rounded-xl border-none" placeholder="e.g. Enterprise Fintech" />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button onClick={handleAddTemplate} className="w-full h-11 bg-accent text-white font-black uppercase text-[10px] tracking-widest rounded-xl shadow-glow">Create Master Registry</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog open={isAIDialogOpen} onOpenChange={setIsAIDialogOpen}>
                <DialogContent className="sm:max-w-[425px] bg-card border-border text-foreground rounded-2xl shadow-2xl backdrop-blur-3xl p-6">
                    <DialogHeader className="mb-6">
                        <DialogTitle className="text-xl font-black uppercase italic tracking-tight flex items-center gap-2">
                            <Sparkles className="w-5 h-5 text-orange-500" />
                            AI Blueprint Forge
                        </DialogTitle>
                        <DialogDescription className="text-[10px] text-muted-foreground/40 uppercase font-black tracking-widest">
                            Analyze external architecture to generate sequence logic
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 mb-8">
                        <div className="space-y-2">
                            <Label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/40 ml-1 flex items-center gap-2">
                                <Globe className="w-3 h-3" /> Target URL
                            </Label>
                            <Input
                                value={aiUrl}
                                onChange={(e) => setAiUrl(e.target.value)}
                                className="bg-muted h-11 text-xs rounded-xl border-none"
                                placeholder="https://your-product.com"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/40 ml-1">Contextual Parameters (Optional)</Label>
                            <Textarea
                                value={aiDesc}
                                onChange={(e) => setAiDesc(e.target.value)}
                                className="bg-muted min-h-[100px] text-xs rounded-xl border-none resize-none"
                                placeholder="Describe your product core value proposition..."
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            onClick={handleAIForge}
                            disabled={isGenerating || !aiUrl}
                            className="w-full h-12 bg-orange-500 hover:bg-orange-600 text-white font-black uppercase text-[10px] tracking-widest rounded-xl shadow-glow gap-2"
                        >
                            {isGenerating ? (
                                <span className="animate-pulse">Forging Sequence...</span>
                            ) : (
                                <>
                                    <Sparkles className="w-4 h-4" />
                                    Initialize AI Generation
                                </>
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};
