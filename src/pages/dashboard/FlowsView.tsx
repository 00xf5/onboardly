import { useState, useEffect } from 'react';
import { store, Flow } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const FlowsView = () => {
  const [flows, setFlows] = useState<Flow[]>([]);

  useEffect(() => {
    setFlows(store.getFlows('default-proj'));
    const handler = () => setFlows(store.getFlows('default-proj'));
    window.addEventListener('onboardly:flows:updated', handler as EventListener);
    return () => window.removeEventListener('onboardly:flows:updated', handler as EventListener);
  }, []);

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
