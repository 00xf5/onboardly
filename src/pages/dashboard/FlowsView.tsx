import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { PageLoader } from '@/components/Loader';

const FlowsView = ({ user }: { user: any }) => {
  const [flows, setFlows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) return;

    const syncFlows = async () => {
      const { collection, query, where, onSnapshot } = await import("firebase/firestore");
      const { db } = await import("@/lib/firebase");

      const q = query(collection(db, "flows"), where("userId", "==", user.id));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        setFlows(snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })));
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
  }, []);

  if (loading) return <PageLoader />;

  return (
    <div className="bg-card/95 dark:bg-card/40 backdrop-blur-xl p-8 rounded-2xl border border-border shadow-lg animate-in fade-in duration-500">
      <h2 className="text-sm font-black text-foreground uppercase tracking-widest mb-6">Active Activation Blueprints</h2>
      <div className="grid gap-4">
        {flows.map((flow) => (
          <div key={flow.id} className="bg-muted/50 p-5 rounded-2xl border border-border/10 flex items-center justify-between group hover:border-accent/30 transition-all duration-300">
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-foreground group-hover:text-accent transition-colors">{flow.name}</h3>
              <div className="flex items-center gap-2">
                <span className={`w-1.5 h-1.5 rounded-full ${flow.status === 'active' ? 'bg-success animate-pulse' : 'bg-warning'}`} />
                <span className={`text-[10px] font-black uppercase tracking-widest ${flow.status === 'active' ? 'text-success' : 'text-warning'}`}>{flow.status}</span>
              </div>
            </div>
            <Button asChild variant="ghost" size="sm" className="h-9 px-4 rounded-xl text-[10px] font-black uppercase tracking-widest border border-border/10 hover:bg-accent hover:text-white transition-all">
              <Link to="/dashboard/visual-flow-editor">
                Initialize <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FlowsView;
