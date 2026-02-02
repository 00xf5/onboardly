import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
    LayoutDashboard,
    Zap,
    PieChart,
    Workflow,
    Layers,
    Webhook,
    ShieldCheck,
    LogOut,
    Lock,
    Unlock,
    Settings,
    Database
} from "lucide-react";
import { toast } from "sonner";
import { PageLoader } from "@/components/Loader";

const AdminDashboard = () => {
    const [config, setConfig] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        // Authenticity Check
        const session = localStorage.getItem('onboardly_admin_session');
        if (!session) {
            navigate("/admin/login");
            return;
        }

        const fetchConfig = async () => {
            try {
                const { doc, getDoc, setDoc } = await import("firebase/firestore");
                const { db } = await import("@/lib/firebase");

                const configRef = doc(db, "system", "config");
                const snap = await getDoc(configRef);

                if (snap.exists()) {
                    setConfig(snap.data());
                } else {
                    // Create default config if none exists
                    const defaultConfig = {
                        modules: {
                            flows: { enabled: true, label: "Flows" },
                            visualEditor: { enabled: true, label: "Visual Flow Editor" },
                            flowTemplates: { enabled: true, label: "Flow Templates" },
                            insights: { enabled: true, label: "Insights" },
                            webhooks: { enabled: true, label: "Webhooks" }
                        },
                        lastUpdated: new Date().toISOString()
                    };
                    await setDoc(configRef, defaultConfig);
                    setConfig(defaultConfig);
                }
            } catch (error) {
                console.error("Failed to fetch system config:", error);
                toast.error("Cloud linkage failed");
            } finally {
                setLoading(false);
            }
        };

        fetchConfig();
    }, [navigate]);

    const handleToggle = async (moduleId: string) => {
        if (!config) return;

        const updatedConfig = {
            ...config,
            modules: {
                ...config.modules,
                [moduleId]: {
                    ...config.modules[moduleId],
                    enabled: !config.modules[moduleId].enabled
                }
            },
            lastUpdatedAt: new Date().toISOString()
        };

        setConfig(updatedConfig);
        setSaving(true);

        try {
            const { doc, setDoc } = await import("firebase/firestore");
            const { db } = await import("@/lib/firebase");
            await setDoc(doc(db, "system", "config"), updatedConfig);
            toast.success(`${updatedConfig.modules[moduleId].label} Logic State Synchronized`);
        } catch (error) {
            toast.error("Failed to persist logic state");
            // Revert state
            setConfig(config);
        } finally {
            setSaving(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('onboardly_admin_session');
        navigate("/admin/login");
        toast.info("Secure Session Terminated");
    };

    if (loading) return <PageLoader />;

    return (
        <div className="min-h-screen bg-[#050510] text-foreground p-6 md:p-12 selection:bg-accent/30 selection:text-white">
            <div className="max-w-6xl mx-auto space-y-12">
                {/* Header */}
                <header className="flex flex-col md:flex-row md:items-center justify-between gap-8 border-b border-border/10 pb-12 animate-in fade-in slide-in-from-top-4 duration-700">
                    <div className="space-y-3">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-accent p-2 shadow-glow flex items-center justify-center">
                                <ShieldCheck className="w-full h-full text-white" />
                            </div>
                            <div>
                                <h1 className="text-xl font-black uppercase tracking-tight italic">Nexus Master Control</h1>
                                <p className="text-[10px] text-muted-foreground/30 font-black uppercase tracking-[0.4em]">Global Operations Override Cabinet</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="px-4 py-2 bg-muted/30 rounded-xl border border-border/10">
                            <p className="text-[9px] font-black text-muted-foreground/40 uppercase tracking-widest mb-0.5">Core Matrix Status</p>
                            <p className="text-[11px] font-bold text-success flex items-center gap-2 uppercase">
                                <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
                                Operational
                            </p>
                        </div>
                        <Button
                            variant="ghost"
                            onClick={handleLogout}
                            className="h-12 w-12 rounded-xl border border-border/10 hover:bg-red-500/10 hover:text-red-500 hover:border-red-500/20 group transition-all"
                        >
                            <LogOut className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </Button>
                    </div>
                </header>

                {/* Overrides Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-1000">
                    <div className="lg:col-span-3 mb-4">
                        <h2 className="text-[10px] font-black text-muted-foreground/40 uppercase tracking-[0.5em] ml-1">Logic Module Constraints</h2>
                    </div>

                    {Object.entries(config.modules).map(([id, mod]: [string, any]) => (
                        <div
                            key={id}
                            className={`p-8 rounded-[2rem] border transition-all duration-500 group relative overflow-hidden ${mod.enabled
                                    ? 'bg-card/40 border-border/50 shadow-sm'
                                    : 'bg-red-500/5 border-red-500/20 shadow-none grayscale'
                                }`}
                        >
                            <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 blur-3xl rounded-full -mr-16 -mt-16 pointer-events-none" />

                            <div className="flex items-start justify-between mb-8 relative z-10">
                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${mod.enabled ? 'bg-accent/10 text-accent group-hover:bg-accent group-hover:text-white' : 'bg-red-500/10 text-red-500'
                                    }`}>
                                    {getModuleIcon(id)}
                                </div>
                                <Switch
                                    checked={mod.enabled}
                                    onCheckedChange={() => handleToggle(id)}
                                    disabled={saving}
                                    className="data-[state=checked]:bg-accent data-[state=unchecked]:bg-muted"
                                />
                            </div>

                            <div className="space-y-4 relative z-10">
                                <div>
                                    <h3 className="text-sm font-black text-foreground uppercase tracking-tight">{mod.label}</h3>
                                    <p className="text-[10px] text-muted-foreground/40 font-medium mt-1">Logic sequence constraints for all users</p>
                                </div>

                                <div className={`flex items-center gap-2 text-[9px] font-black uppercase tracking-widest ${mod.enabled ? 'text-success' : 'text-red-500'
                                    }`}>
                                    {mod.enabled ? <Unlock className="w-3 h-3" /> : <Lock className="w-3 h-3" />}
                                    {mod.enabled ? 'Protocol: Permitted' : 'Protocol: Terminated'}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* System Logs / Stats Placeholder */}
                <div className="bg-card/20 backdrop-blur-xl border border-border/5 rounded-[2.5rem] p-10 relative overflow-hidden">
                    <div className="flex items-center gap-4 mb-8">
                        <Database className="w-5 h-5 text-accent/40" />
                        <h2 className="text-[11px] font-black text-foreground uppercase tracking-[0.3em]">Operational Telemetry</h2>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {[
                            { label: 'Active Sessions', val: '1,284', grow: '+12%' },
                            { label: 'Relay Throughput', val: '8.4 GB', grow: 'Stable' },
                            { label: 'Sync Latency', val: '4ms', grow: 'Optimal' },
                            { label: 'Neural Up-time', val: '99.9%', grow: 'Nominal' }
                        ].map((stat, i) => (
                            <div key={i} className="space-y-2">
                                <p className="text-[9px] font-black text-muted-foreground/30 uppercase tracking-widest leading-none">{stat.label}</p>
                                <p className="text-xl font-bold tracking-tight">{stat.val}</p>
                                <p className="text-[8px] font-black text-accent uppercase tracking-tighter">{stat.grow}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

const getModuleIcon = (id: string) => {
    switch (id) {
        case 'flows': return <Workflow className="w-6 h-6" />;
        case 'visualEditor': return <Layers className="w-6 h-6" />;
        case 'flowTemplates': return <Zap className="w-6 h-6" />;
        case 'insights': return <PieChart className="w-6 h-6" />;
        case 'webhooks': return <Webhook className="w-6 h-6" />;
        default: return <Settings className="w-6 h-6" />;
    }
};

export default AdminDashboard;
