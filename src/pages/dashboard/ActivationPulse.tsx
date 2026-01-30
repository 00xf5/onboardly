import { ArrowUp, ArrowDown } from 'lucide-react';

import { Analytics } from '@/lib/store';

const ActivationPulse = ({ analytics }: { analytics: Analytics }) => {
  const activationRate = analytics.funnel.find(step => step.name === 'Activated')?.count || 0;

  const stats = [
    {
      label: 'Activation Rate',
      value: `${activationRate}%`,
      trend: '+6% WoW',
      trendDirection: 'up',
    },
    {
      label: 'Avg Time to Activate',
      value: '1d 4h',
      trend: '-3h',
      trendDirection: 'down',
    },
    {
      label: 'Drop-off Risk',
      value: 'HIGH',
      trend: '2 steps failing',
      trendDirection: 'up',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      {stats.map((stat, index) => (
        <div key={index} className="bg-white/5 p-6 rounded-lg">
          <p className="text-sm text-white/50 mb-2">{stat.label}</p>
          <p className="text-4xl font-bold text-white">{stat.value}</p>
          <div className="flex items-center text-sm mt-2">
            {stat.trendDirection === 'up' ? (
              <ArrowUp className={`w-4 h-4 ${stat.label === 'Drop-off Risk' ? 'text-red-500' : 'text-green-500'}`} />
            ) : (
              <ArrowDown className="w-4 h-4 text-green-500" />
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
