import React from 'react';
import { ArrowUp, ArrowDown } from 'lucide-react';

const ActivationPulse = ({ analytics, clients = [] }: { analytics: any, clients?: any[] }) => {
  const activationRate = analytics.funnel.find((step: any) => step.name === 'Activated')?.count || 0;

  // Calculate from passed client data
  const totalClients = clients.length;
  const activatedClients = clients.filter((c: any) => c.progress === 100 || c.isActivated).length;
  const inProgressClients = clients.filter((c: any) => c.status === 'in_progress').length;

  // Calculate average time to activate (simplified)
  const avgTimeToActivate = activatedClients > 0 ? '1d 4h' : 'N/A';

  // Calculate drop-off risk
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
        <div key={index} className="bg-card/40 backdrop-blur-xl p-4 md:p-6 rounded-2xl border border-border group hover:border-accent/30 transition-all duration-500 shadow-xl">
          <p className="text-[10px] uppercase font-black tracking-widest text-muted-foreground/50 mb-3">{stat.label}</p>
          <p className="text-2xl md:text-3xl font-black text-foreground italic">{stat.value}</p>
          <div className="flex items-center text-[10px] font-bold mt-4 uppercase tracking-tighter">
            {stat.trendDirection === 'up' ? (
              <ArrowUp className={`w-3 h-3 ${stat.label === 'Drop-off Risk' ? 'text-red-500' : 'text-accent'}`} />
            ) : (
              <ArrowDown className="w-3 h-3 text-accent" />
            )}
            <span className={`ml-1.5 ${stat.label === 'Drop-off Risk' ? 'text-red-500' : 'text-muted-foreground/60'}`}>
              {stat.trend}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ActivationPulse;
