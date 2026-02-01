import React, { useState, useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Plus, Trash2, Edit, ArrowUp, ArrowDown } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

import { PageLoader } from '@/components/Loader';

const VisualFlowEditorView = () => {
  const [flows, setFlows] = useState<any[]>([]);
  const [selectedFlow, setSelectedFlow] = useState<any | null>(null);
  const [isStepDialogOpen, setIsStepDialogOpen] = useState(false);
  const [editingStep, setEditingStep] = useState<any | null>(null);
  const [stepName, setStepName] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const syncFlows = async () => {
      const { collection, onSnapshot } = await import("firebase/firestore");
      const { db } = await import("@/lib/firebase");
      const unsubscribe = onSnapshot(collection(db, "flows"), (snapshot) => {
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
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Visual Flow Editor</h2>
          <div className="w-64">
            <Select value={selectedFlow?.id} onValueChange={handleSelectFlow}>
              <SelectTrigger className="bg-white/5 border-white/10">
                <SelectValue placeholder="Select a flow to edit..." />
              </SelectTrigger>
              <SelectContent>
                {flows.map(flow => (
                  <SelectItem key={flow.id} value={flow.id}>{flow.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-1 bg-white/5 p-4 rounded-lg">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-white">Steps</h3>
              <Button variant="ghost" size="sm" onClick={openAddStepDialog} disabled={!selectedFlow}><Plus className="w-4 h-4 mr-2" /> Add Step</Button>
            </div>
            <div className="space-y-2">
              {(selectedFlow?.steps || []).map(step => (
                <div key={step.id} className="bg-white/10 p-3 rounded-lg flex justify-between items-center">
                  <p className="text-sm">{step.name}</p>
                  <div className="flex items-center space-x-1">
                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => handleMoveStep(step.id, 'up')}><ArrowUp className="w-3 h-3" /></Button>
                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => handleMoveStep(step.id, 'down')}><ArrowDown className="w-3 h-3" /></Button>
                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => openEditStepDialog(step)}><Edit className="w-3 h-3" /></Button>
                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => handleDeleteStep(step.id)}><Trash2 className="w-3 h-3" /></Button>
                  </div>
                </div>
              ))}
              {!selectedFlow && <p className="text-white/50 text-center py-8">Select a flow to see its steps.</p>}
            </div>
          </div>
          <div className="md:col-span-2 bg-white/5 p-4 rounded-lg">
            <h3 className="font-bold text-white mb-4">Live Preview</h3>
            <div className="h-96 flex items-center justify-center text-white/50">
              <p>Live preview of the selected step will appear here.</p>
            </div>
          </div>
        </div>
      </div>

      <Dialog open={isStepDialogOpen} onOpenChange={setIsStepDialogOpen}>
        <DialogContent className="sm:max-w-[425px] bg-[#1a1b23] border-white/5 text-white">
          <DialogHeader>
            <DialogTitle>{editingStep ? 'Edit Step' : 'Add New Step'}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input id="name" value={stepName} onChange={(e) => setStepName(e.target.value)} className="col-span-3 bg-white/5 border-white/10" />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" onClick={handleSaveStep}>Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default VisualFlowEditorView;
