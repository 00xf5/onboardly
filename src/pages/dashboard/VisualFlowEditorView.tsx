import React, { useState, useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Plus, Trash2, Edit, ArrowUp, ArrowDown } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

import { PageLoader } from '@/components/Loader';

const VisualFlowEditorView = ({ user }: { user: any }) => {
  const [flows, setFlows] = useState<any[]>([]);
  const [selectedFlow, setSelectedFlow] = useState<any | null>(null);
  const [isStepDialogOpen, setIsStepDialogOpen] = useState(false);
  const [editingStep, setEditingStep] = useState<any | null>(null);
  const [stepName, setStepName] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) return;

    const syncFlows = async () => {
      const { collection, query, where, onSnapshot } = await import("firebase/firestore");
      const { db } = await import("@/lib/firebase");

      const q = query(collection(db, "flows"), where("userId", "==", user.id));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const list = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
        setFlows(list);

        if (selectedFlow) {
          const updated = list.find(f => f.id === selectedFlow.id);
          if (updated) setSelectedFlow(updated);
        } else if (list.length > 0 && !selectedFlow) {
          setSelectedFlow(list[0]);
        }
        setLoading(false);
      }, (error) => {
        console.error("Firestore listener error:", error);
        setLoading(false);
      });
      return unsubscribe;
    };
    let unsubscribe: any;
    syncFlows().then(unsub => unsubscribe = unsub);
    return () => unsubscribe && unsubscribe();
  }, [selectedFlow?.id]);

  if (loading) return <PageLoader />;

  const handleSelectFlow = (flowId: string) => {
    const flow = flows.find(f => f.id === flowId);
    setSelectedFlow(flow || null);
  };

  const openAddStepDialog = () => {
    setEditingStep(null);
    setStepName('');
    setIsStepDialogOpen(true);
  };

  const openEditStepDialog = (step: any) => {
    setEditingStep(step);
    setStepName(step.name);
    setIsStepDialogOpen(true);
  };

  const handleSaveStep = async () => {
    if (!selectedFlow) return;
    const { doc, updateDoc } = await import("firebase/firestore");
    const { db } = await import("@/lib/firebase");

    let updatedSteps = [...(selectedFlow.steps || [])];
    if (editingStep) {
      updatedSteps = updatedSteps.map(s => s.id === editingStep.id ? { ...s, name: stepName } : s);
      toast.success('Step updated');
    } else {
      updatedSteps.push({
        id: `step-${Date.now()}`,
        name: stepName,
        type: 'checklist-item',
        content: '',
        enabled: true,
      });
      toast.success('Step added');
    }

    await updateDoc(doc(db, "flows", selectedFlow.id), { steps: updatedSteps });
    setIsStepDialogOpen(false);
  };

  const handleDeleteStep = async (stepId: string) => {
    if (!selectedFlow) return;
    const { doc, updateDoc } = await import("firebase/firestore");
    const { db } = await import("@/lib/firebase");

    const updatedSteps = (selectedFlow.steps || []).filter((s: any) => s.id !== stepId);
    await updateDoc(doc(db, "flows", selectedFlow.id), { steps: updatedSteps });
    toast.success('Step deleted');
  };

  const handleMoveStep = async (stepId: string, direction: 'up' | 'down') => {
    if (!selectedFlow) return;
    const { doc, updateDoc } = await import("firebase/firestore");
    const { db } = await import("@/lib/firebase");

    const steps = [...(selectedFlow.steps || [])];
    const index = steps.findIndex(s => s.id === stepId);
    if (index === -1) return;

    if (direction === 'up' && index > 0) {
      [steps[index], steps[index - 1]] = [steps[index - 1], steps[index]];
    } else if (direction === 'down' && index < steps.length - 1) {
      [steps[index], steps[index + 1]] = [steps[index + 1], steps[index]];
    } else {
      return;
    }

    await updateDoc(doc(db, "flows", selectedFlow.id), { steps });
    toast.success(`Step moved ${direction}`);
  };

  return (
    <>
      <div className="space-y-8 animate-in fade-in duration-500">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <h2 className="text-sm font-black text-foreground uppercase tracking-widest">Visual Sequence Architect</h2>
            <p className="text-[10px] text-muted-foreground/30 font-black uppercase tracking-[0.2em]">Designing operational logic flows</p>
          </div>
          <div className="w-full md:w-80">
            <Select value={selectedFlow?.id} onValueChange={handleSelectFlow}>
              <SelectTrigger className="bg-card/40 backdrop-blur-xl border-border h-11 rounded-xl shadow-sm">
                <SelectValue placeholder="Select a flow to edit..." />
              </SelectTrigger>
              <SelectContent className="bg-card border-border">
                {flows.map(flow => (
                  <SelectItem key={flow.id} value={flow.id} className="text-xs uppercase font-bold tracking-tight">{flow.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          <div className="md:col-span-4 lg:col-span-3 bg-card/95 dark:bg-card/40 backdrop-blur-xl p-6 rounded-2xl border border-border shadow-lg space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Logic Steps</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={openAddStepDialog}
                disabled={!selectedFlow}
                className="h-8 px-3 rounded-lg bg-accent/10 text-accent hover:bg-accent hover:text-white transition-all text-[9px] font-black uppercase tracking-widest"
              >
                <Plus className="w-3 h-3 mr-1.5" /> Append Step
              </Button>
            </div>

            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
              {(selectedFlow?.steps || []).map((step, idx) => (
                <div key={step.id} className="bg-muted/50 p-4 rounded-xl border border-border/5 flex flex-col gap-3 group hover:border-accent/30 transition-all duration-300">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <p className="text-[10px] font-black text-accent uppercase tracking-tighter">Phase {idx + 1}</p>
                      <p className="text-xs font-bold text-foreground/80">{step.name}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-end gap-1.5 pt-2 border-t border-border/10">
                    <Button variant="ghost" size="icon" className="h-7 w-7 rounded-lg text-muted-foreground/30 hover:text-foreground" onClick={() => handleMoveStep(step.id, 'up')}><ArrowUp className="w-3 h-3" /></Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7 rounded-lg text-muted-foreground/30 hover:text-foreground" onClick={() => handleMoveStep(step.id, 'down')}><ArrowDown className="w-3 h-3" /></Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7 rounded-lg text-muted-foreground/30 hover:text-foreground" onClick={() => openEditStepDialog(step)}><Edit className="w-3 h-3" /></Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7 rounded-lg text-muted-foreground/30 hover:text-red-500" onClick={() => handleDeleteStep(step.id)}><Trash2 className="w-3 h-3" /></Button>
                  </div>
                </div>
              ))}
              {!selectedFlow && (
                <div className="flex flex-col items-center justify-center py-12 text-center space-y-3">
                  <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center opacity-20">
                    <Plus className="w-6 h-6" />
                  </div>
                  <p className="text-[9px] text-muted-foreground/30 font-black uppercase tracking-widest">Blueprint Selection Required</p>
                </div>
              )}
            </div>
          </div>

          <div className="md:col-span-8 lg:col-span-9 bg-card/95 dark:bg-card/40 backdrop-blur-xl p-8 rounded-2xl border border-border shadow-lg relative overflow-hidden flex flex-col items-center justify-center min-h-[500px]">
            <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 blur-[120px] rounded-full -mr-32 -mt-32 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/5 blur-[120px] rounded-full -ml-32 -mb-32 pointer-events-none" />

            <div className="relative text-center space-y-4">
              <div className="w-20 h-20 rounded-3xl bg-muted flex items-center justify-center mx-auto shadow-sm">
                <Edit className="w-10 h-10 text-muted-foreground/10" />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-black text-foreground uppercase tracking-widest">Reality Synthesis</h3>
                <p className="text-[10px] text-muted-foreground/40 font-black uppercase tracking-[0.2em]">Visual representation will materialize here</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Dialog open={isStepDialogOpen} onOpenChange={setIsStepDialogOpen}>
        <DialogContent className="sm:max-w-[425px] bg-card border-border text-foreground rounded-2xl shadow-2xl backdrop-blur-3xl p-6">
          <DialogHeader className="mb-6">
            <DialogTitle className="text-xl font-black uppercase italic tracking-tight">{editingStep ? 'Modify Vector' : 'Append Logic'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mb-8">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/40 ml-1">Step Specification</Label>
              <Input id="name" value={stepName} onChange={(e) => setStepName(e.target.value)} className="bg-muted h-11 text-xs rounded-xl border-none shadow-inner" placeholder="Analyze Enterprise Requirements..." />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleSaveStep} className="w-full h-11 bg-accent text-white font-black uppercase text-[10px] tracking-widest rounded-xl shadow-glow">Authorize Logic Change</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default VisualFlowEditorView;
