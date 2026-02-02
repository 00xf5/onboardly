import React, { useState, useEffect } from 'react';
import { Rocket, Mic, Code, Wrench, FileText } from 'lucide-react';
import { toast } from 'sonner';

const FlowTemplatesView = ({ user }: { user: any }) => {
  const [templates, setTemplates] = useState<any[]>([]);

  useEffect(() => {
    const syncTemplates = async () => {
      const { collection, onSnapshot } = await import("firebase/firestore");
      const { db } = await import("@/lib/firebase");
      const unsubscribe = onSnapshot(collection(db, "templates"), (snapshot) => {
        setTemplates(snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })));
      });
      return unsubscribe;
    };
    let unsubscribe: any;
    syncTemplates().then(unsub => unsubscribe = unsub);
    return () => unsubscribe && unsubscribe();
  }, []);

  const handleClone = async (template: any) => {
    if (!user?.id) return;
    const { collection, addDoc } = await import("firebase/firestore");
    const { db } = await import("@/lib/firebase");
    try {
      await addDoc(collection(db, "flows"), {
        userId: user.id,
        name: `${template.title} Copy`,
        status: "active",
        createdAt: new Date().toISOString()
      });
      toast.success(`'${template.title}' flow cloned successfully.`);
    } catch (e) {
      toast.error('Failed to clone flow.');
    }
  };

  const getTemplateIcon = (title: string) => {
    if (title.toLowerCase().includes('enterprise')) return <Rocket className="w-6 h-6 text-accent" />;
    if (title.toLowerCase().includes('velocity')) return <Mic className="w-6 h-6 text-accent" />;
    if (title.toLowerCase().includes('standard')) return <FileText className="w-6 h-6 text-accent" />;
    return <Wrench className="w-6 h-6 text-accent" />;
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      <h2 className="text-sm font-black text-foreground uppercase tracking-widest mb-6">Inbound Sequence Blueprints</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {templates.map((template) => (
          <div key={template.id} className="bg-card/95 dark:bg-card/40 backdrop-blur-xl p-8 rounded-2xl border border-border flex flex-col hover:border-accent/40 transition-all duration-300 group shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 blur-3xl rounded-full -mr-16 -mt-16 pointer-events-none" />

            <div className="flex items-start gap-5 mb-6">
              <div className="bg-muted p-4 rounded-2xl group-hover:bg-accent/10 transition-colors shadow-sm">
                {getTemplateIcon(template.title)}
              </div>
              <div className="flex-1 pt-1">
                <h3 className="text-sm font-black text-foreground uppercase tracking-tight group-hover:text-accent transition-colors">{template.title}</h3>
                <p className="text-[11px] text-muted-foreground/50 mt-1 font-medium leading-relaxed italic">{template.description}</p>
              </div>
            </div>

            <button
              className="mt-auto w-full bg-accent text-white h-10 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-glow hover:bg-accent/90 transition-all active:scale-95"
              onClick={() => handleClone(template)}
            >
              Deploy Component
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FlowTemplatesView;
