import React, { useState, useEffect } from 'react';
import { Rocket, Mic, Code, Wrench, FileText } from 'lucide-react';
import { toast } from 'sonner';

const FlowTemplatesView = () => {
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
    const { collection, addDoc } = await import("firebase/firestore");
    const { db } = await import("@/lib/firebase");
    try {
      await addDoc(collection(db, "flows"), {
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
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Flow Templates</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {templates.map((template) => (
          <div key={template.id} className="bg-white/5 p-6 rounded-lg flex items-start space-x-4">
            <div className="bg-white/10 p-3 rounded-lg">
              {getTemplateIcon(template.title)}
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-white">{template.title}</h3>
              <p className="text-sm text-white/50">{template.description}</p>
              <button
                className="mt-4 bg-accent text-white px-4 py-2 rounded-lg text-sm font-bold"
                onClick={() => handleClone(template)}
              >
                Clone
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FlowTemplatesView;
