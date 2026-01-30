import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { store } from "@/lib/store";
import { Client, UserSegment } from "@/lib/store";

interface ClientManageDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  client: Client | null;
}

const ClientManageDialog: React.FC<ClientManageDialogProps> = ({
  open,
  onOpenChange,
  client
}) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    template: "",
    status: "pending" as string,
    segment: "new_user" as UserSegment,
  });

  useEffect(() => {
    if (client) {
      setFormData({
        name: client.name || "",
        email: client.email || "",
        company: client.company || "",
        template: client.template || "",
        status: client.status || "pending",
        segment: client.segment || "new_user",
      });
    }
  }, [client]);

  const handleSave = () => {
    if (!client || !formData.name || !formData.email) {
      toast.error("Name and email are required");
      return;
    }

    try {
      const updatedClient: Client = {
        ...client,
        name: formData.name,
        email: formData.email,
        company: formData.company,
        template: formData.template,
        status: formData.status,
        segment: formData.segment,
      };

      store.updateClient(updatedClient);
      toast.success("Client updated successfully");
      onOpenChange(false);
    } catch (error) {
      toast.error("Failed to update client");
    }
  };

  const handleDelete = () => {
    if (!client) return;
    
    if (confirm(`Are you sure you want to delete ${client.name}?`)) {
      try {
        const clients = store.getClients().filter(c => c.id !== client.id);
        store.saveClients(clients);
        window.dispatchEvent(new CustomEvent('onboardly:clients:updated'));
        toast.success("Client deleted successfully");
        onOpenChange(false);
      } catch (error) {
        toast.error("Failed to delete client");
      }
    }
  };

  if (!client) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px] bg-[#1a1b23] border-white/5 text-white rounded-[1.5rem] p-6 shadow-2xl backdrop-blur-3xl">
        <DialogHeader className="mb-6">
          <DialogTitle className="text-xl font-black tracking-tight">Manage Client</DialogTitle>
          <DialogDescription className="text-white/40 text-[11px]">
            Update client information and settings
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-[9px] uppercase font-black tracking-widest text-white/20 ml-1">
                Name
              </Label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="bg-white/5 h-10 text-xs rounded-xl border-white/5"
                placeholder="Client name"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-[9px] uppercase font-black tracking-widest text-white/20 ml-1">
                Email
              </Label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="bg-white/5 h-10 text-xs rounded-xl border-white/5"
                placeholder="email@example.com"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-[9px] uppercase font-black tracking-widest text-white/20 ml-1">
              Company
            </Label>
            <Input
              value={formData.company}
              onChange={(e) => setFormData({ ...formData, company: e.target.value })}
              className="bg-white/5 h-10 text-xs rounded-xl border-white/5"
              placeholder="Company name"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-[9px] uppercase font-black tracking-widest text-white/20 ml-1">
                Template
              </Label>
              <Select value={formData.template} onValueChange={(value) => setFormData({ ...formData, template: value })}>
                <SelectTrigger className="bg-white/5 h-10 text-xs rounded-xl border-white/5">
                  <SelectValue placeholder="Select template" />
                </SelectTrigger>
                <SelectContent className="bg-[#1a1b23] border-white/5">
                  {store.getTemplates().map((template) => (
                    <SelectItem key={template.id} value={template.title} className="text-xs">
                      {template.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-[9px] uppercase font-black tracking-widest text-white/20 ml-1">
                Status
              </Label>
              <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                <SelectTrigger className="bg-white/5 h-10 text-xs rounded-xl border-white/5">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent className="bg-[#1a1b23] border-white/5">
                  <SelectItem value="pending" className="text-xs">Pending</SelectItem>
                  <SelectItem value="in_progress" className="text-xs">In Progress</SelectItem>
                  <SelectItem value="completed" className="text-xs">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-[9px] uppercase font-black tracking-widest text-white/20 ml-1">
              User Segment
            </Label>
            <Select value={formData.segment} onValueChange={(value) => setFormData({ ...formData, segment: value as UserSegment })}>
              <SelectTrigger className="bg-white/5 h-10 text-xs rounded-xl border-white/5">
                <SelectValue placeholder="Select segment" />
              </SelectTrigger>
              <SelectContent className="bg-[#1a1b23] border-white/5">
                <SelectItem value="new_user" className="text-xs">New User</SelectItem>
                <SelectItem value="returning_inactive" className="text-xs">Returning Inactive</SelectItem>
                <SelectItem value="power_user" className="text-xs">Power User</SelectItem>
                <SelectItem value="churn_risk" className="text-xs">Churn Risk</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label className="text-[9px] uppercase font-black tracking-widest text-white/20 ml-1">
                Progress
              </Label>
              <span className="text-[9px] font-black text-accent">{client.progress}%</span>
            </div>
            <Progress value={client.progress} className="h-2 bg-white/10" />
          </div>

          {client.tasks && client.tasks.length > 0 && (
            <div className="space-y-2">
              <Label className="text-[9px] uppercase font-black tracking-widest text-white/20 ml-1">
                Tasks ({client.tasks.filter(t => t.completed).length}/{client.tasks.length})
              </Label>
              <div className="max-h-32 overflow-y-auto space-y-1">
                {client.tasks.map((task) => (
                  <div key={task.id} className="flex items-center gap-2 text-xs">
                    <div className={`w-2 h-2 rounded-full ${task.completed ? 'bg-success' : 'bg-white/20'}`} />
                    <span className="text-white/60">{task.title}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="mt-6 flex gap-2">
          <Button
            variant="ghost"
            onClick={handleDelete}
            className="bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 h-10 rounded-xl font-black uppercase text-[10px] tracking-widest"
          >
            Delete
          </Button>
          <div className="flex gap-2 ml-auto">
            <Button
              variant="ghost"
              onClick={() => onOpenChange(false)}
              className="bg-white/5 hover:bg-white/10 h-10 rounded-xl font-black uppercase text-[10px] tracking-widest"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              className="bg-accent hover:bg-accent/90 h-10 rounded-xl font-black uppercase text-[10px] tracking-widest shadow-glow"
            >
              Save Changes
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ClientManageDialog;
