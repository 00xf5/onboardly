import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { PageLoader } from '@/components/Loader';

const FlowsView = () => {
  const [flows, setFlows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const syncFlows = async () => {
      const { collection, query, onSnapshot } = await import("firebase/firestore");
      const { db } = await import("@/lib/firebase");

      const q = query(collection(db, "flows"));
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
    <div className="bg-white/5 p-6 rounded-lg">
      <h2 className="text-lg font-bold text-white mb-4">Flows</h2>
      <div className="space-y-3">
        {flows.map((flow) => (
          <div key={flow.id} className="bg-white/10 p-4 rounded-lg flex items-center justify-between">
            <div>
              <h3 className="font-bold text-white">{flow.name}</h3>
              <span className={`text-xs font-bold uppercase ${flow.status === 'active' ? 'text-green-400' : 'text-yellow-400'}`}>{flow.status}</span>
            </div>
            <Button asChild variant="ghost" size="sm">
              <Link to="/dashboard/visual-flow-editor">
                Manage <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FlowsView;
