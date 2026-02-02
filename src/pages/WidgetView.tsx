import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { CheckCircle2, ShieldCheck, Zap, Lock, Plus, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { PageLoader } from "@/components/Loader";

const WidgetView = () => {
    const { id } = useParams();
    const [loading, setLoading] = useState(true);
    const [tasks, setTasks] = useState<any[]>([]);
    const [clientData, setClientData] = useState<any>(null);

    useEffect(() => {
        if (!id) return;
        const fetchClient = async () => {
            const { collection, query, where, getDocs } = await import("firebase/firestore");
            const { db } = await import("@/lib/firebase");
            const q = query(collection(db, "clients"), where("slug", "==", id));
            const snap = await getDocs(q);

            if (!snap.empty) {
                const found = snap.docs[0].data();
                setClientData(found);
                setTasks(found.tasks || []);
            }
            setLoading(false);
        };
        fetchClient();
    }, [id]);

    const toggleTask = async (taskId: number) => {
        const targetTask = tasks.find(t => t.id === taskId);
        const newTasks = tasks.map(t => t.id === taskId ? { ...t, completed: !t.completed } : t);
        setTasks(newTasks);

        if (id) {
            const { collection, query, where, getDocs, updateDoc, doc, addDoc, getDoc } = await import("firebase/firestore");
            const { db } = await import("@/lib/firebase");
            const q = query(collection(db, "clients"), where("slug", "==", id));
            const snap = await getDocs(q);

            if (!snap.empty) {
                const clientDoc = snap.docs[0];
                const newProgress = (newTasks.filter(t => t.completed).length / newTasks.length) * 100;

                await updateDoc(doc(db, "clients", clientDoc.id), {
                    tasks: newTasks,
                    progress: newProgress,
                    lastActionAt: new Date().toISOString()
                });

                if (clientData?.userId && !targetTask?.completed) {
                    const { triggerRelay } = await import("@/lib/relay");
                    const userDoc = await getDoc(doc(db, "users", clientData.userId));
                    const webhookUrl = userDoc.exists() ? userDoc.data().webhookUrl : null;

                    await triggerRelay({
                        event: 'task_completed',
                        userId: clientData.userId,
                        webhookUrl: webhookUrl,
                        payload: {
                            clientName: clientData.name,
                            taskTitle: targetTask.title,
                            progress: Math.round(newProgress)
                        }
                    });

                    // Trigger custom confetti event for parent window
                    window.parent.postMessage({ type: 'ONBOARDLY_TASK_COMPLETED', progress: newProgress }, '*');

                    if (Math.round(newProgress) === 100) {
                        try {
                            const { triggerSuccessBurst } = await import("@/lib/confetti");
                            triggerSuccessBurst();
                        } catch (ce) { }
                    }
                }
            }
        }
    };

    if (loading) return <PageLoader />;
    if (!clientData) return <div className="p-4 text-xs text-red-500 font-black uppercase tracking-widest">Unauthorized Nexus Access</div>;

    const progress = (tasks.filter(t => t.completed).length / tasks.length) * 100;

    return (
        <div className="h-screen bg-[#0b0c10] text-white p-4 font-sans overflow-y-auto custom-scrollbar">
            <header className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded bg-accent p-1 shadow-glow shrink-0">
                        <img src="/assets/brand/logo.png" alt="O" className="w-full h-full object-contain" />
                    </div>
                    <div>
                        <h1 className="text-[10px] font-black uppercase tracking-widest text-accent italic">Onboarding Sequence</h1>
                        <p className="text-[14px] font-bold text-white/90 truncate max-w-[150px]">{clientData.name}</p>
                    </div>
                </div>
                <div className="text-right">
                    <p className="text-[10px] font-black text-accent">{Math.round(progress)}%</p>
                    <div className="w-16 h-1 bg-white/5 rounded-full mt-1 overflow-hidden">
                        <div className="h-full bg-accent transition-all duration-700" style={{ width: `${progress}%` }} />
                    </div>
                </div>
            </header>

            <div className="space-y-2">
                {tasks.map((task) => (
                    <div
                        key={task.id}
                        onClick={() => toggleTask(task.id)}
                        className={`p-3 rounded-lg border border-white/5 bg-white/[0.02] cursor-pointer transition-all hover:border-accent/30 ${task.completed ? 'opacity-30' : ''}`}
                    >
                        <div className="flex items-center gap-3">
                            <div className={`w-6 h-6 rounded border flex items-center justify-center transition-all ${task.completed ? 'border-success bg-success/10' : 'border-white/5'}`}>
                                {task.completed && <CheckCircle2 className="w-3.5 h-3.5 text-success" />}
                            </div>
                            <span className={`text-[11px] font-bold leading-tight ${task.completed ? 'line-through text-white/20' : ''}`}>
                                {task.title}
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            <footer className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between opacity-20">
                <span className="text-[7px] font-black uppercase tracking-widest">Powered by Onboardly Nexus</span>
                <Lock className="w-2.5 h-2.5" />
            </footer>

            {Math.round(progress) === 100 && (
                <div className="absolute inset-0 bg-accent/95 flex flex-col items-center justify-center p-8 text-center animate-in fade-in zoom-in duration-500 z-50">
                    <div className="w-20 h-20 rounded-full bg-white/10 flex items-center justify-center mb-6 border border-white/20">
                        <Zap className="w-10 h-10 text-white animate-pulse" />
                    </div>
                    <h2 className="text-xl font-black uppercase italic tracking-tight mb-2">Activation Complete</h2>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60">Nexus Synchronization Successful</p>
                    <Button
                        variant="ghost"
                        className="mt-8 border border-white/20 h-10 px-8 rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-white hover:text-accent"
                        onClick={() => window.parent.postMessage({ type: 'ONBOARDLY_CLOSE' }, '*')}
                    >
                        Dismiss Overlay
                    </Button>
                </div>
            )}
        </div>
    );
};

export default WidgetView;
