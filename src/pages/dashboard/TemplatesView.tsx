import { useState, useEffect } from "react";
import { FileText, Plus, Trash2, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { store, Template } from "@/lib/store";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

export const TemplatesView = () => {
    const [templates, setTemplates] = useState<Template[]>([]);
    const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
    const [isAddTemplateDialogOpen, setIsAddTemplateDialogOpen] = useState(false);
    const [newTemplateTitle, setNewTemplateTitle] = useState("");
    const [newTaskTitle, setNewTaskTitle] = useState("");

    useEffect(() => {
        const allTemplates = store.getTemplates();
        setTemplates(allTemplates);
        if (!selectedTemplate && allTemplates.length > 0) {
            setSelectedTemplate(allTemplates[0]);
        }
    }, []);

    const handleAddTemplate = () => {
        if (!newTemplateTitle) return;
        const newTemplate = store.addTemplate({ title: newTemplateTitle, tasks: [] } as Omit<Template, 'id'>);
        setTemplates(store.getTemplates());
        setSelectedTemplate(newTemplate);
        setIsAddTemplateDialogOpen(false);
        setNewTemplateTitle("");
        toast.success("Template created");
    };

    const handleUpdateTemplateTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!selectedTemplate) return;
        const updatedTemplate = { ...selectedTemplate, title: e.target.value };
        setSelectedTemplate(updatedTemplate);
        store.updateTemplate(updatedTemplate);
    };

    const handleAddTask = () => {
        if (!selectedTemplate || !newTaskTitle) return;
        const updatedTemplate = {
            ...selectedTemplate,
            tasks: [...(selectedTemplate.tasks || []), { id: Date.now(), title: newTaskTitle }],
        };
        setSelectedTemplate(updatedTemplate);
        store.updateTemplate(updatedTemplate);
        setNewTaskTitle("");
    };

    const handleDeleteTask = (taskId: number | string) => {
        if (!selectedTemplate) return;
        const updatedTemplate = {
            ...selectedTemplate,
            tasks: selectedTemplate.tasks?.filter(task => task.id !== taskId),
        };
        setSelectedTemplate(updatedTemplate);
        store.updateTemplate(updatedTemplate);
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 h-full">
            <div className="md:col-span-1 bg-white/5 p-4 rounded-lg flex flex-col">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-bold">Templates</h2>
                    <Button variant="ghost" size="sm" onClick={() => setIsAddTemplateDialogOpen(true)}><Plus className="w-4 h-4" /></Button>
                </div>
                <div className="space-y-2 flex-1 overflow-y-auto">
                    {templates.map(template => (
                        <div 
                            key={template.id} 
                            className={`p-3 rounded-lg cursor-pointer ${selectedTemplate?.id === template.id ? 'bg-accent/20' : 'hover:bg-white/10'}`}
                            onClick={() => setSelectedTemplate(template)}
                        >
                            <h3 className="font-bold text-sm">{template.title}</h3>
                            <p className="text-xs text-white/50">{template.tasks?.length || 0} tasks</p>
                        </div>
                    ))}
                </div>
            </div>
            <div className="md:col-span-3 bg-white/5 p-6 rounded-lg">
                {selectedTemplate ? (
                    <div>
                        <Input className="text-2xl font-bold bg-transparent border-none p-0 focus:ring-0" value={selectedTemplate.title} onChange={handleUpdateTemplateTitle} />
                        <p className="text-white/50 mt-2">Manage the tasks for this template.</p>
                        
                        <div className="mt-6 space-y-2">
                            {selectedTemplate.tasks?.map(task => (
                                <div key={task.id} className="flex items-center justify-between bg-white/10 p-3 rounded-lg">
                                    <p>{task.title}</p>
                                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => handleDeleteTask(task.id)}><Trash2 className="w-3 h-3" /></Button>
                                </div>
                            ))}
                        </div>

                        <div className="mt-4 flex space-x-2">
                            <Input placeholder="Add a new task..." value={newTaskTitle} onChange={(e) => setNewTaskTitle(e.target.value)} className="bg-white/10 border-white/20" />
                            <Button onClick={handleAddTask}>Add Task</Button>
                        </div>
                    </div>
                ) : (
                    <div className="flex items-center justify-center h-full">
                        <p className="text-white/50">Select a template to view its details or create a new one.</p>
                    </div>
                )}
            </div>

            <Dialog open={isAddTemplateDialogOpen} onOpenChange={setIsAddTemplateDialogOpen}>
                <DialogContent className="sm:max-w-[425px] bg-[#1a1b23] border-white/5 text-white">
                    <DialogHeader>
                        <DialogTitle>Create New Template</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="name" className="text-right">Title</Label>
                            <Input id="name" value={newTemplateTitle} onChange={(e) => setNewTemplateTitle(e.target.value)} className="col-span-3 bg-white/5 border-white/10" />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="submit" onClick={handleAddTemplate}>Create</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};
