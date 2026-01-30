import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
    CheckCircle2,
    Upload,
    Rocket,
    ShieldCheck,
    Zap,
    ArrowUpRight,
    Lock,
    Plus,
    Clock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { store } from "@/lib/store";
import OptimizedImage from "@/components/OptimizedImage";

const PublicOnboarding = () => {
    const { id } = useParams();
    const [step, setStep] = useState(1); // 1: Form, 2: Tasks, 3: Success
    const [formData, setFormData] = useState({ name: "", company: "", email: "" });
    const [tasks, setTasks] = useState([
        { id: 1, title: "Sign Master Service Agreement", completed: false, type: "Legal" },
        { id: 2, title: "Submit Brand Identity Assets", completed: false, type: "Assets" },
        { id: 3, title: "Configure Domain Records", completed: false, type: "Tech" },
        { id: 4, title: "Schedule Strategy Call", completed: false, type: "Meeting" },
    ]);

    const progress = (tasks.filter(t => t.completed).length / tasks.length) * 100;

    useEffect(() => {
        if (!id) return;
        const found = store.getClients().find(c => c.slug === id);
        if (found) {
            setFormData({ name: found.name, company: found.company || "", email: found.email });
            setTasks(found.tasks && found.tasks.length ? found.tasks : tasks);
            setStep(2);
        }
    }, [id]);

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name) return;
        toast.promise(new Promise(resolve => setTimeout(resolve, 1000)), {
            loading: 'Initializing Nexus...',
            success: () => {
                // Persist client locally and add a welcome transmission
                const clientObj = store.addClient({
                    name: formData.name,
                    email: formData.email,
                    company: formData.company,
                    tasks,
                    progress: (tasks.filter(t => t.completed).length / tasks.length) * 100,
                    status: "in_progress",
                    lastActivity: "Just now",
                });

                store.addTransmission({
                    client: clientObj.name,
                    template: "Welcome",
                    status: "sent"
                } as any);

                setStep(2);
                return 'Integration Established';
            },
            error: 'Link error',
        });
    };

    const toggleTask = (id: number) => {
        setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
    };

    return (
        <div className="min-h-screen bg-[#0b0c10] text-white selection:bg-accent/30 font-sans flex items-center justify-center p-4">
            {/* Ambient Background */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-5%] left-[-5%] w-[30%] h-[30%] bg-accent/5 rounded-full blur-[100px]" />
                <div className="absolute bottom-[-5%] right-[-5%] w-[30%] h-[30%] bg-blue-500/5 rounded-full blur-[100px]" />
            </div>

            <div className="relative w-full max-w-4xl">
                {/* Minimal Header */}
                <header className="flex items-center justify-between mb-8 px-2">
                    <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-accent p-1 shadow-glow shrink-0">
                            <OptimizedImage src="/assets/brand/logo.png" alt="O" className="w-full h-full object-contain" />
                        </div>
                        <span className="text-sm font-black tracking-tighter uppercase italic text-white/90">Onboardly <span className="text-accent underline decoration-accent/20">Nexus</span></span>
                    </div>
                    {step === 2 && (
                        <div className="flex items-center gap-4 bg-white/[0.02] border border-white/5 px-4 py-2 rounded-xl">
                            <div className="space-y-0.5 text-right">
                                <p className="text-[7px] font-black uppercase tracking-widest text-white/20 leading-none">Sync Vel.</p>
                                <p className="text-[10px] font-black text-accent italic leading-none">{Math.round(progress)}%</p>
                            </div>
                            <div className="w-24 h-1 bg-white/5 rounded-full overflow-hidden">
                                <div className="h-full bg-accent shadow-glow transition-all duration-1000 ease-out" style={{ width: `${progress}%` }} />
                            </div>
                        </div>
                    )}
                </header>

                <main>
                    {step === 1 ? (
                        <Card className="bg-[#1a1b23]/40 backdrop-blur-3xl border-white/5 rounded-[2rem] p-8 md:p-12 shadow-2xl animate-in zoom-in duration-500 max-w-xl mx-auto">
                            <div className="mb-8 space-y-2">
                                <h1 className="text-2xl font-black tracking-tight uppercase italic leading-none">Initialize Integration</h1>
                                <p className="text-[10px] text-white/30 font-black uppercase tracking-widest">Identify your entity to begin the sequence</p>
                            </div>

                            <form onSubmit={handleFormSubmit} className="space-y-6">
                                <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1.5">
                                            <Label className="text-[8px] uppercase font-black tracking-widest text-white/20 ml-1">Entity Name</Label>
                                            <Input required placeholder="Jane Smith" className="bg-white/5 border-white/5 rounded-xl h-10 text-xs focus:ring-accent/40" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                                        </div>
                                        <div className="space-y-1.5">
                                            <Label className="text-[8px] uppercase font-black tracking-widest text-white/20 ml-1">Organization</Label>
                                            <Input placeholder="Vortex Inc" className="bg-white/5 border-white/5 rounded-xl h-10 text-xs focus:ring-accent/40" value={formData.company} onChange={(e) => setFormData({ ...formData, company: e.target.value })} />
                                        </div>
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label className="text-[8px] uppercase font-black tracking-widest text-white/20 ml-1">Neural Address (Email)</Label>
                                        <Input required type="email" placeholder="jane@vortex.io" className="bg-white/5 border-white/5 rounded-xl h-10 text-xs focus:ring-accent/40" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                                    </div>
                                </div>

                                <Button variant="accent" className="w-full h-12 rounded-xl font-black uppercase text-[10px] tracking-[0.2em] shadow-glow group mt-4">
                                    Execute Sequence
                                    <Rocket className="w-4 h-4 ml-2 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                                </Button>

                                <div className="flex items-center justify-center gap-2 text-white/10 pt-2">
                                    <Lock className="w-3 h-3" />
                                    <span className="text-[8px] font-black uppercase tracking-widest">Terminal Point-to-Point Encryption Active</span>
                                </div>
                            </form>
                        </Card>
                    ) : (
                        <div className="grid lg:grid-cols-12 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
                            {/* Objectives Grid */}
                            <div className="lg:col-span-8 space-y-3">
                                <div className="flex items-center justify-between mb-4 px-2">
                                    <h2 className="text-[9px] font-black uppercase tracking-widest text-white/20">Operational Objectives</h2>
                                    <span className="text-[9px] font-black uppercase tracking-widest text-white/10 italic">ID: NXP-{Math.floor(Math.random() * 9000 + 1000)}</span>
                                </div>

                                {tasks.map((task) => (
                                    <div
                                        key={task.id}
                                        onClick={() => toggleTask(task.id)}
                                        className={`group relative p-4 bg-[#1a1b23]/40 backdrop-blur-3xl rounded-xl border border-white/5 transition-all cursor-pointer hover:border-accent/30 overflow-hidden ${task.completed ? 'opacity-30' : ''}`}
                                    >
                                        <div className="flex items-center justify-between gap-4">
                                            <div className="flex items-center gap-4">
                                                <div className={`w-9 h-9 rounded-lg border flex items-center justify-center transition-all ${task.completed ? 'border-success bg-success/10' : 'border-white/5 bg-white/5 group-hover:bg-accent/10'
                                                    }`}>
                                                    {task.completed ? <CheckCircle2 className="w-5 h-5 text-success" /> : <ShieldCheck className="w-5 h-5 text-accent/60" />}
                                                </div>
                                                <div>
                                                    <h3 className={`text-[11px] font-bold transition-all ${task.completed ? 'line-through text-white/40' : 'text-white'}`}>{task.title}</h3>
                                                    <p className="text-[8px] font-black uppercase tracking-widest text-white/20 mt-0.5 italic">{task.type} Analysis Required</p>
                                                </div>
                                            </div>
                                            <ArrowUpRight className={`w-4 h-4 transition-all ${task.completed ? 'opacity-0' : 'opacity-10 group-hover:opacity-100 group-hover:text-accent group-hover:translate-x-0.5 group-hover:-translate-y-0.5'}`} />
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Control Sidebar */}
                            <div className="lg:col-span-4 space-y-4">
                                <div className="p-6 bg-[#1a1b23]/40 backdrop-blur-3xl border border-white/10 rounded-2xl shadow-2xl relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 w-24 h-24 bg-orange-500/5 blur-2xl rounded-full" />
                                    <h4 className="text-[9px] font-black uppercase tracking-widest text-white/40 mb-5 flex items-center gap-2">
                                        <Upload className="w-3.5 h-3.5" />
                                        Asset Payload
                                    </h4>
                                    <div className="aspect-square rounded-xl border border-dashed border-white/10 flex flex-col items-center justify-center gap-3 hover:border-accent/40 hover:bg-accent/[0.02] transition-all cursor-pointer group/upload">
                                        <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center group-hover/upload:bg-accent transition-all">
                                            <Plus className="w-3.5 h-3.5 text-white/10 group-hover/upload:text-white" />
                                        </div>
                                        <p className="text-[8px] font-black uppercase tracking-widest text-white/10 group-hover/upload:text-white text-center px-4">Upload ZIP / Assets</p>
                                    </div>
                                    <div className="mt-6 pt-5 border-t border-white/5 flex items-center justify-between">
                                        <div className="flex items-center gap-1.5 px-2 py-0.5 bg-white/5 rounded-md border border-white/5">
                                            <Clock className="w-2.5 h-2.5 text-accent animate-pulse" />
                                            <span className="text-[7px] font-black uppercase tracking-widest text-accent">Active Sync</span>
                                        </div>
                                        <Button variant="ghost" className="h-6 px-2 rounded-md text-[7px] font-black uppercase tracking-widest text-white/20 hover:text-white">Support</Button>
                                    </div>
                                </div>

                                <div className="p-5 bg-accent/5 border border-accent/10 rounded-2xl relative overflow-hidden">
                                    <Zap className="absolute -right-2 top-0 w-16 h-16 text-accent/5 rotate-12" />
                                    <h5 className="text-[9px] font-black uppercase tracking-widest text-accent mb-2">Live Assistance</h5>
                                    <p className="text-[10px] text-white/30 font-medium leading-relaxed italic">Your account nexus lead is currently on standby for real-time mission support.</p>
                                </div>
                            </div>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default PublicOnboarding;
