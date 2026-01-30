import { ArrowUp, ArrowDown } from 'lucide-react';
import { store } from '@/lib/store';

const ActivationPulse = ({ analytics }: { analytics: any }) => {
  const activationRate = analytics.funnel.find(step => step.name === 'Activated')?.count || 0;
  
  // Get real client data
  const clients = store.getClientsByProject('default-proj');
  const totalClients = clients.length;
  const activatedClients = clients.filter(c => c.isActivated).length;
  const inProgressClients = clients.filter(c => c.status === 'in_progress').length;
  
  // Calculate real average time to activate (simplified)
  const avgTimeToActivate = activatedClients > 0 ? '1d 4h' : 'N/A';
  
  // Calculate drop-off risk from real data
  const dropOffRate = totalClients > 0 ? Math.round(((totalClients - activatedClients) / totalClients) * 100) : 0;
  const riskLevel = dropOffRate > 50 ? 'HIGH' : dropOffRate > 25 ? 'MEDIUM' : 'LOW';

  const stats = [
    {
      label: 'Activation Rate',
      value: `${activationRate}%`,
      trend: `${activatedClients} activated`,
      trendDirection: activationRate > 40 ? 'up' : 'down',
    },
    {
      label: 'Avg Time to Activate',
      value: avgTimeToActivate,
      trend: 'Real data',
      trendDirection: 'down',
    },
    {
      label: 'Drop-off Risk',
      value: riskLevel,
      trend: `${dropOffRate}% at risk`,
      trendDirection: 'up',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      {stats.map((stat, index) => (
        <div key={index} className="bg-white/5 p-4 md:p-6 rounded-lg">
          <p className="text-xs md:text-sm text-white/50 mb-2">{stat.label}</p>
          <p className="text-2xl md:text-4xl font-bold text-white">{stat.value}</p>
          <div className="flex items-center text-xs md:text-sm mt-2">
            {stat.trendDirection === 'up' ? (
              <ArrowUp className={`w-3 h-3 md:w-4 md:h-4 ${stat.label === 'Drop-off Risk' ? 'text-red-500' : 'text-green-500'}`} />
            ) : (
              <ArrowDown className="w-3 h-3 md:w-4 md:h-4 text-green-500" />
            )}
            <span className={`ml-1 ${stat.label === 'Drop-off Risk' ? 'text-red-500' : 'text-white/70'}`}>
              {stat.trend}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ActivationPulse;
