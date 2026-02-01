import React, { useState, useMemo, useEffect } from "react";
import { FixedSizeList } from 'react-window';
import { Search, Plus, User, Trash2, ChevronRight, ChevronDown, Check, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

interface TasksViewProps {
    isAddDialogOpen: boolean;
    setIsAddDialogOpen: (open: boolean) => void;
    clients: any[];
}

import useDebounce from "@/hooks/use-debounce";

export const TasksView = React.memo(function TasksView({ isAddDialogOpen, setIsAddDialogOpen, clients }: TasksViewProps) {

    const tasks = useMemo(() => {
        return clients.flatMap(client =>
            (client.tasks || []).map((task: any) => ({
                ...task,
                clientName: client.name,
                clientId: client.id,
                client: client.name // alias for compatibility
            }))
        );
    }, [clients]);

    const [searchQuery, setSearchQuery] = useState("");
    const [expandedTaskId, setExpandedTaskId] = useState<number | string | null>(null);
    const [newTask, setNewTask] = useState({ title: "", client: "", priority: "med", due: "Asap" });

    const debouncedQuery = useDebounce(searchQuery, 250);

    const filteredTasks = useMemo(() => tasks.filter(t =>
        t.title.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
        t.clientName.toLowerCase().includes(debouncedQuery.toLowerCase())
    ), [tasks, debouncedQuery]);

    const toggleTask = async (clientId: string, taskId: number | string, completed: boolean) => {
        const { doc, getDoc, updateDoc } = await import("firebase/firestore");
        const { db } = await import("@/lib/firebase");

        const clientRef = doc(db, "clients", clientId);
        const clientSnap = await getDoc(clientRef);
        if (clientSnap.exists()) {
            const clientData = clientSnap.data();
            const newTasks = clientData.tasks.map((t: any) =>
                t.id === taskId ? { ...t, completed: !completed } : t
            );
            const progress = (newTasks.filter((t: any) => t.completed).length / newTasks.length) * 100;
            await updateDoc(clientRef, { tasks: newTasks, progress });
            toast.success("Task status updated");
        }
    };

    const handleAddTask = async () => {
        if (!newTask.title || !newTask.client) return;
        const { doc, getDoc, updateDoc } = await import("firebase/firestore");
        const { db } = await import("@/lib/firebase");

        const clientRef = doc(db, "clients", newTask.client);
        const clientSnap = await getDoc(clientRef);
        if (clientSnap.exists()) {
            const clientData = clientSnap.data();
            const taskObj = {
                id: Date.now(),
                title: newTask.title,
                priority: newTask.priority,
                due: newTask.due,
                completed: false,
                description: "New operational objective."
            };
            const newTasks = [...(clientData.tasks || []), taskObj];
            const progress = (newTasks.filter((t: any) => t.completed).length / newTasks.length) * 100;
            await updateDoc(clientRef, { tasks: newTasks, progress });
            setIsAddDialogOpen(false);
            setNewTask({ title: "", client: "", priority: "med", due: "Asap" });
            toast.success("Objective Manifested");
        }
    };

    const handleDeleteTask = async (clientId: string, taskId: number | string) => {
        const { doc, getDoc, updateDoc } = await import("firebase/firestore");
        const { db } = await import("@/lib/firebase");

        const clientRef = doc(db, "clients", clientId);
        const clientSnap = await getDoc(clientRef);
        if (clientSnap.exists()) {
            const clientData = clientSnap.data();
            const newTasks = clientData.tasks.filter((t: any) => t.id !== taskId);
            const progress = newTasks.length > 0 ? (newTasks.filter((t: any) => t.completed).length / newTasks.length) * 100 : 0;
            await updateDoc(clientRef, { tasks: newTasks, progress });
            toast.success("Objective Archived");
        }
    };

    // replaced by debounced + memoized filteredTasks earlier
    // kept for safety if other code references it
    // const filteredTasks = tasks.filter(t =>
    //     t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    //     t.client.toLowerCase().includes(searchQuery.toLowerCase())
    // );

    const getPriorityColor = (p: string) => {
        switch (p) {
            case 'crit': return 'text-accent shadow-[0_0_10px_rgba(255,107,74,0.3)]';
            case 'high': return 'text-orange-500';
            case 'med': return 'text-blue-400';
            default: return 'text-white/20';
        }
    }

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-700">
            {/* Header / Search Controls */}
            <div className="bg-[#1a1b23]/40 backdrop-blur-3xl rounded-xl border border-white/5 p-3 flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div className="relative flex-1 max-w-sm group">
                    <Search className="w-3 h-3 absolute left-3.5 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-accent" />
                    <input
                        placeholder="Scan Mission Objectives..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9 h-9 w-full bg-white/[0.03] border-white/5 rounded-lg text-[11px] text-white focus:outline-none focus:ring-1 focus:ring-accent/40 placeholder:text-white/10"
                    />
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        variant="accent"
                        size="sm"
                        onClick={() => setIsAddDialogOpen(true)}
                        className="h-8 rounded-lg px-4 font-black uppercase text-[10px] tracking-widest shadow-glow"
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        Assign Objective
                    </Button>
                </div>
            </div>

            {/* Tasks List */}
            <div className="space-y-2">
                <div style={{ height: Math.min(480, tasks.length * 84) }}>
                    <FixedSizeList
                        height={Math.min(480, tasks.length * 84)}
                        itemCount={tasks.length}
                        itemSize={84}
                        width="100%"
                    >
                        {({ index, style }) => {
                            const task = filteredTasks[index];
                            return (
                                <div style={style} key={task.id} className={`group p-3 bg-[#1a1b23]/40 backdrop-blur-3xl rounded-xl border border-white/5 hover:border-accent/20 transition-all ${task.completed ? 'opacity-40' : ''}`}>
                                    <div className="flex items-center justify-between gap-4">
                                        <div className="flex items-center gap-3">
                                            <button
                                                onClick={() => toggleTask(task.clientId, task.id, task.completed)}
                                                className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${task.completed ? 'bg-success border-success text-black' : 'border-white/10 bg-white/5 hover:border-accent'}`}
                                            >
                                                {task.completed && <Check className="w-3 h-3" />}
                                            </button>
                                            <div className="min-w-0">
                                                <h3 className={`text-[11px] font-bold text-white transition-all ${task.completed ? 'line-through text-white/40' : ''}`}>{task.title}</h3>
                                                <div className="flex items-center gap-3 mt-0.5">
                                                    <div className="flex items-center gap-1">
                                                        <User className="w-2.5 h-2.5 text-white/20" />
                                                        <span className="text-[9px] font-black uppercase tracking-tighter text-white/30">{task.client}</span>
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        <Clock className="w-2.5 h-2.5 text-white/20" />
                                                        <span className="text-[9px] font-black uppercase tracking-tighter text-white/30">{task.due}</span>
                                                    </div>
                                                    <div className={`text-[8px] font-black uppercase tracking-[0.2em] ${getPriorityColor(task.priority)}`}>
                                                        {task.priority}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => setExpandedTaskId(expandedTaskId === task.id ? null : task.id)}
                                                className="h-7 w-7 p-0 rounded-md text-white/20 hover:text-white"
                                            >
                                                {expandedTaskId === task.id ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleDeleteTask(task.clientId, task.id)}
                                                className="h-7 w-7 p-0 rounded-md text-white/10 hover:text-red-400"
                                            >
                                                <Trash2 className="w-3.5 h-3.5" />
                                            </Button>
                                        </div>
                                    </div>

                                    {expandedTaskId === task.id && (
                                        <div className="mt-3 pt-3 border-t border-white/5 ml-8 animate-in slide-in-from-top-2 duration-300">
                                            <p className="text-[10px] text-white/40 leading-relaxed italic">
                                                {task.description}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            );
                        }}
                    </FixedSizeList>
                </div>
            </div>

            {/* Task Dialog */}
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogContent className="sm:max-w-[400px] bg-[#1a1b23] border-white/10 text-white rounded-2xl p-6 shadow-2xl backdrop-blur-3xl">
                    <DialogHeader className="mb-4">
                        <DialogTitle className="text-xl font-black tracking-tight uppercase italic">Objective Manifest</DialogTitle>
                        <DialogDescription className="text-white/40 text-[11px]">Define a new operational target for the client onboarding sequence.</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-2">
                        <div className="space-y-1.5">
                            <Label className="text-[9px] uppercase font-black tracking-widest text-white/20 ml-1">Mission Title</Label>
                            <Input placeholder="E.g. Provision Backend Node" className="bg-white/5 h-10 border-white/5 rounded-xl text-xs" value={newTask.title} onChange={(e) => setNewTask({ ...newTask, title: e.target.value })} />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <Label className="text-[9px] uppercase font-black tracking-widest text-white/20 ml-1">Assigned Partner</Label>
                                <Select value={newTask.client} onValueChange={(v) => setNewTask({ ...newTask, client: v })}>
                                    <SelectTrigger className="bg-white/5 border-white/5 h-10 rounded-xl text-xs text-white/60">
                                        <SelectValue placeholder="Nexus Node" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-[#1a1b23] border-white/5 text-white">
                                        {clients.map(client => (
                                            <SelectItem key={client.id} value={String(client.id)}>{client.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-[9px] uppercase font-black tracking-widest text-white/20 ml-1">Priority Matrix</Label>
                                <Select value={newTask.priority} onValueChange={(v) => setNewTask({ ...newTask, priority: v })}>
                                    <SelectTrigger className="bg-white/5 border-white/5 h-10 rounded-xl text-xs text-white/60">
                                        <SelectValue placeholder="Select Threat" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-[#1a1b23] border-white/5 text-white">
                                        <SelectItem value="crit">Critical</SelectItem>
                                        <SelectItem value="high">High</SelectItem>
                                        <SelectItem value="med">Medium</SelectItem>
                                        <SelectItem value="low">Low</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>
                    <DialogFooter className="mt-6">
                        <Button variant="accent" className="w-full h-10 rounded-xl font-black uppercase text-[10px] tracking-widest shadow-glow" onClick={handleAddTask}>
                            Initialize Objective
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
});
